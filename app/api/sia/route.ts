import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createSiaSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  description: z.string().optional(),
  domain: z.string().optional(),
  dataTypes: z.array(z.string()).optional(),
  decisionType: z.enum(['INFORMATIVE', 'RECOMMENDATION', 'ASSISTED_DECISION', 'AUTO_DECISION']).optional(),
  populations: z.array(z.string()).optional(),
  hasVulnerable: z.boolean().nullable().optional(),
  scale: z.enum(['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'VERY_LARGE']).optional(),
})

// GET /api/sia - List all SIAs for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const sias = await db.sia.findMany({
      where: {
        ownerId: session.user.id,
      },
      include: {
        tensions: {
          select: {
            status: true,
          },
        },
        actions: {
          select: {
            status: true,
          },
        },
        _count: {
          select: {
            nodes: true,
            edges: true,
            tensions: true,
            actions: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Calculate vigilance scores for each SIA
    const siasWithScores = sias.map((sia) => ({
      ...sia,
      stats: {
        nodes: sia._count.nodes,
        edges: sia._count.edges,
        tensions: sia._count.tensions,
        actions: sia._count.actions,
      },
    }))

    return NextResponse.json(siasWithScores)
  } catch (error) {
    console.error('Error fetching SIAs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des SIA' },
      { status: 500 }
    )
  }
}

// POST /api/sia - Create a new SIA
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createSiaSchema.parse(body)

    const sia = await db.sia.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        domain: validatedData.domain,
        dataTypes: validatedData.dataTypes || [],
        decisionType: validatedData.decisionType || 'INFORMATIVE',
        populations: validatedData.populations || [],
        hasVulnerable: validatedData.hasVulnerable || false,
        scale: validatedData.scale || 'LOCAL',
        status: 'DRAFT',
        ownerId: session.user.id,
        vigilanceScores: {
          global: 0,
          domains: {
            PRIVACY: 0,
            EQUITY: 0,
            TRANSPARENCY: 0,
            AUTONOMY: 0,
            SECURITY: 0,
            RECOURSE: 0,
            SUSTAINABILITY: 0,
            ACCOUNTABILITY: 0,
          },
        },
      },
    })

    return NextResponse.json(sia, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating SIA:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du SIA' },
      { status: 500 }
    )
  }
}

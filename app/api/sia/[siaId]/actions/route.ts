import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// GET /api/sia/[siaId]/actions - List all actions for a SIA
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { siaId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Check ownership
    const sia = await db.sia.findFirst({
      where: {
        id: siaId,
        ownerId: session.user.id,
      },
    })

    if (!sia) {
      return NextResponse.json(
        { error: 'SIA non trouvé' },
        { status: 404 }
      )
    }

    const actions = await db.action.findMany({
      where: { siaId },
      include: {
        tension: {
          select: {
            id: true,
            description: true,
            primaryDomain: true,
            secondaryDomain: true,
          },
        },
        evidences: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(actions)
  } catch (error) {
    console.error('Error fetching actions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

const createActionSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  category: z
    .enum([
      'MINIMIZATION',
      'TRANSPARENCY',
      'HUMAN_CONTROL',
      'RECOURSE',
      'TECHNICAL',
      'ORGANIZATIONAL',
      'DESIGN',
      'AUDIT',
    ])
    .default('TECHNICAL'),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
  tensionId: z.string().optional(),
})

// POST /api/sia/[siaId]/actions - Create a new action
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { siaId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Check ownership
    const sia = await db.sia.findFirst({
      where: {
        id: siaId,
        ownerId: session.user.id,
      },
    })

    if (!sia) {
      return NextResponse.json(
        { error: 'SIA non trouvé' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = createActionSchema.parse(body)

    const action = await db.action.create({
      data: {
        siaId,
        title: validatedData.title,
        description: validatedData.description || '',
        priority: validatedData.priority,
        category: validatedData.category,
        status: 'PENDING',
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        assignee: validatedData.assignee || null,
        tensionId: validatedData.tensionId || null,
      },
      include: {
        tension: {
          select: {
            id: true,
            description: true,
            primaryDomain: true,
            secondaryDomain: true,
          },
        },
        evidences: true,
      },
    })

    return NextResponse.json(action, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating action:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}

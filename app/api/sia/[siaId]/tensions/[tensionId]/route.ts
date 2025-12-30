import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { TENSION_PATTERNS, TensionPatternId } from '@/lib/constants/tension-patterns'
import { ACTION_TEMPLATES } from '@/lib/constants/action-templates'

// GET /api/sia/[siaId]/tensions/[tensionId] - Get a specific tension
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string; tensionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { siaId, tensionId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Check ownership or membership
    const sia = await db.sia.findFirst({
      where: {
        id: siaId,
        OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      },
    })

    if (!sia) {
      return NextResponse.json(
        { error: 'SIA non trouvé' },
        { status: 404 }
      )
    }

    const tension = await db.tension.findUnique({
      where: {
        id: tensionId,
        siaId,
      },
      include: {
        tensionEdges: {
          include: {
            edge: {
              include: {
                source: true,
                target: true,
              },
            },
          },
        },
        arbitration: true,
        actions: {
          orderBy: { priority: 'desc' },
        },
      },
    })

    if (!tension) {
      return NextResponse.json(
        { error: 'Tension non trouvée' },
        { status: 404 }
      )
    }

    // Enrich with pattern info
    const pattern = TENSION_PATTERNS[tension.pattern as TensionPatternId]

    // Get suggested measures from pattern
    const suggestedMeasures = (pattern?.defaultActions || []).map((actionId) => {
      const template = ACTION_TEMPLATES[actionId]
      return template ? {
        id: actionId,
        title: template.title,
        description: template.description,
        category: template.category,
        effort: template.effort,
      } : null
    }).filter(Boolean)

    return NextResponse.json({
      ...tension,
      patternTitle: pattern?.title || tension.pattern,
      patternDescription: pattern?.description || tension.description,
      poles: pattern?.poles || [],
      arbitrationQuestions: pattern?.arbitrationQuestions || [],
      suggestedMeasures,
      amplifiers: pattern?.amplifiers || [],
      mitigators: pattern?.mitigators || [],
    })
  } catch (error) {
    console.error('Error fetching tension:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

const updateTensionSchema = z.object({
  status: z.nativeEnum({
    DETECTED: 'DETECTED',
    QUALIFIED: 'QUALIFIED',
    IN_PROGRESS: 'IN_PROGRESS',
    ARBITRATED: 'ARBITRATED',
    RESOLVED: 'RESOLVED',
    DISMISSED: 'DISMISSED',
  } as const).optional(),
  description: z.string().optional(),
})

// PUT /api/sia/[siaId]/tensions/[tensionId] - Update a tension
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string; tensionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { siaId, tensionId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Check ownership or membership
    const sia = await db.sia.findFirst({
      where: {
        id: siaId,
        OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      },
    })

    if (!sia) {
      return NextResponse.json(
        { error: 'SIA non trouvé' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = updateTensionSchema.parse(body)

    const tension = await db.tension.update({
      where: {
        id: tensionId,
        siaId,
      },
      data: validatedData,
    })

    return NextResponse.json(tension)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating tension:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

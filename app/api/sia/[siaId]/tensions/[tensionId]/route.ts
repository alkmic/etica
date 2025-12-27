import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

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

    // Check ownership
    const sia = await db.sia.findUnique({
      where: {
        id: siaId,
        userId: session.user.id,
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
        edges: {
          include: {
            edge: {
              include: {
                sourceNode: true,
                targetNode: true,
              },
            },
          },
        },
        arbitrations: {
          orderBy: { createdAt: 'desc' },
        },
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

    return NextResponse.json(tension)
  } catch (error) {
    console.error('Error fetching tension:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

const updateTensionSchema = z.object({
  status: z.enum(['ACTIVE', 'OPEN', 'RESOLVED', 'ACCEPTED', 'MITIGATED']).optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
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

    // Check ownership
    const sia = await db.sia.findUnique({
      where: {
        id: siaId,
        userId: session.user.id,
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

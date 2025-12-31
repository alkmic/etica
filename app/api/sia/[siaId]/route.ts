import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { db } from '@/lib/db'
import { z } from 'zod'

const updateSiaSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  domain: z.enum(['HEALTH', 'FINANCE', 'HR', 'COMMERCE', 'JUSTICE', 'ADMINISTRATION', 'EDUCATION', 'TRANSPORT', 'SECURITY', 'MARKETING', 'OTHER']).optional(),
  dataTypes: z.array(z.string()).optional(),
  decisionType: z.enum(['INFORMATIVE', 'RECOMMENDATION', 'ASSISTED_DECISION', 'AUTO_DECISION']).optional(),
  populations: z.array(z.string()).optional(),
  hasVulnerable: z.boolean().optional(),
  scale: z.enum(['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'VERY_LARGE']).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'REVIEW', 'ARCHIVED']).optional(),
})

// GET /api/sia/[siaId] - Get a specific SIA with all details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string }> }
) {
  try {
    const session = await auth()
    const { siaId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const sia = await db.sia.findFirst({
      where: {
        id: siaId,
        OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      },
      include: {
        nodes: true,
        edges: {
          include: {
            source: true,
            target: true,
          },
        },
        tensions: {
          include: {
            edges: {
              include: {
                edge: true,
              },
            },
            arbitrations: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        },
        actions: {
          include: {
            tension: true,
            evidences: true,
          },
        },
        versions: {
          orderBy: {
            version: 'desc',
          },
          take: 5,
        },
      },
    })

    if (!sia) {
      return NextResponse.json(
        { error: 'SIA non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(sia)
  } catch (error) {
    console.error('Error fetching SIA:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du SIA' },
      { status: 500 }
    )
  }
}

// PUT /api/sia/[siaId] - Update a SIA
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string }> }
) {
  try {
    const session = await auth()
    const { siaId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Check ownership or membership
    const existingSia = await db.sia.findFirst({
      where: {
        id: siaId,
        OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      },
    })

    if (!existingSia) {
      return NextResponse.json(
        { error: 'SIA non trouvé' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = updateSiaSchema.parse(body)

    const updatedSia = await db.sia.update({
      where: { id: siaId },
      data: validatedData,
    })

    return NextResponse.json(updatedSia)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating SIA:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du SIA' },
      { status: 500 }
    )
  }
}

// DELETE /api/sia/[siaId] - Delete a SIA
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string }> }
) {
  try {
    const session = await auth()
    const { siaId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Check ownership or membership
    const existingSia = await db.sia.findFirst({
      where: {
        id: siaId,
        OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      },
    })

    if (!existingSia) {
      return NextResponse.json(
        { error: 'SIA non trouvé' },
        { status: 404 }
      )
    }

    await db.sia.delete({
      where: { id: siaId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting SIA:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du SIA' },
      { status: 500 }
    )
  }
}

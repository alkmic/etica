import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// GET /api/sia/[siaId]/actions/[actionId] - Get a specific action
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string; actionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { siaId, actionId } = await params

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

    const action = await db.action.findFirst({
      where: {
        id: actionId,
        siaId,
      },
      include: {
        tension: true,
        evidences: true,
      },
    })

    if (!action) {
      return NextResponse.json(
        { error: 'Action non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(action)
  } catch (error) {
    console.error('Error fetching action:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

const updateActionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  category: z
    .enum([
      'MINIMIZATION',
      'TRANSPARENCY',
      'HUMAN_CONTROL',
      'RECOURSE',
      'TECHNICAL',
      'ORGANIZATIONAL',
      'DESIGN',
      'CONTRACTUAL',
      'DOCUMENTATION',
      'AUDIT',
    ])
    .optional(),
  dueDate: z.string().nullable().optional(),
  assignee: z.string().nullable().optional(),
})

// PUT /api/sia/[siaId]/actions/[actionId] - Update an action
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string; actionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { siaId, actionId } = await params

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
    const validatedData = updateActionSchema.parse(body)

    // Handle date conversion and field mapping
    const updateData: Record<string, unknown> = {}

    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title
    }
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description
    }
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status
      // Set completedAt when status changes to DONE
      if (validatedData.status === 'DONE') {
        updateData.completedAt = new Date()
      } else {
        updateData.completedAt = null
      }
    }
    if (validatedData.priority !== undefined) {
      updateData.priority = validatedData.priority
    }
    if (validatedData.category !== undefined) {
      updateData.category = validatedData.category
    }
    if (validatedData.dueDate !== undefined) {
      updateData.dueDate = validatedData.dueDate ? new Date(validatedData.dueDate) : null
    }
    // Note: assignee is stored as a string in the description for now
    // since assigneeId requires a valid User ID

    const action = await db.action.update({
      where: {
        id: actionId,
      },
      data: updateData,
    })

    return NextResponse.json(action)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating action:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

// DELETE /api/sia/[siaId]/actions/[actionId] - Delete an action
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string; actionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { siaId, actionId } = await params

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

    await db.action.delete({
      where: {
        id: actionId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting action:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}

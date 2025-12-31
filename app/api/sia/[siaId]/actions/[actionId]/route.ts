import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { db } from '@/lib/db'
import { z } from 'zod'

// GET /api/sia/[siaId]/actions/[actionId] - Get a specific action
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string; actionId: string }> }
) {
  try {
    const session = await auth()
    const { siaId, actionId } = await params

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

    const action = await db.action.findUnique({
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
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
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
    const session = await auth()
    const { siaId, actionId } = await params

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
    const validatedData = updateActionSchema.parse(body)

    // Handle date conversion
    const updateData: Record<string, unknown> = { ...validatedData }
    if (validatedData.dueDate !== undefined) {
      updateData.dueDate = validatedData.dueDate ? new Date(validatedData.dueDate) : null
    }

    const action = await db.action.update({
      where: {
        id: actionId,
        siaId,
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
    const session = await auth()
    const { siaId, actionId } = await params

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

    await db.action.delete({
      where: {
        id: actionId,
        siaId,
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

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const createArbitrationSchema = z.object({
  decision: z.enum(['ACCEPT', 'MITIGATE', 'REJECT']),
  justification: z.string().min(10, 'La justification doit faire au moins 10 caractères'),
})

// POST /api/sia/[siaId]/tensions/[tensionId]/arbitrations - Create a new arbitration
export async function POST(
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
    const sia = await db.sia.findFirst({
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

    // Check tension exists
    const tension = await db.tension.findFirst({
      where: {
        id: tensionId,
        siaId,
      },
    })

    if (!tension) {
      return NextResponse.json(
        { error: 'Tension non trouvée' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = createArbitrationSchema.parse(body)

    // Create arbitration and update tension status
    const arbitration = await db.$transaction(async (tx) => {
      const newArbitration = await tx.arbitration.create({
        data: {
          tensionId,
          decision: validatedData.decision,
          justification: validatedData.justification,
          createdBy: session.user!.id,
        },
      })

      // Update tension status based on decision
      let newStatus = tension.status
      if (validatedData.decision === 'ACCEPT') {
        newStatus = 'ACCEPTED'
      } else if (validatedData.decision === 'MITIGATE') {
        newStatus = 'MITIGATED'
      } else if (validatedData.decision === 'REJECT') {
        newStatus = 'RESOLVED'
      }

      await tx.tension.update({
        where: { id: tensionId },
        data: { status: newStatus },
      })

      return newArbitration
    })

    return NextResponse.json(arbitration, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating arbitration:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}

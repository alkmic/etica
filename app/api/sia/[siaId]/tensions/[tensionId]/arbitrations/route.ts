import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { ArbitrationDecision, TensionStatus, ActionCategory, Priority } from '@prisma/client'
import { ACTION_TEMPLATES } from '@/lib/constants/action-templates'
import { TENSION_PATTERNS, TensionPatternId } from '@/lib/constants/tension-patterns'

// ============================================
// VALIDATION SCHEMAS
// ============================================

const arbitrationSchema = z.object({
  decisionType: z.nativeEnum(ArbitrationDecision),
  justification: z.string().min(20, 'La justification doit faire au moins 20 caractères'),

  // Pour MITIGATE: mesures sélectionnées
  selectedMeasures: z.array(z.string()).optional(),

  // Pour ACCEPT_RISK: analyse bénéfice/risque
  benefitAnalysis: z.string().optional(),
  riskAcceptance: z.string().optional(),

  // Pour REJECT: explication
  rejectionReason: z.string().optional(),

  // Détails supplémentaires optionnels
  proportionality: z.string().optional(),
  contestability: z.string().optional(),
  revisionConditions: z.string().optional(),
  compensatoryMeasures: z.string().optional(),

  // Date de prochaine révision
  nextReviewDate: z.string().optional(),
})

// ============================================
// POST - Create a new arbitration
// ============================================

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

    // Check tension exists
    const tension = await db.tension.findUnique({
      where: {
        id: tensionId,
        siaId,
      },
      include: {
        arbitration: true,
      }
    })

    if (!tension) {
      return NextResponse.json(
        { error: 'Tension non trouvée' },
        { status: 404 }
      )
    }

    // Check if arbitration already exists
    if (tension.arbitration) {
      return NextResponse.json(
        { error: 'Cette tension a déjà été arbitrée. Utilisez PUT pour modifier.' },
        { status: 409 }
      )
    }

    const body = await request.json()
    const validatedData = arbitrationSchema.parse(body)

    // Validation spécifique selon le type de décision
    if (validatedData.decisionType === 'MITIGATE') {
      if (!validatedData.selectedMeasures || validatedData.selectedMeasures.length === 0) {
        return NextResponse.json(
          { error: 'Au moins une mesure doit être sélectionnée pour mitiger la tension' },
          { status: 400 }
        )
      }
    } else if (validatedData.decisionType === 'ACCEPT_RISK') {
      if (!validatedData.benefitAnalysis) {
        return NextResponse.json(
          { error: 'L\'analyse bénéfice/risque est requise pour accepter le risque' },
          { status: 400 }
        )
      }
    } else if (validatedData.decisionType === 'REJECT') {
      if (!validatedData.rejectionReason) {
        return NextResponse.json(
          { error: 'Une raison de rejet est requise' },
          { status: 400 }
        )
      }
    }

    // Create arbitration and update tension status + generate actions
    const result = await db.$transaction(async (tx) => {
      // Create the arbitration
      const arbitration = await tx.arbitration.create({
        data: {
          tensionId,
          decisionType: validatedData.decisionType,
          justification: validatedData.justification,
          selectedMeasures: validatedData.selectedMeasures || [],
          benefitAnalysis: validatedData.benefitAnalysis || null,
          riskAcceptance: validatedData.riskAcceptance || null,
          rejectionReason: validatedData.rejectionReason || null,
          proportionality: validatedData.proportionality || null,
          contestability: validatedData.contestability || null,
          revisionConditions: validatedData.revisionConditions || null,
          compensatoryMeasures: validatedData.compensatoryMeasures || null,
          arbitratedById: session.user!.id,
          arbitratedAt: new Date(),
          nextReviewDate: validatedData.nextReviewDate
            ? new Date(validatedData.nextReviewDate)
            : null,
        },
      })

      // Update tension status based on decision
      let newStatus: TensionStatus = 'ARBITRATED'
      if (validatedData.decisionType === 'REJECT') {
        newStatus = 'DISMISSED'
      } else if (validatedData.decisionType === 'MITIGATE') {
        newStatus = 'IN_PROGRESS'
      }

      await tx.tension.update({
        where: { id: tensionId },
        data: { status: newStatus },
      })

      // Generate actions if MITIGATE was chosen
      const createdActions: any[] = []

      if (validatedData.decisionType === 'MITIGATE' && validatedData.selectedMeasures) {
        // Get pattern info for priority calculation
        const pattern = TENSION_PATTERNS[tension.pattern as TensionPatternId]
        const severity = tension.calculatedSeverity || tension.baseSeverity || 3

        // Convert severity to priority
        let priority: Priority = 'MEDIUM'
        if (severity >= 5) priority = 'CRITICAL'
        else if (severity >= 4) priority = 'HIGH'
        else if (severity <= 2) priority = 'LOW'

        for (const measureId of validatedData.selectedMeasures) {
          const template = ACTION_TEMPLATES[measureId]

          if (template) {
            const action = await tx.action.create({
              data: {
                siaId,
                tensionId,
                title: template.title,
                description: template.description,
                category: template.category as ActionCategory,
                priority,
                effort: template.effort as any,
                status: 'TODO',
                estimatedImpact: template.estimatedImpact || null,
                checklist: template.checklist || null,
                templateId: measureId,
                sourceRule: 'arbitration-generated',
              },
            })
            createdActions.push(action)
          }
        }
      }

      return { arbitration, actionsCreated: createdActions.length }
    })

    return NextResponse.json({
      arbitration: result.arbitration,
      actionsCreated: result.actionsCreated,
      message: result.actionsCreated > 0
        ? `Arbitrage enregistré et ${result.actionsCreated} action(s) créée(s)`
        : 'Arbitrage enregistré',
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating arbitration:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'arbitrage' },
      { status: 500 }
    )
  }
}

// ============================================
// PUT - Update an existing arbitration
// ============================================

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

    // Check tension and arbitration exist
    const tension = await db.tension.findUnique({
      where: {
        id: tensionId,
        siaId,
      },
      include: {
        arbitration: true,
      }
    })

    if (!tension) {
      return NextResponse.json(
        { error: 'Tension non trouvée' },
        { status: 404 }
      )
    }

    if (!tension.arbitration) {
      return NextResponse.json(
        { error: 'Aucun arbitrage existant. Utilisez POST pour créer.' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = arbitrationSchema.parse(body)

    // Update arbitration
    const arbitration = await db.arbitration.update({
      where: { id: tension.arbitration.id },
      data: {
        decisionType: validatedData.decisionType,
        justification: validatedData.justification,
        selectedMeasures: validatedData.selectedMeasures || [],
        benefitAnalysis: validatedData.benefitAnalysis || null,
        riskAcceptance: validatedData.riskAcceptance || null,
        rejectionReason: validatedData.rejectionReason || null,
        proportionality: validatedData.proportionality || null,
        contestability: validatedData.contestability || null,
        revisionConditions: validatedData.revisionConditions || null,
        compensatoryMeasures: validatedData.compensatoryMeasures || null,
        nextReviewDate: validatedData.nextReviewDate
          ? new Date(validatedData.nextReviewDate)
          : null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(arbitration)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating arbitration:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'arbitrage' },
      { status: 500 }
    )
  }
}

// ============================================
// GET - Get arbitration for a tension
// ============================================

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

    const tension = await db.tension.findFirst({
      where: {
        id: tensionId,
        siaId,
        sia: {
          OR: [
            { ownerId: session.user.id },
            { members: { some: { userId: session.user.id } } }
          ]
        }
      },
      include: {
        arbitration: true,
      }
    })

    if (!tension) {
      return NextResponse.json(
        { error: 'Tension non trouvée' },
        { status: 404 }
      )
    }

    if (!tension.arbitration) {
      return NextResponse.json(
        { error: 'Aucun arbitrage pour cette tension' },
        { status: 404 }
      )
    }

    // Get pattern info for UI
    const pattern = TENSION_PATTERNS[tension.pattern as TensionPatternId]

    return NextResponse.json({
      arbitration: tension.arbitration,
      tension: {
        id: tension.id,
        pattern: tension.pattern,
        patternTitle: pattern?.title || tension.pattern,
        patternDescription: pattern?.description || tension.description,
        suggestedMeasures: pattern?.defaultActions || [],
        arbitrationQuestions: pattern?.arbitrationQuestions || [],
      }
    })

  } catch (error) {
    console.error('Error fetching arbitration:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'arbitrage' },
      { status: 500 }
    )
  }
}

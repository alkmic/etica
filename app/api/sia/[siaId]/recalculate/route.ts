import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { calculateVigilanceScores } from '@/lib/scoring/vigilance'
import { detectDilemmas, buildEvaluationContext } from '@/lib/rules/detection-engine'

export const dynamic = 'force-dynamic'

// POST /api/sia/[siaId]/recalculate - Recalculate vigilance scores and detect dilemmas
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { siaId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorise' },
        { status: 401 }
      )
    }

    // Get full SIA with all related data
    const sia = await db.sia.findFirst({
      where: {
        id: siaId,
        ownerId: session.user.id,
      },
      include: {
        nodes: true,
        edges: true,
        tensions: {
          include: {
            arbitration: true,
          },
        },
        actions: true,
      },
    })

    if (!sia) {
      return NextResponse.json(
        { error: 'SIA non trouve' },
        { status: 404 }
      )
    }

    // ========================================
    // STEP 1: Detect new dilemmas using the detection engine
    // ========================================
    const evalContext = buildEvaluationContext(
      {
        id: sia.id,
        name: sia.name,
        sector: sia.sector,           // Using sector (not domain)
        decisionType: sia.decisionType,
        hasVulnerable: sia.hasVulnerable,
        userScale: sia.userScale,     // Using userScale (not scale)
        dataTypes: sia.dataTypes,
        populations: sia.populations,
        hasExternalAI: sia.hasExternalAI,
        hasExternalInfra: sia.hasExternalInfra,
        externalProviders: sia.externalProviders,
        misuseScenarios: sia.misuseScenarios,
        nextReviewDate: sia.nextReviewDate,
      },
      sia.nodes.map(n => ({
        id: n.id,
        type: n.type,
        subtype: n.subtype,
        label: n.label,
        attributes: n.attributes as Record<string, unknown>,
        reinforcesDomains: n.reinforcesDomains,
        affectsDomains: n.affectsDomains,
      })),
      sia.edges.map(e => ({
        id: e.id,
        sourceId: e.sourceId,
        targetId: e.targetId,
        nature: e.nature,
        intent: e.intent || undefined,
        dataCategories: e.dataCategories,
        sensitivity: e.sensitivity || undefined,
        automation: e.automation || undefined,
        isReversible: e.isReversible,
      }))
    )

    const detectedDilemmas = detectDilemmas(
      evalContext.sia,
      evalContext.nodes,
      evalContext.edges
    )

    // Save new dilemmas (without duplicating existing ones)
    const existingRuleIds = new Set(sia.tensions.map(t => t.ruleId))

    const newDilemmas = detectedDilemmas.filter(d => !existingRuleIds.has(d.ruleId))

    if (newDilemmas.length > 0) {
      await db.tension.createMany({
        data: newDilemmas.map(d => ({
          siaId: sia.id,
          ruleId: d.ruleId,
          ruleName: d.ruleName,
          ruleFamily: d.ruleFamily,
          domainA: d.domainA,
          domainB: d.domainB,
          formulation: d.formulation,
          mechanism: d.mechanism,
          severity: Math.round(d.severity),
          affectedNodeIds: d.affectedNodeIds,
          affectedEdgeIds: d.affectedEdgeIds,
          aggravatingFactors: d.aggravatingFactors,
          mitigatingFactors: d.mitigatingFactors,
          questionsToConsider: d.questionsToConsider,
          stakeholdersToConsult: d.stakeholdersToConsult,
          acceptablePatterns: d.acceptablePatterns,
          requiredEvidences: d.requiredEvidences,
          status: 'DETECTED',
          maturity: 0,
          // Using domainA and domainB for impactedDomains
          impactedDomains: [d.domainA, d.domainB],
        })),
      })
    }

    // ========================================
    // STEP 2: Calculate vigilance scores
    // ========================================

    // Re-fetch tensions after adding new ones
    const updatedTensions = await db.tension.findMany({
      where: { siaId: sia.id },
      include: { arbitration: true },
    })

    // Prepare data for scoring
    const siaData = {
      decisionType: sia.decisionType,
      dataTypes: sia.dataTypes,
      hasVulnerable: sia.hasVulnerable,
      userScale: sia.userScale,
    }

    const edgesData = sia.edges.map((edge) => ({
      id: edge.id,
      dataCategories: edge.dataCategories,
      nature: edge.nature,
    }))

    const tensionsData = updatedTensions.map((tension) => ({
      id: tension.id,
      impactedDomains: tension.impactedDomains,
      severity: tension.severity,
      status: tension.status,
      hasArbitration: !!tension.arbitration,
      arbitrationDecision: tension.arbitration?.decision,
    }))

    const actionsData = sia.actions.map((action) => ({
      id: action.id,
      category: action.category,
      status: action.status,
      priority: action.priority,
      tensionId: action.tensionId,
    }))

    // Calculate new scores
    const vigilanceScores = calculateVigilanceScores(
      siaData,
      edgesData,
      tensionsData,
      actionsData
    )

    // Update SIA with new scores
    const updatedSia = await db.sia.update({
      where: { id: siaId },
      data: {
        vigilanceScores,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      vigilanceScores: updatedSia.vigilanceScores,
      detection: {
        total: detectedDilemmas.length,
        new: newDilemmas.length,
        existing: existingRuleIds.size,
      },
    })
  } catch (error) {
    console.error('Error recalculating scores:', error)
    return NextResponse.json(
      { error: 'Erreur lors du recalcul des scores' },
      { status: 500 }
    )
  }
}

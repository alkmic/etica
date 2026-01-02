import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/sia/[siaId]/dilemmas - List all dilemmas (tensions) for a SIA
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

    const tensions = await db.tension.findMany({
      where: { siaId },
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
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // Transform to Dilemma format expected by UI
    const dilemmas = tensions.map((tension: any) => ({
      id: tension.id,
      ruleId: tension.ruleId,
      ruleName: tension.ruleName || tension.ruleId,
      ruleFamily: tension.ruleFamily,
      domainA: tension.domainA || (tension.impactedDomains[0] as string) || 'PRIVACY',
      domainB: tension.domainB || (tension.impactedDomains[1] as string) || 'TRANSPARENCY',
      formulation: tension.formulation || tension.description || '',
      mechanism: tension.mechanism || '',
      severity: tension.severity,
      maturity: tension.maturity,
      affectedNodeIds: tension.affectedNodeIds || tension.relatedNodeIds || [],
      affectedEdgeIds: tension.affectedEdgeIds || [],
      activeAggravatingFactors: tension.aggravatingFactors || tension.activeAmplifiers || [],
      activeMitigatingFactors: tension.mitigatingFactors || tension.activeMitigators || [],
      acceptablePatterns: tension.acceptablePatterns || [],
      requiredEvidences: tension.requiredEvidences || [],
      questionsToConsider: tension.questionsToConsider || [],
      stakeholdersToConsult: tension.stakeholdersToConsult || [],
      status: tension.status,
      createdAt: tension.createdAt.toISOString(),
      arbitration: tension.arbitration ? {
        id: tension.arbitration.id,
        decision: tension.arbitration.decision,
        justification: tension.arbitration.justification,
        arbitratedAt: tension.arbitration.arbitratedAt.toISOString(),
      } : null,
      actions: tension.actions,
      tensionEdges: tension.tensionEdges,
    }))

    return NextResponse.json(dilemmas)
  } catch (error) {
    console.error('Error fetching dilemmas:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des dilemmes' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { db } from '@/lib/db'
import { calculateVigilanceScores } from '@/lib/scoring/vigilance'

// POST /api/sia/[siaId]/recalculate - Recalculate vigilance scores
export async function POST(
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

    // Get full SIA with all related data
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
        { error: 'SIA non trouvé' },
        { status: 404 }
      )
    }

    // Prepare data for scoring
    const siaData = {
      id: sia.id,
      sector: sia.sector,
      decisionType: sia.decisionType,
      dataTypes: sia.dataTypes,
      hasVulnerable: sia.hasVulnerable,
      userScale: sia.userScale,
    }

    const edgesData = sia.edges.map((edge: any) => ({
      id: edge.id,
      dataCategories: edge.dataCategories || [],
      sensitivity: edge.sensitivity,
      nature: edge.nature,
      automation: edge.automation,
      direction: edge.direction,
      agentivity: edge.agentivity ?? null,
      asymmetry: edge.asymmetry ?? null,
      irreversibility: edge.irreversibility ?? null,
      scalability: edge.scalability ?? null,
      opacity: edge.opacity ?? null,
    }))

    const tensionsData = sia.tensions.map((tension: any) => ({
      id: tension.id,
      status: tension.status,
      impactedDomains: tension.impactedDomains || [],
      severity: tension.severity ?? null,
      probability: tension.probability ?? null,
      scale: tension.scale ?? null,
      vulnerability: tension.vulnerability ?? null,
      irreversibility: tension.irreversibility ?? null,
      detectability: tension.detectability ?? null,
      exposureScore: tension.exposureScore ?? null,
    }))

    const actionsData = sia.actions.map((action: any) => ({
      id: action.id,
      status: action.status,
      tensionId: action.tensionId,
      estimatedImpact: (action.estimatedImpact as Record<string, number> | null) ?? null,
    }))

    // Calculate new scores
    const vigilanceScoresRaw = calculateVigilanceScores(
      siaData,
      edgesData,
      tensionsData,
      actionsData
    )

    // Convert to JSON-compatible format for Prisma Json field
    const vigilanceScores = JSON.parse(JSON.stringify(vigilanceScoresRaw))

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
    })
  } catch (error) {
    console.error('Error recalculating scores:', error)
    return NextResponse.json(
      { error: 'Erreur lors du recalcul des scores' },
      { status: 500 }
    )
  }
}

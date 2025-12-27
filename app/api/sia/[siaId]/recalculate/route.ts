import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { calculateVigilanceScores } from '@/lib/scoring/vigilance'

// POST /api/sia/[siaId]/recalculate - Recalculate vigilance scores
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
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
        userId: session.user.id,
      },
      include: {
        nodes: true,
        edges: true,
        tensions: {
          include: {
            arbitrations: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
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
      decisionType: sia.decisionType,
      dataTypes: sia.dataTypes,
      hasVulnerable: sia.hasVulnerable,
      scale: sia.scale,
    }

    const edgesData = sia.edges.map((edge) => ({
      id: edge.id,
      dataTypes: edge.dataTypes,
      domains: edge.domains,
    }))

    const tensionsData = sia.tensions.map((tension) => ({
      id: tension.id,
      primaryDomain: tension.primaryDomain,
      secondaryDomain: tension.secondaryDomain,
      severity: tension.severity,
      status: tension.status,
      hasArbitration: tension.arbitrations.length > 0,
      arbitrationDecision: tension.arbitrations[0]?.decision,
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
    })
  } catch (error) {
    console.error('Error recalculating scores:', error)
    return NextResponse.json(
      { error: 'Erreur lors du recalcul des scores' },
      { status: 500 }
    )
  }
}

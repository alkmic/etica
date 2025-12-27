import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/sia/[siaId]/versions - List all versions for a SIA
export async function GET(
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

    const versions = await db.version.findMany({
      where: { siaId },
      orderBy: { version: 'desc' },
    })

    return NextResponse.json(versions)
  } catch (error) {
    console.error('Error fetching versions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

// POST /api/sia/[siaId]/versions - Create a new version (snapshot)
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
    const sia = await db.sia.findUnique({
      where: {
        id: siaId,
        userId: session.user.id,
      },
      include: {
        nodes: true,
        edges: true,
        tensions: {
          include: {
            edges: true,
            arbitrations: true,
          },
        },
        actions: {
          include: {
            evidences: true,
          },
        },
      },
    })

    if (!sia) {
      return NextResponse.json(
        { error: 'SIA non trouvé' },
        { status: 404 }
      )
    }

    // Get the latest version number
    const latestVersion = await db.version.findFirst({
      where: { siaId },
      orderBy: { version: 'desc' },
    })

    const newVersionNumber = (latestVersion?.version || 0) + 1

    // Create snapshot
    const snapshot = {
      name: sia.name,
      description: sia.description,
      status: sia.status,
      decisionType: sia.decisionType,
      scale: sia.scale,
      dataTypes: sia.dataTypes,
      populations: sia.populations,
      hasVulnerable: sia.hasVulnerable,
      vigilanceScores: sia.vigilanceScores,
      nodes: sia.nodes,
      edges: sia.edges,
      tensions: sia.tensions,
      actions: sia.actions,
    }

    const version = await db.version.create({
      data: {
        siaId,
        version: newVersionNumber,
        snapshot,
        createdBy: session.user.id,
      },
    })

    return NextResponse.json(version, { status: 201 })
  } catch (error) {
    console.error('Error creating version:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}

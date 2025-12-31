import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { db } from '@/lib/db'
import { TENSION_PATTERNS, TensionPatternId } from '@/lib/constants/tension-patterns'

// GET /api/sia/[siaId]/tensions - List all tensions for a SIA
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
        { calculatedSeverity: 'desc' },
        { baseSeverity: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // Enrich with pattern info
    const enrichedTensions = tensions.map((tension: any) => {
      const pattern = TENSION_PATTERNS[tension.pattern as TensionPatternId]
      return {
        ...tension,
        patternTitle: pattern?.title || tension.pattern,
        patternDescription: pattern?.description || tension.description,
        poles: pattern?.poles || [],
      }
    })

    return NextResponse.json(enrichedTensions)
  } catch (error) {
    console.error('Error fetching tensions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tensions' },
      { status: 500 }
    )
  }
}

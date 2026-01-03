import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/sia/[siaId]/tensions - List all tensions for a SIA
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
        arbitrations: true,
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    // Transform to include arbitration (singular) for backwards compatibility
    const tensionsWithArbitration = tensions.map(t => ({
      ...t,
      arbitration: t.arbitrations[0] || null,
    }))

    return NextResponse.json(tensionsWithArbitration)
  } catch (error) {
    console.error('Error fetching tensions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tensions' },
      { status: 500 }
    )
  }
}

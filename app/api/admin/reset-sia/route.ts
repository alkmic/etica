import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'

/**
 * DELETE /api/admin/reset-sia
 * Supprime toutes les données SIA pour repartir sur une base propre
 * Compatible avec la nouvelle méthodologie ETICA
 *
 * ATTENTION: Cette opération est irréversible
 */
export async function DELETE(request: Request) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier le header de confirmation
    const confirmHeader = request.headers.get('x-confirm-delete')
    if (confirmHeader !== 'DELETE_ALL_SIA_DATA') {
      return NextResponse.json(
        { error: 'Header de confirmation manquant: x-confirm-delete: DELETE_ALL_SIA_DATA' },
        { status: 400 }
      )
    }

    // Compter les SIA avant suppression
    const countBefore = await db.sia.count()

    // Supprimer toutes les données SIA (les cascades s'occupent du reste)
    // L'ordre est important à cause des relations
    await db.$transaction([
      // D'abord les tables dépendantes sans cascade
      db.comment.deleteMany(),
      db.evidence.deleteMany(),
      db.tensionEdge.deleteMany(),
      db.arbitration.deleteMany(),
      db.action.deleteMany(),
      db.tension.deleteMany(),
      db.edge.deleteMany(),
      db.node.deleteMany(),
      db.siaMember.deleteMany(),
      db.version.deleteMany(),
      // Enfin les SIA
      db.sia.deleteMany(),
    ])

    return NextResponse.json({
      success: true,
      message: `${countBefore} SIA supprimé(s). Base de données prête pour la nouvelle méthodologie.`,
      deletedCount: countBefore,
    })
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/reset-sia
 * Affiche les statistiques actuelles avant suppression
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const stats = await db.$transaction([
      db.sia.count(),
      db.node.count(),
      db.edge.count(),
      db.tension.count(),
      db.action.count(),
    ])

    return NextResponse.json({
      siaCount: stats[0],
      nodeCount: stats[1],
      edgeCount: stats[2],
      tensionCount: stats[3],
      actionCount: stats[4],
      warning: 'Utilisez DELETE avec le header x-confirm-delete: DELETE_ALL_SIA_DATA pour tout supprimer',
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// POST /api/sia/[siaId]/versions/[versionId]/restore - Restore a version
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string; versionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { siaId, versionId } = await params

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

    // Get the version to restore
    const version = await db.version.findFirst({
      where: {
        id: versionId,
        siaId,
      },
    })

    if (!version) {
      return NextResponse.json(
        { error: 'Version non trouvée' },
        { status: 404 }
      )
    }

    const snapshot = version.snapshot as {
      name?: string
      description?: string
      status?: string
      decisionType?: string
      sector?: string
      userScale?: string
      dataTypes?: string[]
      populations?: string[]
      hasVulnerable?: boolean
      vigilanceScores?: Record<string, unknown>
      nodes?: Array<{
        id: string
        type: string
        label: string
        position: { x: number; y: number }
        data: Record<string, unknown>
      }>
      edges?: Array<{
        id: string
        sourceId: string
        targetId: string
        label?: string
        dataCategories?: string[]
        purpose?: string
        legalBasis?: string
        retentionPeriod?: string
        securityMeasures?: string[]
      }>
      tensions?: Array<{
        id: string
        pattern: string
        description: string
        severity: number
        status: string
        impactedDomains: string[]
      }>
      actions?: Array<{
        id: string
        title: string
        description?: string
        status: string
        priority: string
        category: string
        dueDate?: string
        assignee?: string
        tensionId?: string
      }>
    }

    // Use a transaction to restore everything
    await db.$transaction(async (tx) => {
      // Update SIA metadata
      await tx.sia.update({
        where: { id: siaId },
        data: {
          name: snapshot.name || sia.name,
          description: snapshot.description || sia.description,
          status: (snapshot.status as 'DRAFT' | 'ACTIVE' | 'REVIEW' | 'ARCHIVED') || sia.status,
          decisionType: (snapshot.decisionType as 'INFORMATIVE' | 'RECOMMENDATION' | 'ASSISTED_DECISION' | 'AUTO_DECISION') || sia.decisionType,
          sector: (snapshot.sector as 'HEALTH' | 'FINANCE' | 'HR' | 'COMMERCE' | 'JUSTICE' | 'ADMINISTRATION' | 'EDUCATION' | 'TRANSPORT' | 'INSURANCE' | 'SECURITY' | 'MARKETING' | 'OTHER') || sia.sector,
          userScale: (snapshot.userScale as 'TINY' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'VERY_LARGE') || sia.userScale,
          dataTypes: snapshot.dataTypes || sia.dataTypes,
          populations: snapshot.populations || sia.populations,
          hasVulnerable: snapshot.hasVulnerable ?? sia.hasVulnerable,
          vigilanceScores: snapshot.vigilanceScores || sia.vigilanceScores,
        },
      })

      // Delete existing data (order matters due to foreign keys)
      await tx.action.deleteMany({ where: { siaId } })
      await tx.arbitration.deleteMany({ where: { tension: { siaId } } })
      await tx.tensionEdge.deleteMany({ where: { tension: { siaId } } })
      await tx.tension.deleteMany({ where: { siaId } })
      await tx.edge.deleteMany({ where: { siaId } })
      await tx.node.deleteMany({ where: { siaId } })

      // Recreate nodes
      if (snapshot.nodes && snapshot.nodes.length > 0) {
        await tx.node.createMany({
          data: snapshot.nodes.map((node) => ({
            id: node.id,
            siaId,
            type: node.type,
            label: node.label,
            position: node.position,
            data: node.data || {},
          })),
        })
      }

      // Recreate edges
      if (snapshot.edges && snapshot.edges.length > 0) {
        await tx.edge.createMany({
          data: snapshot.edges.map((edge) => ({
            id: edge.id,
            siaId,
            sourceId: edge.sourceId,
            targetId: edge.targetId,
            label: edge.label || '',
            dataCategories: edge.dataCategories || [],
            purpose: edge.purpose || '',
            legalBasis: edge.legalBasis || '',
            retentionPeriod: edge.retentionPeriod || '',
            securityMeasures: edge.securityMeasures || [],
          })),
        })
      }

      // Recreate tensions
      if (snapshot.tensions && snapshot.tensions.length > 0) {
        await tx.tension.createMany({
          data: snapshot.tensions.map((tension) => ({
            id: tension.id,
            siaId,
            pattern: tension.pattern,
            description: tension.description,
            severity: tension.severity,
            status: tension.status as 'DETECTED' | 'QUALIFIED' | 'IN_PROGRESS' | 'ARBITRATED' | 'RESOLVED' | 'DISMISSED',
            impactedDomains: tension.impactedDomains,
          })),
        })
      }

      // Recreate actions
      if (snapshot.actions && snapshot.actions.length > 0) {
        await tx.action.createMany({
          data: snapshot.actions.map((action) => ({
            id: action.id,
            siaId,
            title: action.title,
            description: action.description || '',
            status: action.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
            priority: action.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
            category: action.category as 'TECHNICAL' | 'ORGANIZATIONAL' | 'LEGAL' | 'COMMUNICATION' | 'TRAINING' | 'AUDIT' | 'OTHER',
            dueDate: action.dueDate ? new Date(action.dueDate) : null,
            assignee: action.assignee || null,
            tensionId: action.tensionId || null,
          })),
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error restoring version:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la restauration' },
      { status: 500 }
    )
  }
}

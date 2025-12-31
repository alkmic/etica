import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { db } from '@/lib/db'
import { z } from 'zod'
import { detectTensions } from '@/lib/rules/detection-engine'
import { NodeType, FlowNature, FlowDirection, Sensitivity, AutomationLevel, Frequency, TensionPattern, Prisma } from '@prisma/client'

// ============================================
// VALIDATION SCHEMAS
// ============================================

const nodeSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NodeType),
  label: z.string(),
  attributes: z.record(z.unknown()).optional().default({}),
  positionX: z.number(),
  positionY: z.number(),
  style: z.record(z.unknown()).optional().nullable(),
})

const edgeSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  label: z.string().optional().nullable(),
  direction: z.nativeEnum(FlowDirection),
  nature: z.nativeEnum(FlowNature),
  dataCategories: z.array(z.string()).optional().default([]),
  sensitivity: z.nativeEnum(Sensitivity).optional().default('STANDARD'),
  automation: z.nativeEnum(AutomationLevel).optional().default('INFORMATIVE'),
  frequency: z.nativeEnum(Frequency).optional().default('ON_DEMAND'),
  legalBasis: z.string().optional().nullable(),
  // Profil éthique
  agentivity: z.number().min(1).max(5).optional().nullable(),
  asymmetry: z.number().min(1).max(5).optional().nullable(),
  irreversibility: z.number().min(1).max(5).optional().nullable(),
  scalability: z.number().min(1).max(5).optional().nullable(),
  opacity: z.number().min(1).max(5).optional().nullable(),
})

const canvasSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
})

// ============================================
// PUT - Update canvas (nodes and edges) + detect tensions
// ============================================

export async function PUT(
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

    const body = await request.json()
    const validatedData = canvasSchema.parse(body)

    // Use a transaction to update nodes and edges
    await db.$transaction(async (tx) => {
      // Delete existing edges first (due to FK constraints)
      await tx.tensionEdge.deleteMany({
        where: { edge: { siaId } }
      })
      await tx.edge.deleteMany({ where: { siaId } })
      await tx.node.deleteMany({ where: { siaId } })

      // Create new nodes
      if (validatedData.nodes.length > 0) {
        await tx.node.createMany({
          data: validatedData.nodes.map((node) => ({
            id: node.id,
            siaId,
            type: node.type,
            label: node.label,
            attributes: (node.attributes || {}) as Prisma.InputJsonValue,
            positionX: node.positionX,
            positionY: node.positionY,
            style: (node.style || null) as Prisma.InputJsonValue | null,
          })),
        })
      }

      // Create new edges
      if (validatedData.edges.length > 0) {
        await tx.edge.createMany({
          data: validatedData.edges.map((edge) => ({
            id: edge.id,
            siaId,
            sourceId: edge.sourceId,
            targetId: edge.targetId,
            label: edge.label || null,
            direction: edge.direction,
            nature: edge.nature,
            dataCategories: edge.dataCategories,
            sensitivity: edge.sensitivity,
            automation: edge.automation,
            frequency: edge.frequency,
            legalBasis: edge.legalBasis as any || null,
            agentivity: edge.agentivity,
            asymmetry: edge.asymmetry,
            irreversibility: edge.irreversibility,
            scalability: edge.scalability,
            opacity: edge.opacity,
          })),
        })
      }

      // Update SIA timestamp
      await tx.sia.update({
        where: { id: siaId },
        data: { updatedAt: new Date() },
      })
    })

    // After saving, run tension detection
    const updatedSia = await db.sia.findUnique({
      where: { id: siaId },
      include: {
        nodes: true,
        edges: true,
      },
    })

    let detectedCount = 0

    if (updatedSia) {
      // Prepare context for detection engine
      const siaContext = {
        id: updatedSia.id,
        name: updatedSia.name,
        domain: updatedSia.domain as any,
        decisionType: updatedSia.decisionType,
        hasVulnerable: updatedSia.hasVulnerable,
        scale: updatedSia.scale as any,
        dataTypes: updatedSia.dataTypes,
        populations: updatedSia.populations,
      }

      const nodeContexts = updatedSia.nodes.map((node) => ({
        id: node.id,
        type: node.type as any,
        label: node.label,
        attributes: (node.attributes as Record<string, unknown>) || {},
      }))

      const edgeContexts = updatedSia.edges.map((edge) => ({
        id: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        nature: edge.nature as any,
        sensitivity: edge.sensitivity as any,
        automation: edge.automation,
        direction: edge.direction,
        dataCategories: edge.dataCategories,
        frequency: edge.frequency,
        opacity: edge.opacity,
        agentivity: edge.agentivity,
        asymmetry: edge.asymmetry,
        irreversibility: edge.irreversibility,
        scalability: edge.scalability,
      }))

      // Detect tensions
      const detectedTensions = detectTensions(siaContext, nodeContexts, edgeContexts, 15)
      detectedCount = detectedTensions.length

      // Delete auto-detected tensions that are no longer relevant
      // (keep manually created or arbitrated tensions)
      await db.tension.deleteMany({
        where: {
          siaId,
          status: 'DETECTED', // Only delete those still in DETECTED status
          triggeredByRule: { not: null }, // Only auto-detected ones
        }
      })

      // Create new tensions
      for (const tension of detectedTensions) {
        // Map pattern ID to Prisma enum
        const patternEnum = tension.patternId as TensionPattern

        await db.tension.create({
          data: {
            siaId,
            pattern: patternEnum,
            description: tension.pattern.description,
            status: 'DETECTED',
            level: tension.level as any,
            impactedDomains: tension.impactedDomains,
            baseSeverity: tension.baseSeverity,
            calculatedSeverity: tension.calculatedSeverity,
            triggerConditions: tension.triggerConditions as Prisma.InputJsonValue,
            activeAmplifiers: tension.activeAmplifiers,
            activeMitigators: tension.activeMitigators,
            relatedNodeIds: tension.relatedNodeIds,
            detectionReason: tension.detectionReason,
            triggeredByRule: 'auto-detection',
            tensionEdges: {
              create: tension.relatedEdgeIds.map((edgeId) => ({
                edgeId,
              })),
            },
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      nodesCount: validatedData.nodes.length,
      edgesCount: validatedData.edges.length,
      tensionsDetected: detectedCount,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating canvas:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}

// ============================================
// GET - Get canvas data
// ============================================

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
      },
    })

    if (!sia) {
      return NextResponse.json(
        { error: 'SIA non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      nodes: sia.nodes,
      edges: sia.edges,
    })
  } catch (error) {
    console.error('Error fetching canvas:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

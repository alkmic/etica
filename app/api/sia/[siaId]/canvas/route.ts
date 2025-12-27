import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { detectTensions } from '@/lib/rules/tension-rules'

export const dynamic = 'force-dynamic'

const nodeSchema = z.object({
  id: z.string(),
  type: z.enum(['HUMAN', 'AI', 'INFRA', 'ORG']),
  label: z.string(),
  attributes: z.record(z.unknown()).optional(),
  positionX: z.number(),
  positionY: z.number(),
})

const edgeSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  label: z.string().optional(),
  direction: z.enum(['H2M', 'M2M', 'M2H', 'H2H']).default('M2M'),
  nature: z.enum(['COLLECT', 'INFERENCE', 'ENRICHMENT', 'DECISION', 'RECOMMENDATION', 'NOTIFICATION', 'LEARNING', 'CONTROL', 'TRANSFER', 'STORAGE']).default('TRANSFER'),
  dataCategories: z.array(z.string()).optional(),
})

const canvasSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
})

// PUT /api/sia/[siaId]/canvas - Update canvas (nodes and edges)
export async function PUT(
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

    const body = await request.json()
    const validatedData = canvasSchema.parse(body)

    // Use a transaction to update nodes and edges
    await db.$transaction(async (tx) => {
      // Delete existing nodes and edges
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
            attributes: node.attributes || {},
            positionX: node.positionX,
            positionY: node.positionY,
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
            label: edge.label || '',
            direction: edge.direction,
            nature: edge.nature,
            dataCategories: edge.dataCategories || [],
          })),
        })
      }

      // Update SIA timestamp
      await tx.sia.update({
        where: { id: siaId },
        data: { updatedAt: new Date() },
      })
    })

    // After saving, detect tensions
    const updatedSia = await db.sia.findUnique({
      where: { id: siaId },
      include: {
        nodes: true,
        edges: true,
      },
    })

    if (updatedSia) {
      // Prepare context for tension detection
      const siaContext = {
        decisionType: updatedSia.decisionType,
        dataTypes: updatedSia.dataTypes,
        hasVulnerable: updatedSia.hasVulnerable,
        scale: updatedSia.scale,
      }

      const nodeContexts = updatedSia.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        attributes: node.attributes,
      }))

      const edgeContexts = updatedSia.edges.map((edge) => ({
        id: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        dataCategories: edge.dataCategories,
        nature: edge.nature,
      }))

      // Detect new tensions
      const detectedTensions = detectTensions(siaContext, nodeContexts, edgeContexts)

      // Create new tensions (don't delete existing ones that may have been manually created)
      for (const tension of detectedTensions) {
        // Check if tension already exists for this pattern
        const existingTension = await db.tension.findFirst({
          where: {
            siaId,
            pattern: tension.pattern,
          },
        })

        if (!existingTension) {
          await db.tension.create({
            data: {
              siaId,
              pattern: tension.pattern,
              impactedDomains: tension.impactedDomains || [],
              description: tension.description,
              severity: tension.severity,
              status: 'DETECTED',
              tensionEdges: {
                create: tension.relatedEdges.map((edgeId: string) => ({
                  edgeId,
                })),
              },
            },
          })
        }
      }
    }

    return NextResponse.json({ success: true })
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

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { detectTensions } from '@/lib/rules/tension-rules'

export const dynamic = 'force-dynamic'

// Function types used by the frontend (what the node DOES)
const functionTypes = ['SOURCE', 'TREATMENT', 'DECISION', 'ACTION', 'STAKEHOLDER', 'STORAGE'] as const

// Entity types for Prisma (WHO/WHAT the node is)
const entityTypes = ['HUMAN', 'AI', 'INFRA', 'ORG'] as const

// Map function types to sensible default entity types
const functionToEntityMap: Record<string, 'HUMAN' | 'AI' | 'INFRA' | 'ORG'> = {
  'SOURCE': 'INFRA',
  'TREATMENT': 'AI',
  'DECISION': 'AI',
  'ACTION': 'INFRA',
  'STAKEHOLDER': 'HUMAN',
  'STORAGE': 'INFRA',
}

const nodeSchema = z.object({
  id: z.string(),
  type: z.string(), // Accept any string - will be validated and mapped
  entityType: z.enum(entityTypes).optional(),
  label: z.string(),
  description: z.string().optional(),
  dataTypes: z.array(z.string()).optional(),
  inputCount: z.number().optional(),
  outputCount: z.number().optional(),
  attributes: z.record(z.unknown()).optional(),
  positionX: z.number(),
  positionY: z.number(),
})

const edgeSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  direction: z.enum(['H2M', 'M2M', 'M2H', 'H2H']).optional().default('M2M'),
  nature: z.enum(['COLLECT', 'INFERENCE', 'ENRICHMENT', 'DECISION', 'RECOMMENDATION', 'NOTIFICATION', 'LEARNING', 'CONTROL', 'TRANSFER', 'STORAGE']).optional().default('TRANSFER'),
  dataCategories: z.array(z.string()).optional(),
  domains: z.array(z.string()).optional(),
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
          data: validatedData.nodes.map((node) => {
            // Determine the entity type for Prisma
            // If entityType is provided and valid, use it; otherwise map from function type
            const isValidEntityType = entityTypes.includes(node.entityType as typeof entityTypes[number])
            const isFunctionType = functionTypes.includes(node.type as typeof functionTypes[number])

            let prismaType: 'HUMAN' | 'AI' | 'INFRA' | 'ORG'
            if (isValidEntityType && node.entityType) {
              prismaType = node.entityType
            } else if (isFunctionType) {
              prismaType = functionToEntityMap[node.type] || 'INFRA'
            } else if (entityTypes.includes(node.type as typeof entityTypes[number])) {
              // type is actually an entity type (old format)
              prismaType = node.type as 'HUMAN' | 'AI' | 'INFRA' | 'ORG'
            } else {
              prismaType = 'INFRA' // Default fallback
            }

            // Store the function type and other data in attributes
            const attributes = {
              ...(node.attributes || {}),
              functionType: isFunctionType ? node.type : undefined,
              description: node.description,
              dataTypes: node.dataTypes || [],
              inputCount: node.inputCount || 1,
              outputCount: node.outputCount || 1,
            }

            return {
              id: node.id,
              siaId,
              type: prismaType,
              label: node.label,
              attributes,
              positionX: node.positionX,
              positionY: node.positionY,
            }
          }),
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
        id: updatedSia.id,
        name: updatedSia.name,
        domain: updatedSia.domain,
        decisionType: updatedSia.decisionType,
        dataTypes: updatedSia.dataTypes,
        hasVulnerable: updatedSia.hasVulnerable,
        scale: updatedSia.scale,
      }

      const nodeContexts = updatedSia.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        label: node.label,
        attributes: node.attributes as Record<string, unknown>,
      }))

      const edgeContexts = updatedSia.edges.map((edge) => ({
        id: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        nature: edge.nature,
        sensitivity: edge.sensitivity,
        automation: edge.automation,
        direction: edge.direction,
        dataCategories: edge.dataCategories,
        opacity: edge.opacity,
        agentivity: edge.agentivity,
        asymmetry: edge.asymmetry,
        irreversibility: edge.irreversibility,
        scalability: edge.scalability,
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
          // Map confidence to severity (1-5 scale)
          const severityMap: Record<string, number> = {
            'LOW': 2,
            'MEDIUM': 3,
            'HIGH': 4,
            'VERY_HIGH': 5,
          }
          const severity = severityMap[tension.confidence] || 3

          await db.tension.create({
            data: {
              siaId,
              pattern: tension.pattern,
              impactedDomains: tension.impactedDomains || [],
              description: tension.description,
              severity,
              status: 'DETECTED',
              tensionEdges: {
                create: tension.relatedEdgeIds
                  .filter((edgeId: string) =>
                    // Only create relations for edges that exist
                    updatedSia.edges.some(e => e.id === edgeId)
                  )
                  .map((edgeId: string) => ({
                    edgeId,
                  })),
              },
            },
          })
        }
      }
    }

    // Count newly created tensions
    const tensionsDetected = await db.tension.count({
      where: { siaId },
    })

    return NextResponse.json({ success: true, tensionsDetected })
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

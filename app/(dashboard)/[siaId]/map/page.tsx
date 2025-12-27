'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useToast } from '@/hooks/use-toast'
import { useCanvasStore, CanvasNode, CanvasEdge } from '@/lib/stores/canvas-store'
import CustomNode, { NodeType } from '@/components/canvas/custom-node'
import CustomEdge from '@/components/canvas/custom-edge'
import { CanvasToolbar } from '@/components/canvas/canvas-toolbar'
import { NodeEditor } from '@/components/canvas/node-editor'
import { EdgeEditor } from '@/components/canvas/edge-editor'

const nodeTypes = {
  custom: CustomNode,
}

const edgeTypes = {
  custom: CustomEdge,
}

function MapCanvas() {
  const params = useParams()
  const siaId = params.siaId as string
  const { toast } = useToast()
  const { screenToFlowPosition } = useReactFlow()

  const {
    nodes,
    edges,
    selectedNode,
    selectedEdge,
    isLoading,
    isDirty,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    deleteNode,
    updateEdge,
    deleteEdge,
    selectNode,
    selectEdge,
    setLoading,
    setDirty,
  } = useCanvasStore()

  const [isSaving, setIsSaving] = useState(false)

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const response = await fetch(`/api/sia/${siaId}`)
        if (response.ok) {
          const data = await response.json()

          // Convert API nodes to ReactFlow nodes
          const flowNodes: CanvasNode[] = (data.nodes || []).map((node: {
            id: string
            type: string
            label: string
            description?: string
            dataTypes?: string[]
            positionX: number
            positionY: number
          }) => ({
            id: node.id,
            type: 'custom',
            position: { x: node.positionX || 0, y: node.positionY || 0 },
            data: {
              label: node.label,
              type: node.type as NodeType,
              description: node.description,
              dataTypes: node.dataTypes || [],
            },
          }))

          // Convert API edges to ReactFlow edges
          const flowEdges: CanvasEdge[] = (data.edges || []).map((edge: {
            id: string
            sourceNodeId: string
            targetNodeId: string
            dataTypes?: string[]
            description?: string
            domains?: string[]
          }) => ({
            id: edge.id,
            source: edge.sourceNodeId,
            target: edge.targetNodeId,
            type: 'custom',
            data: {
              dataTypes: edge.dataTypes || [],
              description: edge.description,
              domains: edge.domains || [],
            },
          }))

          setNodes(flowNodes)
          setEdges(flowEdges)
          setDirty(false)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    if (siaId) {
      loadData()
    }
  }, [siaId, setNodes, setEdges, setLoading, setDirty, toast])

  // Handle adding a new node
  const handleAddNode = useCallback(
    (type: NodeType) => {
      const position = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      })

      const newNode: CanvasNode = {
        id: `node-${Date.now()}`,
        type: 'custom',
        position,
        data: {
          label: `Nouveau ${type.toLowerCase()}`,
          type,
          dataTypes: [],
        },
      }

      addNode(newNode)
    },
    [screenToFlowPosition, addNode]
  )

  // Handle node click
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: CanvasNode) => {
      selectNode(node)
    },
    [selectNode]
  )

  // Handle edge click
  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: CanvasEdge) => {
      selectEdge(edge)
    },
    [selectEdge]
  )

  // Handle pane click (deselect)
  const handlePaneClick = useCallback(() => {
    selectNode(null)
    selectEdge(null)
  }, [selectNode, selectEdge])

  // Handle save
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      // Save nodes
      const nodesData = nodes.map((node) => ({
        id: node.id,
        type: node.data.type,
        label: node.data.label,
        description: node.data.description || '',
        dataTypes: node.data.dataTypes || [],
        positionX: node.position.x,
        positionY: node.position.y,
      }))

      // Save edges
      const edgesData = edges.map((edge) => ({
        id: edge.id,
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        dataTypes: edge.data?.dataTypes || [],
        description: edge.data?.description || '',
        domains: edge.data?.domains || [],
      }))

      const response = await fetch(`/api/sia/${siaId}/canvas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: nodesData, edges: edgesData }),
      })

      if (response.ok) {
        setDirty(false)
        toast({
          title: 'Sauvegardé',
          description: 'La cartographie a été enregistrée',
        })
      } else {
        throw new Error('Save failed')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }, [nodes, edges, siaId, setDirty, toast])

  // Handle delete selected
  const handleDelete = useCallback(() => {
    if (selectedNode) {
      deleteNode(selectedNode.id)
    } else if (selectedEdge) {
      deleteEdge(selectedEdge.id)
    }
  }, [selectedNode, selectedEdge, deleteNode, deleteEdge])

  // Find source and target labels for edge editor
  const edgeLabels = useMemo(() => {
    if (!selectedEdge) return { source: '', target: '' }
    const sourceNode = nodes.find((n) => n.id === selectedEdge.source)
    const targetNode = nodes.find((n) => n.id === selectedEdge.target)
    return {
      source: sourceNode?.data.label || 'Source',
      target: targetNode?.data.label || 'Cible',
    }
  }, [selectedEdge, nodes])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement de la cartographie...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-180px)] w-full relative border rounded-lg bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'custom',
        }}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e5e7eb" gap={20} />
        <Controls position="bottom-left" />
        <MiniMap
          nodeColor={(node) => {
            const colors: Record<NodeType, string> = {
              SOURCE: '#3b82f6',
              TREATMENT: '#8b5cf6',
              DECISION: '#f97316',
              ACTION: '#22c55e',
              STAKEHOLDER: '#ec4899',
              STORAGE: '#6b7280',
            }
            return colors[(node.data as { type: NodeType }).type] || '#6b7280'
          }}
          position="bottom-right"
          className="!bg-white !border !shadow-lg"
        />
      </ReactFlow>

      <CanvasToolbar
        onAddNode={handleAddNode}
        onSave={handleSave}
        onDelete={handleDelete}
        isSaving={isSaving}
        canDelete={!!(selectedNode || selectedEdge)}
      />

      {selectedNode && (
        <NodeEditor
          node={selectedNode}
          onUpdate={updateNode}
          onClose={() => selectNode(null)}
          onDelete={deleteNode}
        />
      )}

      {selectedEdge && (
        <EdgeEditor
          edge={selectedEdge}
          sourceLabel={edgeLabels.source}
          targetLabel={edgeLabels.target}
          onUpdate={updateEdge}
          onClose={() => selectEdge(null)}
          onDelete={deleteEdge}
        />
      )}

      {isDirty && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg border border-yellow-200 text-sm">
          Modifications non sauvegardées
        </div>
      )}
    </div>
  )
}

export default function MapPage() {
  return (
    <ReactFlowProvider>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Cartographie</h1>
          <p className="text-muted-foreground">
            Modélisez les flux de données et identifiez les tensions éthiques
          </p>
        </div>
        <MapCanvas />
      </div>
    </ReactFlowProvider>
  )
}

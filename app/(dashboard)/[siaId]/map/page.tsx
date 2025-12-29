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
import { Button } from '@/components/ui/button'
import { HelpCircle, X, Keyboard } from 'lucide-react'
import { useCanvasStore, CanvasNode, CanvasEdge } from '@/lib/stores/canvas-store'
import CustomNode, { NodeType } from '@/components/canvas/custom-node'
import CustomEdge from '@/components/canvas/custom-edge'
import { CanvasToolbar } from '@/components/canvas/canvas-toolbar'
import { NodeEditor } from '@/components/canvas/node-editor'
import { EdgeEditor } from '@/components/canvas/edge-editor'
import { FlowTemplate } from '@/lib/constants/flow-templates'

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
  const { screenToFlowPosition, fitView } = useReactFlow()

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
  const [showHelp, setShowHelp] = useState(false)

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

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
            type: string // Prisma entity type (HUMAN, AI, INFRA, ORG)
            label: string
            positionX: number
            positionY: number
            attributes?: Record<string, unknown>
          }) => {
            // Read properties from attributes (where we store them on save)
            const attrs = (node.attributes || {}) as {
              functionType?: string
              description?: string
              dataTypes?: string[]
              inputCount?: number
              outputCount?: number
            }

            // Get the function type from attributes, or infer from entity type
            let functionType: NodeType = attrs.functionType as NodeType
            if (!functionType || !['SOURCE', 'TREATMENT', 'DECISION', 'ACTION', 'STAKEHOLDER', 'STORAGE'].includes(functionType)) {
              // Infer function type from entity type for backward compatibility
              const entityToFunctionMap: Record<string, NodeType> = {
                'HUMAN': 'STAKEHOLDER',
                'AI': 'TREATMENT',
                'INFRA': 'SOURCE',
                'ORG': 'STAKEHOLDER',
              }
              functionType = entityToFunctionMap[node.type] || 'SOURCE'
            }

            return {
              id: node.id,
              type: 'custom',
              position: { x: node.positionX || 0, y: node.positionY || 0 },
              data: {
                label: node.label,
                type: functionType,
                entityType: node.type as 'HUMAN' | 'AI' | 'INFRA' | 'ORG',
                description: attrs.description || '',
                dataTypes: attrs.dataTypes || [],
                inputCount: attrs.inputCount || 1,
                outputCount: attrs.outputCount || 1,
              },
            }
          })

          // Convert API edges to ReactFlow edges
          const flowEdges: CanvasEdge[] = (data.edges || []).map((edge: {
            id: string
            sourceId: string
            targetId: string
            sourceHandle?: string
            targetHandle?: string
            dataCategories?: string[]
            description?: string
            label?: string
          }) => ({
            id: edge.id,
            source: edge.sourceId,
            target: edge.targetId,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,
            type: 'custom',
            data: {
              dataTypes: edge.dataCategories || [],
              description: edge.description,
              label: edge.label,
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
          inputCount: 1,
          outputCount: 1,
        },
      }

      addNode(newNode)
    },
    [screenToFlowPosition, addNode]
  )

  // Handle loading a template
  const handleLoadTemplate = useCallback(
    (template: FlowTemplate) => {
      // Convert template nodes to ReactFlow nodes
      const flowNodes: CanvasNode[] = template.nodes.map((node) => ({
        id: `${node.id}-${Date.now()}`, // Add timestamp to avoid ID collisions
        type: 'custom',
        position: node.position,
        data: {
          label: node.label,
          type: node.type,
          entityType: node.entityType,
          description: node.description,
          dataTypes: node.dataTypes,
          inputCount: node.inputCount || 1,
          outputCount: node.outputCount || 1,
        },
      }))

      // Create node ID mapping (old -> new)
      const nodeIdMap: Record<string, string> = {}
      template.nodes.forEach((node, index) => {
        nodeIdMap[node.id] = flowNodes[index].id
      })

      // Convert template edges to ReactFlow edges
      const flowEdges: CanvasEdge[] = template.edges.map((edge) => ({
        id: `${edge.id}-${Date.now()}`,
        source: nodeIdMap[edge.source],
        target: nodeIdMap[edge.target],
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: 'custom',
        data: {
          dataTypes: edge.dataTypes,
          label: edge.label,
          domains: edge.domains,
        },
      }))

      setNodes(flowNodes)
      setEdges(flowEdges)
      setDirty(true)

      // Fit view after a short delay to ensure nodes are rendered
      setTimeout(() => fitView({ padding: 0.2 }), 100)

      toast({
        title: 'Template chargé',
        description: `Le template "${template.name}" a été chargé. N'oubliez pas de sauvegarder.`,
      })
    },
    [setNodes, setEdges, setDirty, fitView, toast]
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
        entityType: node.data.entityType,
        label: node.data.label,
        description: node.data.description || '',
        dataTypes: node.data.dataTypes || [],
        inputCount: node.data.inputCount || 1,
        outputCount: node.data.outputCount || 1,
        positionX: node.position.x,
        positionY: node.position.y,
      }))

      // Save edges
      const edgesData = edges.map((edge) => ({
        id: edge.id,
        sourceId: edge.source,
        targetId: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        dataCategories: edge.data?.dataTypes || [],
        description: edge.data?.description || '',
        label: edge.data?.label || '',
        domains: edge.data?.domains || [],
      }))

      const response = await fetch(`/api/sia/${siaId}/canvas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: nodesData, edges: edgesData }),
      })

      if (response.ok) {
        const data = await response.json()
        setDirty(false)

        // Check if new tensions were detected
        const newTensionsCount = data.tensionsDetected || 0

        if (newTensionsCount > 0) {
          toast({
            title: 'Sauvegardé avec succès',
            description: `${newTensionsCount} tension(s) éthique(s) détectée(s). Analysez-les dans l'onglet Tensions.`,
            action: (
              <Button variant="outline" size="sm" asChild>
                <a href={`/${siaId}/tensions`}>Voir les tensions</a>
              </Button>
            ),
          })
        } else {
          toast({
            title: 'Sauvegardé',
            description: 'La cartographie a été enregistrée. Continuez à modéliser vos flux.',
          })
        }
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (!isSaving && isDirty) {
          handleSave()
        }
      }
      // Delete or Backspace to delete selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && (selectedNode || selectedEdge)) {
        // Only if not focused on an input
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault()
          if (selectedNode) {
            deleteNode(selectedNode.id)
          } else if (selectedEdge) {
            deleteEdge(selectedEdge.id)
          }
        }
      }
      // Escape to deselect
      if (e.key === 'Escape') {
        selectNode(null)
        selectEdge(null)
      }
      // ? to toggle help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          setShowHelp((prev) => !prev)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSaving, isDirty, selectedNode, selectedEdge, deleteNode, deleteEdge, selectNode, selectEdge, handleSave])

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
              STORAGE: '#64748b',
            }
            return colors[(node.data as { type: NodeType }).type] || '#64748b'
          }}
          position="bottom-right"
          className="!bg-white !border !shadow-lg"
        />
      </ReactFlow>

      <CanvasToolbar
        onAddNode={handleAddNode}
        onSave={handleSave}
        onDelete={handleDelete}
        onLoadTemplate={handleLoadTemplate}
        isSaving={isSaving}
        canDelete={!!(selectedNode || selectedEdge)}
        hasNodes={nodes.length > 0}
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg border border-yellow-200 text-sm flex items-center gap-2">
          <span>Modifications non sauvegardées</span>
          <kbd className="px-1.5 py-0.5 text-xs bg-yellow-200 rounded">⌘S</kbd>
        </div>
      )}

      {/* Help button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm"
        onClick={() => setShowHelp(true)}
      >
        <HelpCircle className="h-4 w-4 mr-1" />
        Aide
      </Button>

      {/* Help overlay */}
      {showHelp && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="font-semibold flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Guide de la cartographie
              </h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowHelp(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Actions de base</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-32">Ajouter un nœud</span>
                    <span>Cliquez sur une icône dans la barre d&apos;outils</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-32">Créer un flux</span>
                    <span>Glissez d&apos;un point de sortie (→) vers un point d&apos;entrée (←)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-32">Modifier</span>
                    <span>Cliquez sur un élément pour le sélectionner et l&apos;éditer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-32">Déplacer</span>
                    <span>Glissez un nœud pour le repositionner</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Raccourcis clavier</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">⌘S</kbd>
                    <span className="text-muted-foreground">Sauvegarder</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Delete</kbd>
                    <span className="text-muted-foreground">Supprimer l&apos;élément sélectionné</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Escape</kbd>
                    <span className="text-muted-foreground">Désélectionner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">?</kbd>
                    <span className="text-muted-foreground">Afficher/masquer l&apos;aide</span>
                  </li>
                </ul>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Conseil :</strong> Utilisez les templates pour démarrer rapidement avec une structure pré-configurée adaptée à votre domaine.
                </p>
              </div>
            </div>
          </div>
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

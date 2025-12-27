import { create } from 'zustand'
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow'

export type NodeType = 'SOURCE' | 'TREATMENT' | 'DECISION' | 'ACTION' | 'STAKEHOLDER' | 'STORAGE'

export interface CanvasNode extends Node {
  data: {
    label: string
    type: NodeType
    description?: string
    dataTypes?: string[]
    metadata?: Record<string, unknown>
  }
}

export interface CanvasEdge extends Edge {
  id: string
  data?: {
    dataTypes?: string[]
    description?: string
    domains?: string[]
  }
}

interface CanvasState {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  selectedNode: CanvasNode | null
  selectedEdge: CanvasEdge | null
  isLoading: boolean
  isDirty: boolean

  // Actions
  setNodes: (nodes: CanvasNode[]) => void
  setEdges: (edges: CanvasEdge[]) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect

  addNode: (node: CanvasNode) => void
  updateNode: (id: string, data: Partial<CanvasNode['data']>) => void
  deleteNode: (id: string) => void

  updateEdge: (id: string, data: Partial<CanvasEdge['data']>) => void
  deleteEdge: (id: string) => void

  selectNode: (node: CanvasNode | null) => void
  selectEdge: (edge: CanvasEdge | null) => void

  setLoading: (loading: boolean) => void
  setDirty: (dirty: boolean) => void

  reset: () => void
}

const initialState = {
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  isLoading: false,
  isDirty: false,
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  ...initialState,

  setNodes: (nodes) => set({ nodes, isDirty: true }),
  setEdges: (edges) => set({ edges, isDirty: true }),

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as CanvasNode[],
      isDirty: true,
    })
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as CanvasEdge[],
      isDirty: true,
    })
  },

  onConnect: (connection: Connection) => {
    const newEdge: CanvasEdge = {
      ...connection,
      id: `edge-${Date.now()}`,
      data: {
        dataTypes: [],
        description: '',
        domains: [],
      },
    } as CanvasEdge

    set({
      edges: addEdge(newEdge, get().edges) as CanvasEdge[],
      isDirty: true,
    })
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
      isDirty: true,
    })
  },

  updateNode: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
      isDirty: true,
    })
  },

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
      selectedNode: get().selectedNode?.id === id ? null : get().selectedNode,
      isDirty: true,
    })
  },

  updateEdge: (id, data) => {
    set({
      edges: get().edges.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...edge.data, ...data } }
          : edge
      ),
      isDirty: true,
    })
  },

  deleteEdge: (id) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== id),
      selectedEdge: get().selectedEdge?.id === id ? null : get().selectedEdge,
      isDirty: true,
    })
  },

  selectNode: (node) => set({ selectedNode: node, selectedEdge: null }),
  selectEdge: (edge) => set({ selectedEdge: edge, selectedNode: null }),

  setLoading: (isLoading) => set({ isLoading }),
  setDirty: (isDirty) => set({ isDirty }),

  reset: () => set(initialState),
}))

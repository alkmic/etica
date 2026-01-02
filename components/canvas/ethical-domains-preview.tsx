'use client'

import { useMemo } from 'react'
import {
  Lock,
  Scale,
  Eye,
  User,
  Shield,
  MessageSquare,
  Leaf,
  Users,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { detectEthicalDomains, DetectedDomain, DomainDetectionContext } from '@/lib/rules/domain-detection'
import { CanvasNode, CanvasEdge } from '@/lib/stores/canvas-store'

interface EthicalDomainsPreviewProps {
  sia: {
    domain: string
    decisionType: string
    scale: string
    hasVulnerable: boolean
    dataTypes: string[]
  }
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  isExpanded: boolean
  onToggleExpand: () => void
}

const domainIcons: Record<string, React.ElementType> = {
  PRIVACY: Lock,
  EQUITY: Scale,
  TRANSPARENCY: Eye,
  AUTONOMY: User,
  SECURITY: Shield,
  RECOURSE: MessageSquare,
  SUSTAINABILITY: Leaf,
  RESPONSIBILITY: Users,
}

const confidenceColors: Record<string, { bg: string; text: string; badge: string }> = {
  HIGH: { bg: 'bg-red-100', text: 'text-red-700', badge: 'destructive' },
  MEDIUM: { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'warning' },
  LOW: { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'secondary' },
}

export function EthicalDomainsPreview({
  sia,
  nodes,
  edges,
  isExpanded,
  onToggleExpand,
}: EthicalDomainsPreviewProps) {
  // Prepare context for domain detection
  const detectionContext: DomainDetectionContext = useMemo(() => ({
    sia: {
      domain: sia.domain,
      decisionType: sia.decisionType,
      scale: sia.scale,
      hasVulnerable: sia.hasVulnerable,
      dataTypes: sia.dataTypes || [],
    },
    nodes: nodes.map(n => ({
      id: n.id,
      type: n.data.type,
      label: n.data.label,
      dataTypes: n.data.dataTypes,
    })),
    edges: edges.map(e => ({
      id: e.id,
      sourceId: e.source,
      targetId: e.target,
      dataCategories: e.data?.dataTypes,
    })),
  }), [sia, nodes, edges])

  // Detect domains
  const detectedDomains = useMemo(() => {
    if (nodes.length === 0) return []
    return detectEthicalDomains(detectionContext)
  }, [detectionContext, nodes.length])

  // Group by confidence
  const highConfidence = detectedDomains.filter(d => d.confidence === 'HIGH')
  const mediumConfidence = detectedDomains.filter(d => d.confidence === 'MEDIUM')
  const lowConfidence = detectedDomains.filter(d => d.confidence === 'LOW')

  if (nodes.length === 0) {
    return null
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="absolute bottom-20 right-4 z-10 w-72">
        <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border overflow-hidden">
            {/* Header - always visible */}
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {detectedDomains.slice(0, 4).map((domain) => {
                      const Icon = domainIcons[domain.id] || AlertTriangle
                      return (
                        <div
                          key={domain.id}
                          className="h-6 w-6 rounded-full border-2 border-white flex items-center justify-center"
                          style={{ backgroundColor: `${domain.color}20` }}
                        >
                          <Icon className="h-3 w-3" style={{ color: domain.color }} />
                        </div>
                      )
                    })}
                    {detectedDomains.length > 4 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs font-medium">
                        +{detectedDomains.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">
                      Domaines éthiques
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {detectedDomains.length} détecté{detectedDomains.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </CollapsibleTrigger>

            {/* Expanded content */}
            <CollapsibleContent>
              <div className="border-t px-3 py-2 max-h-64 overflow-auto">
                {highConfidence.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-xs font-medium text-red-700">Vigilance élevée</span>
                    </div>
                    <div className="space-y-2">
                      {highConfidence.map((domain) => (
                        <DomainItem key={domain.id} domain={domain} />
                      ))}
                    </div>
                  </div>
                )}

                {mediumConfidence.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-3 w-3 text-orange-500" />
                      <span className="text-xs font-medium text-orange-700">Vigilance modérée</span>
                    </div>
                    <div className="space-y-2">
                      {mediumConfidence.map((domain) => (
                        <DomainItem key={domain.id} domain={domain} />
                      ))}
                    </div>
                  </div>
                )}

                {lowConfidence.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-3 w-3 text-blue-500" />
                      <span className="text-xs font-medium text-blue-700">À surveiller</span>
                    </div>
                    <div className="space-y-2">
                      {lowConfidence.map((domain) => (
                        <DomainItem key={domain.id} domain={domain} />
                      ))}
                    </div>
                  </div>
                )}

                {detectedDomains.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Ajoutez des éléments pour voir les domaines éthiques impactés
                  </p>
                )}
              </div>

              {/* Footer with explanation */}
              <div className="border-t p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  Ces domaines sont automatiquement détectés en fonction de votre cartographie.
                  Sauvegardez pour analyser les tensions éthiques.
                </p>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </TooltipProvider>
  )
}

function DomainItem({ domain }: { domain: DetectedDomain }) {
  const Icon = domainIcons[domain.id] || AlertTriangle
  const colors = confidenceColors[domain.confidence]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`flex items-center gap-2 p-2 rounded-lg ${colors.bg} cursor-help`}>
          <div
            className="h-6 w-6 rounded flex items-center justify-center"
            style={{ backgroundColor: `${domain.color}30` }}
          >
            <Icon className="h-3 w-3" style={{ color: domain.color }} />
          </div>
          <span className={`text-sm font-medium ${colors.text}`}>{domain.label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-xs">
        <p className="font-medium mb-1">{domain.label}</p>
        <ul className="text-xs space-y-1">
          {domain.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-1">
              <span className="text-muted-foreground">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}

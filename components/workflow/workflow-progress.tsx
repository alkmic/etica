'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  ClipboardList,
  Map,
  AlertTriangle,
  CheckSquare,
  FileText,
  Check,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface WorkflowStep {
  id: string
  label: string
  shortLabel: string
  icon: React.ElementType
  href: string
  description: string
  isComplete: (stats: WorkflowStats) => boolean
  isActive: (pathname: string, siaId: string) => boolean
}

interface WorkflowStats {
  hasNodes: boolean
  hasEdges: boolean
  tensionsCount: number
  tensionsArbitratedCount: number
  actionsCount: number
  actionsCompletedCount: number
}

interface WorkflowProgressProps {
  siaId: string
  stats: WorkflowStats
  compact?: boolean
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    shortLabel: 'Apercu',
    icon: ClipboardList,
    href: '',
    description: 'Vue d\'ensemble du SIA',
    isComplete: () => true, // Always complete once SIA exists
    isActive: (pathname, siaId) => pathname === `/${siaId}` || pathname === `/${siaId}/`,
  },
  {
    id: 'map',
    label: 'Cartographie',
    shortLabel: 'Carte',
    icon: Map,
    href: '/map',
    description: 'Modélisez les flux de données',
    isComplete: (stats) => stats.hasNodes && stats.hasEdges,
    isActive: (pathname, siaId) => pathname.startsWith(`/${siaId}/map`),
  },
  {
    id: 'tensions',
    label: 'Tensions',
    shortLabel: 'Tensions',
    icon: AlertTriangle,
    href: '/tensions',
    description: 'Analysez les dilemmes éthiques',
    isComplete: (stats) => stats.tensionsCount > 0 && stats.tensionsArbitratedCount === stats.tensionsCount,
    isActive: (pathname, siaId) => pathname.startsWith(`/${siaId}/tensions`),
  },
  {
    id: 'actions',
    label: 'Plan d\'action',
    shortLabel: 'Actions',
    icon: CheckSquare,
    href: '/actions',
    description: 'Définissez les mesures correctives',
    isComplete: (stats) => stats.actionsCount > 0 && stats.actionsCompletedCount === stats.actionsCount,
    isActive: (pathname, siaId) => pathname.startsWith(`/${siaId}/actions`),
  },
  {
    id: 'files',
    label: 'Documentation',
    shortLabel: 'Docs',
    icon: FileText,
    href: '/files',
    description: 'Exportez et archivez',
    isComplete: () => false, // User decides when complete
    isActive: (pathname, siaId) => pathname.startsWith(`/${siaId}/files`),
  },
]

export function WorkflowProgress({ siaId, stats, compact = false }: WorkflowProgressProps) {
  const pathname = usePathname()

  // Find current step index
  const currentStepIndex = WORKFLOW_STEPS.findIndex(step => step.isActive(pathname, siaId))

  // Calculate overall progress
  const completedSteps = WORKFLOW_STEPS.filter(step => step.isComplete(stats)).length
  const progressPercent = Math.round((completedSteps / WORKFLOW_STEPS.length) * 100)

  if (compact) {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = step.isActive(pathname, siaId)
            const isComplete = step.isComplete(stats)
            const isPast = index < currentStepIndex

            return (
              <Tooltip key={step.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={`/${siaId}${step.href}`}
                    className={cn(
                      'relative flex items-center justify-center w-8 h-8 rounded-md transition-all',
                      isActive && 'bg-primary text-primary-foreground shadow-sm',
                      !isActive && isComplete && 'bg-green-100 text-green-700',
                      !isActive && !isComplete && isPast && 'bg-muted text-muted-foreground',
                      !isActive && !isComplete && !isPast && 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {isComplete && !isActive ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>
    )
  }

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs text-muted-foreground">Progression du workflow</span>
        <span className="text-xs font-medium">{progressPercent}%</span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between">
        {WORKFLOW_STEPS.map((step, index) => {
          const Icon = step.icon
          const isActive = step.isActive(pathname, siaId)
          const isComplete = step.isComplete(stats)
          const isPast = index < currentStepIndex
          const isLast = index === WORKFLOW_STEPS.length - 1

          return (
            <div key={step.id} className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/${siaId}${step.href}`}
                      className="flex flex-col items-center group"
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                          isActive && 'bg-primary border-primary text-primary-foreground shadow-lg scale-110',
                          !isActive && isComplete && 'bg-green-100 border-green-500 text-green-700',
                          !isActive && !isComplete && isPast && 'bg-muted border-muted-foreground/30 text-muted-foreground',
                          !isActive && !isComplete && !isPast && 'border-muted-foreground/30 text-muted-foreground group-hover:border-primary group-hover:text-primary'
                        )}
                      >
                        {isComplete && !isActive ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'mt-2 text-xs font-medium text-center max-w-[80px]',
                          isActive && 'text-primary',
                          !isActive && isComplete && 'text-green-700',
                          !isActive && !isComplete && 'text-muted-foreground'
                        )}
                      >
                        {step.shortLabel}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Connector */}
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 min-w-[20px] max-w-[60px]',
                    index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

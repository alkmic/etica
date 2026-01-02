'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Types for the matrix
interface DilemmaData {
  id: string
  severity: number // 1-5
  maturity: number // 0-4
  name?: string
  ruleName?: string
}

interface CriticalityMatrixProps {
  dilemmas: DilemmaData[]
  onCellClick?: (severity: number, maturity: number, dilemmas: DilemmaData[]) => void
  className?: string
  showLegend?: boolean
  compact?: boolean
}

// Maturity levels (0-4)
const MATURITY_LEVELS = [
  { level: 0, label: 'Non identifié', shortLabel: 'N/I', description: 'Dilemme non reconnu' },
  { level: 1, label: 'Identifié', shortLabel: 'Ident.', description: 'Dilemme reconnu mais non traité' },
  { level: 2, label: 'Analysé', shortLabel: 'Anal.', description: 'Dilemme analysé, options documentées' },
  { level: 3, label: 'Arbitré', shortLabel: 'Arbit.', description: 'Décision prise avec justification' },
  { level: 4, label: 'Validé', shortLabel: 'Valid.', description: 'Arbitrage validé par parties prenantes' },
]

// Severity levels (1-5)
const SEVERITY_LEVELS = [
  { level: 1, label: 'Minimal', color: 'bg-green-500' },
  { level: 2, label: 'Faible', color: 'bg-lime-500' },
  { level: 3, label: 'Modéré', color: 'bg-yellow-500' },
  { level: 4, label: 'Élevé', color: 'bg-orange-500' },
  { level: 5, label: 'Critique', color: 'bg-red-500' },
]

// Calculate criticality zone based on severity and maturity
// Higher severity + lower maturity = more critical
function getCriticalityZone(severity: number, maturity: number): 'critical' | 'warning' | 'attention' | 'managed' | 'optimal' {
  const criticalityScore = severity * (5 - maturity)

  if (criticalityScore >= 15) return 'critical'
  if (criticalityScore >= 10) return 'warning'
  if (criticalityScore >= 5) return 'attention'
  if (criticalityScore >= 2) return 'managed'
  return 'optimal'
}

function getCellStyle(zone: ReturnType<typeof getCriticalityZone>): string {
  switch (zone) {
    case 'critical':
      return 'bg-red-500/20 border-red-500 hover:bg-red-500/30'
    case 'warning':
      return 'bg-orange-500/20 border-orange-500 hover:bg-orange-500/30'
    case 'attention':
      return 'bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30'
    case 'managed':
      return 'bg-blue-500/20 border-blue-500 hover:bg-blue-500/30'
    case 'optimal':
      return 'bg-green-500/20 border-green-500 hover:bg-green-500/30'
  }
}

function getZoneLabel(zone: ReturnType<typeof getCriticalityZone>): string {
  switch (zone) {
    case 'critical':
      return 'Critique - Action immédiate requise'
    case 'warning':
      return 'Alerte - Action prioritaire'
    case 'attention':
      return 'Attention - À traiter'
    case 'managed':
      return 'Géré - Suivi normal'
    case 'optimal':
      return 'Optimal - Maintenir'
  }
}

export function CriticalityMatrix({
  dilemmas,
  onCellClick,
  className,
  showLegend = true,
  compact = false,
}: CriticalityMatrixProps) {
  // Build the matrix data
  const matrixData = useMemo(() => {
    const matrix: Map<string, DilemmaData[]> = new Map()

    // Initialize all cells
    for (let severity = 1; severity <= 5; severity++) {
      for (let maturity = 0; maturity <= 4; maturity++) {
        matrix.set(`${severity}-${maturity}`, [])
      }
    }

    // Populate with dilemmas
    dilemmas.forEach((dilemma) => {
      const key = `${dilemma.severity}-${dilemma.maturity}`
      const cell = matrix.get(key)
      if (cell) {
        cell.push(dilemma)
      }
    })

    return matrix
  }, [dilemmas])

  // Calculate statistics
  const stats = useMemo(() => {
    const zones = {
      critical: 0,
      warning: 0,
      attention: 0,
      managed: 0,
      optimal: 0,
    }

    dilemmas.forEach((d) => {
      const zone = getCriticalityZone(d.severity, d.maturity)
      zones[zone]++
    })

    return zones
  }, [dilemmas])

  const cellSize = compact ? 'h-10 w-10' : 'h-14 w-14'

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Matrice de criticité</span>
          <Badge variant="outline">{dilemmas.length} dilemme(s)</Badge>
        </CardTitle>
        <CardDescription>
          Sévérité (vertical) × Maturité d'arbitrage (horizontal)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              {/* Header row - Maturity levels */}
              <div className="flex items-end mb-2">
                <div className={cn('flex-shrink-0', compact ? 'w-16' : 'w-20')} />
                {MATURITY_LEVELS.map((m) => (
                  <div
                    key={m.level}
                    className={cn('flex-1 text-center', compact ? 'px-0.5' : 'px-1')}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <span className={cn(
                            'font-medium',
                            compact ? 'text-[10px]' : 'text-xs'
                          )}>
                            {compact ? m.shortLabel : m.label}
                          </span>
                          {!compact && (
                            <div className="text-[10px] text-muted-foreground">
                              M{m.level}
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>

              {/* Matrix rows - Severity levels (highest first) */}
              {[...SEVERITY_LEVELS].reverse().map((s) => (
                <div key={s.level} className="flex items-center mb-1">
                  {/* Row header - Severity */}
                  <div className={cn(
                    'flex-shrink-0 flex items-center gap-1',
                    compact ? 'w-16' : 'w-20'
                  )}>
                    <div className={cn(
                      'rounded-full',
                      compact ? 'w-2 h-2' : 'w-3 h-3',
                      s.color
                    )} />
                    <span className={cn(
                      'font-medium truncate',
                      compact ? 'text-[10px]' : 'text-xs'
                    )}>
                      {compact ? `S${s.level}` : s.label}
                    </span>
                  </div>

                  {/* Cells */}
                  {MATURITY_LEVELS.map((m) => {
                    const cellDilemmas = matrixData.get(`${s.level}-${m.level}`) || []
                    const zone = getCriticalityZone(s.level, m.level)
                    const hasContent = cellDilemmas.length > 0

                    return (
                      <div
                        key={m.level}
                        className={cn('flex-1', compact ? 'px-0.5' : 'px-1')}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onCellClick?.(s.level, m.level, cellDilemmas)}
                              className={cn(
                                'w-full border-2 rounded-lg flex items-center justify-center transition-colors',
                                cellSize,
                                getCellStyle(zone),
                                hasContent ? 'cursor-pointer' : 'cursor-default opacity-50'
                              )}
                              disabled={!hasContent}
                            >
                              {hasContent && (
                                <span className={cn(
                                  'font-bold',
                                  compact ? 'text-sm' : 'text-lg'
                                )}>
                                  {cellDilemmas.length}
                                </span>
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">
                              Sévérité {s.level} ({s.label}) × Maturité {m.level}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getZoneLabel(zone)}
                            </p>
                            {hasContent && (
                              <div className="mt-2 border-t pt-2">
                                <p className="text-xs font-medium mb-1">
                                  {cellDilemmas.length} dilemme(s) :
                                </p>
                                <ul className="text-xs space-y-0.5">
                                  {cellDilemmas.slice(0, 3).map((d) => (
                                    <li key={d.id} className="truncate max-w-[200px]">
                                      • {d.name || d.ruleName || d.id}
                                    </li>
                                  ))}
                                  {cellDilemmas.length > 3 && (
                                    <li className="text-muted-foreground">
                                      + {cellDilemmas.length - 3} autre(s)
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )
                  })}
                </div>
              ))}

              {/* Axis labels */}
              <div className="flex mt-4">
                <div className={cn('flex-shrink-0', compact ? 'w-16' : 'w-20')} />
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground">
                    → Maturité d'arbitrage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>

        {/* Legend */}
        {showLegend && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Légende des zones</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { zone: 'critical' as const, label: 'Critique', count: stats.critical },
                { zone: 'warning' as const, label: 'Alerte', count: stats.warning },
                { zone: 'attention' as const, label: 'Attention', count: stats.attention },
                { zone: 'managed' as const, label: 'Géré', count: stats.managed },
                { zone: 'optimal' as const, label: 'Optimal', count: stats.optimal },
              ].map(({ zone, label, count }) => (
                <div
                  key={zone}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg border-2',
                    getCellStyle(zone)
                  )}
                >
                  <span className="text-xs font-medium">{label}</span>
                  <Badge variant="secondary" className="text-[10px] ml-auto">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Priority summary */}
        {(stats.critical > 0 || stats.warning > 0) && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm font-medium text-destructive">
              {stats.critical > 0 && (
                <span>{stats.critical} dilemme(s) critique(s) nécessitant une action immédiate. </span>
              )}
              {stats.warning > 0 && (
                <span>{stats.warning} dilemme(s) en alerte à traiter en priorité.</span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact version for embedding in other views
export function CriticalityMatrixMini({
  dilemmas,
  onCellClick,
}: Pick<CriticalityMatrixProps, 'dilemmas' | 'onCellClick'>) {
  return (
    <CriticalityMatrix
      dilemmas={dilemmas}
      onCellClick={onCellClick}
      compact
      showLegend={false}
    />
  )
}

// Summary stats component
export function CriticalityStats({ dilemmas }: { dilemmas: DilemmaData[] }) {
  const stats = useMemo(() => {
    const zones = {
      critical: 0,
      warning: 0,
      attention: 0,
      managed: 0,
      optimal: 0,
    }

    dilemmas.forEach((d) => {
      const zone = getCriticalityZone(d.severity, d.maturity)
      zones[zone]++
    })

    const total = dilemmas.length
    const resolved = zones.managed + zones.optimal
    const pending = zones.critical + zones.warning + zones.attention

    return {
      zones,
      total,
      resolved,
      pending,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    }
  }, [dilemmas])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Total dilemmes</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-red-500">
            {stats.zones.critical + stats.zones.warning}
          </div>
          <p className="text-xs text-muted-foreground">À traiter en priorité</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
          <p className="text-xs text-muted-foreground">Résolus/Gérés</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold">{stats.resolutionRate}%</div>
          <p className="text-xs text-muted-foreground">Taux de résolution</p>
        </CardContent>
      </Card>
    </div>
  )
}

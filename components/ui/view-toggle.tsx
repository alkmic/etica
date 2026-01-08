'use client'

import * as React from 'react'
import {
  LayoutGrid,
  List,
  Kanban,
  Table,
  Calendar,
  LineChart,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

// =============================================================================
// TYPES
// =============================================================================

export type ViewMode = 'list' | 'grid' | 'kanban' | 'table' | 'calendar' | 'chart'

export interface ViewOption {
  id: ViewMode
  label: string
  icon: LucideIcon
  description?: string
}

// =============================================================================
// OPTIONS PAR DÉFAUT
// =============================================================================

export const DEFAULT_VIEW_OPTIONS: ViewOption[] = [
  {
    id: 'list',
    label: 'Liste',
    icon: List,
    description: 'Vue liste compacte',
  },
  {
    id: 'grid',
    label: 'Grille',
    icon: LayoutGrid,
    description: 'Vue en cartes',
  },
  {
    id: 'kanban',
    label: 'Kanban',
    icon: Kanban,
    description: 'Vue colonnes par statut',
  },
  {
    id: 'table',
    label: 'Tableau',
    icon: Table,
    description: 'Vue tableau détaillé',
  },
]

export const TENSION_VIEW_OPTIONS: ViewOption[] = [
  {
    id: 'list',
    label: 'Liste',
    icon: List,
    description: 'Liste des tensions',
  },
  {
    id: 'grid',
    label: 'Cartes',
    icon: LayoutGrid,
    description: 'Tensions en cartes',
  },
  {
    id: 'kanban',
    label: 'Kanban',
    icon: Kanban,
    description: 'Par statut',
  },
]

export const ACTION_VIEW_OPTIONS: ViewOption[] = [
  {
    id: 'list',
    label: 'Liste',
    icon: List,
    description: 'Liste des actions',
  },
  {
    id: 'kanban',
    label: 'Kanban',
    icon: Kanban,
    description: 'Par statut',
  },
  {
    id: 'calendar',
    label: 'Calendrier',
    icon: Calendar,
    description: 'Par échéance',
  },
]

export const DASHBOARD_VIEW_OPTIONS: ViewOption[] = [
  {
    id: 'grid',
    label: 'Dashboard',
    icon: LayoutGrid,
    description: 'Vue synthétique',
  },
  {
    id: 'chart',
    label: 'Graphiques',
    icon: LineChart,
    description: 'Vue graphiques détaillés',
  },
  {
    id: 'table',
    label: 'Données',
    icon: Table,
    description: 'Vue données brutes',
  },
]

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

interface ViewToggleProps {
  /** Mode de vue actuel */
  value: ViewMode
  /** Callback de changement */
  onChange: (mode: ViewMode) => void
  /** Options disponibles */
  options?: ViewOption[]
  /** Taille des boutons */
  size?: 'sm' | 'default'
  /** Variante d'affichage */
  variant?: 'default' | 'outline' | 'pills'
  /** Afficher les labels */
  showLabels?: boolean
  /** Afficher les tooltips */
  showTooltips?: boolean
  /** Classe CSS additionnelle */
  className?: string
}

export function ViewToggle({
  value,
  onChange,
  options = DEFAULT_VIEW_OPTIONS,
  size = 'default',
  variant = 'default',
  showLabels = false,
  showTooltips = true,
  className,
}: ViewToggleProps) {
  const containerClasses = {
    default: 'inline-flex items-center rounded-md border bg-muted p-1',
    outline: 'inline-flex items-center gap-1',
    pills: 'inline-flex items-center gap-1',
  }

  const buttonClasses = {
    default: {
      base: 'rounded-sm px-2.5 py-1.5 transition-all',
      active: 'bg-background text-foreground shadow-sm',
      inactive: 'text-muted-foreground hover:text-foreground hover:bg-background/50',
    },
    outline: {
      base: 'rounded-md border transition-all',
      active: 'border-primary bg-primary/5 text-primary',
      inactive: 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
    },
    pills: {
      base: 'rounded-full transition-all',
      active: 'bg-primary text-primary-foreground',
      inactive: 'text-muted-foreground hover:text-foreground hover:bg-muted',
    },
  }

  const sizeClasses = {
    sm: 'h-7 px-2 text-xs',
    default: 'h-8 px-3 text-sm',
  }

  const iconSizeClasses = {
    sm: 'w-3.5 h-3.5',
    default: 'w-4 h-4',
  }

  const renderButton = (option: ViewOption) => {
    const isActive = value === option.id
    const Icon = option.icon

    const button = (
      <button
        key={option.id}
        type="button"
        onClick={() => onChange(option.id)}
        className={cn(
          buttonClasses[variant].base,
          sizeClasses[size],
          isActive
            ? buttonClasses[variant].active
            : buttonClasses[variant].inactive,
          'inline-flex items-center gap-1.5'
        )}
      >
        <Icon className={iconSizeClasses[size]} />
        {showLabels && <span>{option.label}</span>}
      </button>
    )

    if (showTooltips && !showLabels) {
      return (
        <TooltipProvider key={option.id} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p className="font-medium">{option.label}</p>
              {option.description && (
                <p className="text-muted-foreground">{option.description}</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  }

  return (
    <div className={cn(containerClasses[variant], className)}>
      {options.map(renderButton)}
    </div>
  )
}

// =============================================================================
// VARIANTES SPÉCIALISÉES
// =============================================================================

interface SpecializedViewToggleProps
  extends Omit<ViewToggleProps, 'options'> {}

export function TensionViewToggle(props: SpecializedViewToggleProps) {
  return <ViewToggle options={TENSION_VIEW_OPTIONS} {...props} />
}

export function ActionViewToggle(props: SpecializedViewToggleProps) {
  return <ViewToggle options={ACTION_VIEW_OPTIONS} {...props} />
}

export function DashboardViewToggle(props: SpecializedViewToggleProps) {
  return <ViewToggle options={DASHBOARD_VIEW_OPTIONS} {...props} />
}

// =============================================================================
// TOGGLE AVEC ÉTAT LOCAL (hook)
// =============================================================================

export function useViewMode(
  defaultMode: ViewMode = 'list',
  storageKey?: string
): [ViewMode, (mode: ViewMode) => void] {
  const [mode, setMode] = React.useState<ViewMode>(() => {
    if (storageKey && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored && ['list', 'grid', 'kanban', 'table', 'calendar', 'chart'].includes(stored)) {
        return stored as ViewMode
      }
    }
    return defaultMode
  })

  const handleChange = React.useCallback(
    (newMode: ViewMode) => {
      setMode(newMode)
      if (storageKey && typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newMode)
      }
    },
    [storageKey]
  )

  return [mode, handleChange]
}

// =============================================================================
// TOGGLE SEGMENTÉ (style Apple)
// =============================================================================

interface SegmentedToggleOption<T extends string> {
  id: T
  label: string
  icon?: LucideIcon
}

interface SegmentedToggleProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: SegmentedToggleOption<T>[]
  size?: 'sm' | 'default' | 'lg'
  fullWidth?: boolean
  className?: string
}

export function SegmentedToggle<T extends string>({
  value,
  onChange,
  options,
  size = 'default',
  fullWidth = false,
  className,
}: SegmentedToggleProps<T>) {
  const sizeClasses = {
    sm: 'h-7 text-xs',
    default: 'h-9 text-sm',
    lg: 'h-11 text-base',
  }

  const activeIndex = options.findIndex((opt) => opt.id === value)
  const segmentWidth = 100 / options.length

  return (
    <div
      className={cn(
        'relative inline-flex items-center rounded-lg bg-muted p-1',
        fullWidth && 'w-full',
        className
      )}
    >
      {/* Indicator animé */}
      <div
        className="absolute top-1 bottom-1 rounded-md bg-background shadow-sm transition-all duration-200 ease-out"
        style={{
          left: `calc(${activeIndex * segmentWidth}% + 4px)`,
          width: `calc(${segmentWidth}% - 8px)`,
        }}
      />

      {/* Options */}
      {options.map((option) => {
        const isActive = value === option.id
        const Icon = option.icon

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              'relative z-10 flex-1 inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors',
              sizeClasses[size],
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default ViewToggle

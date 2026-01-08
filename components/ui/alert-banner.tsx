'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  ChevronRight,
  Bell,
  Clock,
  Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

// =============================================================================
// STYLES
// =============================================================================

const alertBannerVariants = cva(
  'relative flex items-start gap-3 rounded-lg border p-4 transition-all',
  {
    variants: {
      variant: {
        default: 'bg-background border-border',
        info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-100',
        warning: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-100',
        error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-800 dark:text-red-100',
        success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800 dark:text-green-100',
        critical: 'bg-red-100 border-red-300 text-red-900 dark:bg-red-900/50 dark:border-red-700 dark:text-red-100 animate-pulse-subtle',
        neutral: 'bg-gray-50 border-gray-200 text-gray-900 dark:bg-gray-900/30 dark:border-gray-700 dark:text-gray-100',
      },
      size: {
        sm: 'p-2 text-sm gap-2',
        md: 'p-4 text-base gap-3',
        lg: 'p-5 text-lg gap-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const iconVariants: Record<string, string> = {
  default: 'text-muted-foreground',
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
  success: 'text-green-600 dark:text-green-400',
  critical: 'text-red-700 dark:text-red-300',
  neutral: 'text-gray-600 dark:text-gray-400',
}

// =============================================================================
// TYPES
// =============================================================================

export interface AlertBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertBannerVariants> {
  /** Titre de l'alerte */
  title?: string
  /** Description */
  description?: React.ReactNode
  /** Icône personnalisée */
  icon?: React.ReactNode
  /** Action principale */
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  /** Action secondaire */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  /** Peut être fermée */
  dismissible?: boolean
  /** Callback de fermeture */
  onDismiss?: () => void
  /** Horodatage */
  timestamp?: Date | string
  /** Badge de comptage */
  count?: number
  /** Lien vers détails */
  href?: string
}

// =============================================================================
// ICÔNES PAR DÉFAUT
// =============================================================================

function getDefaultIcon(variant: string | null | undefined) {
  switch (variant) {
    case 'info':
      return Info
    case 'warning':
      return AlertTriangle
    case 'error':
      return AlertCircle
    case 'success':
      return CheckCircle
    case 'critical':
      return Flame
    default:
      return Bell
  }
}

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

export function AlertBanner({
  variant,
  size,
  title,
  description,
  icon,
  action,
  secondaryAction,
  dismissible = false,
  onDismiss,
  timestamp,
  count,
  href,
  className,
  children,
  ...props
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  const IconComponent = getDefaultIcon(variant)
  const iconSizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'

  const formattedTimestamp = timestamp
    ? typeof timestamp === 'string'
      ? timestamp
      : timestamp.toLocaleString('fr-FR', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
    : null

  return (
    <div
      className={cn(alertBannerVariants({ variant, size }), className)}
      role="alert"
      {...props}
    >
      {/* Icône */}
      <div className={cn('shrink-0 mt-0.5', iconVariants[variant || 'default'])}>
        {icon || <IconComponent className={iconSizeClass} />}
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        {/* Header avec titre et timestamp */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {title && (
              <h4 className={cn('font-semibold', size === 'sm' && 'text-sm')}>
                {title}
              </h4>
            )}
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  'inline-flex items-center justify-center rounded-full font-medium',
                  size === 'sm' ? 'h-4 px-1.5 text-xs' : 'h-5 px-2 text-xs',
                  variant === 'critical' || variant === 'error'
                    ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100'
                    : variant === 'warning'
                    ? 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-100'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                )}
              >
                {count}
              </span>
            )}
          </div>
          {formattedTimestamp && (
            <span className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formattedTimestamp}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p
            className={cn(
              'text-muted-foreground mt-1',
              size === 'sm' && 'text-xs',
              size === 'lg' && 'text-base'
            )}
          >
            {description}
          </p>
        )}

        {/* Enfants */}
        {children}

        {/* Actions */}
        {(action || secondaryAction || href) && (
          <div className="flex items-center gap-2 mt-3">
            {action && (
              <Button
                size={size === 'sm' ? 'sm' : 'default'}
                variant={action.variant || 'default'}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                size={size === 'sm' ? 'sm' : 'default'}
                variant="ghost"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
            {href && (
              <a
                href={href}
                className={cn(
                  'inline-flex items-center gap-1 text-sm font-medium hover:underline',
                  iconVariants[variant || 'default']
                )}
              >
                Voir les détails
                <ChevronRight className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Bouton de fermeture */}
      {dismissible && (
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 -m-1 h-6 w-6 p-0 hover:bg-transparent"
          onClick={handleDismiss}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Fermer</span>
        </Button>
      )}
    </div>
  )
}

// =============================================================================
// VARIANTES PRÉDÉFINIES
// =============================================================================

interface AlertBannerPresetProps extends Omit<AlertBannerProps, 'variant'> {}

export function CriticalAlert(props: AlertBannerPresetProps) {
  return <AlertBanner variant="critical" {...props} />
}

export function WarningAlert(props: AlertBannerPresetProps) {
  return <AlertBanner variant="warning" {...props} />
}

export function InfoAlert(props: AlertBannerPresetProps) {
  return <AlertBanner variant="info" {...props} />
}

export function SuccessAlert(props: AlertBannerPresetProps) {
  return <AlertBanner variant="success" {...props} />
}

// =============================================================================
// LISTE D'ALERTES
// =============================================================================

interface AlertItem {
  id: string
  variant: AlertBannerProps['variant']
  title: string
  description?: string
  count?: number
  timestamp?: Date
  href?: string
}

interface AlertBannerListProps {
  alerts: AlertItem[]
  onDismiss?: (id: string) => void
  maxVisible?: number
  className?: string
}

export function AlertBannerList({
  alerts,
  onDismiss,
  maxVisible = 3,
  className,
}: AlertBannerListProps) {
  const [dismissedIds, setDismissedIds] = React.useState<Set<string>>(new Set())

  const visibleAlerts = alerts
    .filter((alert) => !dismissedIds.has(alert.id))
    .slice(0, maxVisible)

  const hiddenCount = alerts.length - dismissedIds.size - visibleAlerts.length

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => {
      const newSet = new Set(prev)
      newSet.add(id)
      return newSet
    })
    onDismiss?.(id)
  }

  if (visibleAlerts.length === 0) return null

  return (
    <div className={cn('space-y-2', className)}>
      {visibleAlerts.map((alert) => (
        <AlertBanner
          key={alert.id}
          variant={alert.variant}
          title={alert.title}
          description={alert.description}
          count={alert.count}
          timestamp={alert.timestamp}
          href={alert.href}
          dismissible
          onDismiss={() => handleDismiss(alert.id)}
          size="sm"
        />
      ))}
      {hiddenCount > 0 && (
        <p className="text-sm text-muted-foreground text-center py-1">
          + {hiddenCount} autre{hiddenCount > 1 ? 's' : ''} alerte{hiddenCount > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

export default AlertBanner

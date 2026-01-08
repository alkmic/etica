'use client'

import * as React from 'react'
import { X, Check, ChevronDown, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from './badge'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'

// =============================================================================
// TYPES
// =============================================================================

export interface FilterOption {
  id: string
  label: string
  color?: string
  icon?: React.ReactNode
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
  multiple?: boolean
}

export interface ActiveFilter {
  groupId: string
  optionId: string
}

interface FilterChipsProps {
  /** Groupes de filtres disponibles */
  groups: FilterGroup[]
  /** Filtres actuellement actifs */
  activeFilters: ActiveFilter[]
  /** Callback de changement */
  onChange: (filters: ActiveFilter[]) => void
  /** Afficher le compteur sur les chips */
  showCounts?: boolean
  /** Classe CSS additionnelle */
  className?: string
}

// =============================================================================
// CHIP INDIVIDUEL
// =============================================================================

interface FilterChipProps {
  label: string
  color?: string
  icon?: React.ReactNode
  count?: number
  selected?: boolean
  showCount?: boolean
  onSelect?: () => void
  onRemove?: () => void
  size?: 'sm' | 'md'
}

export function FilterChip({
  label,
  color,
  icon,
  count,
  selected = false,
  showCount = true,
  onSelect,
  onRemove,
  size = 'md',
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={selected ? onRemove : onSelect}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-all',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        selected
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background hover:bg-muted border-border'
      )}
      style={
        selected && color
          ? { backgroundColor: color, borderColor: color }
          : undefined
      }
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {showCount && count !== undefined && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full min-w-[1.25rem] px-1',
            size === 'sm' ? 'text-[10px] h-4' : 'text-xs h-5',
            selected
              ? 'bg-primary-foreground/20'
              : 'bg-muted-foreground/10'
          )}
        >
          {count}
        </span>
      )}
      {selected && (
        <X
          className={cn(
            'shrink-0',
            size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'
          )}
        />
      )}
    </button>
  )
}

// =============================================================================
// SÉLECTEUR DE GROUPE (DROPDOWN)
// =============================================================================

interface FilterGroupSelectorProps {
  group: FilterGroup
  selectedOptions: string[]
  onChange: (optionIds: string[]) => void
  showCounts?: boolean
}

function FilterGroupSelector({
  group,
  selectedOptions,
  onChange,
  showCounts = true,
}: FilterGroupSelectorProps) {
  const handleToggle = (optionId: string) => {
    if (group.multiple) {
      // Multi-select
      if (selectedOptions.includes(optionId)) {
        onChange(selectedOptions.filter((id) => id !== optionId))
      } else {
        onChange([...selectedOptions, optionId])
      }
    } else {
      // Single-select
      if (selectedOptions.includes(optionId)) {
        onChange([])
      } else {
        onChange([optionId])
      }
    }
  }

  const selectedCount = selectedOptions.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'gap-1.5',
            selectedCount > 0 && 'border-primary bg-primary/5'
          )}
        >
          <Filter className="w-3.5 h-3.5" />
          {group.label}
          {selectedCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {selectedCount}
            </Badge>
          )}
          <ChevronDown className="w-3.5 h-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {group.options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.id}
            checked={selectedOptions.includes(option.id)}
            onCheckedChange={() => handleToggle(option.id)}
          >
            <div className="flex items-center gap-2 flex-1">
              {option.icon && <span className="shrink-0">{option.icon}</span>}
              {option.color && (
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: option.color }}
                />
              )}
              <span className="flex-1">{option.label}</span>
              {showCounts && option.count !== undefined && (
                <span className="text-muted-foreground text-xs">
                  {option.count}
                </span>
              )}
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

export function FilterChips({
  groups,
  activeFilters,
  onChange,
  showCounts = true,
  className,
}: FilterChipsProps) {
  // Grouper les filtres actifs par groupe
  const filtersByGroup = React.useMemo(() => {
    const map = new Map<string, string[]>()
    for (const filter of activeFilters) {
      const existing = map.get(filter.groupId) || []
      map.set(filter.groupId, [...existing, filter.optionId])
    }
    return map
  }, [activeFilters])

  // Gérer le changement pour un groupe
  const handleGroupChange = (groupId: string, optionIds: string[]) => {
    // Supprimer les anciens filtres de ce groupe
    const otherFilters = activeFilters.filter((f) => f.groupId !== groupId)
    // Ajouter les nouveaux
    const newFilters = optionIds.map((optionId) => ({
      groupId,
      optionId,
    }))
    onChange([...otherFilters, ...newFilters])
  }

  // Supprimer un filtre spécifique
  const handleRemoveFilter = (groupId: string, optionId: string) => {
    onChange(
      activeFilters.filter(
        (f) => !(f.groupId === groupId && f.optionId === optionId)
      )
    )
  }

  // Effacer tous les filtres
  const handleClearAll = () => {
    onChange([])
  }

  // Trouver l'option pour afficher son label
  const getOption = (
    groupId: string,
    optionId: string
  ): FilterOption | undefined => {
    const group = groups.find((g) => g.id === groupId)
    return group?.options.find((o) => o.id === optionId)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Sélecteurs de groupe */}
      <div className="flex flex-wrap items-center gap-2">
        {groups.map((group) => (
          <FilterGroupSelector
            key={group.id}
            group={group}
            selectedOptions={filtersByGroup.get(group.id) || []}
            onChange={(optionIds) => handleGroupChange(group.id, optionIds)}
            showCounts={showCounts}
          />
        ))}
      </div>

      {/* Chips des filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          {activeFilters.map((filter) => {
            const option = getOption(filter.groupId, filter.optionId)
            if (!option) return null
            return (
              <FilterChip
                key={`${filter.groupId}-${filter.optionId}`}
                label={option.label}
                color={option.color}
                icon={option.icon}
                count={showCounts ? option.count : undefined}
                selected
                onRemove={() =>
                  handleRemoveFilter(filter.groupId, filter.optionId)
                }
                size="sm"
              />
            )
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-6 px-2 text-xs text-muted-foreground"
          >
            Tout effacer
          </Button>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// CHIPS SIMPLES (pour affichage inline)
// =============================================================================

interface SimpleChipsProps {
  options: FilterOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  multiple?: boolean
  showCounts?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function SimpleChips({
  options,
  selected,
  onChange,
  multiple = true,
  showCounts = false,
  size = 'sm',
  className,
}: SimpleChipsProps) {
  const handleToggle = (optionId: string) => {
    if (multiple) {
      if (selected.includes(optionId)) {
        onChange(selected.filter((id) => id !== optionId))
      } else {
        onChange([...selected, optionId])
      }
    } else {
      if (selected.includes(optionId)) {
        onChange([])
      } else {
        onChange([optionId])
      }
    }
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {options.map((option) => (
        <FilterChip
          key={option.id}
          label={option.label}
          color={option.color}
          icon={option.icon}
          count={option.count}
          selected={selected.includes(option.id)}
          showCount={showCounts}
          onSelect={() => handleToggle(option.id)}
          onRemove={() => handleToggle(option.id)}
          size={size}
        />
      ))}
    </div>
  )
}

// =============================================================================
// CHIPS DE DOMAINES ÉTHIQUES
// =============================================================================

import { DOMAINS, type DomainId } from '@/lib/constants/domains'

interface DomainChipsProps {
  selected: DomainId[]
  onChange: (selected: DomainId[]) => void
  showCounts?: boolean
  counts?: Record<DomainId, number>
  size?: 'sm' | 'md'
  className?: string
}

export function DomainChips({
  selected,
  onChange,
  showCounts = false,
  counts,
  size = 'sm',
  className,
}: DomainChipsProps) {
  const options: FilterOption[] = Object.values(DOMAINS).map((domain) => ({
    id: domain.id,
    label: domain.label,
    color: domain.color,
    count: counts?.[domain.id as DomainId],
  }))

  return (
    <SimpleChips
      options={options}
      selected={selected}
      onChange={(ids) => onChange(ids as DomainId[])}
      multiple
      showCounts={showCounts}
      size={size}
      className={className}
    />
  )
}

export default FilterChips

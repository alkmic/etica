'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  CheckSquare,
  FolderOpen,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SidebarProps {
  siaId?: string
  siaName?: string
  collapsed?: boolean
  onToggle?: () => void
}

const mainNavItems = [
  {
    title: 'Tableau de bord',
    href: '',
    icon: LayoutDashboard,
  },
  {
    title: 'Cartographie',
    href: '/map',
    icon: Map,
  },
  {
    title: 'Tensions',
    href: '/tensions',
    icon: AlertTriangle,
  },
  {
    title: 'Plan d\'action',
    href: '/actions',
    icon: CheckSquare,
  },
  {
    title: 'Dossier',
    href: '/files',
    icon: FolderOpen,
  },
  {
    title: 'Paramètres',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar({ siaId, siaName, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const basePath = siaId ? `/${siaId}` : ''

  const isActive = (href: string) => {
    const fullPath = basePath + href
    if (href === '') {
      return pathname === basePath || pathname === basePath + '/'
    }
    return pathname.startsWith(fullPath)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex h-full flex-col border-r bg-card transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo et toggle */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                E
              </div>
              <span className="font-semibold">ETICA</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="mx-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                E
              </div>
            </Link>
          )}
          {onToggle && !collapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggle}
              className="text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* SIA context */}
        {siaId && (
          <div className={cn('border-b', collapsed ? 'p-2' : 'p-4')}>
            {!collapsed ? (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Système</p>
                <p className="font-medium truncate mt-1">{siaName || 'SIA'}</p>
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-lg bg-muted text-muted-foreground font-medium text-xs">
                    {siaName?.slice(0, 2).toUpperCase() || 'SI'}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{siaName || 'Système'}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          {siaId ? (
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                if (collapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link
                          href={`${basePath}${item.href}`}
                          className={cn(
                            'flex h-10 w-10 mx-auto items-center justify-center rounded-lg transition-colors',
                            active
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={`${basePath}${item.href}`}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      active
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          ) : (
            <div className="space-y-4">
              {!collapsed && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-3">
                      Actions rapides
                    </p>
                    <Button asChild className="w-full justify-start" variant="outline">
                      <Link href="/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau SIA
                      </Link>
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-3">
                      Systèmes récents
                    </p>
                    <p className="text-sm text-muted-foreground px-3">
                      Sélectionnez un système pour commencer.
                    </p>
                  </div>
                </>
              )}
              {collapsed && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild size="icon" variant="outline" className="mx-auto flex">
                      <Link href="/new">
                        <Plus className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Nouveau SIA</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Toggle (when collapsed) */}
        {onToggle && collapsed && (
          <div className="border-t p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="mx-auto flex"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Développer</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </aside>
    </TooltipProvider>
  )
}

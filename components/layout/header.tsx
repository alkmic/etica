'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  HelpCircle,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getInitials } from '@/lib/utils'

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
  actions?: React.ReactNode
}

export function Header({
  user,
  title,
  subtitle,
  showBackButton,
  backHref,
  actions,
}: HeaderProps) {
  const router = useRouter()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <TooltipProvider>
      <header className="flex h-16 items-center justify-between border-b bg-card px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => (backHref ? router.push(backHref) : router.back())}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Retour</TooltipContent>
            </Tooltip>
          )}

          {(title || subtitle) && (
            <div>
              {title && <h1 className="text-lg font-semibold">{title}</h1>}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Center section - Search (coming soon) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un SIA, une tension..."
                  className="pl-10 bg-muted/50 cursor-not-allowed"
                  disabled
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Recherche bientôt disponible</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Custom actions */}
          {actions}

          {/* Notifications */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                    >
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
                    <span className="font-medium text-sm">Nouvelle tension détectée</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Efficacité vs Transparence sur le système de scoring
                  </span>
                  <span className="text-xs text-muted-foreground">Il y a 2h</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="h-2 w-2 p-0 rounded-full bg-orange-500" />
                    <span className="font-medium text-sm">Action en retard</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Documenter les critères de scoring
                  </span>
                  <span className="text-xs text-muted-foreground">Échéance dépassée de 2 jours</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="info" className="h-2 w-2 p-0 rounded-full bg-blue-500" />
                    <span className="font-medium text-sm">Revue planifiée</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Revue trimestrielle du système de tri CV
                  </span>
                  <span className="text-xs text-muted-foreground">Dans 5 jours</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center">
                <Link href="/notifications">Voir toutes les notifications</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Changer le thème</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Thème</TooltipContent>
          </Tooltip>

          {/* Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/help">
                  <HelpCircle className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Aide</TooltipContent>
          </Tooltip>

          {/* User menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
    </TooltipProvider>
  )
}

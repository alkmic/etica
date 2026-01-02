'use client'

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Settings,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Tableau de bord', href: '', icon: LayoutDashboard },
  { name: 'Cartographie', href: '/map', icon: Map },
  { name: 'Tensions', href: '/tensions', icon: AlertTriangle },
  { name: 'Suivi', href: '/actions', icon: CheckCircle2 },
  { name: 'Documents', href: '/files', icon: FileText },
  { name: 'Paramètres', href: '/settings', icon: Settings },
]

export default function SiaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const pathname = usePathname()
  const siaId = params.siaId as string

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sub-navigation */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 h-12">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/">
                <ChevronLeft className="h-4 w-4" />
                Tous les SIA
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <nav className="flex items-center gap-1">
              {navigation.map((item) => {
                const href = `/${siaId}${item.href}`
                const isActive = pathname === href ||
                  (item.href !== '' && pathname.startsWith(href))

                return (
                  <Link
                    key={item.name}
                    href={href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  )
}

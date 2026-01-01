'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/demo', label: 'Démo' },
  { href: '/methodology', label: 'Méthodologie' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              E
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold leading-tight">ETICA</span>
              <span className="text-[10px] text-muted-foreground leading-tight hidden sm:block">
                Évaluation éthique des IA
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Tableau de bord
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Créer un compte</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-200 ease-in-out',
            mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-1 pt-2 border-t">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
            <hr className="my-2" />
            {isAuthenticated ? (
              <Button asChild className="justify-start">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Tableau de bord
                </Link>
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Button asChild size="sm">
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    Créer un compte
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

import Link from 'next/link'

const footerLinks = {
  product: [
    { href: '/methodology', label: 'Méthodologie' },
    { href: '/demo', label: 'Démo' },
  ],
  organization: [
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Confidentialité' },
    { href: '/terms', label: 'CGU' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                E
              </div>
              <span className="font-semibold">ETICA</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Évaluation éthique des systèmes d'intelligence artificielle.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Par le Global Council for Ethical AI
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-semibold mb-3">Produit</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization links */}
          <div>
            <h3 className="font-semibold mb-3">Organisation</h3>
            <ul className="space-y-2">
              {footerLinks.organization.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-semibold mb-3">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Global Council for Ethical AI. Tous droits réservés.</p>
          <p className="text-xs">Association loi 1901</p>
        </div>
      </div>
    </footer>
  )
}

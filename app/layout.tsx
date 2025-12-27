import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'ETICA - Analyse Éthique des Systèmes d\'IA',
    template: '%s | ETICA',
  },
  description:
    'Outil d\'analyse éthique pour les systèmes d\'intelligence artificielle. Identifiez les tensions, planifiez les actions et assurez la conformité.',
  keywords: [
    'IA',
    'éthique',
    'intelligence artificielle',
    'RGPD',
    'AI Act',
    'conformité',
    'audit',
    'biais',
    'transparence',
  ],
  authors: [{ name: 'ETICA' }],
  creator: 'ETICA',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    title: 'ETICA - Analyse Éthique des Systèmes d\'IA',
    description:
      'Outil d\'analyse éthique pour les systèmes d\'intelligence artificielle.',
    siteName: 'ETICA',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

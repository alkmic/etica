import Link from 'next/link'
import { ArrowRight, Shield, Eye, Scale, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Eye,
    title: 'Cartographie visuelle',
    description:
      'Modélisez les flux de données et de décisions de vos systèmes d\'IA avec un canvas intuitif.',
  },
  {
    icon: Shield,
    title: 'Détection des tensions',
    description:
      'Identifiez automatiquement les dilemmes éthiques potentiels grâce à notre moteur de règles.',
  },
  {
    icon: Scale,
    title: 'Arbitrage documenté',
    description:
      'Documentez vos choix éthiques de manière structurée pour assurer la traçabilité.',
  },
  {
    icon: CheckCircle,
    title: 'Plan d\'action',
    description:
      'Suivez les mesures de mitigation et démontrez vos progrès avec des preuves.',
  },
]

const domains = [
  { name: 'Vie privée', color: 'bg-violet-500' },
  { name: 'Équité', color: 'bg-pink-500' },
  { name: 'Transparence', color: 'bg-amber-500' },
  { name: 'Autonomie', color: 'bg-emerald-500' },
  { name: 'Sécurité', color: 'bg-blue-500' },
  { name: 'Recours', color: 'bg-red-500' },
  { name: 'Durabilité', color: 'bg-green-500' },
  { name: 'Responsabilité', color: 'bg-indigo-500' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
              E
            </div>
            <span className="text-xl font-semibold">ETICA</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Commencer</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Analysez l'éthique de vos{' '}
            <span className="text-primary">systèmes d'IA</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            ETICA vous aide à identifier les tensions éthiques, documenter vos arbitrages
            et suivre vos actions pour des systèmes d'IA responsables et conformes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">
                Créer un compte gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">Voir la démo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8 domains */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">8 domaines de vigilance</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Une analyse complète couvrant tous les droits fondamentaux
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {domains.map((domain) => (
            <div
              key={domain.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border"
            >
              <div className={`h-3 w-3 rounded-full ${domain.color}`} />
              <span className="text-sm font-medium">{domain.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Fonctionnalités clés</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tout ce dont vous avez besoin pour une analyse éthique complète
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-2xl bg-primary p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold">
            Prêt à rendre vos systèmes d'IA plus éthiques ?
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Créez votre premier système en moins de 5 minutes
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            asChild
          >
            <Link href="/register">
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                E
              </div>
              <span className="font-semibold">ETICA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ETICA. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                CGU
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

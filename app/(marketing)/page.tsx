'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Scale, CheckCircle, Map, Search, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const features = [
  {
    icon: Map,
    title: 'Cartographie visuelle',
    description:
      'Modélisez les flux de données et de décisions de vos systèmes d\'IA avec un canvas intuitif.',
  },
  {
    icon: Search,
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
  { name: 'Vie privée', color: 'bg-violet-500', description: 'Protection des données personnelles et respect de l\'intimité' },
  { name: 'Équité', color: 'bg-pink-500', description: 'Non-discrimination et traitement égal des individus' },
  { name: 'Transparence', color: 'bg-amber-500', description: 'Explicabilité des décisions et information des personnes' },
  { name: 'Autonomie', color: 'bg-emerald-500', description: 'Préservation du libre-arbitre et du consentement' },
  { name: 'Sécurité', color: 'bg-blue-500', description: 'Protection contre les risques et les usages malveillants' },
  { name: 'Recours', color: 'bg-red-500', description: 'Droit de contestation et de réparation' },
  { name: 'Durabilité', color: 'bg-green-500', description: 'Impact environnemental et pérennité' },
  { name: 'Responsabilité', color: 'bg-indigo-500', description: 'Imputabilité et gouvernance' },
]

export default function HomePage() {
  return (
    <TooltipProvider delayDuration={200}>
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium mb-6">
            <Shield className="h-4 w-4 text-primary" />
            Par le Global Council for Ethical AI
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Analysez l'éthique de vos{' '}
            <span className="text-primary">systèmes d'IA</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            ETICA vous aide à identifier les tensions éthiques, documenter vos arbitrages
            et suivre vos actions pour des systèmes d'IA responsables — au-delà de la simple conformité.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">
                Créer un compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">Voir la démo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Methodology teaser */}
      <section className="container mx-auto px-4 py-12">
        <Card className="border-primary/20 bg-primary/5 max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">L'éthique va au-delà de la conformité</h3>
                <p className="text-muted-foreground mb-4">
                  Un système peut être conforme au RGPD ou à l'AI Act tout en soulevant des questions
                  éthiques profondes. ETICA vous aide à identifier et arbitrer ces dilemmes de manière
                  consciente et documentée.
                </p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href="/methodology">
                    Découvrir notre méthodologie
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 8 domains */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">8 domaines de vigilance</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Une analyse complète couvrant tous les droits fondamentaux
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {domains.map((domain) => (
            <Tooltip key={domain.name}>
              <TooltipTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border hover:bg-muted transition-colors cursor-help">
                  <div className={`h-3 w-3 rounded-full ${domain.color}`} />
                  <span className="text-sm font-medium">{domain.name}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p>{domain.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Fonctionnalités clés</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Une approche structurée en quatre étapes
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-0 shadow-lg relative">
                <CardContent className="pt-6">
                  <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
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
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/methodology">
              En savoir plus sur la méthodologie
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-2xl bg-primary p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold">
            Prêt à évaluer l'éthique de vos systèmes d'IA ?
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Créez votre premier système en moins de 5 minutes
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              asChild
            >
              <Link href="/register">
                Créer un compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/demo">Voir la démo</Link>
            </Button>
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}

import Link from 'next/link'
import { Globe, Users, Target, Scale, BookOpen, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const values = [
  {
    icon: Scale,
    title: 'Indépendance',
    description: 'Nous proposons une évaluation objective, au-delà des intérêts commerciaux ou nationaux.',
  },
  {
    icon: Globe,
    title: 'Universalité',
    description: 'Nos standards visent à être applicables à tous les systèmes d\'IA, dans tous les contextes.',
  },
  {
    icon: BookOpen,
    title: 'Transparence',
    description: 'Notre méthodologie est ouverte et documentée, accessible à tous les acteurs.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Nous travaillons avec des experts, régulateurs et entreprises du monde entier.',
  },
]

const objectives = [
  'Développer des méthodes opérationnelles d\'évaluation éthique des SIA',
  'Proposer des standards au-delà des exigences légales minimales',
  'Accompagner les organisations dans leur démarche d\'éthique appliquée',
  'Former les professionnels aux enjeux éthiques de l\'IA',
  'Produire des recherches et publications sur l\'éthique de l\'IA',
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Award className="h-4 w-4" />
          Association loi 1901
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Global Council for Ethical AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Standardiser l'évaluation éthique de l'intelligence artificielle pour un déploiement
          responsable des systèmes d'IA dans le monde entier.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-16">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Notre mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Le <strong>Global Council for Ethical AI (GCEA)</strong> est une association loi 1901
              dont la mission est de <strong>standardiser l'évaluation éthique de l'IA</strong> en
              proposant des méthodes opérationnelles d'évaluation de tous les Systèmes d'Intelligence
              Artificielle (SIA).
            </p>
            <p>
              Notre approche se situe <strong>au-delà des exigences légales</strong> (AI Act, RGPD,
              et autres réglementations internationales). Nous visons à nous assurer que tout SIA
              a été évalué et mis en production avec une <strong>conscience totale de tous les
              dilemmes éthiques</strong> qu'il soulève.
            </p>
            <p>
              L'éthique ne se limite pas à la conformité réglementaire. Elle implique une réflexion
              approfondie sur les impacts sociétaux, les droits fondamentaux et les valeurs
              humaines que les systèmes d'IA peuvent affecter.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Objectives */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Nos objectifs</h2>
        <ul className="space-y-3">
          {objectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0 mt-0.5">
                {index + 1}
              </div>
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Nos valeurs</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <Card key={value.title}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{value.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* ETICA Tool */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">L'outil ETICA</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p>
              <strong>ETICA</strong> (Évaluation des Tensions et Impacts pour une IA Consciente et
              Alignée) est l'outil phare développé par le GCEA pour permettre aux organisations
              de mener une évaluation éthique structurée de leurs systèmes d'IA.
            </p>
            <p>
              L'outil propose une méthodologie en quatre étapes :
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Cartographie</strong> : Modélisation visuelle des flux de données et de décisions</li>
              <li><strong>Détection</strong> : Identification automatique des tensions éthiques potentielles</li>
              <li><strong>Arbitrage</strong> : Documentation structurée des choix et justifications</li>
              <li><strong>Action</strong> : Suivi des mesures de mitigation et preuves de conformité</li>
            </ol>
            <p className="text-muted-foreground mt-4">
              ETICA s'appuie sur le cadre FRIA (Fundamental Rights Impact Assessment) et couvre
              8 domaines de vigilance éthique : vie privée, équité, transparence, autonomie,
              sécurité, recours, durabilité et responsabilité.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Vous souhaitez en savoir plus ou contribuer à notre mission ?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/methodology">Découvrir notre méthodologie</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

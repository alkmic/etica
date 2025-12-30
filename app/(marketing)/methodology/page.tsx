import Link from 'next/link'
import { ArrowRight, Map, Search, Scale, CheckSquare, BookOpen, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const steps = [
  {
    number: 1,
    icon: Map,
    title: 'Cartographie',
    subtitle: 'Modéliser pour comprendre',
    description: 'Représentez visuellement les flux de données et de décisions de votre système d\'IA. Identifiez les sources de données, les traitements, les décisions automatisées et les parties prenantes impactées.',
    details: [
      'Création de nœuds (sources, traitements, décisions, actions, stockage)',
      'Connexion des flux de données entre les composants',
      'Annotation des types de données sensibles',
      'Identification des points de décision automatisée',
    ],
  },
  {
    number: 2,
    icon: Search,
    title: 'Détection',
    subtitle: 'Identifier les tensions',
    description: 'Notre moteur de règles analyse automatiquement votre cartographie pour détecter les tensions éthiques potentielles. Chaque tension représente un dilemme entre deux droits ou valeurs.',
    details: [
      '43 règles de détection basées sur le cadre FRIA',
      'Analyse des flux de données sensibles',
      'Détection des décisions automatisées à fort impact',
      'Identification des traitements touchant des populations vulnérables',
    ],
  },
  {
    number: 3,
    icon: Scale,
    title: 'Arbitrage',
    subtitle: 'Décider en conscience',
    description: 'Pour chaque tension identifiée, documentez votre décision et sa justification. L\'arbitrage n\'est pas un choix entre bien et mal, mais une mise en balance raisonnée de valeurs concurrentes.',
    details: [
      'Trois options : Accepter le risque, Atténuer, ou Rejeter la conception',
      'Questions guidées pour structurer la réflexion',
      'Justification obligatoire pour traçabilité',
      'Exemples de cas similaires pour contexte',
    ],
  },
  {
    number: 4,
    icon: CheckSquare,
    title: 'Action',
    subtitle: 'Mettre en œuvre',
    description: 'Transformez vos décisions en actions concrètes. Suivez les mesures de mitigation, assignez des responsables et documentez les preuves de mise en œuvre.',
    details: [
      'Actions suggérées automatiquement selon le type de tension',
      'Suivi de progression et échéances',
      'Assignation de responsables',
      'Pièces jointes pour preuves de conformité',
    ],
  },
]

const domains = [
  {
    name: 'Vie privée',
    color: 'bg-violet-500',
    description: 'Protection des données personnelles et respect de l\'intimité',
  },
  {
    name: 'Équité',
    color: 'bg-pink-500',
    description: 'Non-discrimination et traitement égal des individus',
  },
  {
    name: 'Transparence',
    color: 'bg-amber-500',
    description: 'Explicabilité des décisions et information des personnes',
  },
  {
    name: 'Autonomie',
    color: 'bg-emerald-500',
    description: 'Préservation du libre-arbitre et du consentement',
  },
  {
    name: 'Sécurité',
    color: 'bg-blue-500',
    description: 'Protection contre les risques et les usages malveillants',
  },
  {
    name: 'Recours',
    color: 'bg-red-500',
    description: 'Droit de contestation et de réparation',
  },
  {
    name: 'Durabilité',
    color: 'bg-green-500',
    description: 'Impact environnemental et pérennité',
  },
  {
    name: 'Responsabilité',
    color: 'bg-indigo-500',
    description: 'Imputabilité et gouvernance',
  },
]

export default function MethodologyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <BookOpen className="h-4 w-4" />
          Méthodologie ETICA
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Une approche structurée de l'éthique appliquée
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          ETICA propose une méthodologie en quatre étapes pour évaluer systématiquement
          les enjeux éthiques de vos systèmes d'IA, au-delà de la simple conformité réglementaire.
        </p>
      </div>

      {/* Philosophy */}
      <section className="mb-16">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Éthique vs Conformité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>La conformité légale est un minimum, pas un objectif.</strong> Un système
              peut être conforme au RGPD ou à l'AI Act tout en soulevant des questions éthiques
              profondes.
            </p>
            <p>
              L'éthique appliquée consiste à identifier les <strong>tensions</strong> entre
              différentes valeurs ou droits fondamentaux, puis à <strong>arbitrer</strong> ces
              tensions de manière consciente et documentée.
            </p>
            <p>
              Un dilemme éthique n'a pas de « bonne réponse ». Il s'agit de faire un choix
              raisonné, en ayant conscience des compromis, et de pouvoir justifier ce choix.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Steps */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-12">Les 4 étapes de l'évaluation</h2>
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-border hidden md:block" />
                )}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex items-start gap-4 md:w-1/3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shrink-0">
                          <Icon className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Étape {step.number}</p>
                          <h3 className="text-xl font-bold">{step.title}</h3>
                          <p className="text-sm text-primary">{step.subtitle}</p>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </section>

      {/* 8 Domains */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-4">Les 8 domaines de vigilance</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Notre analyse couvre 8 domaines éthiques fondamentaux, inspirés du cadre FRIA
          (Fundamental Rights Impact Assessment) et enrichis par notre expertise.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {domains.map((domain) => (
            <Card key={domain.name} className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-4 w-4 rounded-full ${domain.color}`} />
                  <h3 className="font-semibold">{domain.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{domain.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-muted/50 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Prêt à évaluer votre système d'IA ?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Créez un compte et commencez à cartographier votre premier système en quelques minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
      </section>
    </div>
  )
}

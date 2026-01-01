import Link from 'next/link'
import {
  ArrowRight,
  Check,
  X,
  Lock,
  Scale,
  Eye,
  Target,
  Shield,
  Zap,
  Sliders,
  Handshake,
  Landmark,
  Leaf,
  Gem,
  Globe,
  ChevronRight,
  Map,
  Search,
  Gavel,
  ClipboardCheck,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  ArrowDown,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Circle 1: Persons - 6 domains
const circle1Domains = [
  {
    id: 'privacy',
    name: 'Vie privée',
    icon: Lock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    question: 'Les données personnelles sont-elles protégées ?',
    covers: [
      'Minimisation des données collectées',
      'Consentement éclairé',
      'Droit d\'accès, rectification, effacement',
      'Protection contre le profilage excessif',
      'Sécurité des transferts',
    ],
  },
  {
    id: 'equity',
    name: 'Équité',
    icon: Scale,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    question: 'Le traitement est-il juste pour tous ?',
    covers: [
      'Non-discrimination directe et indirecte',
      'Équité entre groupes démographiques',
      'Absence de biais systématiques',
      'Égalité d\'accès au service',
      'Traitement des cas atypiques',
    ],
  },
  {
    id: 'transparency',
    name: 'Transparence',
    icon: Eye,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    question: 'Les personnes comprennent-elles ce qui se passe ?',
    covers: [
      'Information sur l\'utilisation d\'IA',
      'Explication des critères de décision',
      'Accès aux données utilisées',
      'Clarté des conditions d\'utilisation',
      'Communication sur les limites du système',
    ],
  },
  {
    id: 'autonomy',
    name: 'Autonomie',
    icon: Target,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    question: 'Les personnes gardent-elles leur liberté de choix ?',
    covers: [
      'Possibilité de refuser le traitement automatisé',
      'Alternatives non-algorithmiques',
      'Absence de manipulation (dark patterns)',
      'Respect des préférences exprimées',
      'Capacité à comprendre et contester',
    ],
  },
  {
    id: 'security',
    name: 'Sécurité',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10',
    question: 'Le système protège-t-il contre les préjudices ?',
    covers: [
      'Protection contre les erreurs graves',
      'Robustesse face aux attaques',
      'Fiabilité des résultats',
      'Gestion des cas limites',
      'Prévention des usages détournés',
    ],
  },
  {
    id: 'recourse',
    name: 'Recours',
    icon: Zap,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    question: 'Les personnes peuvent-elles contester et obtenir réparation ?',
    covers: [
      'Procédure de contestation accessible',
      'Intervention humaine possible',
      'Délai de réponse raisonnable',
      'Réparation effective en cas d\'erreur',
      'Traçabilité des décisions',
    ],
  },
]

// Circle 2: Organization - 3 domains
const circle2Domains = [
  {
    id: 'control',
    name: 'Maîtrise',
    icon: Sliders,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    question: 'Comprenez-vous et contrôlez-vous votre système ?',
    covers: [
      'Compréhension technique du fonctionnement',
      'Capacité à modifier le comportement',
      'Traçabilité des décisions',
      'Compétences internes pour maintenir le système',
      'Documentation technique à jour',
    ],
  },
  {
    id: 'responsibility',
    name: 'Responsabilité',
    icon: Handshake,
    color: 'text-violet-600',
    bgColor: 'bg-violet-600/10',
    question: 'Les responsabilités sont-elles claires ?',
    covers: [
      'Identification du responsable du système',
      'Chaîne de responsabilité en cas de problème',
      'Processus d\'escalade défini',
      'Assurance et couverture des risques',
      'Engagement de la direction',
    ],
  },
  {
    id: 'sovereignty',
    name: 'Souveraineté',
    icon: Landmark,
    color: 'text-violet-700',
    bgColor: 'bg-violet-700/10',
    question: 'Êtes-vous indépendant de vos fournisseurs ?',
    covers: [
      'Dépendance aux APIs et services externes',
      'Localisation des données et traitements',
      'Capacité à changer de fournisseur',
      'Maîtrise des évolutions (mises à jour imposées)',
      'Risques géopolitiques et juridictionnels',
    ],
  },
]

// Circle 3: Society - 3 domains
const circle3Domains = [
  {
    id: 'sustainability',
    name: 'Durabilité',
    icon: Leaf,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    question: 'L\'impact environnemental et social est-il maîtrisé ?',
    covers: [
      'Consommation énergétique',
      'Empreinte carbone',
      'Impact sur l\'emploi',
      'Effets à long terme',
      'Sobriété numérique',
    ],
  },
  {
    id: 'loyalty',
    name: 'Loyauté',
    icon: Gem,
    color: 'text-green-600',
    bgColor: 'bg-green-600/10',
    question: 'Les relations avec les parties prenantes sont-elles équilibrées ?',
    covers: [
      'Transparence envers les partenaires',
      'Équité dans le partage de la valeur',
      'Respect des engagements',
      'Communication sur les risques',
      'Prise en compte des intérêts des tiers',
    ],
  },
  {
    id: 'balance',
    name: 'Équilibre sociétal',
    icon: Globe,
    color: 'text-green-700',
    bgColor: 'bg-green-700/10',
    question: 'Le système contribue-t-il positivement à la société ?',
    covers: [
      'Concentration du pouvoir décisionnel',
      'Effets sur la concurrence',
      'Impact sur les inégalités',
      'Précédents créés pour le secteur',
      'Contribution au bien commun',
    ],
  },
]

// Dilemma examples
const dilemmaExamples = [
  {
    title: 'Personnalisation ↔ Vie privée',
    description: 'Offrir un service plus adapté nécessite de collecter plus de données personnelles.',
    example: 'Recommandations personnalisées vs. anonymat',
  },
  {
    title: 'Performance ↔ Explicabilité',
    description: 'Les modèles les plus performants sont souvent les moins explicables.',
    example: 'Deep learning vs. règles métier compréhensibles',
  },
  {
    title: 'Efficacité ↔ Maîtrise',
    description: 'Utiliser une API externe puissante crée une dépendance sur un composant non contrôlé.',
    example: 'API GPT-4 vs. modèle interne moins performant',
  },
]

// FAQ items
const faqItems = [
  {
    question: 'ETICA couvre-t-il tous les dilemmes éthiques possibles ?',
    answer: 'Non. ETICA couvre les dilemmes les plus fréquents identifiés dans la littérature et la pratique. Le catalogue de règles est régulièrement enrichi. Vous pouvez signaler des dilemmes non détectés — cela nous aide à améliorer l\'outil.',
  },
  {
    question: 'Comment le moteur gère-t-il les APIs et services externes ?',
    answer: 'Une famille de règles dédiée (Famille E) analyse spécifiquement les dépendances externes : APIs, cloud, fournisseurs tiers. Ces règles détectent les dilemmes liés à la maîtrise, la souveraineté et la confiance.',
  },
  {
    question: 'Puis-je ajouter mes propres domaines ou règles ?',
    answer: 'Les 12 domaines constituent un socle. Une fonctionnalité future permettra d\'ajouter des domaines et des règles spécifiques à votre organisation. En attendant, vous pouvez documenter des dilemmes manuellement.',
  },
  {
    question: 'Que faire si je ne suis pas d\'accord avec un dilemme détecté ?',
    answer: 'Vous pouvez le contester en fournissant une justification. Cela désactive la règle pour ce cas précis, documente votre raisonnement et reste visible dans l\'historique.',
  },
  {
    question: 'ETICA remplace-t-il une évaluation d\'impact (AIPD, FRIA) ?',
    answer: 'Non. ETICA est complémentaire. Il vous aide à identifier systématiquement les dilemmes, documenter vos arbitrages et suivre vos engagements. Mais il ne remplace pas l\'analyse juridique d\'un DPO ou la validation par une autorité de contrôle.',
  },
  {
    question: 'Combien de temps prend une évaluation complète ?',
    answer: 'Système simple (5-10 blocs) : 2-4 heures. Système moyen (10-20 blocs) : 1-2 jours. Système complexe (>20 blocs) : 3-5 jours. Les révisions ultérieures sont plus rapides car vous partez de l\'existant.',
  },
]

// Domain Card Component
function DomainCard({ domain }: { domain: typeof circle1Domains[0] }) {
  const Icon = domain.icon
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className={`inline-flex items-center gap-2 ${domain.color}`}>
          <div className={`p-2 rounded-lg ${domain.bgColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle className="text-lg">{domain.name}</CardTitle>
        </div>
        <CardDescription className="font-medium text-foreground/80">
          {domain.question}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 font-medium">Ce que ça couvre :</p>
        <ul className="space-y-1.5">
          {domain.covers.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Circles Visualization Component
function CirclesVisualization() {
  return (
    <div className="relative w-full max-w-xl mx-auto aspect-square">
      {/* Circle 3 - Society (outermost) */}
      <div className="absolute inset-0 rounded-full border-4 border-green-500/30 bg-green-500/5">
        <div className="absolute inset-x-0 top-8 text-center">
          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30 font-semibold">
            CERCLE 3 : SOCIÉTÉ
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">Durabilité • Loyauté • Équilibre</p>
        </div>
      </div>

      {/* Circle 2 - Organization */}
      <div className="absolute inset-[15%] rounded-full border-4 border-violet-500/30 bg-violet-500/5">
        <div className="absolute inset-x-0 top-6 text-center">
          <Badge variant="outline" className="bg-violet-500/10 text-violet-700 border-violet-500/30 font-semibold text-xs">
            CERCLE 2 : ORGANISATION
          </Badge>
          <p className="text-xs text-muted-foreground mt-1.5">Maîtrise • Responsabilité • Souveraineté</p>
        </div>
      </div>

      {/* Circle 1 - Persons (innermost) */}
      <div className="absolute inset-[32%] rounded-full border-4 border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
        <div className="text-center px-2">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/30 font-semibold text-xs">
            CERCLE 1 : PERSONNES
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">6 domaines fondamentaux</p>
        </div>
      </div>
    </div>
  )
}

// Workflow Diagram Component
function WorkflowDiagram() {
  const steps = [
    { number: 1, title: 'CARTOGRAPHIE', subtitle: 'Décrire le système', icon: Map, output: 'Graphe du système' },
    { number: 2, title: 'DÉTECTION', subtitle: 'Identifier les dilemmes', icon: Search, output: 'Liste des dilemmes' },
    { number: 3, title: 'ARBITRAGE', subtitle: 'Documenter les choix', icon: Gavel, output: 'Registre des arbitrages' },
    { number: 4, title: 'SUIVI', subtitle: 'Suivre les actions', icon: ClipboardCheck, output: 'Plan d\'action & tableau de bord' },
  ]

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-start gap-2 min-w-[800px] px-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex flex-col items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                  <Icon className="h-6 w-6 text-primary/70 mt-1" />
                </div>
                <h4 className="font-bold text-sm">{step.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{step.subtitle}</p>
                <div className="mt-3">
                  <ArrowDown className="h-4 w-4 text-muted-foreground mx-auto" />
                </div>
                <p className="text-xs text-primary font-medium mt-2 bg-primary/5 px-2 py-1 rounded">
                  {step.output}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="h-8 w-8 text-muted-foreground/50 shrink-0 mx-2" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function MethodologyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <BookOpen className="h-4 w-4" />
          Guide complet
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Méthodologie ETICA
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Comprendre comment ETICA détecte et documente les dilemmes éthiques de votre système d'IA
        </p>
        <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4 max-w-xl mx-auto text-left">
          "ETICA ne vous dit pas ce qui est bien ou mal — il vous aide à voir clairement les choix que vous faites."
        </blockquote>
      </div>

      <Separator className="my-12" />

        {/* SECTION 1: Introduction */}
        <section id="intro" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-primary" />
            Ce qu'ETICA fait et ne fait pas
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* What ETICA does */}
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Check className="h-5 w-5" />
                  Ce qu'ETICA fait
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Identifie systématiquement les dilemmes éthiques présents dans votre système d'IA</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Vous aide à documenter vos arbitrages de manière traçable et auditable</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Rend visible le "profil éthique" de votre système — les choix que vous faites consciemment</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Génère un plan d'action pour suivre vos engagements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* What ETICA doesn't do */}
            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <X className="h-5 w-5" />
                  Ce qu'ETICA ne fait pas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <X className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                    <span>Ne porte aucun jugement moral sur vos choix</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <X className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                    <span>Ne vous dit pas quel arbitrage est "bon" ou "mauvais"</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <X className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                    <span>Ne remplace pas une réflexion éthique humaine</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <X className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                    <span>Ne garantit pas la conformité réglementaire (mais y contribue)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-500/5 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">À retenir</p>
                  <p className="text-sm text-blue-800/80 dark:text-blue-200/80">
                    ETICA est un outil de conscience, pas un outil de morale. Son rôle est de s'assurer que vous déployez votre système d'IA en pleine connaissance des compromis que vous faites.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* SECTION 2: What is an ethical dilemma */}
        <section id="dilemme" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Scale className="h-6 w-6 text-primary" />
            Qu'est-ce qu'un dilemme éthique ?
          </h2>

          <div className="bg-muted/50 rounded-2xl p-8 mb-8">
            <p className="text-2xl font-medium text-center mb-4">
              Un dilemme éthique est une situation où <span className="text-primary">deux valeurs légitimes entrent en tension</span>.
            </p>
            <p className="text-xl text-center text-muted-foreground">
              Améliorer l'une peut dégrader l'autre.
            </p>
          </div>

          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Ce ne sont pas des "problèmes à résoudre" mais des tensions à arbitrer consciemment. Dans la plupart des cas, il n'existe pas de solution parfaite — seulement des compromis plus ou moins acceptables selon votre contexte.
          </p>

          {/* Dilemma Examples */}
          <div className="grid md:grid-cols-3 gap-6">
            {dilemmaExamples.map((dilemma, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{dilemma.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{dilemma.description}</p>
                  <p className="text-sm">
                    <span className="font-medium">Exemple :</span>{' '}
                    <span className="text-muted-foreground">{dilemma.example}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* SECTION 3: The 12 domains */}
        <section id="domaines" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Globe className="h-6 w-6 text-primary" />
            Les 12 domaines analysés par ETICA
          </h2>

          <p className="text-muted-foreground mb-8 max-w-2xl">
            ETICA analyse votre système à travers 12 domaines, organisés en 3 cercles concentriques — des personnes directement concernées jusqu'à l'impact sur la société.
          </p>

          {/* Circles Visualization */}
          <div className="mb-12">
            <CirclesVisualization />
          </div>

          {/* Accordion for each circle */}
          <Accordion type="multiple" className="space-y-4">
            {/* Circle 1: Persons */}
            <AccordionItem value="circle-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="font-bold">CERCLE 1 : LES PERSONNES</span>
                  <Badge variant="secondary" className="ml-2">6 domaines</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground mb-6">
                  Les droits et intérêts des individus directement concernés par le système
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {circle1Domains.map((domain) => (
                    <DomainCard key={domain.id} domain={domain} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Circle 2: Organization */}
            <AccordionItem value="circle-2" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-violet-500" />
                  <span className="font-bold">CERCLE 2 : L'ORGANISATION</span>
                  <Badge variant="secondary" className="ml-2">3 domaines</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground mb-6">
                  La capacité de l'organisation à maîtriser et assumer son système
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {circle2Domains.map((domain) => (
                    <DomainCard key={domain.id} domain={domain} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Circle 3: Society */}
            <AccordionItem value="circle-3" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="font-bold">CERCLE 3 : LA SOCIÉTÉ</span>
                  <Badge variant="secondary" className="ml-2">3 domaines</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground mb-6">
                  L'impact du système au-delà des utilisateurs directs
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {circle3Domains.map((domain) => (
                    <DomainCard key={domain.id} domain={domain} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Origin note */}
          <Card className="mt-8 bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Origine des domaines :</strong> Ces 12 domaines s'appuient sur les cadres de référence reconnus (RGPD, AI Act, recommandation UNESCO, ALTAI) tout en intégrant des dimensions organisationnelles et sociétales souvent négligées.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* SECTION 4: The 4 steps */}
        <section id="etapes" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Map className="h-6 w-6 text-primary" />
            Les 4 étapes de l'évaluation
          </h2>

          <p className="text-muted-foreground mb-8 max-w-2xl">
            ETICA structure l'évaluation éthique en 4 étapes progressives. Chaque étape produit un livrable concret et prépare la suivante.
          </p>

          {/* Workflow Diagram */}
          <div className="mb-12 bg-muted/30 rounded-2xl p-6">
            <WorkflowDiagram />
          </div>

          {/* Step Accordions */}
          <Accordion type="multiple" className="space-y-4">
            {/* Step 1: Mapping */}
            <AccordionItem value="step-1" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <span className="font-bold">ÉTAPE 1 : CARTOGRAPHIE</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <p className="font-medium mb-4">Objectif : Décrire votre système d'IA pour que le moteur de règles puisse détecter les dilemmes.</p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Ce que vous faites :</h4>
                    <ol className="space-y-4 list-decimal list-inside">
                      <li className="text-sm">
                        <span className="font-medium">Modéliser les blocs de votre système</span>
                        <ul className="ml-6 mt-2 space-y-1 text-muted-foreground">
                          <li>• Sources de données (internes, externes, utilisateurs)</li>
                          <li>• Modèles d'IA (règles, ML classique, LLM, etc.)</li>
                          <li>• Interfaces (API, application, back-office)</li>
                          <li>• Composants externes (APIs tierces, cloud, fournisseurs)</li>
                          <li>• Points de décision humaine (validation, supervision)</li>
                        </ul>
                      </li>
                      <li className="text-sm">
                        <span className="font-medium">Tracer les flux entre ces blocs</span>
                        <ul className="ml-6 mt-2 space-y-1 text-muted-foreground">
                          <li>• Quelles données vont où</li>
                          <li>• Quelles décisions sont prises</li>
                          <li>• Qui reçoit quel output</li>
                        </ul>
                      </li>
                      <li className="text-sm">
                        <span className="font-medium">Renseigner les attributs de chaque bloc</span>
                        <ul className="ml-6 mt-2 space-y-1 text-muted-foreground">
                          <li>• Type de données (personnelles, sensibles, anonymes)</li>
                          <li>• Niveau d'autonomie (assistance, recommandation, décision automatique)</li>
                          <li>• Fournisseur et localisation (pour les composants externes)</li>
                        </ul>
                      </li>
                    </ol>
                  </div>

                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">Livrable :</p>
                      <p className="text-sm text-muted-foreground">Un graphe interactif de votre système avec tous ses composants et flux.</p>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 2: Detection */}
            <AccordionItem value="step-2" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <span className="font-bold">ÉTAPE 2 : DÉTECTION</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <p className="font-medium mb-4">Objectif : Identifier automatiquement les dilemmes éthiques à partir de votre cartographie.</p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Comment fonctionne le moteur de règles :</h4>
                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm mb-4">
                      <p>SI [conditions sur le graphe, les données, le contexte]</p>
                      <p>ALORS [dilemme de type "Domaine A ↔ Domaine B"]</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Les 5 familles de règles :</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-semibold">Famille</th>
                            <th className="text-left py-2 px-3 font-semibold">Ce qu'elle analyse</th>
                            <th className="text-left py-2 px-3 font-semibold">Exemple de règle</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-3 font-medium">Structurelle</td>
                            <td className="py-2 px-3 text-muted-foreground">La forme du graphe</td>
                            <td className="py-2 px-3 text-muted-foreground">Décision auto sans intervention humaine → Automatisation ↔ Recours</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-3 font-medium">Données</td>
                            <td className="py-2 px-3 text-muted-foreground">Les types de données</td>
                            <td className="py-2 px-3 text-muted-foreground">Données sensibles vers décision auto → Performance ↔ Protection</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-3 font-medium">Dépendance</td>
                            <td className="py-2 px-3 text-muted-foreground">Les composants externes</td>
                            <td className="py-2 px-3 text-muted-foreground">API externe sans fallback → Efficacité ↔ Maîtrise</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-3 font-medium">Contextuelle</td>
                            <td className="py-2 px-3 text-muted-foreground">Le domaine d'application</td>
                            <td className="py-2 px-3 text-muted-foreground">Scoring crédit automatisé → Précision ↔ Inclusion</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-medium">Gouvernance</td>
                            <td className="py-2 px-3 text-muted-foreground">L'organisation</td>
                            <td className="py-2 px-3 text-muted-foreground">Pas de responsable identifié → Agilité ↔ Responsabilité</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">Livrable :</p>
                      <p className="text-sm text-muted-foreground">Une liste de dilemmes détectés, hiérarchisés par gravité, prêts à être arbitrés.</p>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 3: Arbitration */}
            <AccordionItem value="step-3" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <span className="font-bold">ÉTAPE 3 : ARBITRAGE</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <p className="font-medium mb-4">Objectif : Documenter votre position sur chaque dilemme de manière structurée et traçable.</p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Le canevas d'arbitrage en 4 questions :</h4>
                    <div className="space-y-3">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="font-medium text-primary">① Quel pôle priorisez-vous ?</p>
                        <p className="text-sm text-muted-foreground mt-1">Efficacité ? Maîtrise ? Ou équilibre entre les deux ?</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="font-medium text-primary">② Pourquoi cette priorisation ?</p>
                        <p className="text-sm text-muted-foreground mt-1">Contrainte réglementaire, économique, technique, ou choix stratégique ?</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="font-medium text-primary">③ Comment limitez-vous les risques sur le pôle minoré ?</p>
                        <p className="text-sm text-muted-foreground mt-1">Mesures techniques, contractuelles, organisationnelles ?</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="font-medium text-primary">④ Quand réviser cet arbitrage ?</p>
                        <p className="text-sm text-muted-foreground mt-1">À date fixe ou si événement déclencheur ?</p>
                      </div>
                    </div>
                  </div>

                  <Card className="border-orange-500/30 bg-orange-500/5">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">Important — Ce que l'outil ne fait PAS :</p>
                      <ul className="text-sm text-orange-700/80 dark:text-orange-300/80 space-y-1">
                        <li>• Il ne vous dit pas quel pôle choisir</li>
                        <li>• Il ne juge pas votre arbitrage comme "bon" ou "mauvais"</li>
                        <li>• Il ne compare pas vos choix à ceux d'autres organisations</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">Livrable :</p>
                      <p className="text-sm text-muted-foreground">Un registre des arbitrages documentés pour chaque dilemme.</p>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Step 4: Follow-up */}
            <AccordionItem value="step-4" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">4</span>
                  </div>
                  <span className="font-bold">ÉTAPE 4 : SUIVI</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <p className="font-medium mb-4">Objectif : Transformer les arbitrages en actions concrètes et maintenir une vision d'ensemble.</p>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Vue 1 : Tableau de suivi</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Suivi par dilemme avec état d'avancement des actions</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Vue 2 : Profil éthique</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Visualisation des domaines priorisés dans vos arbitrages</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Vue 3 : Calendrier</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Révisions programmées et événements déclencheurs</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">Livrable :</p>
                      <p className="text-sm text-muted-foreground">Un tableau de bord de suivi avec actions, profil éthique et calendrier de révisions.</p>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator className="my-12" />

        {/* SECTION 5: Rules Engine */}
        <section id="moteur" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Search className="h-6 w-6 text-primary" />
            Le moteur de règles en détail
          </h2>

          <p className="text-muted-foreground mb-8 max-w-2xl">
            Le moteur de règles est le cœur d'ETICA. Il analyse votre cartographie pour identifier les dilemmes éthiques. Cette section explique comment il fonctionne.
          </p>

          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <h4 className="font-semibold mb-3">Principe général</h4>
            <div className="font-mono text-sm bg-background rounded p-4">
              <p className="text-muted-foreground">SI  [le graphe contient un certain pattern]</p>
              <p className="text-muted-foreground">ET  [certaines caractéristiques sont présentes]</p>
              <p className="text-primary">ALORS  [un dilemme spécifique est détecté]</p>
            </div>
          </div>

          <Accordion type="multiple" className="space-y-4">
            <AccordionItem value="family-s" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-bold">Famille S — Règles Structurelles</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ces règles détectent des patterns dans la structure de votre système, indépendamment du contenu des données.
                </p>
                <div className="space-y-2 font-mono text-xs">
                  <p><span className="text-primary">S-01</span> : Boucle décisionnelle fermée → Automatisation ↔ Recours</p>
                  <p><span className="text-primary">S-02</span> : Concentration décisionnelle → Efficience ↔ Résilience</p>
                  <p><span className="text-primary">S-03</span> : Chaîne de responsabilité floue → Agilité ↔ Responsabilité</p>
                  <p><span className="text-primary">S-04</span> : Point de non-retour → Rapidité ↔ Prudence</p>
                  <p><span className="text-primary">S-05</span> : Cascade décisionnelle → Efficience ↔ Contrôle</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="family-d" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-bold">Famille D — Règles de Données</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ces règles analysent les types de données et leur traitement.
                </p>
                <div className="space-y-2 font-mono text-xs">
                  <p><span className="text-primary">D-01</span> : Données non minimisées → Richesse ↔ Minimisation</p>
                  <p><span className="text-primary">D-02</span> : Données sensibles + décision auto → Performance ↔ Protection</p>
                  <p><span className="text-primary">D-03</span> : Données inférées → Précision ↔ Consentement</p>
                  <p><span className="text-primary">D-04</span> : Profilage comportemental → Personnalisation ↔ Autonomie</p>
                  <p><span className="text-primary">D-05</span> : Conservation longue durée → Historique ↔ Droit à l'oubli</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="family-e" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-bold">Famille E — Règles de Dépendance</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ces règles détectent les dilemmes liés à l'utilisation de services tiers. C'est une famille souvent négligée dans les évaluations éthiques classiques.
                </p>
                <div className="space-y-2 font-mono text-xs">
                  <p><span className="text-primary">E-01</span> : API IA externe → Capacité ↔ Maîtrise</p>
                  <p><span className="text-primary">E-02</span> : Fournisseur unique → Qualité ↔ Indépendance</p>
                  <p><span className="text-primary">E-03</span> : Données hors juridiction → Fonctionnalité ↔ Souveraineté</p>
                  <p><span className="text-primary">E-04</span> : Mise à jour non contrôlée → Innovation ↔ Stabilité</p>
                  <p><span className="text-primary">E-05</span> : Modèle opaque → Performance ↔ Explicabilité</p>
                  <p><span className="text-primary">E-06</span> : Données transitant par tiers → Fonctionnalité ↔ Confidentialité</p>
                  <p><span className="text-primary">E-07</span> : Chaîne de sous-traitance → Simplicité ↔ Traçabilité</p>
                  <p><span className="text-primary">E-08</span> : Entraînement sur vos données → Amélioration ↔ Propriété intellectuelle</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="family-c" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-bold">Famille C — Règles Contextuelles</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ces règles s'activent selon le secteur d'activité. Voici quelques exemples par domaine :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-sm mb-2">Santé <span className="font-normal text-muted-foreground">(exemples)</span></p>
                    <div className="space-y-1 font-mono text-xs text-muted-foreground">
                      <p>Aide au diagnostic → Assistance ↔ Relation soignant-patient</p>
                      <p>Triage automatisé → Efficience ↔ Attention individuelle</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-2">Ressources Humaines <span className="font-normal text-muted-foreground">(exemples)</span></p>
                    <div className="space-y-1 font-mono text-xs text-muted-foreground">
                      <p>Tri de CV → Objectivité ↔ Singularité des parcours</p>
                      <p>Prédiction turnover → Gestion ↔ Vie privée</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-2">Finance <span className="font-normal text-muted-foreground">(exemples)</span></p>
                    <div className="space-y-1 font-mono text-xs text-muted-foreground">
                      <p>Scoring crédit → Précision ↔ Inclusion financière</p>
                      <p>Détection fraude → Sécurité ↔ Présomption d'innocence</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-2">Assurance <span className="font-normal text-muted-foreground">(exemples)</span></p>
                    <div className="space-y-1 font-mono text-xs text-muted-foreground">
                      <p>Tarification individualisée → Précision ↔ Mutualisation</p>
                      <p>Automatisation sinistres → Rapidité ↔ Attention particulière</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="family-g" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-bold">Famille G — Règles de Gouvernance</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ces règles analysent comment le système est géré et supervisé.
                </p>
                <div className="space-y-2 font-mono text-xs">
                  <p><span className="text-primary">G-01</span> : Pas de responsable identifié → Agilité ↔ Responsabilité</p>
                  <p><span className="text-primary">G-02</span> : Pas de procédure de contestation → Efficience ↔ Recours</p>
                  <p><span className="text-primary">G-03</span> : Pas de revue programmée → Stabilité ↔ Adaptation</p>
                  <p><span className="text-primary">G-04</span> : Documentation insuffisante → Agilité ↔ Auditabilité</p>
                  <p><span className="text-primary">G-05</span> : Pas de test de biais → Performance ↔ Équité</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Card className="mt-8 bg-muted/30">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2">Contester une règle</h4>
              <p className="text-sm text-muted-foreground">
                Vous pouvez contester un dilemme détecté si vous estimez que la règle ne s'applique pas à votre situation.
                La contestation est documentée avec votre justification, la date et l'identité du contestataire.
                Cela désactive la règle pour ce cas précis, tout en gardant une trace de votre raisonnement.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* SECTION 6: FAQ */}
        <section id="faq" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-primary" />
            Questions fréquentes
          </h2>

          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <Separator className="my-12" />

        {/* SECTION 7: Summary */}
        <section id="resume" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-8 text-center">En résumé</h2>

          {/* Summary Flow */}
          <div className="bg-muted/30 rounded-2xl p-8 mb-8">
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-background rounded-lg border">
                <p className="font-semibold">VOTRE SYSTÈME D'IA</p>
                <p className="text-sm text-muted-foreground">(blocs, flux, données)</p>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center p-4 bg-background rounded-lg border">
                <p className="font-semibold">ÉTAPE 1 : CARTOGRAPHIE</p>
                <p className="text-sm text-muted-foreground">Modéliser le système avec ses composants</p>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center p-4 bg-background rounded-lg border">
                <p className="font-semibold">ÉTAPE 2 : DÉTECTION</p>
                <p className="text-sm text-muted-foreground">Le moteur identifie les dilemmes "Domaine A ↔ Domaine B"</p>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center p-4 bg-background rounded-lg border">
                <p className="font-semibold">ÉTAPE 3 : ARBITRAGE</p>
                <p className="text-sm text-muted-foreground">Quel pôle ? Pourquoi ? Comment mitiger ? Quand réviser ?</p>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center p-4 bg-background rounded-lg border">
                <p className="font-semibold">ÉTAPE 4 : SUIVI</p>
                <p className="text-sm text-muted-foreground">Actions, profil éthique, calendrier</p>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/30">
                <p className="font-semibold text-primary">DÉPLOIEMENT EN CONSCIENCE</p>
                <p className="text-sm text-muted-foreground">Vous savez quels compromis vous faites et pourquoi</p>
              </div>
            </div>
          </div>

          {/* Closing message */}
          <div className="text-center max-w-2xl mx-auto">
            <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4 text-left mb-8">
              ETICA ne vous dit pas ce qui est bien ou mal.
              Il vous aide à voir clairement les choix que vous faites,
              pour que vous puissiez les assumer en toute conscience.
              <br /><br />
              <span className="text-primary font-medium not-italic">C'est un outil de lucidité, pas de morale.</span>
            </blockquote>
          </div>

          {/* CTA */}
          <div className="text-center py-12 bg-muted/50 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Prêt à évaluer votre système d'IA ?</h3>
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
          </div>
        </section>
    </div>
  )
}

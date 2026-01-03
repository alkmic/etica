import Link from 'next/link'
import {
  ArrowRight,
  Shield,
  Eye,
  Scale,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Map,
  FileText,
  Lock,
  Users,
  MessageSquare,
  Leaf,
  ClipboardCheck,
  Sliders,
  Landmark,
  Gem,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const demoSias = [
  {
    id: 'demo-scoring',
    name: 'Système de scoring crédit',
    sector: 'Finance',
    status: 'ACTIVE',
    description: 'Évaluation automatique de la solvabilité des demandeurs de crédit basée sur des algorithmes de machine learning.',
    vigilanceLevel: 4,
    tensionCount: 5,
    openTensionCount: 3,
    actionCount: 12,
    completedActionCount: 4,
    domainScores: {
      // Cercle 1 : Personnes
      'Vie privée': 3.5,
      'Équité': 2.8,
      'Transparence': 2.5,
      'Autonomie': 3.0,
      'Sécurité': 4.2,
      'Recours': 2.5,
      // Cercle 2 : Organisation
      'Maîtrise': 3.8,
      'Responsabilité': 3.8,
      'Souveraineté': 3.5,
      // Cercle 3 : Société
      'Durabilité': 4.0,
      'Loyauté': 3.5,
      'Équilibre': 3.2,
    },
  },
  {
    id: 'demo-recrutement',
    name: 'Tri automatique de candidatures',
    sector: 'Ressources Humaines',
    status: 'ACTIVE',
    description: 'Analyse automatique des CV et pré-sélection des candidats pour les postes ouverts.',
    vigilanceLevel: 3,
    tensionCount: 4,
    openTensionCount: 2,
    actionCount: 8,
    completedActionCount: 5,
    domainScores: {
      // Cercle 1 : Personnes
      'Vie privée': 3.0,
      'Équité': 2.5,
      'Transparence': 3.5,
      'Autonomie': 3.5,
      'Sécurité': 4.0,
      'Recours': 3.0,
      // Cercle 2 : Organisation
      'Maîtrise': 4.0,
      'Responsabilité': 3.5,
      'Souveraineté': 4.0,
      // Cercle 3 : Société
      'Durabilité': 4.5,
      'Loyauté': 3.8,
      'Équilibre': 3.5,
    },
  },
  {
    id: 'demo-chatbot',
    name: 'Chatbot service client',
    sector: 'Commerce',
    status: 'ACTIVE',
    description: 'Assistant conversationnel IA pour le support client 24/7 avec capacités de résolution automatique.',
    vigilanceLevel: 2,
    tensionCount: 2,
    openTensionCount: 1,
    actionCount: 6,
    completedActionCount: 4,
    domainScores: {
      // Cercle 1 : Personnes
      'Vie privée': 4.0,
      'Équité': 4.2,
      'Transparence': 3.8,
      'Autonomie': 4.0,
      'Sécurité': 4.5,
      'Recours': 3.5,
      // Cercle 2 : Organisation
      'Maîtrise': 3.0,
      'Responsabilité': 4.0,
      'Souveraineté': 2.5,
      // Cercle 3 : Société
      'Durabilité': 4.0,
      'Loyauté': 4.2,
      'Équilibre': 4.0,
    },
  },
]

const vigilanceColors: Record<number, string> = {
  1: 'bg-green-500',
  2: 'bg-lime-500',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-500',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
  ACTIVE: { label: 'Actif', color: 'bg-blue-100 text-blue-800' },
  REVIEW: { label: 'En révision', color: 'bg-green-100 text-green-800' },
  ARCHIVED: { label: 'Archivé', color: 'bg-purple-100 text-purple-800' },
}

function DemoSiaCard({ sia }: { sia: typeof demoSias[0] }) {
  const coverage = sia.actionCount > 0
    ? Math.round((sia.completedActionCount / sia.actionCount) * 100)
    : 0

  const status = statusLabels[sia.status]

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{sia.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {sia.sector}
              </Badge>
              <Badge className={`text-xs ${status.color}`}>
                {status.label}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {sia.description}
        </p>

        {/* Vigilance indicator */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Vigilance</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-2 w-6 rounded-full ${
                  level <= sia.vigilanceLevel
                    ? vigilanceColors[sia.vigilanceLevel]
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">
            Niveau {sia.vigilanceLevel}/5
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>{sia.openTensionCount}/{sia.tensionCount} tensions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{coverage}% actions</span>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={coverage} className="h-1.5" />
      </CardContent>
    </Card>
  )
}

export default function DemoPage() {
  // Use first demo SIA for detailed view
  const selectedSia = demoSias[0]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4">Démonstration</Badge>
        <h1 className="text-4xl font-bold mb-4">
          Découvrez ETICA en action
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explorez des exemples de systèmes d&apos;IA analysés avec notre méthodologie
          basée sur 12 domaines éthiques organisés en 3 cercles.
        </p>
      </div>

      {/* Demo SIA Cards */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Exemples de systèmes analysés</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoSias.map((sia) => (
            <DemoSiaCard key={sia.id} sia={sia} />
          ))}
        </div>
      </section>

      {/* Detailed View of First SIA */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">
          Analyse détaillée : {selectedSia.name}
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Domain Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Scores par domaine
              </CardTitle>
              <CardDescription>
                Évaluation sur les 12 domaines éthiques (1-5)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(selectedSia.domainScores).map(([domain, score]) => {
                  const percentage = (score / 5) * 100
                  const icons: Record<string, React.ReactNode> = {
                    // Cercle 1 : Personnes
                    'Vie privée': <Lock className="h-4 w-4" />,
                    'Équité': <Scale className="h-4 w-4" />,
                    'Transparence': <Eye className="h-4 w-4" />,
                    'Autonomie': <Users className="h-4 w-4" />,
                    'Sécurité': <Shield className="h-4 w-4" />,
                    'Recours': <MessageSquare className="h-4 w-4" />,
                    // Cercle 2 : Organisation
                    'Maîtrise': <Sliders className="h-4 w-4" />,
                    'Responsabilité': <ClipboardCheck className="h-4 w-4" />,
                    'Souveraineté': <Landmark className="h-4 w-4" />,
                    // Cercle 3 : Société
                    'Durabilité': <Leaf className="h-4 w-4" />,
                    'Loyauté': <Gem className="h-4 w-4" />,
                    'Équilibre': <Globe className="h-4 w-4" />,
                  }

                  return (
                    <div key={domain} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {icons[domain]}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{domain}</span>
                          <span className="text-sm text-muted-foreground">{score}/5</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Fonctionnalités incluses
              </CardTitle>
              <CardDescription>
                Ce que vous pouvez faire avec ETICA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Map className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Cartographie interactive</h4>
                    <p className="text-sm text-muted-foreground">
                      Visualisez les flux de données et les acteurs de votre système IA
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Détection des tensions</h4>
                    <p className="text-sm text-muted-foreground">
                      Identification automatique des dilemmes éthiques potentiels
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Scale className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Arbitrage documenté</h4>
                    <p className="text-sm text-muted-foreground">
                      Documentez vos décisions éthiques de manière structurée
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Plan d&apos;action</h4>
                    <p className="text-sm text-muted-foreground">
                      Suivez les mesures correctives et leur progression
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à analyser vos propres systèmes ?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Créez votre compte et commencez à documenter l&apos;éthique
              de vos systèmes d&apos;IA dès maintenant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">
                  Créer un compte
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10" asChild>
                <Link href="/login">
                  Se connecter
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

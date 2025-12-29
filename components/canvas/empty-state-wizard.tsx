'use client'

import { useState } from 'react'
import {
  Database,
  Cpu,
  GitBranch,
  Zap,
  Users,
  HardDrive,
  ArrowRight,
  LayoutTemplate,
  Sparkles,
  ChevronRight,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NodeType } from './custom-node'
import { FlowTemplate, FLOW_TEMPLATES } from '@/lib/constants/flow-templates'

interface EmptyStateWizardProps {
  onAddNode: (type: NodeType) => void
  onLoadTemplate: (template: FlowTemplate) => void
  siaDomain?: string
}

const nodeTypeInfo: Array<{
  type: NodeType
  icon: React.ElementType
  label: string
  shortLabel: string
  description: string
  examples: string[]
  color: string
  bgColor: string
}> = [
  {
    type: 'SOURCE',
    icon: Database,
    label: 'Source de données',
    shortLabel: 'Source',
    description: 'D\'où viennent les données',
    examples: ['Base clients', 'Formulaire web', 'API externe', 'Fichier CSV'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    type: 'STAKEHOLDER',
    icon: Users,
    label: 'Partie prenante',
    shortLabel: 'Personne',
    description: 'Qui est concerné par le système',
    examples: ['Utilisateur', 'Client', 'Employé', 'Administrateur'],
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  {
    type: 'TREATMENT',
    icon: Cpu,
    label: 'Traitement',
    shortLabel: 'Traitement',
    description: 'Comment les données sont transformées',
    examples: ['Algorithme ML', 'Calcul de score', 'Agrégation', 'Normalisation'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    type: 'DECISION',
    icon: GitBranch,
    label: 'Décision',
    shortLabel: 'Décision',
    description: 'Où se prennent les décisions',
    examples: ['Scoring', 'Classification', 'Recommandation', 'Approbation/Rejet'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    type: 'ACTION',
    icon: Zap,
    label: 'Action',
    shortLabel: 'Action',
    description: 'Ce qui se passe après la décision',
    examples: ['Notification', 'Envoi email', 'Mise à jour', 'Déclenchement'],
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    type: 'STORAGE',
    icon: HardDrive,
    label: 'Stockage',
    shortLabel: 'Stockage',
    description: 'Où les données sont conservées',
    examples: ['Base de données', 'Data lake', 'Archive', 'Cache'],
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
]

const quickStartScenarios = [
  {
    id: 'person-to-decision',
    title: 'Décision sur une personne',
    description: 'Modéliser un système qui prend des décisions affectant des individus',
    steps: ['STAKEHOLDER', 'SOURCE', 'TREATMENT', 'DECISION', 'ACTION'] as NodeType[],
    icon: Users,
  },
  {
    id: 'data-collection',
    title: 'Collecte et traitement de données',
    description: 'Modéliser un système qui collecte, traite et stocke des données',
    steps: ['SOURCE', 'TREATMENT', 'STORAGE'] as NodeType[],
    icon: Database,
  },
  {
    id: 'recommendation',
    title: 'Système de recommandation',
    description: 'Modéliser un système qui fait des recommandations aux utilisateurs',
    steps: ['STAKEHOLDER', 'TREATMENT', 'DECISION', 'STAKEHOLDER'] as NodeType[],
    icon: Sparkles,
  },
]

export function EmptyStateWizard({ onAddNode, onLoadTemplate, siaDomain }: EmptyStateWizardProps) {
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)

  // Filter templates by domain if available
  const relevantTemplates = siaDomain
    ? FLOW_TEMPLATES.filter(t =>
        t.category.toLowerCase().includes(siaDomain.toLowerCase()) ||
        siaDomain.toLowerCase().includes(t.category.toLowerCase())
      )
    : []

  const otherTemplates = siaDomain
    ? FLOW_TEMPLATES.filter(t =>
        !t.category.toLowerCase().includes(siaDomain.toLowerCase()) &&
        !siaDomain.toLowerCase().includes(t.category.toLowerCase())
      )
    : FLOW_TEMPLATES

  const handleQuickStart = (scenario: typeof quickStartScenarios[0]) => {
    setSelectedScenario(scenario.id)
    // Add the first node of the scenario
    onAddNode(scenario.steps[0])
  }

  if (showTemplates) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LayoutTemplate className="h-5 w-5" />
                  Templates de flux IA
                </CardTitle>
                <CardDescription>
                  Choisissez un template pré-configuré adapté à votre cas d&apos;usage
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowTemplates(false)}>
                Retour
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto max-h-[60vh]">
            {relevantTemplates.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Recommandés pour votre domaine
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relevantTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={() => onLoadTemplate(template)}
                      highlighted
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {relevantTemplates.length > 0 ? 'Autres templates' : 'Tous les templates'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherTemplates.slice(0, 6).map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={() => onLoadTemplate(template)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-6">
        {/* Main prompt */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Créez votre cartographie</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Modélisez les flux de données de votre système pour identifier automatiquement
            les enjeux éthiques et les domaines de vigilance.
          </p>
        </div>

        {/* Two columns: Templates or Manual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Templates option */}
          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => setShowTemplates(true)}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <LayoutTemplate className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Partir d&apos;un template</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Utilisez un modèle pré-configuré adapté à votre secteur
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">Scoring crédit</Badge>
                  <Badge variant="secondary">Recrutement</Badge>
                  <Badge variant="secondary">+{FLOW_TEMPLATES.length - 2}</Badge>
                </div>
                <Button variant="ghost" className="gap-2">
                  Voir les templates
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Build from scratch */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Construire manuellement</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Commencez par ajouter les éléments de votre système
                  </p>
                </div>

                {/* Quick start scenarios */}
                <div className="w-full space-y-2">
                  {quickStartScenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => handleQuickStart(scenario)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                    >
                      <scenario.icon className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{scenario.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {scenario.steps.map((s, i) => (
                            <span key={s}>
                              {i > 0 && ' → '}
                              {nodeTypeInfo.find(n => n.type === s)?.shortLabel || s}
                            </span>
                          ))}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Node types reference */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground mb-3 text-center">
              Les types d&apos;éléments que vous pouvez ajouter :
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {nodeTypeInfo.map((node) => (
                <button
                  key={node.type}
                  onClick={() => onAddNode(node.type)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white transition-colors group"
                >
                  <div className={`h-8 w-8 rounded-lg ${node.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <node.icon className={`h-4 w-4 ${node.color}`} />
                  </div>
                  <span className="text-xs font-medium">{node.shortLabel}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TemplateCard({
  template,
  onSelect,
  highlighted,
}: {
  template: FlowTemplate
  onSelect: () => void
  highlighted?: boolean
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
        highlighted ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      }`}
    >
      <span className="text-2xl">{template.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{template.name}</span>
          <Badge variant="outline" className="text-xs">
            {template.category}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {template.description}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {template.nodes.length} nœuds · {template.edges.length} flux
        </p>
      </div>
    </button>
  )
}

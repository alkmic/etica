import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create demo user
  const hashedPassword = await hash('password123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin Test',
      password: hashedPassword,
    },
  })

  console.log('Created demo user:', user.email)

  // =============================================================================
  // SIA 1: Système de Scoring Crédit
  // =============================================================================
  const scoringCredit = await prisma.sia.create({
    data: {
      name: 'Système de scoring crédit',
      description: 'Système algorithmique d\'évaluation du risque crédit pour les demandes de prêt personnel. Analyse les données financières et comportementales pour calculer un score de solvabilité.',
      domain: 'FINANCE',
      status: 'ACTIVE',
      decisionType: 'ASSISTED_DECISION',
      scale: 'LARGE',
      dataTypes: ['FINANCIAL', 'BEHAVIORAL', 'IDENTITY'],
      populations: ['Demandeurs de crédit', 'Clients existants'],
      hasVulnerable: true,
      ownerId: user.id,
      vigilanceScores: {
        global: 3.8,
        domains: {
          PRIVACY: 4,
          EQUITY: 4,
          TRANSPARENCY: 3,
          AUTONOMY: 3,
          SECURITY: 4,
          RECOURSE: 4,
          CONTROL: 3,
          RESPONSIBILITY: 4,
          SOVEREIGNTY: 2,
          SUSTAINABILITY: 2,
          LOYALTY: 3,
          BALANCE: 4,
        },
      },
    },
  })

  // Nodes for scoring credit
  const scoringNodes = await Promise.all([
    prisma.node.create({
      data: {
        siaId: scoringCredit.id,
        type: 'HUMAN',
        label: 'Demandeur',
        positionX: 50,
        positionY: 200,
        attributes: {
          functionType: 'STAKEHOLDER',
          entityType: 'HUMAN',
          description: 'Client demandant un prêt personnel',
          dataTypes: ['IDENTITY', 'FINANCIAL'],
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: scoringCredit.id,
        type: 'INFRA',
        label: 'Formulaire demande',
        positionX: 250,
        positionY: 200,
        attributes: {
          functionType: 'SOURCE',
          entityType: 'INFRA',
          description: 'Collecte des informations du demandeur',
          dataTypes: ['IDENTITY', 'FINANCIAL', 'PROFESSIONAL'],
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: scoringCredit.id,
        type: 'INFRA',
        label: 'Base clients',
        positionX: 250,
        positionY: 350,
        attributes: {
          functionType: 'STORAGE',
          entityType: 'INFRA',
          description: 'Historique des clients et transactions',
          dataTypes: ['FINANCIAL', 'BEHAVIORAL'],
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: scoringCredit.id,
        type: 'AI',
        label: 'Modèle ML Scoring',
        positionX: 500,
        positionY: 200,
        attributes: {
          functionType: 'DECISION',
          entityType: 'AI',
          description: 'Modèle de machine learning calculant le score de risque',
          opacity: 'explainable',
          isExternal: false,
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: scoringCredit.id,
        type: 'AI',
        label: 'API Bureau crédit',
        positionX: 500,
        positionY: 350,
        attributes: {
          functionType: 'SOURCE',
          entityType: 'AI',
          description: 'Service externe de scoring crédit (Experian, Equifax)',
          isExternal: true,
          externalProvider: 'Bureau de crédit externe',
          externalLocation: 'France/UE',
          opacity: 'opaque',
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: scoringCredit.id,
        type: 'HUMAN',
        label: 'Analyste crédit',
        positionX: 750,
        positionY: 200,
        attributes: {
          functionType: 'STAKEHOLDER',
          entityType: 'HUMAN',
          description: 'Valide ou ajuste la décision finale',
          dataTypes: ['SCORE', 'RECOMMENDATION'],
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: scoringCredit.id,
        type: 'INFRA',
        label: 'Notification décision',
        positionX: 950,
        positionY: 200,
        attributes: {
          functionType: 'ACTION',
          entityType: 'INFRA',
          description: 'Envoi de la décision au demandeur',
        },
      },
    }),
  ])

  // Edges for scoring credit
  const scoringEdges = await Promise.all([
    prisma.edge.create({
      data: {
        siaId: scoringCredit.id,
        sourceId: scoringNodes[0].id,
        targetId: scoringNodes[1].id,
        label: 'Saisie données',
        direction: 'H2M',
        nature: 'COLLECT',
        automation: 'INFORMATIVE',
        sensitivity: 'SENSITIVE',
        dataCategories: ['IDENTITY', 'FINANCIAL'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: scoringCredit.id,
        sourceId: scoringNodes[1].id,
        targetId: scoringNodes[3].id,
        label: 'Données demande',
        direction: 'M2M',
        nature: 'TRANSFER',
        automation: 'SEMI_AUTO',
        sensitivity: 'SENSITIVE',
        dataCategories: ['IDENTITY', 'FINANCIAL'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: scoringCredit.id,
        sourceId: scoringNodes[2].id,
        targetId: scoringNodes[3].id,
        label: 'Historique client',
        direction: 'M2M',
        nature: 'ENRICHMENT',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'SENSITIVE',
        dataCategories: ['FINANCIAL', 'BEHAVIORAL'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: scoringCredit.id,
        sourceId: scoringNodes[4].id,
        targetId: scoringNodes[3].id,
        label: 'Score externe',
        direction: 'M2M',
        nature: 'ENRICHMENT',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'HIGHLY_SENSITIVE',
        dataCategories: ['SCORE', 'FINANCIAL'],
        opacity: 4,
      },
    }),
    prisma.edge.create({
      data: {
        siaId: scoringCredit.id,
        sourceId: scoringNodes[3].id,
        targetId: scoringNodes[5].id,
        label: 'Recommandation',
        direction: 'M2H',
        nature: 'RECOMMENDATION',
        automation: 'ASSISTED',
        sensitivity: 'STANDARD',
        dataCategories: ['SCORE', 'RECOMMENDATION'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: scoringCredit.id,
        sourceId: scoringNodes[5].id,
        targetId: scoringNodes[6].id,
        label: 'Décision finale',
        direction: 'H2M',
        nature: 'DECISION',
        automation: 'ASSISTED',
        sensitivity: 'STANDARD',
        dataCategories: ['DECISION'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: scoringCredit.id,
        sourceId: scoringNodes[6].id,
        targetId: scoringNodes[0].id,
        label: 'Notification',
        direction: 'M2H',
        nature: 'NOTIFICATION',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'STANDARD',
        dataCategories: ['DECISION'],
      },
    }),
  ])

  // Tensions for scoring credit
  const scoringTensions = await Promise.all([
    prisma.tension.create({
      data: {
        siaId: scoringCredit.id,
        pattern: 'EFFICIENCY_VS_TRANSPARENCY',
        description: 'Le modèle ML utilise des features complexes qui améliorent la précision mais réduisent l\'explicabilité.',
        status: 'ARBITRATED',
        severity: 4,
        impactedDomains: ['TRANSPARENCY', 'RECOURSE'],
        triggeredByRule: 'R012',
        tensionEdges: {
          create: [{ edgeId: scoringEdges[3].id }],
        },
      },
    }),
    prisma.tension.create({
      data: {
        siaId: scoringCredit.id,
        pattern: 'PERFORMANCE_VS_EQUITY',
        description: 'Le scoring peut défavoriser certaines catégories de population (jeunes, travailleurs indépendants).',
        status: 'IN_PROGRESS',
        severity: 4,
        impactedDomains: ['EQUITY', 'AUTONOMY'],
        triggeredByRule: 'R015',
        tensionEdges: {
          create: [{ edgeId: scoringEdges[1].id }, { edgeId: scoringEdges[2].id }],
        },
      },
    }),
    prisma.tension.create({
      data: {
        siaId: scoringCredit.id,
        pattern: 'SOVEREIGNTY_VS_PERFORMANCE',
        description: 'L\'utilisation du bureau de crédit externe crée une dépendance sur un fournisseur tiers.',
        status: 'QUALIFIED',
        severity: 3,
        impactedDomains: ['SOVEREIGNTY', 'CONTROL'],
        triggeredByRule: 'R044',
        tensionEdges: {
          create: [{ edgeId: scoringEdges[3].id }],
        },
      },
    }),
  ])

  // Arbitration for first tension
  await prisma.arbitration.create({
    data: {
      tensionId: scoringTensions[0].id,
      decision: 'Priorisation de la transparence avec explicabilité augmentée',
      justification: 'Conformément au RGPD Art. 22 et à la réglementation bancaire, nous priorisons la capacité à expliquer les décisions aux clients tout en maintenant une performance acceptable.',
      proportionality: 'Le modèle SHAP a été intégré pour fournir des explications locales sans dégrader significativement la performance.',
      contestability: 'Le client peut demander une révision humaine de sa demande et obtenir les facteurs principaux ayant influencé la décision.',
      revisionConditions: 'À réviser lors de la prochaine mise à jour du modèle ou si le taux de contestation dépasse 5%.',
      compensatoryMeasures: 'Formation des conseillers à l\'explication des scores, mise en place d\'un processus de recours simplifié.',
    },
  })

  // Actions for scoring credit
  await Promise.all([
    prisma.action.create({
      data: {
        siaId: scoringCredit.id,
        tensionId: scoringTensions[0].id,
        title: 'Intégrer les explications SHAP dans l\'interface conseiller',
        description: 'Ajouter un module d\'explication des facteurs clés pour chaque score calculé.',
        category: 'TRANSPARENCY',
        priority: 'HIGH',
        effort: 'MEDIUM',
        status: 'DONE',
        estimatedImpact: { TRANSPARENCY: -2, RECOURSE: -1 },
        checklist: [
          { text: 'Implémenter SHAP values', completed: true },
          { text: 'Créer l\'interface de visualisation', completed: true },
          { text: 'Former les conseillers', completed: true },
        ],
      },
    }),
    prisma.action.create({
      data: {
        siaId: scoringCredit.id,
        tensionId: scoringTensions[1].id,
        title: 'Audit de biais sur les populations sensibles',
        description: 'Réaliser un audit statistique pour identifier les biais potentiels.',
        category: 'AUDIT',
        priority: 'CRITICAL',
        effort: 'LARGE',
        status: 'IN_PROGRESS',
        estimatedImpact: { EQUITY: -2 },
        checklist: [
          { text: 'Définir les métriques de fairness', completed: true },
          { text: 'Collecter les données de test', completed: true },
          { text: 'Analyser les disparités', completed: false },
          { text: 'Documenter les résultats', completed: false },
        ],
      },
    }),
    prisma.action.create({
      data: {
        siaId: scoringCredit.id,
        tensionId: scoringTensions[1].id,
        title: 'Implémenter des métriques d\'équité',
        description: 'Ajouter le monitoring de disparate impact et equal opportunity.',
        category: 'TECHNICAL',
        priority: 'HIGH',
        effort: 'MEDIUM',
        status: 'TODO',
        estimatedImpact: { EQUITY: -1 },
      },
    }),
    prisma.action.create({
      data: {
        siaId: scoringCredit.id,
        tensionId: scoringTensions[2].id,
        title: 'Évaluer les alternatives au bureau de crédit externe',
        description: 'Étudier la possibilité de réduire la dépendance au fournisseur externe.',
        category: 'ORGANIZATIONAL',
        priority: 'MEDIUM',
        effort: 'LARGE',
        status: 'TODO',
        estimatedImpact: { SOVEREIGNTY: -2, CONTROL: -1 },
      },
    }),
  ])

  console.log('Created SIA: Système de scoring crédit')

  // =============================================================================
  // SIA 2: Tri automatique de candidatures
  // =============================================================================
  const triCV = await prisma.sia.create({
    data: {
      name: 'Tri automatique de candidatures',
      description: 'Système de pré-sélection automatisée des CV pour les postes ouverts. Analyse le contenu des CV et classe les candidats par pertinence.',
      domain: 'HR',
      status: 'ACTIVE',
      decisionType: 'ASSISTED_DECISION',
      scale: 'MEDIUM',
      dataTypes: ['IDENTITY', 'PROFESSIONAL', 'EDUCATIONAL'],
      populations: ['Candidats', 'Recruteurs'],
      hasVulnerable: false,
      ownerId: user.id,
      vigilanceScores: {
        global: 3.5,
        domains: {
          PRIVACY: 3,
          EQUITY: 4,
          TRANSPARENCY: 3,
          AUTONOMY: 4,
          SECURITY: 3,
          RECOURSE: 4,
          CONTROL: 4,
          RESPONSIBILITY: 4,
          SOVEREIGNTY: 3,
          SUSTAINABILITY: 2,
          LOYALTY: 3,
          BALANCE: 3,
        },
      },
    },
  })

  // Nodes for CV screening
  const cvNodes = await Promise.all([
    prisma.node.create({
      data: {
        siaId: triCV.id,
        type: 'HUMAN',
        label: 'Candidat',
        positionX: 50,
        positionY: 200,
        attributes: {
          functionType: 'STAKEHOLDER',
          entityType: 'HUMAN',
          description: 'Personne postulant à une offre d\'emploi',
          dataTypes: ['IDENTITY', 'CV', 'PROFESSIONAL'],
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: triCV.id,
        type: 'INFRA',
        label: 'Portail candidature',
        positionX: 250,
        positionY: 200,
        attributes: {
          functionType: 'SOURCE',
          entityType: 'INFRA',
          description: 'Interface de dépôt des candidatures',
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: triCV.id,
        type: 'AI',
        label: 'Parser CV',
        positionX: 450,
        positionY: 150,
        attributes: {
          functionType: 'TREATMENT',
          entityType: 'AI',
          description: 'Extraction automatique des informations du CV',
          opacity: 'transparent',
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: triCV.id,
        type: 'AI',
        label: 'Modèle matching',
        positionX: 450,
        positionY: 280,
        attributes: {
          functionType: 'DECISION',
          entityType: 'AI',
          description: 'Algorithme de matching candidat/poste',
          opacity: 'explainable',
          isExternal: false,
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: triCV.id,
        type: 'INFRA',
        label: 'Base offres',
        positionX: 250,
        positionY: 350,
        attributes: {
          functionType: 'STORAGE',
          entityType: 'INFRA',
          description: 'Référentiel des offres d\'emploi et critères',
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: triCV.id,
        type: 'HUMAN',
        label: 'Recruteur',
        positionX: 700,
        positionY: 200,
        attributes: {
          functionType: 'STAKEHOLDER',
          entityType: 'HUMAN',
          description: 'Valide la shortlist et décide des entretiens',
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: triCV.id,
        type: 'INFRA',
        label: 'Email candidat',
        positionX: 700,
        positionY: 350,
        attributes: {
          functionType: 'ACTION',
          entityType: 'INFRA',
          description: 'Notification au candidat',
        },
      },
    }),
  ])

  // Edges for CV screening
  const cvEdges = await Promise.all([
    prisma.edge.create({
      data: {
        siaId: triCV.id,
        sourceId: cvNodes[0].id,
        targetId: cvNodes[1].id,
        label: 'Dépôt candidature',
        direction: 'H2M',
        nature: 'COLLECT',
        automation: 'INFORMATIVE',
        sensitivity: 'SENSITIVE',
        dataCategories: ['CV', 'IDENTITY', 'PROFESSIONAL'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: triCV.id,
        sourceId: cvNodes[1].id,
        targetId: cvNodes[2].id,
        label: 'CV brut',
        direction: 'M2M',
        nature: 'TRANSFER',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'SENSITIVE',
        dataCategories: ['CV'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: triCV.id,
        sourceId: cvNodes[2].id,
        targetId: cvNodes[3].id,
        label: 'Données structurées',
        direction: 'M2M',
        nature: 'ENRICHMENT',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'SENSITIVE',
        dataCategories: ['PROFESSIONAL', 'EDUCATIONAL', 'SKILLS'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: triCV.id,
        sourceId: cvNodes[4].id,
        targetId: cvNodes[3].id,
        label: 'Critères poste',
        direction: 'M2M',
        nature: 'TRANSFER',
        automation: 'INFORMATIVE',
        sensitivity: 'STANDARD',
        dataCategories: ['JOB_REQUIREMENTS'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: triCV.id,
        sourceId: cvNodes[3].id,
        targetId: cvNodes[5].id,
        label: 'Shortlist',
        direction: 'M2H',
        nature: 'RECOMMENDATION',
        automation: 'ASSISTED',
        sensitivity: 'STANDARD',
        dataCategories: ['RANKING', 'SCORE'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: triCV.id,
        sourceId: cvNodes[5].id,
        targetId: cvNodes[6].id,
        label: 'Décision entretien',
        direction: 'H2M',
        nature: 'DECISION',
        automation: 'ASSISTED',
        sensitivity: 'STANDARD',
        dataCategories: ['DECISION'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: triCV.id,
        sourceId: cvNodes[6].id,
        targetId: cvNodes[0].id,
        label: 'Réponse candidature',
        direction: 'M2H',
        nature: 'NOTIFICATION',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'STANDARD',
        dataCategories: ['DECISION'],
      },
    }),
  ])

  // Tensions for CV screening
  const cvTensions = await Promise.all([
    prisma.tension.create({
      data: {
        siaId: triCV.id,
        pattern: 'PERFORMANCE_VS_EQUITY',
        description: 'Le modèle de matching peut reproduire des biais historiques présents dans les embauches passées.',
        status: 'IN_PROGRESS',
        severity: 5,
        impactedDomains: ['EQUITY', 'AUTONOMY'],
        triggeredByRule: 'R015',
        tensionEdges: {
          create: [{ edgeId: cvEdges[2].id }, { edgeId: cvEdges[4].id }],
        },
      },
    }),
    prisma.tension.create({
      data: {
        siaId: triCV.id,
        pattern: 'AUTOMATION_VS_RECOURSE',
        description: 'Les candidats rejetés automatiquement n\'ont pas de visibilité sur les critères de rejet.',
        status: 'QUALIFIED',
        severity: 4,
        impactedDomains: ['RECOURSE', 'TRANSPARENCY'],
        triggeredByRule: 'R008',
        tensionEdges: {
          create: [{ edgeId: cvEdges[6].id }],
        },
      },
    }),
    prisma.tension.create({
      data: {
        siaId: triCV.id,
        pattern: 'PREDICTION_VS_FREEWILL',
        description: 'Le scoring peut enfermer les candidats dans leur parcours passé sans considérer leur potentiel.',
        status: 'DETECTED',
        severity: 3,
        impactedDomains: ['AUTONOMY', 'EQUITY'],
        triggeredByRule: 'R019',
        tensionEdges: {
          create: [{ edgeId: cvEdges[4].id }],
        },
      },
    }),
  ])

  // Actions for CV screening
  await Promise.all([
    prisma.action.create({
      data: {
        siaId: triCV.id,
        tensionId: cvTensions[0].id,
        title: 'Audit de biais du modèle de matching',
        description: 'Analyser les disparités de sélection par genre, âge, origine géographique.',
        category: 'AUDIT',
        priority: 'CRITICAL',
        effort: 'LARGE',
        status: 'IN_PROGRESS',
        estimatedImpact: { EQUITY: -2 },
        checklist: [
          { text: 'Définir les variables protégées', completed: true },
          { text: 'Collecter les données de test', completed: true },
          { text: 'Calculer les métriques de fairness', completed: false },
          { text: 'Identifier les sources de biais', completed: false },
        ],
      },
    }),
    prisma.action.create({
      data: {
        siaId: triCV.id,
        tensionId: cvTensions[1].id,
        title: 'Créer un feedback personnalisé pour les candidats',
        description: 'Générer une explication des critères manquants pour chaque candidat non retenu.',
        category: 'TRANSPARENCY',
        priority: 'HIGH',
        effort: 'MEDIUM',
        status: 'TODO',
        estimatedImpact: { TRANSPARENCY: -2, RECOURSE: -1 },
      },
    }),
    prisma.action.create({
      data: {
        siaId: triCV.id,
        tensionId: cvTensions[1].id,
        title: 'Mettre en place un processus de recours',
        description: 'Permettre aux candidats de demander une révision humaine de leur candidature.',
        category: 'RECOURSE',
        priority: 'HIGH',
        effort: 'SMALL',
        status: 'TODO',
        estimatedImpact: { RECOURSE: -2 },
      },
    }),
  ])

  console.log('Created SIA: Tri automatique de candidatures')

  // =============================================================================
  // SIA 3: Chatbot service client
  // =============================================================================
  const chatbot = await prisma.sia.create({
    data: {
      name: 'Chatbot service client',
      description: 'Assistant conversationnel IA pour le support client 24/7 avec capacités de résolution automatique des demandes simples et escalade vers les agents humains.',
      domain: 'COMMERCE',
      status: 'ACTIVE',
      decisionType: 'RECOMMENDATION',
      scale: 'VERY_LARGE',
      dataTypes: ['INTERACTIONS', 'IDENTITY', 'TRANSACTIONS'],
      populations: ['Clients', 'Agents support'],
      hasVulnerable: true,
      ownerId: user.id,
      vigilanceScores: {
        global: 3.2,
        domains: {
          PRIVACY: 3,
          EQUITY: 3,
          TRANSPARENCY: 4,
          AUTONOMY: 4,
          SECURITY: 3,
          RECOURSE: 4,
          CONTROL: 3,
          RESPONSIBILITY: 3,
          SOVEREIGNTY: 2,
          SUSTAINABILITY: 3,
          LOYALTY: 3,
          BALANCE: 2,
        },
      },
    },
  })

  // Nodes for chatbot
  const chatbotNodes = await Promise.all([
    prisma.node.create({
      data: {
        siaId: chatbot.id,
        type: 'HUMAN',
        label: 'Client',
        positionX: 50,
        positionY: 200,
        attributes: {
          functionType: 'STAKEHOLDER',
          entityType: 'HUMAN',
          description: 'Utilisateur du service client',
          dataTypes: ['IDENTITY', 'INTERACTIONS'],
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: chatbot.id,
        type: 'INFRA',
        label: 'Interface chat',
        positionX: 200,
        positionY: 200,
        attributes: {
          functionType: 'SOURCE',
          entityType: 'INFRA',
          description: 'Widget de chat sur le site',
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: chatbot.id,
        type: 'AI',
        label: 'API LLM (GPT)',
        positionX: 400,
        positionY: 120,
        attributes: {
          functionType: 'DECISION',
          entityType: 'AI',
          description: 'Service LLM pour la compréhension et génération de réponses',
          isExternal: true,
          externalProvider: 'OpenAI',
          externalLocation: 'USA',
          opacity: 'opaque',
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: chatbot.id,
        type: 'INFRA',
        label: 'Base FAQ',
        positionX: 400,
        positionY: 280,
        attributes: {
          functionType: 'STORAGE',
          entityType: 'INFRA',
          description: 'Base de connaissances et FAQ',
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: chatbot.id,
        type: 'INFRA',
        label: 'CRM',
        positionX: 400,
        positionY: 380,
        attributes: {
          functionType: 'STORAGE',
          entityType: 'INFRA',
          description: 'Historique client et commandes',
          dataTypes: ['TRANSACTIONS', 'INTERACTIONS'],
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: chatbot.id,
        type: 'AI',
        label: 'Orchestrateur',
        positionX: 600,
        positionY: 200,
        attributes: {
          functionType: 'TREATMENT',
          entityType: 'AI',
          description: 'Décide de la réponse ou de l\'escalade',
          opacity: 'transparent',
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: chatbot.id,
        type: 'HUMAN',
        label: 'Agent support',
        positionX: 800,
        positionY: 300,
        attributes: {
          functionType: 'STAKEHOLDER',
          entityType: 'HUMAN',
          description: 'Agent humain pour les cas complexes',
        },
      },
    }),
    prisma.node.create({
      data: {
        siaId: chatbot.id,
        type: 'INFRA',
        label: 'Réponse automatique',
        positionX: 800,
        positionY: 120,
        attributes: {
          functionType: 'ACTION',
          entityType: 'INFRA',
          description: 'Envoi de la réponse au client',
        },
      },
    }),
  ])

  // Edges for chatbot
  const chatbotEdges = await Promise.all([
    prisma.edge.create({
      data: {
        siaId: chatbot.id,
        sourceId: chatbotNodes[0].id,
        targetId: chatbotNodes[1].id,
        label: 'Question client',
        direction: 'H2M',
        nature: 'COLLECT',
        automation: 'INFORMATIVE',
        sensitivity: 'STANDARD',
        dataCategories: ['MESSAGE', 'CONTEXT'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: chatbot.id,
        sourceId: chatbotNodes[1].id,
        targetId: chatbotNodes[2].id,
        label: 'Prompt enrichi',
        direction: 'M2M',
        nature: 'INFERENCE',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'SENSITIVE',
        dataCategories: ['MESSAGE', 'CONTEXT'],
        opacity: 4,
      },
    }),
    prisma.edge.create({
      data: {
        siaId: chatbot.id,
        sourceId: chatbotNodes[3].id,
        targetId: chatbotNodes[5].id,
        label: 'Contexte FAQ',
        direction: 'M2M',
        nature: 'ENRICHMENT',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'STANDARD',
        dataCategories: ['KNOWLEDGE'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: chatbot.id,
        sourceId: chatbotNodes[4].id,
        targetId: chatbotNodes[5].id,
        label: 'Contexte client',
        direction: 'M2M',
        nature: 'ENRICHMENT',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'SENSITIVE',
        dataCategories: ['TRANSACTIONS', 'HISTORY'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: chatbot.id,
        sourceId: chatbotNodes[2].id,
        targetId: chatbotNodes[5].id,
        label: 'Réponse LLM',
        direction: 'M2M',
        nature: 'INFERENCE',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'STANDARD',
        dataCategories: ['RESPONSE'],
        opacity: 4,
      },
    }),
    prisma.edge.create({
      data: {
        siaId: chatbot.id,
        sourceId: chatbotNodes[5].id,
        targetId: chatbotNodes[7].id,
        label: 'Réponse auto',
        direction: 'M2M',
        nature: 'DECISION',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'STANDARD',
        dataCategories: ['RESPONSE'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: chatbot.id,
        sourceId: chatbotNodes[5].id,
        targetId: chatbotNodes[6].id,
        label: 'Escalade',
        direction: 'M2H',
        nature: 'CONTROL',
        automation: 'SEMI_AUTO',
        sensitivity: 'STANDARD',
        dataCategories: ['CONTEXT', 'CONVERSATION'],
      },
    }),
    prisma.edge.create({
      data: {
        siaId: chatbot.id,
        sourceId: chatbotNodes[7].id,
        targetId: chatbotNodes[0].id,
        label: 'Réponse client',
        direction: 'M2H',
        nature: 'NOTIFICATION',
        automation: 'AUTO_WITH_RECOURSE',
        sensitivity: 'STANDARD',
        dataCategories: ['RESPONSE'],
      },
    }),
  ])

  // Tensions for chatbot
  const chatbotTensions = await Promise.all([
    prisma.tension.create({
      data: {
        siaId: chatbot.id,
        pattern: 'SOVEREIGNTY_VS_PERFORMANCE',
        description: 'L\'utilisation de l\'API OpenAI (GPT) crée une forte dépendance à un fournisseur américain.',
        status: 'QUALIFIED',
        severity: 4,
        impactedDomains: ['SOVEREIGNTY', 'CONTROL', 'PRIVACY'],
        triggeredByRule: 'R044',
        tensionEdges: {
          create: [{ edgeId: chatbotEdges[1].id }, { edgeId: chatbotEdges[4].id }],
        },
      },
    }),
    prisma.tension.create({
      data: {
        siaId: chatbot.id,
        pattern: 'CONTROL_VS_INNOVATION',
        description: 'Le modèle LLM est une boîte noire dont le comportement peut varier après les mises à jour.',
        status: 'IN_PROGRESS',
        severity: 3,
        impactedDomains: ['CONTROL', 'TRANSPARENCY'],
        triggeredByRule: 'R045',
        tensionEdges: {
          create: [{ edgeId: chatbotEdges[4].id }],
        },
      },
    }),
    prisma.tension.create({
      data: {
        siaId: chatbot.id,
        pattern: 'PERFORMANCE_VS_SUSTAINABILITY',
        description: 'Les appels fréquents au LLM ont un impact environnemental significatif.',
        status: 'DETECTED',
        severity: 2,
        impactedDomains: ['SUSTAINABILITY'],
        triggeredByRule: 'R048',
        tensionEdges: {
          create: [{ edgeId: chatbotEdges[1].id }],
        },
      },
    }),
    prisma.tension.create({
      data: {
        siaId: chatbot.id,
        pattern: 'AUTOMATION_VS_RECOURSE',
        description: 'Les réponses automatiques peuvent être erronées sans que le client puisse facilement contacter un humain.',
        status: 'ARBITRATED',
        severity: 3,
        impactedDomains: ['RECOURSE', 'AUTONOMY'],
        triggeredByRule: 'R008',
        tensionEdges: {
          create: [{ edgeId: chatbotEdges[5].id }, { edgeId: chatbotEdges[7].id }],
        },
      },
    }),
  ])

  // Arbitration for chatbot
  await prisma.arbitration.create({
    data: {
      tensionId: chatbotTensions[3].id,
      decision: 'Équilibre automatisation/recours avec escalade facile',
      justification: 'Nous maintenons l\'automatisation pour l\'efficacité mais garantissons un accès rapide à un agent humain.',
      proportionality: 'Le chatbot résout 70% des demandes, les 30% restants sont escaladés. Temps moyen d\'accès à un humain < 2 min.',
      contestability: 'Bouton "Parler à un agent" visible en permanence, aucune question de qualification préalable.',
      revisionConditions: 'À réviser si le taux de satisfaction post-escalade descend sous 80%.',
      compensatoryMeasures: 'Monitoring des conversations escaladées pour améliorer le modèle, formation continue des agents.',
    },
  })

  // Actions for chatbot
  await Promise.all([
    prisma.action.create({
      data: {
        siaId: chatbot.id,
        tensionId: chatbotTensions[0].id,
        title: 'Évaluer les alternatives au LLM externe',
        description: 'Étudier les options de modèles open source hébergés en interne ou en Europe.',
        category: 'ORGANIZATIONAL',
        priority: 'MEDIUM',
        effort: 'HUGE',
        status: 'TODO',
        estimatedImpact: { SOVEREIGNTY: -3, CONTROL: -2 },
      },
    }),
    prisma.action.create({
      data: {
        siaId: chatbot.id,
        tensionId: chatbotTensions[0].id,
        title: 'Négocier un DPA avec garanties de localisation',
        description: 'Obtenir des garanties contractuelles sur le traitement des données.',
        category: 'ORGANIZATIONAL',
        priority: 'HIGH',
        effort: 'MEDIUM',
        status: 'IN_PROGRESS',
        estimatedImpact: { PRIVACY: -1, SOVEREIGNTY: -1 },
        checklist: [
          { text: 'Identifier les exigences légales', completed: true },
          { text: 'Rédiger les clauses nécessaires', completed: true },
          { text: 'Négocier avec le fournisseur', completed: false },
          { text: 'Faire valider par le juridique', completed: false },
        ],
      },
    }),
    prisma.action.create({
      data: {
        siaId: chatbot.id,
        tensionId: chatbotTensions[1].id,
        title: 'Mettre en place un monitoring des réponses',
        description: 'Détecter les dérives de comportement du modèle après mises à jour.',
        category: 'TECHNICAL',
        priority: 'HIGH',
        effort: 'MEDIUM',
        status: 'DONE',
        estimatedImpact: { CONTROL: -2 },
        checklist: [
          { text: 'Définir les métriques de qualité', completed: true },
          { text: 'Implémenter le logging', completed: true },
          { text: 'Créer les dashboards', completed: true },
          { text: 'Configurer les alertes', completed: true },
        ],
      },
    }),
    prisma.action.create({
      data: {
        siaId: chatbot.id,
        tensionId: chatbotTensions[2].id,
        title: 'Optimiser le cache des réponses',
        description: 'Réduire les appels au LLM en cachant les réponses fréquentes.',
        category: 'TECHNICAL',
        priority: 'LOW',
        effort: 'SMALL',
        status: 'DONE',
        estimatedImpact: { SUSTAINABILITY: -1 },
      },
    }),
    prisma.action.create({
      data: {
        siaId: chatbot.id,
        tensionId: chatbotTensions[3].id,
        title: 'Améliorer le bouton d\'escalade',
        description: 'Rendre le bouton "Parler à un agent" plus visible.',
        category: 'DESIGN',
        priority: 'HIGH',
        effort: 'TRIVIAL',
        status: 'DONE',
        estimatedImpact: { RECOURSE: -1, AUTONOMY: -1 },
      },
    }),
  ])

  console.log('Created SIA: Chatbot service client')

  console.log('')
  console.log('Database seeded successfully!')
  console.log('')
  console.log('Test account:')
  console.log('   Email: admin@test.com')
  console.log('   Password: password123')
  console.log('')
  console.log('Example SIAs created:')
  console.log('   1. Système de scoring crédit (Finance)')
  console.log('   2. Tri automatique de candidatures (RH)')
  console.log('   3. Chatbot service client (Commerce)')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await hash('demo123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@etica.fr' },
    update: {},
    create: {
      email: 'demo@etica.fr',
      name: 'Utilisateur Demo',
      password: hashedPassword,
    },
  })

  console.log('✅ Created demo user:', user.email)

  // Create sample SIA
  const sia = await prisma.sia.upsert({
    where: { id: 'demo-sia-001' },
    update: {},
    create: {
      id: 'demo-sia-001',
      name: 'Système de scoring crédit',
      description: 'Système algorithmique d\'évaluation du risque crédit pour les demandes de prêt personnel.',
      sector: 'FINANCE',
      status: 'ACTIVE',
      decisionType: 'ASSISTED_DECISION',
      userScale: 'LARGE',
      dataTypes: ['FINANCIAL', 'PROFESSIONAL', 'IDENTIFIER'],
      populations: ['Particuliers', 'Demandeurs de crédit'],
      hasVulnerable: true,
      ownerId: user.id,
      vigilanceScores: {
        global: 3.2,
        domains: {
          PRIVACY: 2.8,
          EQUITY: 2.5,
          TRANSPARENCY: 3.5,
          AUTONOMY: 4.0,
          SECURITY: 3.8,
          RECOURSE: 3.0,
          SUSTAINABILITY: 3.5,
          RESPONSIBILITY: 2.5,
        },
      },
    },
  })

  console.log('✅ Created demo SIA:', sia.name)

  // Create sample nodes (using correct NodeType enum: HUMAN, AI, INFRA, ORG)
  const nodes = await Promise.all([
    prisma.node.upsert({
      where: { id: 'node-human-1' },
      update: {},
      create: {
        id: 'node-human-1',
        siaId: sia.id,
        type: 'HUMAN',
        subtype: 'USER',
        label: 'Client demandeur',
        positionX: 100,
        positionY: 200,
        attributes: {
          humanType: 'user',
          vulnerability: 'none',
          hasConsented: true,
          canAppeal: true,
        },
      },
    }),
    prisma.node.upsert({
      where: { id: 'node-infra-1' },
      update: {},
      create: {
        id: 'node-infra-1',
        siaId: sia.id,
        type: 'INFRA',
        subtype: 'DATABASE',
        label: 'Base de données clients',
        positionX: 100,
        positionY: 350,
        attributes: {
          infraType: 'database',
          hasEncryption: true,
          retentionPolicy: 'standard',
          isExternal: false,
        },
      },
    }),
    prisma.node.upsert({
      where: { id: 'node-ai-1' },
      update: {},
      create: {
        id: 'node-ai-1',
        siaId: sia.id,
        type: 'AI',
        subtype: 'SCORING',
        label: 'Modèle de scoring ML',
        positionX: 350,
        positionY: 275,
        attributes: {
          modelType: 'ml_classic',
          autonomyLevel: 'suggestive',
          hasExplainability: false,
          hasBiasTesting: true,
          isExternal: false,
        },
      },
    }),
    prisma.node.upsert({
      where: { id: 'node-human-2' },
      update: {},
      create: {
        id: 'node-human-2',
        siaId: sia.id,
        type: 'HUMAN',
        subtype: 'OPERATOR',
        label: 'Analyste crédit',
        positionX: 550,
        positionY: 275,
        attributes: {
          humanType: 'operator',
          expertise: 'high',
          decisionPower: 'final',
        },
      },
    }),
  ])

  console.log('✅ Created', nodes.length, 'nodes')

  // Create sample edges (using correct schema fields)
  const edges = await Promise.all([
    prisma.edge.upsert({
      where: { id: 'edge-1' },
      update: {},
      create: {
        id: 'edge-1',
        siaId: sia.id,
        sourceId: 'node-human-1',
        targetId: 'node-infra-1',
        label: 'Soumission dossier',
        direction: 'H2M',
        nature: 'COLLECTION',
        dataCategories: ['FINANCIAL', 'IDENTIFIER', 'PROFESSIONAL'],
        sensitivity: 'SENSITIVE',
        automation: 'INFORMATIVE',
      },
    }),
    prisma.edge.upsert({
      where: { id: 'edge-2' },
      update: {},
      create: {
        id: 'edge-2',
        siaId: sia.id,
        sourceId: 'node-infra-1',
        targetId: 'node-ai-1',
        label: 'Données pour scoring',
        direction: 'M2M',
        nature: 'PROCESSING',
        dataCategories: ['FINANCIAL', 'PROFESSIONAL'],
        sensitivity: 'SENSITIVE',
        automation: 'ASSISTED',
      },
    }),
    prisma.edge.upsert({
      where: { id: 'edge-3' },
      update: {},
      create: {
        id: 'edge-3',
        siaId: sia.id,
        sourceId: 'node-ai-1',
        targetId: 'node-human-2',
        label: 'Score de risque',
        direction: 'M2H',
        nature: 'SCORING',
        dataCategories: ['INFERRED'],
        sensitivity: 'STANDARD',
        automation: 'SEMI_AUTO',
        opacity: 4,
      },
    }),
    prisma.edge.upsert({
      where: { id: 'edge-4' },
      update: {},
      create: {
        id: 'edge-4',
        siaId: sia.id,
        sourceId: 'node-human-2',
        targetId: 'node-human-1',
        label: 'Décision finale',
        direction: 'M2H',
        nature: 'DECISION',
        dataCategories: ['INFERRED'],
        sensitivity: 'STANDARD',
        automation: 'SEMI_AUTO',
      },
    }),
  ])

  console.log('✅ Created', edges.length, 'edges')

  // Create sample tensions (using correct schema fields)
  const tensions = await Promise.all([
    prisma.tension.upsert({
      where: { id: 'tension-1' },
      update: {},
      create: {
        id: 'tension-1',
        siaId: sia.id,
        ruleId: 'S-002',
        ruleName: 'Efficacité vs Transparence',
        ruleFamily: 'STRUCTURAL',
        domainA: 'TRANSPARENCY',
        domainB: 'EQUITY',
        formulation: 'Le modèle ML utilisé pour le scoring est une boîte noire dont les critères de décision ne sont pas explicables aux clients.',
        severity: 4,
        maturity: 1,
        status: 'QUALIFIED',
        impactedDomains: ['TRANSPARENCY', 'EQUITY'],
        affectedEdgeIds: ['edge-3'],
      },
    }),
    prisma.tension.upsert({
      where: { id: 'tension-2' },
      update: {},
      create: {
        id: 'tension-2',
        siaId: sia.id,
        ruleId: 'D-001',
        ruleName: 'Sécurité vs Vie privée',
        ruleFamily: 'DATA',
        domainA: 'PRIVACY',
        domainB: 'SECURITY',
        formulation: 'Les données financières sensibles sont conservées pour une durée longue afin d\'améliorer le modèle.',
        severity: 3,
        maturity: 0,
        status: 'DETECTED',
        impactedDomains: ['PRIVACY', 'SECURITY'],
        affectedEdgeIds: ['edge-1', 'edge-2'],
      },
    }),
    prisma.tension.upsert({
      where: { id: 'tension-3' },
      update: {},
      create: {
        id: 'tension-3',
        siaId: sia.id,
        ruleId: 'C-001',
        ruleName: 'Autonomie vs Équité',
        ruleFamily: 'CONTEXTUAL',
        domainA: 'AUTONOMY',
        domainB: 'EQUITY',
        formulation: 'Les populations vulnérables peuvent être désavantagées par le scoring automatique.',
        severity: 5,
        maturity: 0,
        status: 'DETECTED',
        impactedDomains: ['AUTONOMY', 'EQUITY'],
        affectedEdgeIds: ['edge-3', 'edge-4'],
      },
    }),
  ])

  console.log('✅ Created', tensions.length, 'tensions')

  // Link tensions to edges
  await Promise.all([
    prisma.tensionEdge.upsert({
      where: { tensionId_edgeId: { tensionId: 'tension-1', edgeId: 'edge-3' } },
      update: {},
      create: { tensionId: 'tension-1', edgeId: 'edge-3' },
    }),
    prisma.tensionEdge.upsert({
      where: { tensionId_edgeId: { tensionId: 'tension-2', edgeId: 'edge-1' } },
      update: {},
      create: { tensionId: 'tension-2', edgeId: 'edge-1' },
    }),
    prisma.tensionEdge.upsert({
      where: { tensionId_edgeId: { tensionId: 'tension-3', edgeId: 'edge-3' } },
      update: {},
      create: { tensionId: 'tension-3', edgeId: 'edge-3' },
    }),
  ])

  // Create sample actions (using correct schema fields)
  const actions = await Promise.all([
    prisma.action.upsert({
      where: { id: 'action-1' },
      update: {},
      create: {
        id: 'action-1',
        siaId: sia.id,
        dilemmaId: 'tension-1',
        title: 'Implémenter SHAP pour l\'explicabilité',
        description: 'Intégrer la librairie SHAP pour fournir des explications locales sur chaque décision de scoring.',
        actionType: 'MITIGATION',
        category: 'TRANSPARENCY',
        targetDomain: 'TRANSPARENCY',
        priority: 'HIGH',
        effort: 'MEDIUM',
        status: 'IN_PROGRESS',
        dueDate: new Date('2025-02-28'),
      },
    }),
    prisma.action.upsert({
      where: { id: 'action-2' },
      update: {},
      create: {
        id: 'action-2',
        siaId: sia.id,
        dilemmaId: 'tension-2',
        title: 'Réduire la durée de rétention',
        description: 'Limiter la conservation des données financières à 2 ans maximum.',
        actionType: 'MITIGATION',
        category: 'MINIMIZATION',
        targetDomain: 'PRIVACY',
        priority: 'MEDIUM',
        effort: 'SMALL',
        status: 'TODO',
        dueDate: new Date('2025-03-15'),
      },
    }),
    prisma.action.upsert({
      where: { id: 'action-3' },
      update: {},
      create: {
        id: 'action-3',
        siaId: sia.id,
        dilemmaId: 'tension-3',
        title: 'Créer un parcours alternatif',
        description: 'Mettre en place un processus de revue humaine systématique pour les populations vulnérables.',
        actionType: 'COMPENSATION',
        category: 'HUMAN_CONTROL',
        targetDomain: 'EQUITY',
        priority: 'CRITICAL',
        effort: 'LARGE',
        status: 'TODO',
        dueDate: new Date('2025-01-31'),
      },
    }),
    prisma.action.upsert({
      where: { id: 'action-4' },
      update: {},
      create: {
        id: 'action-4',
        siaId: sia.id,
        title: 'Audit du modèle de scoring',
        description: 'Réaliser un audit externe du modèle pour vérifier l\'absence de biais discriminatoires.',
        actionType: 'SURVEILLANCE',
        category: 'DOCUMENTATION',
        priority: 'HIGH',
        effort: 'MEDIUM',
        status: 'DONE',
        dueDate: new Date('2024-12-15'),
        completedAt: new Date('2024-12-10'),
      },
    }),
  ])

  console.log('✅ Created', actions.length, 'actions')

  // Create sample arbitration
  await prisma.arbitration.upsert({
    where: { id: 'arbitration-1' },
    update: {},
    create: {
      id: 'arbitration-1',
      tensionId: 'tension-1',
      decision: 'MITIGATE',
      justification: 'La tension est reconnue comme critique pour la conformité RGPD. L\'implémentation de SHAP permettra de fournir des explications satisfaisantes aux clients tout en conservant les performances du modèle.',
      selectedMeasures: ['Implémenter SHAP', 'Former les analystes'],
      maturityLevel: 'DECIDED',
      arbitratedById: user.id,
    },
  })

  console.log('✅ Created sample arbitration')

  // Create initial version
  await prisma.version.upsert({
    where: { id: 'version-1' },
    update: {},
    create: {
      id: 'version-1',
      siaId: sia.id,
      number: 1,
      label: 'Version initiale',
      snapshot: {
        name: sia.name,
        description: sia.description,
        status: 'DRAFT',
        nodesCount: nodes.length,
        edgesCount: edges.length,
        tensionsCount: tensions.length,
        actionsCount: actions.length,
      },
      createdById: user.id,
    },
  })

  console.log('✅ Created initial version')

  console.log('')
  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('📧 Demo account:')
  console.log('   Email: demo@etica.fr')
  console.log('   Password: demo123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

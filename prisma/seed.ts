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
      domain: 'Finance',
      status: 'IN_PROGRESS',
      decisionType: 'ASSISTED_DECISION',
      scale: 'NATIONAL',
      dataTypes: ['FINANCIAL', 'EMPLOYMENT', 'IDENTITY'],
      populations: ['Particuliers', 'Demandeurs de crédit'],
      hasVulnerable: true,
      userId: user.id,
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
          ACCOUNTABILITY: 2.5,
        },
      },
    },
  })

  console.log('✅ Created demo SIA:', sia.name)

  // Create sample nodes
  const nodes = await Promise.all([
    prisma.node.upsert({
      where: { id: 'node-source-1' },
      update: {},
      create: {
        id: 'node-source-1',
        siaId: sia.id,
        type: 'SOURCE',
        label: 'Données bancaires',
        description: 'Historique des comptes et transactions',
        dataTypes: ['FINANCIAL', 'TRANSACTIONS'],
        positionX: 100,
        positionY: 200,
        metadata: {},
      },
    }),
    prisma.node.upsert({
      where: { id: 'node-source-2' },
      update: {},
      create: {
        id: 'node-source-2',
        siaId: sia.id,
        type: 'SOURCE',
        label: 'Données employeur',
        description: 'Informations sur l\'emploi et revenus',
        dataTypes: ['EMPLOYMENT', 'INCOME'],
        positionX: 100,
        positionY: 350,
        metadata: {},
      },
    }),
    prisma.node.upsert({
      where: { id: 'node-treatment-1' },
      update: {},
      create: {
        id: 'node-treatment-1',
        siaId: sia.id,
        type: 'TREATMENT',
        label: 'Calcul du score',
        description: 'Algorithme de scoring ML',
        dataTypes: [],
        positionX: 350,
        positionY: 275,
        metadata: {},
      },
    }),
    prisma.node.upsert({
      where: { id: 'node-decision-1' },
      update: {},
      create: {
        id: 'node-decision-1',
        siaId: sia.id,
        type: 'DECISION',
        label: 'Décision crédit',
        description: 'Acceptation ou refus du crédit',
        dataTypes: [],
        positionX: 550,
        positionY: 275,
        metadata: {},
      },
    }),
    prisma.node.upsert({
      where: { id: 'node-stakeholder-1' },
      update: {},
      create: {
        id: 'node-stakeholder-1',
        siaId: sia.id,
        type: 'STAKEHOLDER',
        label: 'Client',
        description: 'Demandeur de crédit',
        dataTypes: [],
        positionX: 750,
        positionY: 275,
        metadata: {},
      },
    }),
  ])

  console.log('✅ Created', nodes.length, 'nodes')

  // Create sample edges
  const edges = await Promise.all([
    prisma.edge.upsert({
      where: { id: 'edge-1' },
      update: {},
      create: {
        id: 'edge-1',
        siaId: sia.id,
        sourceNodeId: 'node-source-1',
        targetNodeId: 'node-treatment-1',
        dataTypes: ['FINANCIAL', 'TRANSACTIONS'],
        description: 'Transmission des données financières',
        domains: ['PRIVACY', 'SECURITY'],
      },
    }),
    prisma.edge.upsert({
      where: { id: 'edge-2' },
      update: {},
      create: {
        id: 'edge-2',
        siaId: sia.id,
        sourceNodeId: 'node-source-2',
        targetNodeId: 'node-treatment-1',
        dataTypes: ['EMPLOYMENT', 'INCOME'],
        description: 'Transmission des données emploi',
        domains: ['PRIVACY'],
      },
    }),
    prisma.edge.upsert({
      where: { id: 'edge-3' },
      update: {},
      create: {
        id: 'edge-3',
        siaId: sia.id,
        sourceNodeId: 'node-treatment-1',
        targetNodeId: 'node-decision-1',
        dataTypes: ['SCORE'],
        description: 'Score de risque calculé',
        domains: ['TRANSPARENCY', 'EQUITY'],
      },
    }),
    prisma.edge.upsert({
      where: { id: 'edge-4' },
      update: {},
      create: {
        id: 'edge-4',
        siaId: sia.id,
        sourceNodeId: 'node-decision-1',
        targetNodeId: 'node-stakeholder-1',
        dataTypes: ['DECISION'],
        description: 'Communication de la décision',
        domains: ['TRANSPARENCY', 'RECOURSE'],
      },
    }),
  ])

  console.log('✅ Created', edges.length, 'edges')

  // Create sample tensions
  const tensions = await Promise.all([
    prisma.tension.upsert({
      where: { id: 'tension-1' },
      update: {},
      create: {
        id: 'tension-1',
        siaId: sia.id,
        patternId: 'efficiency-vs-transparency',
        primaryDomain: 'TRANSPARENCY',
        secondaryDomain: 'EQUITY',
        description: 'Le modèle ML utilisé pour le scoring est une boîte noire dont les critères de décision ne sont pas explicables aux clients.',
        severity: 'HIGH',
        status: 'ACTIVE',
      },
    }),
    prisma.tension.upsert({
      where: { id: 'tension-2' },
      update: {},
      create: {
        id: 'tension-2',
        siaId: sia.id,
        patternId: 'security-vs-privacy',
        primaryDomain: 'PRIVACY',
        secondaryDomain: 'SECURITY',
        description: 'Les données financières sensibles sont conservées pour une durée longue afin d\'améliorer le modèle.',
        severity: 'MEDIUM',
        status: 'ACTIVE',
      },
    }),
    prisma.tension.upsert({
      where: { id: 'tension-3' },
      update: {},
      create: {
        id: 'tension-3',
        siaId: sia.id,
        patternId: 'autonomy-vs-efficiency',
        primaryDomain: 'AUTONOMY',
        secondaryDomain: 'EQUITY',
        description: 'Les populations vulnérables peuvent être désavantagées par le scoring automatique.',
        severity: 'CRITICAL',
        status: 'OPEN',
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

  // Create sample actions
  const actions = await Promise.all([
    prisma.action.upsert({
      where: { id: 'action-1' },
      update: {},
      create: {
        id: 'action-1',
        siaId: sia.id,
        tensionId: 'tension-1',
        title: 'Implémenter SHAP pour l\'explicabilité',
        description: 'Intégrer la librairie SHAP pour fournir des explications locales sur chaque décision de scoring.',
        category: 'TRANSPARENCY',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        assignee: 'Équipe Data Science',
        dueDate: new Date('2025-02-28'),
      },
    }),
    prisma.action.upsert({
      where: { id: 'action-2' },
      update: {},
      create: {
        id: 'action-2',
        siaId: sia.id,
        tensionId: 'tension-2',
        title: 'Réduire la durée de rétention',
        description: 'Limiter la conservation des données financières à 2 ans maximum.',
        category: 'MINIMIZATION',
        priority: 'MEDIUM',
        status: 'PENDING',
        assignee: 'DPO',
        dueDate: new Date('2025-03-15'),
      },
    }),
    prisma.action.upsert({
      where: { id: 'action-3' },
      update: {},
      create: {
        id: 'action-3',
        siaId: sia.id,
        tensionId: 'tension-3',
        title: 'Créer un parcours alternatif',
        description: 'Mettre en place un processus de revue humaine systématique pour les populations vulnérables.',
        category: 'HUMAN_CONTROL',
        priority: 'CRITICAL',
        status: 'PENDING',
        assignee: 'Responsable Conformité',
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
        category: 'AUDIT',
        priority: 'HIGH',
        status: 'COMPLETED',
        assignee: 'Cabinet externe',
        dueDate: new Date('2024-12-15'),
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
      createdBy: user.id,
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
      version: 1,
      snapshot: {
        name: sia.name,
        description: sia.description,
        status: 'DRAFT',
        nodesCount: nodes.length,
        edgesCount: edges.length,
        tensionsCount: tensions.length,
        actionsCount: actions.length,
      },
      createdBy: user.id,
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

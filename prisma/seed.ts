import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

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

  console.log('✅ Created demo user:', user.email)

  // Create sample SIA
  const sia = await prisma.sia.upsert({
    where: { id: 'demo-sia-001' },
    update: {},
    create: {
      id: 'demo-sia-001',
      name: 'Systeme de scoring credit',
      description: 'Systeme algorithmique devaluation du risque credit pour les demandes de pret personnel.',
      domain: 'FINANCE',
      status: 'ACTIVE',
      decisionType: 'ASSISTED_DECISION',
      scale: 'LARGE',
      dataTypes: ['FINANCIAL', 'EMPLOYMENT', 'IDENTITY'],
      populations: ['Particuliers', 'Demandeurs de credit'],
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
          ACCOUNTABILITY: 2.5,
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
        label: 'Client demandeur',
        attributes: { role: 'Demandeur de credit', vulnerability: true },
        positionX: 100,
        positionY: 200,
      },
    }),
    prisma.node.upsert({
      where: { id: 'node-infra-1' },
      update: {},
      create: {
        id: 'node-infra-1',
        siaId: sia.id,
        type: 'INFRA',
        label: 'Base de donnees bancaires',
        attributes: { infraType: 'database', retention: '5 ans' },
        positionX: 100,
        positionY: 350,
      },
    }),
    prisma.node.upsert({
      where: { id: 'node-ai-1' },
      update: {},
      create: {
        id: 'node-ai-1',
        siaId: sia.id,
        type: 'AI',
        label: 'Modele de scoring ML',
        attributes: { modelType: 'XGBoost', opacity: 'black-box' },
        positionX: 350,
        positionY: 275,
      },
    }),
    prisma.node.upsert({
      where: { id: 'node-org-1' },
      update: {},
      create: {
        id: 'node-org-1',
        siaId: sia.id,
        type: 'ORG',
        label: 'Service credit',
        attributes: { legalStatus: 'Banque', responsibilities: ['Decision finale'] },
        positionX: 550,
        positionY: 275,
      },
    }),
    prisma.node.upsert({
      where: { id: 'node-human-2' },
      update: {},
      create: {
        id: 'node-human-2',
        siaId: sia.id,
        type: 'HUMAN',
        label: 'Conseiller bancaire',
        attributes: { role: 'Validateur', decisionPower: 'override' },
        positionX: 750,
        positionY: 275,
      },
    }),
  ])

  console.log('✅ Created', nodes.length, 'nodes')

  // Create sample edges (using correct field names)
  const edges = await Promise.all([
    prisma.edge.upsert({
      where: { id: 'edge-1' },
      update: {},
      create: {
        id: 'edge-1',
        siaId: sia.id,
        sourceId: 'node-human-1',
        targetId: 'node-infra-1',
        label: 'Fourniture des donnees',
        direction: 'H2M',
        nature: 'COLLECT',
        dataCategories: ['FINANCIAL', 'IDENTITY'],
        sensitivity: 'SENSITIVE',
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
        label: 'Alimentation du modele',
        direction: 'M2M',
        nature: 'TRANSFER',
        dataCategories: ['FINANCIAL', 'EMPLOYMENT'],
        sensitivity: 'SENSITIVE',
      },
    }),
    prisma.edge.upsert({
      where: { id: 'edge-3' },
      update: {},
      create: {
        id: 'edge-3',
        siaId: sia.id,
        sourceId: 'node-ai-1',
        targetId: 'node-org-1',
        label: 'Score de risque',
        direction: 'M2M',
        nature: 'INFERENCE',
        dataCategories: ['SCORE'],
        sensitivity: 'STANDARD',
      },
    }),
    prisma.edge.upsert({
      where: { id: 'edge-4' },
      update: {},
      create: {
        id: 'edge-4',
        siaId: sia.id,
        sourceId: 'node-org-1',
        targetId: 'node-human-2',
        label: 'Demande de validation',
        direction: 'M2H',
        nature: 'DECISION',
        dataCategories: ['DECISION'],
        sensitivity: 'STANDARD',
      },
    }),
  ])

  console.log('✅ Created', edges.length, 'edges')

  // Create sample tensions (using correct field names and enums)
  const tensions = await Promise.all([
    prisma.tension.upsert({
      where: { id: 'tension-1' },
      update: {},
      create: {
        id: 'tension-1',
        siaId: sia.id,
        pattern: 'EFFICIENCY_VS_TRANSPARENCY',
        impactedDomains: ['TRANSPARENCY', 'EQUITY'],
        description: 'Le modele ML utilise pour le scoring est une boite noire dont les criteres de decision ne sont pas explicables aux clients.',
        severity: 4,
        status: 'QUALIFIED',
      },
    }),
    prisma.tension.upsert({
      where: { id: 'tension-2' },
      update: {},
      create: {
        id: 'tension-2',
        siaId: sia.id,
        pattern: 'SECURITY_VS_PRIVACY',
        impactedDomains: ['PRIVACY', 'SECURITY'],
        description: 'Les donnees financieres sensibles sont conservees pour une duree longue afin dameliorer le modele.',
        severity: 3,
        status: 'DETECTED',
      },
    }),
    prisma.tension.upsert({
      where: { id: 'tension-3' },
      update: {},
      create: {
        id: 'tension-3',
        siaId: sia.id,
        pattern: 'PERFORMANCE_VS_EQUITY',
        impactedDomains: ['AUTONOMY', 'EQUITY'],
        description: 'Les populations vulnerables peuvent etre desavantagees par le scoring automatique.',
        severity: 5,
        status: 'IN_PROGRESS',
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

  // Create sample actions (using correct status enum)
  const actions = await Promise.all([
    prisma.action.upsert({
      where: { id: 'action-1' },
      update: {},
      create: {
        id: 'action-1',
        siaId: sia.id,
        tensionId: 'tension-1',
        title: 'Implementer SHAP pour lexplicabilite',
        description: 'Integrer la librairie SHAP pour fournir des explications locales sur chaque decision de scoring.',
        category: 'TRANSPARENCY',
        priority: 'HIGH',
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
        tensionId: 'tension-2',
        title: 'Reduire la duree de retention',
        description: 'Limiter la conservation des donnees financieres a 2 ans maximum.',
        category: 'MINIMIZATION',
        priority: 'MEDIUM',
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
        tensionId: 'tension-3',
        title: 'Creer un parcours alternatif',
        description: 'Mettre en place un processus de revue humaine systematique pour les populations vulnerables.',
        category: 'HUMAN_CONTROL',
        priority: 'CRITICAL',
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
        title: 'Audit du modele de scoring',
        description: 'Realiser un audit externe du modele pour verifier labsence de biais discriminatoires.',
        category: 'AUDIT',
        priority: 'HIGH',
        status: 'DONE',
        dueDate: new Date('2024-12-15'),
      },
    }),
  ])

  console.log('✅ Created', actions.length, 'actions')

  // Create sample arbitration
  await prisma.arbitration.upsert({
    where: { tensionId: 'tension-1' },
    update: {},
    create: {
      tensionId: 'tension-1',
      decision: 'Prioriser la transparence via SHAP tout en maintenant les performances',
      justification: 'La tension est reconnue comme critique pour la conformite RGPD. Limplementation de SHAP permettra de fournir des explications satisfaisantes aux clients tout en conservant les performances du modele.',
    },
  })

  console.log('✅ Created sample arbitration')

  // Create initial version
  await prisma.version.upsert({
    where: { siaId_number: { siaId: sia.id, number: 1 } },
    update: {},
    create: {
      siaId: sia.id,
      number: 1,
      label: 'v1.0',
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
  console.log('📧 Test account:')
  console.log('   Email: admin@test.com')
  console.log('   Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

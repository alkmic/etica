// lib/rules/coverage-checker.ts
// Vérifie la couverture des dilemmes détectés par rapport aux référentiels éthiques
// Supporte : EU Trustworthy AI Guidelines, NIST AI RMF, UNESCO AI Ethics

import { DetectedDilemma, CoverageReport, LensCoverage, EthicalLens, LensRequirement } from './types';
import { EthicalDomain } from '@/lib/constants/ethical-domains';

// ============================================
// DÉFINITION DES LENTILLES ÉTHIQUES
// ============================================

/**
 * EU Trustworthy AI Guidelines - 7 Key Requirements
 * https://digital-strategy.ec.europa.eu/en/library/ethics-guidelines-trustworthy-ai
 */
const EU_TRUSTWORTHY_AI: EthicalLens = {
  id: 'EU_TRUSTWORTHY_AI',
  name: 'EU Trustworthy AI Guidelines',
  nameFr: 'Lignes directrices pour une IA digne de confiance (UE)',
  source: 'European Commission High-Level Expert Group on AI',
  version: '2019',
  requirements: [
    {
      id: 'EU-1',
      name: 'Human agency and oversight',
      nameFr: 'Agence humaine et supervision',
      description: 'AI systems should support human autonomy and decision-making, with appropriate oversight mechanisms',
      mappedDomains: ['AUTONOMY', 'MASTERY', 'RECOURSE'],
      checklist: [
        'Les utilisateurs peuvent-ils comprendre les décisions du système ?',
        'Existe-t-il un mécanisme de supervision humaine ?',
        'Les personnes affectées peuvent-elles contester les décisions ?',
        'Le système respecte-t-il l\'autonomie des utilisateurs ?',
      ],
    },
    {
      id: 'EU-2',
      name: 'Technical robustness and safety',
      nameFr: 'Robustesse technique et sécurité',
      description: 'AI systems should be resilient, secure, and safe throughout their lifecycle',
      mappedDomains: ['SECURITY', 'MASTERY'],
      checklist: [
        'Le système est-il résilient aux attaques ?',
        'Existe-t-il un plan de reprise en cas de défaillance ?',
        'Les performances sont-elles monitorées ?',
        'Le système a-t-il été testé de manière approfondie ?',
      ],
    },
    {
      id: 'EU-3',
      name: 'Privacy and data governance',
      nameFr: 'Vie privée et gouvernance des données',
      description: 'Ensuring privacy and data protection throughout the system lifecycle',
      mappedDomains: ['PRIVACY', 'SOVEREIGNTY'],
      checklist: [
        'La collecte de données est-elle minimisée ?',
        'Le consentement est-il recueilli correctement ?',
        'Les données sont-elles sécurisées ?',
        'Le système respecte-t-il le RGPD ?',
      ],
    },
    {
      id: 'EU-4',
      name: 'Transparency',
      nameFr: 'Transparence',
      description: 'The data, system and business models should be transparent',
      mappedDomains: ['TRANSPARENCY'],
      checklist: [
        'Le fonctionnement du système est-il explicable ?',
        'Les utilisateurs sont-ils informés qu\'ils interagissent avec une IA ?',
        'Les données utilisées sont-elles documentées ?',
        'Les décisions peuvent-elles être tracées ?',
      ],
    },
    {
      id: 'EU-5',
      name: 'Diversity, non-discrimination and fairness',
      nameFr: 'Diversité, non-discrimination et équité',
      description: 'AI systems should avoid unfair bias and ensure fairness',
      mappedDomains: ['EQUITY', 'SOCIETAL_BALANCE'],
      checklist: [
        'Des audits de biais ont-ils été réalisés ?',
        'Le système traite-t-il équitablement tous les groupes ?',
        'Les données d\'entraînement sont-elles représentatives ?',
        'Des mesures correctives sont-elles en place ?',
      ],
    },
    {
      id: 'EU-6',
      name: 'Societal and environmental wellbeing',
      nameFr: 'Bien-être sociétal et environnemental',
      description: 'AI systems should benefit all, including future generations',
      mappedDomains: ['SUSTAINABILITY', 'SOCIETAL_BALANCE', 'LOYALTY'],
      checklist: [
        'L\'impact environnemental est-il mesuré ?',
        'Le système contribue-t-il au bien commun ?',
        'Les externalités négatives sont-elles minimisées ?',
        'L\'impact social a-t-il été évalué ?',
      ],
    },
    {
      id: 'EU-7',
      name: 'Accountability',
      nameFr: 'Responsabilité',
      description: 'Mechanisms should be in place to ensure accountability',
      mappedDomains: ['RESPONSIBILITY', 'RECOURSE'],
      checklist: [
        'Un responsable est-il clairement identifié ?',
        'Des audits sont-ils réalisés régulièrement ?',
        'Les incidents sont-ils documentés et analysés ?',
        'Existe-t-il un mécanisme de recours ?',
      ],
    },
  ],
};

/**
 * NIST AI Risk Management Framework
 * https://www.nist.gov/itl/ai-risk-management-framework
 */
const NIST_AI_RMF: EthicalLens = {
  id: 'NIST_AI_RMF',
  name: 'NIST AI Risk Management Framework',
  nameFr: 'Cadre de gestion des risques IA du NIST',
  source: 'National Institute of Standards and Technology',
  version: '1.0 (2023)',
  requirements: [
    {
      id: 'NIST-GOVERN',
      name: 'Govern',
      nameFr: 'Gouverner',
      description: 'Cultivate a culture of risk management within organizations',
      mappedDomains: ['RESPONSIBILITY', 'MASTERY'],
      checklist: [
        'Une politique de gouvernance IA existe-t-elle ?',
        'Les rôles et responsabilités sont-ils définis ?',
        'Le cadre de gestion des risques est-il documenté ?',
        'La formation des équipes est-elle assurée ?',
      ],
    },
    {
      id: 'NIST-MAP',
      name: 'Map',
      nameFr: 'Cartographier',
      description: 'Establish context to understand AI system risks',
      mappedDomains: ['TRANSPARENCY', 'MASTERY'],
      checklist: [
        'Les parties prenantes sont-elles identifiées ?',
        'Le périmètre du système est-il documenté ?',
        'Les données et modèles sont-ils inventoriés ?',
        'Les risques potentiels sont-ils cartographiés ?',
      ],
    },
    {
      id: 'NIST-MEASURE',
      name: 'Measure',
      nameFr: 'Mesurer',
      description: 'Employ quantitative and qualitative methods to analyze, assess, and track AI risks',
      mappedDomains: ['TRANSPARENCY', 'EQUITY', 'SECURITY'],
      checklist: [
        'Des métriques de performance sont-elles définies ?',
        'Les biais sont-ils mesurés quantitativement ?',
        'Les dérives du modèle sont-elles monitorées ?',
        'Les incidents sont-ils comptabilisés ?',
      ],
    },
    {
      id: 'NIST-MANAGE',
      name: 'Manage',
      nameFr: 'Gérer',
      description: 'Allocate risk resources and implement plans to respond to, recover from, and communicate about risks',
      mappedDomains: ['SECURITY', 'RESPONSIBILITY', 'RECOURSE'],
      checklist: [
        'Un plan de réponse aux risques existe-t-il ?',
        'Les ressources sont-elles allouées ?',
        'Un plan de communication est-il prévu ?',
        'Des revues périodiques sont-elles planifiées ?',
      ],
    },
  ],
};

/**
 * UNESCO Recommendation on the Ethics of AI
 * https://www.unesco.org/en/artificial-intelligence/recommendation-ethics
 */
const UNESCO_AI_ETHICS: EthicalLens = {
  id: 'UNESCO_AI_ETHICS',
  name: 'UNESCO Recommendation on AI Ethics',
  nameFr: 'Recommandation de l\'UNESCO sur l\'éthique de l\'IA',
  source: 'UNESCO',
  version: '2021',
  requirements: [
    {
      id: 'UNESCO-1',
      name: 'Proportionality and Do No Harm',
      nameFr: 'Proportionnalité et ne pas nuire',
      description: 'AI system methods should be appropriate and proportional to achieve legitimate aims',
      mappedDomains: ['SECURITY', 'EQUITY', 'AUTONOMY'],
      checklist: [
        'L\'utilisation de l\'IA est-elle proportionnée au but ?',
        'Les risques de préjudice sont-ils évalués ?',
        'Des alternatives moins intrusives ont-elles été considérées ?',
        'Les impacts négatifs sont-ils minimisés ?',
      ],
    },
    {
      id: 'UNESCO-2',
      name: 'Safety and Security',
      nameFr: 'Sûreté et sécurité',
      description: 'Unwanted harms should be avoided and addressed throughout the AI lifecycle',
      mappedDomains: ['SECURITY', 'MASTERY'],
      checklist: [
        'Les vulnérabilités sont-elles identifiées ?',
        'Des mesures de sécurité sont-elles en place ?',
        'Le système est-il résilient ?',
        'Un plan de continuité existe-t-il ?',
      ],
    },
    {
      id: 'UNESCO-3',
      name: 'Right to Privacy',
      nameFr: 'Droit à la vie privée',
      description: 'Privacy must be protected and promoted throughout the AI lifecycle',
      mappedDomains: ['PRIVACY'],
      checklist: [
        'La vie privée est-elle protégée by design ?',
        'La collecte de données est-elle minimisée ?',
        'Le consentement est-il éclairé ?',
        'Les données sont-elles anonymisées si possible ?',
      ],
    },
    {
      id: 'UNESCO-4',
      name: 'Human Oversight and Determination',
      nameFr: 'Supervision et détermination humaines',
      description: 'Humans can choose to delegate tasks to AI systems while retaining the ability to override',
      mappedDomains: ['AUTONOMY', 'MASTERY', 'RECOURSE'],
      checklist: [
        'Un humain peut-il surcharger les décisions ?',
        'La supervision est-elle effective ?',
        'Le contrôle humain est-il maintenu ?',
        'Le système peut-il être désactivé ?',
      ],
    },
    {
      id: 'UNESCO-5',
      name: 'Transparency and Explainability',
      nameFr: 'Transparence et explicabilité',
      description: 'AI systems should be transparent and explainable to the degree possible',
      mappedDomains: ['TRANSPARENCY'],
      checklist: [
        'Le système est-il explicable ?',
        'Les décisions sont-elles traçables ?',
        'L\'information est-elle accessible ?',
        'Les limitations sont-elles communiquées ?',
      ],
    },
    {
      id: 'UNESCO-6',
      name: 'Responsibility and Accountability',
      nameFr: 'Responsabilité et redevabilité',
      description: 'AI actors should be accountable for the proper functioning of AI systems',
      mappedDomains: ['RESPONSIBILITY', 'RECOURSE'],
      checklist: [
        'Les responsabilités sont-elles claires ?',
        'Un mécanisme de recours existe-t-il ?',
        'Les décisions sont-elles auditables ?',
        'Les incidents sont-ils gérés ?',
      ],
    },
    {
      id: 'UNESCO-7',
      name: 'Inclusiveness and Diversity',
      nameFr: 'Inclusion et diversité',
      description: 'AI systems should promote diversity and not create or exacerbate divides',
      mappedDomains: ['EQUITY', 'SOCIETAL_BALANCE'],
      checklist: [
        'Le système est-il accessible à tous ?',
        'Les biais sont-ils détectés et corrigés ?',
        'La diversité est-elle prise en compte ?',
        'Les inégalités sont-elles réduites ?',
      ],
    },
    {
      id: 'UNESCO-8',
      name: 'Environmental and Societal Wellbeing',
      nameFr: 'Bien-être environnemental et sociétal',
      description: 'AI actors should minimize environmental impact and promote sustainable development',
      mappedDomains: ['SUSTAINABILITY', 'SOCIETAL_BALANCE', 'LOYALTY'],
      checklist: [
        'L\'empreinte environnementale est-elle mesurée ?',
        'Le développement durable est-il promu ?',
        'L\'impact social est-il positif ?',
        'Les générations futures sont-elles considérées ?',
      ],
    },
    {
      id: 'UNESCO-9',
      name: 'Data Governance',
      nameFr: 'Gouvernance des données',
      description: 'Data collection and use should follow ethical principles',
      mappedDomains: ['PRIVACY', 'SOVEREIGNTY', 'TRANSPARENCY'],
      checklist: [
        'La qualité des données est-elle assurée ?',
        'La provenance des données est-elle documentée ?',
        'Le cycle de vie des données est-il géré ?',
        'Les droits sur les données sont-ils respectés ?',
      ],
    },
  ],
};

// ============================================
// TOUTES LES LENTILLES DISPONIBLES
// ============================================

export const ETHICAL_LENSES: Record<string, EthicalLens> = {
  EU_TRUSTWORTHY_AI,
  NIST_AI_RMF,
  UNESCO_AI_ETHICS,
};

export function getAvailableLenses(): EthicalLens[] {
  return Object.values(ETHICAL_LENSES);
}

export function getLensById(id: string): EthicalLens | undefined {
  return ETHICAL_LENSES[id];
}

// ============================================
// CALCUL DE COUVERTURE
// ============================================

function calculateRequirementCoverage(
  requirement: LensRequirement,
  dilemmas: DetectedDilemma[]
): {
  score: number;
  coveredBy: string[];
  gaps: string[];
} {
  const mappedDomains = requirement.mappedDomains as EthicalDomain[];
  const coveredBy: string[] = [];

  // Find dilemmas that cover this requirement's domains
  for (const dilemma of dilemmas) {
    if (
      mappedDomains.includes(dilemma.domainA) ||
      mappedDomains.includes(dilemma.domainB)
    ) {
      coveredBy.push(dilemma.ruleId);
    }
  }

  // Calculate coverage score based on how many domains are covered
  const coveredDomains = new Set<EthicalDomain>();
  for (const dilemma of dilemmas) {
    if (mappedDomains.includes(dilemma.domainA)) {
      coveredDomains.add(dilemma.domainA);
    }
    if (mappedDomains.includes(dilemma.domainB)) {
      coveredDomains.add(dilemma.domainB);
    }
  }

  const score = mappedDomains.length > 0
    ? coveredDomains.size / mappedDomains.length
    : 0;

  // Identify gaps
  const gaps: string[] = [];
  for (const domain of mappedDomains) {
    if (!coveredDomains.has(domain)) {
      gaps.push(`Domaine ${domain} non couvert pour l'exigence "${requirement.nameFr}"`);
    }
  }

  // Add checklist items as potential gaps if coverage is low
  if (score < 0.5) {
    gaps.push(...requirement.checklist.map((item: string) => `À vérifier : ${item}`));
  }

  return { score, coveredBy: Array.from(new Set(coveredBy)), gaps };
}

function calculateLensCoverage(
  lens: EthicalLens,
  dilemmas: DetectedDilemma[]
): LensCoverage {
  let totalScore = 0;
  const allGaps: string[] = [];
  const requirementScores: Record<string, number> = {};

  for (const requirement of lens.requirements) {
    const { score, gaps } = calculateRequirementCoverage(requirement, dilemmas);
    totalScore += score;
    requirementScores[requirement.id] = score;
    allGaps.push(...gaps);
  }

  const overallScore = lens.requirements.length > 0
    ? totalScore / lens.requirements.length
    : 0;

  return {
    lensId: lens.id,
    lensName: lens.nameFr,
    score: Math.round(overallScore * 100) / 100,
    requirementScores,
    gaps: allGaps.slice(0, 10), // Limit to top 10 gaps
  };
}

// ============================================
// API PRINCIPALE
// ============================================

export interface CoverageCheckOptions {
  lenses?: string[];
}

/**
 * Vérifie la couverture des dilemmes détectés par rapport aux référentiels éthiques
 */
export function checkCoverage(
  dilemmas: DetectedDilemma[],
  options: CoverageCheckOptions = {}
): CoverageReport {
  const { lenses: lensIds } = options;

  // Get lenses to check
  const lensesToCheck = lensIds
    ? lensIds.map(id => ETHICAL_LENSES[id]).filter(Boolean)
    : Object.values(ETHICAL_LENSES);

  // Calculate coverage for each lens
  const lensCoverages: LensCoverage[] = lensesToCheck.map(lens =>
    calculateLensCoverage(lens, dilemmas)
  );

  // Calculate overall score
  const overallScore = lensCoverages.length > 0
    ? lensCoverages.reduce((sum, lc) => sum + lc.score, 0) / lensCoverages.length
    : 0;

  // Aggregate gaps
  const allGaps = new Set<string>();
  for (const coverage of lensCoverages) {
    coverage.gaps.forEach(gap => allGaps.add(gap));
  }

  return {
    lenses: lensCoverages,
    overallScore: Math.round(overallScore * 100) / 100,
    gaps: Array.from(allGaps).slice(0, 20), // Top 20 gaps overall
  };
}

/**
 * Génère des recommandations pour améliorer la couverture
 */
export function getCoverageRecommendations(report: CoverageReport): string[] {
  const recommendations: string[] = [];

  for (const lens of report.lenses) {
    if (lens.score < 0.5) {
      recommendations.push(
        `Couverture faible (${Math.round(lens.score * 100)}%) du référentiel "${lens.lensName}". ` +
        `Considérez d'analyser les exigences non couvertes.`
      );
    }

    // Find lowest scoring requirements
    const lowScoreReqs = Object.entries(lens.requirementScores)
      .filter(([, score]) => score < 0.3)
      .map(([reqId]) => reqId);

    if (lowScoreReqs.length > 0) {
      const lensObj = getLensById(lens.lensId);
      if (lensObj) {
        const reqNames = lowScoreReqs
          .map(id => lensObj.requirements.find(r => r.id === id)?.nameFr)
          .filter(Boolean);

        if (reqNames.length > 0) {
          recommendations.push(
            `Exigences peu couvertes dans "${lens.lensName}" : ${reqNames.join(', ')}`
          );
        }
      }
    }
  }

  // Add general recommendations based on overall score
  if (report.overallScore < 0.3) {
    recommendations.push(
      'La couverture globale est faible. Envisagez d\'ajouter des dilemmes manuellement ' +
      'pour couvrir les domaines éthiques non représentés.'
    );
  } else if (report.overallScore < 0.6) {
    recommendations.push(
      'La couverture est modérée. Vérifiez que les principaux risques éthiques sont identifiés.'
    );
  } else if (report.overallScore >= 0.8) {
    recommendations.push(
      'Bonne couverture des référentiels éthiques. Assurez-vous que les arbitrages sont documentés.'
    );
  }

  return recommendations;
}

/**
 * Génère un rapport de couverture formaté
 */
export function formatCoverageReport(report: CoverageReport): string {
  let output = '# Rapport de couverture éthique\n\n';
  output += `Score global : ${Math.round(report.overallScore * 100)}%\n\n`;

  output += '## Couverture par référentiel\n\n';
  for (const lens of report.lenses) {
    output += `### ${lens.lensName}\n`;
    output += `Score : ${Math.round(lens.score * 100)}%\n\n`;

    if (Object.keys(lens.requirementScores).length > 0) {
      output += '| Exigence | Score |\n';
      output += '|----------|-------|\n';
      for (const [reqId, score] of Object.entries(lens.requirementScores)) {
        const lensObj = getLensById(lens.lensId);
        const reqName = lensObj?.requirements.find(r => r.id === reqId)?.nameFr || reqId;
        const emoji = score >= 0.7 ? '✅' : score >= 0.3 ? '⚠️' : '❌';
        output += `| ${reqName} | ${emoji} ${Math.round(score * 100)}% |\n`;
      }
      output += '\n';
    }
  }

  if (report.gaps.length > 0) {
    output += '## Lacunes identifiées\n\n';
    for (const gap of report.gaps) {
      output += `- ${gap}\n`;
    }
    output += '\n';
  }

  const recommendations = getCoverageRecommendations(report);
  if (recommendations.length > 0) {
    output += '## Recommandations\n\n';
    for (const rec of recommendations) {
      output += `- ${rec}\n`;
    }
  }

  return output;
}

// ============================================
// MAPPING INVERSE : TROUVER LES RÈGLES PERTINENTES
// ============================================

/**
 * Trouve les règles les plus pertinentes pour une exigence donnée
 */
export function findRelevantRulesForRequirement(
  requirement: LensRequirement,
  allRules: Array<{ id: string; produces: { domainA: EthicalDomain; domainB: EthicalDomain } }>
): string[] {
  const mappedDomains = requirement.mappedDomains as EthicalDomain[];

  return allRules
    .filter(rule =>
      mappedDomains.includes(rule.produces.domainA) ||
      mappedDomains.includes(rule.produces.domainB)
    )
    .map(rule => rule.id);
}

/**
 * Suggère des vérifications manuelles pour améliorer la couverture
 */
export function suggestManualChecks(
  report: CoverageReport
): Array<{ lens: string; requirement: string; checks: string[] }> {
  const suggestions: Array<{ lens: string; requirement: string; checks: string[] }> = [];

  for (const lensCoverage of report.lenses) {
    const lens = getLensById(lensCoverage.lensId);
    if (!lens) continue;

    for (const [reqId, score] of Object.entries(lensCoverage.requirementScores)) {
      if (score < 0.5) {
        const requirement = lens.requirements.find(r => r.id === reqId);
        if (requirement) {
          suggestions.push({
            lens: lens.nameFr,
            requirement: requirement.nameFr,
            checks: requirement.checklist,
          });
        }
      }
    }
  }

  return suggestions;
}

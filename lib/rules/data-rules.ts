// lib/rules/data-rules.ts
// Famille D : Règles de données (analyse des flux)

import { DetectionRule } from './types';

export const DATA_RULES: DetectionRule[] = [
  {
    id: 'D-01',
    name: 'Sensitive data with automatic decision',
    nameFr: 'Données sensibles avec décision automatique',
    family: 'DATA',
    conditions: {
      edgeConditions: [
        { dataCategories: { includes: ['HEALTH', 'BIOMETRIC', 'JUDICIAL', 'OPINION'] } },
        { nature: ['DECISION', 'INFERENCE'] },
        { automation: ['AUTO_WITH_RECOURSE', 'AUTO_NO_RECOURSE'] },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Des données sensibles ({dataCategories}) alimentent une décision automatique.',
      mechanismTemplate: 'Le flux {edgeLabel} transporte des données {dataCategories} vers une décision {automation}.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'edge.sensitivity === "HIGHLY_SENSITIVE"', label: 'Données hautement sensibles', severityModifier: +1 },
      { condition: 'edge.automation === "AUTO_NO_RECOURSE"', label: 'Sans recours', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasHumanValidation === true', label: 'Validation humaine systématique', severityModifier: -1 },
      { condition: 'dataIsAnonymized === true', label: 'Données anonymisées', severityModifier: -2 },
    ],
    acceptablePatterns: [
      'Anonymisation ou pseudonymisation avant traitement',
      'Validation humaine obligatoire',
      'Limitation stricte des finalités',
    ],
    requiredEvidences: [
      'AIPD (Analyse d\'Impact) réalisée',
      'Registre des traitements à jour',
      'Consentement explicite documenté',
    ],
    questionsToConsider: [
      'Le consentement explicite a-t-il été recueilli pour ce traitement ?',
      'Peut-on atteindre le même objectif avec des données moins sensibles ?',
    ],
    stakeholdersToConsult: ['DPO', 'CNIL (si applicable)', 'Personnes concernées'],
  },

  {
    id: 'D-02',
    name: 'Inferred data',
    nameFr: 'Données inférées non fournies par la personne',
    family: 'DATA',
    conditions: {
      edgeConditions: [
        { dataCategories: { includes: ['INFERRED'] } },
      ],
      nodeConditions: [
        { type: 'AI' },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Le système déduit des attributs ({inferredTypes}) non fournis par la personne.',
      mechanismTemplate: '{nodeName} infère des données de type {inferredTypes} à partir de {sourceData}.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'infersSensitiveAttributes === true', label: 'Infère des attributs sensibles', severityModifier: +1 },
      { condition: 'personNotInformed === true', label: 'Personne non informée', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'personCanCorrect === true', label: 'Possibilité de correction', severityModifier: -1 },
      { condition: 'isTransparent === true', label: 'Inférence transparente', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Information claire sur les inférences réalisées',
      'Droit de rectification des données inférées',
      'Opt-out possible pour l\'inférence',
    ],
    requiredEvidences: [
      'Documentation des types d\'inférences',
      'Procédure de rectification accessible',
    ],
    questionsToConsider: [
      'La personne sait-elle que des données sont déduites à son sujet ?',
      'Peut-elle consulter et corriger ces données inférées ?',
    ],
    stakeholdersToConsult: ['DPO', 'Product manager'],
  },

  {
    id: 'D-03',
    name: 'Behavioral profiling',
    nameFr: 'Profilage comportemental',
    family: 'DATA',
    conditions: {
      edgeConditions: [
        { dataCategories: { includes: ['BEHAVIORAL'] } },
        { intent: ['EVALUATION', 'SURVEILLANCE'] },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'AUTONOMY',
      formulationTemplate: 'Le système analyse des patterns de comportement pour personnaliser ou évaluer.',
      mechanismTemplate: 'Les données comportementales ({dataDetails}) sont utilisées pour {intent}.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'edge.frequency === "REALTIME"', label: 'Analyse en temps réel', severityModifier: +1 },
      { condition: 'usedForPricing === true', label: 'Utilisé pour la tarification', severityModifier: +1 },
      { condition: 'usedForManipulation === true', label: 'Risque de manipulation', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'userCanOptOut === true', label: 'Opt-out possible', severityModifier: -1 },
      { condition: 'profilingIsTransparent === true', label: 'Profilage transparent', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Opt-out clair et accessible',
      'Transparence sur les critères de profilage',
      'Limitation des finalités du profilage',
    ],
    requiredEvidences: [
      'Documentation du profilage',
      'Mécanisme d\'opt-out fonctionnel',
      'Statistiques d\'opt-out',
    ],
    questionsToConsider: [
      'Les utilisateurs peuvent-ils désactiver la personnalisation ?',
      'Le profilage peut-il créer des "bulles de filtre" ?',
      'Y a-t-il un risque de manipulation ?',
    ],
    stakeholdersToConsult: ['Product manager', 'DPO', 'Éthicien'],
  },

  {
    id: 'D-04',
    name: 'Long retention without justification',
    nameFr: 'Conservation longue durée sans justification',
    family: 'DATA',
    conditions: {
      nodeConditions: [
        { type: 'INFRA', attribute: 'retentionPolicy', value: ['long', 'indefinite'] },
      ],
      edgeConditions: [
        { dataCategories: { includes: ['IDENTIFIER', 'FINANCIAL', 'HEALTH', 'BEHAVIORAL'] } },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Des données personnelles sont conservées {retentionPolicy} sans justification documentée.',
      mechanismTemplate: '{nodeName} conserve des données {dataCategories} avec une politique {retentionPolicy}.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'node.retentionPolicy === "indefinite"', label: 'Conservation indéfinie', severityModifier: +1 },
      { condition: 'noLegalBasis === true', label: 'Pas de base légale claire', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasLegalObligation === true', label: 'Obligation légale de conservation', severityModifier: -2 },
      { condition: 'hasAnonymizationPlan === true', label: 'Plan d\'anonymisation', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Justification documentée de la durée',
      'Anonymisation après la période nécessaire',
      'Purge automatique programmée',
    ],
    requiredEvidences: [
      'Politique de rétention documentée',
      'Justification légale ou business',
      'Procédure de purge',
    ],
    questionsToConsider: [
      'Pourquoi ces données doivent-elles être conservées si longtemps ?',
      'Les personnes peuvent-elles demander l\'effacement ?',
    ],
    stakeholdersToConsult: ['DPO', 'Juridique', 'Archiviste'],
  },

  {
    id: 'D-05',
    name: 'Data fusion without traceability',
    nameFr: 'Fusion de données sans traçabilité',
    family: 'DATA',
    conditions: {
      graphConditions: [
        { multipleSourcesTo: { type: 'AI' } },
      ],
      nodeConditions: [
        { type: 'INFRA', attribute: 'infraType', value: ['database', 'data_lake'] },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Plusieurs sources de données ({sourceCount}) sont fusionnées sans traçabilité claire.',
      mechanismTemplate: '{targetNode} agrège des données de {sourceNodes} sans lignage documenté.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'sourceCount > 5', label: 'Plus de 5 sources fusionnées', severityModifier: +1 },
      { condition: 'containsSensitive === true', label: 'Contient des données sensibles', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasDataLineage === true', label: 'Lignage des données documenté', severityModifier: -1 },
      { condition: 'hasDataCatalog === true', label: 'Catalogue de données à jour', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Data lineage documenté pour chaque fusion',
      'Catalogue de données centralisé',
      'Traçabilité de l\'origine dans les décisions',
    ],
    requiredEvidences: [
      'Documentation du data lineage',
      'Catalogue de données',
      'Procédure d\'audit',
    ],
    questionsToConsider: [
      'Peut-on retracer l\'origine de chaque donnée utilisée dans une décision ?',
      'Les personnes savent-elles quelles sources sont utilisées ?',
    ],
    stakeholdersToConsult: ['Data engineer', 'DPO', 'Data steward'],
  },

  {
    id: 'D-06',
    name: 'Exhaustive traceability vs minimization',
    nameFr: 'Traçabilité exhaustive vs minimisation',
    family: 'DATA',
    conditions: {
      nodeConditions: [
        { type: 'INFRA', attribute: 'infraType', value: 'database' },
        { attribute: 'hasEncryption', value: false },
      ],
      edgeConditions: [
        { nature: ['LEARNING', 'STORAGE'] },
        { dataCategories: { includes: ['IDENTIFIER', 'BEHAVIORAL'] } },
      ],
    },
    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Le besoin d\'audit et de traçabilité entre en tension avec la minimisation des données.',
      mechanismTemplate: 'Les données {dataCategories} sont conservées pour audit dans {nodeName} mais cela augmente la surface d\'exposition.',
    },
    severityBase: 2,
    aggravatingFactors: [
      { condition: 'retentionIsLong === true', label: 'Conservation longue', severityModifier: +1 },
      { condition: 'accessIsWide === true', label: 'Accès large aux logs', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'logsAreEncrypted === true', label: 'Logs chiffrés', severityModifier: -1 },
      { condition: 'accessIsRestricted === true', label: 'Accès restreint', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Pseudonymisation des logs',
      'Chiffrement des données d\'audit',
      'Accès restreint et audité',
    ],
    requiredEvidences: [
      'Politique de chiffrement des logs',
      'Matrice des droits d\'accès',
    ],
    questionsToConsider: [
      'Les logs contiennent-ils des données personnelles ?',
      'Qui a accès aux données d\'audit ?',
    ],
    stakeholdersToConsult: ['RSSI', 'DPO', 'Auditeur'],
  },

  {
    id: 'D-07',
    name: 'Cross-border data transfer',
    nameFr: 'Transfert de données transfrontalier',
    family: 'DATA',
    conditions: {
      edgeConditions: [
        { nature: 'TRANSFER' },
        { dataCategories: { includes: ['IDENTIFIER', 'HEALTH', 'FINANCIAL', 'BIOMETRIC'] } },
      ],
      nodeConditions: [
        { type: 'ORG' },
      ],
    },
    produces: {
      domainA: 'PRIVACY',
      domainB: 'SOVEREIGNTY',
      formulationTemplate: 'Des données personnelles sont transférées à une organisation tierce.',
      mechanismTemplate: 'Le flux {edgeLabel} transfère des données {dataCategories} vers {targetNode}.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'targetIsOutsideEU === true', label: 'Destinataire hors UE', severityModifier: +1 },
      { condition: 'noContractualProtection === true', label: 'Pas de protection contractuelle', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasSCC === true', label: 'Clauses contractuelles types', severityModifier: -1 },
      { condition: 'hasAdequacyDecision === true', label: 'Décision d\'adéquation', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Clauses contractuelles types signées',
      'Chiffrement de bout en bout',
      'Minimisation des données transférées',
    ],
    requiredEvidences: [
      'Contrat de sous-traitance',
      'Analyse d\'impact transfert',
    ],
    questionsToConsider: [
      'Le destinataire offre-t-il des garanties équivalentes au RGPD ?',
      'Les données peuvent-elles être minimisées avant transfert ?',
    ],
    stakeholdersToConsult: ['DPO', 'Juridique', 'Compliance'],
  },
];

# ETICA - Outil d'Analyse Éthique des Systèmes d'IA

ETICA est une application web permettant d'analyser et de documenter les implications éthiques des systèmes d'intelligence artificielle.

## Fonctionnalités

### 8 Domaines de Vigilance
- **Vie privée** - Protection des données personnelles
- **Équité** - Non-discrimination et traitement équitable
- **Transparence** - Explicabilité des décisions
- **Autonomie** - Respect du libre arbitre
- **Sécurité** - Protection contre les usages malveillants
- **Recours** - Possibilité de contestation
- **Durabilité** - Impact environnemental
- **Responsabilité** - Traçabilité des décisions

### Fonctionnalités Principales
- 📊 **Tableau de bord** avec visualisation radar des scores de vigilance
- 🗺️ **Cartographie interactive** des flux de données avec React Flow
- ⚠️ **Détection automatique** des tensions éthiques (18 patterns)
- ⚖️ **Workflow d'arbitrage** pour documenter les décisions
- ✅ **Plan d'action** pour suivre les mesures de mitigation
- 📁 **Export** PDF, JSON et CSV
- 🕐 **Versioning** des analyses

## Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm ou pnpm

## Installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/votre-repo/etica.git
cd etica
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
```

Éditer `.env` avec vos valeurs :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/etica"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-genere"
```

4. **Initialiser la base de données**
```bash
npm run db:push
npm run db:seed
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application est accessible sur http://localhost:3000

## Compte de démonstration

Après le seed de la base de données :
- **Email** : demo@etica.fr
- **Mot de passe** : demo123

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Vérification ESLint |
| `npm run db:generate` | Générer le client Prisma |
| `npm run db:push` | Appliquer le schéma à la DB |
| `npm run db:migrate` | Créer une migration |
| `npm run db:studio` | Interface Prisma Studio |
| `npm run db:seed` | Peupler la base avec des données de démo |

## Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : NextAuth.js v5
- **UI** : Tailwind CSS + shadcn/ui (Radix UI)
- **Graphiques** : Recharts (radar chart)
- **Canvas** : React Flow
- **État** : Zustand
- **Validation** : Zod + React Hook Form

## Structure du projet

```
etica/
├── app/                    # Routes Next.js App Router
│   ├── (auth)/            # Pages d'authentification
│   ├── (dashboard)/       # Pages du dashboard
│   └── api/               # Routes API
├── components/            # Composants React
│   ├── canvas/           # Composants React Flow
│   ├── layout/           # Layout (sidebar, header)
│   └── ui/               # Composants UI (shadcn)
├── lib/                   # Utilitaires
│   ├── constants/        # Domaines, patterns, templates
│   ├── rules/            # Règles de détection des tensions
│   ├── scoring/          # Calcul des scores de vigilance
│   └── stores/           # Stores Zustand
├── prisma/               # Schéma et migrations
└── types/                # Types TypeScript
```

## Licence

MIT

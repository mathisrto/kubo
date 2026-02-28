<div align="center">
  <img src="./public/icon.svg" alt="Kubo Logo" width="200" height="200">
  
  # 🎮 Kubo
  
  **Une application Next.js moderne avec support 3D et authentification**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.20.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-12.5.0-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
  
</div>

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Scripts disponibles](#-scripts-disponibles)
- [Structure du projet](#-structure-du-projet)
- [Configuration](#️-configuration)
- [Internationalisation](#-internationalisation)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Auteur](#-auteur)

---

## 🎯 À propos

**Kubo** est une application web full-stack construite avec Next.js 16, intégrant des fonctionnalités avancées de visualisation 3D grâce à Three.js et React Three Fiber. L'application offre une authentification sécurisée via Firebase, une gestion d'état avec Valtio, et une interface utilisateur moderne avec Tailwind CSS et Radix UI.

## ✨ Fonctionnalités

- 🔐 **Authentification Firebase** - Système complet d'authentification avec login/logout
- 🌍 **Internationalisation** - Support multilingue (FR/EN) avec next-intl
- 🎨 **Interface moderne** - UI components avec Radix UI et Tailwind CSS
- 🎮 **Rendu 3D** - Intégration Three.js avec React Three Fiber
- 📊 **Base de données** - MongoDB avec Mongoose pour la persistance
- 🌙 **Mode sombre** - Thème clair/sombre avec next-themes
- 🔄 **État global** - Gestion d'état avec Valtio et Immer
- 🧪 **Tests** - Suite de tests avec Jest
- 🐳 **Docker** - Containerisation avec Docker et docker-compose
- 📱 **Responsive** - Design adaptatif pour tous les écrans

## 🛠 Technologies

### Core

- **Next.js 16.0.10** - Framework React avec support Turbopack
- **React 19.2.0** - Bibliothèque UI
- **TypeScript 5** - Typage statique

### UI/UX

- **Tailwind CSS 4** - Framework CSS utility-first
- **Radix UI** - Components accessibles et non stylisés
- **Framer Motion** - Animations fluides
- **Lucide React** - Icônes modernes

### 3D

- **React Three Fiber** - Renderer Three.js pour React
- **React Three Drei** - Helpers pour R3F
- **Postprocessing** - Effets post-traitement

### Backend

- **MongoDB 6.20.0** - Base de données NoSQL
- **Mongoose 9.0.2** - ODM pour MongoDB
- **Firebase Admin** - Services backend Firebase

### État & Données

- **Valtio** - Gestion d'état proxy-based
- **Immer** - État immutable
- **LRU Cache** - Cache en mémoire

### Outils de développement

- **ESLint** - Linting
- **Jest** - Framework de tests
- **Winston** - Logging
- **ts-node** - Exécution TypeScript

## 📦 Prérequis

- **Node.js** >= 18.0.0
- **npm** ou **yarn** ou **pnpm**
- **MongoDB** (local ou distant)
- **Docker** (optionnel)

## 🚀 Installation

1. **Cloner le repository**

```bash
git clone <votre-repo>
cd app
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Sous Windows :

```bash
npm run init:env:win
```

Sous Linux/Mac :

```bash
npm run init:env:linux
```

4. **Initialiser la base de données**

```bash
npm run init:db
```

5. **Configurer Firebase**

Placez votre fichier `serviceAccountKey.json` dans `data/firebase/`

## 📜 Scripts disponibles

| Script                     | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `npm run start:dev`        | Lance le serveur de développement avec Turbopack   |
| `npm run start:build`      | Build l'application pour la production             |
| `npm run start:prod`       | Lance l'application en mode production             |
| `npm test`                 | Exécute les tests Jest                             |
| `npm run test:unit`        | Exécute les tests unitaires                        |
| `npm run test:integration` | Exécute les tests d'intégration                    |
| `npm run test:coverage`    | Exécute les tests avec rapport de couverture       |
| `npm run test:e2e`         | Exécute les tests end-to-end (Playwright)          |
| `npm run test:e2e:ui`      | Lance l'UI Playwright pour déboguer les E2E        |
| `npm run test:watch`       | Tests en mode watch                                |
| `npm run lint`             | Vérifie le code avec ESLint                        |
| `npm run init:db`          | Initialise la base de données                      |
| `npm run init:env:win`     | Configure les fichiers d'environnement (Windows)   |
| `npm run init:env:linux`   | Configure les fichiers d'environnement (Linux/Mac) |

## 📁 Structure du projet

```
app/
├── app/                    # Routes et pages Next.js
│   ├── [locale]/          # Routes internationalisées
│   │   ├── dashboard/     # Dashboard utilisateur
│   │   ├── login/         # Page de connexion
│   │   └── register/      # Page d'inscription
│   ├── api/               # Routes API
│   └── auth/              # Endpoints d'authentification
├── components/            # Composants React réutilisables
│   └── ui/               # Composants UI (Radix/Tailwind)
├── src/                  # Code source principal
│   ├── core/             # Logique métier centrale
│   ├── actions/          # Server actions
│   ├── adapters/         # Adaptateurs de services
│   ├── contexts/         # Contextes React
│   ├── firebase/         # Configuration Firebase
│   └── providers/        # Providers React
├── messages/             # Fichiers de traduction
│   ├── en.json          # Anglais
│   └── fr.json          # Français
├── data/                 # Données et configuration
│   ├── db/              # Base de données MongoDB
│   └── firebase/        # Clés Firebase
├── public/              # Fichiers statiques
├── hooks/               # Custom React hooks
└── i18n/                # Configuration i18n
```

## ⚙️ Configuration

### Variables d'environnement

Créez les fichiers suivants :

- `.env.local` - Développement
- `.env.production.local` - Production
- `.env.test.local` - Tests

Exemple de configuration :

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/kubo

# Firebase
FIREBASE_PROJECT_ID=votre-project-id
FIREBASE_CLIENT_EMAIL=votre-client-email
FIREBASE_PRIVATE_KEY=votre-private-key

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🌍 Internationalisation

L'application supporte plusieurs langues via **next-intl**. Les traductions sont dans `messages/` :

- `en.json` - Anglais
- `fr.json` - Français

Pour ajouter une nouvelle langue, créez un fichier dans `messages/` et configurez `i18n/routing.ts`.

## 🧪 Tests

```bash
# Tous les tests Jest
npm test

# Unitaires
npm run test:unit

# Intégration
npm run test:integration

# Couverture
npm run test:coverage

# E2E
npm run test:e2e

# Watch
npm run test:watch
```

Les tests unitaires/intégration sont dans `__tests__/` (Jest + ts-jest).
Les tests E2E sont dans `e2e/` (Playwright).

### Coverage

Le rapport est généré dans `coverage/` (formats text, HTML et lcov).

### CI/CD

Le pipeline GitHub Actions (`.github/workflows/ci-cd.yml`) exécute :

1. Lint
2. Tests unitaires
3. Tests d'intégration
4. Coverage
5. Tests E2E Playwright (Chromium)

## 🐳 Docker

L'application peut être lancée avec Docker :

```bash
docker-compose up
```

## 🚀 Déploiement

### Build de production

```bash
npm run start:build
npm run start:prod
```

### Déploiement recommandé

- **Vercel** - Déploiement optimisé pour Next.js
- **Railway** - Déploiement avec MongoDB
- **AWS/GCP** - Déploiement scalable

## 👨‍💻 Auteur

**RATRON Mathis**

---

<div align="center">
  <p>Fait avec ❤️ par RATRON Mathis</p>
  <p>© 2026 Kubo - Tous droits réservés</p>
</div>

RATRON Mathis

# Techniques de qualité de code et non-régression — Projet Kubo

Ce document présente les techniques mises en œuvre pour garantir la qualité du code et assurer la non-régression tout au long du développement du projet Kubo.

---

## Vue d'ensemble de la stratégie qualité

```
                    ┌──────────────────────────────────┐
                    │       Pipeline CI/CD (GitHub)     │
                    │                                    │
                    │  ┌────────────────────────────┐   │
                    │  │    Job 1 — quality           │   │
                    │  │                              │   │
                    │  │  1. Linting (ESLint)         │   │
                    │  │  2. Tests unitaires (Jest)   │   │
                    │  │  3. Tests d'intégration      │   │
                    │  │  4. Coverage (seuils)        │   │
                    │  └──────────┬───────────────────┘   │
                    │             │ ✅ OK                  │
                    │  ┌──────────▼───────────────────┐   │
                    │  │    Job 2 — e2e               │   │
                    │  │                              │   │
                    │  │  5. Tests E2E (Playwright)   │   │
                    │  └────────────────────────────┘   │
                    └──────────────────────────────────┘
```

La stratégie repose sur **5 niveaux de vérification** exécutés séquentiellement : les tests légers passent en premier pour un feedback rapide, les tests lourds (E2E) ne s'exécutent que si les étapes précédentes sont validées.

---

## 1. Typage statique — TypeScript

**Objectif :** Détecter les erreurs au moment de la compilation, avant même l'exécution.

| Aspect | Mise en œuvre |
| --- | --- |
| Langage | TypeScript 5 avec mode strict |
| Interfaces et types | Tous les composants ECS sont typés (`World`, `Entity`, `ViewMode`, `KuboFile`, `FilesPort`, etc.) |
| Enums | `ViewMode`, `CameraType`, `ModelFileFormat` pour éviter les magic strings |
| Classe d'erreur typée | `KuboFileError` extends `Error` pour distinguer les erreurs métier des erreurs techniques |

**Exemple concret :** Le port `FilesPort` définit une interface stricte que tout adaptateur doit implémenter, garantissant que l'ajout du paramètre `userId` à chaque méthode est vérifié à la compilation :

```typescript
export interface FilesPort {
    uploadFile(buffer: Buffer, type: FileType, extension: string, userId: string): Promise<IFile>;
    downloadFile(gridFsId: string | ObjectId, userId: string): Promise<Readable>;
    getFileInfo(gridFsId: string | ObjectId, userId: string): Promise<IFile>;
    deleteFile(gridFsId: string | ObjectId, userId: string): Promise<void>;
}
```

---

## 2. Linting — ESLint

**Objectif :** Garantir la cohérence du style de code et détecter les mauvaises pratiques.

| Aspect | Mise en œuvre |
| --- | --- |
| Outil | ESLint 9 avec `eslint-config-next` |
| Exécution locale | `npm run lint` |
| Exécution CI | Première étape du job `quality` — bloque le pipeline si des erreurs sont détectées |

---

## 3. Tests unitaires — Jest + ts-jest

**Objectif :** Valider le comportement des fonctions et modules de manière isolée.

### Tests du format .kubo (`__tests__/core/kubo/kuboFile.test.ts`)

6 cas de test couvrant la sérialisation et la désérialisation du format de fichier propriétaire :

| Cas de test | Ce qui est vérifié |
| --- | --- |
| Sérialiser puis désérialiser un World | Aucune perte de données (camera, environment, lights, names, transforms) |
| Vérifier l'en-tête kubo | Présence de `version`, `app`, `createdAt` dans le JSON sérialisé |
| Rejeter un JSON invalide | Lève `KuboFileError` sur un contenu non-JSON |
| Rejeter un JSON sans structure kubo | Lève `KuboFileError` si `kubo` ou `world` est absent |
| Rejeter un World incomplet | Lève `KuboFileError` si `camera` ou `environment` est null |
| Initialiser les records manquants | Les champs optionnels (`lights`, `models`, etc.) sont initialisés à `{}` |

### Tests des utilitaires (`__tests__/unit/utils.test.ts`)

4 cas de test pour les fonctions de conversion couleur (`rgbToHex`, `hexToRgb`) :

| Cas de test | Ce qui est vérifié |
| --- | --- |
| Conversion RGB → Hex | `{ r: 255, g: 16, b: 0 }` → `#ff1000` |
| Clamp des valeurs hors limites | `{ r: -10, g: 300, b: 128 }` → `#00ff80` |
| Conversion Hex → RGB | `#0a64ff` → `{ r: 10, g: 100, b: 255 }` |
| Hex invalide | `#gggggg` → `null` |

### Exécution

```bash
npm run test:unit        # Tests unitaires uniquement
npm run test:watch       # Mode watch pour le développement
```

---

## 4. Tests d'intégration — Jest avec mocks

**Objectif :** Valider le comportement de la route API dans des scénarios réalistes, en mockant les dépendances externes (base de données, Firebase).

### Route `GET /api/files/[userId]/[fileId]` (`__tests__/integration/api/filesRoute.integration.test.ts`)

5 cas de test couvrant l'authentification, l'autorisation et le téléchargement :

| Scénario | Code HTTP | Réponse attendue | Ce qui est vérifié |
| --- | --- | --- | --- |
| Session cookie invalide | `401` | `{ error: "Unauthorized" }` | L'accès sans authentification est refusé |
| UID ≠ userId | `403` | `{ error: "Forbidden" }` | Un utilisateur ne peut pas accéder aux fichiers d'un autre |
| fileId vide | `400` | `{ error: "File ID is required" }` | Les paramètres invalides sont rejetés |
| Fichier `.glb` valide | `200` | Buffer + Content-Type `model/gltf-binary` | Le fichier est correctement servi avec le bon MIME type |
| Erreur interne | `500` | `{ error: "Failed to download file" }` | Les erreurs sont catchées et renvoyées proprement |

### Mocks utilisés

```
getUidFromSessionCookie  → simule l'authentification Firebase
getFilesPort             → simule l'adaptateur MongoDB GridFS
exportFile               → simule le moteur de fichiers ECS
logger                   → silence les logs pendant les tests
```

### Exécution

```bash
npm run test:integration
```

---

## 5. Tests End-to-End — Playwright

**Objectif :** Valider le comportement de l'application du point de vue de l'utilisateur final, dans un vrai navigateur.

### Scénarios couverts (`e2e/public-pages.spec.ts`)

| Scénario | URL testée | Assertion |
| --- | --- | --- |
| Page d'accueil FR accessible | `/fr` | Le logo Kubo est visible |
| Formulaire de login FR | `/fr/login` | Les champs `#email` et `#password` sont visibles |
| Page register FR accessible | `/fr/register` | Le logo Kubo est visible |

### Configuration

- **Navigateur** : Chromium (installé automatiquement via `npx playwright install --with-deps chromium`)
- **Rapports** : Générés dans `playwright-report/`, uploadés en artifact CI

### Exécution

```bash
npm run test:e2e         # Exécution headless
npm run test:e2e:ui      # Interface Playwright pour debug
```

---

## 6. Couverture de code — Jest Coverage

**Objectif :** Mesurer le pourcentage de code source couvert par les tests et garantir un seuil minimum.

### Seuils minimaux configurés

| Métrique   | Seuil | Rôle |
| ---------- | ----- | ---- |
| Lines      | 25%   | Pourcentage de lignes exécutées au moins une fois |
| Statements | 25%   | Pourcentage de déclarations exécutées |
| Functions  | 30%   | Pourcentage de fonctions appelées au moins une fois |
| Branches   | 20%   | Pourcentage de branches conditionnelles couvertes |

> **Note :** Si un seuil n'est pas atteint, la commande `npm run test:coverage` échoue et bloque le pipeline CI.

### Périmètre collecté

```
✅ src/**/*.{ts,tsx}           — Code source principal
✅ app/api/**/*.{ts,tsx}       — Routes API Next.js
❌ src/**/*.d.ts               — Fichiers de déclaration TypeScript
❌ src/**/*.stories.{ts,tsx}   — Fichiers Storybook
❌ __tests__/                  — Les tests eux-mêmes
❌ node_modules/               — Dépendances
```

### Formats de rapport

| Format | Usage |
| --- | --- |
| `text` | Affiché dans le terminal à chaque exécution |
| `html` | Rapport navigable dans `coverage/index.html` |
| `lcov` | Intégration avec des outils externes (Codecov, SonarQube) |

### Exécution

```bash
npm run test:coverage
```

---

## 7. Pipeline CI/CD — GitHub Actions

**Objectif :** Automatiser toutes les vérifications à chaque push et pull request, garantissant qu'aucune régression ne passe en production.

### Déclencheurs

- `push` sur les branches `main`, `develop`, `dev`
- `pull_request` vers ces mêmes branches

### Architecture du pipeline

```
Job 1 — quality (Lint + Unit + Integration + Coverage)
│
├── 1. Checkout du code
├── 2. Configuration Node.js 20.x (avec cache npm)
├── 3. Installation des dépendances (npm ci)
├── 4. Linting (npm run lint)
├── 5. Tests unitaires (npm run test:unit -- --runInBand)
├── 6. Tests d'intégration (npm run test:integration -- --runInBand)
├── 7. Coverage (npm run test:coverage -- --runInBand)
└── 8. Upload artifact coverage/
        │
        │ ✅ Tout est vert
        ▼
Job 2 — e2e (Playwright, dépend de quality)
│
├── 1. Checkout du code
├── 2. Configuration Node.js 20.x
├── 3. Installation des dépendances (npm ci)
├── 4. Installation Chromium (npx playwright install --with-deps chromium)
├── 5. Tests E2E (npm run test:e2e)
└── 6. Upload artifact playwright-report/
```

### Points clés

- **`--runInBand`** : Les tests Jest sont exécutés séquentiellement en CI pour éviter les problèmes de concurrence
- **`needs: quality`** : Le job E2E ne démarre que si le job quality est passé, évitant de gaspiller des minutes CI
- **Artifacts** : Les rapports de coverage et Playwright sont uploadés et consultables depuis l'interface GitHub, même en cas d'échec (`if: always()`)

---

## 8. Validation des données — Gestion d'erreurs

**Objectif :** S'assurer que les données entrantes (fichiers importés, paramètres API) sont validées avant traitement.

### Validations côté API (`app/api/files/[userId]/[fileId]/route.ts`)

```
1. Session cookie présent et valide      → sinon 401 Unauthorized
2. UID du cookie == userId de la route   → sinon 403 Forbidden
3. fileId non vide                       → sinon 400 Bad Request
4. Extension reconnue (hdr, glb, etc.)   → sinon application/octet-stream
5. Erreur interne catchée                → 500 avec message générique
```

### Validations côté fichier `.kubo` (`src/core/kubo/kuboFile.ts`)

```
1. Contenu parsable en JSON              → sinon KuboFileError
2. Structure { kubo, world } présente    → sinon KuboFileError
3. En-tête kubo valide (version, app)    → sinon KuboFileError
4. World complet (camera, environment)   → sinon KuboFileError
5. Records manquants initialisés à {}    → tolérance pour fichiers minimalistes
```

### Validations côté client (import 3D)

```
1. Taille du fichier < 200 Mo           → sinon toast d'erreur
2. Extension .gltf ou .glb              → filtrage par accept de l'input file
```

---

## Récapitulatif des scripts qualité

| Script | Commande | Rôle |
| --- | --- | --- |
| `npm run lint` | `eslint .` | Vérification du style et des pratiques |
| `npm run test:unit` | `jest --testPathIgnorePatterns=__tests__/integration` | Tests unitaires isolés |
| `npm run test:integration` | `jest __tests__/integration` | Tests d'intégration API |
| `npm run test:coverage` | `jest --coverage` | Rapport de couverture avec seuils |
| `npm run test:e2e` | `playwright test` | Tests navigateur end-to-end |
| `npm run test:e2e:ui` | `playwright test --ui` | Debug E2E avec interface Playwright |
| `npm run test:watch` | `jest --watch` | Feedback immédiat en développement |

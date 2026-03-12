RATRON Mathis

# Changelog — Nouvelles fonctionnalités

Ce document détaille les fonctionnalités ajoutées dans les derniers commits sur la branche `dev`.

---

## Table des matières

- [Undo / Redo](#-undo--redo)
- [Panneau de contrôle des animations](#-panneau-de-contrôle-des-animations)
- [Modes de vue du viewport](#-modes-de-vue-du-viewport)
- [Import de modèles 3D](#-import-de-modèles-3d)
- [Export de la scène (.kubo)](#-export-de-la-scène-kubo)
- [Import de la scène (.kubo)](#-import-de-la-scène-kubo)
- [Tests d'intégration](#-tests-dintégration)
- [Coverage](#-coverage)
- [Tests E2E (Playwright)](#-tests-e2e-playwright)
- [Pipeline CI/CD](#-pipeline-cicd)

---

## Undo / Redo

### Description

Système d'historique permettant d'annuler et rétablir les modifications apportées à la scène 3D. Basé sur des snapshots du World ECS (proxy valtio), avec un debounce de 300 ms pour regrouper les mutations rapides (ex : drag continu d'un objet).

### Utilisation

| Action   | Raccourci clavier          | Bouton UI         |
| -------- | -------------------------- | ----------------- |
| Annuler  | `Ctrl+Z`                   | Bouton ↩ (navbar) |
| Rétablir | `Ctrl+Y` ou `Ctrl+Shift+Z` | Bouton ↪ (navbar) |

### Détails techniques

- **Hook** : `hooks/use-world-history.ts` — `useWorldHistory(world)`
- Historique limité à **50 entrées** (`MAX_HISTORY_SIZE`)
- Les snapshots identiques consécutifs ne sont pas empilés
- Les changements causés par un undo/redo ne sont pas enregistrés dans l'historique (flag `isRestoring`)
- Toute nouvelle action vide la pile de redo

### Fichiers concernés

```
hooks/use-world-history.ts              # Hook undo/redo
src/contexts/worldContext.tsx            # Exposition du hook via useWorldHistoryValues()
src/ui/components/DashboardNavbar.tsx    # Boutons UI + raccourcis clavier
messages/fr.json / en.json              # Traductions (undo, redo, undo_success, redo_success)
```

---

## Panneau de contrôle des animations

### Description

Panneau flottant qui apparaît automatiquement en bas de la scène 3D lorsqu'un objet sélectionné possède des animations embarquées (clips GLTF). Permet de jouer, mettre en pause et arrêter les animations, ainsi que de choisir parmi les animations disponibles.

### Fonctionnalités

- **Play / Pause** — Lance ou met en pause l'animation en cours
- **Stop** — Arrête l'animation et réinitialise la position
- **Sélecteur d'animation** — Dropdown pour choisir parmi les animations disponibles (affiché uniquement si le modèle en possède plusieurs)
- **Affichage conditionnel** — Le panneau n'apparaît que si l'objet sélectionné possède au moins une animation

### Détails techniques

- Les animations sont détectées automatiquement lors du chargement du modèle GLTF via `THREE.AnimationMixer`
- L'état d'animation (current, playing, available) est stocké dans le World ECS (`world.models[entity].animation`)
- La synchronisation entre l'ECS et Three.js se fait via `valtio/subscribe` pour réagir aux changements d'état

### Fichiers concernés

```
src/ui/components/AnimationControlPanel.tsx     # Composant UI du panneau
src/ui/components/Model3DRenderer.tsx           # Gestion du mixer et des actions Three.js
src/core/ecs/engine/model3dEngine.ts            # Fonctions ECS (play, stop, toggle, setAnimations)
src/core/ecs/queries/model3dQuery.ts            # Queries ECS (getAnimation, getAvailable, etc.)
messages/fr.json / en.json                      # Traductions (select_animation, play, pause, stop)
```

---

## Modes de vue du viewport

### Description

Système de modes de vue du viewport 3D inspiré de Blender. Permet de basculer entre 4 modes d'affichage pour faciliter le travail de modélisation et de mise en scène.

### Modes disponibles

| Mode      | Icône       | Description                                                 |
| --------- | ----------- | ----------------------------------------------------------- |
| Wireframe | `Box`       | Affiche uniquement les arêtes (fil de fer vert)             |
| Solid     | `CircleDot` | Matériau gris uniforme, pas de textures, éclairage basique  |
| Material  | `Lightbulb` | Matériaux + textures, sans environment map (fond neutre)    |
| Rendered  | `Eye`       | Rendu complet avec environment map, ombres, post-processing |

### Détails techniques

- **Enum** : `ViewMode` dans `src/types.ts`
- **Context React** : `ViewModeProvider` / `useViewMode()` dans `src/contexts/viewModeContext.tsx`
- Le mode par défaut est `RENDERED`
- En mode **Wireframe** et **Solid**, les matériaux des modèles GLTF sont remplacés dynamiquement (avec sauvegarde/restauration des originaux)
- L'environment map n'est chargé qu'en mode **Rendered** (optimisation des performances)
- En modes sans environment map, un éclairage de remplacement (ambient + directional) est ajouté

### Fichiers concernés

```
src/types.ts                                # Enum ViewMode
src/contexts/viewModeContext.tsx             # Context React
src/ui/components/ViewModeSection.tsx        # UI de sélection (grille 2×2 dans le sidebar)
src/ui/components/ThreeRenderer.tsx          # Logique de rendu conditionnel
src/ui/components/Model3DRenderer.tsx        # Override des matériaux par mode
app/[locale]/dashboard/layout.tsx           # Ajout du ViewModeProvider
app/[locale]/dashboard/page.tsx             # Remplacement de TextureSection par ViewModeSection
messages/fr.json / en.json                  # Traductions (wireframe, solid, material, rendered)
```

---

## Import de modèles 3D

### Description

Permet d'importer des fichiers **GLTF/GLB** depuis le disque local. Le fichier est uploadé vers MongoDB GridFS via une server action, puis une entité Model3D est créée dans le World ECS pour l'afficher dans la scène.

### Formats supportés

| Format | Extension | MIME Type           |
| ------ | --------- | ------------------- |
| GLTF   | `.gltf`   | `model/gltf+json`   |
| GLB    | `.glb`    | `model/gltf-binary` |

### Limitations

- Taille maximale : **200 Mo** par fichier
- Les modèles utilisant l'extension dépréciée `KHR_materials_pbrSpecularGlossiness` (fréquente sur Sketchfab) sont supportés grâce à un plugin de conversion custom

### Flux technique

1. L'utilisateur clique sur **Fichier → Import** et sélectionne un `.gltf` ou `.glb`
2. Validation de la taille côté client (< 200 Mo)
3. Upload vers GridFS via `importModel3DAction` (server action authentifiée)
4. Création d'une entité Model3D dans le World ECS (`createModel3D`)
5. Le composant `Model3DRenderer` charge le modèle via `useGLTF` depuis l'API `/api/files/[userId]/[fileId]`

### Sécurité

- L'upload nécessite une authentification (session cookie)
- La route API de téléchargement est scopée par utilisateur (`/api/files/[userId]/[fileId]`)
- Vérification que l'`uid` du session cookie correspond au `userId` de la route (403 sinon)

### Fichiers concernés

```
src/actions/filesActions.ts                         # Server action importModel3DAction
src/core/ecs/engine/filesEngine.ts                  # Logique d'upload (importModel3D)
src/ui/components/DashboardNavbar.tsx                # Bouton import + logique
src/ui/components/Model3DRenderer.tsx                # Chargement et rendu GLTF/GLB
src/ui/helpers/gltfSpecularGlossinessPlugin.ts       # Plugin KHR_materials_pbrSpecularGlossiness
app/api/files/[userId]/[fileId]/route.ts             # Route API de téléchargement (avec auth)
```

---

## Export de la scène (.kubo)

### Description

Exporte l'intégralité de la scène 3D dans un fichier `.kubo`, un format propriétaire basé sur JSON. Le fichier contient l'état complet du World ECS (caméra, environnement, lumières, modèles, matériaux, transformations, noms).

### Format du fichier .kubo

```json
{
  "kubo": {
    "version": "1.0.0",
    "createdAt": "2026-03-12T10:30:00.000Z",
    "app": "Kubo"
  },
  "world": {
    "camera": { ... },
    "environment": { ... },
    "lights": { ... },
    "materials": { ... },
    "models": { ... },
    "names": { ... },
    "transforms": { ... },
    "textures": { ... }
  }
}
```

### Utilisation

- **Menu** : Fichier → Export
- Le fichier est téléchargé automatiquement avec le nom `scene_<timestamp>.kubo`

### Détails techniques

- Sérialisation via `serializeKuboFile(world)` — deep clone du proxy valtio puis `JSON.stringify` indenté
- Téléchargement via création d'un `Blob` + `URL.createObjectURL` côté navigateur

### Fichiers concernés

```
src/core/kubo/kuboFile.ts                   # serializeKuboFile, downloadKuboFile
src/ui/components/DashboardNavbar.tsx        # Bouton export
```

---

## Import de la scène (.kubo)

### Description

Permet de charger une scène précédemment exportée au format `.kubo`. L'import remplace l'intégralité du World ECS courant par celui contenu dans le fichier.

### Utilisation

- **Menu** : Fichier → Importer une scène (.kubo)
- Un sélecteur de fichier s'ouvre, filtré sur l'extension `.kubo`

### Validations effectuées

| Validation                         | Erreur                                                            |
| ---------------------------------- | ----------------------------------------------------------------- |
| JSON malformé                      | `KuboFileError: Le fichier .kubo est invalide (JSON malformé)`    |
| Structure `kubo` + `world` absente | `KuboFileError: Structure attendue (kubo + world) manquante`      |
| En-tête invalide                   | `KuboFileError: En-tête .kubo invalide (version ou app manquant)` |
| World incomplet                    | `KuboFileError: World incomplet (camera ou environment manquant)` |

- Les records optionnels manquants (`lights`, `materials`, `models`, `names`, `transforms`, `textures`) sont initialisés à `{}`.

### Fichiers concernés

```
src/core/kubo/kuboFile.ts                   # deserializeKuboFile, openKuboFile, KuboFileError
src/ui/components/DashboardNavbar.tsx        # Bouton import scène + application sur le proxy
```

---

## Tests d'intégration

### Description

Tests d'intégration pour la route API `GET /api/files/[userId]/[fileId]`, couvrant l'authentification, l'autorisation et le téléchargement de fichiers.

### Cas testés

| Test                                       | Status attendu | Assertion                          |
| ------------------------------------------ | -------------- | ---------------------------------- |
| Non authentifié (session invalide)         | `401`          | `{ error: "Unauthorized" }`        |
| UID ≠ userId (accès au fichier d'un autre) | `403`          | `{ error: "Forbidden" }`           |
| fileId vide                                | `400`          | `{ error: "File ID is required" }` |
| Fichier valide (`.glb`)                    | `200`          | Content-Type `model/gltf-binary`   |
| Erreur interne                             | `500`          | `{ error: "Failed to download" }`  |

### Exécution

```bash
npm run test:integration
```

### Fichiers concernés

```
__tests__/integration/api/filesRoute.integration.test.ts
```

---

## Coverage

### Description

Configuration du rapport de couverture de code avec des seuils minimaux à respecter.

### Seuils configurés

| Métrique   | Seuil minimum |
| ---------- | ------------- |
| Lines      | 25%           |
| Statements | 25%           |
| Functions  | 30%           |
| Branches   | 20%           |

### Formats de rapport

- `text` — Affiché dans le terminal
- `lcov` — Pour intégration avec des outils de CI (ex : Codecov)
- `html` — Rapport navigable dans `coverage/`

### Périmètre de collecte

```
src/**/*.{ts,tsx}
app/api/**/*.{ts,tsx}
```

Exclusions : fichiers `.d.ts`, fichiers `.stories.{ts,tsx}`, `node_modules/`, `__tests__/`.

### Exécution

```bash
npm run test:coverage
```

Le rapport HTML est généré dans le dossier `coverage/`.

### Fichiers concernés

```
jest.config.cjs     # Configuration collectCoverageFrom, coverageThreshold, coverageReporters
```

---

## Tests E2E (Playwright)

### Description

Tests end-to-end avec Playwright validant l'accessibilité des pages publiques de l'application.

### Scénarios couverts

| Test                                  | Page           | Assertion                               |
| ------------------------------------- | -------------- | --------------------------------------- |
| Page d'accueil FR accessible          | `/fr`          | Logo Kubo visible                       |
| Page de login FR expose le formulaire | `/fr/login`    | Champs `#email` et `#password` visibles |
| Page register FR accessible           | `/fr/register` | Logo Kubo visible                       |

### Exécution

```bash
# Lancer les tests E2E
npm run test:e2e

# Lancer avec l'interface Playwright (debug)
npm run test:e2e:ui
```

### Fichiers concernés

```
e2e/public-pages.spec.ts    # Tests Playwright
```

---

## Pipeline CI/CD

### Description

Le pipeline GitHub Actions (`.github/workflows/ci-cd.yml`) a été restructuré en 2 jobs séquentiels :

### Job 1 — `quality` (Lint + Unit + Integration + Coverage)

1. Checkout + installation des dépendances (`npm ci`)
2. **Linting** — `npm run lint`
3. **Tests unitaires** — `npm run test:unit -- --runInBand`
4. **Tests d'intégration** — `npm run test:integration -- --runInBand`
5. **Coverage** — `npm run test:coverage -- --runInBand`
6. Upload du rapport de coverage en artifact

### Job 2 — `e2e` (Playwright, dépend de `quality`)

1. Checkout + installation des dépendances
2. Installation des navigateurs Playwright (Chromium)
3. **Tests E2E** — `npm run test:e2e`
4. Upload du rapport Playwright en artifact

---

## Scripts npm ajoutés

| Script                     | Commande                                              |
| -------------------------- | ----------------------------------------------------- |
| `npm run test:unit`        | `jest --testPathIgnorePatterns=__tests__/integration` |
| `npm run test:integration` | `jest __tests__/integration`                          |
| `npm run test:coverage`    | `jest --coverage`                                     |
| `npm run test:e2e`         | `playwright test`                                     |
| `npm run test:e2e:ui`      | `playwright test --ui`                                |

RATRON Mathis

# Document de suivi de projet — Kubo

## Informations générales

| Champ               | Valeur                                                               |
| ------------------- | -------------------------------------------------------------------- |
| **Projet**          | Kubo — Éditeur de scènes 3D web                                      |
| **Auteur**          | RATRON Mathis                                                        |
| **Type**            | Projet individuel                                                    |
| **Temps total**     | 47 heures                                                            |
| **Branche**         | `dev`                                                                |
| **Dépôt**           | `github.com/mathisrto/kubo`                                          |
| **Stack technique** | Next.js 16 · React 19 · TypeScript 5 · Three.js · MongoDB · Firebase |

---

## Répartition du temps par fonctionnalité

| #   | Fonctionnalité                     | Temps estimé | % du total |
| --- | ---------------------------------- | ------------ | ---------- |
| 1   | Import de modèles 3D (GLTF/GLB)    | 10h          | 21%        |
| 2   | Panneau de contrôle des animations | 8h           | 17%        |
| 3   | Modes de vue du viewport           | 7h           | 15%        |
| 4   | Export / Import de scène (.kubo)   | 6h           | 13%        |
| 5   | Undo / Redo                        | 5h           | 11%        |
| 6   | Tests d'intégration                | 4h           | 8%         |
| 7   | Tests E2E (Playwright)             | 3h           | 6%         |
| 8   | Coverage + Pipeline CI/CD          | 2h           | 4%         |
| 9   | Refactoring, bugfix, documentation | 2h           | 4%         |
|     | **Total**                          | **47h**      | **100%**   |

---

## Détail des tâches réalisées

### 1. Import de modèles 3D (GLTF/GLB) — ~10h

- Mise en place de la server action `importModel3DAction` avec authentification
- Upload des fichiers vers MongoDB GridFS scopé par utilisateur
- Refonte du composant `Model3DRenderer` pour charger les modèles GLTF/GLB via `useGLTF`
- Développement du plugin `GLTFSpecularGlossinessPlugin` pour supporter les modèles Sketchfab utilisant l'extension dépréciée `KHR_materials_pbrSpecularGlossiness`
- Refonte de la route API `GET /api/files/[userId]/[fileId]` avec vérification d'authentification (401) et d'autorisation (403)
- Gestion du placeholder de chargement (`ModelLoadingPlaceholder`) avec Suspense
- Remontée de la sélection dans les sous-meshes GLTF (`findEntityAncestor` dans `SelectionObserver`)

### 2. Panneau de contrôle des animations — ~8h

- Création du composant `AnimationControlPanel` (Play / Pause / Stop / Sélecteur)
- Intégration de `THREE.AnimationMixer` dans `Model3DRenderer` avec gestion des `AnimationAction`
- Stockage de l'état d'animation dans le World ECS (`animation.available`, `animation.current`, `animation.playing`)
- Synchronisation réactive entre l'ECS (valtio) et Three.js via `valtio/subscribe`
- Enregistrement automatique des animations disponibles au chargement du modèle
- Gestion du désactivation du `frustumCulling` sur les `SkinnedMesh` pour éviter les artefacts d'animation
- Internationalisation du panneau (FR/EN)

### 3. Modes de vue du viewport — ~7h

- Définition de l'enum `ViewMode` (Wireframe, Solid, Material, Rendered)
- Création du context React `ViewModeProvider` / `useViewMode()`
- Composant UI `ViewModeSection` (grille 2×2 dans le sidebar)
- Override dynamique des matériaux en modes Wireframe et Solid (avec sauvegarde/restauration des originaux)
- Chargement conditionnel de l'environment map (uniquement en mode Rendered)
- Éclairage de remplacement (ambient + directional) pour les modes sans environment map
- Mémoïsation du composant `Environment` pour éviter les re-renders coûteux
- Gestion conditionnelle du post-processing Outline selon le mode

### 4. Export / Import de scène (.kubo) — ~6h

- Conception du format de fichier `.kubo` (JSON avec en-tête versionnée)
- Implémentation de `serializeKuboFile` et `deserializeKuboFile`
- Classe d'erreur custom `KuboFileError` avec validations (JSON malformé, structure manquante, world incomplet)
- Helper navigateur `downloadKuboFile` (Blob + URL.createObjectURL)
- Helper navigateur `openKuboFile` (sélecteur de fichier + gestion annulation via focus)
- Intégration dans la navbar (boutons export + import scène)
- Tests unitaires du format `.kubo` (6 cas : sérialisation/désérialisation, en-tête, rejet JSON invalide, world incomplet, records manquants)

### 5. Undo / Redo — ~5h

- Développement du hook `useWorldHistory` basé sur des snapshots valtio
- Mécanisme de debounce (300 ms) pour regrouper les mutations rapides
- Flag `isRestoring` pour éviter d'enregistrer les changements causés par undo/redo
- Limitation de l'historique à 50 entrées
- Boutons Undo / Redo dans la navbar
- Raccourcis clavier `Ctrl+Z` / `Ctrl+Y` / `Ctrl+Shift+Z`
- Exposition via le context `useWorldHistoryValues()`
- Internationalisation des messages de confirmation

### 6. Tests d'intégration — ~4h

- Tests de la route API `GET /api/files/[userId]/[fileId]` (5 cas)
- Mise en place des mocks (session cookie, filesPort, exportFile, logger)
- Vérification des codes HTTP (401, 403, 400, 200, 500) et des réponses JSON
- Vérification du Content-Type correct pour les fichiers `.glb`
- Configuration du script npm `test:integration`

### 7. Tests E2E (Playwright) — ~3h

- Configuration de Playwright avec Chromium
- Tests d'accessibilité des pages publiques (accueil, login, register)
- Vérification de la visibilité du logo et des champs de formulaire
- Scripts npm `test:e2e` et `test:e2e:ui`

### 8. Coverage + Pipeline CI/CD — ~2h

- Configuration des seuils de couverture dans `jest.config.cjs` (lines 25%, statements 25%, functions 30%, branches 20%)
- Ajout des reporters (text, lcov, html)
- Restructuration du pipeline CI/CD en 2 jobs séquentiels (quality → e2e)
- Upload des artifacts (coverage + rapport Playwright)

### 9. Refactoring, bugfix, documentation — ~2h

- Mise à jour du `README.md` (scripts, documentation tests, CI/CD)
- Remplacement de `logger` par un logger local dans `initDatabase.ts` pour éviter les dépendances circulaires
- Ajout des traductions FR/EN pour toutes les nouvelles fonctionnalités
- Mise à jour du `.gitignore` (playwright-report, test-results)
- Nettoyage du formatage (trailing commas cohérentes)

---

## Difficultés rencontrées

| Difficulté                          | Description                                                                                                                     | Solution                                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Extension GLTF dépréciée            | Three.js ≥ 0.174 a retiré le support de `KHR_materials_pbrSpecularGlossiness`, beaucoup de modèles Sketchfab l'utilisent encore | Développement d'un plugin GLTFLoader custom qui convertit les propriétés specular/glossiness en metallic/roughness |
| Sélection des modèles GLTF          | Le raycast touche un sous-mesh profond sans `userData.id`, pas l'entité ECS                                                     | Implémentation de `findEntityAncestor()` qui remonte la hiérarchie parent pour trouver le group portant l'id       |
| Undo/Redo et mutations rapides      | Le drag continu d'un objet génère des centaines de mutations par seconde                                                        | Debounce de 300 ms + dédoublonnage des snapshots identiques                                                        |
| Animations et frustumCulling        | Les `SkinnedMesh` disparaissent pendant les animations car la bounding box des os n'est pas mise à jour                         | Désactivation du `frustumCulled` sur les `SkinnedMesh`                                                             |
| Re-renders coûteux de l'Environment | Le composant `Environment` se re-rendait à chaque changement du World                                                           | Mémoïsation avec `React.memo` et chargement conditionnel par mode de vue                                           |

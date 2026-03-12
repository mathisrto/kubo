RATRON Mathis

# Référentiel de compétences — Projet Kubo

Ce document établit le lien entre les compétences du référentiel et les travaux réalisés sur le projet **Kubo** (éditeur de scènes 3D web).

---

## C1 — Adapter des applications sur un ensemble de supports

### AC 2 — Faire évoluer une application existante

L'ensemble des 47 heures de travail a consisté à faire évoluer l'application Kubo existante en y ajoutant de nouvelles fonctionnalités majeures. Le projet partait d'une base fonctionnelle (authentification, rendu 3D avec primitives, gestion de scène basique) et a été enrichi de manière significative.

**Évolutions apportées :**

| Fonctionnalité | Nature de l'évolution |
| --- | --- |
| **Import de modèles 3D** | Extension du moteur de rendu existant pour supporter le chargement de fichiers GLTF/GLB externes, là où seules les primitives (cube, sphère, cylindre, plan) étaient supportées. Refonte complète du composant `Model3DRenderer` et de la route API files (ajout de l'authentification par utilisateur). |
| **Panneau d'animations** | Ajout d'une fonctionnalité entièrement nouvelle au-dessus du système ECS existant : stockage de l'état d'animation dans le World, synchronisation réactive avec Three.js via `valtio/subscribe`, intégration de `THREE.AnimationMixer`. |
| **Modes de vue** | Ajout d'un système de modes de vue (Wireframe, Solid, Material, Rendered) dans le viewport 3D existant, nécessitant la modification du `ThreeRenderer`, du `Model3DRenderer` et l'ajout d'un nouveau context React. |
| **Format .kubo** | Création d'un format de fichier propriétaire pour l'export/import de scènes, permettant de sérialiser/désérialiser l'intégralité du World ECS avec validation et gestion d'erreurs. |
| **Undo / Redo** | Greffe d'un système d'historique sur le state manager existant (valtio), avec debounce, snapshots, et raccourcis clavier, sans modifier l'architecture du World ECS. |

**Preuve de la capacité à faire évoluer sans casser l'existant :**

- Le plugin `GLTFSpecularGlossinessPlugin` a été développé pour pallier le retrait du support natif dans Three.js ≥ 0.174, assurant la rétrocompatibilité avec les modèles Sketchfab existants.
- La route API files a été migrée de `/api/files/[fileId]` vers `/api/files/[userId]/[fileId]` en ajoutant l'authentification, sans casser les fonctionnalités existantes (environment map, textures).
- Le `SelectionObserver` a été adapté pour remonter la hiérarchie des sous-meshes GLTF (`findEntityAncestor`), sans modifier le comportement existant pour les primitives.

---

## C2 — Analyser et optimiser des applications

### AC 2 — Profiler, analyser et justifier le comportement d'un code existant

Plusieurs optimisations ont été réalisées après analyse du comportement de l'application, en identifiant des problèmes de performances et des comportements inattendus.

**Analyses et optimisations réalisées :**

| Problème identifié | Analyse | Optimisation appliquée |
| --- | --- | --- |
| **Re-renders coûteux de l'Environment** | Le composant `Environment` (chargement HDR) se re-rendait à chaque mutation du World ECS, car il recevait les props depuis le snapshot valtio qui change à chaque frame. | Mémoïsation avec `React.memo` (`MemoizedEnvironment`) et chargement conditionnel selon le mode de vue : l'environment map n'est chargé qu'en mode Rendered, évitant le coût GPU dans les 3 autres modes. |
| **Mutations rapides saturant l'historique** | Le drag continu d'un objet via les TransformControls génère des centaines de mutations par seconde, ce qui aurait saturé la pile undo avec des centaines d'états quasi-identiques. | Debounce de 300 ms dans `useWorldHistory` + dédoublonnage des snapshots identiques (comparaison JSON). Limitation de l'historique à 50 entrées pour éviter la consommation mémoire excessive. |
| **Disparition des SkinnedMesh pendant les animations** | Les modèles animés disparaissaient aléatoirement car Three.js utilise le frustum culling basé sur la bounding box statique, qui n'est pas mise à jour pendant les animations squelettiques. | Désactivation ciblée de `frustumCulled` uniquement sur les `SkinnedMesh`, sans affecter les autres meshes (qui conservent le culling pour les performances). |
| **Post-processing Outline en modes Wireframe/Solid** | L'effet Outline du post-processing consommait des ressources GPU même dans les modes où il n'était pas visuellement pertinent (les matériaux étant déjà remplacés). | Désactivation conditionnelle de la sélection Outline dans les modes Wireframe et Solid, tout en gardant le pipeline `EffectComposer` monté pour éviter les problèmes de re-création. |
| **Chargement de copies indépendantes par entité** | `useGLTF` de drei met en cache les modèles par URL, ce qui fait que deux entités utilisant le même fichier partagent la même scène Three.js (et donc les mêmes animations, matériaux, etc.). | Ajout d'un paramètre `?eid=<entityId>` à l'URL pour forcer `useGLTF` à charger une copie indépendante par entité, sans nécessiter de clone manuel. |

**Justification des choix :**

- La couverture de code a été configurée avec des seuils minimaux (lines 25%, functions 30%) et 3 formats de rapport (text, lcov, html) pour permettre l'analyse continue de la qualité du code.
- Les tests d'intégration de la route API files vérifient les 5 cas de réponse HTTP (401, 403, 400, 200, 500), validant le comportement du code dans des scénarios réels.

---

## C6 — Manager une équipe informatique

### AC 1 — Organiser et partager une veille numérique

Bien que le projet soit individuel, une veille technologique active a été nécessaire pour résoudre les problèmes rencontrés et faire les choix techniques appropriés.

**Veille réalisée :**

| Sujet | Source / Contexte | Résultat |
| --- | --- | --- |
| **Retrait de `KHR_materials_pbrSpecularGlossiness` dans Three.js ≥ 0.174** | Changelog Three.js, issues GitHub Three.js, documentation Khronos Group | Développement d'un plugin custom de conversion specular/glossiness → metallic/roughness, permettant de continuer à supporter les modèles Sketchfab |
| **Bonnes pratiques animations GLTF** | Documentation Three.js (`AnimationMixer`, `AnimationAction`), exemples React Three Fiber | Implémentation d'un système d'animation complet avec play/pause/stop et sélection, intégré au pattern ECS |
| **Patterns undo/redo avec proxy-based state** | Documentation valtio, patterns d'historique dans les éditeurs (Figma, Excalidraw) | Hook `useWorldHistory` basé sur des snapshots JSON avec debounce, adapté aux spécificités de valtio (subscribe, snapshot) |
| **Modes de vue 3D (Blender)** | Interface de Blender (viewport shading modes), documentation Three.js materials | Reproduction des 4 modes de vue de Blender (Wireframe, Solid, Material, Rendered) adaptés au contexte web/React |
| **Playwright pour Next.js** | Documentation Playwright, documentation Next.js testing | Configuration E2E avec Chromium, tests des pages publiques internationalisées |

**Partage :**

- Documentation complète des choix techniques dans le `CHANGELOG.md` (détails techniques, fichiers concernés)
- Documentation du projet dans le `README.md` (scripts, structure, configuration, tests)

---

### AC 3 — Guider la conduite du changement informatique au sein d'une organisation

Le projet a intégré des changements structurants dans l'organisation du code et les pratiques de développement.

**Changements introduits :**

| Changement | Avant | Après | Impact |
| --- | --- | --- | --- |
| **Sécurisation de la route API files** | Route publique `/api/files/[fileId]` sans authentification | Route scopée `/api/files/[userId]/[fileId]` avec vérification session cookie (401) et ownership (403) | Chaque utilisateur n'accède qu'à ses propres fichiers |
| **Stratégie de tests structurée** | Un seul script `npm test` exécutant tous les tests indifféremment | Scripts séparés : `test:unit`, `test:integration`, `test:coverage`, `test:e2e` | Exécution ciblée, feedback plus rapide en développement |
| **Pipeline CI/CD restructuré** | Pipeline monolithique avec un seul job | 2 jobs séquentiels : `quality` (lint + unit + integration + coverage) puis `e2e` (Playwright) | Feedback plus rapide : les tests légers passent d'abord, les E2E ne s'exécutent que si la qualité est validée |
| **Format de fichier propriétaire** | Pas de persistance locale des scènes | Format `.kubo` versionné avec validation stricte | Portabilité des scènes, sauvegarde/restauration fiable avec gestion d'erreurs explicite |
| **Remplacement de TextureSection par ViewModeSection** | Section "Textures (bientôt)" dans le sidebar | Section "Mode de vue" fonctionnelle avec 4 modes | Passage d'un placeholder à une fonctionnalité utile pour le workflow utilisateur |

---

### AC 4 — Accompagner le management de projet informatique

Le projet a été géré de manière structurée malgré son caractère individuel, avec un suivi du temps, une documentation des fonctionnalités et une traçabilité des modifications.

**Pratiques de management de projet appliquées :**

| Pratique | Mise en œuvre |
| --- | --- |
| **Suivi du temps** | Répartition des 47 heures sur 9 fonctionnalités avec estimation du temps passé par tâche (cf. `SUIVI_PROJET.md`) |
| **Commits conventionnels** | Utilisation systématique de prefixes (`feat:`, `refactor:`, `fix:`, `chore:`) pour catégoriser les modifications et faciliter la lecture de l'historique |
| **Documentation des changements** | Rédaction d'un `CHANGELOG.md` détaillé pour chaque fonctionnalité : description, utilisation, détails techniques, fichiers concernés |
| **Gestion des difficultés** | Identification et documentation de 5 problèmes techniques majeurs avec leurs solutions (cf. `SUIVI_PROJET.md` section "Difficultés rencontrées") |
| **Qualité continue** | Mise en place de seuils de couverture, tests d'intégration, tests E2E et pipeline CI/CD pour garantir la non-régression à chaque évolution |
| **Internationalisation** | Toutes les nouvelles fonctionnalités ont été traduites en FR et EN, maintenant la cohérence avec l'existant |
| **Versionnage** | Développement sur la branche `dev`, séparation des préoccupations par commit atomique |

RATRON Mathis

# Bilan de projet — Kubo

---

## Synthèse

Le projet Kubo est un éditeur de scènes 3D web développé avec Next.js, React Three Fiber et MongoDB. Sur cette période de **47 heures**, l'application existante a été enrichie de **9 fonctionnalités majeures** touchant à la fois le moteur 3D, l'expérience utilisateur, la persistance des données et la qualité logicielle.

---

## Ce qui a été réalisé

### Fonctionnalités utilisateur

| Fonctionnalité | Statut | Temps |
| --- | --- | --- |
| Import de modèles 3D (GLTF/GLB) | ✅ Terminé | ~10h |
| Panneau de contrôle des animations | ✅ Terminé | ~8h |
| Modes de vue du viewport (Wireframe, Solid, Material, Rendered) | ✅ Terminé | ~7h |
| Export de scène au format `.kubo` | ✅ Terminé | ~6h |
| Import de scène au format `.kubo` | ✅ Terminé | (inclus ci-dessus) |
| Undo / Redo (Ctrl+Z / Ctrl+Y) | ✅ Terminé | ~5h |

### Qualité et infrastructure

| Élément | Statut | Temps |
| --- | --- | --- |
| Tests d'intégration (route API files) | ✅ Terminé | ~4h |
| Tests E2E Playwright (pages publiques) | ✅ Terminé | ~3h |
| Coverage avec seuils + Pipeline CI/CD | ✅ Terminé | ~2h |
| Refactoring, documentation, bugfix | ✅ Terminé | ~2h |

---

## Compétences mobilisées

| Compétence | Application concrète |
| --- | --- |
| **TypeScript** | Typage strict de l'ensemble du projet (interfaces ECS, ports, types, enums) |
| **React / Next.js** | Composants, contexts, hooks custom, server actions, routes API |
| **Three.js / R3F** | Rendu 3D, AnimationMixer, matériaux, post-processing, chargement GLTF |
| **Architecture ECS** | Séparation engine/queries, World comme source de vérité, fonctions pures |
| **Valtio** | State management proxy-based, snapshots, subscribe pour la synchronisation |
| **MongoDB GridFS** | Stockage de fichiers binaires (modèles 3D, textures) scopé par utilisateur |
| **Jest** | Tests unitaires, tests d'intégration, mocks, coverage |
| **Playwright** | Tests E2E navigateur, assertions d'accessibilité |
| **GitHub Actions** | Pipeline CI/CD multi-jobs avec artifacts |
| **i18n** | Internationalisation FR/EN de toutes les nouvelles fonctionnalités |

---

## Points forts du projet

- **Architecture propre** — Séparation claire entre le moteur ECS (engine/queries), les ports (interfaces), les adaptateurs (implémentations) et l'UI (composants React). Chaque nouvelle fonctionnalité s'est greffée sans modifier l'architecture existante.

- **Rétrocompatibilité** — Le plugin `GLTFSpecularGlossinessPlugin` garantit la compatibilité avec les modèles utilisant une extension Three.js dépréciée, montrant la capacité à anticiper les problèmes liés aux montées de version des dépendances.

- **Sécurité** — L'ajout de l'authentification et de l'autorisation sur la route API files (401/403) montre une prise en compte de la sécurité dès la conception.

- **Couverture de tests variée** — 3 niveaux de tests (unitaires, intégration, E2E) avec des outils adaptés à chaque niveau, intégrés dans un pipeline CI/CD automatisé.

- **Expérience utilisateur** — Undo/Redo avec raccourcis clavier, modes de vue inspirés de Blender, panneau d'animations contextuel, toasts de feedback : des fonctionnalités qui rendent l'outil agréable à utiliser.

---

## Axes d'amélioration

| Axe | Description | Piste |
| --- | --- | --- |
| **Couverture de tests** | Les seuils actuels (25-30%) sont volontairement bas pour le démarrage. Ils pourraient être relevés progressivement. | Ajouter des tests pour les engines ECS (model3dEngine, environmentEngine) et les composants React |
| **Tests E2E** | Seules les pages publiques sont testées. Le parcours utilisateur connecté n'est pas couvert. | Ajouter des tests Playwright pour le dashboard, l'import/export, les animations |
| **Gestion des erreurs 3D** | Un modèle GLTF corrompu ou trop complexe peut bloquer le viewport sans message explicite. | Ajouter un ErrorBoundary autour du chargement des modèles avec message utilisateur |
| **Performance des gros modèles** | Les modèles volumineux (> 50 Mo) peuvent ralentir le chargement initial. | Implémenter un système de LOD (Level of Detail) ou de chargement progressif |
| **Historique undo/redo** | Le snapshot JSON complet du World est coûteux en mémoire pour les scènes complexes. | Passer à un système de patches (diff) plutôt que des snapshots complets |
| **Format .kubo** | Le format ne contient pas les fichiers binaires (modèles 3D, textures) — seules les références GridFS sont sauvegardées. | Intégrer les binaires dans un format archive (ZIP) pour un export autonome |

---

## Conclusion

En 47 heures, le projet Kubo est passé d'un éditeur de scènes 3D basique (primitives uniquement, pas de persistance locale, pas de tests structurés) à un outil plus complet intégrant l'import de modèles GLTF/GLB, un système d'animations, des modes de vue, un format de fichier propriétaire, un historique undo/redo, et une stratégie de qualité logicielle à 3 niveaux de tests.

Les choix techniques (architecture ECS, ports/adaptateurs, valtio, TypeScript strict) ont permis d'intégrer ces fonctionnalités de manière incrémentale, sans régression sur l'existant, validé par le pipeline CI/CD automatisé.

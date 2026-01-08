# Configuration CI/CD pour Kubo App

Ce document explique comment configurer et utiliser le pipeline CI/CD pour le déploiement de l'application Kubo.

## 🚀 Vue d'ensemble

Le pipeline CI/CD automatise les processus suivants :

-   ✅ Tests automatisés avec Jest
-   🔍 Linting du code
-   🏗️ Build de l'application Next.js
-   📦 Déploiement sur Vercel
-   🐳 Build et push d'images Docker (optionnel)

## 📋 Prérequis

### 1. Secrets GitHub à configurer

Accédez à `Settings > Secrets and variables > Actions` de votre repository et ajoutez :

#### Vercel (Obligatoire)

```
VERCEL_TOKEN          # Token d'accès Vercel
VERCEL_ORG_ID         # ID de votre organisation Vercel
VERCEL_PROJECT_ID     # ID de votre projet Vercel
```

#### Firebase (Obligatoire)

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

#### Docker Hub (Optionnel - pour déploiement Docker)

```
DOCKER_USERNAME       # Nom d'utilisateur Docker Hub
DOCKER_PASSWORD       # Mot de passe ou token Docker Hub
```

#### Autres

```
NEXT_PUBLIC_API_URL   # URL de votre API
```

### 2. Obtenir les credentials Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Récupérer les IDs (ils seront dans .vercel/project.json)
cat .vercel/project.json
```

### 3. Configuration Firebase

Assurez-vous d'avoir :

-   Un projet Firebase créé
-   Les credentials Firebase configurés dans les secrets GitHub
-   Les règles de sécurité Firebase Storage configurées

## 🔄 Workflows disponibles

### Workflow principal : `ci-cd.yml`

**Déclencheurs :**

-   Push sur `main` ou `develop`
-   Pull Request vers `main` ou `develop`

**Jobs :**

1. **test** : Exécute les tests et le linting

    - Lance MongoDB en service
    - Installe les dépendances
    - Vérifie le linting
    - Exécute les tests Jest
    - Upload les résultats de couverture

2. **build** : Build l'application

    - Build Next.js avec Turbopack
    - Stocke les artifacts

3. **deploy-vercel** : Déploie sur Vercel

    - Production pour `main`
    - Preview pour `develop` et PR
    - Commente l'URL sur les PR

4. **deploy-docker** : Build et push l'image Docker

    - Uniquement pour `main`
    - Tag avec version, sha, et branch

5. **notify** : Envoie les notifications de statut

## 🐳 Déploiement Docker

### Build local

```bash
# Build de l'image
docker build -t kubo-app:latest .

# Exécution en local
docker run -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  kubo-app:latest
```

### Avec Docker Compose

```bash
# Lancement de tous les services
docker-compose up -d

# Vérification des logs
docker-compose logs -f

# Arrêt des services
docker-compose down
```

## 📊 Monitoring

### Vérifier le statut du pipeline

1. Allez dans l'onglet `Actions` de votre repository GitHub
2. Sélectionnez le workflow `CI/CD Pipeline`
3. Consultez les logs de chaque job

### Vérifier le déploiement Vercel

```bash
# Liste des déploiements
vercel ls

# Logs du dernier déploiement
vercel logs
```

## 🔧 Configuration avancée

### Personnaliser les environnements

Modifiez [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) pour ajouter des environnements personnalisés.

### Ajouter des tests E2E

Ajoutez un job pour Playwright ou Cypress :

```yaml
e2e:
    name: Tests E2E
    runs-on: ubuntu-latest
    needs: build
    steps:
        - uses: actions/checkout@v4
        - name: Install Playwright
          run: npx playwright install --with-deps
        - name: Run E2E tests
          run: npm run test:e2e
```

### Configuration de la base de données de production

Pour MongoDB Atlas ou autre service cloud :

1. Ajoutez `MONGODB_URI` dans les secrets Vercel
2. Configurez les IP autorisées dans MongoDB Atlas
3. Créez un utilisateur dédié avec les bonnes permissions

## 🛠️ Commandes utiles

```bash
# Tester le build localement
npm run build

# Lancer les tests
npm test

# Vérifier le linting
npm run lint

# Initialiser la base de données
npm run init:db

# Déployer manuellement sur Vercel
vercel --prod
```

## 📝 Variables d'environnement

### Développement (.env.local)

```env
# Database
MONGODB_URI=mongodb://localhost:3001
DATABASE_ROOT_USERNAME=admin
DATABASE_ROOT_PASSWORD=password

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Production (Vercel)

Configurez ces variables dans le dashboard Vercel :

-   Environment Variables > Production

## 🚨 Dépannage

### Le build échoue sur Vercel

1. Vérifiez que toutes les variables d'environnement sont définies
2. Consultez les logs dans le dashboard Vercel
3. Testez le build localement : `npm run build`

### Les tests échouent en CI

1. Vérifiez que MongoDB démarre correctement dans le service
2. Consultez les logs du job `test`
3. Testez localement avec les mêmes variables d'environnement

### L'image Docker est trop volumineuse

1. Vérifiez le fichier `.dockerignore`
2. Utilisez le mode `standalone` de Next.js (déjà configuré)
3. Utilisez des stages multi-étapes (déjà configuré)

## 🔐 Sécurité

-   ❌ Ne commitez jamais de secrets dans le code
-   ✅ Utilisez toujours GitHub Secrets pour les données sensibles
-   ✅ Limitez les permissions des tokens au minimum nécessaire
-   ✅ Rotez régulièrement vos secrets
-   ✅ Activez la double authentification sur tous les services

## 📚 Ressources

-   [Documentation Next.js](https://nextjs.org/docs)
-   [Documentation Vercel](https://vercel.com/docs)
-   [GitHub Actions](https://docs.github.com/actions)
-   [Docker Documentation](https://docs.docker.com/)
-   [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)

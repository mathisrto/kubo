# 📝 Guide des Variables d'Environnement

## 🎯 Stratégie Simplifiée

Votre configuration a été optimisée pour **éliminer les répétitions**. Voici comment ça fonctionne :

### 📂 Structure des fichiers

```
.env.example              # Template à copier (committé dans Git)
.env.local               # ⭐ FICHIER PRINCIPAL - toutes vos variables
.env.development.local   # Surcharges pour le dev (optionnel)
.env.production.local    # Surcharges pour la prod
.env.test.local          # Surcharges pour les tests
```

## 🔄 Ordre de chargement Next.js

Next.js charge les fichiers dans cet ordre (le dernier écrase le précédent) :

```
1. .env                      # Variables de base (si présent)
2. .env.local               # ⭐ Variables locales (dev & prod)
3. .env.[mode]              # Spécifique à l'environnement
4. .env.[mode].local        # Surcharges locales par environnement
```

**Mode :** `development`, `production`, ou `test`

> **Important :** `.env.local` est **ignoré en mode test** pour garantir des résultats prévisibles.

## ✅ Comment l'utiliser

### 1️⃣ Configuration initiale

```bash
# Copiez le fichier exemple
cp .env.example .env.local

# Remplissez vos vraies valeurs Firebase et autres secrets
```

### 2️⃣ Développement (par défaut)

Utilisez **uniquement** `.env.local` :

-   ✅ Contient TOUTES vos variables
-   ✅ Fonctionne pour le dev local
-   ✅ Pas de duplication

```bash
npm run dev  # Charge automatiquement .env.local
```

### 3️⃣ Tests

Créez `.env.test.local` **uniquement pour ce qui change** :

```env
# .env.test.local - Uniquement les différences
DATABASE_NAME=kubo_test
DATABASE_USERNAME=test_user
DATABASE_PASSWORD=test_password
```

Les variables Firebase, API, etc. sont **automatiquement héritées** de `.env.local`.

```bash
npm test  # Charge .env.test.local + variables héritées
```

### 4️⃣ Production

Créez `.env.production.local` **uniquement pour ce qui change** :

```env
# .env.production.local - Uniquement les différences
DATABASE_NAME=kubo_production
DATABASE_USERNAME=prod_user
DATABASE_PASSWORD=CHANGEZ_MOI
NEXT_PUBLIC_GRAPHQL_URL=https://api.votre-domaine.com
```

```bash
npm run build  # Charge .env.production.local + variables héritées
npm start
```

## 🎨 Exemple Concret

### Avant (répétitions) ❌

```
.env.development.local (150 lignes)
├── FIREBASE (10 variables)
├── DATABASE (3 variables)
└── API (5 variables)

.env.production.local (150 lignes)
├── FIREBASE (10 variables) ← DUPLIQUÉES
├── DATABASE (3 variables)
└── API (5 variables)

.env.test.local (150 lignes)
├── FIREBASE (10 variables) ← DUPLIQUÉES
├── DATABASE (3 variables)
└── API (5 variables)
```

### Après (optimisé) ✅

```
.env.local (toutes les variables communes)
├── FIREBASE (10 variables) ← UNE SEULE FOIS
├── DATABASE (3 variables)
└── API (5 variables)

.env.production.local (seulement 3 lignes)
└── DATABASE_NAME=kubo_production  ← SURCHARGE

.env.test.local (seulement 3 lignes)
└── DATABASE_NAME=kubo_test  ← SURCHARGE
```

**Résultat :** ~95% de réduction des duplications ! 🎉

## 🔒 Sécurité

### Ne JAMAIS committer

Ces fichiers sont dans `.gitignore` :

```gitignore
.env.local
.env.development.local
.env.production.local
.env.test.local
```

### À committer

```
✅ .env.example  # Template sans valeurs sensibles
✅ .gitignore    # Protection
```

## 🚀 Pour votre équipe

1. **Nouveau développeur :**

    ```bash
    git clone votre-repo
    cp .env.example .env.local
    # Remplit ses credentials Firebase
    npm run dev
    ```

2. **Pas besoin de toucher** aux autres fichiers `.env.*` sauf si vraiment différent.

3. **En production (Vercel) :**
    - Configurez les variables dans le dashboard Vercel
    - Pas besoin de fichiers `.env` sur Vercel

## 💡 Astuces

### Vérifier les variables chargées

```typescript
// Dans votre code
console.log(
    "Firebase Key:",
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + "..."
);
console.log("Database:", process.env.DATABASE_NAME);
```

### Générer des secrets forts

```bash
# Pour JWT_SECRET, SESSION_SECRET, etc.
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Variables d'environnement Vercel

Dans le dashboard Vercel, ajoutez les variables pour **Production**, **Preview**, et **Development** séparément.

## 📚 Références

-   [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
-   [Next.js Environment Loading Order](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#environment-variable-load-order)

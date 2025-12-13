# Firebase Storage - Configuration CORS

## Problème

Erreur CORS lors de l'upload d'avatars vers Firebase Storage.

## Solution

### 1. Règles Firebase Storage

Dans la console Firebase, allez dans Storage > Rules et utilisez:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Règle pour les avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true; // Public en lecture
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Autres fichiers (si nécessaire)
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Configuration CORS

Si les erreurs CORS persistent, créez un fichier `cors.json`:

```json
[
    {
        "origin": ["*"],
        "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
        "maxAgeSeconds": 3600,
        "responseHeader": [
            "Content-Type",
            "Authorization",
            "Content-Length",
            "User-Agent",
            "X-Requested-With"
        ]
    }
]
```

Puis exécutez (nécessite Google Cloud SDK):

```bash
gsutil cors set cors.json gs://kubo-mr.appspot.com
```

### 3. Vérifier la variable d'environnement

Dans `.env.local`, assurez-vous que:

```
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kubo-mr.appspot.com
```

**Note:** Utilisez `kubo-mr.appspot.com` et NON `kubo-mr.firebasestorage.app`

### 4. Alternative: Utiliser une URL publique directe

Au lieu d'utiliser `getDownloadURL()`, vous pouvez construire l'URL manuellement:

```typescript
const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
    path
)}?alt=media`;
```

### 5. Redémarrer l'application

Après avoir modifié les variables d'environnement, redémarrez le serveur Next.js.

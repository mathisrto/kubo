import admin from "firebase-admin";

// Configuration Firebase Admin SDK via variables d'environnement
const firebaseAdminConfig = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

// Vérification des variables d'environnement
if (
    !firebaseAdminConfig.projectId ||
    !firebaseAdminConfig.clientEmail ||
    !firebaseAdminConfig.privateKey
) {
    throw new Error(
        "Firebase Admin SDK credentials are missing. Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY environment variables."
    );
}

// Initialisation de Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(
            firebaseAdminConfig as admin.ServiceAccount
        ),
    });
}

export { admin };

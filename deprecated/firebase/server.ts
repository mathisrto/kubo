import admin from "firebase-admin";

import serviceAccount from "../../data/firebase/serviceAccountKey.json";

if (!serviceAccount) {
    throw new Error(
        "Firebase service account key file not found. Please ensure the path is correct."
    );
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount
        ),
    });
}

export { admin };

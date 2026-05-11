import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const PEDIER_APP_NAME = "pedier-app";

const pedierFirebaseConfig = {
  apiKey: import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Re-use existing named app if hot-reload has already initialised it.
const existingApp = getApps().find((a) => a.name === PEDIER_APP_NAME);
export const pedierApp = existingApp ?? initializeApp(pedierFirebaseConfig, PEDIER_APP_NAME);

export const pedierDb = getDatabase(pedierApp);
export const pedierAuth = getAuth(pedierApp);

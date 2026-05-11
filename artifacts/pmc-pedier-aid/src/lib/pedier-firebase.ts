import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getAuth, type Auth } from "firebase/auth";

const PEDIER_APP_NAME = "pedier-app";

export interface PedierFirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

/** Returns the raw env-var config (values may be undefined if secrets aren't set). */
export function getPedierFirebaseConfig(): PedierFirebaseConfig {
  return {
    apiKey: import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

/** Returns which required secrets are missing. Empty array = all present. */
export function getMissingPedierSecrets(): string[] {
  const cfg = getPedierFirebaseConfig();
  const required: Array<[keyof PedierFirebaseConfig, string]> = [
    ["apiKey",            "NEXT_PUBLIC_FIREBASE_API_KEY"],
    ["databaseURL",       "NEXT_PUBLIC_FIREBASE_DATABASE_URL"],
    ["projectId",         "NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
    ["appId",             "NEXT_PUBLIC_FIREBASE_APP_ID"],
  ];
  return required.filter(([key]) => !cfg[key]).map(([, name]) => name);
}

// Lazy singletons — only initialised when first requested, so missing config
// doesn't crash the entire app at module load time.
let _app: FirebaseApp | null = null;
let _db: Database | null = null;
let _auth: Auth | null = null;

function getPedierApp(): FirebaseApp {
  if (_app) return _app;
  const missing = getMissingPedierSecrets();
  if (missing.length > 0) {
    throw new Error(
      `Pedier Firebase: missing Replit secrets — ${missing.join(", ")}`
    );
  }
  const existing = getApps().find((a) => a.name === PEDIER_APP_NAME);
  _app = existing ?? initializeApp(getPedierFirebaseConfig(), PEDIER_APP_NAME);
  return _app;
}

export function getPedierDb(): Database {
  if (!_db) _db = getDatabase(getPedierApp());
  return _db;
}

export function getPedierAuth(): Auth {
  if (!_auth) _auth = getAuth(getPedierApp());
  return _auth;
}

/** Convenience re-exports for code that was written before lazy init. */
export const pedierApp  = new Proxy({} as FirebaseApp, { get: (_, p) => (getPedierApp() as any)[p] });
export const pedierDb   = new Proxy({} as Database,    { get: (_, p) => (getPedierDb()  as any)[p] });
export const pedierAuth = new Proxy({} as Auth,        { get: (_, p) => (getPedierAuth() as any)[p] });

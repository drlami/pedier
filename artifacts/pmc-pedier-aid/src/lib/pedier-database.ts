import {
  ref,
  set,
  get,
  push,
  serverTimestamp,
} from "firebase/database";
import { pedierDb } from "./pedier-firebase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CaseData {
  [key: string]: unknown;
}

export interface ProtocolNote {
  note: string;
  updatedAt?: unknown;
}

export interface AuditLogData {
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Saved Cases  –  savedCases/{uid}/{caseId}
// ---------------------------------------------------------------------------

export async function saveUserCase(uid: string, caseData: CaseData): Promise<string> {
  const casesRef = ref(pedierDb, `savedCases/${uid}`);
  const newCaseRef = push(casesRef);
  await set(newCaseRef, {
    ...caseData,
    savedAt: serverTimestamp(),
  });
  return newCaseRef.key!;
}

export async function getUserCases(uid: string): Promise<Record<string, CaseData>> {
  const casesRef = ref(pedierDb, `savedCases/${uid}`);
  const snapshot = await get(casesRef);
  return snapshot.exists() ? (snapshot.val() as Record<string, CaseData>) : {};
}

// ---------------------------------------------------------------------------
// Protocol Notes  –  protocolNotes/{uid}/{protocolId}
// ---------------------------------------------------------------------------

export async function saveProtocolNote(
  uid: string,
  protocolId: string,
  note: string
): Promise<void> {
  const noteRef = ref(pedierDb, `protocolNotes/${uid}/${protocolId}`);
  await set(noteRef, {
    note,
    updatedAt: serverTimestamp(),
  });
}

export async function getProtocolNotes(uid: string): Promise<Record<string, ProtocolNote>> {
  const notesRef = ref(pedierDb, `protocolNotes/${uid}`);
  const snapshot = await get(notesRef);
  return snapshot.exists() ? (snapshot.val() as Record<string, ProtocolNote>) : {};
}

// ---------------------------------------------------------------------------
// Audit Logs  –  auditLogs/{logId}
// ---------------------------------------------------------------------------

export async function writeAuditLog(data: AuditLogData): Promise<string> {
  const logsRef = ref(pedierDb, "auditLogs");
  const newLogRef = push(logsRef);
  await set(newLogRef, {
    ...data,
    timestamp: serverTimestamp(),
  });
  return newLogRef.key!;
}

// ---------------------------------------------------------------------------
// Connection test  –  writes a single heartbeat to verify the DB is reachable.
// Call this once during app init to confirm Firebase is wired correctly.
// ---------------------------------------------------------------------------

export async function testPedierConnection(): Promise<void> {
  const testRef = ref(pedierDb, "_connectionTest/lastChecked");
  await set(testRef, serverTimestamp());
  console.info("[pedier-firebase] Realtime Database connection OK");
}

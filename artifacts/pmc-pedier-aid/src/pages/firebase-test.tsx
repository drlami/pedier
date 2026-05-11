import { useState } from "react";
import { ref, set } from "firebase/database";
import { getMissingPedierSecrets, getPedierDb } from "@/lib/pedier-firebase";

export default function FirebaseTestPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const missingSecrets = getMissingPedierSecrets();
  const configReady = missingSecrets.length === 0;

  async function handleTest() {
    setStatus("loading");
    setError(null);
    try {
      const db = getPedierDb();
      const testRef = ref(db, "pedierTest/connectionStatus");
      await set(testRef, {
        message: "Pedier Firebase connected",
        createdAt: Date.now(),
      });
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Firebase Connection Test</h1>
        <p className="text-gray-500 text-sm">
          Writes to{" "}
          <code className="bg-gray-100 px-1 rounded">pedierTest/connectionStatus</code>{" "}
          using the Pedier Firebase app.
        </p>

        {/* Missing secrets warning */}
        {!configReady && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-800 text-left">
            <p className="font-semibold mb-2">⚠ Replit secrets not set</p>
            <p className="text-sm mb-2">Add these secrets in the Replit Secrets tab:</p>
            <ul className="text-xs font-mono space-y-1">
              {missingSecrets.map((s) => (
                <li key={s} className="bg-amber-100 rounded px-2 py-0.5">{s}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleTest}
          disabled={!configReady || status === "loading"}
          className="w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === "loading" ? "Writing to Firebase…" : "Test Firebase Connection"}
        </button>

        {status === "success" && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-green-800">
            <p className="font-semibold text-lg">✓ Connected!</p>
            <p className="text-sm mt-1">
              Successfully wrote to{" "}
              <code className="text-xs bg-green-100 px-1 rounded">pedierTest/connectionStatus</code>.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-800 text-left">
            <p className="font-semibold">Write failed</p>
            <p className="text-sm mt-1 break-words">{error}</p>
          </div>
        )}

        <p className="text-xs text-gray-400">
          This page is temporary and only used to verify the Firebase setup.
        </p>
      </div>
    </div>
  );
}

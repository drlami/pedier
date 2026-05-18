import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import bcrypt from "bcryptjs";
import { STATIC_USERS } from "@/lib/static-users";

export type UserRole = "admin" | "specialist" | "resident";

export interface AuthUser {
  userId: string;
  username: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "pmc-auth-session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        const known = STATIC_USERS.find(
          (u) => u.id === parsed.userId && u.username === parsed.username,
        );
        if (known) {
          setUser(parsed);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const found = STATIC_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
    if (!found) throw new Error("Invalid username or password");
    const ok = await bcrypt.compare(password, found.passwordHash);
    if (!ok) throw new Error("Invalid username or password");
    const session: AuthUser = {
      userId: found.id,
      username: found.username,
      role: found.role,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function getAuthToken(): string | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as { role?: string };
    return `local-session:${session.role ?? "user"}`;
  } catch {
    return "local-session:user";
  }
}

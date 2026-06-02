import type { UserRole } from "@/contexts/auth-context";

export interface StaticUser {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
}

export const STATIC_USERS: StaticUser[] = [
  {
    id: "79ee0f71-22ab-43d9-83b1-dd211386adc5",
    username: "drlamiqurt",
    passwordHash: "$2b$12$1frf5q.dGTv7lw3soaQQuupZaVeQqaoQsXGOOAGEV.zSFeQ.J.iWC",
    role: "admin",
  },
  {
    id: "doctor-user-id",
    username: "doctor",
    passwordHash: "$2b$12$z2/XmJ16tVl7RsPlPUUviO7lK4QOlgAqM9Tlzlhi8AFitHC1ggRsi",
    role: "specialist",
  },
];

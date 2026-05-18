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
    id: "6d5a9c49-3b31-4969-bf1c-907625c1e5fd",
    username: "drsamer",
    passwordHash: "$2b$12$KbWzSJb.0thfAKGRyv91Hu/UTNP61xpbmnq5ybBMvu5UOxE1NYLsW",
    role: "specialist",
  },
];

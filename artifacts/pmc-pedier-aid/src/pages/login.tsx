import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { StethoscopeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Lock, User } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = (fd.get("username") as string).trim();
    const password = fd.get("password") as string;
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await login(username, password);
      setLocation("/");
    } catch (err: unknown) {
      setError((err as Error).message || "Login failed. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(210, 30%, 96%)" }}>
      {/* Top bar */}
      <div className="h-14 flex items-center px-6 shadow-sm" style={{ background: "hsl(212, 72%, 22%)" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/15">
            <StethoscopeIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-white">PMC PediER Aid</span>
            <span className="text-[10px] text-white/60 font-normal tracking-wide uppercase hidden sm:block">
              Pediatric Emergency Clinical Decision Support
            </span>
          </div>
        </div>
      </div>

      {/* Login card */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-xl shadow-md border border-border overflow-hidden">
            {/* Card header */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 mx-auto mb-4">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-center text-lg font-bold text-foreground">Staff Sign In</h1>
              <p className="text-center text-xs text-muted-foreground mt-1">
                Authorised personnel only
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    autoFocus
                    className="pl-9"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="pl-9"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/8 border border-destructive/20 rounded-md px-3 py-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-[11px] text-muted-foreground mt-4">
            Clinical support tool only. Final judgment remains with the treating physician.
          </p>
        </div>
      </div>
    </div>
  );
}

import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import HomePage from "@/pages/home";
import DiseasePage from "@/pages/disease";
import SummaryPage from "@/pages/summary";
import CardiacArrestPage from "@/pages/cardiac-arrest";
import DiffDiagPage from "@/pages/differential-diagnosis";
import DrugSafetyPage from "@/pages/drug-safety";
import AdminPage from "@/pages/admin";
import ProtocolListPage from "@/pages/admin-protocols";
import ProtocolEditorPage from "@/pages/admin-protocol-editor";
import UsersPage from "@/pages/users";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";
import { AlertCircle, Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function Footer() {
  return (
    <footer className="no-print shrink-0 border-t border-amber-200 bg-amber-50">
      <div className="flex items-center justify-center gap-2 px-4 py-2">
        <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
        <p className="text-[11px] text-amber-800 font-medium">
          Clinical decision support only — final judgment remains with the treating physician.
        </p>
        <span className="hidden sm:inline text-[11px] text-amber-600 before:content-['·'] before:mr-2">
          Prepared by Dr Lami Qurt
        </span>
      </div>
    </footer>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body antialiased flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 flex-shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground overflow-y-auto hidden lg:flex lg:flex-col">
          <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Loading navigation...</div>}>
            <SidebarNav />
          </Suspense>
        </aside>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType; adminOnly?: boolean }) {
  const { user, isLoading, isAdmin } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="text-4xl">🔒</div>
          <h2 className="text-xl font-bold">Access Restricted</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            This page is only accessible to administrators.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function LoginRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (user) return <Redirect to="/" />;
  return <LoginPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginRoute} />
      <Route path="/">
        {() => <ProtectedRoute component={HomePage} />}
      </Route>
      <Route path="/cardiac-arrest">
        {() => <ProtectedRoute component={CardiacArrestPage} />}
      </Route>
      <Route path="/differential-diagnosis">
        {() => <ProtectedRoute component={DiffDiagPage} />}
      </Route>
      <Route path="/drug-safety">
        {() => <ProtectedRoute component={DrugSafetyPage} />}
      </Route>
      <Route path="/diseases/:diseaseId/summary">
        {() => <ProtectedRoute component={SummaryPage} />}
      </Route>
      <Route path="/diseases/:diseaseId">
        {() => <ProtectedRoute component={DiseasePage} />}
      </Route>
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminPage} adminOnly />}
      </Route>
      <Route path="/admin/protocols">
        {() => <ProtectedRoute component={ProtocolListPage} adminOnly />}
      </Route>
      <Route path="/admin/protocols/:protocolId">
        {() => <ProtectedRoute component={ProtocolEditorPage} adminOnly />}
      </Route>
      <Route path="/admin/users">
        {() => <ProtectedRoute component={UsersPage} adminOnly />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

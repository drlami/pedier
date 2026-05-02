import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import HomePage from "@/pages/home";
import DiseasePage from "@/pages/disease";
import SummaryPage from "@/pages/summary";
import CardiacArrestPage from "@/pages/cardiac-arrest";
import DiffDiagPage from "@/pages/differential-diagnosis";
import DrugSafetyPage from "@/pages/drug-safety";
import AdminPage from "@/pages/admin";
import ProtocolListPage from "@/pages/admin-protocols";
import ProtocolEditorPage from "@/pages/admin-protocol-editor";
import NotFound from "@/pages/not-found";
import { AlertCircle } from "lucide-react";

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

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/cardiac-arrest" component={CardiacArrestPage} />
        <Route path="/differential-diagnosis" component={DiffDiagPage} />
        <Route path="/drug-safety" component={DrugSafetyPage} />
        <Route path="/diseases/:diseaseId/summary" component={SummaryPage} />
        <Route path="/diseases/:diseaseId" component={DiseasePage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/admin/protocols" component={ProtocolListPage} />
        <Route path="/admin/protocols/:protocolId" component={ProtocolEditorPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

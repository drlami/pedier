import { Switch, Route, Router as WouterRouter, Link, useRoute, useLocation } from "wouter";
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

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body antialiased flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 flex-shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground overflow-y-auto hidden lg:block">
          <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Loading navigation...</div>}>
            <SidebarNav />
          </Suspense>
        </aside>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <footer className="border-t bg-card py-2 px-4 text-[10px] text-muted-foreground text-center">
        Clinical support tool only. Final judgment remains with treating physician. Tool is Prepared and coded by Dr Lami Qurt.
      </footer>
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

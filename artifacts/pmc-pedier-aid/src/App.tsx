import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { ProtocolsProvider } from "@/contexts/protocols-context";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";
import HomePage from "@/pages/home";
import DiseasePage from "@/pages/disease";
import SummaryPage from "@/pages/summary";
import CardiacArrestPage from "@/pages/cardiac-arrest";
import DiffDiagPage from "@/pages/differential-diagnosis";
import DrugSafetyPage from "@/pages/drug-safety";
import DrugDosesPage from "@/pages/drug-doses";
import ResuscitationDosesPage from "@/pages/resuscitation-doses";
import CalculatorsPage from "@/pages/calculators";
import AdminPage from "@/pages/admin";
import ProtocolListPage from "@/pages/admin-protocols";
import ProtocolEditorPage from "@/pages/admin-protocol-editor";
import UsersPage from "@/pages/users";
import ActivityLogsPage from "@/pages/activity-logs";
import LoginPage from "@/pages/login";
import WelcomePage from "@/pages/welcome";
import HyperbilirubinemiaCal from "@/pages/hyperbilirubinemia";
import AdvancedFluidsPage from "@/pages/advanced-fluids";
import GfrCalculatorPage from "@/pages/gfr-calculator";
import GcsCalculatorPage from "@/pages/gcs-calculator";
import SodiumCorrectionPage from "@/pages/sodium-correction";
import KocherCriteriaPage from "@/pages/kocher-criteria";
import AnionGapPage from "@/pages/anion-gap";
import AbgInterpreterPage from "@/pages/abg-interpreter";
import ApgarScorePage from "@/pages/apgar-score";
import ChildPughCalculatorPage from "@/pages/child-pugh-calculator";
import BsaCalculatorPage from "@/pages/bsa-calculator";
import QtcCalculatorPage from "@/pages/qtc-calculator";
import CalciumCorrectionPage from "@/pages/calcium-correction";
import GrowthChartsPage from "@/pages/growth-charts";
import BpPercentilesPage from "@/pages/bp-percentiles";
import ParklandCalculatorPage from "@/pages/parkland-calculator";
import MetabolicCrisisPage from "@/pages/metabolic-crisis";
import OxygenationIndexPage from "@/pages/oxygenation-index";
import MapCalculatorPage from "@/pages/map-calculator";
import EttDepthPage from "@/pages/ett-depth";
import UacUvcLengthPage from "@/pages/uac-uvc-length";
import WeightLossPage from "@/pages/weight-loss";
import BallardScorePage from "@/pages/ballard-score";
import GestationalAgePage from "@/pages/gestational-age";
import EosRiskPage from "@/pages/eos-risk";
import NrpTimerPage from "@/pages/nrp-timer";
import TpnCalculatorPage from "@/pages/tpn-calculator";
import FentonChartsPage from "@/pages/fenton-charts";
import NotFound from "@/pages/not-found";
import { AlertCircle, Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function Footer() {
  return (
    <footer className="no-print shrink-0 border-t border-amber-200 bg-amber-50 hidden lg:block">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-1 px-4 py-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <p className="text-[11px] text-amber-800 font-medium">
            Clinical decision support only — final judgment remains with the treating physician.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-amber-700/70 tracking-wide whitespace-nowrap">
          Coded by Dr Lami Qurt
        </span>
      </div>
    </footer>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const { desktopOpen } = useSidebar();
  return (
    <div className="font-body antialiased flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "flex-shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground overflow-hidden flex-col transition-[width] duration-200 ease-in-out",
            "hidden lg:flex",
            desktopOpen ? "w-56 visible" : "w-0 border-r-0 invisible",
          )}
        >
          <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Loading navigation...</div>}>
            <SidebarNav />
          </Suspense>
        </aside>
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>
      <MobileBottomNav />
      <Footer />
    </div>
  );
}

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType; adminOnly?: boolean }) {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;

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

function WelcomeRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;
  return <WelcomePage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginRoute} />
      <Route path="/welcome" component={WelcomeRoute} />
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
      <Route path="/drug-doses">
        {() => <ProtectedRoute component={DrugDosesPage} />}
      </Route>
      <Route path="/calculators/resuscitation-doses">
        {() => <ProtectedRoute component={ResuscitationDosesPage} />}
      </Route>
      <Route path="/calculators">
        {() => <ProtectedRoute component={CalculatorsPage} />}
      </Route>
      <Route path="/calculators/advanced-fluids">
        {() => <ProtectedRoute component={AdvancedFluidsPage} />}
      </Route>
      <Route path="/calculators/gfr">
        {() => <ProtectedRoute component={GfrCalculatorPage} />}
      </Route>
      <Route path="/calculators/parkland">
        {() => <ProtectedRoute component={ParklandCalculatorPage} />}
      </Route>
      <Route path="/calculators/gcs">
        {() => <ProtectedRoute component={GcsCalculatorPage} />}
      </Route>
      <Route path="/calculators/sodium-correction">
        {() => <ProtectedRoute component={SodiumCorrectionPage} />}
      </Route>
      <Route path="/calculators/kocher-criteria">
        {() => <ProtectedRoute component={KocherCriteriaPage} />}
      </Route>
      <Route path="/calculators/anion-gap">
        {() => <ProtectedRoute component={AnionGapPage} />}
      </Route>
      <Route path="/calculators/abg-interpreter">
        {() => <ProtectedRoute component={AbgInterpreterPage} />}
      </Route>
      <Route path="/calculators/apgar">
        {() => <ProtectedRoute component={ApgarScorePage} />}
      </Route>
      <Route path="/calculators/child-pugh">
        {() => <ProtectedRoute component={ChildPughCalculatorPage} />}
      </Route>
      <Route path="/calculators/bsa">
        {() => <ProtectedRoute component={BsaCalculatorPage} />}
      </Route>
      <Route path="/calculators/qtc">
        {() => <ProtectedRoute component={QtcCalculatorPage} />}
      </Route>
      <Route path="/calculators/calcium-correction">
        {() => <ProtectedRoute component={CalciumCorrectionPage} />}
      </Route>
      <Route path="/calculators/growth-charts">
        {() => <ProtectedRoute component={GrowthChartsPage} />}
      </Route>
      <Route path="/calculators/bp-percentiles">
        {() => <ProtectedRoute component={BpPercentilesPage} />}
      </Route>
      <Route path="/calculators/hyperbilirubinemia">
        {() => <ProtectedRoute component={HyperbilirubinemiaCal} />}
      </Route>
      <Route path="/calculators/oxygenation-index">
        {() => <ProtectedRoute component={OxygenationIndexPage} />}
      </Route>
      <Route path="/calculators/map-calculator">
        {() => <ProtectedRoute component={MapCalculatorPage} />}
      </Route>
      <Route path="/calculators/ett-depth">
        {() => <ProtectedRoute component={EttDepthPage} />}
      </Route>
      <Route path="/calculators/uac-uvc-length">
        {() => <ProtectedRoute component={UacUvcLengthPage} />}
      </Route>
      <Route path="/calculators/weight-loss">
        {() => <ProtectedRoute component={WeightLossPage} />}
      </Route>
      <Route path="/calculators/ballard-score">
        {() => <ProtectedRoute component={BallardScorePage} />}
      </Route>
      <Route path="/calculators/gestational-age">
        {() => <ProtectedRoute component={GestationalAgePage} />}
      </Route>
      <Route path="/calculators/eos-risk">
        {() => <ProtectedRoute component={EosRiskPage} />}
      </Route>
      <Route path="/calculators/nrp-timer">
        {() => <ProtectedRoute component={NrpTimerPage} />}
      </Route>
      <Route path="/calculators/tpn-calculator">
        {() => <ProtectedRoute component={TpnCalculatorPage} />}
      </Route>
      <Route path="/calculators/fenton-charts">
        {() => <ProtectedRoute component={FentonChartsPage} />}
      </Route>
      <Route path="/neonatology/hyperbilirubinemia">
        {() => <ProtectedRoute component={HyperbilirubinemiaCal} />}
      </Route>
      <Route path="/diseases/metabolic-crisis">
        {() => <ProtectedRoute component={MetabolicCrisisPage} />}
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
      <Route path="/admin/activity-logs">
        {() => <ProtectedRoute component={ActivityLogsPage} adminOnly />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppInner() {
  return (
    <SidebarProvider>
      <ProtocolsProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "") }>
          <Router />
        </WouterRouter>
      </ProtocolsProvider>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppInner />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

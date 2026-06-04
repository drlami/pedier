import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { PWAUpdater } from "@/components/pwa-updater";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { ProtocolsProvider } from "@/contexts/protocols-context";
import { PinnedItemsProvider } from "@/contexts/pinned-items-context";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";
import HomePage from "@/pages/home";
import ERDashboard from "@/pages/er-dashboard";
import LandingPage from "@/pages/landing";
import WardDashboard from "@/pages/ward-dashboard";
import PICUDashboard from "@/pages/picu-dashboard";
import NICUDashboard from "@/pages/nicu-dashboard";
import NeonatalToolsPage from "@/pages/neonatal-tools";
import NicuDrugsPage from "@/pages/nicu-drugs";
import DiseasePage from "@/pages/disease";
import SummaryPage from "@/pages/summary";
import CardiacArrestPage from "@/pages/cardiac-arrest";
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
import SuspensionCalculatorPage from "@/pages/suspension-calculator";
import GestationalAgePage from "@/pages/gestational-age";
import EosRiskPage from "@/pages/eos-risk";
import NrpTimerPage from "@/pages/nrp-timer";
import TpnCalculatorPage from "@/pages/tpn-calculator";
import FentonChartsPage from "@/pages/fenton-charts";
import NutritionalRecoveryPage from "@/pages/nutritional-recovery";
import DkaTransitionPage from "@/pages/dka-insulin-transition";
import TaperingCalculatorPage from "@/pages/tapering-calculator";
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
    <div className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
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
  if (isLoading) return null;
  if (user) return <Redirect to="/" />;
  return <LoginPage />;
}

function WelcomeRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Redirect to="/login" />;
  return <WelcomePage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginRoute} />
      <Route path="/welcome" component={WelcomeRoute} />
      
      {/* Portal Routes */}
      <Route path="/er" component={() => <ProtectedRoute component={ERDashboard} />} />
      <Route path="/ward" component={() => <ProtectedRoute component={WardDashboard} />} />
      <Route path="/picu" component={() => <ProtectedRoute component={PICUDashboard} />} />
      <Route path="/nicu/drugs" component={() => <ProtectedRoute component={NicuDrugsPage} />} />
      <Route path="/nicu" component={() => <ProtectedRoute component={NICUDashboard} />} />

      {/* Specific Routes first */}
      <Route path="/cardiac-arrest" component={() => <ProtectedRoute component={CardiacArrestPage} />} />
      <Route path="/drug-doses" component={() => <ProtectedRoute component={DrugDosesPage} />} />
      
      <Route path="/calculators/resuscitation-doses" component={() => <ProtectedRoute component={ResuscitationDosesPage} />} />
      <Route path="/calculators/advanced-fluids" component={() => <ProtectedRoute component={AdvancedFluidsPage} />} />
      <Route path="/calculators/gfr" component={() => <ProtectedRoute component={GfrCalculatorPage} />} />
      <Route path="/calculators/parkland" component={() => <ProtectedRoute component={ParklandCalculatorPage} />} />
      <Route path="/calculators/gcs" component={() => <ProtectedRoute component={GcsCalculatorPage} />} />
      <Route path="/calculators/sodium-correction" component={() => <ProtectedRoute component={SodiumCorrectionPage} />} />
      <Route path="/calculators/kocher-criteria" component={() => <ProtectedRoute component={KocherCriteriaPage} />} />
      <Route path="/calculators/anion-gap" component={() => <ProtectedRoute component={AnionGapPage} />} />
      <Route path="/calculators/abg-interpreter" component={() => <ProtectedRoute component={AbgInterpreterPage} />} />
      <Route path="/calculators/apgar" component={() => <ProtectedRoute component={ApgarScorePage} />} />
      <Route path="/calculators/child-pugh" component={() => <ProtectedRoute component={ChildPughCalculatorPage} />} />
      <Route path="/calculators/bsa" component={() => <ProtectedRoute component={BsaCalculatorPage} />} />
      <Route path="/calculators/qtc" component={() => <ProtectedRoute component={QtcCalculatorPage} />} />
      <Route path="/calculators/calcium-correction" component={() => <ProtectedRoute component={CalciumCorrectionPage} />} />
      <Route path="/calculators/growth-charts" component={() => <ProtectedRoute component={GrowthChartsPage} />} />
      <Route path="/calculators/bp-percentiles" component={() => <ProtectedRoute component={BpPercentilesPage} />} />
      <Route path="/calculators/hyperbilirubinemia" component={() => <ProtectedRoute component={HyperbilirubinemiaCal} />} />
      <Route path="/calculators/oxygenation-index" component={() => <ProtectedRoute component={OxygenationIndexPage} />} />
      <Route path="/calculators/map-calculator" component={() => <ProtectedRoute component={MapCalculatorPage} />} />
      <Route path="/calculators/ett-depth" component={() => <ProtectedRoute component={EttDepthPage} />} />
      <Route path="/calculators/uac-uvc-length" component={() => <ProtectedRoute component={UacUvcLengthPage} />} />
      <Route path="/calculators/weight-loss" component={() => <ProtectedRoute component={WeightLossPage} />} />
      <Route path="/calculators/ballard-score" component={() => <ProtectedRoute component={BallardScorePage} />} />
      <Route path="/calculators/gestational-age" component={() => <ProtectedRoute component={GestationalAgePage} />} />
      <Route path="/calculators/suspension-dosing" component={() => <ProtectedRoute component={SuspensionCalculatorPage} />} />
      <Route path="/calculators/eos-risk" component={() => <ProtectedRoute component={EosRiskPage} />} />
      <Route path="/calculators/nrp-timer" component={() => <ProtectedRoute component={NrpTimerPage} />} />
      <Route path="/calculators/tpn-calculator" component={() => <ProtectedRoute component={TpnCalculatorPage} />} />
      <Route path="/calculators/fenton-charts" component={() => <ProtectedRoute component={FentonChartsPage} />} />
      <Route path="/calculators/dka-transition" component={() => <ProtectedRoute component={DkaTransitionPage} />} />
      <Route path="/calculators/tapering-calculator" component={() => <ProtectedRoute component={TaperingCalculatorPage} />} />
      <Route path="/calculators/nutritional-recovery" component={() => <ProtectedRoute component={NutritionalRecoveryPage} />} />
      <Route path="/calculators" component={() => <ProtectedRoute component={CalculatorsPage} />} />

      <Route path="/neonatology/hyperbilirubinemia" component={() => <ProtectedRoute component={HyperbilirubinemiaCal} />} />
      
      <Route path="/diseases/metabolic-crisis" component={() => <ProtectedRoute component={MetabolicCrisisPage} />} />
      <Route path="/diseases/:diseaseId/summary" component={() => <ProtectedRoute component={SummaryPage} />} />
      <Route path="/diseases/:diseaseId" component={() => <ProtectedRoute component={DiseasePage} />} />
      
      <Route path="/admin/protocols/:protocolId" component={() => <ProtectedRoute component={ProtocolEditorPage} adminOnly />} />
      <Route path="/admin/protocols" component={() => <ProtectedRoute component={ProtocolListPage} adminOnly />} />
      <Route path="/admin/users" component={() => <ProtectedRoute component={UsersPage} adminOnly />} />
      <Route path="/admin/activity-logs" component={() => <ProtectedRoute component={ActivityLogsPage} adminOnly />} />
      <Route path="/admin" component={() => <ProtectedRoute component={AdminPage} adminOnly />} />
      
      <Route path="/" component={() => <ProtectedRoute component={LandingPage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PWAUpdater />
          <SidebarProvider>
            <ProtocolsProvider>
              <PinnedItemsProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                  <Router />
                </WouterRouter>
              </PinnedItemsProvider>
            </ProtocolsProvider>
          </SidebarProvider>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

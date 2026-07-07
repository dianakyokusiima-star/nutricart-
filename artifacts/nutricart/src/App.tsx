import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useAuth } from "@workspace/replit-auth-web";

import Login from "@/pages/login";
import Shell from "@/components/layout/Shell";
import Dashboard from "@/pages/dashboard";
import MedicationsList from "@/pages/medications/list";
import MedicationPrices from "@/pages/medications/prices";
import Interactions from "@/pages/interactions";
import Prices from "@/pages/prices";
import Savings from "@/pages/savings";
import Reminders from "@/pages/reminders";
import Recommendations from "@/pages/recommendations";
import Profile from "@/pages/profile";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/medications" component={MedicationsList} />
        <Route path="/medications/:id/prices" component={MedicationPrices} />
        <Route path="/interactions" component={Interactions} />
        <Route path="/prices" component={Prices} />
        <Route path="/savings" component={Savings} />
        <Route path="/reminders" component={Reminders} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function Main() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-[#F3F7F5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[#114C3E] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <ProtectedRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Main />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

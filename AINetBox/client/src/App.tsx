import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ToolDetails from "@/pages/ToolDetails";
import { ToolsProvider } from "./context/ToolsContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tools/:id" component={ToolDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToolsProvider>
        <Router />
        <Toaster />
      </ToolsProvider>
    </QueryClientProvider>
  );
}

export default App;

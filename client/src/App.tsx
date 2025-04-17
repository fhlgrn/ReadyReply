import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import EmailFilters from "@/pages/EmailFilters";
import ResponseTemplates from "@/pages/ResponseTemplates";
import ProcessingLogs from "@/pages/ProcessingLogs";
import Settings from "@/pages/Settings";
import GmailCallback from "@/pages/GmailCallback";
import { Sidebar } from "@/components/Sidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/filters" component={EmailFilters} />
      <Route path="/templates" component={ResponseTemplates} />
      <Route path="/logs" component={ProcessingLogs} />
      <Route path="/settings" component={Settings} />
      <Route path="/auth/gmail/callback" component={GmailCallback} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col md:flex-row bg-neutral-100">
        <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="md:hidden mb-4 flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1 rounded-md hover:bg-neutral-200"
              >
                <span className="material-icons">menu</span>
              </button>
              <span className="ml-2 text-lg font-medium">ReadyReply</span>
            </div>
            
            <Router />
          </div>
        </main>
      </div>
      <Toaster />
      
      {/* Include Material Icons */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </QueryClientProvider>
  );
}

export default App;

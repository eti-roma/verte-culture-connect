
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

// Composant Route privée
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let unsub: any;
    (async () => {
      // Place listener *before* checking session, important!
      unsub = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuth(!!session?.user);
        setChecking(false);
      }).data?.subscription;
      // Initial session check
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuth(!!session?.user);
      setChecking(false);
    })();
    return () => {
      if (unsub) unsub.unsubscribe();
    };
  }, []);

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center bg-muted/20"><span>Vérification...</span></div>;
  }
  if (!isAuth) return <Navigate to="/auth" state={{ from: location }} replace />;
  return <>{children}</>;
};

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Listener comme précisé dans les best practices
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
    // Premier check de session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            {/* Protection de la racine : tout l’app sauf /auth requiert connection */}
            <Route path="/" element={
              <PrivateRoute>
                <Index user={user} session={session} />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

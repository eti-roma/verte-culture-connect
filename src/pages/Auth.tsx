
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const mode = searchParams.get('mode');

  // Rediriger si déjà connecté
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  // Gestion du mode reset password
  useEffect(() => {
    if (mode === 'reset') {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ data, error }) => {
          if (error) {
            console.error("Reset password error:", error);
          } else if (data.session) {
            console.log("Reset password success");
            navigate("/", { replace: true });
          }
        });
      } else {
        console.error("Invalid reset link");
      }
    }
  }, [mode, searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/", { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        console.log("Inscription réussie - Vérifiez votre email");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Auth error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 transition-colors duration-300 relative px-4">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-card shadow-lg rounded-lg p-8 w-full space-y-6 border border-border">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? "Connexion" : "Inscription"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin ? "Connectez-vous à votre compte" : "Créez votre compte"}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                disabled={loading}
                required
              />
            </div>
          </div>
          
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
            type="submit" 
            disabled={loading || !email || !password}
            size="lg"
          >
            {loading ? "Chargement..." : (isLogin ? "Se connecter" : "S'inscrire")}
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80 font-medium underline transition-colors"
              disabled={loading}
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;

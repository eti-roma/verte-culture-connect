
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
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
            toast({
              title: "Erreur",
              description: "Lien de réinitialisation invalide ou expiré.",
              variant: "destructive"
            });
          } else if (data.session) {
            toast({
              title: "Connexion réussie",
              description: "Vous pouvez maintenant changer votre mot de passe dans les paramètres.",
            });
            navigate("/", { replace: true });
          }
        });
      } else {
        toast({
          title: "Lien invalide",
          description: "Le lien de réinitialisation est invalide ou expiré.",
          variant: "destructive"
        });
      }
    }
  }, [mode, searchParams, navigate, toast]);

  const handleAuthSuccess = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <AuthForm 
        isLogin={isLogin} 
        setIsLogin={setIsLogin} 
        onSuccess={handleAuthSuccess} 
      />
    </div>
  );
};

export default Auth;

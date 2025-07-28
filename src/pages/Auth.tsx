
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
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

  const handleAuthSuccess = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 transition-colors duration-300 relative px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-lg transition-all duration-300 transform hover:scale-[1.02]">
        <AuthForm 
          isLogin={isLogin} 
          setIsLogin={setIsLogin} 
          onSuccess={handleAuthSuccess} 
        />
      </div>
    </div>
  );
};

export default Auth;

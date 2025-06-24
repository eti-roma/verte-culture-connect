
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Gestion du mode reset
  const mode = searchParams.get('mode');

  // Rediriger si déjà connecté
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });
  }, [navigate]);

  // Gestion du mode reset password
  useEffect(() => {
    if (mode === 'reset') {
      // L'utilisateur arrive depuis un lien de reset
      // On peut afficher un message ou rediriger vers un formulaire spécifique
      console.log("Mode reset détecté");
    }
  }, [mode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} onSuccess={() => navigate("/")} />
    </div>
  );
};

export default Auth;

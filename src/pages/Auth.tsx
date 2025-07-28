
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NewAuthForm from "@/components/auth/NewAuthForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const mode = searchParams.get('mode');

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

  const handleSuccess = () => {
    navigate("/", { replace: true });
  };

  return (
    <NewAuthForm
      isLogin={isLogin}
      setIsLogin={setIsLogin}
      onSuccess={handleSuccess}
    />
  );
};

export default Auth;

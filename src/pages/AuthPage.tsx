
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  
  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);
  
  const handleSuccess = () => {
    navigate(redirect);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
            {isLogin ? (
              <LoginForm 
                onSuccess={handleSuccess}
                onSwitch={() => setIsLogin(false)}
              />
            ) : (
              <RegisterForm 
                onSuccess={() => setIsLogin(true)}
                onSwitch={() => setIsLogin(true)}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthPage;

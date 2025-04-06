
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Github } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  
  // Redirecionar se já estiver autenticado
  if (currentUser && !loading) {
    return <Navigate to="/admin" replace />;
  }
  
  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await login();
      navigate('/admin');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setIsLoggingIn(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-black">
        <div className="tech-container p-8 text-center">
          <Loader2 className="w-10 h-10 text-neon-green animate-spin mx-auto mb-4" />
          <p className="text-neon-green/70 font-mono">Verificando credenciais de acesso...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-black relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-20 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute inset-0 bg-glow-green opacity-10 z-0"></div>
      </div>
      
      <div className="container max-w-md mx-auto px-4 relative z-10">
        <div className="tech-container p-10 animate-fade-in">
          <div className="mb-8 text-center">
            <div className="text-neon-green text-4xl font-display font-bold mb-3 text-glow">&lt;BVS/&gt;</div>
            <h1 className="text-2xl font-display font-semibold text-foreground mb-2">ACESSO RESTRITO</h1>
            <div className="h-1 w-20 bg-neon-green/50 mx-auto rounded-full mb-4"></div>
            <p className="text-foreground/70 font-mono text-sm">
              Você está tentando acessar a matriz principal. <br/>
              Autenticação necessária.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="terminal-text font-mono text-neon-green/80 bg-cyber-black border border-neon-green/30 p-4 text-sm mb-6">
              <div className="mb-1">$ connecting_to_mainframe...</div>
              <div className="mb-1">$ auth_required: true</div>
              <div className="mb-1">$ protocol: oauth2</div>
              <div>$ awaiting_authentication...</div>
            </div>
          </div>
          
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="cyber-button w-full py-3 flex items-center justify-center gap-3 group"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <Github className="w-5 h-5 group-hover:animate-pulse" />
                <span>Entrar com Google</span>
              </>
            )}
          </button>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-foreground/60 hover:text-neon-green text-sm font-mono">
              Retornar para área pública
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

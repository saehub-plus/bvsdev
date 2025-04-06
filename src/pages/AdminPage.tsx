
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { AlertCircle, Check, X } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulando autenticação - aqui você integraria com Firebase Auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verificação mock - substitua pela verificação do Firebase
      if (formData.email === 'admin@example.com' && formData.password === 'password') {
        setIsAuthenticated(true);
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      setError('Ocorreu um erro durante a autenticação. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  
  return (
    <Layout>
      <div className="min-h-screen py-16 bg-cyber-black">
        <div className="container mx-auto px-4">
          {!isAuthenticated ? (
            <LoginForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleLogin}
              error={error}
              isLoading={isLoading}
            />
          ) : (
            <AdminDashboard onLogout={handleLogout} />
          )}
        </div>
      </div>
    </Layout>
  );
};

interface LoginFormProps {
  formData: LoginFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  formData, 
  onInputChange, 
  onSubmit, 
  error, 
  isLoading 
}) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-display text-neon-green mb-2">Portal Admin</h1>
        <p className="text-foreground/60">Faça login para gerenciar seus projetos</p>
      </div>
      
      <div className="tech-container">
        <div className="terminal-header border-b border-neon-green/30 mb-6 pb-2 flex items-center">
          <div className="w-3 h-3 rounded-full bg-neon-green/70 mr-2"></div>
          <div className="font-mono text-neon-green/70 text-sm">login.js</div>
        </div>
        
        <form onSubmit={onSubmit}>
          {error && (
            <div className="mb-6 p-3 border border-destructive/30 bg-destructive/10 rounded flex items-start">
              <AlertCircle size={16} className="text-destructive mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-foreground/70 mb-2 font-mono text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className="w-full bg-cyber-black border border-neon-green/30 rounded p-3 text-foreground font-mono focus:outline-none focus:border-neon-green focus:shadow-[0_0_5px_rgba(0,255,65,0.3)]"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-foreground/70 mb-2 font-mono text-sm">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              className="w-full bg-cyber-black border border-neon-green/30 rounded p-3 text-foreground font-mono focus:outline-none focus:border-neon-green focus:shadow-[0_0_5px_rgba(0,255,65,0.3)]"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full cyber-button py-3 flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-neon-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-foreground/50">
          <p>Login de teste: admin@example.com / password</p>
        </div>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  // Aqui você implementaria a lógica de gerenciamento de projetos
  // Por enquanto, vamos apenas exibir uma interface simples
  
  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-display text-neon-green">Dashboard Admin</h1>
        <button 
          onClick={onLogout}
          className="cyber-button"
        >
          Sair
        </button>
      </div>
      
      <div className="tech-container mb-8">
        <div className="terminal-header border-b border-neon-green/30 mb-6 pb-2 flex items-center">
          <div className="w-3 h-3 rounded-full bg-neon-green/70 mr-2"></div>
          <div className="font-mono text-neon-green/70 text-sm">dashboard.js</div>
        </div>
        
        <div className="text-center py-12">
          <p className="text-foreground/70 mb-6">
            Esta é a área administrativa para gerenciar seus projetos.
            <br />
            Aqui você poderá adicionar, editar e remover projetos do seu portfólio.
          </p>
          <p className="text-foreground/50 text-sm">
            A integração com Firebase será implementada na próxima versão.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

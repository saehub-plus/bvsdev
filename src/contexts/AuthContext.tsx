
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, User, onAuthStateChanged, signInWithEmail, signOut, AuthError } from '../lib/firebase';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  isHackerMode: boolean;
  setIsHackerMode: (mode: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  authError: null,
  setAuthError: () => {},
  isHackerMode: false,
  setIsHackerMode: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isHackerMode, setIsHackerMode] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  const login = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmail(email, password);
      setAuthError(null);
      toast({
        title: "Autenticação bem-sucedida",
        description: "Você está conectado à matriz principal.",
        variant: "default",
      });
    } catch (error) {
      const authError = error as AuthError;
      
      if (authError.code === 'auth/user-not-found') {
        setIsHackerMode(true);
        setAuthError("ALERTA: TENTATIVA DE ACESSO NÃO AUTORIZADA DETECTADA!");
        toast({
          title: "ALERTA DE SEGURANÇA",
          description: "Usuário não autorizado detectado! Sistema de proteção ativado.",
          variant: "destructive",
        });
      } else if (authError.code === 'auth/wrong-password') {
        setAuthError("Senha incorreta. Tente novamente.");
        toast({
          title: "Falha na autenticação",
          description: "Senha incorreta. Tente novamente.",
          variant: "destructive",
        });
      } else {
        setAuthError("Erro ao autenticar. Tente novamente.");
        toast({
          title: "Falha na autenticação",
          description: "Não foi possível conectar-se à matriz. Tente novamente.",
          variant: "destructive",
        });
      }
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Desconexão completa",
        description: "Você foi desconectado com segurança.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro ao desconectar",
        description: "Ocorreu um problema ao tentar se desconectar.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAuthenticated: !!currentUser,
    authError,
    setAuthError,
    isHackerMode,
    setIsHackerMode,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

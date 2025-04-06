
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, User, onAuthStateChanged, signInWithGoogle, signOut } from '../lib/firebase';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  const login = async (): Promise<void> => {
    try {
      await signInWithGoogle();
      toast({
        title: "Autenticação bem-sucedida",
        description: "Você está conectado à matriz principal.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Falha na autenticação",
        description: "Não foi possível conectar-se à matriz. Tente novamente.",
        variant: "destructive",
      });
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
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

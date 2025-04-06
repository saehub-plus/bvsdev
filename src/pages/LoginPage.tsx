
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Shield, Mail, Lock, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login, currentUser, loading, authError, isHackerMode, setIsHackerMode } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  
  // Reset hacker mode on component mount
  useEffect(() => {
    setIsHackerMode(false);
  }, [setIsHackerMode]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Redirecionar se já estiver autenticado
  if (currentUser && !loading) {
    return <Navigate to="/admin" replace />;
  }
  
  const onSubmit = async (values: LoginFormValues) => {
    if (isHackerMode) return;
    
    try {
      setIsLoggingIn(true);
      await login(values.email, values.password);
      navigate('/admin');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    } finally {
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
    <div className={`min-h-screen flex items-center justify-center ${isHackerMode ? 'bg-black' : 'bg-cyber-black'} relative overflow-hidden`}>
      {/* Background effect */}
      {!isHackerMode ? (
        <>
          <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-20 z-0"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute inset-0 bg-glow-green opacity-10 z-0"></div>
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-20 z-0 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute inset-0 bg-red-500/20 opacity-30 z-0 animate-pulse"></div>
          </div>
        </>
      )}
      
      <div className="container max-w-md mx-auto px-4 relative z-10">
        {!isHackerMode ? (
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
                <div className="mb-1">$ protocol: secure_login</div>
                <div>$ awaiting_authentication...</div>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-mono">E-mail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neon-green/70" />
                          <Input
                            {...field}
                            type="email"
                            className="pl-10 bg-cyber-dark border-neon-green/30 focus:border-neon-green"
                            placeholder="usuario@dominio.com"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-mono">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neon-green/70" />
                          <Input
                            {...field}
                            type="password"
                            className="pl-10 bg-cyber-dark border-neon-green/30 focus:border-neon-green"
                            placeholder="Sua senha secreta"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                
                {authError && !isHackerMode && (
                  <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-md text-red-300 text-sm font-mono">
                    {authError}
                  </div>
                )}
                
                <Button 
                  type="submit"
                  className="cyber-button w-full py-3 flex items-center justify-center gap-3 group"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 group-hover:animate-pulse" />
                      <span>Acessar Sistema</span>
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <a href="/" className="text-foreground/60 hover:text-neon-green text-sm font-mono">
                Retornar para área pública
              </a>
            </div>
          </div>
        ) : (
          <div className="tech-container border-red-500/50 p-10 animate-fade-in bg-black/80">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-24 h-24 text-red-500 animate-pulse" />
              </div>
              
              <div className="glitch-text text-red-500 text-4xl font-display font-bold mb-6 animate-pulse">
                ALERTA DE SEGURANÇA
              </div>
              
              <div className="w-full h-1 bg-red-500/50 mx-auto mb-8 rounded-full"></div>
              
              <div className="p-6 border border-red-500/50 bg-black/40 mb-8">
                <p className="text-red-400 font-mono text-xl font-bold mb-4 animate-[glitch_0.3s_infinite]">
                  TENTATIVA DE ACESSO NÃO AUTORIZADA DETECTADA!
                </p>
                <p className="text-red-300/80 font-mono text-sm mb-4">
                  SISTEMA BLOQUEADO PARA SUA PRÓPRIA PROTEÇÃO
                </p>
                <p className="text-red-300/60 font-mono text-xs">
                  IP registrado. Incidente reportado às autoridades.
                </p>
                <div className="terminal-text text-red-400/80 bg-black border border-red-500/30 p-4 text-sm mt-6">
                  <div className="mb-1">$ security_breach_detected</div>
                  <div className="mb-1">$ initiating_lockdown_protocol</div>
                  <div className="mb-1">$ countermeasures_activated</div>
                  <div>$ contact_administrator_immediately</div>
                </div>
              </div>
              
              <Button 
                type="button"
                onClick={() => window.location.reload()}
                className="bg-red-900/40 hover:bg-red-800/60 border border-red-500/50 text-red-200 py-3 px-6 font-mono"
              >
                REINICIAR SISTEMA
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

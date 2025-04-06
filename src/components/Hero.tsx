
import React, { useEffect, useRef } from 'react';
import { ArrowDown, Terminal } from 'lucide-react';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const columns = canvas.width / 20;
    const drops: number[] = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    
    const draw = () => {
      ctx.fillStyle = 'rgba(8, 8, 8, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00FF41';
      ctx.font = '15px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * 20, drops[i] * 20);
        
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-30" />
      
      <div className="container mx-auto px-4 z-10 hero-content-wrapper">
        <div className="flex flex-col items-center text-center">
          <Terminal className="text-neon-green mb-6 w-16 h-16" />
          <h1 className="font-display uppercase font-bold tracking-wider hero-title mb-4">
            BVS Developments
          </h1>
          <h2 className="font-mono text-foreground/80 max-w-xl mb-8">
            <span className="terminal-text inline-block animate-typing">Criando experiências digitais de alto impacto {"> "}</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={scrollToProjects}
              className="cyber-button flex items-center justify-center gap-2 animate-pulse-neon"
            >
              Ver Projetos
              <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="text-neon-green/70" />
      </div>
    </div>
  );
};

export default Hero;

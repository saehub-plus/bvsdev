
import React from 'react';
import { Code, Zap, Monitor, Github, Instagram, Linkedin } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-tech-pattern bg-[length:30px_30px] opacity-10 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display uppercase mb-4 text-glow text-neon-green">
            Sobre Mim
          </h2>
          <div className="h-1 w-20 bg-neon-green/50 mx-auto rounded-full"></div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative group">
              {/* Animated scanner effect */}
              <div className="absolute inset-0 overflow-hidden rounded-full z-10 pointer-events-none">
                <div className="absolute left-0 top-0 w-full h-5 bg-gradient-to-b from-neon-green/20 to-transparent animate-[scan_3s_ease-in-out_infinite]"></div>
              </div>
              
              {/* Pulsing glow ring */}
              <div className="absolute -inset-2 rounded-full border-2 border-neon-green/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 rounded-full border border-neon-green/30 animate-pulse-neon"></div>
              
              {/* Main image container */}
              <div className="w-72 h-72 rounded-full overflow-hidden border-2 border-neon-green/50 shadow-[0_0_25px_rgba(0,255,65,0.4)] transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(0,255,65,0.6)]">
                <img 
                  src="/lovable-uploads/40b0c7cb-4325-4b11-81e7-a8f74ffd9221.png" 
                  alt="BVS Developer" 
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Social media icons - now always visible */}
              <div className="social-links absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-500">
                <div className="relative w-full h-full">
                  <a 
                    href="https://github.com/bruvini" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-5 left-1/2 -translate-x-1/2 bg-cyber-black/80 p-2 rounded-full border border-neon-green/50 shadow-[0_0_10px_rgba(0,255,65,0.3)] hover:shadow-[0_0_15px_rgba(0,255,65,0.5)] transition-all duration-300 tooltip hover:scale-110"
                    data-tooltip="GitHub"
                  >
                    <Github className="w-6 h-6 text-neon-green" />
                    <span className="tooltip-text">GitHub</span>
                  </a>
                  
                  <a 
                    href="https://www.instagram.com/bruvini/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="absolute top-1/2 -right-5 -translate-y-1/2 bg-cyber-black/80 p-2 rounded-full border border-neon-green/50 shadow-[0_0_10px_rgba(0,255,65,0.3)] hover:shadow-[0_0_15px_rgba(0,255,65,0.5)] transition-all duration-300 tooltip hover:scale-110"
                    data-tooltip="Instagram"
                  >
                    <Instagram className="w-6 h-6 text-neon-green" />
                    <span className="tooltip-text">Instagram</span>
                  </a>
                  
                  <a 
                    href="https://www.linkedin.com/in/enfbrunovinicius" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-cyber-black/80 p-2 rounded-full border border-neon-green/50 shadow-[0_0_10px_rgba(0,255,65,0.3)] hover:shadow-[0_0_15px_rgba(0,255,65,0.5)] transition-all duration-300 tooltip hover:scale-110"
                    data-tooltip="LinkedIn"
                  >
                    <Linkedin className="w-6 h-6 text-neon-green" />
                    <span className="tooltip-text">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 tech-container animate-fade-in">
            <div className="terminal-header border-b border-neon-green/30 mb-4 pb-2 flex items-center">
              <div className="w-3 h-3 rounded-full bg-neon-green/70 mr-2"></div>
              <div className="font-mono text-neon-green/70 text-sm">about.js</div>
            </div>
            
            <div className="font-mono space-y-4">
              <p className="text-foreground/90">
                <span className="text-neon-green">const</span> developer = {"{"}
              </p>
              <p className="pl-8">
                <span className="text-neon-blue">name:</span> <span className="text-foreground">"BVS Developments",</span>
              </p>
              <p className="pl-8">
                <span className="text-neon-blue">role:</span> <span className="text-foreground">"Desenvolvedor Full Stack",</span>
              </p>
              <p className="pl-8">
                <span className="text-neon-blue">bio:</span> <span className="text-foreground">"Sou enfermeiro e apaixonado por tecnologia. Transformo ideias em soluções digitais que facilitam o trabalho de profissionais de saúde, melhoram a qualidade do cuidado e ao mesmo tempo me permitem expressar minha criatividade como uma pessoa neurodivergente. Meus projetos refletem esse propósito: usar a tecnologia com empatia, inteligência e inovação.",</span>
              </p>
              <p className="pl-8">
                <span className="text-neon-blue">stack:</span> [<span className="text-foreground">"React", "Node.js", "Firebase"</span>],
              </p>
              <p className="pl-8">
                <span className="text-neon-blue">mission:</span> <span className="text-foreground">"Minha missão é construir soluções digitais que empoderem profissionais da saúde, simplifiquem processos e gerem impacto positivo na vida real — tudo isso com um olhar criativo e neurodivergente sobre o mundo."</span>
              </p>
              <p className="text-foreground/90">{"}"}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <SkillCard 
            icon={<Code className="w-10 h-10 text-neon-green" />}
            title="Desenvolvimento Web"
            description="Aplicações web modernas utilizando as melhores tecnologias do mercado para garantir performance e escalabilidade."
          />
          <SkillCard 
            icon={<Monitor className="w-10 h-10 text-neon-green" />}
            title="UI/UX Design"
            description="Interfaces intuitivas e visualmente atraentes, com foco na experiência do usuário e usabilidade."
          />
          <SkillCard 
            icon={<Zap className="w-10 h-10 text-neon-green" />}
            title="Inovação Técnica"
            description="Constantemente explorando novas tecnologias e métodos para criar soluções cada vez mais eficientes e criativas."
          />
        </div>
      </div>
    </section>
  );
};

interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ icon, title, description }) => {
  return (
    <div className="tech-container p-6 h-full flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] group">
      <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-display mb-3 text-neon-green group-hover:text-glow transition-all duration-300">
        {title}
      </h3>
      <p className="text-foreground/70 text-sm">
        {description}
      </p>
    </div>
  );
};

export default AboutSection;


import React, { useState } from 'react';
import { ExternalLink, Calendar, Code, X } from 'lucide-react';

// Tipo para os projetos
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  technologies: string[];
  link?: string;
}

// Dados de exemplo para os projetos
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Tech Store',
    description: 'Loja virtual completa com catálogo de produtos tecnológicos, sistema de carrinho, pagamentos e área do cliente.',
    image: '/placeholder.svg',
    date: '2023-10-15',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    link: 'https://example.com/project1'
  },
  {
    id: '2',
    title: 'Dashboard Analytics',
    description: 'Painel administrativo com visualizações de dados em tempo real, gráficos e relatórios customizáveis para análise de métricas.',
    image: '/placeholder.svg',
    date: '2023-08-22',
    technologies: ['Vue.js', 'Express', 'PostgreSQL', 'Chart.js'],
    link: 'https://example.com/project2'
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'Aplicativo de gerenciamento de tarefas com recursos de colaboração em equipe, notificações e acompanhamento de progresso.',
    image: '/placeholder.svg',
    date: '2023-06-10',
    technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
    link: 'https://example.com/project3'
  },
];

const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };
  
  const closeProjectDetails = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };
  
  return (
    <section id="projects" className="py-24 bg-cyber-dark relative">
      <div className="absolute inset-0 bg-tech-pattern bg-[length:30px_30px] opacity-10 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display uppercase mb-4 text-neon-green text-glow">
            Projetos
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Conheça alguns dos projetos mais recentes que desenvolvi, todos com foco em tecnologia, 
            usabilidade e design inovador.
          </p>
          <div className="h-1 w-20 bg-neon-green/50 mx-auto rounded-full mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => openProjectDetails(project)} 
            />
          ))}
        </div>
      </div>
      
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={closeProjectDetails}
        />
      )}
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div className="project-card-container group" onClick={onClick}>
      <div className="project-card tech-container h-full flex flex-col cursor-pointer">
        <div className="terminal-header border-b border-neon-green/30 mb-4 pb-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-neon-green/70 mr-2"></div>
            <div className="font-mono text-neon-green/70 text-sm truncate">
              {project.title.toLowerCase().replace(/\s+/g, '-')}.js
            </div>
          </div>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-neon-green/30"></div>
            <div className="w-3 h-3 rounded-full bg-neon-green/30"></div>
          </div>
        </div>
        
        <div className="relative aspect-video mb-4 overflow-hidden border border-neon-green/20">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/80 via-transparent to-transparent"></div>
        </div>
        
        <h3 className="text-xl font-display text-neon-green mb-2 group-hover:text-glow transition-all duration-300">
          {project.title}
        </h3>
        
        <p className="text-foreground/70 text-sm line-clamp-3 mb-4 flex-grow">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-1 rounded bg-neon-green/10 text-neon-green border border-neon-green/30 font-mono"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs px-2 py-1 rounded bg-neon-green/5 text-neon-green/70 border border-neon-green/20 font-mono">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
        
        <div className="mt-auto pt-3 border-t border-neon-green/20 flex justify-between items-center">
          <span className="text-xs text-foreground/50 font-mono flex items-center">
            <Calendar size={12} className="mr-1" />
            {new Date(project.date).toLocaleDateString()}
          </span>
          <button className="text-neon-green hover:text-glow text-sm font-mono">
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-black/90 backdrop-blur-sm animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      ></div>
      
      <div className="tech-container max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10 animate-fade-in">
        <div className="terminal-header border-b border-neon-green/30 mb-6 pb-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-neon-green/70 mr-2"></div>
            <div className="font-mono text-neon-green/70">
              {project.title.toLowerCase().replace(/\s+/g, '-')}.js
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-foreground/70 hover:text-neon-green transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="relative aspect-video mb-6 overflow-hidden border border-neon-green/20">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-display text-neon-green mb-4">
          {project.title}
        </h2>
        
        <div className="flex items-center mb-6 space-x-4">
          <div className="flex items-center text-foreground/70">
            <Calendar size={16} className="mr-2 text-neon-green/70" />
            <span>{new Date(project.date).toLocaleDateString()}</span>
          </div>
          
          {project.link && (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-neon-green hover:underline"
            >
              <ExternalLink size={16} className="mr-2" />
              <span>Ver projeto</span>
            </a>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-mono text-neon-green/80 mb-3 flex items-center">
            <Code size={18} className="mr-2" />
            Tecnologias
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span 
                key={index} 
                className="text-sm px-3 py-1 rounded-md bg-neon-green/10 text-neon-green border border-neon-green/30 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-mono text-neon-green/80 mb-3">
            Sobre o projeto
          </h3>
          <p className="text-foreground/80 leading-relaxed">
            {project.description}
          </p>
          <p className="text-foreground/80 leading-relaxed mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
            aliquam ultricies, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nisl.
            Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nisl.
          </p>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-neon-green/20">
          <button 
            onClick={onClose}
            className="cyber-button"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;

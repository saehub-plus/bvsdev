
import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar, Code, X, Loader2 } from 'lucide-react';
import { getProjects, Project } from '../lib/firebase';
import { useToast } from "@/hooks/use-toast";

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Falha na conexão com a matriz",
          description: "Não foi possível carregar os projetos. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [toast]);
  
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
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-neon-green animate-spin mb-4" />
            <p className="text-neon-green/70 font-mono text-center">Carregando matriz de projetos...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => openProjectDetails(project)} 
              />
            ))}
          </div>
        ) : (
          <div className="tech-container p-16 text-center animate-pulse">
            <div className="terminal-header border-b border-neon-green/30 mb-6 pb-2 flex items-center">
              <div className="w-3 h-3 rounded-full bg-neon-green/70 mr-2"></div>
              <div className="font-mono text-neon-green/70 text-sm">loading.js</div>
            </div>
            <p className="text-neon-green mb-4 font-display text-xl">Carregando universo de projetos...</p>
            <p className="text-foreground/70 italic">Os códigos ainda estão se conectando às estrelas.</p>
            <div className="mt-8 flex justify-center">
              <div className="w-16 h-16 border-t-2 border-r-2 border-neon-green/50 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
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
            src={project.imageUrl || "/placeholder.svg"} 
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
            {new Date(
              typeof project.date === 'string' ? project.date : project.date.toDate()
            ).toLocaleDateString()}
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
            src={project.imageUrl || "/placeholder.svg"} 
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
            <span>
              {new Date(
                typeof project.date === 'string' ? project.date : project.date.toDate()
              ).toLocaleDateString()}
            </span>
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
        </div>
        
        {project.pages && project.pages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-mono text-neon-green/80 mb-3">
              📄 Páginas do Projeto
            </h3>
            <div className="space-y-4">
              {project.pages.map((page, index) => (
                <div key={index} className="border border-neon-green/20 p-4 rounded-md bg-cyber-black/50">
                  <h4 className="text-neon-green/90 font-mono mb-2">{page.name}</h4>
                  <p className="text-foreground/70 text-sm mb-3">{page.features}</p>
                  {page.imageUrl && (
                    <div className="relative aspect-video overflow-hidden border border-neon-green/10 rounded">
                      <img 
                        src={page.imageUrl} 
                        alt={page.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
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

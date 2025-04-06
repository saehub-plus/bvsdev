
import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ProjectsSection from '../components/ProjectsSection';
import { ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />
      
      <AboutSection />
      
      <ProjectsSection />
      
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-green opacity-5 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display uppercase mb-6 text-neon-green text-glow">
              Vamos Trabalhar Juntos
            </h2>
            <p className="text-foreground/70 mb-10">
              Tem um projeto em mente? Estou sempre aberto a novas oportunidades e colaborações.
              Transforme sua ideia em realidade com soluções tecnológicas de ponta.
            </p>
            
            <a 
              href="https://wa.link/aeshrb" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cyber-button inline-flex items-center gap-2"
            >
              Entre em Contato
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

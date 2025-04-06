
import React from 'react';
import Layout from '../components/Layout';
import ProjectsSection from '../components/ProjectsSection';

const ProjectsPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <ProjectsSection />
      </div>
    </Layout>
  );
};

export default ProjectsPage;

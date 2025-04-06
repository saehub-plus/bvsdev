
import React from 'react';
import Layout from '../components/Layout';
import AboutSection from '../components/AboutSection';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <AboutSection />
      </div>
    </Layout>
  );
};

export default AboutPage;


import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Code } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen bg-cyber-black">
      <header className="sticky top-0 z-50 border-b border-neon-green/20 bg-cyber-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-neon-green text-xl font-display font-bold flex items-center">
            <span className="text-glow">&lt;BVS/&gt;</span>
            <span className="ml-2 text-foreground/80 hidden sm:inline">developments</span>
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" active={isActive('/')} icon={<Home size={18} />} label="Home" />
            <NavLink to="/about" active={isActive('/about')} icon={<User size={18} />} label="Sobre" />
            <NavLink to="/projects" active={isActive('/projects')} icon={<Code size={18} />} label="Projetos" />
          </nav>
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-foreground cyber-button !py-1 !px-3"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col space-y-4 p-4 bg-cyber-dark border-t border-neon-green/20">
              <MobileNavLink to="/" active={isActive('/')} icon={<Home size={18} />} label="Home" onClick={closeMenu} />
              <MobileNavLink to="/about" active={isActive('/about')} icon={<User size={18} />} label="Sobre" onClick={closeMenu} />
              <MobileNavLink to="/projects" active={isActive('/projects')} icon={<Code size={18} />} label="Projetos" onClick={closeMenu} />
            </nav>
          </div>
        )}
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="border-t border-neon-green/20 py-8 bg-cyber-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-neon-green font-display">&lt;BVS/&gt;</span>
              <span className="text-foreground/60 ml-2">developments © {new Date().getFullYear()}</span>
            </div>
            <div className="text-foreground/60 text-sm">
              <span>Designed & Developed with </span>
              <span className="text-neon-green">❤</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, active, icon }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 font-mono transition-all duration-300 hover:text-neon-green ${
        active ? 'text-neon-green text-glow' : 'text-foreground/80'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ to, label, active, icon, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 rounded ${
        active ? 'bg-neon-green/10 text-neon-green' : 'text-foreground/80'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Layout;

import React from 'react';
import { Monitor, Camera, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  activeView: 'dashboard' | 'scanner';
  setActiveView: (view: 'dashboard' | 'scanner') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            QC Vision
          </motion.h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          <NavButton 
            icon={<Monitor className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
          />
          <NavButton 
            icon={<Camera className="w-5 h-5" />} 
            label="Scanner" 
            active={activeView === 'scanner'} 
            onClick={() => setActiveView('scanner')} 
          />
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-slate-700 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div 
          className="md:hidden bg-slate-800 border-b border-slate-700"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            <MobileNavButton 
              icon={<Monitor className="w-5 h-5" />} 
              label="Dashboard" 
              active={activeView === 'dashboard'} 
              onClick={() => {
                setActiveView('dashboard');
                setMobileMenuOpen(false);
              }} 
            />
            <MobileNavButton 
              icon={<Camera className="w-5 h-5" />} 
              label="Scanner" 
              active={activeView === 'scanner'} 
              onClick={() => {
                setActiveView('scanner');
                setMobileMenuOpen(false);
              }} 
            />
          </div>
        </motion.div>
      )}
    </header>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
        active
          ? 'bg-blue-600 text-white'
          : 'hover:bg-slate-700 text-slate-300'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
};

const MobileNavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      className={`p-3 rounded-lg flex items-center space-x-3 transition-all w-full ${
        active
          ? 'bg-blue-600 text-white'
          : 'hover:bg-slate-700 text-slate-300'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default Header;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  Calendar, 
  Bell, 
  Settings,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const RuralSidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'vaccines', label: 'Vacinas', icon: Calendar },
    { id: 'alerts', label: 'Alertas', icon: Bell },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const mobileOverlayVariants = {
    open: { opacity: 1, visibility: 'visible' as const },
    closed: { opacity: 0, visibility: 'hidden' as const }
  };

  const mobileSidebarVariants = {
    open: { x: 0, scale: 1 },
    closed: { x: -320, scale: 0.9 }
  };

  return (
    <>
      {/* Mobile Trigger Button */}
      <Button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-amber-700 border border-amber-600 text-amber-50 hover:bg-amber-600"
        size="icon"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileOverlayVariants}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileSidebarVariants}
            className="md:hidden fixed left-0 top-0 h-full w-80 z-50"
          >
            <div className="h-full bg-gradient-to-b from-green-800 to-green-900 border-r border-green-700 shadow-xl wood-texture">
              {/* Mobile Header */}
              <div className="p-6 border-b border-green-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="/lovable-uploads/1a35f86c-f516-4b6c-9ee1-b3e42e26f758.png" 
                      alt="Morrinhos" 
                      className="h-10 w-10 object-contain"
                    />
                    <div>
                      <h1 className="text-xl font-bold text-amber-100">
                        Morrinhos
                      </h1>
                      <p className="text-sm text-green-200">Agropecuária</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsMobileOpen(false)}
                    variant="ghost"
                    size="icon"
                    className="text-amber-200 hover:text-amber-100 hover:bg-green-700/50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <nav className="p-4 space-y-2">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: index * 0.1 }
                      }}
                      onClick={() => {
                        onPageChange(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-amber-700 text-amber-50 shadow-md'
                          : 'text-green-100 hover:bg-green-700/50 hover:text-amber-100'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="hidden md:block fixed left-0 top-0 h-full z-30 bg-gradient-to-b from-green-800 to-green-900 border-r border-green-700 shadow-xl wood-texture"
      >
        {/* Header */}
        <div className="p-6 border-b border-green-700/50">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/1a35f86c-f516-4b6c-9ee1-b3e42e26f758.png" 
              alt="Morrinhos" 
              className="h-10 w-10 object-contain"
            />
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-xl font-bold text-amber-100">
                    Morrinhos
                  </h1>
                  <p className="text-sm text-green-200">Agropecuária</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.1 }
                }}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-700 text-amber-50 shadow-md'
                    : 'text-green-100 hover:bg-green-700/50 hover:text-amber-100'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isExpanded && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="ml-auto"
                    >
                      <ChevronRight className="h-4 w-4 text-green-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>
      </motion.div>
    </>
  );
};

export default RuralSidebar;

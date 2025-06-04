
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

const FuturisticSidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
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

  const itemVariants = {
    hover: { 
      scale: 1.05,
      x: 8,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: [0, 1, 0], 
      scale: [0.8, 1.2, 0.8],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {/* Mobile Trigger Button */}
      <Button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 transition-all duration-300"
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
            <div className="h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-cyan-500/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl">
              {/* Mobile Header */}
              <div className="p-6 border-b border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img 
                        src="/lovable-uploads/1a35f86c-f516-4b6c-9ee1-b3e42e26f758.png" 
                        alt="Morrinhos" 
                        className="h-10 w-10 object-contain"
                      />
                      <motion.div
                        variants={glowVariants}
                        initial="initial"
                        animate="animate"
                        className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm"
                      />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Morrinhos
                      </h1>
                      <p className="text-sm text-cyan-300/60">Agropecuária</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsMobileOpen(false)}
                    variant="ghost"
                    size="icon"
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
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
                      variants={itemVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => {
                        onPageChange(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/25'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-cyan-300 border border-transparent hover:border-cyan-500/20'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicatorMobile"
                          className="ml-auto w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                        />
                      )}
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
        className="hidden md:block fixed left-0 top-0 h-full z-30 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-cyan-500/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20" />
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-500/5 to-transparent bg-[length:200%_200%]"
          />
        </div>

        {/* Header */}
        <div className="relative p-6 border-b border-cyan-500/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/lovable-uploads/1a35f86c-f516-4b6c-9ee1-b3e42e26f758.png" 
                alt="Morrinhos" 
                className="h-10 w-10 object-contain"
              />
              <motion.div
                variants={glowVariants}
                initial="initial"
                animate="animate"
                className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm"
              />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Morrinhos
                  </h1>
                  <p className="text-sm text-cyan-300/60">Agropecuária</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative p-4 space-y-2">
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
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/25'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-cyan-300 border border-transparent hover:border-cyan-500/20'
                }`}
              >
                {/* Active item glow effect */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl"
                  />
                )}
                
                <IconComponent className="h-5 w-5 relative z-10" />
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="font-medium relative z-10"
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
                      className="ml-auto relative z-10"
                    >
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 relative z-10"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom Decoration */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-1/3 mt-0"
          />
        </div>
      </motion.div>
    </>
  );
};

export default FuturisticSidebar;


import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Calendar, 
  Bell, 
  Settings
} from 'lucide-react';

interface MobileNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const MobileNavigation = ({ currentPage, onPageChange }: MobileNavigationProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'vaccines', label: 'Vacinas', icon: Calendar },
    { id: 'alerts', label: 'Alertas', icon: Bell },
    { id: 'settings', label: 'Config', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-cyan-500/30 px-2 py-1">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-300 min-w-0 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate max-w-full">
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobileActiveIndicator"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;

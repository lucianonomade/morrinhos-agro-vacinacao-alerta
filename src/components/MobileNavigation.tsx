
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Calendar, 
  Bell, 
  Share2
} from 'lucide-react';

interface MobileNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const MobileNavigation = ({ currentPage, onPageChange }: MobileNavigationProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'vaccines', label: 'Vacinas', icon: Calendar },
    { id: 'alerts', label: 'Alertas', icon: Bell },
    { id: 'socialmedia', label: 'Social', icon: Share2 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-t border-green-200 px-1 py-2 subtle-texture shadow-xl safe-area-pb">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-300 min-h-[60px] min-w-[60px] ${
                isActive
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'text-green-600 hover:text-green-700 hover:bg-green-50/80'
              }`}
            >
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium leading-tight">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;

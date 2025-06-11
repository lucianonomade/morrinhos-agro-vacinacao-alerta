
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Calendar, 
  Bell, 
  Share2,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface RuralSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const RuralSidebar = ({ currentPage, onPageChange }: RuralSidebarProps) => {
  const { signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'vaccines', label: 'Vacinas', icon: Calendar },
    { id: 'alerts', label: 'Alertas', icon: Bell },
    { id: 'socialmedia', label: 'Social Media', icon: Share2 },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="hidden md:block fixed left-0 top-0 z-40 w-20 h-full bg-white/95 backdrop-blur-md border-r border-green-200 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-16 border-b border-green-200">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Calendar className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(item.id)}
                className={`w-full px-3 py-3 mx-2 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-green-600 hover:bg-green-50 hover:text-green-700'
                }`}
                title={item.label}
              >
                <div className="flex flex-col items-center">
                  <IconComponent className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>

                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              </motion.button>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="p-2 border-t border-green-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="w-full px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 group relative"
            title="Sair"
          >
            <div className="flex flex-col items-center">
              <LogOut className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">Sair</span>
            </div>

            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
              Sair
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default RuralSidebar;

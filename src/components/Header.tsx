
import { Calendar, Users, Bell, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header = ({ currentPage, onPageChange }: HeaderProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'vaccines', label: 'Vacinas', icon: Calendar },
    { id: 'alerts', label: 'Alertas', icon: Bell },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/1a35f86c-f516-4b6c-9ee1-b3e42e26f758.png" 
              alt="Morrinhos Agropecuária" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-green-800">Morrinhos</h1>
              <p className="text-sm text-gray-600">Agropecuária</p>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 ${
                    currentPage === item.id 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

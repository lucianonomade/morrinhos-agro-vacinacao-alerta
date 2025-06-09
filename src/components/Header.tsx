
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-green-200 px-3 py-2 md:px-4 md:py-3 md:ml-20 subtle-texture shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
          <h1 className="text-base sm:text-lg md:text-2xl font-bold text-green-700 truncate">
            Sistema de Vacinas
          </h1>
          <span className="hidden sm:block text-green-600 text-xs md:text-sm whitespace-nowrap">
            Controle de Vacinação Animal
          </span>
        </div>
        
        {user && (
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            <div className="hidden sm:flex items-center space-x-2 text-gray-700 min-w-0">
              <User className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="text-xs md:text-sm truncate max-w-24 md:max-w-32">
                {user.email}
              </span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-green-300 hover:border-green-400 text-green-700 hover:text-green-800 hover:bg-green-50 text-xs md:text-sm px-2 md:px-3 h-8 md:h-9"
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

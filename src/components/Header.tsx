
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
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-3 py-2 md:px-4 md:py-3 md:ml-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 md:space-x-4">
          <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Vacina
          </h1>
          <span className="hidden sm:block text-slate-400 text-xs md:text-sm">
            Sistema de Controle de Vacinação
          </span>
        </div>
        
        {user && (
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-slate-300">
              <User className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm truncate max-w-32 md:max-w-none">{user.email}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-slate-500 text-slate-300 hover:text-slate-200 text-xs md:text-sm px-2 md:px-3"
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

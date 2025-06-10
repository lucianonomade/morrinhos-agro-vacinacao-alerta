
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, User, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  whatsapp: string;
  created_at: string;
}

interface ClientFormProps {
  clients: Client[];
  onAddClient: (client: { name: string; whatsapp: string }) => Promise<void>;
  onDeleteClient: (clientId: string) => Promise<void>;
}

const ClientForm = ({ clients, onAddClient, onDeleteClient }: ClientFormProps) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !whatsapp.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onAddClient({
        name: name.trim(),
        whatsapp: whatsapp.trim(),
      });
      
      setName('');
      setWhatsapp('');
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${clientName}"?`)) {
      await onDeleteClient(clientId);
    }
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4 sm:mb-6">Clientes</h2>
      
      <Card className="agro-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-green-700 text-lg sm:text-xl">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Cadastrar Novo Cliente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 text-sm font-medium">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite o nome do cliente"
                  className="agro-input h-10 sm:h-11"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-gray-700 text-sm font-medium">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="agro-input h-10 sm:h-11"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full agro-button h-10 sm:h-11" disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="agro-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-green-700 text-lg sm:text-xl">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Clientes Cadastrados ({clients.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {clients.length > 0 ? (
            <div className="space-y-3">
              {clients.map((client) => (
                <div key={client.id} className="flex justify-between items-center p-3 sm:p-4 bg-green-50/50 rounded-lg border border-green-200">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{client.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{client.whatsapp}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Cadastrado em {new Date(client.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteClient(client.id, client.name)}
                    variant="destructive"
                    size="sm"
                    className="ml-2 h-8 w-8 p-0 flex-shrink-0"
                    title="Excluir cliente"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 text-sm sm:text-base">Nenhum cliente cadastrado ainda</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientForm;

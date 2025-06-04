
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, User } from 'lucide-react';
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
}

const ClientForm = ({ clients, onAddClient }: ClientFormProps) => {
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

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">Clientes</h2>
      
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-cyan-300">
            <Plus className="h-5 w-5" />
            <span>Cadastrar Novo Cliente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite o nome do cliente"
                  className="futuristic-input"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-slate-300">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="futuristic-input"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full futuristic-button" disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-cyan-300">
            <User className="h-5 w-5" />
            <span>Clientes Cadastrados ({clients.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length > 0 ? (
            <div className="space-y-3">
              {clients.map((client) => (
                <div key={client.id} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
                  <div>
                    <h3 className="font-medium text-slate-200">{client.name}</h3>
                    <p className="text-sm text-slate-400">{client.whatsapp}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      Cadastrado em {new Date(client.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">Nenhum cliente cadastrado ainda</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientForm;

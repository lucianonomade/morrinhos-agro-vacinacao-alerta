
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
  createdAt: string;
}

interface ClientFormProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
}

const ClientForm = ({ clients, onAddClient }: ClientFormProps) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !whatsapp.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      createdAt: new Date().toISOString(),
    };

    onAddClient(newClient);
    setName('');
    setWhatsapp('');
    
    toast({
      title: "Sucesso!",
      description: "Cliente cadastrado com sucesso",
    });
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
      <h2 className="text-3xl font-bold text-green-800 mb-6">Clientes</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Cadastrar Novo Cliente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite o nome do cliente"
                  className="border-green-200 focus:border-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="border-green-200 focus:border-green-500"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Cliente
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Clientes Cadastrados ({clients.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length > 0 ? (
            <div className="space-y-3">
              {clients.map((client) => (
                <div key={client.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                  <div>
                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.whatsapp}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Cadastrado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum cliente cadastrado ainda</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientForm;

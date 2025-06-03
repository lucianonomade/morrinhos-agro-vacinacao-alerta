
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Syringe } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  whatsapp: string;
}

interface Vaccine {
  id: string;
  clientId: string;
  clientName: string;
  clientWhatsapp: string;
  vaccineName: string;
  vaccinationDate: string;
  expiryDate: string;
  notes?: string;
}

interface VaccineFormProps {
  clients: Client[];
  vaccines: Vaccine[];
  onAddVaccine: (vaccine: Vaccine) => void;
}

const VaccineForm = ({ clients, vaccines, onAddVaccine }: VaccineFormProps) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [vaccinationDate, setVaccinationDate] = useState<Date>();
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId || !vaccineName.trim() || !vaccinationDate || !expiryDate) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const selectedClient = clients.find(c => c.id === selectedClientId);
    if (!selectedClient) {
      toast({
        title: "Erro",
        description: "Cliente não encontrado",
        variant: "destructive",
      });
      return;
    }

    const newVaccine: Vaccine = {
      id: Date.now().toString(),
      clientId: selectedClientId,
      clientName: selectedClient.name,
      clientWhatsapp: selectedClient.whatsapp,
      vaccineName: vaccineName.trim(),
      vaccinationDate: vaccinationDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      notes: notes.trim(),
    };

    onAddVaccine(newVaccine);
    setSelectedClientId('');
    setVaccineName('');
    setVaccinationDate(undefined);
    setExpiryDate(undefined);
    setNotes('');
    
    toast({
      title: "Sucesso!",
      description: "Vacina cadastrada com sucesso",
    });
  };

  const getVaccineStatus = (vaccine: Vaccine) => {
    const today = new Date();
    const expiryDate = new Date(vaccine.expiryDate);
    const daysDiff = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

    if (daysDiff < 0) return { status: 'expired', color: 'bg-red-100 border-red-200 text-red-800' };
    if (daysDiff <= 7) return { status: 'warning', color: 'bg-yellow-100 border-yellow-200 text-yellow-800' };
    return { status: 'valid', color: 'bg-green-100 border-green-200 text-green-800' };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Calendário de Vacinas</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Cadastrar Nova Vacina</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger className="border-green-200 focus:border-green-500">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.whatsapp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vaccineName">Nome da Vacina/Medicamento *</Label>
                <Input
                  id="vaccineName"
                  type="text"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  placeholder="Ex: Aftosa, Vermífugo, etc."
                  className="border-green-200 focus:border-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data da Vacinação *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-green-200",
                        !vaccinationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {vaccinationDate ? format(vaccinationDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={vaccinationDate}
                      onSelect={setVaccinationDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data de Vencimento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-green-200",
                        !expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações adicionais (opcional)"
                className="border-green-200 focus:border-green-500"
              />
            </div>
            
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Vacina
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Syringe className="h-5 w-5" />
            <span>Vacinas Cadastradas ({vaccines.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vaccines.length > 0 ? (
            <div className="space-y-3">
              {vaccines.map((vaccine) => {
                const status = getVaccineStatus(vaccine);
                return (
                  <div key={vaccine.id} className={`p-4 rounded-lg border ${status.color}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{vaccine.vaccineName}</h3>
                        <p className="text-sm text-gray-600">{vaccine.clientName}</p>
                        <p className="text-sm text-gray-600">{vaccine.clientWhatsapp}</p>
                        {vaccine.notes && (
                          <p className="text-sm text-gray-500 mt-1">{vaccine.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Aplicação: {new Date(vaccine.vaccinationDate).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm font-medium">
                          Vencimento: {new Date(vaccine.expiryDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhuma vacina cadastrada ainda</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VaccineForm;

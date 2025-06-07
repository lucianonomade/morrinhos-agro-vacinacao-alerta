
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
  created_at: string;
}

interface Vaccine {
  id: string;
  client_id: string;
  client_name: string;
  client_whatsapp: string;
  vaccine_name: string;
  vaccination_date: string;
  expiry_date: string;
  notes?: string;
}

interface VaccineFormProps {
  clients: Client[];
  vaccines: Vaccine[];
  onAddVaccine: (vaccine: Omit<Vaccine, 'id'>) => void;
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

    const newVaccine: Omit<Vaccine, 'id'> = {
      client_id: selectedClientId,
      client_name: selectedClient.name,
      client_whatsapp: selectedClient.whatsapp,
      vaccine_name: vaccineName.trim(),
      vaccination_date: vaccinationDate.toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      notes: notes.trim(),
    };

    onAddVaccine(newVaccine);
    setSelectedClientId('');
    setVaccineName('');
    setVaccinationDate(undefined);
    setExpiryDate(undefined);
    setNotes('');
  };

  const getVaccineStatus = (vaccine: Vaccine) => {
    const today = new Date();
    const expiryDate = new Date(vaccine.expiry_date);
    const daysDiff = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

    if (daysDiff < 0) return { status: 'expired', color: 'bg-red-100 border-red-200 text-red-800' };
    if (daysDiff <= 7) return { status: 'warning', color: 'bg-yellow-100 border-yellow-200 text-yellow-800' };
    return { status: 'valid', color: 'bg-green-100 border-green-200 text-green-800' };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">Calendário de Vacinas</h2>
      
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-cyan-300">
            <Plus className="h-5 w-5" />
            <span>Cadastrar Nova Vacina</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client" className="text-slate-300">Cliente *</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger className="border-cyan-500/20 focus:border-cyan-500 bg-slate-800/50">
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
                <Label htmlFor="vaccineName" className="text-slate-300">Nome da Vacina/Medicamento *</Label>
                <Input
                  id="vaccineName"
                  type="text"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  placeholder="Ex: Aftosa, Vermífugo, etc."
                  className="border-cyan-500/20 focus:border-cyan-500 bg-slate-800/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Data da Vacinação *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-cyan-500/20 bg-slate-800/50",
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
                <Label className="text-slate-300">Data de Vencimento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-cyan-500/20 bg-slate-800/50",
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
              <Label htmlFor="notes" className="text-slate-300">Observações</Label>
              <Input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações adicionais (opcional)"
                className="border-cyan-500/20 focus:border-cyan-500 bg-slate-800/50"
              />
            </div>
            
            <Button type="submit" className="w-full futuristic-button">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Vacina
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-cyan-300">
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
                  <div key={vaccine.id} className="p-4 rounded-lg border border-slate-600/50 bg-slate-800/30">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-200">{vaccine.vaccine_name}</h3>
                        <p className="text-sm text-slate-400">{vaccine.client_name}</p>
                        <p className="text-sm text-slate-400">{vaccine.client_whatsapp}</p>
                        {vaccine.notes && (
                          <p className="text-sm text-slate-500 mt-1">{vaccine.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-300">
                          Aplicação: {new Date(vaccine.vaccination_date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm font-medium text-slate-300">
                          Vencimento: {new Date(vaccine.expiry_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">Nenhuma vacina cadastrada ainda</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VaccineForm;

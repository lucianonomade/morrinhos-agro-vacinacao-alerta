
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
  dose_description?: string;
  vaccination_date: string;
  expiry_date: string;
  notes?: string;
}

interface VaccineFormProps {
  clients: Client[];
  vaccines: Vaccine[];
  onAddVaccine: (vaccine: Omit<Vaccine, 'id'>) => void;
  onDeleteVaccine: (vaccineId: string) => Promise<void>;
}

const VaccineForm = ({ clients, vaccines, onAddVaccine, onDeleteVaccine }: VaccineFormProps) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [doseDescription, setDoseDescription] = useState('');
  const [vaccinationDate, setVaccinationDate] = useState<Date>();
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [notes, setNotes] = useState('');

  const sendWebhookNotification = async (vaccineData: Omit<Vaccine, 'id'>) => {
    const webhookUrl = 'https://webhook.ls.app.br/webhook/0310fcd4-479a-44de-82df-d148bb79618d';
    
    const payload = {
      message: "Nova vacina cadastrada na Agropecuária Morrinhos",
      client_name: vaccineData.client_name,
      client_whatsapp: vaccineData.client_whatsapp,
      vaccine_name: vaccineData.vaccine_name,
      dose_description: vaccineData.dose_description || '',
      vaccination_date: vaccineData.vaccination_date,
      expiry_date: vaccineData.expiry_date,
      notes: vaccineData.notes || '',
      timestamp: new Date().toISOString(),
      action: "vaccine_registered"
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      console.log('Webhook enviado com sucesso para nova vacina');
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      dose_description: doseDescription.trim(),
      vaccination_date: vaccinationDate.toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      notes: notes.trim(),
    };

    // Enviar webhook antes de adicionar a vacina
    await sendWebhookNotification(newVaccine);

    onAddVaccine(newVaccine);
    setSelectedClientId('');
    setVaccineName('');
    setDoseDescription('');
    setVaccinationDate(undefined);
    setExpiryDate(undefined);
    setNotes('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4 sm:mb-6">Calendário de Vacinas</h2>
      
      <Card className="agro-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-green-700 text-lg sm:text-xl">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Cadastrar Nova Vacina</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client" className="text-gray-700 text-sm font-medium">Cliente *</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger className="agro-input h-10 sm:h-11">
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
                <Label htmlFor="vaccineName" className="text-gray-700 text-sm font-medium">Nome da Vacina/Medicamento *</Label>
                <Input
                  id="vaccineName"
                  type="text"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  placeholder="Ex: Aftosa, Vermífugo, etc."
                  className="agro-input h-10 sm:h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doseDescription" className="text-gray-700 text-sm font-medium">Dose/Descrição</Label>
              <Input
                id="doseDescription"
                type="text"
                value={doseDescription}
                onChange={(e) => setDoseDescription(e.target.value)}
                placeholder="Ex: 1ª dose, 2ª dose, dose de reforço, etc."
                className="agro-input h-10 sm:h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 text-sm font-medium">Data da Vacinação *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal agro-input h-10 sm:h-11",
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
                <Label className="text-gray-700 text-sm font-medium">Data de Vencimento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal agro-input h-10 sm:h-11",
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
              <Label htmlFor="notes" className="text-gray-700 text-sm font-medium">Observações</Label>
              <Input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações adicionais (opcional)"
                className="agro-input h-10 sm:h-11"
              />
            </div>
            
            <Button type="submit" className="w-full agro-button h-10 sm:h-11">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Vacina
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="agro-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-green-700 text-lg sm:text-xl">
            <Syringe className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Vacinas Cadastradas ({vaccines.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {vaccines.length > 0 ? (
            <div className="space-y-3">
              {vaccines.map((vaccine) => {
                return (
                  <div key={vaccine.id} className="p-3 sm:p-4 rounded-lg border border-green-200 bg-green-50/50 backdrop-blur-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">{vaccine.vaccine_name}</h3>
                        {vaccine.dose_description && (
                          <p className="text-xs sm:text-sm text-blue-600 font-medium">{vaccine.dose_description}</p>
                        )}
                        <p className="text-xs sm:text-sm text-gray-600">{vaccine.client_name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{vaccine.client_whatsapp}</p>
                        {vaccine.notes && (
                          <p className="text-xs sm:text-sm text-gray-700 mt-1">{vaccine.notes}</p>
                        )}
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          Aplicação: {new Date(vaccine.vaccination_date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          Vencimento: {new Date(vaccine.expiry_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 text-sm sm:text-base">Nenhuma vacina cadastrada ainda</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VaccineForm;

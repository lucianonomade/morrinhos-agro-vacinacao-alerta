
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, Calendar, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

interface AlertsPageProps {
  vaccines: Vaccine[];
}

const AlertsPage = ({ vaccines }: AlertsPageProps) => {
  const today = new Date();
  
  const getAlerts = () => {
    const alerts = vaccines.map(vaccine => {
      const expiryDate = new Date(vaccine.expiryDate);
      const daysDiff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      let priority = 'low';
      let status = 'Válida';
      let colorClass = 'border-green-200 bg-green-50';
      
      if (daysDiff < 0) {
        priority = 'critical';
        status = `Vencida há ${Math.abs(daysDiff)} dias`;
        colorClass = 'border-red-200 bg-red-50';
      } else if (daysDiff <= 3) {
        priority = 'high';
        status = `Vence em ${daysDiff} dias`;
        colorClass = 'border-red-200 bg-red-50';
      } else if (daysDiff <= 7) {
        priority = 'medium';
        status = `Vence em ${daysDiff} dias`;
        colorClass = 'border-yellow-200 bg-yellow-50';
      } else if (daysDiff <= 30) {
        priority = 'low';
        status = `Vence em ${daysDiff} dias`;
        colorClass = 'border-blue-200 bg-blue-50';
      }
      
      return {
        ...vaccine,
        priority,
        status,
        colorClass,
        daysDiff
      };
    });
    
    return alerts
      .filter(alert => alert.daysDiff <= 30 || alert.daysDiff < 0)
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      });
  };

  const alerts = getAlerts();

  const handleWhatsAppContact = (whatsapp: string, clientName: string, vaccineName: string, status: string) => {
    const cleanNumber = whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${clientName}! Este é um lembrete da Morrinhos Agropecuária sobre a vacina/medicamento: ${vaccineName}. Status: ${status}. Entre em contato conosco para reagendar.`
    );
    const whatsappUrl = `https://wa.me/55${cleanNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto",
      description: `Contato iniciado com ${clientName}`,
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <Clock className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Calendar className="h-5 w-5 text-yellow-500" />;
      default:
        return <Calendar className="h-5 w-5 text-blue-500" />;
    }
  };

  const criticalAlerts = alerts.filter(alert => alert.priority === 'critical');
  const highAlerts = alerts.filter(alert => alert.priority === 'high');
  const mediumAlerts = alerts.filter(alert => alert.priority === 'medium');
  const lowAlerts = alerts.filter(alert => alert.priority === 'low');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Central de Alertas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-red-200">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <div className="text-sm text-gray-600">Críticos</div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-500">{highAlerts.length}</div>
            <div className="text-sm text-gray-600">Alta Prioridade</div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">{mediumAlerts.length}</div>
            <div className="text-sm text-gray-600">Média Prioridade</div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">{lowAlerts.length}</div>
            <div className="text-sm text-gray-600">Baixa Prioridade</div>
          </CardContent>
        </Card>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className={`${alert.colorClass} border-l-4`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    {getPriorityIcon(alert.priority)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{alert.vaccineName}</h3>
                      <p className="text-gray-700">{alert.clientName}</p>
                      <p className="text-sm text-gray-600">{alert.clientWhatsapp}</p>
                      <div className="mt-2 text-sm">
                        <p><strong>Aplicação:</strong> {new Date(alert.vaccinationDate).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Vencimento:</strong> {new Date(alert.expiryDate).toLocaleDateString('pt-BR')}</p>
                        <p className="font-medium text-gray-800">{alert.status}</p>
                        {alert.notes && (
                          <p className="mt-1 text-gray-600"><strong>Obs:</strong> {alert.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleWhatsAppContact(alert.clientWhatsapp, alert.clientName, alert.vaccineName, alert.status)}
                    className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum alerta no momento</p>
            <p className="text-gray-400 text-sm">Todas as vacinas estão em dia!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlertsPage;

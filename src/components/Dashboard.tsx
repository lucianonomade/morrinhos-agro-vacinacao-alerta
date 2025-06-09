import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

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

interface DashboardProps {
  clients: Client[];
  vaccines: Vaccine[];
  onDeleteVaccine: (vaccineId: string) => Promise<void>;
}

const Dashboard = ({ clients, vaccines, onDeleteVaccine }: DashboardProps) => {
  const today = new Date();
  const upcomingVaccines = vaccines.filter(vaccine => {
    const expiryDate = new Date(vaccine.expiry_date);
    const daysDiff = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 7 && daysDiff >= 0;
  });

  const expiredVaccines = vaccines.filter(vaccine => {
    const expiryDate = new Date(vaccine.expiry_date);
    return expiryDate < today;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-green-700 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="agro-card border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
          </CardContent>
        </Card>

        <Card className="agro-card border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Vacinas Cadastradas
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{vaccines.length}</div>
          </CardContent>
        </Card>

        <Card className="agro-card border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Vencendo em 7 dias
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{upcomingVaccines.length}</div>
          </CardContent>
        </Card>

        <Card className="agro-card border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Vencidas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredVaccines.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="agro-card">
          <CardHeader>
            <CardTitle className="text-green-700">Próximas Vacinas (7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingVaccines.length > 0 ? (
              <div className="space-y-3">
                {upcomingVaccines.slice(0, 5).map((vaccine) => (
                  <div key={vaccine.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <p className="font-medium text-gray-900">{vaccine.client_name}</p>
                      <p className="text-sm text-gray-600">{vaccine.vaccine_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-700">
                        {new Date(vaccine.expiry_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma vacina vencendo nos próximos 7 dias</p>
            )}
          </CardContent>
        </Card>

        <Card className="agro-card">
          <CardHeader>
            <CardTitle className="text-red-600">Vacinas Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            {expiredVaccines.length > 0 ? (
              <div className="space-y-3">
                {expiredVaccines.slice(0, 5).map((vaccine) => (
                  <div key={vaccine.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-gray-900">{vaccine.client_name}</p>
                      <p className="text-sm text-gray-600">{vaccine.vaccine_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-700">
                        {new Date(vaccine.expiry_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma vacina vencida</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

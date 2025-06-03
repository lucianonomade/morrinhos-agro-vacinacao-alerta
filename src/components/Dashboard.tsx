
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  clients: any[];
  vaccines: any[];
}

const Dashboard = ({ clients, vaccines }: DashboardProps) => {
  const today = new Date();
  const upcomingVaccines = vaccines.filter(vaccine => {
    const expiryDate = new Date(vaccine.expiryDate);
    const daysDiff = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 7 && daysDiff >= 0;
  });

  const expiredVaccines = vaccines.filter(vaccine => {
    const expiryDate = new Date(vaccine.expiryDate);
    return expiryDate < today;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{clients.length}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vacinas Cadastradas
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{vaccines.length}</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vencendo em 7 dias
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">{upcomingVaccines.length}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vencidas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{expiredVaccines.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-800">Próximas Vacinas (7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingVaccines.length > 0 ? (
              <div className="space-y-3">
                {upcomingVaccines.slice(0, 5).map((vaccine, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <p className="font-medium text-gray-900">{vaccine.clientName}</p>
                      <p className="text-sm text-gray-600">{vaccine.vaccineName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-800">
                        {new Date(vaccine.expiryDate).toLocaleDateString('pt-BR')}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-red-800">Vacinas Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            {expiredVaccines.length > 0 ? (
              <div className="space-y-3">
                {expiredVaccines.slice(0, 5).map((vaccine, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-gray-900">{vaccine.clientName}</p>
                      <p className="text-sm text-gray-600">{vaccine.vaccineName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-800">
                        {new Date(vaccine.expiryDate).toLocaleDateString('pt-BR')}
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

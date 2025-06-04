
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
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="futuristic-card border-cyan-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-300">{clients.length}</div>
          </CardContent>
        </Card>

        <Card className="futuristic-card border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Vacinas Cadastradas
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-300">{vaccines.length}</div>
          </CardContent>
        </Card>

        <Card className="futuristic-card border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Vencendo em 7 dias
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-300">{upcomingVaccines.length}</div>
          </CardContent>
        </Card>

        <Card className="futuristic-card border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Vencidas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-300">{expiredVaccines.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="text-cyan-300">Próximas Vacinas (7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingVaccines.length > 0 ? (
              <div className="space-y-3">
                {upcomingVaccines.slice(0, 5).map((vaccine, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/30">
                    <div>
                      <p className="font-medium text-slate-200">{vaccine.clientName}</p>
                      <p className="text-sm text-slate-400">{vaccine.vaccineName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-300">
                        {new Date(vaccine.expiryDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4">Nenhuma vacina vencendo nos próximos 7 dias</p>
            )}
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="text-red-300">Vacinas Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            {expiredVaccines.length > 0 ? (
              <div className="space-y-3">
                {expiredVaccines.slice(0, 5).map((vaccine, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-400/30">
                    <div>
                      <p className="font-medium text-slate-200">{vaccine.clientName}</p>
                      <p className="text-sm text-slate-400">{vaccine.vaccineName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-300">
                        {new Date(vaccine.expiryDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4">Nenhuma vacina vencida</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

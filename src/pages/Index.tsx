
import { useState } from 'react';
import FuturisticSidebar from '@/components/FuturisticSidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import ClientForm from '@/components/ClientForm';
import VaccineForm from '@/components/VaccineForm';
import AlertsPage from '@/components/AlertsPage';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { clients, vaccines, loading, addClient, addVaccine } = useSupabaseData();

  const handleAddClient = async (client: { name: string; whatsapp: string }) => {
    await addClient(client);
  };

  const handleAddVaccine = async (vaccine: any) => {
    await addVaccine(vaccine);
  };

  const renderCurrentPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-slate-400">Carregando dados...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard clients={clients} vaccines={vaccines} />;
      case 'clients':
        return <ClientForm clients={clients} onAddClient={handleAddClient} />;
      case 'vaccines':
        return <VaccineForm clients={clients} vaccines={vaccines} onAddVaccine={handleAddVaccine} />;
      case 'alerts':
        return <AlertsPage vaccines={vaccines} />;
      default:
        return <Dashboard clients={clients} vaccines={vaccines} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <FuturisticSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <Header />
      
      {/* Main content with responsive margins */}
      <main className="md:ml-20 transition-all duration-300 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            {renderCurrentPage()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

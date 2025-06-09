
import { useState } from 'react';
import RuralSidebar from '@/components/RuralSidebar';
import MobileNavigation from '@/components/MobileNavigation';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import ClientForm from '@/components/ClientForm';
import VaccineForm from '@/components/VaccineForm';
import AlertsPage from '@/components/AlertsPage';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { clients, vaccines, loading, addClient, addVaccine, deleteVaccine } = useSupabaseData();

  const handleAddClient = async (client: { name: string; whatsapp: string }) => {
    await addClient(client);
  };

  const handleAddVaccine = async (vaccine: any) => {
    await addVaccine(vaccine);
  };

  const handleDeleteVaccine = async (vaccineId: string) => {
    await deleteVaccine(vaccineId);
  };

  const renderCurrentPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard clients={clients} vaccines={vaccines} onDeleteVaccine={handleDeleteVaccine} />;
      case 'clients':
        return <ClientForm clients={clients} onAddClient={handleAddClient} />;
      case 'vaccines':
        return <VaccineForm clients={clients} vaccines={vaccines} onAddVaccine={handleAddVaccine} onDeleteVaccine={handleDeleteVaccine} />;
      case 'alerts':
        return <AlertsPage vaccines={vaccines} onDeleteVaccine={handleDeleteVaccine} />;
      default:
        return <Dashboard clients={clients} vaccines={vaccines} onDeleteVaccine={handleDeleteVaccine} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <RuralSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <Header />
      
      {/* Main content with responsive margins and padding */}
      <main className="md:ml-20 transition-all duration-300 min-h-screen pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-8 pt-2 md:pt-4">
          <div className="bg-white rounded-lg shadow-lg border-gray-200 p-3 sm:p-4 md:p-6">
            {renderCurrentPage()}
          </div>
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <MobileNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default Index;

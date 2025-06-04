
import { useState, useEffect } from 'react';
import FuturisticSidebar from '@/components/FuturisticSidebar';
import Dashboard from '@/components/Dashboard';
import ClientForm from '@/components/ClientForm';
import VaccineForm from '@/components/VaccineForm';
import AlertsPage from '@/components/AlertsPage';

interface Client {
  id: string;
  name: string;
  whatsapp: string;
  createdAt: string;
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

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);

  useEffect(() => {
    const savedClients = localStorage.getItem('morrinhos-clients');
    const savedVaccines = localStorage.getItem('morrinhos-vaccines');
    
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
    
    if (savedVaccines) {
      setVaccines(JSON.parse(savedVaccines));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('morrinhos-clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('morrinhos-vaccines', JSON.stringify(vaccines));
  }, [vaccines]);

  const handleAddClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const handleAddVaccine = (vaccine: Vaccine) => {
    setVaccines(prev => [...prev, vaccine]);
  };

  const renderCurrentPage = () => {
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
      
      {/* Main content with responsive margins */}
      <main className="md:ml-20 transition-all duration-300 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            {renderCurrentPage()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

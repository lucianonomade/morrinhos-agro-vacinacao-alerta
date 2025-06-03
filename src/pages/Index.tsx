
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
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
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Index;


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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

export const useSupabaseData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchClients = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive",
      });
    }
  };

  const fetchVaccines = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('vaccines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVaccines(data || []);
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar vacinas",
        variant: "destructive",
      });
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('clients')
        .insert([{
          user_id: user.id,
          name: client.name,
          whatsapp: client.whatsapp
        }]);

      if (error) throw error;
      
      await fetchClients();
      toast({
        title: "Sucesso!",
        description: "Cliente cadastrado com sucesso",
      });
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar cliente",
        variant: "destructive",
      });
    }
  };

  const deleteClient = async (clientId: string) => {
    if (!user) return;

    try {
      // Primeiro, verificar se há vacinas associadas ao cliente
      const { data: vaccinesData, error: vaccinesError } = await supabase
        .from('vaccines')
        .select('id')
        .eq('client_id', clientId)
        .eq('user_id', user.id);

      if (vaccinesError) throw vaccinesError;

      if (vaccinesData && vaccinesData.length > 0) {
        toast({
          title: "Erro",
          description: "Não é possível excluir cliente com vacinas cadastradas. Exclua as vacinas primeiro.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchClients();
      toast({
        title: "Sucesso!",
        description: "Cliente excluído com sucesso",
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir cliente",
        variant: "destructive",
      });
    }
  };

  const addVaccine = async (vaccine: Omit<Vaccine, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('vaccines')
        .insert([{
          user_id: user.id,
          client_id: vaccine.client_id,
          client_name: vaccine.client_name,
          client_whatsapp: vaccine.client_whatsapp,
          vaccine_name: vaccine.vaccine_name,
          dose_description: vaccine.dose_description,
          vaccination_date: vaccine.vaccination_date,
          expiry_date: vaccine.expiry_date,
          notes: vaccine.notes
        }]);

      if (error) throw error;
      
      await fetchVaccines();
      toast({
        title: "Sucesso!",
        description: "Vacina cadastrada com sucesso",
      });
    } catch (error) {
      console.error('Error adding vaccine:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar vacina",
        variant: "destructive",
      });
    }
  };

  const deleteVaccine = async (vaccineId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('vaccines')
        .delete()
        .eq('id', vaccineId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchVaccines();
      toast({
        title: "Sucesso!",
        description: "Vacina excluída com sucesso",
      });
    } catch (error) {
      console.error('Error deleting vaccine:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir vacina",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchClients(), fetchVaccines()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  return {
    clients,
    vaccines,
    loading,
    addClient,
    deleteClient,
    addVaccine,
    deleteVaccine,
    refetch: () => Promise.all([fetchClients(), fetchVaccines()])
  };
};

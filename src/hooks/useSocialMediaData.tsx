
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface SocialMediaContent {
  id: string;
  user_id: string;
  lojista_id: string;
  title: string;
  description?: string;
  content_type: 'image' | 'video';
  file_url: string;
  file_name: string;
  file_size?: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  user_type: 'lojista' | 'social_media';
}

export const useSocialMediaData = () => {
  const [content, setContent] = useState<SocialMediaContent[]>([]);
  const [lojistas, setLojistas] = useState<UserProfile[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchLojistas = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'lojista');

      if (error) throw error;
      setLojistas(data || []);
    } catch (error) {
      console.error('Error fetching lojistas:', error);
    }
  };

  const fetchContent = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('social_media_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo",
        variant: "destructive",
      });
    }
  };

  const uploadFile = async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('social-media')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('social-media')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const addContent = async (contentData: {
    title: string;
    description?: string;
    file: File;
    lojista_id: string;
  }) => {
    if (!user || !userProfile) return;

    try {
      setLoading(true);

      // Upload do arquivo
      const fileUrl = await uploadFile(contentData.file, user.id);

      // Determinar tipo de conteúdo
      const contentType = contentData.file.type.startsWith('video/') ? 'video' : 'image';

      // Inserir registro no banco
      const { error } = await supabase
        .from('social_media_content')
        .insert([{
          user_id: user.id,
          lojista_id: contentData.lojista_id,
          title: contentData.title,
          description: contentData.description,
          content_type: contentType,
          file_url: fileUrl,
          file_name: contentData.file.name,
          file_size: contentData.file.size,
        }]);

      if (error) throw error;

      await fetchContent();
      toast({
        title: "Sucesso!",
        description: "Conteúdo enviado com sucesso",
      });
    } catch (error) {
      console.error('Error adding content:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar conteúdo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContentStatus = async (contentId: string, status: 'approved' | 'rejected') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('social_media_content')
        .update({ status })
        .eq('id', contentId);

      if (error) throw error;

      await fetchContent();
      toast({
        title: "Sucesso!",
        description: `Conteúdo ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`,
      });
    } catch (error) {
      console.error('Error updating content status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do conteúdo",
        variant: "destructive",
      });
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('social_media_content')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      await fetchContent();
      toast({
        title: "Sucesso!",
        description: "Conteúdo excluído com sucesso",
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir conteúdo",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchUserProfile(), fetchLojistas(), fetchContent()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  return {
    content,
    lojistas,
    userProfile,
    loading,
    addContent,
    updateContentStatus,
    deleteContent,
    refetch: () => Promise.all([fetchContent()])
  };
};

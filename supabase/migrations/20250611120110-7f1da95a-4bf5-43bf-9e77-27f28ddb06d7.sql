
-- Criar enum para tipos de usuário
CREATE TYPE public.user_type AS ENUM ('lojista', 'social_media');

-- Atualizar tabela profiles para incluir tipo de usuário
ALTER TABLE public.profiles 
ADD COLUMN user_type user_type DEFAULT 'lojista';

-- Criar tabela para conteúdo de mídia social
CREATE TABLE public.social_media_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  lojista_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('image', 'video')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de conteúdo de mídia social
ALTER TABLE public.social_media_content ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para social_media_content
-- Social media users podem inserir conteúdo para seus lojistas
CREATE POLICY "Social media users can insert content" 
  ON public.social_media_content 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'social_media'
    )
  );

-- Social media users podem ver seu próprio conteúdo
CREATE POLICY "Social media users can view their own content" 
  ON public.social_media_content 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Lojistas podem ver conteúdo enviado para eles
CREATE POLICY "Lojistas can view content sent to them" 
  ON public.social_media_content 
  FOR SELECT 
  USING (
    auth.uid() = lojista_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'lojista'
    )
  );

-- Lojistas podem atualizar status do conteúdo
CREATE POLICY "Lojistas can update content status" 
  ON public.social_media_content 
  FOR UPDATE 
  USING (
    auth.uid() = lojista_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'lojista'
    )
  );

-- Social media users podem atualizar seu próprio conteúdo
CREATE POLICY "Social media users can update their own content" 
  ON public.social_media_content 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Social media users podem deletar seu próprio conteúdo
CREATE POLICY "Social media users can delete their own content" 
  ON public.social_media_content 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar bucket de storage para mídia social
INSERT INTO storage.buckets (id, name, public) 
VALUES ('social-media', 'social-media', true);

-- Política para upload de arquivos (apenas social media users)
CREATE POLICY "Social media users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'social-media' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'social_media'
  )
);

-- Política para visualizar arquivos
CREATE POLICY "Users can view social media files"
ON storage.objects FOR SELECT
USING (bucket_id = 'social-media');

-- Política para deletar arquivos (apenas o próprio usuário)
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'social-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Atualizar função handle_new_user para incluir user_type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type, 'lojista')
  );
  RETURN NEW;
END;
$$;

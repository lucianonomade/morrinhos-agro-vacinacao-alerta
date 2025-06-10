
-- Adicionar a coluna dose_description à tabela vaccines
ALTER TABLE public.vaccines 
ADD COLUMN dose_description text;

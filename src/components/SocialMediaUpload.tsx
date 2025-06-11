
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileImage, FileVideo } from 'lucide-react';
import { useSocialMediaData } from '@/hooks/useSocialMediaData';

const SocialMediaUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLojista, setSelectedLojista] = useState('');
  const [uploading, setUploading] = useState(false);

  const { lojistas, addContent, userProfile } = useSocialMediaData();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar se é imagem ou vídeo
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setSelectedFile(file);
      } else {
        alert('Por favor, selecione apenas arquivos de imagem ou vídeo.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !title.trim() || !selectedLojista) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setUploading(true);
    try {
      await addContent({
        title: title.trim(),
        description: description.trim() || undefined,
        file: selectedFile,
        lojista_id: selectedLojista,
      });

      // Limpar formulário
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setSelectedLojista('');
      
      // Limpar input de arquivo
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error uploading content:', error);
    } finally {
      setUploading(false);
    }
  };

  // Verificar se o usuário é social media
  if (userProfile?.user_type !== 'social_media') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-600">Acesso restrito a usuários do tipo Social Media.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Conteúdo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do conteúdo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição/Legenda</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição ou legenda para o conteúdo"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lojista">Lojista Destinatário *</Label>
            <Select value={selectedLojista} onValueChange={setSelectedLojista} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um lojista" />
              </SelectTrigger>
              <SelectContent>
                {lojistas.map((lojista) => (
                  <SelectItem key={lojista.id} value={lojista.id}>
                    {lojista.full_name || lojista.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Arquivo (Imagem/Vídeo) *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id="file-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {selectedFile ? (
                  <div className="flex items-center gap-2 text-green-600">
                    {selectedFile.type.startsWith('video/') ? (
                      <FileVideo className="h-8 w-8" />
                    ) : (
                      <FileImage className="h-8 w-8" />
                    )}
                    <span>{selectedFile.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-600">
                      Clique para selecionar uma imagem ou vídeo
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={uploading || !selectedFile || !title.trim() || !selectedLojista}
            className="w-full"
          >
            {uploading ? 'Enviando...' : 'Enviar Conteúdo'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SocialMediaUpload;

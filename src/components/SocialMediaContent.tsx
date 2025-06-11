
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileImage, FileVideo, Check, X, Trash2, Clock } from 'lucide-react';
import { useSocialMediaData } from '@/hooks/useSocialMediaData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SocialMediaContent = () => {
  const { content, userProfile, updateContentStatus, deleteContent, loading } = useSocialMediaData();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando conteúdo...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (content.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum conteúdo encontrado.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {content.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                {item.content_type === 'video' ? (
                  <FileVideo className="h-5 w-5" />
                ) : (
                  <FileImage className="h-5 w-5" />
                )}
                {item.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                {getStatusBadge(item.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {item.description && (
                <p className="text-gray-600">{item.description}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    <strong>Arquivo:</strong> {item.file_name}
                  </p>
                  {item.file_size && (
                    <p className="text-sm text-gray-500">
                      <strong>Tamanho:</strong> {(item.file_size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    <strong>Enviado em:</strong>{' '}
                    {format(new Date(item.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>

                {item.content_type === 'image' ? (
                  <img
                    src={item.file_url}
                    alt={item.title}
                    className="rounded-lg max-h-48 object-cover w-full"
                  />
                ) : (
                  <video
                    src={item.file_url}
                    controls
                    className="rounded-lg max-h-48 w-full"
                  />
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {userProfile?.user_type === 'lojista' && item.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => updateContentStatus(item.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateContentStatus(item.id, 'rejected')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </>
                )}

                {userProfile?.user_type === 'social_media' && item.user_id === userProfile?.id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteContent(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SocialMediaContent;

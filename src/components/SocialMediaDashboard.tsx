
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileImage, FileVideo, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useSocialMediaData } from '@/hooks/useSocialMediaData';

const SocialMediaDashboard = () => {
  const { content, userProfile, loading } = useSocialMediaData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-600">Carregando dashboard...</p>
      </div>
    );
  }

  // Filtrar conteúdo do usuário atual se for social media
  const userContent = userProfile?.user_type === 'social_media' 
    ? content.filter(item => item.user_id === userProfile?.id)
    : content;

  const pendingCount = userContent.filter(item => item.status === 'pending').length;
  const approvedCount = userContent.filter(item => item.status === 'approved').length;
  const rejectedCount = userContent.filter(item => item.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userProfile?.user_type === 'social_media' ? 'Meu Dashboard - Social Media' : 'Dashboard - Lojista'}
          </h1>
          <p className="text-gray-600">
            {userProfile?.user_type === 'social_media' 
              ? 'Gerencie seus uploads e acompanhe o status dos conteúdos'
              : 'Visualize e aprove conteúdos enviados pela equipe de Social Media'
            }
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {userProfile?.user_type === 'social_media' ? 'Social Media' : 'Lojista'}
        </Badge>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conteúdo</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userContent.length}</div>
            <p className="text-xs text-muted-foreground">
              {userProfile?.user_type === 'social_media' ? 'Seus uploads' : 'Recebidos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              {userProfile?.user_type === 'social_media' ? 'Aguardando aprovação' : 'Para revisar'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Conteúdos aprovados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Conteúdos rejeitados</p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo recente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-5 w-5" />
            {userProfile?.user_type === 'social_media' ? 'Meus Uploads Recentes' : 'Conteúdo Recente Recebido'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userContent.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {userProfile?.user_type === 'social_media' 
                  ? 'Você ainda não fez nenhum upload. Comece enviando seu primeiro conteúdo!'
                  : 'Nenhum conteúdo foi recebido ainda.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userContent.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.content_type === 'video' ? (
                      <FileVideo className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FileImage className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.file_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        item.status === 'approved' ? 'default' : 
                        item.status === 'rejected' ? 'destructive' : 
                        'secondary'
                      }
                    >
                      {item.status === 'approved' ? 'Aprovado' :
                       item.status === 'rejected' ? 'Rejeitado' :
                       'Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaDashboard;

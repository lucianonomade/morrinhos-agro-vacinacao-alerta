
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Upload, FileImage } from 'lucide-react';
import SocialMediaUpload from './SocialMediaUpload';
import SocialMediaContent from './SocialMediaContent';
import { useSocialMediaData } from '@/hooks/useSocialMediaData';

const SocialMediaPage = () => {
  const { userProfile, content, loading } = useSocialMediaData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Media</h1>
          <p className="text-gray-600">
            Gerencie conteúdo de mídia social
            {userProfile?.user_type === 'social_media' && ' - Envie conteúdo para lojistas'}
            {userProfile?.user_type === 'lojista' && ' - Visualize e aprove conteúdo'}
          </p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conteúdo</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {content.filter(item => item.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {content.filter(item => item.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          {userProfile?.user_type === 'social_media' && (
            <TabsTrigger value="upload">Upload</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="content">
          <SocialMediaContent />
        </TabsContent>

        {userProfile?.user_type === 'social_media' && (
          <TabsContent value="upload">
            <SocialMediaUpload />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SocialMediaPage;

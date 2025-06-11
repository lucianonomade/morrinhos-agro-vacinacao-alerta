
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Upload, FileImage, BarChart } from 'lucide-react';
import SocialMediaUpload from './SocialMediaUpload';
import SocialMediaContent from './SocialMediaContent';
import SocialMediaDashboard from './SocialMediaDashboard';
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

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Conteúdo
          </TabsTrigger>
          {userProfile?.user_type === 'social_media' && (
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="dashboard">
          <SocialMediaDashboard />
        </TabsContent>

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

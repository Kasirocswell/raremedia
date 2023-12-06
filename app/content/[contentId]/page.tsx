'use client'

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabase/client';
import ImageComponent from '../../components/ImageComponent';
import SongPlayer from '../../components/SongPlayer';
import VideoPlayer from '../../components/VideoPlayer';
import CommentsSection from '../../components/CommentsSection';
import { User } from '@supabase/supabase-js';
import Navbar from '@/app/components/Navbar';

interface Content {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'picture' | 'song' | 'video';
  artist: string;
  artwork: string;
}

// Define a type for the params
interface Params {
  contentId: string;
}

const ContentPage: React.FC<{ params: Params }> = ({ params }) => {
  const [content, setContent] = useState<Content | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const contentId = params.contentId; // Extracting contentId from params
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (contentId) {
      setIsDataReady(true);
    }
  }, [contentId]);

  useEffect(() => {
    if (!isDataReady) return;

    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('content_id', contentId)
        .single();

      if (error) {
        console.error('Error fetching content:', error);
        setContent(null);
      } else {
        setContent(data);
      }
    };

    fetchContent();
  }, [isDataReady, contentId]);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionResponse } = await supabase.auth.getSession();
      if (sessionResponse.session) {
        setUser(sessionResponse.session.user);
      } else {
        setUser(null);
      }
    };

    fetchSession();
  }, []);

  const renderContent = () => {
    if (!content) return <p>Loading...</p>;

    switch (content.type) {
      case 'picture':
        return <ImageComponent url={content.url} title={content.title} description={content.description} />;
      case 'song':
        return <SongPlayer url={content.url} title={content.title} artist={content.artist} artwork={content.artwork} />;
      case 'video':
        return <VideoPlayer url={content.url} title={content.title} artist={content.artist} />;
      default:
        return <p>Unknown content type</p>;
    }
  };

  return (
    <div className="p-4">
        <Navbar />
      <h1 className="text-xl font-bold mb-4">{content?.title}</h1>
      {renderContent()}
      {contentId && user && <CommentsSection contentId={contentId} />}
    </div>
  );
};

export default ContentPage;

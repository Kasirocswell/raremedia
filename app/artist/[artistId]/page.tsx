'use client'

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabase/client';
import Navbar from '@/app/components/Navbar';
import { IconBrandInstagram, IconBrandTiktok, IconBrandTwitter } from '@tabler/icons-react';
import ArtistCard from '@/app/components/ArtistCard';

interface ArtistProfileData {
    id: string;
    artist_name: string;
    bio: string;
    profile_picture: string;
    banner: string;
    tiktok: string;
    instagram: string;
    twitter: string;
}

interface ContentData {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail?: string; // Optional thumbnail field
}

interface Params {
  artistId: string;
}

const ArtistProfile: React.FC<{ params: Params }> = ({ params }) => {
  const [artistProfile, setArtistProfile] = useState<ArtistProfileData | null>(null);
  const [artistContent, setArtistContent] = useState<ContentData[]>([]);
  const artistId = params.artistId;

  useEffect(() => {
    const fetchArtistProfile = async () => {
      if (artistId) {
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .eq('artist_id', artistId)
          .single();

        if (error) {
          console.error('Error fetching artist profile:', error);
        } else if (data) {
          setArtistProfile(data);
        }
      }
    };

    fetchArtistProfile();
  }, [artistId]);

  useEffect(() => {
    const fetchArtistContent = async () => {
      if (artistId) {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('artist_id', artistId);

        if (error) {
          console.error('Error fetching artist content:', error);
        } else {
          setArtistContent(data || []);
        }
      }
    };

    fetchArtistContent();
  }, [artistId]);

  if (!artistProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col'>
        <Navbar />
        {/* Section 1: Banner and Profile Picture */}
        <div className="relative">
            <img src={artistProfile.banner} alt="Banner" className="w-full h-48 object-cover" />
            <div className="absolute left-4 bottom-4 flex items-center">
                <img src={artistProfile.profile_picture} alt="Profile Picture" className="w-24 h-24 rounded-full border-4 border-white" />
                <h1 className="ml-4 text-2xl font-bold">{artistProfile.artist_name}</h1>
            </div>
        </div>

        {/* Section 2: Bio and Contacts */}
        <div className='flex justify-around p-4'>
            <div className='flex-1'>
                <p className='text-lg'>{artistProfile.bio}</p>
            </div>
            <div className='flex-1 flex items-center justify-center space-x-4'>
                {artistProfile.instagram && <a href={artistProfile.instagram} target="_blank" rel="noopener noreferrer"><IconBrandInstagram size={24} /></a>}
                {artistProfile.tiktok && <a href={artistProfile.tiktok} target="_blank" rel="noopener noreferrer"><IconBrandTiktok size={24} /></a>}
                {artistProfile.twitter && <a href={artistProfile.twitter} target="_blank" rel="noopener noreferrer"><IconBrandTwitter size={24} /></a>}
            </div>
        </div>

        {/* Section 3: Artist Content */}
        <div className='p-4 bg-gray-700'>
            <h2 className='text-xl font-bold mb-2 text-white'>Content</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {artistContent.map(content => (
                    <ArtistCard
                        key={content.id}
                        imageUrl={content.thumbnail || content.url || 'default-image.png'}
                        name={content.title}
                        description={content.description}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

export default ArtistProfile;

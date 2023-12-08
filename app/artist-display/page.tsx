'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../supabase/client';
import Navbar from '../components/Navbar';

interface Artist {
  artist_id: string;
  artist_name: string;
  profile_picture: string;
  banner: string;
  bio: string;
  tiktok: string;
  instagram: string;
  twitter: string;
  // Add additional fields as needed
}

const ArtistDisplayPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*');

      if (error) {
        console.error('Error fetching artists:', error);
      } else {
        setArtists(data || []);
        console.log("artist data")
        console.log(data)
      }
    };

    fetchArtists();
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Navbar />
      {artists.map((artist) => (
        <Link key={artist.artist_id} href={`/artist/${artist.artist_id}`}>
          <div className="card hover:shadow-lg cursor-pointer">
            <img src={artist.profile_picture || 'default-profile.png'} alt={artist.artist_name} className="w-full h-auto" />
            <div className="p-4">
              <h2 className="text-2xl font-bold">{artist.artist_name}</h2>
              {/* Additional artist info can go here */}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ArtistDisplayPage;

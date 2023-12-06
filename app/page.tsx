'use client'

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Marketing from './components/Marketing';
import Categories from './components/Categories';
import ArtistStats from './components/ArtistStats';
import { getUser } from '../store/userData'; 
import { supabase } from '../supabase/client'; 

const HomePage: React.FC = () => {
  const { user, setUser } = getUser();
  const [isArtist, setIsArtist] = useState(false);

  // useEffect(() => {
  //   // Set up the auth listener only once when the component mounts
  //   const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
  //     setUser(session?.user || null);
  //   });

  //   return () => {
  //     // Clean up the listener when the component unmounts
  //     authListener.subscription.unsubscribe();
  //   };
  // }, [setUser]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.id) return;

      // Check if the user is an artist
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('artist_id', user.id)
        .single();

      if (artistError) {
        console.error('Error checking artist status:', artistError);
        return;
      }

      setIsArtist(!!artistData);
    };

    fetchUserProfile();
  }, [user?.id]);

  const isSignedIn = user !== null;

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          {isSignedIn ? (
            isArtist ? (
              // <ArtistStats />
              <div>Artist Stats Here</div>
            ) : (
              <Categories />
            )
          ) : (
            <Marketing />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

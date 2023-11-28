'use client'

import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase/client';
import { getUser } from '../../../store/userData';
import Navbar from '@/app/components/Navbar';

interface UserProfileData {
    id: string;
    username: string;
    email: string;
    profilePictureUrl: string; // URL for the profile picture
    bannerUrl: string;        // URL for the banner
    bio: string;
    // Add other user fields as needed
}

const UserProfile = () => {
  const { user } = getUser();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  const fetchImageUrls = async (path: string) => {
    const { data } = supabase.storage.from('pfp').getPublicUrl(path);
    return data?.publicUrl || ''; // Correctly accessing the publicUrl
  };
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.username) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', user.username)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else if (data) {
          const profilePictureUrl = await fetchImageUrls(data.profilePicture);
          const bannerUrl = await fetchImageUrls(data.banner);
          setUserProfile({ ...data, profilePictureUrl, bannerUrl });
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col'>
      <Navbar />
      <div>
        <img src={userProfile.bannerUrl} alt="Banner" className="w-full" />
      </div>
      <div className='mx-auto'>
        <img src={userProfile.profilePictureUrl} alt="Profile Picture" className="w-[100px] h-[100px] rounded-full" />
      </div>
      <div className='flex-col mx-auto'>
        <p>{userProfile.username}</p>
        <p>{userProfile.bio}</p>
        <p>Subscriptions</p>
        <p>Joined</p>
      </div>
    </div>
  );
};

export default UserProfile;



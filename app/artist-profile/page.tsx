'use client'

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TierModal from '../components/TierModal'; // Ensure this path is correct
import { supabase } from '../../supabase/client'; // Adjust the path as per your setup

const ArtistProfilePage: React.FC = () => {
  const [profile, setProfile] = useState({
    artist_id: '', 
    artist_name: '',
    bio: '',
    profile_picture: '',
    banner: '',
    tiktok: '',
    instagram: '',
    twitter: '',
  });
  const [loading, setLoading] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;

      const user = userData?.user;
      if (user) {
        let { data, error } = await supabase
          .from('artists')
          .select('*')
          .eq('artist_id', user.id)
          .single();

        if (error) throw error;
        if (data) setProfile({ ...data, artist_id: user.id });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);


   const toggleTierModal = () => {
    setShowTierModal(!showTierModal);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile_picture' | 'banner', bucket: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user || !e.target.files || e.target.files.length === 0) return;

      const user = userData.user;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      let { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = await supabase.storage.from(bucket).getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      setProfile({ ...profile, [type]: publicUrl });

      let { error: updateError } = await supabase
        .from('artists')
        .update({ [type]: publicUrl })
        .eq('artist_id', user.id);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    const user = userData?.user;
    if (user) {
      const updates = {
        artist_id: user.id,
        artist_name: profile.artist_name,
        bio: profile.bio,
        profile_picture: profile.profile_picture,
        banner: profile.banner,
        tiktok: profile.tiktok,
        instagram: profile.instagram,
        twitter: profile.twitter,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('artists').upsert(updates);

      if (error) throw error;
      alert('Artist profile updated successfully!');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-2">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 text-red-800">Artist Profile</h1>
      
      {/* Display the banner */}
      {profile.banner && (
        <img 
          src={profile.banner} 
          alt="Banner" 
          className="w-full h-48 object-cover mb-4"
        />
      )}

      {/* Display the profile picture */}
      <img 
        src={profile.profile_picture ? profile.profile_picture : 'download.png'} 
        alt="Profile Picture" 
        className="rounded-full h-24 w-24 object-cover mb-4"
      />
  
      {/* Profile form */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="artist_name" className="block text-sm font-medium text-gray-700">Artist Name:</label>
          <input type="text" id="artist_name" value={profile.artist_name || ""} onChange={(e) => setProfile({ ...profile, artist_name: e.target.value })} disabled={loading} className="text-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio (200 words max):</label>
          <textarea id="bio" value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} maxLength={200} disabled={loading} className="text-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Profile Picture:</label>
          <input type="file" onChange={(e) => handleFileUpload(e, 'profile_picture', 'pfp')} disabled={loading} className="text-black mt-1 block w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Banner:</label>
          <input type="file" onChange={(e) => handleFileUpload(e, 'banner', 'banner')} disabled={loading} className="text-black mt-1 block w-full" />
        </div>
        {/* New fields for social media links */}
        <div className="mb-4">
          <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700">TikTok:</label>
          <input type="text" id="tiktok" value={profile.tiktok || ""} onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })} disabled={loading} className="text-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram:</label>
          <input type="text" id="instagram" value={profile.instagram || ""} onChange={(e) => setProfile({ ...profile, instagram: e.target.value })} disabled={loading} className="text-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">Twitter:</label>
          <input type="text" id="twitter" value={profile.twitter || ""} onChange={(e) => setProfile({ ...profile, twitter: e.target.value })} disabled={loading} className="text-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded">{loading ? 'Saving...' : 'Save Profile'}</button>
      </form>

      {/* TierModal */}
      <TierModal 
        isOpen={showTierModal} 
        onClose={toggleTierModal}       
        />
    </div>
  );
}

export default ArtistProfilePage;

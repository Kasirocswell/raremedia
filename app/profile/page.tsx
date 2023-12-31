'use client'

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../../supabase/client'; // Adjust the path as per your setup

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState({
    email: '',
    username: '',
    bio: '',
    profile_picture: '',
    banner: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch user profile data from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;

        const user = userData?.user;
        if (user) {
          let { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          if (data) setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;

      const user = userData?.user;
      if (user) {
        const updates = {
          id: user.id,
          email: profile.email,
          username: profile.username,
          bio: profile.bio,
          updated_at: new Date(),
        };

        let { error } = await supabase.from('users').upsert(updates);

        if (error) throw error;
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
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
  
      // Fetch the public URL of the uploaded file
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;
  
      // Update the user's profile in the Supabase users table
      const columnToUpdate = type === 'profile_picture' ? 'profile_picture' : 'banner';
      let { error: updateError } = await supabase
        .from('users')
        .update({ [columnToUpdate]: publicUrl })
        .eq('id', user.id);
  
      if (updateError) throw updateError;
  
      // Update local state
      setProfile({ ...profile, [type]: publicUrl });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-2">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 text-red-800">Profile</h1>
      
      {/* Display the banner */}
      {profile.banner && (
        <img 
          src={profile.banner} 
          alt="Banner" 
          className="w-full h-48 object-cover mb-4" // Adjust the size as needed
        />
      )}
  
      {/* Display the profile picture */}
      <img 
        src={profile.profile_picture ? profile.profile_picture : 'download.png'} 
        alt="Profile Picture" 
        className="rounded-full h-24 w-24 object-cover mb-4"
      />
  
      {/* Rest of the form */}
       <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input type="email" id="email" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} disabled={loading} className="text-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
          <input type="text" id="username" value={profile.username || ""} onChange={(e) => setProfile({ ...profile, username: e.target.value })} disabled={loading} className="text-black mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
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
        <button type="submit" disabled={loading} className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded">{loading ? 'Saving...' : 'Save Profile'}</button>
      </form>
    </div>
  );
  
  }  

export default ProfilePage;

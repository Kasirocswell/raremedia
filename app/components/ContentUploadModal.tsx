'use client'

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { supabase } from '../../supabase/client';
import { getUser } from '../../store/userData';

type ContentType = 'video' | 'song' | 'picture' | null;
type Tier = { id: string; name: string; price: number };

interface ContentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContentUploadModal: React.FC<ContentUploadModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isFree, setIsFree] = useState<boolean>(true);
  const [artistId, setArtistId] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('');

  const { user } = getUser();

  useEffect(() => {
    const fetchArtistData = async () => {
      if (user && user.id) {
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('artist_id')
          .eq('artist_id', user.id)
          .single();

        if (artistError) {
          console.error('Error fetching artist ID:', artistError);
          return;
        }

        setArtistId(artistData?.artist_id);

        const { data: tiersData, error: tiersError } = await supabase
          .from('tiers')
          .select('*')
          .eq('artist_id', artistData?.artist_id);

        if (tiersError) {
          console.error('Error fetching tiers:', tiersError);
          return;
        }

        setTiers(tiersData || []);
      }
    };

    fetchArtistData();
  }, [user?.id]);

  const handleUpload = async () => {
    if (!file || !artistId) return;

    const contentType = determineContentType(file.name);
    if (!contentType) {
      alert('Unsupported file type');
      return;
    }

    const filePath = `content/${artistId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('content').upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return;
    }

    const { data: urlData} = await supabase.storage.from('content').getPublicUrl(filePath);
    
    const publicUrl = urlData?.publicUrl;
    
    if (!publicUrl) {
      console.error('Public URL is null');
      return;
    }
    
    const { error } = await supabase.from('content').insert([{
      artist_id: artistId,
      title,
      description,
      type: contentType,
      url: publicUrl, // Store only the URL string
      is_free: isFree && !selectedTier,
      tier: selectedTier || null,
      created_at: new Date(),
      updated_at: new Date()
    }]);
    

    if (error) {
      console.error('Error inserting content data:', error);
    } else {
      alert('Content uploaded successfully!');
      onClose();
    }
  };

  const determineContentType = (fileName: string): ContentType => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['mov', 'mp4', 'mpg', 'avi'].includes(extension || '')) return 'video';
    if (['mp3', 'wav', 'flac'].includes(extension || '')) return 'song';
    if (['jpeg', 'jpg', 'png'].includes(extension || '')) return 'picture';
    return null;
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl text-black font-bold mb-4">Upload Content</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        className="border text-black border-gray-300 rounded p-2 mb-4"
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border text-black border-gray-300 rounded p-2 mb-4 w-full"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border text-black border-gray-300 rounded p-2 mb-4 w-full"
      />
      <label className="block mb-4 text-black">
        <input
          type="checkbox"
          checked={isFree}
          onChange={(e) => setIsFree(e.target.checked)}
          className="mr-2 text-black"
        />
        Free Content
      </label>
      <select
        value={selectedTier}
        onChange={(e) => setSelectedTier(e.target.value)}
        className="border text-black border-gray-300 rounded p-2 mb-4 w-full"
      >
        <option value="">Select a Tier (optional)</option>
        {tiers.map(tier => (
          <option key={tier.id} value={tier.name}>{tier.name}</option>
        ))}
      </select>
      <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Upload
      </button>
    </Modal>
  );
};

export default ContentUploadModal;

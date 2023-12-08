import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { supabase } from '../../supabase/client';

type Content = {
  content_id: string;
  title: string;
  type: 'picture' | 'song' | 'video';
  tier: string[]; // Tier IDs stored as strings
  is_free: boolean;
};

type Tier = {
  id: number; // Tier ID as an integer
  name: string;
};

type ContentManagementModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ContentManagementModal: React.FC<ContentManagementModalProps> = ({ isOpen, onClose }) => {
  const [contentList, setContentList] = useState<Content[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [artistId, setArtistId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }
      setArtistId(userData?.user?.id || null);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      if (!artistId) return;

      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .select('*')
        .eq('artist_id', artistId);

      if (contentError) {
        console.error('Error fetching content:', contentError);
        return;
      }

      setContentList(contentData || []);

      const { data: tiersData, error: tiersError } = await supabase
        .from('tiers')
        .select('*');

      if (tiersError) {
        console.error('Error fetching tiers:', tiersError);
        return;
      }

      setTiers(tiersData || []);
    };

    fetchContent();
  }, [artistId]);

  const handleDeleteContent = async (contentId: string) => {
    const { error } = await supabase
      .from('content')
      .delete()
      .match({ content_id: contentId });

    if (error) {
      console.error('Error deleting content:', error);
    } else {
      setContentList(contentList.filter(content => content.content_id !== contentId));
    }
  };

  const handleAddContentTier = async (contentId: string, newTierId: number) => {
    const content = contentList.find(c => c.content_id === contentId);
    if (!content || content.tier.includes(newTierId.toString())) return;

    const updatedTiers = [...content.tier, newTierId.toString()];
    const isFree = updatedTiers.length === 0;

    const { error } = await supabase
      .from('content')
      .update({ tier: updatedTiers, is_free: !isFree })
      .match({ content_id: contentId });

    if (error) {
      console.error('Error updating content tier:', error);
    } else {
      setContentList(contentList.map(c => 
        c.content_id === contentId ? { ...c, tier: updatedTiers, is_free: !isFree } : c
      ));
    }
  };

  const handleRemoveContentTier = async (contentId: string, tierId: number) => {
    const content = contentList.find(c => c.content_id === contentId);
    if (!content) return;

    const updatedTiers = content.tier.filter(t => t !== tierId.toString());
    const isFree = updatedTiers.length === 0;

    const { error } = await supabase
      .from('content')
      .update({ tier: updatedTiers, is_free: isFree })
      .match({ content_id: contentId });

    if (error) {
      console.error('Error removing content tier:', error);
    } else {
      setContentList(contentList.map(c => 
        c.content_id === contentId ? { ...c, tier: updatedTiers, is_free: isFree } : c
      ));
    }
  };

  // Function to find tier name by ID
  const getTierNameById = (tierId: string) => {
    const tier = tiers.find(t => t.id.toString() === tierId);
    return tier ? tier.name : 'Unknown Tier';
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Content</h2>
      <div>
        {contentList.map(content => (
          <div key={content.content_id} className="mb-4 p-2 border-b">
            <h3 className="text-lg font-semibold text-gray-800">{content.title} ({content.type})</h3>
            <div className="my-2">
              <div className="flex flex-wrap mb-2">
                {content.tier.map(tierId => (
                  <div key={tierId} className="mr-2 mb-2 bg-blue-200 rounded-full px-3 py-1 text-black">
                    {getTierNameById(tierId)}
                    <button onClick={() => handleRemoveContentTier(content.content_id, parseInt(tierId))} className="ml-2 text-red-500">
                        &times;
                    </button>
                  </div>
                ))}
              </div>
              <select
                className="border text-black border-gray-300 rounded p-2 mr-2"
                defaultValue=""
                onChange={(e) => {
                  const selectedTierId = parseInt(e.target.value);
                  if (selectedTierId) {
                    handleAddContentTier(content.content_id, selectedTierId);
                    e.target.value = ""; // Reset the dropdown after selection
                  }
                }}
              >
                <option value="" disabled>Add Tier</option>
                {tiers.map(tier => (
                  <option key={tier.id} value={tier.id}>{tier.name}</option>
                ))}
              </select>
            </div>
            <button onClick={() => handleDeleteContent(content.content_id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
              Delete
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ContentManagementModal;

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { supabase } from '../../supabase/client';

type Content = {
  id: string;
  title: string;
  type: 'picture' | 'song' | 'video';
  tier: string | null;
};

type Tier = {
  id: string;
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
      .match({ id: contentId });

    if (error) {
      console.error('Error deleting content:', error);
    } else {
      setContentList(contentList.filter(content => content.id !== contentId));
    }
  };

  const handleEditContentTier = async (contentId: string, newTierId: string) => {
    const { error } = await supabase
      .from('content')
      .update({ tier: newTierId })
      .match({ id: contentId });

    if (error) {
      console.error('Error updating content tier:', error);
    } else {
      setContentList(contentList.map(content => 
        content.id === contentId ? { ...content, tier: newTierId } : content
      ));
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Content</h2>
      <div>
        {contentList.map(content => (
          <div key={content.id} className="mb-4 p-2 border-b">
            <h3 className="text-lg font-semibold text-gray-800">{content.title} ({content.type})</h3>
            <div className="my-2">
              <select
                value={content.tier || ''}
                onChange={(e) => handleEditContentTier(content.id, e.target.value)}
                className="border text-black border-gray-300 rounded p-2 mr-2"
              >
                <option value="">No Tier</option>
                {tiers.map(tier => (
                  <option key={tier.id} value={tier.id}>{tier.name}</option>
                ))}
              </select>
              <button onClick={() => handleEditContentTier(content.id, content.tier || '')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
                Save Tier
              </button>
            </div>
            <button onClick={() => handleDeleteContent(content.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
              Delete
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ContentManagementModal;

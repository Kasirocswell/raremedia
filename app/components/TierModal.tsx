import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { supabase } from '../../supabase/client';

type Tier = {
  id: number;
  name: string;
  price: number;
  artist_id: string;
};

type TierModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TierModal: React.FC<TierModalProps> = ({ isOpen, onClose }) => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [newTier, setNewTier] = useState({ name: '', price: 0 });
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
    const fetchTiers = async () => {
      if (!artistId) return;

      const { data, error } = await supabase
        .from('tiers')
        .select('*')
        .eq('artist_id', artistId);

      if (error) {
        console.error('Error fetching tiers:', error);
      } else {
        setTiers(data || []);
      }
    };

    fetchTiers();
  }, [artistId]);

  const handleCreateTier = async () => {
    if (!artistId) return;

    const { data, error } = await supabase
      .from('tiers')
      .insert([{ ...newTier, artist_id: artistId }]);

    if (error) {
      console.error('Error creating tier:', error);
    } else if (data) {
      setTiers([...tiers, ...data]);
      setNewTier({ name: '', price: 0 });
    }
  };

  const handleDeleteTier = async (tierId: number) => {
    const { error } = await supabase
      .from('tiers')
      .delete()
      .match({ id: tierId });

    if (error) {
      console.error('Error deleting tier:', error);
    } else {
      setTiers(tiers.filter(tier => tier.id !== tierId));
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Tiers</h2>
      <div>
        {tiers.map(tier => (
          <div key={tier.id} className="mb-2 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{tier.name}</h3>
              <p className="text-gray-600">${tier.price}</p>
            </div>
            <button onClick={() => handleDeleteTier(tier.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Create New Tier</h3>
        <input
          type="text"
          placeholder="Tier Name"
          value={newTier.name}
          onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
          className="border text-black border-gray-300 rounded p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={newTier.price}
          onChange={(e) => setNewTier({ ...newTier, price: parseFloat(e.target.value) })}
          className="border text-black border-gray-300 rounded p-2 mr-2"
        />
        <button onClick={handleCreateTier} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Tier
        </button>
      </div>
    </Modal>
  );
};

export default TierModal;

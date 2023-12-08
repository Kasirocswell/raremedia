'use client'

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import TierModal from '../components/TierModal'; // Adjust the import path as needed
import ContentUploadModal from '../components/ContentUploadModal'; // Adjust the import path as needed
import ContentManagementModal from '../components/ContentManagementModal'; // Adjust the import path as needed
import { getUser } from '../../store/userData'; // Adjust the import path as needed

const ArtistSettings: React.FC = () => {
  const [showTierModal, setShowTierModal] = useState(false);
  const [showContentUploadModal, setShowContentUploadModal] = useState(false);
  const [showContentManagementModal, setShowContentManagementModal] = useState(false);
  const { user } = getUser();

  const toggleTierModal = () => setShowTierModal(!showTierModal);
  const toggleContentUploadModal = () => setShowContentUploadModal(!showContentUploadModal);
  const toggleContentManagementModal = () => setShowContentManagementModal(!showContentManagementModal);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-2">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 text-red-800">Artist Settings</h1>

      <div className="mb-4">
        <button onClick={toggleTierModal} className="text-blue-500 hover:text-blue-700">
          Manage Subscription Tiers
        </button>
      </div>

      <div className="mb-4">
        <button onClick={toggleContentUploadModal} className="text-blue-500 hover:text-blue-700">
          Upload New Content
        </button>
      </div>

      <div className="mb-4">
        <button onClick={toggleContentManagementModal} className="text-blue-500 hover:text-blue-700">
          Manage Content
        </button>
      </div>

      <TierModal 
        isOpen={showTierModal} 
        onClose={toggleTierModal} 
      />

      <ContentUploadModal 
        isOpen={showContentUploadModal} 
        onClose={toggleContentUploadModal}
      />

      <ContentManagementModal 
        isOpen={showContentManagementModal} 
        onClose={toggleContentManagementModal}
      />
    </div>
  );
};

export default ArtistSettings;

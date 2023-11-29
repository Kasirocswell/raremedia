import React from 'react';

interface ArtistCardProps {
  imageUrl: string;
  name: string;
  description: string;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ imageUrl, name, description }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg hover:bg-gray-100 transition duration-200 ease-in-out">
      <img className="w-full" src={imageUrl} alt={name} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ArtistCard;

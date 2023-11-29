// GenreCard.tsx
import React from 'react';

interface GenreCardProps {
  image: string;
  title: string;
  description: string;
}

const GenreCard: React.FC<GenreCardProps> = ({ image, title, description }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
      <img className="w-full" src={image} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">
          {description}
        </p>
      </div>
    </div>
  );
};

export default GenreCard;

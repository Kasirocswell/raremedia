import React from 'react';

interface ImageComponentProps {
  url: string;
  title: string;
  description: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ url, title, description }) => {
  return (
    <div className="flex flex-col items-center max-w-sm mx-auto">
      <img src={url} alt={title} className="w-full rounded-lg object-cover" />
      <h3 className="mt-2 text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm text-center text-gray-600">{description}</p>
    </div>
  );
};

export default ImageComponent;

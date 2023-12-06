'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArtistCard from './ArtistCard';
import { supabase } from '../../supabase/client'; 

interface Content {
  content_id: string; // Adjusted to match your fetched data structure
  title: string;
  description: string;
  url: string;
  type: string;
}

const Categories: React.FC = () => {
  const [freeContent, setFreeContent] = useState<Content[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFreeContent = async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_free', true);

      if (error) {
        console.error('Error fetching free content:', error);
        return;
      }

      setFreeContent(data || []);
    };

    fetchFreeContent();
  }, []);

  const handleCardClick = (contentId: string) => {
    console.log('Clicked content ID:', contentId); // Debugging log
    if (contentId) {
      router.push(`content/${contentId}`);
    } else {
      console.error('Content ID is undefined');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Artist Categories</h1>

      {/* Free Content Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Free Content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {freeContent.map((content) => (
            <div key={content.content_id} onClick={() => handleCardClick(content.content_id)}>
              <ArtistCard
                name={content.title}
                description={content.description}
                imageUrl={content.url || 'default-image.png'}
              />
            </div>
          ))}
        </div>
        <div className="text-right mt-2">
          <a href="#" className="text-blue-500 hover:text-blue-700">See More</a>
        </div>
      </div>

      {/* ... other sections ... */}
    </div>
  );
};

export default Categories;

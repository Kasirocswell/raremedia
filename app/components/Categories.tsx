import React from 'react';
import ArtistCard from './ArtistCard'; // Adjust the import path as needed
import GenreCard from './GenreCard'; // Adjust the import path as needed

const Categories: React.FC = () => {
  // Sample data for genres and artists
  const genres = [
    { id: 1, title: "Pop", description: "Popular music", imageUrl: "bg1.png" },
    { id: 2, title: "Rock", description: "Rock music", imageUrl: "bg2.png" },
    { id: 3, title: "Jazz", description: "Jazz music", imageUrl: "bg3.png" },
    // Add more genres as needed
  ];

  const artists = [
    { id: 1, name: "Artist One", description: "Description of Artist One", imageUrl: "bg1.png" },
    { id: 2, name: "Artist Two", description: "Description of Artist Two", imageUrl: "bg2.png" },
    { id: 3, name: "Artist Three", description: "Description of Artist Three", imageUrl: "bg3.png" },
    // Add more artists as needed
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Artist Categories</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Genres</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {genres.map((genre) => (
            <GenreCard key={genre.id} title={genre.title} description={genre.description} image={'bg3.png'} />
          ))}
        </div>
        <div className="text-right mt-2">
          <a href="#" className="text-blue-500 hover:text-blue-700">Show More</a>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Artists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} name={artist.name} description={artist.description} imageUrl={artist.imageUrl} />
          ))}
        </div>
        <div className="text-right mt-2">
          <a href="#" className="text-blue-500 hover:text-blue-700">Show More</a>
        </div>
      </div>
    </div>
  );
};

export default Categories;


import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css'; // Import default styles

interface SongPlayerProps {
  url: string;
  title: string;
  artist: string;
  artwork: string;
}

const SongPlayer: React.FC<SongPlayerProps> = ({ url, title, artist, artwork }) => {
  return (
    <div className="song-player">
      {/* Artwork */}
      <div className="artwork-container">
        <img src={artwork} alt={title} className="song-artwork" />
      </div>

      {/* Song Info and Player */}
      <div className="song-info">
        <h3 className="song-title">{title}</h3>
        <p className="artist-name">{artist}</p>
      </div>
      <AudioPlayer
        src={url}
        onPlay={e => console.log("onPlay")}
        // other event handlers like onPause, onEnded, etc.
      />
    </div>
  );
};

export default SongPlayer;

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
      <div className="song-info">
        <img src={artwork} alt="Song Artwork" className="song-artwork" />
        <div className="song-details">
          <h3 className="song-title">{title}</h3>
          <p className="artist-name">{artist}</p>
        </div>
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

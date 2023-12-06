import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  title: string;
  artist: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title, artist }) => {
  return (
    <div className="video-player">
      <div className="video-info">
        <h3 className="video-title">{title}</h3>
        <p className="artist-name">{artist}</p>
      </div>
      <ReactPlayer
        url={url}
        controls
        playing
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default VideoPlayer;

import React from 'react';

interface ArtistStatsProps {
  subscriptionsCount: number;
  songsCount: number;
  videosCount: number;
  picturesCount: number;
  totalSongPlays: number;
  totalVideoPlays: number;
}

const ArtistStats: React.FC<ArtistStatsProps> = ({
  subscriptionsCount,
  songsCount,
  videosCount,
  picturesCount,
  totalSongPlays,
  totalVideoPlays
}) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Subscriptions" count={subscriptionsCount} />
        <StatCard title="Songs" count={songsCount} />
        <StatCard title="Videos" count={videosCount} />
        <StatCard title="Pictures" count={picturesCount} />
        <StatCard title="Total Song Plays" count={totalSongPlays} />
        <StatCard title="Total Video Plays" count={totalVideoPlays} />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; count: number }> = ({ title, count }) => {
  return (
    <div className="bg-gray-100 p-3 rounded shadow">
      <h3 className="text-md font-semibold">{title}</h3>
      <p className="text-lg">{count}</p>
    </div>
  );
};

export default ArtistStats;

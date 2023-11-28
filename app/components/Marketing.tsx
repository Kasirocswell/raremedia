import React from 'react';
import Link from 'next/link';

const Marketing: React.FC = () => {
  return (
    <div className="min-h-screen min-w-full">
      {/* Section 1 */}
      <div className="h-screen w-full bg-no-repeat bg-cover bg-center" style={{ backgroundImage: 'url(bg1.png)', minHeight: '100vh', minWidth: '100vw' }}>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl md:text-6xl font-bold text-white">Own Your Art</h1>
          <p className="text-lg md:text-xl text-white mt-4">Interact directly with your supporters</p>
          <Link href="/signup">
            <button className="mt-6 bg-red-800 text-white py-3 px-6 rounded-lg">Get Started</button>
          </Link>
        </div>
      </div>

      {/* Section 2 */}
      <div className="h-screen w-full bg-no-repeat bg-cover bg-center" style={{ backgroundImage: 'url(bg3.png)', minHeight: '100vh', minWidth: '100vw' }}>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl md:text-6xl font-bold text-white">Join Our Community</h1>
          <p className="text-lg md:text-xl text-white mt-4">Connect with creative minds</p>
          <Link href="/about">
            <button className="mt-6 bg-red-800 text-white py-3 px-6 rounded-lg">Learn More</button>
          </Link>
        </div>
      </div>

      {/* Section 3 */}
      <div className="h-screen w-full bg-no-repeat bg-cover bg-center" style={{ backgroundImage: 'url(bg2.png)', minHeight: '100vh', minWidth: '100vw' }}>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl md:text-6xl font-bold text-white">Create and Share</h1>
          <p className="text-lg md:text-xl text-white mt-4">Showcase your work to the world</p>
          <Link href="/signup">
            <button className="mt-6 bg-red-800 text-white py-3 px-6 rounded-lg">Join Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Marketing;

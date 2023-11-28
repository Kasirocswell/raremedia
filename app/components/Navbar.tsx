import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconHome, IconUser, IconSettings, IconLogout } from '@tabler/icons-react';
import { getUser } from '../../store/userData'; 
import { supabase } from '../../supabase/client'; 

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, setUser } = getUser(); // Accessing user and setUser from your custom hook or context
  const defaultProfilePic = 'download.png'; 

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.id) {
        const { data, error } = await supabase
          .from('users')
          .select('username, profile_picture')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else if (data) {
          setUser({ ...user, username: data.username, profilePicture: data.profile_picture });
        }
      }
    };

    fetchUserProfile();
  }, [user, setUser]);

  const toggleNavbar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Resetting user state to null after logout
  };

  const isSignedIn = user !== null;

  return (
    <div className={`fixed top-0 left-0 h-full ${isOpen ? 'w-24 bg-black' : 'w-2 bg-transparent'} transition-all duration-300 text-white`}>
      <div className="flex h-full flex-col justify-between">
        {isOpen && (
          <div>
            <div className="flex flex-col items-center p-4 w-[100px] h-[100px]">
              <Link href={`/user/${user?.username}`}>
                <img src={user?.profilePicture || defaultProfilePic} alt="Profile" className="rounded-full w-10 h-10 mb-2 cursor-pointer" />
              </Link>
              <p className="text-center">{user?.username || 'Username'}</p>
            </div>
            <nav>
              <ul>
                <li className="p-4 hover:bg-gray-700 flex items-center">
                  <Link href="/">
                    <IconHome size={20} className="cursor-pointer" />
                  </Link>
                </li>
                <li className="p-4 hover:bg-gray-700 flex items-center">
                  <Link href="/profile">
                    <IconUser size={20} className="cursor-pointer" />
                  </Link>
                </li>
                <li className="p-4 hover:bg-gray-700 flex items-center">
                  <Link href="/settings">
                    <IconSettings size={20} className="cursor-pointer" />
                  </Link>
                </li>
                {isSignedIn && (
                  <li className="p-4 hover:bg-gray-700 flex items-center">
                    <button onClick={handleLogout} className="focus:outline-none">
                      <IconLogout size={20} className="cursor-pointer" />
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-4">
          <button onClick={toggleNavbar} className="focus:outline-none">
            {isOpen ? <IconArrowNarrowLeft size={20} /> : <IconArrowNarrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconHome, IconUser, IconSettings, IconLogout } from '@tabler/icons-react';
import { getUser } from '../../store/userData'; 
import { supabase } from '../../supabase/client'; 
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, setUser } = getUser();
  const [isArtist, setIsArtist] = useState(false);
  const defaultProfilePic = 'download.png'; 
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.id) return;
  
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('artist_id', user.id)
        .single();
  
      if (artistError) {
        console.error('Error checking artist status:', artistError);
        return;
      }
  
      setIsArtist(!!artistData);
  
      let profileData, error;
  
      if (artistData) {
        ({ data: profileData, error } = await supabase
          .from('artists')
          .select('artist_name, profile_picture')
          .eq('artist_id', user.id)
          .single());
      } else {
        ({ data: profileData, error } = await supabase
          .from('users')
          .select('username, profile_picture')
          .eq('id', user.id)
          .single());
      }
  
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
  
      if (profileData) {
        if ('artist_name' in profileData) {
          setUser({ 
            ...user, 
            username: profileData.artist_name, 
            profilePicture: profileData.profile_picture 
          });
        } else if ('username' in profileData) {
          setUser({ 
            ...user, 
            username: profileData.username, 
            profilePicture: profileData.profile_picture 
          });
        }
      }
    };
  
    fetchUserProfile();
  }, [user?.id, setUser]);

  const toggleNavbar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
  
      if (error) {
        throw error;
      }
  
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isSignedIn = user !== null;

  return (
    <div className={`fixed top-0 left-0 h-full ${isOpen ? 'w-24 bg-black' : 'w-2 bg-transparent'} transition-all duration-300 text-white`}>
      <div className="flex h-full flex-col justify-between">
        {isOpen && (
          <div>
            <div className="flex flex-col items-center p-4 w-[100px] h-[100px]">
              <Link href={isSignedIn ? (isArtist ? `/artist/${user?.id}` : `/user/${user?.username}`) : '/auth'}>
                <img src={user?.profilePicture || defaultProfilePic} alt="Profile" className="rounded-full w-10 h-10 mb-2 cursor-pointer" />
              </Link>
              {isSignedIn && <p className="text-center">{user?.username || 'Username'}</p>}
            </div>
            <nav>
              <ul>
                <li className="p-4 hover:bg-gray-700 flex items-center">
                  <Link href="/">
                    <IconHome size={20} className="cursor-pointer" />
                  </Link>
                </li>
                {isSignedIn && (
                  <>
                    <li className="p-4 hover:bg-gray-700 flex items-center">
                      <Link href={isArtist ? "/artist-profile" : "/profile"}>
                        <IconUser size={20} className="cursor-pointer" />
                      </Link>
                    </li>
                    <li className="p-4 hover:bg-gray-700 flex items-center">
                      <Link href="/settings">
                        <IconSettings size={20} className="cursor-pointer" />
                      </Link>
                    </li>
                    <li className="p-4 hover:bg-gray-700 flex items-center">
                      <button onClick={handleLogout} className="focus:outline-none">
                        <IconLogout size={20} className="cursor-pointer" />
                      </button>
                    </li>
                  </>
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

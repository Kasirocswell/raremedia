'use client'

import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Marketing from './components/Marketing';
import Categories from './components/Categories';
import { getUser } from '../store/userData'; // Adjust the path to your userData file
import { supabase } from '../supabase/client'; // Adjust the path as per your setup

const HomePage: React.FC = () => {
  const { user, setUser } = getUser(); // Use the getUser hook to access user and setUser

  useEffect(() => {
    console.log("Setting up auth listener");
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", session);
      setUser(session?.user || null); // Update the user state using setUser
    });

    // Cleanup the listener when the component unmounts
    return () => {
      console.log("Unsubscribing auth listener");
      authListener.subscription.unsubscribe();
    };
  }, [setUser]); // Add setUser to the dependency array

  console.log("User state in HomePage:", user);
  const isSignedIn = user !== null;
  console.log("Is signed in on HomePage:", isSignedIn);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          {isSignedIn ? (
            <Categories />
          ) : (
            <Marketing />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

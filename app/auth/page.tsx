'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "../../supabase/client"; 
import Navbar from '../components/Navbar';
import { getUser } from '../../store/userData'; // Adjust the path to your userData file

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); 
  const [isClient, setIsClient] = useState(false); 
  const router = useRouter();
  const { setUser } = getUser(); // Use the getUser hook to access setUser

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let result;
  
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
  
      // After successful sign-up, insert the user data into the 'users' table
      if (result.data && result.data.user) {
        const { data, error } = await supabase.from('users').insert([
          { id: result.data.user.id, email: result.data.user.email }
        ]);
  
        if (error) {
          console.error('Error inserting user data:', error);
        }
      }
    }
  
    const { data, error } = result;
  
    if (error) {
      console.error('Error:', error.message);
    } else {
      // Update the user in the custom user context
      setUser(data.user);
      if (isClient) {
        router.push('/');
      }
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-red-500">
      <Navbar />
      <div className="w-full max-w-xs">
        <form onSubmit={handleLogin} className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-red-500 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-6">
            <label className="block text-red-500 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center justify-between">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
              type="submit"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
            <a
              className="font-bold text-sm text-red-500 hover:text-red-800"
              href="#"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;

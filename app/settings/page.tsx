'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { getUser } from '../../store/userData'; // Adjust the import path as needed
import Navbar from '../components/Navbar';

interface Subscription {
  subscription_id: string;
  user_id: string;
  artist_id: string;
  tier: string;
  price: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Settings: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const { user } = getUser(); // Accessing user from your custom hook or context

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (user && user.id) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id); // Filter by the current user's ID

        if (error) {
          console.error('Error fetching subscriptions:', error);
        } else {
          setSubscriptions(data as Subscription[]);
        }
      }
    };

    fetchSubscriptions();
  }, [user]);

  const handleEdit = (subscriptionId: string) => {
    // Placeholder for edit functionality
    console.log('Edit subscription:', subscriptionId);
  };

  const handleDelete = (subscriptionId: string) => {
    // Placeholder for delete functionality
    console.log('Delete subscription:', subscriptionId);
  };

  return (
    <div className="container mx-auto p-4">
        <Navbar />
      <h1 className="text-xl font-bold mb-4">Your Subscriptions</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Artist</th>
            <th className="px-4 py-2">Tier</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription.subscription_id}>
              <td className="border px-4 py-2">{subscription.artist_id}</td>
              <td className="border px-4 py-2">{subscription.tier}</td>
              <td className="border px-4 py-2">{subscription.price}</td>
              <td className="border px-4 py-2">{subscription.start_date}</td>
              <td className="border px-4 py-2">{subscription.end_date}</td>
              <td className="border px-4 py-2">{subscription.status}</td>
              <td className="border px-4 py-2">
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleEdit(subscription.subscription_id)}
                >
                  Edit
                </button>
                <button 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() => handleDelete(subscription.subscription_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Settings;

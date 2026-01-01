
"use client";
import { useAuth } from '@/app/context/AuthContext';

// Extend User type locally to include optional fields for profile display
type UserProfile = import("@/app/context/authApi").User & {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  created_at?: string;
};
import React from 'react';


export default function ProfilePage() {
  const { user, loading } = useAuth() as { user: UserProfile | null; loading: boolean };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-[26px] font-semi text-gray-800 mb-4">Please log in to view your profile</h1>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 className="text-[26px] font-semi text-gray-800 mb-8">Welcome, {user.name}!</h1>
      <h2 className="text-lg text-gray-600 mb-6">My Account Information</h2>

      <form className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Full-name *</label>
          <input 
            type="text" 
            value={user.name}
            placeholder="Enter Name" 
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
            readOnly
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">E-mail address {user.email_verified ? '(Verified)' : ''}</label>
            <input 
              type="email" 
              value={user.email || ''}
              placeholder="No email provided" 
              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
              readOnly
            />
          </div>
          {!user.email_verified && (
            <button type="button" className="md:mt-7 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Verify Email
            </button>
          )}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Phone Number *</label>
            <input 
              type="text" 
              value={user.phone || ''}
              placeholder="No phone provided" 
              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
              readOnly
            />
          </div>
        </div>

        {/* Birthday and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Birthday *</label>
            <input 
              type="date" 
              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gender *</label>
            <select className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all appearance-none">
              <option value="">Enter Name</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* User Type */}
        {/* <div>
          <label className="block text-sm font-medium mb-2">Account Type</label>
          <input 
            type="text" 
            value={user.user_type || 'customer'} 
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all capitalize"
            readOnly
          />
        </div> */}

        {/* Balance */}
        {/* <div>
          <label className="block text-sm font-medium mb-2">Account Balance</label>
          <input 
            type="text" 
            value={`৳${user.balance || 0}`}
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
            readOnly
          />
        </div> */}

        {/* Full Address */}
        <div>
          <label className="block text-sm font-semibold mb-2">Full Address</label>
          <textarea 
            rows={3}
            value={user.address || ''}
            placeholder="No address provided" 
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
            readOnly
          ></textarea>
        </div>

        {/* Location Details */}
        {(user.city || user.state || user.country || user.postal_code) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.country && (
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input 
                  type="text" 
                  value={user.country}
                  className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
                  readOnly
                />
              </div>
            )}
            {user.state && (
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input 
                  type="text" 
                  value={user.state}
                  className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
                  readOnly
                />
              </div>
            )}
            {user.city && (
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input 
                  type="text" 
                  value={user.city}
                  className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
                  readOnly
                />
              </div>
            )}
            {user.postal_code && (
              <div>
                <label className="block text-sm font-medium mb-2">Postal Code</label>
                <input 
                  type="text" 
                  value={user.postal_code}
                  className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
                  readOnly
                />
              </div>
            )}
          </div>
        )}

        {/* Account Created Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Member Since</label>
          <input 
            type="text" 
            value={user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
            readOnly
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-12 rounded-lg transition-transform active:scale-95"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
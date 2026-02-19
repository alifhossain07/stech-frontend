"use client";
import { useAuth } from '@/app/context/AuthContext';
import { updateProfile } from "@/app/context/authApi";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Extend User type locally to include optional fields for profile display
type UserProfile = import("@/app/context/authApi").User & {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  created_at?: string;
};

export default function ProfilePage() {
  const { user, loading, accessToken } = useAuth() as { user: UserProfile | null; loading: boolean; accessToken: string | null };
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMessage(null);

    if (password && password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: 'error' });
      return;
    }

    if (!user || !accessToken) return;

    setIsUpdating(true);
    try {
      const payload: { name: string; phone?: string; password?: string } = {
        name,
        phone,
      };
      if (password) {
        payload.password = password;
      }

      const res = await updateProfile(payload, accessToken);
      if (res.result) {
        setMessage({ text: res.message || "Profile updated successfully", type: 'success' });
        setPassword("");
        setConfirmPassword("");
        // Ideally we should reload the user here, but for now we rely on the local state update for fields
      } else {
        setMessage({ text: res.message || "Failed to update profile", type: 'error' });
      }
    } catch (err: unknown) {
      // Check if message is an array from backend (Validation Error)
      let errorMsg = "An error occurred";
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        // Safe access if it's not an Error instance but has message
        errorMsg = String((err as { message: unknown }).message);
      }
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

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
      <h1 className="text-[26px] font-semi text-gray-800 mb-8">Welcome, {name}!</h1>
      <h2 className="text-[20px] font-semibold text-black mb-6">My Account Information</h2>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleUpdateProfile}>
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Full-name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Phone Number *</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="No phone provided"
              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className='font-semibold text-[20px] '>Update Password</div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            New Password *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter New Password (Optional)"
            className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Dealer Information Section */}
        {(user.is_dealer == 1 || user.type?.toLowerCase() === "dealer" || user.user_type?.toLowerCase() === "dealer") && (
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-semibold text-orange-600 border-b pb-2">Dealer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Dealer Code</label>
                <input
                  type="text"
                  value={user.dealer_code || "N/A"}
                  className="w-full p-3 bg-gray-50 border border-transparent rounded-lg outline-none cursor-default"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dealer NID</label>
                <input
                  type="text"
                  value={user.dealer_nid || "N/A"}
                  className="w-full p-3 bg-gray-50 border border-transparent rounded-lg outline-none cursor-default"
                  readOnly
                />
              </div>
            </div>
          </div>
        )}

        {/* Location Details - Read Only */}
        {(user.city || user.state || user.country || user.postal_code) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-75 mt-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Location Details</h3>
            </div>
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
      </form>
      <div className="flex justify-end pt-4">
        <button
          onClick={(e) => handleUpdateProfile(e)}
          disabled={isUpdating}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-8 rounded-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}
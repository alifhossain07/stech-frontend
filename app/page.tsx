"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import PublicHome from "@/components/Pages/Home/PublicHome";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect dealers to their dedicated dashboard
  React.useEffect(() => {
    if (!loading && user?.type?.toLowerCase() === "dealer") {
      router.push("/dealer");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If dealer is logged in, show a loading spinner while redirecting
  if (user?.type?.toLowerCase() === "dealer") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Otherwise, show the regular public homepage
  return <PublicHome />;
}

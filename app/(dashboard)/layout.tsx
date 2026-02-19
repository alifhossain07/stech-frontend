"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const isDealer = user.type?.toLowerCase() === "dealer" || user.is_dealer == 1;
      if (isDealer && pathname !== "/profile") {
        router.push("/profile");
      }
    }
  }, [user, loading, pathname, router]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-10">
      <div className="w-11/12 mx-auto px-4 flex flex-col lg:flex-row gap-8">

        {/* Sidebar Container */}
        <aside className="w-full lg:w-[320px] shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
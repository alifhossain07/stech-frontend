"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface PageData {
  id: number;
  title: string;
  slug: string;
  type: string;
  content: string;
  meta_title: string;
  meta_description: string;
  meta_image: string | null;
  keywords: string;
  created_at: string;
  updated_at: string;
}

interface PageApiResponse {
  result: boolean;
  message: string;
  data: PageData;
}

export default function FooterPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPageData(slug);
    }
  }, [slug]);

  const fetchPageData = async (pageSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/pages/${pageSlug}`);
      const result: PageApiResponse = await response.json();
      
      if (result.result && result.data) {
        setPageData(result.data);
      } else {
        setError("Page not found");
      }
    } catch (err) {
      console.error("Error fetching page data:", err);
      setError("Failed to load page");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-11/12 mx-auto my-10 flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="w-11/12 mx-auto my-10 flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">{error || "Page not found"}</div>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto my-10 flex justify-center">
      <div className="bg-white rounded-xl p-5 md:p-6 lg:p-8 max-w-4xl w-full border-4 border-orange-600">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          {pageData.title}
        </h1>

        {/* Page Content */}
        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
          style={{
            lineHeight: "1.8",
          }}
        />
      </div>
    </div>
  );
}


import { Metadata } from "next";
import { notFound } from "next/navigation";

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

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

async function getPageData(slug: string): Promise<PageData | null> {
  try {
    const res = await fetch(`${API_BASE}/pages/${slug}`, {
      headers: {
        "Accept": "application/json",
        "System-Key": SYSTEM_KEY,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) return null;

    const result: PageApiResponse = await res.json();
    if (result.result && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const pageData = await getPageData(params.slug);

  if (!pageData) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: pageData.meta_title || pageData.title,
    description: pageData.meta_description,
    keywords: pageData.keywords,
    openGraph: {
      title: pageData.meta_title || pageData.title,
      description: pageData.meta_description,
      images: pageData.meta_image ? [{ url: pageData.meta_image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: pageData.meta_title || pageData.title,
      description: pageData.meta_description,
      images: pageData.meta_image ? [pageData.meta_image] : [],
    },
  };
}

export default async function FooterPage({
  params,
}: {
  params: { slug: string };
}) {
  const pageData = await getPageData(params.slug);

  if (!pageData) {
    notFound();
  }

  return (
    <div className="w-11/12 mx-auto my-10 flex justify-center">
      <div className="bg-white rounded-xl p-5 md:p-6 lg:p-8 max-w-4xl w-full border-4 border-orange-600 shadow-lg">
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


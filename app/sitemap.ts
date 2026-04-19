import { MetadataRoute } from 'next'

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;
const SITE_URL = 'https://sannai.com.bd';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Define Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/offers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/authentication`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/checkout`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/products/new-arrivals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/products/flash-sale`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/products/featured`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/dealer/registration`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/dealer`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/pages/footerwarranty`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/pages/shipping`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/pages/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/pages/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/pages/return-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/trackorder`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/registration`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.64 },
    { url: `${SITE_URL}/dealer/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.64 },
    { url: `${SITE_URL}/dealer/new-releases`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.64 },
    { url: `${SITE_URL}/dealer/best-deals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.64 },
    { url: `${SITE_URL}/dealer/top-sellers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.64 },
    { url: `${SITE_URL}/dealer/todays-offer`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.64 },
    { url: `${SITE_URL}/dealer/all-products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.64 },
    { url: `${SITE_URL}/dealer/all-reviews`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.64 },
    { url: `${SITE_URL}/dealer/help`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.64 },
  ];

  // 2. Fetch All Products to include dynamic slugs
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    // We try to fetch a large number of products for the sitemap
    const res = await fetch(`${API_BASE}/products/search?per_page=1000`, {
      headers: {
        Accept: 'application/json',
        'System-Key': SYSTEM_KEY,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      const products = json.data || [];

      interface Product {
        slug: string;
      }

      productRoutes = products.map((product: Product) => ({
        url: `${SITE_URL}/${product.slug}`,
        lastModified: new Date(), // Ideally we'd have a product.updated_at
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Sitemap product fetch error:', error);
  }

  return [...staticRoutes, ...productRoutes];
}

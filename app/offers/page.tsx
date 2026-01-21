"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

type Offer = {
  id: number;
  title: string;
  slug: string;
  imageSrc: string; // local path in /public/images
  imageAlt: string;
  banner?: string;
};

/*
const mockOffers: Offer[] = [
  {
    id: 1,
    title: "Sannai ANC T10",
    slug: "sannai-anc-t10",
    imageSrc: "/images/offer1.webp",
    imageAlt: "Sannai ANC T10 earphones",
  },
  {
    id: 2,
    title: "Smart 10000mAh Power Bank",
    slug: "smart-10000mah-powerbank",
    imageSrc: "/images/offer2.webp",
    imageAlt: "Smart 10000mAh power bank",
  },
  {
    id: 3,
    title: "Sannai W-30 Gyro Charger",
    slug: "sannai-w30-gyro",
    imageSrc: "/images/offer3.webp",
    imageAlt: "Sannai W-30 Gyro fast charger",
  },
  {
    id: 4,
    title: "Samsung Special 25W Fast Charger",
    slug: "samsung-25w-fast-charger",
    imageSrc: "/images/offer4.webp",
    imageAlt: "Samsung special 25W fast charger",
  },
];
*/

export default function OffersPage() {
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("/api/products/flashdealsall");
        if (res.data.success) {
          setOffers(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <main className="w-full bg-white h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-[60vh] bg-white">
      <section className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-8 sm:py-10">
        <div className="text-center mb-6 xl:mt-10 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-500">
            Latest Offers
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {offers.map((offer) => (
            <Link
              key={offer.id}
              href={`/products/flashsale?slug=${offer.slug}`}
              className="block rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 bg-white"
            >
              <div className="relative w-full h-52 sm:h-64 md:h-72">
                <Image
                  src={offer.banner || offer.imageSrc}
                  alt={offer.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
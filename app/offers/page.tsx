"use client";

import Image from "next/image";
import Link from "next/link";

type Offer = {
  id: number;
  title: string;
  slug: string;
  imageSrc: string; // local path in /public/images
  imageAlt: string;
};

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

export default function OffersPage() {
  // later you can replace mockOffers with data from an API
  // e.g. const { data: offers } = useSWR("/api/offers", fetcher);
  const offers = mockOffers;

  return (
    <main className="w-full bg-white">
      <section className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-8 sm:py-10">
        {/* Page heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-500">
            Latest Offers
          </h1>
        </div>

        {/* 2x2 grid of offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {offers.map((offer) => (
            <Link
              key={offer.id}
              href={`/products/${offer.slug}`}
              className="block rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 bg-white"
            >
              <div className="relative w-full h-52 sm:h-64 md:h-72">
                <Image
                  src={offer.imageSrc}
                  alt={offer.imageAlt}
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
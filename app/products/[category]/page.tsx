"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ProductCard from "@/components/ui/ProductCard";
import { Range } from "react-range";
type ProductType = {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
  featured_specs?: { text: string; icon: string }[];
};

const CategoryPage = () => {
  const params = useParams();
  const category = params.category;


  const [products, setProducts] = useState<ProductType[]>([]);
  const [subtitle, setSubtitle] = useState<string>("");   // <-- new
  const [title, setTitle] = useState<string>("");         // optional
  const [loading, setLoading] = useState(true);
  const MIN = 0;
  const MAX = 12000;
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(12000);


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${category}`);

        setProducts(res.data.products);
        setSubtitle(res.data.subtitle);  // <-- new
        setTitle(res.data.title);        // optional
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="md:w-11/12 w-11/12 pt-10 pb-[56px] mx-auto">

      {/* Dynamic Category Title */}
      <h1 className="text-3xl font-semibold mb-2 capitalize">
        {title}
      </h1>

      {/* Dynamic Subtitle */}
      {subtitle && (
        <p className="text-gray-600 mb-6">{subtitle}</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (

        <div className="flex justify-between  gap-4 ">
          <div className="w-[355px]">
            <div className="w-full bg-[#f4f4f4] rounded-md shadow p-4 border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-[#ff6b01] text-[22px]">Product Filter</h2>
                <button className="text-orange-500 text-[12px]">Clear all</button>
              </div>

              {/* Availability */}
              <div className="border-t py-3">
                <h3 className="font-medium text-[18px] mb-2">Availability</h3>
                <div className="space-y-1 text-[#626262] text-[16px]">
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> In Stock</label>
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> Out of Stock</label>
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> Pre-Order</label>
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> Up Coming</label>
                </div>
              </div>

              {/* Price Range */}
              <div className="border-t py-3">
                <h3 className="font-medium mb-2">Price Range</h3>

                <p className="text-[24px] mb-4 text-center font-medium">
                  ৳{minPrice} — ৳{maxPrice}
                </p>

                <Range
                  step={100}
                  min={MIN}
                  max={MAX}
                  values={[minPrice, maxPrice]}
                  onChange={(values) => {
                    setMinPrice(values[0]);
                    setMaxPrice(values[1]);
                  }}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="w-full h-2 rounded-full bg-gray-200 relative"
                    >
                      <div
                        className="absolute h-2 bg-orange-500 rounded-full"
                        style={{
                          left: `${(minPrice / MAX) * 100}%`,
                          width: `${((maxPrice - minPrice) / MAX) * 100}%`,
                        }}
                      />
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      className="w-4 h-4 bg-white border border-gray-400 rounded-full shadow"
                    />
                  )}
                />

                <div className="flex justify-between gap-5 text-sm mt-2">
                  <span className="w-1/2 py-2 text-center bg-[#e3e3e3]">{minPrice}</span>
                  <span className="w-1/2 py-2 text-center bg-[#e3e3e3]">{maxPrice}</span>
                </div>
              </div>
              {/* Device List */}
              <div className="border-t py-3">
                <h3 className="font-medium text-[18px] mb-2">Device List</h3>
                <div className="space-y-1 text-[16px] text-[#626262]">
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> I Phone</label>
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> Oppo</label>
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> Samsung</label>
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> Redmi</label>
                </div>
              </div>

              {/* Best Selling */}
              <div className="border-t py-3">
                <h3 className="font-medium text-[18px] mb-2">Best Selling</h3>
                <div className="space-y-1 text-[16px] text-[#626262]">
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> Power Bank</label>
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> Phone Charger</label>
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> Adapter</label>
                  <label className="flex gap-2 items-center"><input className="accent-orange-500" type="checkbox" /> Cover</label>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 w-[1368px] xl:grid-cols-4 gap-7">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>


      )}
    </div>
  );
};

export default CategoryPage;

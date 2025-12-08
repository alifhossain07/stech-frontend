"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import ProductCard from "@/components/ui/ProductCard";
import { Range } from "react-range";
import { FiFilter } from "react-icons/fi"; // make sure react-icons is installed
import CategoryPageSkeleton from "@/components/Skeletons/CategoryPageSkeleton";
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
   current_stock: number;
  product_compatible?: string[]; 
};

const PRODUCTS_PER_PAGE = 12;

const CategoryPage = () => {
  const params = useParams();
  const category = params.category;
const searchParams = useSearchParams();
const searchQuery = typeof category === "string" && category === "search"
  ? searchParams.get("q") || ""
  : "";
const isSearchMode = category === "search";
  const [products, setProducts] = useState<ProductType[]>([]);
  const [subtitle, setSubtitle] = useState<string>("");
  // const [title, setTitle] = useState<string>("");
  // const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const MIN = 0;
  const MAX = 12000;
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(12000);

  const [sortOption, setSortOption] = useState("default");
  

  const [isFilterOpen, setIsFilterOpen] = useState(false); // mobile filter
type AvailabilityStatus = "inStock" | "outOfStock" | "preOrder" | "upcoming" | null;

const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityStatus>(null);

// e.g. "I Phone", "Oppo", "Samsung", "Redmi"
type DeviceFilter = "I Phone" | "Oppo" | "Samsung" | "Redmi" | null;
const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>(null);

const toggleDevice = (device: Exclude<DeviceFilter, null>) => {
  setDeviceFilter((prev) => (prev === device ? null : device));
};

const toggleAvailability = (key: Exclude<AvailabilityStatus, null>) => {
  setAvailabilityFilter((prev) => (prev === key ? null : key));
};
  // Fetch products from API
  useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url: string;

      if (isSearchMode) {
        // search mode: /products/search?q=Remax hits this
        url = `/api/products/search?name=${encodeURIComponent(searchQuery)}`;
      } else {
        // category mode
        url = `/api/products/category/${category}`;
      }

      const res = await axios.get(url);
      setProducts(res.data.products || []);
      // setTotalProducts(res.data.total || (res.data.products?.length ?? 0));
      setSubtitle(res.data.subtitle || "");
      // setTitle(res.data.title || (isSearchMode && searchQuery ? `Search: ${searchQuery}` : String(category)));
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [category, isSearchMode, searchQuery]);

const filteredProducts = products.filter((p) => {
  // 1) Price filter
  if (p.price < minPrice || p.price > maxPrice) return false;

  // 2) Availability filter (using current_stock)
  if (availabilityFilter) {
    const isInStock = p.current_stock > 0;
    const isOutOfStock = p.current_stock === 0;

    if (availabilityFilter === "inStock" && !isInStock) return false;
    if (availabilityFilter === "outOfStock" && !isOutOfStock) return false;

    if (availabilityFilter === "preOrder") {
      // Hook real pre-order logic here later
      return false;
    }
    if (availabilityFilter === "upcoming") {
      // Hook real upcoming logic here later
      return false;
    }
  }

  // 3) Device compatibility filter
  if (deviceFilter) {
    const compatList = p.product_compatible ?? [];
    // simple contains check; you can normalize case if needed
    const matches = compatList.includes(deviceFilter);
    if (!matches) return false;
  }

  return true;
});

  // Sort products based on selected option
    const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    if (sortOption === "a-z") return a.name.localeCompare(b.name);
    return 0; // default
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const visibleProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
  };

  const SidebarContent = (
    <div className="w-full bg-[#f4f4f4] h-full xl:h-auto rounded-md xl:rounded-md shadow p-4 border overflow-y-auto xl:overflow-visible">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-[#ff6b01] text-lg md:text-[22px]">
          Product Filter
        </h2>
        <button
  className="text-orange-500 text-xs md:text-[12px]"
  onClick={() => {
  setMinPrice(MIN);
  setMaxPrice(MAX);
  setAvailabilityFilter(null);
  setDeviceFilter(null);
}}
>
  Clear all
</button>
      </div>

      {/* Availability */}
      <div className="border-t py-3">
  <h3 className="font-medium text-base md:text-[18px] mb-2">
    Availability
  </h3>
  <div className="space-y-1 text-[#626262] text-sm md:text-[16px]">
    <label className="flex gap-2 items-center">
      <input
  className="accent-orange-500"
  type="checkbox"
  checked={availabilityFilter === "inStock"}
  onChange={() => toggleAvailability("inStock")}
/>{" "}
      In Stock
    </label>
    <label className="flex gap-2 items-center">
      <input
  className="accent-orange-500"
  type="checkbox"
  checked={availabilityFilter === "outOfStock"}
  onChange={() => toggleAvailability("outOfStock")}
/>{" "}
      Out of Stock
    </label>
    <label className="flex gap-2 items-center">
      <input
  className="accent-orange-500"
  type="checkbox"
  checked={availabilityFilter === "preOrder"}
  onChange={() => toggleAvailability("preOrder")}
/>{" "}
      Pre-Order
    </label>
    <label className="flex gap-2 items-center">
      <input
  className="accent-orange-500"
  type="checkbox"
  checked={availabilityFilter === "upcoming"}
  onChange={() => toggleAvailability("upcoming")}
/>{" "}
      Up Coming
    </label>
  </div>
</div>

      {/* Price Range */}
      <div className="border-t py-3">
        <h3 className="font-medium text-base md:text-[18px] mb-2">
          Price Range
        </h3>

        <p className="text-2xl md:text-[24px] my-4 text-center font-medium">
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

        <div className="flex justify-between gap-3 text-xs md:text-sm mt-4">
          <span className="w-1/2 py-2 text-center bg-[#e3e3e3]">
            {minPrice}
          </span>
          <span className="w-1/2 py-2 text-center bg-[#e3e3e3]">
            {maxPrice}
          </span>
        </div>
      </div>

      {/* Device List */}
      <div className="space-y-1 text-sm md:text-[16px] text-[#626262]">
         <h3 className="font-semibold text-black text-base md:text-[18px] mb-2">
    Device List
  </h3>
  <label className="flex gap-2 items-center">
    <input
      className="accent-orange-500"
      type="checkbox"
      checked={deviceFilter === "I Phone"}
      onChange={() => toggleDevice("I Phone")}
    />{" "}
    I Phone
  </label>
  <label className="flex gap-2 items-center">
    <input
      className="accent-orange-500"
      type="checkbox"
      checked={deviceFilter === "Oppo"}
      onChange={() => toggleDevice("Oppo")}
    />{" "}
    Oppo
  </label>
  <label className="flex gap-2 items-center">
    <input
      className="accent-orange-500"
      type="checkbox"
      checked={deviceFilter === "Samsung"}
      onChange={() => toggleDevice("Samsung")}
    />{" "}
    Samsung
  </label>
  <label className="flex gap-2 items-center">
    <input
      className="accent-orange-500"
      type="checkbox"
      checked={deviceFilter === "Redmi"}
      onChange={() => toggleDevice("Redmi")}
    />{" "}
    Redmi
  </label>
</div>

     
       {/* Best Selling */}
      {isSearchMode && (
        <div className="border-t py-3">
          <h3 className="font-medium text-base md:text-[18px] mb-2">
            Best Selling
          </h3>
          <div className="space-y-1 text-sm md:text-[16px] text-[#626262]">
            <label className="flex gap-2 items-center">
              <input className="accent-orange-500" type="checkbox" /> Power Bank
            </label>
            <label className="flex gap-2 items-center">
              <input className="accent-orange-500" type="checkbox" /> Phone
              Charger
            </label>
            <label className="flex gap-2 items-center">
              <input className="accent-orange-500" type="checkbox" /> Adapter
            </label>
            <label className="flex gap-2 items-center">
              <input className="accent-orange-500" type="checkbox" /> Cover
            </label>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-11/12 pt-6 md:pt-10 pb-[56px] mx-auto">
      {/* Dynamic Category Title */}
      {/* <h1 className="text-2xl md:text-3xl font-semibold mb-2 capitalize">
        {title}
      </h1> */}

      {/* Dynamic Subtitle */}
      {subtitle && (
        <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
          {subtitle}
        </p>
      )}

      {loading ? (
        <CategoryPageSkeleton />
      ) : (
        <>
          {/* Mobile Filter + Sort Bar */}
          <div className="flex xl:hidden items-center justify-between bg-[#f4f4f4] rounded-xl p-3 mb-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-[#626262]"
            >
              <FiFilter className="text-lg" />
              <span>Filter</span>
            </button>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-2 py-2 text-xs text-[#626262] rounded-md bg-white"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="a-z">A-Z</option>
            </select>
          </div>

          {/* Mobile Filter Drawer + Backdrop */}
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/40 z-40 xl:hidden transition-opacity duration-300 ${
              isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsFilterOpen(false)}
          />

          {/* Sliding Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white z-50 xl:hidden flex flex-col transform transition-transform duration-300 ${
              isFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-semibold text-base">Filters</span>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-sm text-gray-500"
              >
                Close
              </button>
            </div>
            <div className="flex-1 p-4">{SidebarContent}</div>
          </div>

          <div className="flex flex-col xl:flex-row justify-between gap-6 xl:gap-4">
            {/* Sidebar Filters (Desktop/Laptop) */}
            <div className="hidden xl:block xl:w-[340px] 2xl:w-[355px]">
              {SidebarContent}
            </div>

            {/* Products List */}
            <div className="w-full xl:flex-1 2xl:w-[1368px]">
              {/* Showing products + Sort (Desktop/Laptop) */}
              <div className="hidden xl:flex justify-between rounded-xl bg-[#f4f4f4] p-4 mb-6 items-center">
                <div className="text-[16px] text-[#626262] font-medium">
                Showing {visibleProducts.length} out of {sortedProducts.length} Products
                  
                </div>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border px-2 py-2 text-[#626262] rounded-md text-sm"
                >
                  <option value="default">Default</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="a-z">A-Z</option>
                </select>
              </div>

              {/* Showing products (Mobile/LG) text only */}
              <div className="xl:hidden mb-3 text-xs text-[#626262]">
       Showing {visibleProducts.length} out of {sortedProducts.length} Products
              </div>

              <div className="grid w-full grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 xl:gap-7">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8 md:mt-10">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 border rounded-md text-xs md:text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    &lt; Back
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1.5 border rounded-md text-xs md:text-sm font-medium ${
                          currentPage === page
                            ? "bg-black text-white border-black"
                            : "hover:bg-gray-100 border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 border rounded-md text-xs md:text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Next &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;

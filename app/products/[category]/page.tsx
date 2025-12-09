"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import ProductCard from "@/components/ui/ProductCard";
import { Range } from "react-range";
import { FiFilter } from "react-icons/fi";
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

const CategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const category = params.category;
  const searchParams = useSearchParams();
  
  const searchQuery = typeof category === "string" && category === "search"
    ? searchParams.get("q") || ""
    : "";
  const isSearchMode = category === "search";
  
  const [products, setProducts] = useState<ProductType[]>([]);
  const [subtitle, setSubtitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const MIN = 0;
  const MAX = 12000;
  
  // Get initial values from URL
  const [minPrice, setMinPrice] = useState(() => {
    const min = searchParams.get("min");
    return min ? Number(min) : MIN;
  });
  const [maxPrice, setMaxPrice] = useState(() => {
    const max = searchParams.get("max");
    return max ? Number(max) : MAX;
  });
  const [sortOption, setSortOption] = useState(() => {
    return searchParams.get("sort") || "default";
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? Number(page) : 1;
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  type AvailabilityStatus = "inStock" | "outOfStock" | "preOrder" | "upcoming" | null;
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityStatus>(() => {
    return (searchParams.get("availability") as AvailabilityStatus) || null;
  });

  type DeviceType = "I Phone" | "Oppo" | "Samsung" | "Redmi";
  const [deviceFilters, setDeviceFilters] = useState<DeviceType[]>(() => {
    const devices = searchParams.get("devices");
    return devices ? (devices.split(",") as DeviceType[]) : [];
  });

  // Update URL with current filters
  const updateURL = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "default") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [searchParams, router]);

  const isFirstLoad = useRef(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (isFirstLoad.current) {
        setLoading(true);
        isFirstLoad.current = false;
      } else {
        setIsFilterLoading(true);
      }
      
      try {
        let url: string;
        const params = new URLSearchParams();

        if (isSearchMode) {
          // Search mode
          if (searchQuery) params.set("name", searchQuery);
        }

        // Add filters to API call (for both search and category)
        if (minPrice > MIN) params.set("min", String(minPrice));
        if (maxPrice < MAX) params.set("max", String(maxPrice));
        
        // Map sort option to backend key
        if (sortOption === "price-low-high") {
          params.set("sort_key", "price_low_to_high");
        } else if (sortOption === "price-high-low") {
          params.set("sort_key", "price_high_to_low");
        }
        
        // Add page
        params.set("page", String(currentPage));

        if (isSearchMode) {
          url = `/api/products/search?${params.toString()}`;
        } else {
          url = `/api/products/category/${category}?${params.toString()}`;
        }

        const res = await axios.get(url);
        setProducts(res.data.products || []);
        setSubtitle(res.data.subtitle || "");
        setTotalProducts(res.data.meta?.total || res.data.products?.length || 0);
        setTotalPages(res.data.meta?.last_page || 1);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
        setIsFilterLoading(false);
      }
    };

    fetchProducts();
  }, [category, isSearchMode, searchQuery, minPrice, maxPrice, sortOption, currentPage]);

  // Client-side filtering for availability and device (since API doesn't support these)
  const filteredProducts = products.filter((p) => {
    // Availability filter
    if (availabilityFilter) {
      const isInStock = p.current_stock > 0;
      const isOutOfStock = p.current_stock === 0;

      if (availabilityFilter === "inStock" && !isInStock) return false;
      if (availabilityFilter === "outOfStock" && !isOutOfStock) return false;
      if (availabilityFilter === "preOrder") return false;
      if (availabilityFilter === "upcoming") return false;
    }

    // Device compatibility filter
    if (deviceFilters.length > 0) {
      const compatList = p.product_compatible ?? [];
      const matches = deviceFilters.some(device => compatList.includes(device));
      if (!matches) return false;
    }

    return true;
  });

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    updateURL({ page: page > 1 ? page : null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePriceChange = (values: number[]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  const applyPriceFilter = () => {
    setCurrentPage(1);
    updateURL({ 
      min: minPrice > MIN ? minPrice : null, 
      max: maxPrice < MAX ? maxPrice : null,
      page: null 
    });
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1);
    updateURL({ sort: value !== "default" ? value : null, page: null });
  };

  const toggleDevice = (device: DeviceType) => {
    const newDevices = deviceFilters.includes(device)
      ? deviceFilters.filter(d => d !== device)
      : [...deviceFilters, device];
    
    setDeviceFilters(newDevices);
    setCurrentPage(1);
    updateURL({ 
      devices: newDevices.length > 0 ? newDevices.join(",") : null,
      page: null 
    });
  };

  const toggleAvailability = (key: Exclude<AvailabilityStatus, null>) => {
    const newValue = availabilityFilter === key ? null : key;
    setAvailabilityFilter(newValue);
    setCurrentPage(1);
    updateURL({ availability: newValue, page: null });
  };

  const clearAllFilters = () => {
    setMinPrice(MIN);
    setMaxPrice(MAX);
    setAvailabilityFilter(null);
    setDeviceFilters([]);
    setSortOption("default");
    setCurrentPage(1);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete("min");
    params.delete("max");
    params.delete("availability");
    params.delete("devices");
    params.delete("sort");
    params.delete("page");
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const SidebarContent = (
    <div className="w-full bg-[#f4f4f4] h-full xl:h-auto rounded-md xl:rounded-md shadow p-4 border overflow-y-auto xl:overflow-visible">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-[#ff6b01] text-lg md:text-[22px]">
          Product Filter
        </h2>
        <button
          className="text-orange-500 text-xs md:text-[12px] hover:underline"
          onClick={clearAllFilters}
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
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={availabilityFilter === "inStock"}
              onChange={() => toggleAvailability("inStock")}
            />{" "}
            In Stock
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={availabilityFilter === "outOfStock"}
              onChange={() => toggleAvailability("outOfStock")}
            />{" "}
            Out of Stock
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={availabilityFilter === "preOrder"}
              onChange={() => toggleAvailability("preOrder")}
            />{" "}
            Pre-Order
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
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
          onChange={handlePriceChange}
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
              className="w-4 h-4 bg-white border border-gray-400 rounded-full shadow cursor-pointer"
            />
          )}
        />

        <div className="flex justify-between gap-3 text-xs md:text-sm mt-4">
          <span className="w-1/2 py-2 text-center bg-[#e3e3e3] rounded">
            ৳{minPrice}
          </span>
          <span className="w-1/2 py-2 text-center bg-[#e3e3e3] rounded">
            ৳{maxPrice}
          </span>
        </div>

        <button
          onClick={applyPriceFilter}
          disabled={isFilterLoading}
          className="w-full mt-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFilterLoading ? "Applying..." : "Apply Price Filter"}
        </button>
      </div>

      {/* Device List */}
      <div className="border-t py-3">
        <h3 className="font-semibold text-black text-base md:text-[18px] mb-2">
          Device List
        </h3>
        <div className="space-y-1 text-sm md:text-[16px] text-[#626262]">
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={deviceFilters.includes("I Phone")}
              onChange={() => toggleDevice("I Phone")}
            />{" "}
            I Phone
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={deviceFilters.includes("Oppo")}
              onChange={() => toggleDevice("Oppo")}
            />{" "}
            Oppo
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={deviceFilters.includes("Samsung")}
              onChange={() => toggleDevice("Samsung")}
            />{" "}
            Samsung
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={deviceFilters.includes("Redmi")}
              onChange={() => toggleDevice("Redmi")}
            />{" "}
            Redmi
          </label>
        </div>
      </div>

      {/* Best Selling */}
      {isSearchMode && (
        <div className="border-t py-3">
          <h3 className="font-medium text-base md:text-[18px] mb-2">
            Best Selling
          </h3>
          <div className="space-y-1 text-sm md:text-[16px] text-[#626262]">
            <label className="flex gap-2 items-center cursor-pointer">
              <input className="accent-orange-500 cursor-pointer" type="checkbox" /> Power Bank
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input className="accent-orange-500 cursor-pointer" type="checkbox" /> Phone Charger
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input className="accent-orange-500 cursor-pointer" type="checkbox" /> Adapter
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input className="accent-orange-500 cursor-pointer" type="checkbox" /> Cover
            </label>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-11/12 pt-6 md:pt-10 pb-[56px] mx-auto">
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
              onChange={(e) => handleSortChange(e.target.value)}
              className="border px-2 py-2 text-xs text-[#626262] rounded-md bg-white"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="a-z">A-Z</option>
            </select>
          </div>

          {/* Mobile Filter Drawer */}
          <div
            className={`fixed inset-0 bg-black/40 z-40 xl:hidden transition-opacity duration-300 ${
              isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsFilterOpen(false)}
          />

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
            <div className="flex-1 p-4 overflow-y-auto">{SidebarContent}</div>
          </div>

          <div className="flex flex-col xl:flex-row justify-between gap-6 xl:gap-4">
            {/* Sidebar Filters (Desktop) */}
            <div className="hidden xl:block xl:w-[340px] 2xl:w-[355px]">
              {SidebarContent}
            </div>

            {/* Products List */}
            <div className="w-full xl:flex-1 2xl:w-[1368px]">
              {/* Desktop Sort Bar */}
              <div className="hidden xl:flex justify-between rounded-xl bg-[#f4f4f4] p-4 mb-6 items-center">
                <div className="text-[16px] text-[#626262] font-medium">
                  Showing {filteredProducts.length} out of {totalProducts} Products
                </div>

                <select
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border px-2 py-2 text-[#626262] rounded-md text-sm"
                >
                  <option value="default">Default</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="a-z">A-Z</option>
                </select>
              </div>

              {/* Mobile product count */}
              <div className="xl:hidden mb-3 text-xs text-[#626262]">
                Showing {filteredProducts.length} out of {totalProducts} Products
              </div>

              {/* Products Grid with Loading Overlay */}
              <div className="relative">
                {isFilterLoading && (
                  <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-600">Filtering...</span>
                    </div>
                  </div>
                )}
                <div className="grid w-full grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 xl:gap-7">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>

              {filteredProducts.length === 0 && !isFilterLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
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
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;

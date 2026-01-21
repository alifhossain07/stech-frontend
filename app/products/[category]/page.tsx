"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import ProductCard from "@/components/ui/ProductCard";
import { Range } from "react-range";
import { FiFilter } from "react-icons/fi";
import CategoryPageSkeleton from "@/components/Skeletons/CategoryPageSkeleton";

type Variant = {
  variant: string;
  price: number;
  sku: string | null;
  qty: number;
  image: string | null;
};

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
  variants: Variant[];
};

type FilterAttribute = {
  id: number;
  name: string;
  values: { id: number; value: string }[];
};



interface RawFlashDealProduct {
  id: number;
  name: string;
  slug: string;
  main_price?: string | number;
  stroked_price?: string | number;
  discount: string;
  rating?: number | string;
  thumbnail_image: string;
}

interface FlashDeal {
  id: number;
  title: string;
  subtitle: string;
  date: number;
  products: { data: RawFlashDealProduct[] };
}


const CategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const category = params.category;
  const searchParams = useSearchParams();

  const searchQuery = typeof category === "string" && category === "search"
    ? searchParams.get("q") || ""
    : "";
  const isSearchMode = category === "search";
  const isCollectionMode =
    typeof category === "string" && (category === "new-arrivals" || category === "flashsale");
  /* const isAllFlashDeals = category === "flashsale" && !searchParams.get("slug"); */


  const [products, setProducts] = useState<ProductType[]>([]);
  const [allDeals, setAllDeals] = useState<FlashDeal[]>([]);
  const [subtitle, setSubtitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const MIN = 0;
  const MAX = 120000;

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

  const [filteringAttributes, setFilteringAttributes] = useState<FilterAttribute[]>([]);
  const [dynamicFilters, setDynamicFilters] = useState<Record<string, string[]>>(() => {
    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith("attr_")) {
        const attrName = key.replace("attr_", "");
        filters[attrName] = value.split(",");
      }
    });
    return filters;
  });



  // Update URL with current filters - FIXED to preserve search query
  const updateURL = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Always preserve the search query in search mode
    if (isSearchMode && searchQuery && !params.has("q")) {
      params.set("q", searchQuery);
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "default") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [searchParams, router, isSearchMode, searchQuery]);

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
        // Collection modes: new-arrivals and flashsale
        if (isCollectionMode) {
          if (category === "new-arrivals") {
            const res = await axios.get(`/api/products/new-arrivals`);
            const list = (Array.isArray(res.data) ? res.data : (res.data.products || [])).map((p: ProductType) => ({
              ...p,
              variants: p.variants || []
            }));
            setProducts(list || []);
            setSubtitle(res.data?.subtitle || "");
            setTotalProducts((list || []).length);
            setTotalPages(1);
          } else if (category === "flashsale") {
            const slug = searchParams.get("slug");
            if (slug) {
              const res = await axios.get(`/api/products/flashsale?slug=${slug}`);
              const raw = (res.data?.products ?? []) as RawFlashDealProduct[];
              const mapped = raw.map((product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: typeof product.main_price === "string" ? parseFloat(product.main_price.replace("৳", "").replace(",", "")) : Number(product.main_price ?? 0),
                oldPrice: typeof product.stroked_price === "string" ? parseFloat(product.stroked_price.replace("৳", "").replace(",", "")) : Number(product.stroked_price ?? 0),
                discount: product.discount,
                rating: String(product.rating ?? "0"),
                reviews: "0",
                image: product.thumbnail_image,
                current_stock: 0,
                variants: [],
              }));
              setProducts(mapped);
              setSubtitle(res.data?.title || "");
              setTotalProducts(mapped.length);
              setTotalPages(1);
            } else {
              // View All mode
              const res = await axios.get(`/api/products/flashdealsall`);
              if (res.data.success) {
                setAllDeals(res.data.data);
                setTotalProducts(res.data.data.length);
              }
            }
          }
        } else {
          // Default: category or search endpoints
          let url: string;
          const params = new URLSearchParams();

          if (isSearchMode) {
            if (searchQuery) params.set("name", searchQuery);
          }

          if (sortOption === "price-low-high") {
            params.set("sort_key", "price_low_to_high");
          } else if (sortOption === "price-high-low") {
            params.set("sort_key", "price_high_to_low");
          }

          params.set("page", String(currentPage));

          if (isSearchMode) {
            url = `/api/products/search?${params.toString()}`;
          } else {
            url = `/api/products/category/${category}?${params.toString()}`;
          }

          const res = await axios.get(url);
          setProducts(res.data.products || []);
          setFilteringAttributes(res.data.filtering_attributes || []);
          setSubtitle(res.data.subtitle || "");
          setTotalProducts(res.data.meta?.total || res.data.products?.length || 0);
          setTotalPages(res.data.meta?.last_page || 1);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
        setIsFilterLoading(false);
      }
    };

    fetchProducts();
  }, [category, isSearchMode, isCollectionMode, searchQuery, sortOption, currentPage, searchParams]);

  // Client-side filtering for availability, price and dynamic attributes
  const filteredProducts = products.filter((p) => {
    // Price range filter
    if (p.price < minPrice || p.price > maxPrice) return false;

    // Availability filter
    if (availabilityFilter) {
      const isInStock = p.current_stock > 0;
      const isOutOfStock = p.current_stock === 0;

      if (availabilityFilter === "inStock" && !isInStock) return false;
      if (availabilityFilter === "outOfStock" && !isOutOfStock) return false;
      if (availabilityFilter === "preOrder") return false;
      if (availabilityFilter === "upcoming") return false;
    }

    // Dynamic Attribute filters
    const dynamicAttrKeys = Object.keys(dynamicFilters);
    if (dynamicAttrKeys.length > 0) {
      // For each active attribute filter, the product must have AT LEAST ONE variant
      // that matches AT LEAST ONE of the selected values for that attribute.
      // This implements AND between different attributes and OR between values within an attribute.
      const satisfiesAllAttributes = dynamicAttrKeys.every((attrName) => {
        const selectedValues = dynamicFilters[attrName];
        if (selectedValues.length === 0) return true;

        // Check if ANY variant matches ANY of the selected values for THIS attribute
        return (p.variants || []).some((v) => {
          // Normalize both for comparison (remove spaces/hyphens and lowercase)
          const normalize = (str: string) => str.toLowerCase().replace(/[\s-]/g, "");
          const normalizedVariant = normalize(v.variant);
          return selectedValues.some((val) => normalizedVariant.includes(normalize(val)));
        });
      });

      if (!satisfiesAllAttributes) return false;
    }

    return true;
  });

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    updateURL({ page: page > 1 ? page : null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMinPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMinPrice(val);
  };

  const handleMaxPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMaxPrice(val);
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

  const toggleDynamicFilter = (attrName: string, value: string) => {
    setDynamicFilters((prev) => {
      const currentValues = prev[attrName] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      const newFilters = { ...prev };
      if (newValues.length === 0) {
        delete newFilters[attrName];
      } else {
        newFilters[attrName] = newValues;
      }

      // Update URL
      const urlUpdates: Record<string, string | null> = {};
      urlUpdates[`attr_${attrName}`] = newValues.length > 0 ? newValues.join(",") : null;
      updateURL({ ...urlUpdates, page: null });

      return newFilters;
    });
    setCurrentPage(1);
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
    setDynamicFilters({});
    setSortOption("default");
    setCurrentPage(1);

    const params = new URLSearchParams();

    // CRITICAL FIX: Preserve search query when clearing filters
    if (isSearchMode && searchQuery) {
      params.set("q", searchQuery);
    }

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
          step={1}
          min={MIN}
          max={Math.max(MAX, maxPrice)}
          values={[minPrice, maxPrice]}
          onChange={(vals) => {
            setMinPrice(vals[0]);
            setMaxPrice(vals[1]);
          }}
          renderTrack={({ props, children }) => {
            const rangeMax = Math.max(MAX, maxPrice);
            return (
              <div
                {...props}
                className="w-full h-2 rounded-full bg-gray-200 relative"
              >
                <div
                  className="absolute h-2 bg-orange-500 rounded-full"
                  style={{
                    left: `${(minPrice / rangeMax) * 100}%`,
                    width: `${((maxPrice - minPrice) / rangeMax) * 100}%`,
                  }}
                />
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="w-4 h-4 bg-white border border-gray-400 rounded-full shadow cursor-pointer"
            />
          )}
        />

        <div className="flex justify-between gap-3 text-xs md:text-sm mt-4">
          <div className="w-1/2 flex flex-col">
            <label className="text-[10px] text-gray-500 mb-0.5">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={handleMinPriceInput}
              className="w-full py-2 text-center bg-white border border-gray-300 rounded focus:border-orange-500 outline-none"
            />
          </div>
          <div className="w-1/2 flex flex-col">
            <label className="text-[10px] text-gray-500 mb-0.5">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceInput}
              className="w-full py-2 text-center bg-white border border-gray-300 rounded focus:border-orange-500 outline-none"
            />
          </div>
        </div>

        <button
          onClick={applyPriceFilter}
          disabled={isFilterLoading}
          className="w-full mt-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFilterLoading ? "Applying..." : "Apply Price Filter"}
        </button>
      </div>

      {/* Dynamic Attribute filters */}
      {filteringAttributes.map((attr) => (
        <div key={attr.id} className="border-t py-3">
          <h3 className="font-semibold text-black text-base md:text-[18px] mb-2">
            {attr.name}
          </h3>
          <div className="space-y-1 text-sm md:text-[16px] text-[#626262]">
            {attr.values.map((val) => (
              <label key={val.id} className="flex gap-2 items-center cursor-pointer">
                <input
                  className="accent-orange-500 cursor-pointer"
                  type="checkbox"
                  checked={(dynamicFilters[attr.name] || []).includes(val.value)}
                  onChange={() => toggleDynamicFilter(attr.name, val.value)}
                />{" "}
                {val.value}
              </label>
            ))}
          </div>
        </div>
      ))}

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

  if (category === "flashsale" && !searchParams.get("slug")) {
    return (
      <div className="xl:w-9/12 w-11/12 pt-6 md:pt-16 pb-[56px] mx-auto">
        {loading ? (
          <CategoryPageSkeleton />
        ) : (
          <div className="flex flex-col gap-16">
            {allDeals.map((deal) => (
              <FlashDealSection key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-11/12 pt-6 md:pt-10 pb-[56px] mx-auto">
      {/* Display search query if in search mode */}
      {isSearchMode && searchQuery && (
        <h1 className="text-xl md:text-2xl font-semibold mb-2">
          Search results for &quot;{searchQuery}&quot;
        </h1>
      )}

      {subtitle && (
        <p className="text-gray-900 font-bold mt-5 mb-4 md:mb-6 text-md md:text-xl">
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
            className={`fixed inset-0 bg-black/40 z-40 xl:hidden transition-opacity duration-300 ${isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            onClick={() => setIsFilterOpen(false)}
          />

          <div
            className={`fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white z-50 xl:hidden flex flex-col transform transition-transform duration-300 ${isFilterOpen ? "translate-x-0" : "-translate-x-full"
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
                      className={`px-3 py-1.5 border rounded-md text-xs md:text-sm font-medium ${currentPage === 1
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
                          className={`px-3 py-1.5 border rounded-md text-xs md:text-sm font-medium ${currentPage === page
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
                      className={`px-3 py-1.5 border rounded-md text-xs md:text-sm font-medium ${currentPage === totalPages
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

const FlashDealSection = ({ deal }: { deal: FlashDeal }) => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const apiEndTime = deal.date * 1000;
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeRemaining = apiEndTime - currentTime;

      if (timeRemaining <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deal.date]);

  const mappedProducts = (deal.products?.data || []).map((product: RawFlashDealProduct) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: typeof product.main_price === "string" ? parseFloat(product.main_price.replace("৳", "").replace(",", "")) : Number(product.main_price ?? 0),
    oldPrice: typeof product.stroked_price === "string" ? parseFloat(product.stroked_price.replace("৳", "").replace(",", "")) : Number(product.stroked_price ?? 0),
    discount: product.discount,
    rating: String(product.rating ?? "0"),
    reviews: "0",
    image: product.thumbnail_image,
    current_stock: 0,
    variants: [],
  }));

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{deal.title}</h2>
          <p className="text-gray-600 mt-1">{deal.subtitle}</p>
        </div>

        <div className="flex gap-2 md:gap-4">
          {[
            { label: "Days", value: countdown.days },
            { label: "Hours", value: countdown.hours },
            { label: "Mins", value: countdown.minutes },
            { label: "Sec", value: countdown.seconds },
          ].map((item) => (
            <div key={item.label} className="bg-[#fce9dc] rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px] text-center">
              <div className="text-xl md:text-2xl font-bold text-orange-500 leading-none">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="text-[10px] md:text-xs text-orange-600 font-medium uppercase mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {mappedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;

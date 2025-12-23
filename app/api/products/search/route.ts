import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!; // e.g. "http://sannai.test/api/v2"
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

type ProductApi = {
  id: number | string;
  name: string;
  slug: string;
  main_price: string | number | null;
  stroked_price: string | number | null;
  discount?: string | number | null;
  rating?: string | number | null;
  sales?: string | number | null;
  thumbnail_image: string;
  featured_specs?: { text: string; icon: string }[] | null;
  current_stock?: number;
  product_compatible?: string[] | null;
};

type SuggestionApi = 
  | Array<{
      id: number;
      query: string;
      count: number;
      type: string;
      type_string: string;
    }>
  | {
      data?: Array<{
        id: number;
        query: string;
        count: number;
        type: string;
        type_string: string;
      }> | {
        items?: Array<unknown>;
        suggestions?: Array<unknown>;
        data?: Array<unknown>;
        products?: Array<unknown>;
      };
      items?: Array<unknown>;
      suggestions?: Array<unknown>;
      products?: Array<unknown>;
    }
  | Record<string, unknown>;

type SuggestionItem = {
  id?: number | string;
  query?: string;
  count?: number;
  type?: string;
  type_string?: string;
  name?: string;
  slug?: string;
  image?: string | null;
  thumbnail_image?: string | null;
  price?: number | string | null;
  main_price?: number | string | null;
  stroked_price?: number | string | null;
  discount?: string | number | null;
  _relevanceScore?: number;
  _isDirectMatch?: boolean;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const isSuggest = searchParams.get("suggest") === "1";

  if (isSuggest) {
    // ---------- SUGGESTION MODE ----------
    const queryKey = searchParams.get("query_key") || "";
    const type = searchParams.get("type") || ""; // product | brands | etc.

    if (!queryKey.trim()) {
      return NextResponse.json({
        success: true,
        suggestions: [],
      });
    }

    try {
      const backendRes = await fetch(
        `${API_BASE}/get-search-suggestions?query_key=${encodeURIComponent(
          queryKey
        )}${type ? `&type=${encodeURIComponent(type)}` : ""}`,
        {
          headers: {
            Accept: "application/json",
            "System-Key": SYSTEM_KEY,
          },
          cache: "no-store",
        }
      );

      if (!backendRes.ok) {
        console.error(
          "Backend search suggestions error:",
          backendRes.status
        );
        return NextResponse.json(
          { success: false, error: "Failed to load search suggestions" },
          { status: 500 }
        );
      }

      const backendJson: SuggestionApi = await backendRes.json();

      // 🔍 DEBUG: Log the backend API response
      console.log("=== BACKEND SUGGESTION API RESPONSE ===");
      console.log("Response type:", Array.isArray(backendJson) ? "Array" : typeof backendJson);
      console.log("Full response:", JSON.stringify(backendJson, null, 2));
      if (Array.isArray(backendJson)) {
        console.log("✅ Backend returned array directly, length:", backendJson.length);
        if (backendJson.length > 0) {
          console.log("First item structure:", Object.keys(backendJson[0]));
          console.log("First item:", JSON.stringify(backendJson[0], null, 2));
        }
      } else if (backendJson && typeof backendJson === 'object' && !Array.isArray(backendJson)) {
        const backendObj = backendJson as Record<string, unknown>;
        console.log("Response keys:", Object.keys(backendObj));
        // Check common response structures
        if (Array.isArray(backendObj.data)) {
          console.log("Found array at: data, length:", backendObj.data.length);
          if (backendObj.data.length > 0 && typeof backendObj.data[0] === 'object') {
            console.log("First item structure:", Object.keys(backendObj.data[0] as Record<string, unknown>));
            console.log("First item:", JSON.stringify(backendObj.data[0], null, 2));
          }
        }
        if (Array.isArray(backendObj.items)) {
          console.log("Found array at: items, length:", backendObj.items.length);
        }
        if (Array.isArray(backendObj.suggestions)) {
          console.log("Found array at: suggestions, length:", backendObj.suggestions.length);
        }
        if (Array.isArray(backendObj.products)) {
          console.log("Found array at: products, length:", backendObj.products.length);
        }
      }
      console.log("========================================");

      // Enhance suggestions with product data for product-type suggestions
      // Extract suggestions array
      let suggestions: SuggestionItem[] = [];
      
      // Check if backendJson is directly an array (most common case)
      if (Array.isArray(backendJson)) {
        suggestions = backendJson as SuggestionItem[];
        console.log("✅ Backend response is directly an array");
      } else if (backendJson && typeof backendJson === 'object' && !Array.isArray(backendJson)) {
        const backendObj = backendJson as Record<string, unknown>;
        if (Array.isArray(backendObj.data)) {
          suggestions = backendObj.data as SuggestionItem[];
          console.log("✅ Found suggestions in backendJson.data");
        } else if (backendObj.data && typeof backendObj.data === 'object' && !Array.isArray(backendObj.data)) {
          const dataObj = backendObj.data as Record<string, unknown>;
          if (Array.isArray(dataObj.items)) {
            suggestions = dataObj.items as SuggestionItem[];
            console.log("✅ Found suggestions in backendJson.data.items");
          } else if (Array.isArray(dataObj.suggestions)) {
            suggestions = dataObj.suggestions as SuggestionItem[];
            console.log("✅ Found suggestions in backendJson.data.suggestions");
          } else if (Array.isArray(dataObj.data)) {
            suggestions = dataObj.data as SuggestionItem[];
            console.log("✅ Found suggestions in backendJson.data.data");
          } else if (Array.isArray(dataObj.products)) {
            suggestions = dataObj.products as SuggestionItem[];
            console.log("✅ Found suggestions in backendJson.data.products");
          }
        } else if (Array.isArray(backendObj.items)) {
          suggestions = backendObj.items as SuggestionItem[];
          console.log("✅ Found suggestions in backendJson.items");
        } else if (Array.isArray(backendObj.suggestions)) {
          suggestions = backendObj.suggestions as SuggestionItem[];
          console.log("✅ Found suggestions in backendJson.suggestions");
        } else if (Array.isArray(backendObj.products)) {
          suggestions = backendObj.products as SuggestionItem[];
          console.log("✅ Found suggestions in backendJson.products");
        }
      }
      
      if (suggestions.length === 0) {
        console.log("⚠️ Could not find suggestions array in response");
      }

      console.log(`📊 Total suggestions: ${suggestions.length}`);
      console.log(`📊 Suggestions structure:`, suggestions.length > 0 ? Object.keys(suggestions[0]) : 'empty');
      
      // Try to match ALL suggestions with actual products (not just type="product")
      console.log(`🔍 Processing ${suggestions.length} suggestions, fetching product data to match...`);
      
      try {
        // Fetch products using the product search API with higher limit for suggestions
        // Try to get more products by increasing per_page or fetching multiple pages
        const productSearchRes = await fetch(
          `${API_BASE}/products/search?name=${encodeURIComponent(queryKey)}&page=1&per_page=50`,
          {
            headers: {
              Accept: "application/json",
              "System-Key": SYSTEM_KEY,
            },
            cache: "no-store",
          }
        );

        if (productSearchRes.ok) {
          const productSearchJson = await productSearchRes.json();
          
          // Extract products - backend API returns data array
          let products: ProductApi[] = [];
          if (Array.isArray(productSearchJson.data)) {
            products = productSearchJson.data;
          } else if (Array.isArray(productSearchJson.products)) {
            products = productSearchJson.products;
          } else if (productSearchJson.data && Array.isArray(productSearchJson.data.data)) {
            products = productSearchJson.data.data;
          }
          
          // Check if there are more pages and fetch them
          const meta = productSearchJson.meta || productSearchJson.data?.meta;
          const total = meta?.total || products.length;
          const perPage = meta?.per_page || 10;
          const lastPage = meta?.last_page || 1;
          
          console.log(`📊 Pagination info:`, {
            productsOnPage1: products.length,
            total: total,
            perPage: perPage,
            lastPage: lastPage,
            meta: meta
          });
          
          // If there are more pages and we haven't fetched all products, fetch additional pages
          if (lastPage > 1 && products.length < total) {
            console.log(`📄 Fetching additional pages (2-${lastPage}) to get all products...`);
            const additionalPages: ProductApi[] = [];
            
            // Fetch ALL remaining pages (no limit for suggestions)
            for (let page = 2; page <= lastPage; page++) {
              try {
                const pageRes = await fetch(
                  `${API_BASE}/products/search?name=${encodeURIComponent(queryKey)}&page=${page}&per_page=50`,
                  {
                    headers: {
                      Accept: "application/json",
                      "System-Key": SYSTEM_KEY,
                    },
                    cache: "no-store",
                  }
                );
                
                if (pageRes.ok) {
                  const pageJson = await pageRes.json();
                  let pageProducts: ProductApi[] = [];
                  if (Array.isArray(pageJson.data)) {
                    pageProducts = pageJson.data;
                  } else if (Array.isArray(pageJson.products)) {
                    pageProducts = pageJson.products;
                  } else if (pageJson.data && Array.isArray(pageJson.data.data)) {
                    pageProducts = pageJson.data.data;
                  }
                  additionalPages.push(...pageProducts);
                  console.log(`✅ Fetched ${pageProducts.length} products from page ${page}`);
                }
              } catch (err) {
                console.error(`Error fetching page ${page}:`, err);
              }
            }
            
            products = [...products, ...additionalPages];
            console.log(`✅ Total products after fetching all pages: ${products.length} (expected: ${total})`);
          }
          
          // Also try fetching without pagination limit if per_page didn't work
          if (products.length < total && products.length < 15) {
            console.log(`⚠️ Only found ${products.length} products but total is ${total}. Trying without per_page limit...`);
            try {
              const unlimitedRes = await fetch(
                `${API_BASE}/products/search?name=${encodeURIComponent(queryKey)}`,
                {
                  headers: {
                    Accept: "application/json",
                    "System-Key": SYSTEM_KEY,
                  },
                  cache: "no-store",
                }
              );
              
              if (unlimitedRes.ok) {
                const unlimitedJson = await unlimitedRes.json();
                let unlimitedProducts: ProductApi[] = [];
                if (Array.isArray(unlimitedJson.data)) {
                  unlimitedProducts = unlimitedJson.data;
                } else if (Array.isArray(unlimitedJson.products)) {
                  unlimitedProducts = unlimitedJson.products;
                } else if (unlimitedJson.data && Array.isArray(unlimitedJson.data.data)) {
                  unlimitedProducts = unlimitedJson.data.data;
                }
                
                if (unlimitedProducts.length > products.length) {
                  console.log(`✅ Found ${unlimitedProducts.length} products without pagination limit`);
                  products = unlimitedProducts;
                }
              }
            } catch (err) {
              console.error(`Error fetching without pagination:`, err);
            }
          }
          
          console.log(`✅ Final: Found ${products.length} products from search API (total available: ${total})`);
          if (products.length > 0) {
            console.log(`First product:`, {
              name: products[0].name,
              hasImage: !!products[0].thumbnail_image,
              hasPrice: !!products[0].main_price
            });
          }

          // Helper function to normalize text (remove spaces, special chars for fuzzy matching)
          const normalizeForMatching = (text: string): string => {
            return text
              .toLowerCase()
              .replace(/\s+/g, '') // Remove all spaces
              .replace(/[^\w]/g, '') // Remove special characters
              .trim();
          };
          
          // Helper function to get all variations of a text (with and without spaces)
          const getTextVariations = (text: string): string[] => {
            const normalized = text.toLowerCase().trim();
            const variations = [normalized];
            
            // Add version without spaces
            const noSpaces = normalized.replace(/\s+/g, '');
            if (noSpaces !== normalized) {
              variations.push(noSpaces);
            }
            
            // Add version with spaces normalized (single space)
            const singleSpace = normalized.replace(/\s+/g, ' ');
            if (singleSpace !== normalized) {
              variations.push(singleSpace);
            }
            
            return variations;
          };
          
          // Create a map of product names to products for quick lookup
          const productMap = new Map<string, ProductApi>();
          const normalizedProductMap = new Map<string, ProductApi>(); // For fuzzy matching
          
          products.forEach((p) => {
            const normalizedName = p.name.toLowerCase().trim();
            productMap.set(normalizedName, p);
            
            // Index normalized version (no spaces, no special chars) for fuzzy matching
            const normalizedKey = normalizeForMatching(p.name);
            if (!normalizedProductMap.has(normalizedKey)) {
              normalizedProductMap.set(normalizedKey, p);
            }
            
            // Also try matching by partial name (first few words)
            const nameWords = normalizedName.split(/\s+/).slice(0, 3).join(' ');
            if (nameWords && !productMap.has(nameWords)) {
              productMap.set(nameWords, p);
            }
            
            // Also index by product name without special characters and pipes
            const cleanName = normalizedName.split('|')[0].trim();
            if (cleanName && cleanName !== normalizedName && !productMap.has(cleanName)) {
              productMap.set(cleanName, p);
            }
            
            // Index variations (with and without spaces)
            const variations = getTextVariations(cleanName);
            variations.forEach(variation => {
              if (!productMap.has(variation)) {
                productMap.set(variation, p);
              }
              const normalizedVariation = normalizeForMatching(variation);
              if (!normalizedProductMap.has(normalizedVariation)) {
                normalizedProductMap.set(normalizedVariation, p);
              }
            });
            
            // Index by model numbers or short identifiers (e.g., "ANC T10", "W-250")
            const modelMatch = normalizedName.match(/(?:anc|t|w|sn|sp|sc|sa)[\s-]?[\d]+/i);
            if (modelMatch) {
              const modelKey = modelMatch[0].toLowerCase().replace(/\s+/g, '');
              if (!productMap.has(modelKey)) {
                productMap.set(modelKey, p);
              }
            }
          });

          // First, add products that directly match the search query (even if not in suggestions)
          // This ensures we show all products that match, not just those in suggestions
          const normalizedQueryKey = queryKey.toLowerCase().trim();
          const queryKeyWords = normalizedQueryKey.split(/\s+/).filter(w => w.length > 0);
          const normalizedQueryKeyNoSpaces = normalizeForMatching(queryKey); // For fuzzy matching
          const queryVariations = getTextVariations(queryKey); // Get all variations of search query
          
          // Add products that start with or contain the search query (including variations)
          const directMatches: SuggestionItem[] = [];
          products.forEach((product) => {
            const productName = product.name.toLowerCase();
            const normalizedProductName = normalizeForMatching(product.name);
            
            // Check multiple matching strategies
            const startsWithQuery = productName.startsWith(normalizedQueryKey);
            const containsAllWords = queryKeyWords.every(word => productName.includes(word));
            
            // Check normalized matching (handles "power bank" vs "powerbank")
            const normalizedMatch = normalizedProductName.includes(normalizedQueryKeyNoSpaces) || 
                                   normalizedQueryKeyNoSpaces.includes(normalizedProductName);
            
            // Check if any query variation matches product name variations
            let variationMatch = false;
            for (const queryVar of queryVariations) {
              if (productName.includes(queryVar) || queryVar.includes(productName.split('|')[0].trim())) {
                variationMatch = true;
                break;
              }
            }
            
            if (startsWithQuery || containsAllWords || normalizedMatch || variationMatch) {
              // Calculate relevance score
              let relevanceScore = 50; // Base score for direct match
              if (startsWithQuery) relevanceScore += 30;
              if (containsAllWords) relevanceScore += queryKeyWords.length * 5;
              
              directMatches.push({
                id: `direct-${product.id}`,
                query: product.name,
                count: 0,
                type: 'product',
                type_string: 'Product',
                name: product.name,
                slug: product.slug,
                image: product.thumbnail_image || null,
                thumbnail_image: product.thumbnail_image || null,
                price: product.main_price ?? null,
                main_price: product.main_price ?? null,
                stroked_price: product.stroked_price ?? null,
                discount: product.discount ?? null,
                _relevanceScore: relevanceScore,
                _isDirectMatch: true
              });
            }
          });
          
          console.log(`✅ Found ${directMatches.length} products that directly match "${queryKey}"`);
          
          // Enhance ALL suggestions by trying to match them with products
          let matchedCount = 0;
          const enhancedSuggestions: SuggestionItem[] = [];
          const seenProductSlugs = new Set<string>(); // Track seen products to avoid duplicates
          const seenProductIds = new Set<number | string>(); // Also track by ID
          
          suggestions.forEach((suggestion: SuggestionItem) => {
            if (!suggestion.query) return;
            
            const queryLower = suggestion.query.toLowerCase().trim();
            const queryBase = queryLower.split('|')[0].trim(); // Get part before pipe
            const queryWords = queryBase.split(/\s+/).slice(0, 3).join(' ');
            const normalizedQueryBase = normalizeForMatching(queryBase); // Normalized version for fuzzy matching
            const queryBaseVariations = getTextVariations(queryBase); // Get variations
            
            let matchedProduct: ProductApi | undefined;
            let matchType = 'none'; // Track match quality for sorting
            let relevanceScore = 0;
            
            // Try to find matching product with different strategies (ordered by relevance)
            
            // 1. Exact match (highest priority)
            matchedProduct = productMap.get(queryLower);
            if (matchedProduct) {
              matchType = 'exact';
              relevanceScore = 100;
            }
            
            // 2. Exact match with base (before pipe)
            if (!matchedProduct && queryBase !== queryLower) {
              matchedProduct = productMap.get(queryBase);
              if (matchedProduct) {
                matchType = 'exact-base';
                relevanceScore = 90;
              }
            }
            
            // 3. Try matching with variations (handles "power bank" vs "powerbank")
            if (!matchedProduct) {
              for (const variation of queryBaseVariations) {
                matchedProduct = productMap.get(variation);
                if (matchedProduct) {
                  matchType = 'variation';
                  relevanceScore = 88;
                  break;
                }
              }
            }
            
            // 4. Normalized matching (no spaces, no special chars) - handles "power bank" vs "powerbank"
            if (!matchedProduct) {
              matchedProduct = normalizedProductMap.get(normalizedQueryBase);
              if (matchedProduct) {
                matchType = 'normalized';
                relevanceScore = 85;
              }
            }
            
            // 5. Check if suggestion query contains the search query (high relevance)
            if (!matchedProduct) {
              if (queryLower.includes(normalizedQueryKey) || normalizedQueryKey.includes(queryBase)) {
                matchedProduct = productMap.get(queryWords);
                if (matchedProduct) {
                  matchType = 'query-contains';
                  relevanceScore = 80;
                }
              }
            }
            
            // 6. Partial match (first 3 words)
            if (!matchedProduct) {
              matchedProduct = productMap.get(queryWords);
              if (matchedProduct) {
                matchType = 'partial';
                relevanceScore = 70;
              }
            }
            
            // 7. Try matching by model number
            if (!matchedProduct) {
              const modelMatch = queryLower.match(/(?:anc|t|w|sn|sp|sc|sa)[\s-]?[\d]+/i);
              if (modelMatch) {
                const modelKey = modelMatch[0].toLowerCase().replace(/\s+/g, '');
                matchedProduct = productMap.get(modelKey);
                if (matchedProduct) {
                  matchType = 'model';
                  relevanceScore = 60;
                }
              }
            }
            
            // 8. Fuzzy matching with normalized comparison (lowest priority)
            if (!matchedProduct) {
              matchedProduct = products.find((p) => {
                const pName = p.name.toLowerCase();
                const pNameBase = pName.split('|')[0].trim();
                const normalizedPName = normalizeForMatching(pNameBase);
                
                // Check if product name starts with query or query starts with product name
                return pNameBase.includes(queryBase) || 
                       queryBase.includes(pNameBase) ||
                       pName.includes(queryBase) ||
                       queryBase.includes(pName.split('|')[0].trim()) ||
                       normalizedPName.includes(normalizedQueryBase) ||
                       normalizedQueryBase.includes(normalizedPName);
              });
              if (matchedProduct) {
                matchType = 'fuzzy';
                relevanceScore = 50;
              }
            }

            // Only include suggestions that matched with actual products AND haven't been seen before
            if (matchedProduct) {
              const productSlug = matchedProduct.slug;
              const productId = matchedProduct.id;
              
              // Skip if we've already added this product (by slug or ID)
              if (seenProductSlugs.has(productSlug) || seenProductIds.has(productId)) {
                console.log(`⏭️ Skipping duplicate product: "${matchedProduct.name}" (slug: ${productSlug})`);
                return;
              }
              
              // Calculate additional relevance based on how well product name matches search query
              const productName = matchedProduct.name.toLowerCase();
              let additionalScore = 0;
              
              // Bonus for product name starting with search query
              if (productName.startsWith(normalizedQueryKey)) {
                additionalScore += 20;
              }
              
              // Bonus for each search word found in product name
              queryKeyWords.forEach(word => {
                if (productName.includes(word)) {
                  additionalScore += 5;
                }
              });
              
              // Bonus for exact model number match (e.g., "SP-23")
              const productModelMatch = productName.match(/(?:anc|t|w|sn|sp|sc|sa)[\s-]?[\d]+/i);
              const queryModelMatch = normalizedQueryKey.match(/(?:anc|t|w|sn|sp|sc|sa)[\s-]?[\d]+/i);
              if (productModelMatch && queryModelMatch) {
                const productModel = productModelMatch[0].toLowerCase().replace(/\s+/g, '');
                const queryModel = queryModelMatch[0].toLowerCase().replace(/\s+/g, '');
                if (productModel === queryModel) {
                  additionalScore += 30; // Big bonus for exact model match
                }
              }
              
              relevanceScore += additionalScore;
              
              // Mark this product as seen
              seenProductSlugs.add(productSlug);
              seenProductIds.add(productId);
              
              matchedCount++;
              console.log(`✅ Matched "${suggestion.query.substring(0, 50)}..." with product "${matchedProduct.name}" (${matchType}, score: ${relevanceScore})`);
              enhancedSuggestions.push({
                ...suggestion,
                name: matchedProduct.name,
                slug: matchedProduct.slug,
                image: matchedProduct.thumbnail_image,
                thumbnail_image: matchedProduct.thumbnail_image,
                price: matchedProduct.main_price,
                main_price: matchedProduct.main_price,
                stroked_price: matchedProduct.stroked_price,
                discount: matchedProduct.discount,
                _relevanceScore: relevanceScore, // Internal score for sorting
              });
            } else {
              console.log(`❌ No product match for: "${suggestion.query.substring(0, 50)}..." - filtering out`);
            }
          });
          
          // Combine direct matches with suggestion matches
          // Add direct matches that aren't already in enhancedSuggestions
          directMatches.forEach(directMatch => {
            const productId = directMatch.slug || String(directMatch.id || '');
            const productIdNum = directMatch.id;
            if (productId && !seenProductSlugs.has(productId) && productIdNum !== undefined && !seenProductIds.has(productIdNum)) {
              seenProductSlugs.add(productId);
              seenProductIds.add(productIdNum);
              enhancedSuggestions.push(directMatch);
            }
          });
          
          // Sort by relevance score (highest first)
          enhancedSuggestions.sort((a, b) => {
            const scoreA = a._relevanceScore || 0;
            const scoreB = b._relevanceScore || 0;
            return scoreB - scoreA; // Descending order
          });
          
          // Remove the internal relevance score before returning
          enhancedSuggestions.forEach(item => {
            delete item._relevanceScore;
            delete item._isDirectMatch;
          });
          
          console.log(`✅ Enhanced ${matchedCount} from suggestions + ${directMatches.length} direct matches = ${enhancedSuggestions.length} total unique products (sorted by relevance)`);

          // Update the response with enhanced suggestions (only matched products)
          const enhancedData = { data: enhancedSuggestions };
          console.log(`✅ Returning ${enhancedSuggestions.length} matched products only`);
          
          // Verify enhancement worked
          if (enhancedSuggestions.length > 0) {
            const firstEnhanced = enhancedSuggestions[0];
            console.log("✅ Verification - First enhanced product:", {
              name: firstEnhanced.name,
              hasImage: !!firstEnhanced.image,
              hasPrice: !!firstEnhanced.price,
              hasSlug: !!firstEnhanced.slug,
              image: firstEnhanced.image?.substring(0, 50) || 'null',
              price: firstEnhanced.price || 'null'
            });
          }
          
          console.log("✅ Enhanced suggestions with product data");
          
          return NextResponse.json({
            success: true,
            data: enhancedData,
          });
        }
      } catch (error) {
        console.error("Error enhancing suggestions with product data:", error);
        // Return empty if enhancement fails
        return NextResponse.json({
          success: true,
          data: { data: [] },
        });
      }

      return NextResponse.json({
        success: true,
        data: backendJson,
      });
    } catch (error) {
      console.error("Search suggestions API error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to load search suggestions" },
        { status: 500 }
      );
    }
  }

  // ---------- NORMAL PRODUCT SEARCH MODE ----------
  const name = searchParams.get("name") || "";
  const categories = searchParams.get("categories") || "";
  const brands = searchParams.get("brands") || "";
  const min = searchParams.get("min") || "";
  const max = searchParams.get("max") || "";
  const sort_key = searchParams.get("sort_key") || "";
  const digital = searchParams.get("digital") || "";
  const page = searchParams.get("page") || "1";

  // Build query string for backend
  const backendUrl = new URL(`${API_BASE}/products/search`);
  
  if (name) backendUrl.searchParams.set("name", name);
  if (categories) backendUrl.searchParams.set("categories", categories);
  if (brands) backendUrl.searchParams.set("brands", brands);
  if (min) backendUrl.searchParams.set("min", min);
  if (max) backendUrl.searchParams.set("max", max);
  if (sort_key) backendUrl.searchParams.set("sort_key", sort_key);
  if (digital) backendUrl.searchParams.set("digital", digital);
  if (page) backendUrl.searchParams.set("page", page);

  try {
    const backendRes = await fetch(backendUrl.toString(), {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      console.error("Backend search products error:", backendRes.status);
      return NextResponse.json(
        { success: false, error: "Failed to load search products" },
        { status: 500 }
      );
    }

    const backendJson = await backendRes.json();
    let productsRaw: ProductApi[] = backendJson.data ?? [];
    const meta = backendJson.meta ?? {};

    const normalizedName = name.trim().toLowerCase();
    if (normalizedName) {
      productsRaw = productsRaw.filter((p) =>
        p.name.toLowerCase().includes(normalizedName)
      );
    }

    const products = productsRaw.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(String(p.main_price).replace(/[^\d.]/g, "") || 0),
      oldPrice: Number(String(p.stroked_price).replace(/[^\d.]/g, "") || 0),
      discount: String(p.discount ?? ""),
      rating: String(p.rating ?? 0),
      reviews: String(p.sales ?? 0),
      image: p.thumbnail_image,
      featured_specs: p.featured_specs ?? [],
      current_stock: Number(p.current_stock ?? 0),
      product_compatible: p.product_compatible ?? [],
    }));

    return NextResponse.json({
      success: true,
      title: name ? `Search results for "${name}"` : "All Products",
      subtitle:
        products.length === 0
          ? "No products found. Please try another keyword or adjust filters."
          : "",
      total: meta.total ?? products.length,
      products,
      meta,
    });
  } catch (error) {
    console.error("Search products API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load search products" },
      { status: 500 }
    );
  }
}
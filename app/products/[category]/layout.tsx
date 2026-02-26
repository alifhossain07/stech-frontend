import { Metadata } from "next";

type Props = {
    params: { category: string };
};

async function fetchCategories() {
    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    try {
        const res = await fetch(`${API_BASE}/categories`, {
            headers: {
                "Accept": "application/json",
                "System-Key": SYSTEM_KEY || "",
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) return [];
        const data = await res.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error("Error fetching categories for metadata:", error);
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const categorySlug = params.category;

    // 1. Handle "Virtual" Categories with hardcoded SEO
    if (categorySlug === "new-arrivals") {
        return {
            title: "New Arrivals | Sannai Technology Limited",
            description: "Check out the latest mobile accessories from Sannai Technology Limited. Stay updated with our newest chargers, earbuds, and more.",
        };
    }

    if (categorySlug === "flashsale") {
        return {
            title: "Flash Sale | Sannai Technology Limited",
            description: "Grab the best deals on mobile accessories during our Flash Sale. Limited time offers on chargers, cables, and gadgets.",
        };
    }

    if (categorySlug === "featured") {
        return {
            title: "Featured Products | Sannai Technology Limited",
            description: "Explore our top-rated and featured mobile accessories. Handpicked quality products for your devices.",
        };
    }

    if (categorySlug === "search") {
        return {
            title: "Search Products | Sannai Technology Limited",
        };
    }

    interface Category {
        id: number;
        name: string;
        slug: string;
        banner: string;
        icon: string;
        number_of_children: number;
        links: {
            products: string;
            sub_categories: string;
        };
    }

    // 2. Handle Dynamic Categories from Backend
    const categories = await fetchCategories();
    const category = categories.find((c: Category) => c.slug === categorySlug);

    if (category) {
        return {
            title: `${category.name} | Sannai Technology Limited`,
            description: `Premium ${category.name} from Sannai Technology. High-quality mobile accessories at affordable prices in Bangladesh.`,
        };
    }

    // 3. Fallback
    return {
        title: "Products | Sannai Technology Limited",
        description: "Browse high-quality mobile accessories from Sannai Technology Limited.",
    };
}

export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

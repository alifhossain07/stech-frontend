// types/about.ts

export interface FeatureCard {
    number: string;
    title: string;
    description: string;
}

export interface Highlight {
    icon: string;
    icon_url?: string;
    title: string;
    subtitle: string;
}

export interface SocialPost {
    image: string;
    image_url?: string;
    icon: string;
    icon_url?: string;
    link: string;
}

export interface AboutData {
    id: number;
    title: string;
    slug: string;
    hero_heading: string;
    hero_description: string;
    hero_image: string;
    mission_title: string;
    mission_description: string;
    mission_icon: string;
    vision_title: string;
    vision_description: string;
    vision_icon: string;
    future_title: string;
    future_description: string;
    future_image: string;
    commitment_title: string;
    commitment_description: string;
    commitment_image: string;
    feature_cards: FeatureCard[];
    highlights: Highlight[];
    social_posts: SocialPost[];
    // You can add meta fields if needed
}

export interface AboutPageResponse {
    result: boolean;
    message: string;
    data: AboutData;
}
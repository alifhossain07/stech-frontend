"use client";

import React from "react";
import HeroSlider from "@/components/ui/HeroSlider";
import { useAuth } from "@/app/context/AuthContext";
import DealerHero from "./DealerHero";
import PopularCategories from "../Pages/Home/PopularCategories";

const DealerHome = () => {
    const { user } = useAuth();

    return (
        <div className="bg-gray-50 min-h-screen">
            <DealerHero />
            <PopularCategories />

        </div>
    );
};

export default DealerHome;

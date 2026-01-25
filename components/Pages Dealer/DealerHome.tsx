"use client";

import React from "react";
import DealerHero from "./DealerHero";
import PopularCategories from "../Pages/Home/PopularCategories";
import CampingOffer from "./CampingOffer";

const DealerHome = () => {

    return (
        <div className="bg-gray-50 min-h-screen">
            <DealerHero />
            <PopularCategories />
            <CampingOffer />
        </div>
    );
};

export default DealerHome;

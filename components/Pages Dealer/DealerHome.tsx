"use client";

import React from "react";
import DealerHero from "./DealerHero";
import PopularCategories from "../Pages/Home/PopularCategories";

const DealerHome = () => {

    return (
        <div className="bg-gray-50 min-h-screen">
            <DealerHero />
            <PopularCategories />

        </div>
    );
};

export default DealerHome;

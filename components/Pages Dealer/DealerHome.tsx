"use client";

import React from "react";
import DealerHero from "./DealerHero";
import PopularCategories from "../Pages/Home/PopularCategories";
import CampingOffer from "./CampingOffer";
import TopSellBanner from "./TopSellBanner";
import UpcomingProducts from "./UpcomingProducts";
// import DealerReviews from "./DealerReviews";
import DealerFAQ from "./DealerFAQ";

const DealerHome = () => {

    return (
        <div className="bg-gray-50 min-h-screen">
            <DealerHero />
            <PopularCategories />
            <CampingOffer />
            <TopSellBanner />
            <UpcomingProducts />
            {/* <DealerReviews /> */}
            <DealerFAQ />
        </div>
    );
};

export default DealerHome;

"use client";

import React from "react";
import DealerHero from "./DealerHero";
import PopularCategories from "../Pages/Home/PopularCategories";
import CampingOffer from "./CampingOffer";
import TopSellBanner from "./TopSellBanner";
import UpcomingProducts from "./UpcomingProducts";
import DealerReviews from "./DealerReviews";
import DealerFAQ from "./DealerFAQ";
import DealerFooterInfo from "./DealerFooterInfo";

const DealerHome = () => {

    return (
        <div className=" min-h-screen">
            <DealerHero />
            <div className="bg-gray-50">
                <PopularCategories />
            </div>
            <CampingOffer />
            <div className="bg-gray-50">
                <TopSellBanner />
            </div>
            <UpcomingProducts />
            <div className="bg-gray-50">
                <DealerReviews />
            </div>
            <DealerFAQ />
            <DealerFooterInfo />
        </div>
    );
};

export default DealerHome;

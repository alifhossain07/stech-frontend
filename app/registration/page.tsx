import React from "react";
import RegistrationContent from "./RegistrationContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Sannai Technology Limited",
  description: "Join Sannai Technology to explore premium mobile accessories and gadgets in Bangladesh.",
};

const Page = () => {
  return <RegistrationContent />;
};

export default Page;

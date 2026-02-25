import React from "react";
import LoginContent from "./LoginContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Sannai Technology Limited",
  description: "Login to your Sannai Technology account to manage orders and explore new products.",
};

const Page = () => {
  return <LoginContent />;
};

export default Page;

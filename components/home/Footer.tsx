"use client";

import useLocalStorage from "@/hooks/useLocalStorage";
import Features from "./Features";
import UserLinks from "./UserLinks";

export default function Footer() {
  const savedLinks = useLocalStorage<string[]>("links", []);
  return <>{savedLinks.length > 0 ? <UserLinks /> : <Features />}</>;
}

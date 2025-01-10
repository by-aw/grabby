"use client";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import Features from "./Features";
import UserLinks from "./UserLinks";

export default function Footer() {
  const [savedLinks] = useLocalStorage<string[]>("links", ["loading"]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <></>;
  }
  return <>{savedLinks.length > 0 ? <UserLinks /> : <Features />}</>;
}

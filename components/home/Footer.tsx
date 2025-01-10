"use client";

import useLocalStorage from "@/hooks/useLocalStorage";
import { useState } from "react";
import Features from "./Features";
import UserLinks from "./UserLinks";

export default function Footer() {
  const [savedLinks] = useLocalStorage<string[]>("links", []);
  const [mounted, setMounted] = useState(false);

  return <>{savedLinks.length <= 0 ? <Features /> : <UserLinks />}</>;
}

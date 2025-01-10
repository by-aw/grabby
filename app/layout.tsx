import type { Metadata } from "next";
import "./globals.css";

import { Outfit } from "next/font/google";
import { env } from "process";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Easily create smart links | Grabby",
  description: "Quickly shorten your URLs and track analytics.",
  metadataBase: env.NEXT_PUBLIC_URL
    ? new URL(env.NEXT_PUBLIC_URL)
    : new URL("https://grabby.co"),
  openGraph: {
    siteName: "Grabby",
    url: env.NEXT_PUBLIC_URL
      ? new URL(env.NEXT_PUBLIC_URL)
      : new URL("https://grabby.co"),
    images: [
      {
        url: "/opengraph-image.png",
        alt: "Grabby Open Graph Image",
      },
    ],
  },
  twitter: {
    images: [
      {
        url: "/twitter-image.png",
        alt: "Grabby Twitter Image",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body>
    </html>
  );
}

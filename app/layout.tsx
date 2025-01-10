import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { env } from "process";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1f1f" },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  title: "Easily create smart links | Grabby",
  description: "Easily create smart short links with Grabby.",
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
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>{children}</body>
    </html>
  );
}

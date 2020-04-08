import type { Metadata } from "next";

import { LayoutShell } from "@/components/LayoutShell";

import "./globals.css";



export const metadata: Metadata = {

  title: "Skyline Airport Transfers | Fixed Prices Transfers 24/7 | Book Online",

  description:

    "Local Luton operator since 2019. Fixed prices, no surge ever. Door-to-door transfers to every major UK airport.",

  openGraph: {

    type: "website",

    title: "Skyline Airport Transfers | Fixed Prices Transfers 24/7 | Book Online",

    url: "https://www.example.com/",


  },

  icons: {

    icon: [

      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },

      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },

    ],

    apple: "/apple-touch-icon.png",

  },

};



export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (

    <html lang="en">

      <head>

        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link

          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"

          rel="stylesheet"

        />

        <link rel="preload" href="/css/redesign/design.css" as="style" />

        <link rel="preload" href="/img/redesign/logo.webp" as="image" type="image/webp" />

        <link href="/css/redesign/design.css" rel="stylesheet" />

        <link href="/css/responsive-overrides.css" rel="stylesheet" />

        <link

          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"

          rel="stylesheet"

        />

      </head>

      <body>

        <LayoutShell>{children}</LayoutShell>

      </body>

    </html>

  );

}



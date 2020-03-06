"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const StickyMobileBar = dynamic(
  () => import("@/components/StickyMobileBar").then((m) => m.StickyMobileBar),
  { ssr: false }
);
export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimal = pathname.startsWith("/book") || pathname.startsWith("/admin");

  if (isMinimal) {
    return <>{children}</>;
  }

  return (
    <div className="lat">
      <Header />
      <main>{children}</main>
      <Footer />
      <StickyMobileBar />
    </div>
  );
}

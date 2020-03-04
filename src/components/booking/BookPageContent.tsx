"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QuoteForm } from "@/components/QuoteForm";
import { buildBookingUrlFromLabels, QUICK_BOOK_ROUTES } from "@/lib/booking-url";

const BookingFlow = dynamic(
  () => import("@/components/booking/BookingFlow").then((m) => ({ default: m.BookingFlow })),
  {
    loading: () => (
      <div className="flex min-h-[480px] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
        <p className="text-sm text-slate-500">Loading your quote…</p>
      </div>
    ),
  }
);
export function BookPageContent() {
  const searchParams = useSearchParams();
  const hasJourney = Boolean(searchParams.get("pickup") && searchParams.get("dropoff"));

  if (hasJourney) {
    return <BookingFlow />;
  }

  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #07203A 0%, #0E3B66 70%, #1056A0 100%)", color: "white", padding: "48px 20px" }}>
        <div className="page-container">
          <div className="eyebrow" style={{ color: "var(--lat-yellow)" }}>Instant quote</div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, marginTop: 12 }}>Get your fixed-price airport transfer</h1>
          <p style={{ marginTop: 12, maxWidth: 520, color: "rgba(255,255,255,.8)" }}>
            Enter your journey below or pick a popular route. Fixed prices, no surge — ever.
          </p>
        </div>
      </section>

      <section className="page-container" style={{ padding: "32px 20px 48px" }}>
        <div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div className="lat">
            <QuoteForm />
          </div>
          <div className="card">
            <div className="eyebrow">Quick routes</div>
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>Popular journeys</h2>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {QUICK_BOOK_ROUTES.map((route) => {
                const href = buildBookingUrlFromLabels(route.pickup, route.dropoff);
                if (!href) return null;
                return (
                  <Link
                    key={route.label}
                    href={href}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1px solid var(--lat-border)",
                      color: "var(--lat-ink)",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {route.label}
                    <i className="bi bi-arrow-right" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

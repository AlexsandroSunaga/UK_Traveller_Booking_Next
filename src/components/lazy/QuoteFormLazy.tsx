"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const QuoteForm = dynamic(
  () => import("@/components/QuoteForm").then((m) => m.QuoteForm),
  {
    loading: () => (
      <div className="card" style={{ padding: 24, minHeight: 220, display: "grid", placeItems: "center" }}>
        <span className="caption">Loading quote form…</span>
      </div>
    ),
  }
);

export function QuoteFormLazy(props: ComponentProps<typeof QuoteForm>) {
  return <QuoteForm {...props} />;
}

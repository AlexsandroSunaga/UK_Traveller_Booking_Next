"use client";

import dynamic from "next/dynamic";

export const ReviewsBeltLazy = dynamic(
  () => import("@/components/ReviewsBelt").then((m) => ({ default: m.ReviewsBelt })),
  {
    loading: () => <div style={{ minHeight: 180 }} aria-hidden />,
  }
);

"use client";

import { useEffect, useRef } from "react";
import { REVIEW_COLORS, REVIEWS } from "@/lib/constants";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ opacity: 0.5, flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function ReviewCard({
  author_name,
  text,
  relative_time_description,
  idx,
}: {
  author_name: string;
  text: string;
  relative_time_description: string;
  idx: number;
}) {
  const initial = author_name.charAt(0).toUpperCase();
  const color = REVIEW_COLORS[idx % REVIEW_COLORS.length];
  const displayText = text.length > 200 ? `${text.substring(0, 200).replace(/\s+\S*$/, "")}…` : text;

  return (
    <div className="lat-review-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ color: "#FFCB1F", fontSize: 14, letterSpacing: 1 }}>★★★★★</span>
        <GoogleIcon />
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--lat-ink)", margin: "0 0 14px", minHeight: 60 }}>
        &ldquo;{displayText}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: "1px solid var(--lat-border)" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: color,
            color: "white",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "var(--lat-ink)", lineHeight: 1.2 }}>{author_name}</div>
          <div style={{ fontSize: 11, color: "var(--lat-muted)", marginTop: 2 }}>{relative_time_description}</div>
        </div>
      </div>
    </div>
  );
}

export function ReviewsBelt() {
  const beltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const belt = beltRef.current;
    if (!belt) return;

    const copies = REVIEWS.length < 6 ? 4 : REVIEWS.length < 10 ? 3 : 2;
    const pct = (100 / copies).toFixed(4);
    belt.style.setProperty("--belt-shift", `-${pct}%`);
    const duration = Math.max(40, REVIEWS.length * 6);
    belt.style.setProperty("--belt-duration", `${duration}s`);
  }, []);

  const copies = REVIEWS.length < 6 ? 4 : REVIEWS.length < 10 ? 3 : 2;
  const cards = Array.from({ length: copies }, (_, c) =>
    REVIEWS.map((review, i) => (
      <ReviewCard key={`${c}-${review.author_name}`} {...review} idx={i} />
    ))
  ).flat();

  return (
    <div className="reviews-belt-wrap" style={{ marginTop: 32 }}>
      <div ref={beltRef} id="reviewsBelt" className="reviews-belt">
        {cards}
      </div>
    </div>
  );
}

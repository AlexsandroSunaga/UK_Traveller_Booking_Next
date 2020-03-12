"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/constants";

export function StickyMobileBar() {
  useEffect(() => {
    document.body.classList.add("has-sticky-bar");

    const anchor = document.getElementById("quote-form") || document.getElementById("hero-quote");
    const bar = document.getElementById("lat-sticky-mobile");
    if (!anchor || !bar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bar.classList.remove("is-armed");
          document.body.classList.remove("sticky-armed");
        } else {
          bar.classList.add("is-armed");
          document.body.classList.add("sticky-armed");
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(anchor);
    return () => {
      observer.disconnect();
      document.body.classList.remove("has-sticky-bar", "sticky-armed");
    };
  }, []);

  return (
    <div className="lat lat-sticky-mobile" id="lat-sticky-mobile" aria-hidden="true">
      <a href={`tel:${SITE.phoneTel}`} className="btn btn-call" style={{ height: 44 }}>
        <i className="bi bi-telephone-fill" style={{ color: "#1FA3D6" }} />
        <span className="tnum">Call us</span>
      </a>
      <a href="#hero-quote" className="btn btn-primary" style={{ height: 44 }}>
        Get a quote
      </a>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { MobileDrawer } from "./MobileDrawer";

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setDrawerOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="site-header">
      <header className="nav">
        <Link href="/" className="logo logo-sm" aria-label="Transfer Aeroporto Brasil — início">
          <Image
            src="/img/redesign/logo.webp"
            alt="Transfer Aeroporto Brasil — Reserva de transfer aeroporto"
            width={200}
            height={92}
            priority
            className="logo-img"
            sizes="200px"
          />
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <a href={`tel:${SITE.phoneTel}`} className="btn btn-call btn-sm">
            <span className="dot" />
            <i className="bi bi-telephone-fill" style={{ fontSize: 12 }} />
            <span className="num tnum">{SITE.phone}</span>
          </a>

          <button
            type="button"
            className="nav-toggle"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((o) => !o)}
          >
            <i className={`bi ${drawerOpen ? "bi-x-lg" : "bi-list"}`} style={{ fontSize: 22 }} />
          </button>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

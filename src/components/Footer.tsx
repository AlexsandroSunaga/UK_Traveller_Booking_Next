import Link from "next/link";
import Image from "next/image";
import { POPULAR_ROUTES, SITE } from "@/lib/constants";
import { routeSlug } from "@/lib/paths";

const FOOTER_COMPANY = [
  { href: "/about-us", label: "About us" },
  { href: "/corporate-airport-transfers", label: "Business accounts" },
  { href: "/about-us/events", label: "Events" },
  { href: "/about-us/press-release", label: "Press & media" },
  { href: "/about-us/faqs", label: "FAQs" },
  { href: "/contact-us", label: "Contact us" },
];

const FOOTER_AIRPORTS = [
  { href: "/airport-transfers/luton", label: "Luton (LTN)" },
  { href: "/airport-transfers/heathrow", label: "Heathrow (LHR)" },
  { href: "/airport-transfers/gatwick", label: "Gatwick (LGW)" },
  { href: "/airport-transfers/stansted", label: "Stansted (STN)" },
  { href: "/airport-transfers/london-city", label: "London City (LCY)" },
  { href: "/airport-transfers/terminal-info", label: "Terminal info" },
];

const FOOTER_LOCAL = [
  { href: "/luton-taxi", label: "Luton" },
  { href: "/luton-taxi/stockwood", label: "Stockwood" },
  { href: "/luton-taxi/zsl-whipsnade", label: "ZSL Whipsnade" },
  { href: "/getting-from-luton-airport-to-nearby-cities", label: "Nearby cities" },
];

const FOOTER_SERVICES = [
  { href: "/services/meet-and-greet", label: "Meet & Greet" },
  { href: "/services/flight-monitoring", label: "Flight monitoring" },
  { href: "/services/baby-seat", label: "Baby seats" },
  { href: "/services/guarantee-prices", label: "Guaranteed prices" },
  { href: "/check-in-times-at-airports", label: "Check-in times" },
];

const FOOTER_HELP = [
  { href: "/book", label: "Get a quote" },
  { href: "/about-us/faqs", label: "FAQs" },
  { href: "/contact-us", label: "Contact us" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/sitemap", label: "Sitemap" },
];

function FooterLinks({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h5 style={{ color: "white", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 14px" }}>
        {title}
      </h5>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(222deg, #1056A0 38%, #07203A 104%)",
        color: "rgba(255,255,255,.78)",
        padding: "44px 20px 20px",
        fontSize: 14,
      }}
      className="site-footer lat-pad-d80"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Image src="/img/redesign/logo.webp" alt="Skyline Airport Transfers" width={120} height={56} style={{ height: 56, width: "auto", display: "block" }} />
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", maxWidth: 320, lineHeight: 1.5 }}>
              Powered by {SITE.company}. Local Luton operator. Fixed prices, no surge ever.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginBottom: 4 }}>Open 24/7 — call us anytime</div>
            <a
              href={`tel:${SITE.phoneTel}`}
              style={{
                display: "inline-flex",
                gap: 8,
                alignItems: "center",
                color: "white",
                fontWeight: 700,
                fontSize: 22,
                fontFamily: "var(--lat-font-display)",
              }}
            >
              <i className="bi bi-telephone-fill" style={{ fontSize: 18 }} />
              <span className="tnum">{SITE.phone}</span>
            </a>
          </div>
        </div>

        <div
          style={{
            padding: "14px 0",
            borderTop: "1px solid rgba(255,255,255,.1)",
            borderBottom: "1px solid rgba(255,255,255,.1)",
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: 24,
            fontSize: 13,
          }}
        >
          <span>
            <strong style={{ color: "white" }}>WhatsApp</strong> ·{" "}
            <a href={`https://wa.me/${SITE.whatsappTel}`} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,.7)" }} className="tnum">
              {SITE.whatsapp}
            </a>
          </span>
          <span>
            <strong style={{ color: "white" }}>Email</strong> ·{" "}
            <a href={`mailto:${SITE.email}`} style={{ color: "rgba(255,255,255,.7)" }}>
              {SITE.email}
            </a>
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "28px 24px", padding: "28px 0" }} className="footer-grid">
          <FooterLinks title="Company" links={FOOTER_COMPANY} />
          <FooterLinks title="Top airports" links={FOOTER_AIRPORTS} />
          <FooterLinks title="Local areas" links={FOOTER_LOCAL} />
          <FooterLinks title="Services" links={FOOTER_SERVICES} />
          <FooterLinks title="Help" links={FOOTER_HELP} />
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", padding: "20px 0 4px" }}>
          <h5 style={{ color: "white", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Popular Luton Airport routes
          </h5>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", fontSize: 13 }}>
            {POPULAR_ROUTES.map((route) => (
              <Link
                key={route}
                href={`/transfers/${routeSlug(route)}`}
                style={{ color: "rgba(255,255,255,.7)" }}
              >
                {route}
              </Link>
            ))}
            <Link href="/transfers" style={{ color: "white", fontWeight: 600 }}>
              All routes →
            </Link>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.12)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 12,
            color: "rgba(255,255,255,.55)",
          }}
        >
          <div>
            © {new Date().getFullYear()} {SITE.name} · Powered by {SITE.company} · Company No. {SITE.companyNo}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["VISA", "MASTERCARD", "AMEX", "CASH"].map((card) => (
              <span
                key={card}
                className="tnum"
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "rgba(255,255,255,.08)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {card}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

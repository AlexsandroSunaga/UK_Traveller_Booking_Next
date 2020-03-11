import Link from "next/link";
import { QuoteFormLazy } from "@/components/lazy/QuoteFormLazy";
import { SITE } from "@/lib/constants";
import type { PageContent } from "@/lib/pages";
import { FAQ_ITEMS, getSitemapLinks } from "@/lib/pages";
import { AREA_TOWNS, SERVICE_CARDS } from "@/lib/site-content";
import { ContactForm } from "./ContactForm";
import { BusinessContactForm } from "./BusinessContactForm";

type Props = {
  page: PageContent;
};

export function PageLayout({ page }: Props) {
  const breadcrumbs = page.path.split("/").filter(Boolean);

  return (
    <>
      <section className="lat-page-hero lat-pad-d80">
        <div className="lat-page-hero-inner">
          <nav className="lat-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {breadcrumbs.map((crumb, i) => {
              const href = "/" + breadcrumbs.slice(0, i + 1).join("/");
              const label = crumb.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              const isLast = i === breadcrumbs.length - 1;
              return (
                <span key={href}>
                  {" / "}
                  {isLast ? <span>{label}</span> : <Link href={href}>{label}</Link>}
                </span>
              );
            })}
          </nav>

          <div className={page.template === "contact" || page.template === "sitemap" ? "" : "lat-page-hero-grid"}>
            <div>
              {page.eyebrow && <div className="eyebrow">{page.eyebrow}</div>}
              <h1 className="h-1" style={{ marginTop: 12, fontSize: "clamp(28px, 4vw, 40px)" }}>
                {page.title}
              </h1>
              <p className="body-lg" style={{ marginTop: 16, maxWidth: 640 }}>
                {page.intro}
              </p>

              {page.features && (
                <ul style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", marginTop: 20, padding: 0, listStyle: "none" }}>
                  {page.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
                      <span className="check" style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--lat-primary-light)", color: "var(--lat-primary-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="bi bi-check2" style={{ fontSize: 11 }} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {page.template !== "contact" && page.template !== "sitemap" && page.template !== "hub-areas" && (
                <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href="/book" className="btn btn-primary">Get a quote</Link>
                  <a href={`tel:${SITE.phoneTel}`} className="btn btn-call">
                    <span className="dot" />
                    Call {SITE.phone}
                  </a>
                </div>
              )}
            </div>

            {page.template !== "contact" && page.template !== "sitemap" && (
              <div className="lat-page-quote">
                <QuoteFormLazy defaultPickup={page.defaultPickup} defaultDropoff={page.defaultDropoff} />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="lat-page-body lat-pad-d80">
        {page.template === "hub-areas" && <AreasHub />}
        {page.template === "hub-services" && <ServicesHub />}
        {page.template === "hub-airports" && <AirportsHub links={page.relatedLinks ?? []} />}
        {page.template === "hub-business" && <BusinessHub />}
        {page.template === "contact" && <ContactHub />}
        {page.template === "sitemap" && <SitemapContent />}
        {page.template === "faq" && <FaqContent />}
        {(page.template === "default" || page.template === "airport" || page.template === "route" || !page.template) && (
          <DefaultContent page={page} />
        )}
      </div>
    </>
  );
}

function AreasHub() {
  return (
    <>
      <div className="section-head">
        <div className="eyebrow">Choose your area</div>
        <h2 className="h-2">Local airport taxis, every area.</h2>
        <p className="body-lg" style={{ maxWidth: 720 }}>
          Fixed-price airport taxis to and from every major airport. Quoted upfront, no meter, no surge — door-to-door, 24/7.
        </p>
      </div>
      <div className="lat-area-grid">
        {AREA_TOWNS.map((area) => (
          <Link key={area.slug} href={area.href} className="lat-area-card">
            <span className="area-name">{area.name} Airport Taxis</span>
            <span className="area-meta tnum">{area.miles} mi · {area.minutes} min from Luton</span>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 48, padding: 32, background: "var(--lat-primary-light)", borderRadius: 16, textAlign: "center" }}>
        <h3 className="h-3">Going to another airport?</h3>
        <p className="body-lg" style={{ marginTop: 8 }}>We also run fixed-price transfers to Gatwick, Stansted, London City and central London.</p>
        <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/airport-transfers" className="btn btn-secondary">See all airports</Link>
          <Link href="/book" className="btn btn-primary">Get a fixed quote</Link>
        </div>
      </div>
    </>
  );
}

function ServicesHub() {
  return (
    <>
      <div className="section-head">
        <div className="eyebrow">What we offer</div>
        <h2 className="h-2">Fixed-price transfers — plus the extras that matter.</h2>
        <p className="body-lg" style={{ maxWidth: 720 }}>
          Meet & Greet is just one optional add-on. Free flight monitoring, free child seats and our price guarantee come as standard.
        </p>
      </div>
      <div className="lat-service-grid">
        {SERVICE_CARDS.map((card) => (
          <Link key={card.slug} href={card.href} className="lat-service-card">
            <span className="service-tag">{card.tag}</span>
            <span className="service-title">{card.title}</span>
            <span className="service-desc">{card.description}</span>
            <span className="service-link">
              Learn more <i className="bi bi-arrow-right" />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

function AirportsHub({ links }: { links: { href: string; label: string }[] }) {
  return (
    <>
      <div className="section-head">
        <div className="eyebrow">All UK airports</div>
        <h2 className="h-2">Every airport. Every doorstep.</h2>
        <p className="body-lg">Pick your airport to see popular routes and get an instant fixed-price quote.</p>
      </div>
      <div className="lat-area-grid">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="lat-area-card">
            <span className="area-name">{link.label}</span>
            <span className="area-meta">Fixed-price transfers · Free flight monitoring</span>
          </Link>
        ))}
      </div>
    </>
  );
}

function BusinessHub() {
  const features = [
    { title: "One monthly invoice", desc: "Every trip consolidated into a single itemised statement — pay by bank transfer or card link." },
    { title: "Priority allocation", desc: "Account jobs are allocated first. Early-morning staff runs get our most reliable drivers." },
    { title: "Every major airport", desc: "Luton, Heathrow, Gatwick, Stansted, London City — plus cruise ports and stations." },
    { title: "Flights tracked", desc: "We track every inbound flight and adjust pickups automatically for delays." },
    { title: "Fixed prices, no surge", desc: "The price quoted is the price invoiced — nights, weekends and holidays included." },
    { title: "24/7, 365", desc: "Red-eye departures, late arrivals, bank holidays. The phone is always answered." },
  ];

  return (
    <>
      <div className="section-head">
        <div className="eyebrow">Why companies use us</div>
        <h2 className="h-2">Everything your bookings need, none of the admin.</h2>
      </div>
      <div className="lat-feature-grid" style={{ marginBottom: 48 }}>
        {features.map((f) => (
          <div key={f.title} className="lat-feature-card">
            <h3 className="h-3">{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="section-head">
        <h2 className="h-2">Open an account</h2>
        <p className="body-lg">No minimum volume, no setup fee, no contract. Prefer to talk? Call {SITE.phone}.</p>
      </div>
      <div style={{ maxWidth: 560 }}>
        <BusinessContactForm />
      </div>
    </>
  );
}

function ContactHub() {
  return (
    <div style={{ display: "grid", gap: 40, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      <div>
        <h2 className="h-3" style={{ marginBottom: 16 }}>Get in touch</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <a href={`tel:${SITE.phoneTel}`} className="card" style={{ display: "flex", gap: 14, alignItems: "center", padding: 20, color: "inherit" }}>
            <span style={{ width: 44, height: 44, borderRadius: 10, background: "var(--lat-primary-light)", color: "var(--lat-primary-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <i className="bi bi-telephone-fill" />
            </span>
            <div>
              <div className="caption">24/7 phone</div>
              <div className="tnum" style={{ fontWeight: 700, fontSize: 18 }}>{SITE.phone}</div>
            </div>
          </a>
          <a href={`https://wa.me/${SITE.whatsappTel}`} target="_blank" rel="noopener noreferrer" className="card" style={{ display: "flex", gap: 14, alignItems: "center", padding: 20, color: "inherit" }}>
            <span style={{ width: 44, height: 44, borderRadius: 10, background: "#dcfce7", color: "#16a34a", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <i className="bi bi-whatsapp" />
            </span>
            <div>
              <div className="caption">WhatsApp</div>
              <div style={{ fontWeight: 600 }}>{SITE.whatsapp}</div>
            </div>
          </a>
          <a href={`mailto:${SITE.email}`} className="card" style={{ display: "flex", gap: 14, alignItems: "center", padding: 20, color: "inherit" }}>
            <span style={{ width: 44, height: 44, borderRadius: 10, background: "var(--lat-primary-light)", color: "var(--lat-primary-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <i className="bi bi-envelope-fill" />
            </span>
            <div>
              <div className="caption">Email</div>
              <div style={{ fontWeight: 600 }}>{SITE.email}</div>
            </div>
          </a>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}

function DefaultContent({ page }: { page: PageContent }) {
  return (
    <>
      {page.sections?.map((section) => (
        <div key={section.title} style={{ marginBottom: 36 }}>
          <h2 className="h-3" style={{ marginBottom: 12 }}>{section.title}</h2>
          <p className="body-lg">{section.body}</p>
          {section.bullets && (
            <ul style={{ marginTop: 14, paddingLeft: 0, listStyle: "none" }}>
              {section.bullets.map((b) => (
                <li key={b} style={{ display: "flex", gap: 10, padding: "6px 0", fontSize: 15 }}>
                  <i className="bi bi-check2" style={{ color: "var(--lat-primary-deep)", fontWeight: 700, marginTop: 3 }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {page.relatedLinks && page.relatedLinks.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 className="h-3" style={{ marginBottom: 16 }}>
            {page.path.startsWith("airport-transfers/") ? "Popular routes" : "Quick links"}
          </h2>
          <div className="lat-area-grid">
            {page.relatedLinks.map((link) => (
              <Link key={link.href + link.label} href={link.href} className="lat-area-card">
                <span className="area-name">{link.label}</span>
                <span className="area-meta">Get instant quote <i className="bi bi-arrow-right" /></span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function FaqContent() {
  return (
    <div style={{ maxWidth: 800 }}>
      {FAQ_ITEMS.map((item) => (
        <details key={item.q} className="faq" open={item.open}>
          <summary className="faq-q" style={{ listStyle: "none" }}>
            <span>{item.q}</span>
            <span className="faq-plus"><i className="bi bi-plus" style={{ fontSize: 16 }} /></span>
          </summary>
          <div className="faq-a">{item.a}</div>
        </details>
      ))}
    </div>
  );
}

function SitemapContent() {
  const links = getSitemapLinks();
  const groups = [...new Set(links.map((l) => l.group))];

  return (
    <div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
      {groups.map((group) => (
        <div key={group}>
          <h2 className="h-3" style={{ fontSize: 16, marginBottom: 12 }}>{group}</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {links.filter((l) => l.group === group).map((link) => (
              <li key={link.href}>
                <Link href={link.href} style={{ fontSize: 14, fontWeight: 500 }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

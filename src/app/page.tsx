import Link from "next/link";
import Image from "next/image";
import { QuoteForm } from "@/components/QuoteForm";
import { ReviewsBeltLazy } from "@/components/lazy/ReviewsBeltLazy";
import { AIRPORTS, FAQ_ITEMS, SITE, VEHICLES } from "@/lib/constants";
import { buildBookingUrlFromLabels } from "@/lib/booking-url";

const HERO_USPS = [
  { icon: "bi-currency-pound", text: "Low fixed prices" },
  { icon: "bi-shield-check", text: "No surge — ever" },
  { icon: "bi-telephone-fill", text: "24/7 phone support" },
  { icon: "bi-airplane-fill", text: "Free flight monitoring" },
];

const REASSURANCE = [
  "Free cancellation before dispatch",
  "Pay driver, card or online",
  "Fixed prices — no surge",
  "Live flight monitoring",
  "All major airports & ports",
];

const HOW_IT_WORKS = [
  { step: "01", title: "Get your price", desc: "Enter pickup and destination. See the fixed total fare instantly — no sign-up required." },
  { step: "02", title: "Book in seconds", desc: "Add your date, time and details. Pay online, or pay by cash/card directly to the driver." },
  { step: "03", title: "We track your flight", desc: "Running late? Early? We adjust automatically at no extra charge — don't worry about exact arrival time." },
  { step: "04", title: "Meet at pickup", desc: "Your driver is waiting at the airport's designated pickup area, or at your door for outbound journeys." },
];

const COVERAGE_FEATURES = [
  { icon: "bi-geo-alt-fill", title: "Door-to-door, anywhere", desc: "Home, hotel, office, friend's place — your exact pickup address." },
  { icon: "bi-airplane-fill", title: "Cruise ports & stations", desc: "Dover, Southampton, Tilbury · St Pancras, King's Cross." },
  { icon: "bi-shield-check", title: "Out-of-area? No problem", desc: "Most of the UK is in our network — get a quote and we'll confirm." },
];

const FEATURE_STRIP = [
  { icon: "bi-airplane-fill", title: "Free flight tracking", desc: "We monitor your flight in real time, so your pickup is perfectly timed even when arrivals slip." },
  { icon: "bi-shield-check", title: "One clear price", desc: "Airport charges, parking and waiting time all included. The number you see is the number you pay." },
  { icon: "bi-telephone-fill", title: "24/7 customer support", desc: "Real humans, based in Luton, answering the phone day and night — 365 days a year." },
];

const WHY_US = [
  {
    icon: "bi-shield-fill-check",
    title: "Vetted, Luton-based drivers",
    desc: "Every driver holds a Private Hire licence from Luton Borough Council, is DBS-checked, and is trained by us — not subcontracted from an agency.",
    bullets: ["Private Hire licensed", "Trained in customer service & accessibility", "Same drivers, same cars, every time"],
  },
  {
    icon: "bi-lightning-fill",
    title: "No surprises at the airport",
    desc: "The price you see in the quote is the total fare. Airport charges, parking, waiting time and tolls are all rolled in.",
    bullets: ["1 hour free waiting after landing — no extra delay charges", "No card-on-file — pay how you want", "Free cancellation any time before dispatch"],
  },
];

const PRICING_BELIEF = [
  { icon: "bi-shield-check", title: "Fixed price, full stop", desc: "The total fare is locked in the moment you book. Whether it rains, snows, or it's the Friday before Christmas — your number doesn't change." },
  { icon: "bi-lightning-fill", title: "No surge. Ever.", desc: "We don't have a multiplier. Rush hour, bank holidays, 3am — same fare as Tuesday lunchtime. We'd rather build a long-term reputation than catch you on a bad day." },
  { icon: "bi-check-lg", title: "All-inclusive by default", desc: "Airport charges, the first hour of waiting time after landing, and road tolls — all baked into the quote. Your driver won't ask for a top-up." },
  { icon: "bi-star-fill", title: "Honestly competitive", desc: "We benchmark against every Luton operator weekly and stay among the lowest. Find a like-for-like quote that beats us by more than 5% — show us, and we'll match it." },
];

function StepCircle({ children, bg = "white" }: { children: React.ReactNode; bg?: string }) {
  return (
    <div
      className="tnum"
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: bg,
        border: "1.5px solid var(--lat-primary-deep)",
        color: "var(--lat-primary-deep)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--lat-font-display)",
        fontWeight: 700,
        fontSize: 18,
        margin: "0 auto 24px",
        position: "relative",
        zIndex: 1,
        boxShadow: `0 0 0 8px ${bg}`,
      }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.example.com/#business",
    name: SITE.name,
    url: SITE.url,
    telephone: `+44${SITE.phoneTel.slice(1)}`,
    email: SITE.email,
    image: `${SITE.url}/img/redesign/logo.webp`,
    priceRange: "££",
    areaServed: "Bedfordshire, Hertfordshire and Buckinghamshire",
    address: { "@type": "PostalAddress", addressLocality: "Luton", addressRegion: "Bedfordshire", addressCountry: "GB" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "250" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="hero" style={{ position: "relative" }}>
        <div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 80px 80px", position: "relative", zIndex: 2 }}
          className="lat-pad-d80 lat-pad-d80-y"
          id="hero-quote"
        >
          <div className="hero-grid">
            <div className="hero-text">
              <div className="hero-headline lat-anim lat-anim-1">
                <span className="pill pill-trust">
                  <i className="bi bi-check2" /> Trusted since {SITE.founded} · {SITE.rating}★ from {SITE.reviewCount.toLocaleString()}+ reviews
                </span>
                <h1 className="h-display" style={{ marginTop: 18, fontSize: 60, lineHeight: 1.05 }} id="hero-h1">
                  Skyline Airport Transfers — <span style={{ color: "var(--lat-primary-deep)" }}>Fixed Price Transfers, 24/7</span>
                </h1>
              </div>
              <div className="hero-supporting lat-anim lat-anim-3">
                <p className="hero-subhead" style={{ fontSize: 18, color: "var(--lat-muted)", marginTop: 18, fontWeight: 500, maxWidth: 480, lineHeight: 1.5 }}>
                  Despite the name, we run transfers to and from <strong style={{ color: "var(--lat-ink)", fontWeight: 600 }}>every major UK airport</strong> — Luton, Heathrow, Gatwick, Stansted, City, Southend and beyond — plus cruise ports, stations and any other door-to-door transfer you need. Fixed price, no surge, ever.
                </p>
                <ul className="hero-usps" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", margin: "28px 0 0", padding: "24px 0 0", listStyle: "none", borderTop: "1px solid rgba(31,163,214,.18)" }}>
                  {HERO_USPS.map((item) => (
                    <li key={item.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500, color: "var(--lat-ink)" }}>
                      <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--lat-primary-light)", color: "var(--lat-primary-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <i className={`bi ${item.icon}`} style={{ fontSize: 16 }} />
                      </span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="hero-quote lat-anim lat-anim-2">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance strip */}
      <div style={{ padding: "24px 80px", borderBottom: "1px solid var(--lat-border)", background: "white" }} className="lat-pad-d80">
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="reassure" style={{ justifyContent: "center" }}>
            {REASSURANCE.map((text) => (
              <span key={text}>
                <span className="check"><i className="bi bi-check2" style={{ fontSize: 12 }} /></span> {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <section style={{ padding: "80px 80px", background: "white", borderBottom: "1px solid var(--lat-border)" }} className="lat-pad-d80 lat-pad-d80-y">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-head">
            <div className="eyebrow">How it works</div>
            <h2 className="h-2">Four steps. <span style={{ color: "var(--lat-primary-deep)", fontStyle: "italic" }}>Zero stress.</span></h2>
            <p className="body-lg" style={{ maxWidth: 540 }}>We&apos;ve refined every touchpoint over nine years. Here&apos;s exactly what happens from the moment you land here to the moment you arrive.</p>
          </div>
          <div style={{ position: "relative", marginTop: 48, padding: "0 4%" }} className="how-it-works-row">
            <div style={{ position: "absolute", left: "12.5%", right: "12.5%", top: 32, height: 0, borderTop: "2px dashed var(--lat-primary-mid)", opacity: 0.7 }} className="how-it-works-connector" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, position: "relative" }} className="how-it-works-grid">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} style={{ textAlign: "center" }}>
                  <StepCircle>{item.step}</StepCircle>
                  <h3 className="h-3" style={{ fontSize: 18, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--lat-muted)", lineHeight: 1.55, margin: 0, maxWidth: 220, marginInline: "auto" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage / airports */}
      <section style={{ padding: "80px 80px", background: "var(--lat-sky-white)" }} className="lat-pad-d80 lat-pad-d80-y">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-head">
            <div className="eyebrow">Don&apos;t let the name fool you</div>
            <h2 className="h-2">Every airport. <span style={{ color: "var(--lat-primary-deep)", fontStyle: "italic" }}>Every doorstep.</span></h2>
            <p className="body-lg" style={{ maxWidth: 600 }}>We&apos;re called Skyline Airport Transfers because Luton is where we live, dispatch, and know best — but we run door-to-door transfers to and from every major UK airport, every cruise port, and every postcode in between.</p>
          </div>
          <div style={{ position: "relative", marginTop: 48, padding: "0 2%" }} className="coverage-row">
            <div style={{ position: "absolute", left: "8%", right: "8%", top: 32, height: 0, borderTop: "2px dashed var(--lat-primary-mid)", opacity: 0.7 }} className="coverage-connector" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, position: "relative" }} className="coverage-grid">
              {AIRPORTS.map((airport) => (
                <Link key={airport.code} href={airport.href} style={{ textAlign: "center", display: "block", color: "inherit" }}>
                  <StepCircle bg="var(--lat-sky-white)">
                    <span style={{ fontSize: 14 }}>{airport.code}</span>
                  </StepCircle>
                  <h3 className="h-3" style={{ fontSize: 16, marginBottom: 4 }}>{airport.name}</h3>
                </Link>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 48, padding: "24px 32px", background: "white", borderRadius: 16, border: "1px solid var(--lat-border)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="coverage-strip">
            {COVERAGE_FEATURES.map((f) => (
              <div key={f.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--lat-primary-light)", color: "var(--lat-primary-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={`bi ${f.icon}`} style={{ fontSize: 18 }} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--lat-font-display)", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{f.title}</div>
                  <p style={{ fontSize: 13, color: "var(--lat-muted)", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/book" className="btn btn-primary">
              Get your quote <i className="bi bi-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section style={{ background: "white", borderBottom: "1px solid var(--lat-border)", padding: "40px 80px" }} className="lat-pad-d80">
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }} className="feature-strip-grid">
          {FEATURE_STRIP.map((f) => (
            <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--lat-primary-light)", color: "var(--lat-primary-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`bi ${f.icon}`} style={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="h-3" style={{ fontSize: 17, marginBottom: 4 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--lat-muted)", lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section style={{ padding: "80px 80px", background: "white" }} className="lat-pad-d80 lat-pad-d80-y">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-head" style={{ textAlign: "center", alignItems: "center", marginBottom: 48 }}>
            <div className="eyebrow">Why riders pick us</div>
            <h2 className="h-2">A local Luton operator that does one thing well — airport transfers, anywhere in the UK.</h2>
            <p className="body-lg" style={{ maxWidth: 720, margin: "0 auto" }}>No app to download, no surge pricing, no card on file. Just a fixed quote, a vetted local driver, and a clean car at your door — to or from any airport.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="why-us-grid">
            {WHY_US.map((card) => (
              <div key={card.title} className="card" style={{ padding: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--lat-primary-light)", color: "var(--lat-primary-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <i className={`bi ${card.icon}`} style={{ fontSize: 26 }} />
                </div>
                <h3 className="h-3" style={{ fontSize: 18, marginBottom: 8 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: "var(--lat-muted)", lineHeight: 1.55, margin: 0 }}>{card.desc}</p>
                <ul style={{ margin: "14px 0 0", padding: 0, listStyle: "none" }}>
                  {card.bullets.map((b) => (
                    <li key={b} style={{ fontSize: 14, color: "var(--lat-ink)", display: "flex", gap: 8, padding: "4px 0", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--lat-primary-deep)", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section style={{ padding: "80px 80px", background: "var(--lat-sky-white)" }} className="lat-pad-d80 lat-pad-d80-y">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div className="eyebrow">Our fleet</div>
              <h2 className="h-2">Five vehicles, one fixed price.</h2>
              <p className="body-lg" style={{ maxWidth: 540 }}>Same drivers, same dispatch — pick what fits. Quote at checkout.</p>
            </div>
            <Link href="/book" className="btn btn-tertiary">All vehicles <i className="bi bi-arrow-right" /></Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="fleet-grid">
            {VEHICLES.map((v) => (
              <div key={v.name} className="vehicle">
                <div className="v-illu">
                  <Image src={v.image} alt={v.name} width={110} height={70} sizes="110px" style={{ objectFit: "contain" }} loading="lazy" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="v-name">{v.name}</div>
                    {v.premium && <span className="pill pill-trust" style={{ padding: "2px 8px", fontSize: 11 }}>Premium</span>}
                  </div>
                  <div className="caption" style={{ marginTop: 2 }}>{v.example}</div>
                  <div className="v-meta">
                    <span><i className="bi bi-people-fill" /> {v.passengers}</span>
                    <span><i className="bi bi-suitcase-lg-fill" /> {v.luggage}</span>
                    <span><i className="bi bi-briefcase-fill" /> {v.hand}</span>
                  </div>
                </div>
                <div className="v-cta">
                  <Link
                    href={buildBookingUrlFromLabels("London Luton Airport", "Central London") ?? "/book"}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--lat-primary-deep)", fontWeight: 600, fontSize: 14 }}
                  >
                    Get a quote <i className="bi bi-arrow-right" style={{ fontSize: 13 }} />
                  </Link>
                  <div className="caption">Fixed price</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing belief */}
      <section style={{ padding: "80px 80px", background: "linear-gradient(135deg, #07203A 0%, #0E3B66 70%, #1056A0 100%)", color: "white", position: "relative", overflow: "hidden" }} className="lat-pad-d80 lat-pad-d80-y">
        <div style={{ position: "absolute", right: "-10%", top: "-20%", width: "40%", height: "120%", background: "radial-gradient(closest-side, rgba(255,203,31,.16), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720, marginBottom: 48 }}>
            <div className="eyebrow" style={{ color: "var(--lat-yellow)" }}>Our pricing belief</div>
            <h2 className="h-2" style={{ fontSize: 36, color: "white", marginTop: 12, lineHeight: 1.15 }}>
              Surge pricing is a tax on your bad day.<br />
              <span style={{ color: "var(--lat-yellow)", fontStyle: "italic" }}>We refuse to charge it.</span>
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.78)", marginTop: 16, lineHeight: 1.6 }}>
              Other apps spike fares when you need them most. We don&apos;t. The price you see when you get a quote is the exact price you pay — at any hour, in any weather, on any day.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32, marginTop: 32 }} className="belief-grid">
            {PRICING_BELIEF.map((item) => (
              <div key={item.title} style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", backdropFilter: "blur(8px)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,203,31,.15)", color: "var(--lat-yellow)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <i className={`bi ${item.icon}`} style={{ fontSize: 20 }} />
                </div>
                <h3 style={{ fontFamily: "var(--lat-font-display)", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 8, lineHeight: 1.25 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.7)", lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" style={{ padding: "64px 0 56px", background: "linear-gradient(180deg, var(--lat-primary-light) 0%, var(--lat-arctic-soft) 100%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 80px" }} className="lat-pad-d80">
          <div className="section-head" style={{ textAlign: "center", alignItems: "center" }}>
            <div className="eyebrow">What customers say</div>
            <h2 className="h-2">Real reviews. <span style={{ color: "var(--lat-primary-deep)", fontStyle: "italic" }}>Real travellers.</span></h2>
            <p className="body-lg" style={{ maxWidth: 540, margin: "8px auto 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ color: "#FFCB1F", fontSize: 18, letterSpacing: 1 }}>★★★★★</span>
              <span style={{ color: "var(--lat-ink)", fontWeight: 600 }}>Trusted by thousands of Luton travellers since {SITE.founded}</span>
            </p>
          </div>
        </div>
        <ReviewsBeltLazy />
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <a
            href="#reviews"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--lat-primary-deep)", fontWeight: 600, fontSize: 14 }}
          >
            Sample reviews shown for demo purposes
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "64px 80px", background: "white" }} className="lat-pad-d80 lat-pad-d80-y">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-head">
            <div className="eyebrow">Common questions</div>
            <h2 className="h-2">Frequently asked questions.</h2>
            <p className="body-lg" style={{ maxWidth: 600 }}>Booking an airport transfer should be the easy bit. If you can&apos;t see your question below, the team is on the phone or WhatsApp 24/7.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 8 }} className="faq-grid">
            <div>
              {FAQ_ITEMS.slice(0, 3).map((item) => (
                <details key={item.q} className="faq" open={item.open}>
                  <summary className="faq-q" style={{ listStyle: "none" }}>
                    <span>{item.q}</span>
                    <span className="faq-plus"><i className="bi bi-plus" style={{ fontSize: 16 }} /></span>
                  </summary>
                  <div className="faq-a">{item.a}</div>
                </details>
              ))}
            </div>
            <div>
              {FAQ_ITEMS.slice(3).map((item) => (
                <details key={item.q} className="faq">
                  <summary className="faq-q" style={{ listStyle: "none" }}>
                    <span>{item.q}</span>
                    <span className="faq-plus"><i className="bi bi-plus" style={{ fontSize: 16 }} /></span>
                  </summary>
                  <div className="faq-a">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 80px", background: "var(--lat-arctic-soft)", borderTop: "1px solid var(--lat-border)", textAlign: "center" }} className="lat-pad-d80 lat-pad-d80-y">
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 className="h-1" style={{ fontSize: 44, lineHeight: 1.1, marginBottom: 16 }}>Got a flight to catch?</h2>
          <p style={{ fontSize: 17, color: "var(--lat-muted)", marginBottom: 32, lineHeight: 1.55 }}>
            Get a fixed-price quote in 60 seconds, or call our 24/7 dispatch team and we&apos;ll book you in over the phone.
          </p>
          <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/book" className="btn btn-primary" style={{ padding: "14px 24px", fontSize: 15 }}>
              Get a quote <i className="bi bi-arrow-right" />
            </Link>
            <a href={`tel:${SITE.phoneTel}`} className="btn btn-call" style={{ padding: "14px 24px", fontSize: 15 }}>
              <span className="dot" />
              Call <span className="tnum">{SITE.phone}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

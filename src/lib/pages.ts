import { AIRPORTS, FAQ_ITEMS, POPULAR_ROUTES, SITE, UK_LOCATIONS, VEHICLES } from "./constants";
import { buildBookingUrlFromLabels } from "./booking-url";
import { routeSlug } from "./paths";
import { AREA_TOWNS } from "./site-content";

export type PageSection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type RelatedLink = {
  href: string;
  label: string;
};

export type PageContent = {
  path: string;
  title: string;
  metaDescription: string;
  eyebrow?: string;
  intro: string;
  sections?: PageSection[];
  features?: string[];
  defaultPickup?: string;
  defaultDropoff?: string;
  relatedLinks?: RelatedLink[];
  showFaq?: boolean;
  template?: "default" | "contact" | "sitemap" | "faq" | "hub-areas" | "hub-services" | "hub-airports" | "hub-business" | "airport" | "route";
};

const AIRPORT_SLUGS: Record<string, { code: string; pickup: string }> = {
  luton: { code: "LTN", pickup: "London Luton Airport" },
  heathrow: { code: "LHR", pickup: "London Heathrow Airport" },
  gatwick: { code: "LGW", pickup: "London Gatwick Airport" },
  stansted: { code: "STN", pickup: "London Stansted Airport" },
  "london-city": { code: "LCY", pickup: "London City Airport" },
  southend: { code: "SEN", pickup: "London Southend Airport" },
};

const SERVICES: { slug: string; title: string; intro: string; bullets: string[] }[] = [
  {
    slug: "meet-and-greet",
    title: "Meet & Greet Service",
    intro: "Your driver meets you in the arrivals hall with a name board — no searching for pickup points.",
    bullets: ["Driver tracks your flight in real time", "Name board in arrivals hall", "Help with luggage to the car", "Included at no extra charge on airport pickups"],
  },
  {
    slug: "flight-monitoring",
    title: "Free Flight Monitoring",
    intro: "We track your flight automatically and adjust pickup time if you land early or late.",
    bullets: ["Real-time flight tracking", "No extra charge for delays", "1 hour free waiting after landing", "Driver notified of schedule changes"],
  },
  {
    slug: "baby-seat",
    title: "Child & Baby Seats",
    intro: "Booster, child and infant seats fitted free of charge — just tell us when you book.",
    bullets: ["Infant, child and booster seats available", "Fitted before pickup", "No extra charge", "Specify ages when booking"],
  },
  {
    slug: "guarantee-prices",
    title: "Guaranteed Fixed Prices",
    intro: "The price you see at booking is the price you pay. No surge, no hidden fees, no top-ups.",
    bullets: ["Fixed fare locked at booking", "Airport fees and tolls included", "No surge pricing — ever", "Price-match within 5% on like-for-like quotes"],
  },
];

const LOCAL_AREAS: { slug: string; title: string; intro: string }[] = [
  { slug: "stockwood", title: "Stockwood Taxis", intro: "Door-to-door transfers between Stockwood and Luton Airport, Heathrow, Gatwick and beyond." },
  { slug: "zsl-whipsnade", title: "ZSL Whipsnade Transfers", intro: "Reliable airport transfers to and from ZSL Whipsnade Zoo and surrounding areas." },
];

function airportPage(slug: string, name: string, code: string, pickup: string): PageContent {
  const destinations = UK_LOCATIONS.map((loc) => ({
    href: buildBookingUrlFromLabels(pickup, loc.name) ?? "/book",
    label: `${name} → ${loc.name}`,
  }));

  return {
    path: `airport-transfers/${slug}`,
    title: `${name} Taxi & Transfer`,
    metaDescription: `Book fixed-price ${name} (${code}) transfers 24/7. Door-to-door, free flight monitoring, no surge pricing.`,
    eyebrow: `${code} · Fixed prices`,
    intro: `Door-to-door ${name} transfers with fixed prices, free flight monitoring and 24/7 dispatch. Same Luton-based drivers, same quality — every journey.`,
    features: ["Instant fixed-price quotes", "Free cancellation before dispatch", "Meet & greet available", "All UK destinations"],
    defaultPickup: pickup,
    template: "airport",
    sections: [
      {
        title: `Why book your ${name} transfer with us`,
        body: `We're a Luton-based operator trusted since ${SITE.founded}. Whether you're flying from ${name} or being picked up after landing, you get one clear price and a vetted local driver.`,
        bullets: ["Private Hire licensed drivers", "DBS-checked and trained in-house", "1 hour free waiting after landing", "Pay online or to the driver"],
      },
      {
        title: "Popular routes",
        body: `Tap a route below to get an instant fixed-price quote for your ${name} transfer.`,
      },
    ],
    relatedLinks: destinations,
  };
}

function routePage(destination: string): PageContent {
  const href = buildBookingUrlFromLabels("London Luton Airport", destination) ?? "/book";
  return {
    path: `transfers/${routeSlug(destination)}`,
    title: `Luton Airport to ${destination} Taxi`,
    metaDescription: `Fixed-price taxi from London Luton Airport to ${destination}. Book online in 60 seconds — no surge, free cancellation.`,
    eyebrow: "Popular route",
    intro: `Fixed-price door-to-door transfer from London Luton Airport to ${destination}. Get an instant quote, choose your vehicle, and confirm in under a minute.`,
    defaultPickup: "London Luton Airport",
    defaultDropoff: destination,
    template: "route",
    features: ["Fixed price — no surge", "Free flight monitoring", "Saloon to 8-seater available", "Return journeys supported"],
    sections: [
      {
        title: `Luton Airport → ${destination}`,
        body: `We run this route daily. Your fare is calculated upfront based on distance and vehicle type — the number you see is the number you pay.`,
        bullets: ["Door-to-door pickup and drop-off", "All tolls and airport fees included", "24/7 phone support", "Free cancellation before dispatch"],
      },
    ],
    relatedLinks: [{ href, label: `Book Luton → ${destination}` }],
  };
}

function buildStaticPages(): Map<string, PageContent> {
  const pages = new Map<string, PageContent>();

  pages.set("airport-transfers", {
    path: "airport-transfers",
    title: "Airport Transfers",
    metaDescription: "Fixed-price airport transfers to and from Luton, Heathrow, Gatwick, Stansted, London City and Southend.",
    eyebrow: "All UK airports",
    intro: "Door-to-door airport transfers with fixed prices, free flight monitoring and no surge — ever. Pick your airport below to see popular routes and get a quote.",
    template: "hub-airports",
    relatedLinks: Object.entries(AIRPORT_SLUGS).map(([slug, a]) => ({
      href: `/airport-transfers/${slug}`,
      label: `${a.pickup.replace("London ", "").replace(" Airport", "")} (${a.code})`,
    })),
    sections: [
      {
        title: "Every major UK airport",
        body: "Despite the name, we cover every major airport in the UK — not just Luton. Same drivers, same fixed prices.",
      },
    ],
  });

  pages.set("airport-transfers/terminal-info", {
    path: "airport-transfers/terminal-info",
    title: "Airport Terminal Pickup Info",
    metaDescription: "Where to meet your driver at Luton, Heathrow, Gatwick, Stansted and other UK airports.",
    eyebrow: "Pickup guidance",
    intro: "Your driver will meet you at the designated private hire pickup area or in the arrivals hall (meet & greet). We send full pickup instructions with your confirmation.",
    sections: [
      { title: "London Luton Airport", body: "Meet at the official taxi pick-up zone in the Mid Stay car park. Your driver will track your flight and adjust for delays.", bullets: ["Mid Stay pickup zone", "Meet & greet in arrivals on request", "1 hour free waiting after landing"] },
      { title: "Heathrow, Gatwick & Stansted", body: "Drivers use the licensed private hire pickup points for your terminal. We'll confirm the exact meeting point when you book.", bullets: ["Terminal-specific pickup points", "Flight tracking included", "Driver contact sent before pickup"] },
    ],
  });

  for (const [slug, info] of Object.entries(AIRPORT_SLUGS)) {
    const airport = AIRPORTS.find((a) => a.code === info.code);
    const name = airport?.fullName.replace("London ", "") ?? info.pickup.replace("London ", "");
    pages.set(`airport-transfers/${slug}`, airportPage(slug, name, info.code, info.pickup));
  }

  pages.set("transfers", {
    path: "transfers",
    title: "Airport Taxis by Area",
    metaDescription: "Airport transfers from Luton to towns and cities across Bedfordshire, Hertfordshire and the UK.",
    eyebrow: "Choose your area",
    intro: "Fixed-price airport taxis to and from every major UK airport — Luton, Heathrow, Gatwick, Stansted and London City. Quoted upfront, no meter, no surge.",
    template: "hub-areas",
    relatedLinks: POPULAR_ROUTES.slice(0, 12).map((r) => ({
      href: `/transfers/${routeSlug(r)}`,
      label: `Luton → ${r}`,
    })),
  });

  for (const route of POPULAR_ROUTES) {
    pages.set(`transfers/${routeSlug(route)}`, routePage(route));
  }

  for (const area of AREA_TOWNS) {
    const key = `transfers/${routeSlug(area.name)}`;
    if (!pages.has(key)) {
      pages.set(key, routePage(area.name));
    }
  }

  for (const loc of UK_LOCATIONS) {
    const key = `transfers/${routeSlug(loc.name)}`;
    if (!pages.has(key)) {
      pages.set(key, routePage(loc.name));
    }
  }

  pages.set("services", {
    path: "services",
    title: "Airport Taxi Services",
    metaDescription: "Meet & greet, flight monitoring, child seats, guaranteed prices and more — all included with Skyline Airport Transfers.",
    eyebrow: "What we offer",
    intro: "Meet & Greet is just one optional add-on. Free flight monitoring, free child seats and our price guarantee come as standard. Pick a service to learn more, or get an instant quote.",
    template: "hub-services",
    relatedLinks: SERVICES.map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
    features: ["Free flight monitoring", "Meet & greet available", "Child seats at no extra charge", "Fixed prices — no surge"],
  });

  for (const service of SERVICES) {
    pages.set(`services/${service.slug}`, {
      path: `services/${service.slug}`,
      title: service.title,
      metaDescription: `${service.title} with Skyline Airport Transfers. ${service.intro}`,
      intro: service.intro,
      sections: [{ title: "What's included", body: service.intro, bullets: service.bullets }],
      relatedLinks: [{ href: "/book", label: "Get a quote" }, { href: "/services", label: "All services" }],
    });
  }

  pages.set("check-in-times-at-airports", {
    path: "check-in-times-at-airports",
    title: "Check-in Times at Airports",
    metaDescription: "Recommended check-in times for UK airports. Plan your transfer pickup accordingly.",
    intro: "Allow plenty of time for your transfer and airport check-in. We recommend these minimum check-in windows — book your pickup to arrive well before these times.",
    sections: [
      { title: "Short-haul flights", body: "Arrive at the airport 2 hours before departure for European and domestic flights.", bullets: ["Luton: 2 hours", "Heathrow: 2 hours", "Gatwick: 2 hours", "Stansted: 2 hours"] },
      { title: "Long-haul flights", body: "Allow 3 hours for intercontinental departures, especially during peak periods.", bullets: ["Add 30–60 min in peak holiday periods", "Book your transfer 3+ hours before departure", "We'll help you plan pickup time when you book"] },
    ],
  });

  pages.set("corporate-airport-transfers", {
    path: "corporate-airport-transfers",
    title: "Corporate & Business Airport Transfers",
    metaDescription: "Corporate airport transfer accounts for businesses. Monthly invoicing, dedicated support, fixed rates.",
    eyebrow: "Business accounts",
    intro: "We already run 900+ transfers a month for travellers across Bedfordshire and Hertfordshire. A business account puts that operation behind your company — with the paperwork reduced to one email a month.",
    template: "hub-business",
    features: ["Monthly invoicing", "Dedicated account manager", "Priority dispatch", "Online booking portal for staff"],
    sections: [
      { title: "Why businesses choose us", body: "Reliable, fixed-price transfers your team can book in seconds — no expense surprises.", bullets: ["Centralised billing", "Booking history and reporting", "24/7 support line", "Volume discounts available"] },
    ],
    relatedLinks: [{ href: "/contact-us", label: "Request a business account" }, { href: "/book", label: "Book a transfer" }],
  });

  pages.set("luton-taxi", {
    path: "luton-taxi",
    title: "Luton Local Areas",
    metaDescription: "Local taxi and airport transfer service in Luton and surrounding Bedfordshire towns.",
    eyebrow: "Luton local",
    intro: "Based in Luton since 2019, we know every street, estate and shortcut. Local journeys and airport runs — same fixed-price promise.",
    template: "default",
    relatedLinks: LOCAL_AREAS.map((a) => ({ href: `/luton-taxi/${a.slug}`, label: a.title })),
    sections: [
      { title: "Areas we cover locally", body: "Luton, Dunstable, Houghton Regis, Flitwick, Leighton Buzzard, St Albans and surrounding towns.", bullets: ["Airport transfers", "Local point-to-point journeys", "Station and hotel pickups", "Corporate accounts"] },
    ],
  });

  for (const area of LOCAL_AREAS) {
    pages.set(`luton-taxi/${area.slug}`, {
      path: `luton-taxi/${area.slug}`,
      title: area.title,
      metaDescription: `${area.title} — fixed-price transfers with Skyline Airport Transfers.`,
      intro: area.intro,
      defaultPickup: area.title.includes("Stockwood") ? "Stockwood, Luton" : "ZSL Whipsnade, Dunstable",
      relatedLinks: [
        { href: buildBookingUrlFromLabels("London Luton Airport", "Central London") ?? "/book", label: "Luton Airport → London" },
        { href: "/luton-taxi", label: "All local areas" },
      ],
    });
  }

  pages.set("getting-from-luton-airport-to-nearby-cities", {
    path: "getting-from-luton-airport-to-nearby-cities",
    title: "Nearby Cities from Luton Airport",
    metaDescription: "Transfer guides from Luton Airport to nearby cities and towns across the Home Counties.",
    intro: "Luton Airport is well connected to towns and cities across Bedfordshire, Hertfordshire and beyond. Browse popular destinations or get an instant quote.",
    relatedLinks: POPULAR_ROUTES.map((r) => ({ href: `/transfers/${routeSlug(r)}`, label: r })),
  });

  pages.set("about-us", {
    path: "about-us",
    title: "About Us",
    metaDescription: `About ${SITE.name} — Luton-based airport transfer operator since ${SITE.founded}.`,
    eyebrow: `Since ${SITE.founded}`,
    intro: `${SITE.name} is operated by ${SITE.company} from Luton, Bedfordshire. We've completed thousands of airport transfers with the same promise: fixed prices, vetted drivers, no surge — ever.`,
    sections: [
      { title: "Our story", body: `Founded in ${SITE.founded}, we set out to make airport transfers simple and honest. No apps, no surge pricing, no surprises — just a fixed quote and a professional driver.`, bullets: [`${SITE.rating}★ average rating`, `${SITE.reviewCount.toLocaleString()}+ reviews`, "Luton Borough Council licensed", "24/7 dispatch team"] },
      { title: "Our promise", body: "Every driver is vetted, trained and employed by us — not subcontracted from an agency.", bullets: ["DBS-checked drivers", "Private Hire licensed", "Same drivers, same cars", "Free cancellation before dispatch"] },
    ],
    relatedLinks: [{ href: "/about-us/faqs", label: "FAQs" }, { href: "/contact-us", label: "Contact us" }],
  });

  pages.set("about-us/faqs", {
    path: "about-us/faqs",
    title: "Help & FAQs",
    metaDescription: "Frequently asked questions about booking airport transfers with Skyline Airport Transfers.",
    intro: "Booking an airport transfer should be the easy bit. If you can't see your question below, our team is on the phone or WhatsApp 24/7.",
    template: "faq",
    showFaq: true,
  });

  pages.set("about-us/events", {
    path: "about-us/events",
    title: "Events & Group Transfers",
    metaDescription: "Group and event airport transfers — weddings, conferences, sports events and more.",
    intro: "Moving a group to or from the airport? Our 8-seater MPVs and minibuses handle families, wedding parties and corporate groups with ease.",
    sections: [
      { title: "Group bookings", body: "One booking, one price, multiple passengers. We'll right-size the vehicle for your group and luggage.", bullets: ["8-seater MPV available", "Multiple vehicle dispatch", "Event coordinator support", "Fixed group pricing"] },
    ],
    relatedLinks: [{ href: "/contact-us", label: "Enquire about group travel" }],
  });

  pages.set("about-us/press-release", {
    path: "about-us/press-release",
    title: "Press & Media",
    metaDescription: "Press enquiries for Skyline Airport Transfers and Skyline Transfers Demo Ltd.",
    intro: "For press and media enquiries, contact our team. We're happy to provide comment on airport transfer industry topics, travel trends and our Luton operations.",
    relatedLinks: [{ href: "/contact-us", label: "Media enquiries" }],
  });

  pages.set("contact-us", {
    path: "contact-us",
    title: "Contact Us",
    metaDescription: `Contact ${SITE.name} — 24/7 phone, WhatsApp and email support.`,
    intro: "Our dispatch team is available 24 hours a day, 365 days a year. Call, WhatsApp, email or use the form below — we typically respond within minutes.",
    template: "contact",
    features: [`Phone: ${SITE.phone}`, `WhatsApp: ${SITE.whatsapp}`, `Email: ${SITE.email}`],
  });

  pages.set("privacy-policy", {
    path: "privacy-policy",
    title: "Privacy Policy",
    metaDescription: `Privacy policy for ${SITE.name}.`,
    intro: `${SITE.company} ("we", "us") operates ${SITE.name}. This policy explains how we collect and use your personal data when you book a transfer.`,
    sections: [
      { title: "Data we collect", body: "When you book, we collect your name, email, phone number, journey details and payment information.", bullets: ["Name and contact details", "Pickup and drop-off addresses", "Flight numbers (if provided)", "Payment card details (processed securely)"] },
      { title: "How we use your data", body: "We use your data to fulfil your booking, send confirmations and improve our service.", bullets: ["Booking confirmations by email/SMS", "Driver dispatch and journey fulfilment", "Customer support", "We do not sell your data to third parties"] },
      { title: "Your rights", body: "You can request access, correction or deletion of your data by contacting us.", bullets: ["Email: " + SITE.email, "Phone: " + SITE.phone] },
    ],
  });

  pages.set("sitemap", {
    path: "sitemap",
    title: "Sitemap",
    metaDescription: `Sitemap for ${SITE.name} — all pages and routes.`,
    intro: "Browse all pages on our website.",
    template: "sitemap",
  });

  return pages;
}

const PAGE_REGISTRY = buildStaticPages();

export function getPageContent(path: string): PageContent | null {
  const key = path.replace(/^\/+|\/+$/g, "").toLowerCase();
  if (!key) return null;
  return PAGE_REGISTRY.get(key) ?? null;
}

export function getAllPagePaths(): string[] {
  return Array.from(PAGE_REGISTRY.keys());
}

export function getSitemapLinks(): { href: string; label: string; group: string }[] {
  const groups: { href: string; label: string; group: string }[] = [
    { href: "/", label: "Home", group: "Main" },
    { href: "/book", label: "Book online", group: "Main" },
  ];

  for (const [path, page] of PAGE_REGISTRY) {
    let group = "Pages";
    if (path.startsWith("airport-transfers")) group = "Airports";
    else if (path.startsWith("transfers")) group = "Routes & areas";
    else if (path.startsWith("services")) group = "Services";
    else if (path.startsWith("luton-taxi")) group = "Luton local";
    else if (path.startsWith("about-us")) group = "Company";
    groups.push({ href: `/${path}`, label: page.title, group });
  }

  return groups;
}

export { FAQ_ITEMS, VEHICLES };

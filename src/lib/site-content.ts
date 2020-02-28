import { buildBookingUrlFromLabels } from "./booking-url";
import { routeSlug } from "./paths";

export type AreaTown = {
  name: string;
  miles: number;
  minutes: number;
  slug: string;
  href: string;
};

export const AREA_TOWNS: AreaTown[] = [
  { name: "Houghton Regis", miles: 4, minutes: 12, slug: "houghton-regis", href: `/transfers/${routeSlug("Houghton Regis")}` },
  { name: "Dunstable", miles: 6, minutes: 15, slug: "dunstable", href: `/transfers/${routeSlug("Dunstable")}` },
  { name: "Toddington", miles: 7, minutes: 15, slug: "toddington", href: `/transfers/${routeSlug("Toddington")}` },
  { name: "Redbourn", miles: 8, minutes: 15, slug: "redbourn", href: `/transfers/${routeSlug("Redbourn")}` },
  { name: "Barton-le-Clay", miles: 8, minutes: 15, slug: "barton-le-clay", href: `/transfers/${routeSlug("Barton-le-Clay")}` },
  { name: "Harpenden", miles: 9, minutes: 15, slug: "harpenden", href: `/transfers/${routeSlug("Harpenden")}` },
  { name: "Flitwick", miles: 10, minutes: 18, slug: "flitwick", href: `/transfers/${routeSlug("Flitwick")}` },
  { name: "Wheathampstead", miles: 10, minutes: 18, slug: "wheathampstead", href: `/transfers/${routeSlug("Wheathampstead")}` },
  { name: "Leighton Buzzard", miles: 12, minutes: 20, slug: "leighton-buzzard", href: `/transfers/${routeSlug("Leighton Buzzard")}` },
  { name: "St Albans", miles: 12, minutes: 20, slug: "st-albans", href: `/transfers/${routeSlug("St Albans")}` },
  { name: "Hitchin", miles: 12, minutes: 20, slug: "hitchin", href: `/transfers/${routeSlug("Hitchin")}` },
  { name: "Ampthill", miles: 12, minutes: 20, slug: "ampthill", href: `/transfers/${routeSlug("Ampthill")}` },
  { name: "Hemel Hempstead", miles: 13, minutes: 20, slug: "hemel-hempstead", href: `/transfers/${routeSlug("Hemel Hempstead")}` },
  { name: "Letchworth", miles: 14, minutes: 22, slug: "letchworth", href: `/transfers/${routeSlug("Letchworth")}` },
  { name: "Welwyn Garden City", miles: 14, minutes: 22, slug: "welwyn-garden-city", href: `/transfers/${routeSlug("Welwyn GC")}` },
  { name: "Stevenage", miles: 15, minutes: 25, slug: "stevenage", href: `/transfers/${routeSlug("Stevenage")}` },
  { name: "Hatfield", miles: 16, minutes: 25, slug: "hatfield", href: `/transfers/${routeSlug("Hatfield")}` },
  { name: "Watford", miles: 18, minutes: 25, slug: "watford", href: `/transfers/${routeSlug("Watford")}` },
  { name: "Tring", miles: 18, minutes: 30, slug: "tring", href: `/transfers/${routeSlug("Tring")}` },
  { name: "Bedford", miles: 20, minutes: 30, slug: "bedford", href: `/transfers/${routeSlug("Bedford")}` },
  { name: "Milton Keynes", miles: 22, minutes: 30, slug: "milton-keynes", href: `/transfers/${routeSlug("Milton Keynes")}` },
  { name: "Aylesbury", miles: 25, minutes: 40, slug: "aylesbury", href: `/transfers/${routeSlug("Aylesbury")}` },
  { name: "Cambridge", miles: 35, minutes: 45, slug: "cambridge", href: `/transfers/${routeSlug("Cambridge")}` },
  { name: "Heathrow", miles: 38, minutes: 60, slug: "heathrow", href: `/transfers/${routeSlug("Heathrow")}` },
  { name: "Central London", miles: 34, minutes: 55, slug: "central-london", href: `/transfers/${routeSlug("Central London")}` },
];

export function getAreaBookingHref(name: string): string {
  return buildBookingUrlFromLabels("London Luton Airport", name) ?? "/book";
}

export type ServiceCard = {
  slug: string;
  title: string;
  tag: string;
  description: string;
  href: string;
  icon: string;
};

export const SERVICE_CARDS: ServiceCard[] = [
  { slug: "airport-transfers", title: "Airport transfers", tag: "Core service", description: "Fixed-price, door-to-door transfers to and from every major UK airport.", href: "/airport-transfers", icon: "bi-airplane-fill" },
  { slug: "corporate", title: "Business accounts", tag: "For companies", description: "Monthly invoicing, priority allocation and one statement for all staff travel.", href: "/corporate-airport-transfers", icon: "bi-briefcase-fill" },
  { slug: "meet-and-greet", title: "Meet & Greet", tag: "Optional · +£15", description: "Driver waits in arrivals with a name board and helps with luggage.", href: "/services/meet-and-greet", icon: "bi-person-badge-fill" },
  { slug: "flight-monitoring", title: "Free flight monitoring", tag: "Included", description: "We track your flight and adjust pickup for delays. First hour waiting is free.", href: "/services/flight-monitoring", icon: "bi-airplane-engines-fill" },
  { slug: "baby-seat", title: "Baby & child seats", tag: "On request", description: "Infant, child and booster seats at no extra charge — just tell us when booking.", href: "/services/baby-seat", icon: "bi-emoji-smile-fill" },
  { slug: "guarantee-prices", title: "Lowest-price guarantee", tag: "Our promise", description: "Find an identical quote cheaper and we'll match it. Fixed fares, no surge.", href: "/services/guarantee-prices", icon: "bi-shield-check" },
  { slug: "routes", title: "Popular routes", tag: "35+ destinations", description: "Fixed-price runs from Luton to towns across Beds, Herts and beyond.", href: "/transfers", icon: "bi-signpost-fill" },
];

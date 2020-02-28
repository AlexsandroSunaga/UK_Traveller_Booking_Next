import { POPULAR_ROUTES, UK_LOCATIONS } from "./constants";
import { routeSlug } from "./paths";
import { AREA_TOWNS } from "./site-content";

function shortSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Legacy and short transfer slugs → canonical `luton-airport-to-*` paths */
export function buildTransferAliases(): Record<string, string> {
  const aliases: Record<string, string> = {};

  const destinations = new Set<string>([
    ...POPULAR_ROUTES,
    ...UK_LOCATIONS.map((loc) => loc.name),
    ...AREA_TOWNS.map((area) => area.name),
  ]);

  for (const destination of destinations) {
    const canonical = routeSlug(destination);
    const short = shortSlug(destination);
    if (short && short !== canonical) {
      aliases[short] = canonical;
    }
  }

  return aliases;
}

export const LEGACY_REDIRECTS: Record<string, string> = {
  "locations/luton-airport": "airport-transfers/luton",
};

export const TRANSFER_ALIASES = buildTransferAliases();

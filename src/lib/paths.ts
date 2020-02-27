/** Normalize slug segments: strip .html, trailing slashes, lowercase */
export function normalizeSlug(slug: string[] = []): string {
  return slug
    .map((s) => s.replace(/\.html$/i, "").replace(/\/$/, ""))
    .filter(Boolean)
    .join("/")
    .toLowerCase();
}

export function routeSlug(destination: string): string {
  return `luton-airport-to-${destination
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

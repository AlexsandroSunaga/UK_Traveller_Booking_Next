/**
 * Smoke-test key routes and APIs. Run while dev server is up:
 *   npx tsx scripts/smoke-test.ts
 */
const BASE = process.env.BASE_URL ?? "http://localhost:3001";

type Result = { path: string; status: number; ok: boolean };

async function check(path: string, init?: RequestInit): Promise<Result> {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow", ...init });
    return { path, status: res.status, ok: res.ok };
  } catch (error) {
    console.error(`FAIL ${path}:`, error);
    return { path, status: 0, ok: false };
  }
}

async function main() {
  const { getAllPagePaths } = await import("../src/lib/pages");

  const pages = [
    "/",
    "/book",
    "/admin/login",
    "/sitemap",
    "/contact-us",
    "/airport-transfers",
    "/transfers",
    "/services",
    "/transfers/houghton-regis",
    "/locations/luton-airport",
    ...getAllPagePaths().map((p) => `/${p}`),
  ];

  console.log(`Testing ${pages.length} pages on ${BASE}...\n`);

  const results: Result[] = [];
  for (const path of pages) {
    results.push(await check(path));
  }

  const quote = await check("/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pickupLat: 51.8747,
      pickupLng: -0.3683,
      dropoffLat: 51.5074,
      dropoffLng: -0.1278,
      pickupDate: "2026-08-01",
      pickupTime: "12:00",
      isReturn: false,
    }),
  });
  results.push({ ...quote, path: "POST /api/quote" });

  const places = await check("/api/places?q=luton");
  results.push({ ...places, path: "GET /api/places" });

  const failed = results.filter((r) => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? "OK" : "FAIL"} ${r.status} ${r.path}`);
  }

  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) process.exit(1);
}

main();

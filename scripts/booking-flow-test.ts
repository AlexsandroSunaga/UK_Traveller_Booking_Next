/**
 * End-to-end check of the booking flow against a running server:
 * quote -> booking -> admin login -> dashboard.
 *
 *   npm run build && npm start        (in one terminal, after db:push and db:seed)
 *   npm run test:flow                 (in another)
 *
 * No payment processor is connected, so a new booking must never be marked PAID.
 */
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL ?? "http://localhost:3001";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

async function call(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, init);
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

function post(body: unknown, headers: Record<string, string> = {}): RequestInit {
  return { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) };
}

async function main() {
  const trip = {
    pickupLat: 51.8747,
    pickupLng: -0.3683,
    dropoffLat: 51.5074,
    dropoffLng: -0.1278,
    pickupDate: "2026-12-01",
    pickupTime: "12:00",
    isReturn: false,
  };

  const { res: quoteRes, body: quote } = await call("/api/quote", post(trip));
  assert.equal(quoteRes.status, 200, "quote should succeed");
  assert.ok(Array.isArray(quote.vehicles) && quote.vehicles.length > 0, "quote should list vehicles");
  const vehicle = quote.vehicles[0];

  const booking = {
    pickupAddress: "Luton Airport",
    ...trip,
    dropoffAddress: "London",
    distanceMiles: quote.distanceMiles,
    durationMinutes: quote.durationMinutes,
    vehicleTypeId: vehicle.vehicleTypeId,
    basePrice: vehicle.basePrice,
    vehiclePrice: vehicle.vehiclePrice,
    surgeMultiplier: vehicle.surgeMultiplier,
    totalPrice: vehicle.totalPrice,
    firstName: "Test",
    lastName: "Passenger",
    email: `flow-test-${Date.now()}@example.com`,
    phone: "+44 7700 900123",
    passengers: 2,
    luggage: 1,
    flightNumber: "",
    paymentMethod: "ONLINE",
  };

  const { res: bookRes, body: booked } = await call("/api/bookings", post(booking));
  assert.equal(bookRes.status, 200, `booking should succeed: ${JSON.stringify(booked)}`);
  assert.match(booked.reference, /^[A-Z]{2,4}-/, "booking should return a reference");
  assert.equal(
    booked.booking.paymentStatus,
    "PENDING",
    "no processor is connected, so an ONLINE booking must stay PENDING"
  );
  assert.equal(booked.booking.totalPrice, vehicle.totalPrice, "stored price should match the quote");

  const { res: badRes } = await call("/api/bookings", post({ ...booking, email: "not-an-email" }));
  assert.equal(badRes.status, 400, "an invalid email should be rejected");

  const anonymous = await call("/api/admin/dashboard");
  assert.equal(anonymous.res.status, 401, "dashboard should require an admin session");

  const login = await fetch(`${BASE}/api/auth/login`, post({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }));
  assert.equal(login.status, 200, "admin login should succeed with the seeded credentials");
  const cookie = (login.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
  assert.ok(cookie, "login should set a session cookie");

  const { res: dashRes, body: dash } = await call("/api/admin/dashboard", { headers: { Cookie: cookie } });
  assert.equal(dashRes.status, 200, "dashboard should load for an admin");
  assert.ok(dash.stats.bookedValue >= vehicle.totalPrice, "booked value should include the new booking");
  assert.ok(
    dash.recentBookings.some((b: { reference: string }) => b.reference === booked.reference),
    "the new booking should appear in recent bookings"
  );

  console.log(`OK: ${booked.reference} booked at ${vehicle.totalPrice}, payment ${booked.booking.paymentStatus}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

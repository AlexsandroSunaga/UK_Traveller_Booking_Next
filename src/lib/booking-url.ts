import type { PlaceResult } from "@/lib/google-maps";
import { resolvePlaceFromText } from "@/lib/google-maps";

type BookingUrlOptions = {
  date?: string;
  time?: string;
  isReturn?: boolean;
  returnDate?: string;
  returnTime?: string;
};

export function buildBookingUrl(
  pickup: PlaceResult,
  dropoff: PlaceResult,
  options: BookingUrlOptions = {}
): string {
  const today = new Date().toISOString().split("T")[0];
  const params = new URLSearchParams({
    pickup: pickup.address,
    pickupLat: String(pickup.lat),
    pickupLng: String(pickup.lng),
    dropoff: dropoff.address,
    dropoffLat: String(dropoff.lat),
    dropoffLng: String(dropoff.lng),
    date: options.date ?? today,
    time: options.time ?? "12:00",
    return: options.isReturn ? "1" : "0",
  });

  if (options.isReturn && options.returnDate) {
    params.set("returnDate", options.returnDate);
    params.set("returnTime", options.returnTime ?? "12:00");
  }

  return `/book?${params.toString()}`;
}

export function buildBookingUrlFromLabels(
  pickupLabel: string,
  dropoffLabel: string,
  options: BookingUrlOptions = {}
): string | null {
  const pickup = resolvePlaceFromText(pickupLabel);
  const dropoff = resolvePlaceFromText(dropoffLabel);
  if (!pickup || !dropoff) return null;
  return buildBookingUrl(pickup, dropoff, options);
}

export const DEFAULT_BOOKING_URL =
  buildBookingUrlFromLabels("London Luton Airport", "Central London") ?? "/book";

export const QUICK_BOOK_ROUTES = [
  { label: "Luton Airport → Central London", pickup: "London Luton Airport", dropoff: "Central London" },
  { label: "Heathrow → Central London", pickup: "London Heathrow Airport", dropoff: "Central London" },
  { label: "Gatwick → Central London", pickup: "London Gatwick Airport", dropoff: "Central London" },
  { label: "Stansted → Central London", pickup: "London Stansted Airport", dropoff: "Central London" },
  { label: "Luton Airport → Cambridge", pickup: "London Luton Airport", dropoff: "Cambridge" },
  { label: "Heathrow → Milton Keynes", pickup: "London Heathrow Airport", dropoff: "Milton Keynes" },
] as const;

export function navigateToQuote(
  pickup: PlaceResult,
  dropoff: PlaceResult,
  options: BookingUrlOptions = {}
): string {
  return buildBookingUrl(pickup, dropoff, options);
}

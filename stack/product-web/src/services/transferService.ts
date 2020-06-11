import { api } from "./apiClient";

export type QuotePayload = {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  pickupDate: string;
  pickupTime: string;
  isReturn?: boolean;
};

export const transferService = {
  quote: (body: QuotePayload) => api<Record<string, unknown>>("/quote", { method: "POST", body: JSON.stringify(body) }),
  listReservations: () => api<{ items: unknown[] }>("/bookings"),
  createReservation: (body: { destination: string; travelers: number; start_date: string; email: string }) =>
    api("/bookings", { method: "POST", body: JSON.stringify(body) }),
  checkoutSession: (body: { amount_cents: number; currency: string; email: string; description: string }) =>
    api<{ url: string; session_id: string; provider: string }>("/checkout/session", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  integrationStatus: () => api<Record<string, { enabled: boolean }>>("/integrations/status"),
  refund: (bookingId: string) =>
    api(`/bookings/${bookingId}/refund`, { method: "POST", body: JSON.stringify({}) }),
};

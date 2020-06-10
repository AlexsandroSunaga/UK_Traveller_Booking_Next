import { api } from "./apiClient";

export const bookingService = {
  quote: (body: { destination: string; travelers: number; nights: number }) =>
    api<{ total: number; currency: string }>("/quote", { method: "POST", body: JSON.stringify(body) }),
  listBookings: () => api<{ items: unknown[]; total: number }>("/bookings"),
  createBooking: (body: { destination: string; travelers: number; start_date: string; email: string }) =>
    api("/bookings", { method: "POST", body: JSON.stringify(body) }),
  integrationStatus: () => api<Record<string, { enabled: boolean }>>("/integrations/status"),
};

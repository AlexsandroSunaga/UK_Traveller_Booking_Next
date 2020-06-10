import { api } from "./apiClient";

export const commerceService = {
  products: () => api<{ items: unknown[] }>("/products"),
  cart: () => api<unknown>("/cart"),
  listOrders: () => api<{ items: unknown[] }>("/orders"),
  createOrder: (body: { email: string; items: { price_cents: number }[] }) =>
    api("/orders", { method: "POST", body: JSON.stringify(body) }),
  integrationStatus: () => api<Record<string, { enabled: boolean }>>("/integrations/status"),
};

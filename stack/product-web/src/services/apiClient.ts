const base = import.meta.env.VITE_API_BASE ?? "";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}/api/v1${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

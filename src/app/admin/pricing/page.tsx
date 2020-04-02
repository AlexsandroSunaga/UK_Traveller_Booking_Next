"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

type PricingRule = {
  id: string;
  name: string;
  baseFare: number;
  perMileRate: number;
  perMinuteRate: number;
  minimumFare: number;
  airportFee: number;
  nightMultiplier: number;
  nightStartHour: number;
  nightEndHour: number;
};

type SurgeRule = {
  id: string;
  name: string;
  multiplier: number;
  isActive: boolean;
  description: string | null;
};

export default function AdminPricingPage() {
  const router = useRouter();
  const [pricing, setPricing] = useState<PricingRule | null>(null);
  const [surge, setSurge] = useState<SurgeRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d) {
          setPricing(d.rules[0] || null);
          setSurge(d.surgeRules[0] || null);
        }
        setLoading(false);
      });
  }, [router]);

  async function savePricing() {
    if (!pricing) return;
    setSaving(true);
    await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pricing", ...pricing }),
    });
    setMessage("Pricing rules saved");
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function saveSurge() {
    if (!surge) return;
    setSaving(true);
    await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "surge", ...surge }),
    });
    setMessage("Surge settings saved");
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Pricing Rules</h1>
      <p className="text-sm text-slate-500">Configure base rates, mileage, and time-based pricing</p>

      {message && (
        <div className="mt-4 rounded-lg bg-teal-50 px-4 py-2 text-sm text-teal-700">{message}</div>
      )}

      {pricing && (
        <div className="mt-6 card">
          <h2 className="font-semibold">{pricing.name}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: "baseFare", label: "Base fare (£)" },
              { key: "perMileRate", label: "Per mile (£)" },
              { key: "perMinuteRate", label: "Per minute (£)" },
              { key: "minimumFare", label: "Minimum fare (£)" },
              { key: "airportFee", label: "Airport fee (£)" },
              { key: "nightMultiplier", label: "Night multiplier" },
              { key: "nightStartHour", label: "Night start (hour)" },
              { key: "nightEndHour", label: "Night end (hour)" },
            ].map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-sm font-medium">{field.label}</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  value={pricing[field.key as keyof PricingRule] as number}
                  onChange={(e) =>
                    setPricing({ ...pricing, [field.key]: parseFloat(e.target.value) })
                  }
                />
              </div>
            ))}
          </div>
          <button onClick={savePricing} disabled={saving} className="btn-primary mt-4 gap-2">
            <Save className="h-4 w-4" />
            Save pricing rules
          </button>
        </div>
      )}

      {surge && (
        <div className="mt-6 card">
          <h2 className="font-semibold">Surge Pricing</h2>
          <p className="mt-1 text-sm text-slate-500">{surge.description}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Multiplier</label>
              <input
                type="number"
                step="0.01"
                className="input-field"
                value={surge.multiplier}
                onChange={(e) => setSurge({ ...surge, multiplier: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Active</label>
              <select
                className="input-field"
                value={surge.isActive ? "1" : "0"}
                onChange={(e) => setSurge({ ...surge, isActive: e.target.value === "1" })}
              >
                <option value="0">Disabled (recommended)</option>
                <option value="1">Enabled</option>
              </select>
            </div>
          </div>
          <button onClick={saveSurge} disabled={saving} className="btn-primary mt-4 gap-2">
            <Save className="h-4 w-4" />
            Save surge settings
          </button>
        </div>
      )}
    </div>
  );
}

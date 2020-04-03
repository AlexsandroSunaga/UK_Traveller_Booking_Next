"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

type Vehicle = {
  id: string;
  slug: string;
  name: string;
  example: string;
  passengers: number;
  luggage: number;
  handLuggage: number;
  multiplier: number;
  isActive: boolean;
};

export default function AdminVehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/vehicles")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d) setVehicles(d.vehicles);
        setLoading(false);
      });
  }, [router]);

  async function saveVehicle(vehicle: Vehicle) {
    setSaving(vehicle.id);
    await fetch("/api/admin/vehicles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle),
    });
    setSaving(null);
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
      <h1 className="text-2xl font-bold text-slate-900">Vehicle Types</h1>
      <p className="text-sm text-slate-500">Manage fleet categories and price multipliers</p>

      <div className="mt-6 space-y-4">
        {vehicles.map((v, i) => (
          <div key={v.id} className="card">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  className="input-field"
                  value={v.name}
                  onChange={(e) => {
                    const updated = [...vehicles];
                    updated[i] = { ...v, name: e.target.value };
                    setVehicles(updated);
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Example vehicle</label>
                <input
                  className="input-field"
                  value={v.example}
                  onChange={(e) => {
                    const updated = [...vehicles];
                    updated[i] = { ...v, example: e.target.value };
                    setVehicles(updated);
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Price multiplier</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  value={v.multiplier}
                  onChange={(e) => {
                    const updated = [...vehicles];
                    updated[i] = { ...v, multiplier: parseFloat(e.target.value) };
                    setVehicles(updated);
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Status</label>
                <select
                  className="input-field"
                  value={v.isActive ? "1" : "0"}
                  onChange={(e) => {
                    const updated = [...vehicles];
                    updated[i] = { ...v, isActive: e.target.value === "1" };
                    setVehicles(updated);
                  }}
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex gap-4 text-xs text-slate-500">
              <span>{v.passengers} passengers</span>
              <span>{v.luggage} large bags</span>
              <span>{v.handLuggage} hand luggage</span>
            </div>
            <button
              onClick={() => saveVehicle(v)}
              disabled={saving === v.id}
              className="btn-primary mt-4 gap-2"
            >
              {saving === v.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

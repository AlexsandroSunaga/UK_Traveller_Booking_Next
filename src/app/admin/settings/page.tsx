"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

type Setting = {
  key: string;
  value: string;
  label: string;
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d) setSettings(d.settings);
        setLoading(false);
      });
  }, [router]);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    setMessage("Settings saved successfully");
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
      <h1 className="text-2xl font-bold text-slate-900">API Configuration</h1>
      <p className="text-sm text-slate-500">
        Configure Google Maps, Stripe payments, Twilio SMS, and SendGrid email
      </p>

      {message && (
        <div className="mt-4 rounded-lg bg-teal-50 px-4 py-2 text-sm text-teal-700">{message}</div>
      )}

      <div className="mt-6 card space-y-4">
        {settings.map((s, i) => (
          <div key={s.key}>
            <label className="mb-1 block text-sm font-medium">{s.label}</label>
            <input
              type={s.key.includes("secret") || s.key.includes("token") ? "password" : "text"}
              className="input-field font-mono text-xs"
              value={s.value}
              placeholder={`Enter ${s.label.toLowerCase()}`}
              onChange={(e) => {
                const updated = [...settings];
                updated[i] = { ...s, value: e.target.value };
                setSettings(updated);
              }}
            />
          </div>
        ))}

        <button onClick={handleSave} disabled={saving} className="btn-primary gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save all settings
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>Note:</strong> Add your Google Maps API key here or in .env to enable live Places autocomplete
        and Distance Matrix. Without it, the demo uses built-in UK location data.
      </div>
    </div>
  );
}

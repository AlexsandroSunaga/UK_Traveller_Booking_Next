"use client";

import { FormEvent, useState } from "react";

export function BusinessContactForm() {
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [volume, setVolume] = useState("Not sure yet");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject: `Business account request — ${company}`,
          message: `Company: ${company}\nTrips/month: ${volume}\n\n${notes}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send request");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="card card-elev" style={{ padding: 28 }}>
        <h3 className="h-3">Request received</h3>
        <p className="body-lg" style={{ marginTop: 8 }}>Thanks — we&apos;ll reply within one working day with your account confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card card-elev" style={{ padding: 24 }}>
      <div className="stack-3">
        <div className="field no-icon has-value">
          <label htmlFor="biz-company">Company / organisation</label>
          <input id="biz-company" value={company} onChange={(e) => setCompany(e.target.value)} required />
        </div>
        <div className="field no-icon has-value">
          <label htmlFor="biz-name">Contact name</label>
          <input id="biz-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field no-icon has-value">
          <label htmlFor="biz-email">Work email</label>
          <input id="biz-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field no-icon has-value">
          <label htmlFor="biz-phone">Phone</label>
          <input id="biz-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="field no-icon has-value">
          <label htmlFor="biz-volume">Rough trips per month</label>
          <select id="biz-volume" value={volume} onChange={(e) => setVolume(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid var(--lat-border)" }}>
            <option>Not sure yet</option>
            <option>1–5</option>
            <option>6–20</option>
            <option>21–50</option>
            <option>50+</option>
          </select>
        </div>
        <div className="field no-icon has-value">
          <label htmlFor="biz-notes">Anything we should know?</label>
          <textarea id="biz-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid var(--lat-border)", resize: "vertical" }} />
        </div>
        {error && <p style={{ margin: 0, color: "#b91c1c", fontSize: 14 }}>{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Sending…" : "Request a business account"}
        </button>
      </div>
    </form>
  );
}

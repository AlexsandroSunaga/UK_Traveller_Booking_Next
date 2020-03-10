"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General enquiry");
  const [message, setMessage] = useState("");
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
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="card card-elev" style={{ padding: 28, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--lat-primary-light)", color: "var(--lat-primary-deep)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <i className="bi bi-check-lg" style={{ fontSize: 28 }} />
        </div>
        <h3 className="h-3">Message sent</h3>
        <p style={{ color: "var(--lat-muted)", marginTop: 8 }}>Thanks — our team will get back to you shortly. For urgent bookings, call us 24/7.</p>
        <button type="button" className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => setSuccess(false)}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card card-elev" style={{ padding: 24 }}>
      <h3 className="h-3" style={{ marginBottom: 16 }}>Send us a message</h3>
      <div className="stack-3">
        <div className="field no-icon has-value">
          <label htmlFor="contact-name">Your name</label>
          <input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
        </div>
        <div className="field no-icon has-value">
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field no-icon has-value">
          <label htmlFor="contact-phone">Phone (optional)</label>
          <input id="contact-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="field no-icon has-value">
          <label htmlFor="contact-subject">Subject</label>
          <select id="contact-subject" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid var(--lat-border)" }}>
            <option>General enquiry</option>
            <option>Booking question</option>
            <option>Business account</option>
            <option>Group / event transfer</option>
            <option>Complaint or feedback</option>
          </select>
        </div>
        <div className="field no-icon has-value">
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" value={message} onChange={(e) => setMessage(e.target.value)} required minLength={10} rows={4} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid var(--lat-border)", resize: "vertical" }} />
        </div>

        {error && (
          <p style={{ margin: 0, padding: "10px 12px", borderRadius: 10, background: "#fef2f2", color: "#b91c1c", fontSize: 14 }}>{error}</p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

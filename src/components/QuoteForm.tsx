"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LocationSearchLat } from "./booking/LocationSearchLat";
import { resolvePlaceFromText } from "@/lib/google-maps";
import { navigateToQuote } from "@/lib/booking-url";
import type { PlaceResult } from "@/lib/google-maps";

type QuoteFormProps = {
  defaultPickup?: string;
  defaultDropoff?: string;
};

export function QuoteForm({ defaultPickup = "", defaultDropoff = "" }: QuoteFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [pickup, setPickup] = useState(defaultPickup);
  const [dropoff, setDropoff] = useState(defaultDropoff);
  const [pickupPlace, setPickupPlace] = useState<PlaceResult | null>(
    defaultPickup ? resolvePlaceFromText(defaultPickup) : null
  );
  const [dropoffPlace, setDropoffPlace] = useState<PlaceResult | null>(
    defaultDropoff ? resolvePlaceFromText(defaultDropoff) : null
  );
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("12:00");
  const [isReturn, setIsReturn] = useState(false);
  const [returnDate, setReturnDate] = useState(today);
  const [returnTime, setReturnTime] = useState("12:00");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const resolvedPickup = pickupPlace ?? resolvePlaceFromText(pickup);
    const resolvedDropoff = dropoffPlace ?? resolvePlaceFromText(dropoff);

    if (!pickup.trim() || !dropoff.trim()) {
      setError("Please enter both pickup and drop-off locations.");
      return;
    }

    if (!resolvedPickup || !resolvedDropoff) {
      setError("Try a suggestion like Luton Airport or Central London.");
      return;
    }

    if (resolvedPickup.address === resolvedDropoff.address) {
      setError("Pickup and drop-off must be different.");
      return;
    }

    if (isReturn && returnDate < date) {
      setError("Return date must be on or after your outbound date.");
      return;
    }

    setSubmitting(true);
    router.push(
      navigateToQuote(resolvedPickup, resolvedDropoff, {
        date,
        time,
        isReturn,
        returnDate: isReturn ? returnDate : undefined,
        returnTime: isReturn ? returnTime : undefined,
      })
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      id="quote-form"
      className="card card-elev"
      style={{ padding: 24, borderRadius: 20, background: "white" }}
    >
      <div className="row-between" style={{ marginBottom: 14 }}>
        <div className="eyebrow">Get a fixed-price quote</div>
        <span className="caption">Takes 20 seconds</span>
      </div>

      <div className="stack-3">
        <LocationSearchLat
          id="pickup"
          label="Pickup"
          value={pickup}
          onChange={(v) => {
            setPickup(v);
            if (!v) setPickupPlace(null);
          }}
          onSelect={setPickupPlace}
          icon="pickup"
        />

        <LocationSearchLat
          id="dropoff"
          label="Drop-off"
          value={dropoff}
          onChange={(v) => {
            setDropoff(v);
            if (!v) setDropoffPlace(null);
          }}
          onSelect={setDropoffPlace}
          icon="dropoff"
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="field no-icon has-value">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="field no-icon has-value">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid var(--lat-border)",
            background: "var(--lat-sky-white)",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          <input
            type="checkbox"
            checked={isReturn}
            onChange={(e) => setIsReturn(e.target.checked)}
          />
          Return journey
        </label>

        {isReturn && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field no-icon has-value">
              <label htmlFor="return-date">Return date</label>
              <input
                type="date"
                id="return-date"
                name="returnDate"
                value={returnDate}
                min={date}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>
            <div className="field no-icon has-value">
              <label htmlFor="return-time">Return time</label>
              <input
                type="time"
                id="return-time"
                name="returnTime"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {error && (
          <p style={{ margin: 0, padding: "10px 12px", borderRadius: 10, background: "#fef2f2", color: "#b91c1c", fontSize: 14 }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
          {submitting ? "Getting quote…" : (
            <>
              Get instant fare <i className="bi bi-arrow-right" />
            </>
          )}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 18,
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid var(--lat-border)",
          fontSize: 12,
          color: "var(--lat-muted)",
          flexWrap: "wrap",
        }}
      >
        <span><i className="bi bi-lightning-fill" style={{ color: "var(--lat-primary-deep)" }} /> Instant fixed price</span>
        <span><i className="bi bi-shield-fill" style={{ color: "var(--lat-primary-deep)" }} /> No card needed</span>
      </div>
    </form>
  );
}

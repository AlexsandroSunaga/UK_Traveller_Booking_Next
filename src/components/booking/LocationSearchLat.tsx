"use client";

import { useEffect, useRef, useState } from "react";
import type { PlaceResult } from "@/lib/google-maps";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: PlaceResult) => void;
  icon?: "pickup" | "dropoff";
};

export function LocationSearchLat({ id, label, value, onChange, onSelect, icon = "pickup" }: Props) {
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (value) {
      wrapperRef.current?.querySelector(".field")?.classList.add("has-value");
    }
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSuggestions(data.places || []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const iconClass = icon === "pickup" ? "bi-geo-alt-fill" : "bi-flag-fill";
  const iconColor = icon === "pickup" ? "var(--lat-primary-deep)" : "var(--lat-primary-mid)";

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <div className={`field${value ? " has-value" : ""}`}>
        <span className="field-icon">
          <i className={`bi ${iconClass}`} style={{ color: iconColor, fontSize: 16 }} />
        </span>
        <label htmlFor={id}>{label}</label>
        <input
          type="text"
          id={id}
          name={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            e.target.parentElement?.classList.toggle("has-value", e.target.value.length > 0);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && open && suggestions.length > 0) {
              e.preventDefault();
              const place = suggestions[0];
              onSelect(place);
              onChange(place.address);
              setOpen(false);
            }
          }}
          placeholder=" "
          autoComplete="off"
        />
        {loading && (
          <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--lat-muted)" }}>
            …
          </span>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 50,
            marginTop: 6,
            width: "100%",
            maxHeight: 240,
            overflow: "auto",
            borderRadius: 12,
            border: "1px solid var(--lat-border)",
            background: "white",
            boxShadow: "var(--lat-shadow-lg)",
            listStyle: "none",
            padding: "6px 0",
            margin: "6px 0 0",
          }}
        >
          {suggestions.map((place, i) => (
            <li key={`${place.address}-${i}`}>
              <button
                type="button"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  fontSize: 14,
                  color: "var(--lat-ink)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(place);
                  onChange(place.address);
                  setOpen(false);
                }}
              >
                {place.address}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

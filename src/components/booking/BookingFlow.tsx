"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Loader2,
  Users,
  Luggage,
  Plane,
} from "lucide-react";
import { formatPrice, formatDistance, formatDuration } from "@/lib/pricing";
import type { QuoteResult, VehicleQuote } from "@/lib/pricing";
import Image from "next/image";
import { getVehicleImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import { FieldError, fieldInputClass } from "@/components/ui/FieldError";
import {
  formatCardNumber,
  formatExpiry,
  validateCustomerDetails,
  validatePaymentCard,
  type FieldErrors,
} from "@/lib/validation";

type Step = "quote" | "details" | "payment" | "confirm";

export function BookingFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState<Step>("quote");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleQuote | null>(null);
  const [error, setError] = useState("");

  const pickup = searchParams.get("pickup") || "";
  const dropoff = searchParams.get("dropoff") || "";
  const pickupLat = parseFloat(searchParams.get("pickupLat") || "0");
  const pickupLng = parseFloat(searchParams.get("pickupLng") || "0");
  const dropoffLat = parseFloat(searchParams.get("dropoffLat") || "0");
  const dropoffLng = parseFloat(searchParams.get("dropoffLng") || "0");
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const isReturn = searchParams.get("return") === "1";
  const returnDate = searchParams.get("returnDate") || "";
  const returnTime = searchParams.get("returnTime") || "";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passengers: 1,
    luggage: 1,
    flightNumber: "",
    notes: "",
    paymentMethod: "ONLINE" as "ONLINE" | "CASH" | "CARD_TO_DRIVER",
  });

  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [paymentErrors, setPaymentErrors] = useState<FieldErrors>({});
  const [paymentVerified, setPaymentVerified] = useState(false);

  const [bookingRef, setBookingRef] = useState("");

  function clearFieldError(key: string) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function clearPaymentError(key: string) {
    setPaymentErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setPaymentVerified(false);
  }

  function validateDetailsStep(): boolean {
    const result = validateCustomerDetails(form);
    if (!result.ok) {
      setFieldErrors(result.errors);
      setError("Please fix the highlighted fields before continuing.");
      return false;
    }
    setFieldErrors({});
    setError("");
    return true;
  }

  function validatePaymentStep(): boolean {
    if (form.paymentMethod !== "ONLINE") {
      setPaymentErrors({});
      setPaymentVerified(true);
      return true;
    }

    const result = validatePaymentCard(payment);
    if (!result.ok) {
      setPaymentErrors(result.errors);
      setPaymentVerified(false);
      setError("Please check your card details before confirming.");
      return false;
    }

    setPaymentErrors({});
    setPaymentVerified(true);
    setError("");
    return true;
  }

  useEffect(() => {
    if (!pickup || !dropoff) {
      setLoading(false);
      return;
    }

    if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      setError("Invalid journey details. Please start your quote again.");
      setLoading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      async function fetchQuote() {
        setLoading(true);
        try {
          const res = await fetch("/api/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pickupLat,
              pickupLng,
              dropoffLat,
              dropoffLng,
              pickupDate: date,
              pickupTime: time,
              isReturn,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to get quote");
          setQuote(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load quote");
        } finally {
          setLoading(false);
        }
      }

      fetchQuote();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [pickup, dropoff, pickupLat, pickupLng, dropoffLat, dropoffLng, date, time, isReturn]);

  async function handleSubmitBooking() {
    if (!selectedVehicle || !quote) return;
    if (!validatePaymentStep()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupAddress: pickup,
          pickupLat,
          pickupLng,
          dropoffAddress: dropoff,
          dropoffLat,
          dropoffLng,
          pickupDate: date,
          pickupTime: time,
          isReturn,
          returnDate: isReturn ? returnDate : undefined,
          returnTime: isReturn ? returnTime : undefined,
          distanceMiles: quote.distanceMiles,
          durationMinutes: quote.durationMinutes,
          vehicleTypeId: selectedVehicle.vehicleTypeId,
          basePrice: selectedVehicle.basePrice,
          vehiclePrice: selectedVehicle.vehiclePrice,
          surgeMultiplier: quote.surgeMultiplier,
          totalPrice: selectedVehicle.totalPrice,
          ...form,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      setBookingRef(data.reference);
      setStep("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
        <p className="text-sm font-medium text-slate-500">Calculating your fixed price…</p>
      </div>
    );
  }

  if (error && !quote) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-red-600">{error}</p>
        <button onClick={() => router.push("/book")} className="btn-primary mt-4">
          Start a new quote
        </button>
      </div>
    );
  }

  if (!pickup || !dropoff) {
    return null;
  }

  const steps: { key: Step; label: string }[] = [
    { key: "quote", label: "Choose vehicle" },
    { key: "details", label: "Your details" },
    { key: "payment", label: "Payment" },
    { key: "confirm", label: "Confirmed" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-slate-50/80">
      {/* Booking header */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="page-container py-4 sm:py-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>

          <div className="mt-4 overflow-x-auto pb-1">
            <div className="flex min-w-[320px] items-center justify-between">
              {steps.map((s, i) => (
                <div key={s.key} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold sm:h-9 sm:w-9 sm:text-sm",
                        i < currentStepIndex && "step-complete",
                        i === currentStepIndex && "step-active",
                        i > currentStepIndex && "step-pending"
                      )}
                    >
                      {i < currentStepIndex ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : i + 1}
                    </div>
                    <span className={cn("hidden text-[10px] font-medium sm:block sm:text-xs", i <= currentStepIndex ? "text-slate-900" : "text-slate-400")}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn("mx-1 h-0.5 flex-1 rounded-full sm:mx-2", i < currentStepIndex ? "bg-sky-500" : "bg-slate-200")} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Journey summary — shown first on mobile */}
          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
              <div className="bg-sky-600 px-4 py-3">
                <h3 className="font-display text-sm font-bold text-white">Journey summary</h3>
              </div>
              <div className="space-y-3 p-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Pickup</p>
                  <p className="mt-0.5 break-words font-medium text-slate-800">{pickup}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Drop-off</p>
                  <p className="mt-0.5 break-words font-medium text-slate-800">{dropoff}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Date</p>
                    <p className="font-semibold text-slate-800">{date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Time</p>
                    <p className="font-semibold text-slate-800">{time}</p>
                  </div>
                </div>
                {isReturn && returnDate && (
                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-amber-50 p-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-amber-700">Return date</p>
                      <p className="font-semibold text-slate-800">{returnDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-amber-700">Return time</p>
                      <p className="font-semibold text-slate-800">{returnTime || "12:00"}</p>
                    </div>
                  </div>
                )}
                {quote && (
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg border border-slate-100 p-2">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Distance</p>
                      <p className="text-sm font-bold">{formatDistance(quote.distanceMiles)}</p>
                    </div>
                    <div className="rounded-lg border border-slate-100 p-2">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Duration</p>
                      <p className="text-sm font-bold">{formatDuration(quote.durationMinutes)}</p>
                    </div>
                  </div>
                )}
                {selectedVehicle && (
                  <div className="rounded-lg bg-sky-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-700">{selectedVehicle.name}</p>
                        <p className="text-xs text-slate-500">Fixed price</p>
                      </div>
                      <p className="shrink-0 font-display text-lg font-bold text-sky-700">
                        {formatPrice(selectedVehicle.totalPrice)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main booking steps */}
          <div className="order-2 lg:order-1 lg:col-span-2">
          {step === "quote" && quote && (
            <div className="space-y-5">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">
                  Choose your vehicle
                </h1>
                <p className="mt-2 text-slate-600">
                  Fixed price · {formatDistance(quote.distanceMiles)} · ~{formatDuration(quote.durationMinutes)}
                  {quote.isNightRate && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      Night rate
                    </span>
                  )}
                </p>
              </div>

              {quote.vehicles.map((v) => (
                <button
                  key={v.vehicleTypeId}
                  type="button"
                  onClick={() => setSelectedVehicle(v)}
                  className={cn(
                    "flex w-full cursor-pointer flex-col gap-3 rounded-xl border bg-white p-4 text-left transition sm:flex-row sm:items-center sm:gap-4 sm:p-5",
                    selectedVehicle?.vehicleTypeId === v.vehicleTypeId
                      ? "border-sky-500 ring-2 ring-sky-500/20"
                      : "border-slate-200 hover:border-sky-200"
                  )}
                >
                  <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-16 sm:w-24">
                    <Image
                      src={getVehicleImage(v.slug)}
                      alt={v.name}
                      width={96}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-slate-900">{v.name}</h3>
                    <p className="text-sm text-slate-500">{v.example}</p>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3 text-sky-600" />{v.passengers}</span>
                      <span className="flex items-center gap-1"><Luggage className="h-3 w-3 text-sky-600" />{v.luggage} bags</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:block sm:text-right">
                    <p className="font-display text-xl font-bold text-sky-600 sm:text-2xl">
                      {formatPrice(v.totalPrice)}
                    </p>
                    <p className="text-xs text-slate-400">Fixed price</p>
                  </div>
                </button>
              ))}

              <button
                type="button"
                disabled={!selectedVehicle}
                onClick={() => setStep("details")}
                className="btn-primary w-full gap-2 sm:w-auto"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === "details" && (
            <div className="card space-y-4">
              <h1 className="text-2xl font-bold text-slate-900">Your details</h1>
              <p className="text-sm text-slate-500">All fields marked with * are required.</p>

              {error && fieldErrors && Object.keys(fieldErrors).length > 0 && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">First name *</label>
                  <input
                    className={cn("input-field", fieldInputClass(!!fieldErrors.firstName))}
                    value={form.firstName}
                    onChange={(e) => {
                      setForm({ ...form, firstName: e.target.value });
                      clearFieldError("firstName");
                    }}
                    onBlur={() => {
                      const result = validateCustomerDetails(form);
                      if (!result.ok && result.errors.firstName) {
                        setFieldErrors((prev) => ({ ...prev, firstName: result.errors.firstName }));
                      }
                    }}
                    autoComplete="given-name"
                  />
                  <FieldError message={fieldErrors.firstName} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Last name *</label>
                  <input
                    className={cn("input-field", fieldInputClass(!!fieldErrors.lastName))}
                    value={form.lastName}
                    onChange={(e) => {
                      setForm({ ...form, lastName: e.target.value });
                      clearFieldError("lastName");
                    }}
                    onBlur={() => {
                      const result = validateCustomerDetails(form);
                      if (!result.ok && result.errors.lastName) {
                        setFieldErrors((prev) => ({ ...prev, lastName: result.errors.lastName }));
                      }
                    }}
                    autoComplete="family-name"
                  />
                  <FieldError message={fieldErrors.lastName} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Email *</label>
                  <input
                    type="email"
                    className={cn("input-field", fieldInputClass(!!fieldErrors.email))}
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      clearFieldError("email");
                    }}
                    onBlur={() => {
                      const result = validateCustomerDetails(form);
                      if (!result.ok && result.errors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: result.errors.email }));
                      }
                    }}
                    autoComplete="email"
                  />
                  <FieldError message={fieldErrors.email} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Phone *</label>
                  <input
                    type="tel"
                    className={cn("input-field", fieldInputClass(!!fieldErrors.phone))}
                    value={form.phone}
                    onChange={(e) => {
                      setForm({ ...form, phone: e.target.value });
                      clearFieldError("phone");
                    }}
                    onBlur={() => {
                      const result = validateCustomerDetails(form);
                      if (!result.ok && result.errors.phone) {
                        setFieldErrors((prev) => ({ ...prev, phone: result.errors.phone }));
                      }
                    }}
                    placeholder="+44 7700 900123"
                    autoComplete="tel"
                  />
                  <FieldError message={fieldErrors.phone} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Passengers *</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    className={cn("input-field", fieldInputClass(!!fieldErrors.passengers))}
                    value={form.passengers}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setForm({ ...form, passengers: Number.isNaN(value) ? 0 : value });
                      clearFieldError("passengers");
                    }}
                  />
                  <FieldError message={fieldErrors.passengers} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Large luggage *</label>
                  <input
                    type="number"
                    min={0}
                    max={8}
                    className={cn("input-field", fieldInputClass(!!fieldErrors.luggage))}
                    value={form.luggage}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setForm({ ...form, luggage: Number.isNaN(value) ? 0 : value });
                      clearFieldError("luggage");
                    }}
                  />
                  <FieldError message={fieldErrors.luggage} />
                </div>
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1 text-sm font-medium">
                  <Plane className="h-4 w-4 text-slate-400" />
                  Flight number (optional)
                </label>
                <input
                  className={cn("input-field", fieldInputClass(!!fieldErrors.flightNumber))}
                  placeholder="e.g. BA123"
                  value={form.flightNumber}
                  onChange={(e) => {
                    setForm({ ...form, flightNumber: e.target.value.toUpperCase() });
                    clearFieldError("flightNumber");
                  }}
                  onBlur={() => {
                    const result = validateCustomerDetails(form);
                    if (!result.ok && result.errors.flightNumber) {
                      setFieldErrors((prev) => ({ ...prev, flightNumber: result.errors.flightNumber }));
                    }
                  }}
                />
                <FieldError message={fieldErrors.flightNumber} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Special requests</label>
                <textarea
                  className={cn("input-field min-h-[80px]", fieldInputClass(!!fieldErrors.notes))}
                  value={form.notes}
                  onChange={(e) => {
                    setForm({ ...form, notes: e.target.value });
                    clearFieldError("notes");
                  }}
                  placeholder="Child seat, wheelchair access, etc."
                  maxLength={500}
                />
                <FieldError message={fieldErrors.notes} />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("quote")} className="btn-secondary">Back</button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateDetailsStep()) {
                      setPayment((prev) => ({
                        ...prev,
                        cardName:
                          prev.cardName ||
                          `${form.firstName} ${form.lastName}`.trim(),
                      }));
                      setStep("payment");
                    }
                  }}
                  className="btn-primary gap-2"
                >
                  Continue to payment
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === "payment" && selectedVehicle && (
            <div className="card space-y-4">
              <h1 className="text-2xl font-bold text-slate-900">Payment</h1>
              <p className="text-slate-600">Choose how you&apos;d like to pay for your transfer.</p>

              {[
                { value: "ONLINE", label: "Pay online now", desc: "Secure card payment — confirmation sent instantly" },
                { value: "CARD_TO_DRIVER", label: "Pay driver by card", desc: "Card payment to driver on arrival" },
                { value: "CASH", label: "Pay driver in cash", desc: "Cash payment to driver on arrival" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                    form.paymentMethod === opt.value ? "border-sky-500 bg-sky-50 ring-2 ring-sky-500/10" : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={form.paymentMethod === opt.value}
                    onChange={() => {
                      setForm({ ...form, paymentMethod: opt.value as typeof form.paymentMethod });
                      setPaymentErrors({});
                      setPaymentVerified(opt.value !== "ONLINE");
                      setError("");
                    }}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-slate-900">{opt.label}</p>
                    <p className="text-sm text-slate-500">{opt.desc}</p>
                  </div>
                </label>
              ))}

              {form.paymentMethod === "ONLINE" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-slate-500" />
                      <p className="text-sm font-semibold text-slate-800">Card details</p>
                    </div>
                    {paymentVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
                        <Check className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Name on card *</label>
                      <input
                        className={cn("input-field bg-white", fieldInputClass(!!paymentErrors.cardName))}
                        value={payment.cardName}
                        onChange={(e) => {
                          setPayment({ ...payment, cardName: e.target.value });
                          clearPaymentError("cardName");
                        }}
                        autoComplete="cc-name"
                      />
                      <FieldError message={paymentErrors.cardName} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Card number *</label>
                      <input
                        className={cn("input-field bg-white", fieldInputClass(!!paymentErrors.cardNumber))}
                        value={payment.cardNumber}
                        onChange={(e) => {
                          setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) });
                          clearPaymentError("cardNumber");
                        }}
                        placeholder="4242 4242 4242 4242"
                        inputMode="numeric"
                        autoComplete="cc-number"
                      />
                      <FieldError message={paymentErrors.cardNumber} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Expiry *</label>
                        <input
                          className={cn("input-field bg-white", fieldInputClass(!!paymentErrors.expiry))}
                          value={payment.expiry}
                          onChange={(e) => {
                            setPayment({ ...payment, expiry: formatExpiry(e.target.value) });
                            clearPaymentError("expiry");
                          }}
                          placeholder="MM/YY"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                        />
                        <FieldError message={paymentErrors.expiry} />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">CVC *</label>
                        <input
                          className={cn("input-field bg-white", fieldInputClass(!!paymentErrors.cvc))}
                          value={payment.cvc}
                          onChange={(e) => {
                            setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) });
                            clearPaymentError("cvc");
                          }}
                          placeholder="123"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                        />
                        <FieldError message={paymentErrors.cvc} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => validatePaymentStep()}
                      className="btn-secondary w-full sm:w-auto"
                    >
                      Verify card
                    </button>
                  </div>
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("details")} className="btn-secondary">Back</button>
                <button type="button" onClick={handleSubmitBooking} disabled={submitting} className="btn-primary gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Confirm booking — {formatPrice(selectedVehicle.totalPrice)}
                </button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="card mx-auto max-w-lg text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 ring-8 ring-sky-50">
                <Check className="h-10 w-10 text-sky-600" />
              </div>
              <h1 className="mt-6 font-display text-2xl font-bold text-slate-900">You&apos;re all booked!</h1>
              <p className="mt-2 text-slate-600">
                Reference{" "}
                <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-sm font-bold text-slate-900">
                  {bookingRef}
                </span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Confirmation email and SMS sent. We&apos;ll monitor your flight if provided — see you at pickup.
              </p>
              <button onClick={() => router.push("/")} className="btn-primary mt-8 px-8">
                Back to home
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

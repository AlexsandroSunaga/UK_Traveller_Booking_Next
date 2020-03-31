"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";

type Booking = {
  id: string;
  reference: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDate: string;
  pickupTime: string;
  totalPrice: number;
  paymentStatus: string;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  vehicleType: { name: string };
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const url = filter ? `/api/bookings?status=${filter}` : "/api/bookings";
    fetch(url)
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d) setBookings(d.bookings);
        setLoading(false);
      });
  }, [filter, router]);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id, status }),
    });
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="text-sm text-slate-500">{bookings.length} bookings</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-sm font-semibold text-teal-700">{b.reference}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {b.customer.firstName} {b.customer.lastName} · {b.customer.email} · {b.customer.phone}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900">{formatPrice(b.totalPrice)}</p>
                <p className="text-xs text-slate-500">{b.paymentStatus}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Pickup</p>
                <p>{b.pickupAddress}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Drop-off</p>
                <p>{b.dropoffAddress}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span>{formatDate(b.pickupDate)} at {b.pickupTime}</span>
              <span>{b.vehicleType.name}</span>
              <select
                value={b.status}
                onChange={(e) => updateStatus(b.id, e.target.value)}
                className="input-field ml-auto w-auto py-1.5 text-xs"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="DISPATCHED">Dispatched</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, PoundSterling, Users, TrendingUp, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";

type DashboardData = {
  stats: {
    totalBookings: number;
    pendingBookings: number;
    totalRevenue: number;
    customers: number;
  };
  recentBookings: Array<{
    id: string;
    reference: string;
    status: string;
    pickupAddress: string;
    dropoffAddress: string;
    pickupDate: string;
    totalPrice: number;
    customer: { firstName: string; lastName: string };
    vehicleType: { name: string };
  }>;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d) setData(d);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: "Total Bookings", value: data.stats.totalBookings, icon: Calendar, color: "text-teal-600" },
    { label: "Active Bookings", value: data.stats.pendingBookings, icon: TrendingUp, color: "text-amber-600" },
    { label: "Total Revenue", value: formatPrice(data.stats.totalRevenue), icon: PoundSterling, color: "text-green-600" },
    { label: "Customers", value: data.stats.customers, icon: Users, color: "text-blue-600" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="text-sm text-slate-500">Overview of your transfer business</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 card">
        <h2 className="font-semibold text-slate-900">Recent Bookings</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="pb-3 pr-4">Reference</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Route</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Vehicle</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-slate-50">
                  <td className="py-3 pr-4 font-mono text-xs">{b.reference}</td>
                  <td className="py-3 pr-4">{b.customer.firstName} {b.customer.lastName}</td>
                  <td className="max-w-[200px] truncate py-3 pr-4 text-xs">{b.pickupAddress.split(",")[0]} → {b.dropoffAddress.split(",")[0]}</td>
                  <td className="py-3 pr-4">{formatDate(b.pickupDate)}</td>
                  <td className="py-3 pr-4">{b.vehicleType.name}</td>
                  <td className="py-3 pr-4">
                    <span className="badge bg-teal-100 text-teal-700">{b.status}</span>
                  </td>
                  <td className="py-3 font-semibold">{formatPrice(b.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

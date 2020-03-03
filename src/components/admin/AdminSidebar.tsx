"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  PoundSterling,
  Car,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/pricing", label: "Pricing Rules", icon: PoundSterling },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/settings", label: "API Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 rounded-lg bg-slate-800 p-2 text-white lg:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-white transition lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-8">
            <p className="text-lg font-bold">{SITE.name}</p>
            <p className="text-xs text-slate-400">Admin Dashboard</p>
          </div>

          <nav className="flex-1 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    active ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 border-t border-slate-800 pt-4">
            <Link href="/" className="block text-xs text-slate-400 hover:text-white">
              ← View website
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  );
}

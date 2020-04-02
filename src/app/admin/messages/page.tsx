"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d) setMessages(d.messages);
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

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
      <p className="text-sm text-slate-500">{messages.length} messages received</p>

      <div className="mt-6 space-y-4">
        {messages.length === 0 ? (
          <div className="card text-center text-slate-500">No messages yet. Submissions from the contact form appear here.</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{m.name}</p>
                  <p className="text-sm text-slate-500">{m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                  {formatDate(m.createdAt)}
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-teal-700">{m.subject}</p>
              <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

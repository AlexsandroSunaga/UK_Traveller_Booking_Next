import { Suspense } from "react";
import { BookPageContent } from "@/components/booking/BookPageContent";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Book Your Transfer",
  description: "Complete your airport transfer booking in minutes. Fixed prices, instant confirmation.",
};

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[480px] flex-col items-center justify-center gap-4 bg-slate-50">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-slate-500">Loading your quote…</p>
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}

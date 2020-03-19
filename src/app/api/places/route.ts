import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/google-maps";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  if (q.trim().length < 2) {
    return NextResponse.json({ places: [] });
  }

  const places = await searchPlaces(q);
  return NextResponse.json(
    { places },
    {
      headers: {
        "Cache-Control": "private, max-age=300",
      },
    }
  );
}

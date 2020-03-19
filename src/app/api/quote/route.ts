import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateQuote } from "@/lib/pricing";
import { getDistanceMatrix } from "@/lib/google-maps";

const quoteSchema = z.object({
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  pickupDate: z.string(),
  pickupTime: z.string(),
  isReturn: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = quoteSchema.parse(body);

    const [matrix, quote] = await Promise.all([
      getDistanceMatrix(
        input.pickupLat,
        input.pickupLng,
        input.dropoffLat,
        input.dropoffLng
      ),
      calculateQuote(input),
    ]);

    if (matrix) {
      quote.distanceMiles = matrix.miles;
      quote.durationMinutes = matrix.minutes;
    }

    return NextResponse.json(quote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Quote error:", error);
    return NextResponse.json({ error: "Failed to calculate quote" }, { status: 500 });
  }
}

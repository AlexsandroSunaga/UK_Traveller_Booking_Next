import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { invalidatePricingCache } from "@/lib/pricing";

export async function GET() {
  try {
    await requireAdmin();
    const vehicles = await prisma.vehicleType.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ vehicles });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const vehicle = await prisma.vehicleType.update({
      where: { id: body.id },
      data: {
        name: body.name,
        example: body.example,
        passengers: body.passengers,
        luggage: body.luggage,
        handLuggage: body.handLuggage,
        multiplier: body.multiplier,
        isActive: body.isActive,
      },
    });

    invalidatePricingCache();
    return NextResponse.json({ vehicle });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

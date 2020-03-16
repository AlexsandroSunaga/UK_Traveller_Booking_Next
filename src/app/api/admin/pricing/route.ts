import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { invalidatePricingCache } from "@/lib/pricing";

export async function GET() {
  try {
    await requireAdmin();
    const rules = await prisma.pricingRule.findMany({ orderBy: { createdAt: "desc" } });
    const surgeRules = await prisma.surgeRule.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ rules, surgeRules });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    if (body.type === "pricing") {
      const rule = await prisma.pricingRule.update({
        where: { id: body.id },
        data: {
          baseFare: body.baseFare,
          perMileRate: body.perMileRate,
          perMinuteRate: body.perMinuteRate,
          minimumFare: body.minimumFare,
          airportFee: body.airportFee,
          nightMultiplier: body.nightMultiplier,
          nightStartHour: body.nightStartHour,
          nightEndHour: body.nightEndHour,
        },
      });
      invalidatePricingCache();
      return NextResponse.json({ rule });
    }

    if (body.type === "surge") {
      const rule = await prisma.surgeRule.update({
        where: { id: body.id },
        data: {
          multiplier: body.multiplier,
          isActive: body.isActive,
          description: body.description,
        },
      });
      invalidatePricingCache();
      return NextResponse.json({ rule });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

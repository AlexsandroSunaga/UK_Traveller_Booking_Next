import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const [totalBookings, pendingBookings, totalRevenue, customers] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: { in: ["PENDING", "CONFIRMED"] } } }),
      prisma.booking.aggregate({ _sum: { totalPrice: true }, where: { paymentStatus: "PAID" } }),
      prisma.customer.count(),
    ]);

    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: true, vehicleType: true },
    });

    return NextResponse.json({
      stats: {
        totalBookings,
        pendingBookings,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        customers,
      },
      recentBookings,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { bookingId, status } = await request.json();

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

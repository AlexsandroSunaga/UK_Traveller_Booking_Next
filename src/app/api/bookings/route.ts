import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateBookingReference } from "@/lib/pricing";
import { requireAdmin } from "@/lib/auth";
import { customerDetailsSchema } from "@/lib/validation";

const bookingSchema = customerDetailsSchema.extend({
  pickupAddress: z.string().min(1, "Pickup address is required"),
  pickupLat: z.number().optional(),
  pickupLng: z.number().optional(),
  dropoffAddress: z.string().min(1, "Drop-off address is required"),
  dropoffLat: z.number().optional(),
  dropoffLng: z.number().optional(),
  pickupDate: z.string().min(1),
  pickupTime: z.string().min(1),
  isReturn: z.boolean().optional(),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  distanceMiles: z.number().positive(),
  durationMinutes: z.number().positive(),
  vehicleTypeId: z.string().min(1),
  basePrice: z.number().positive(),
  vehiclePrice: z.number().positive(),
  surgeMultiplier: z.number().min(1).default(1),
  totalPrice: z.number().positive(),
  paymentMethod: z.enum(["ONLINE", "CASH", "CARD_TO_DRIVER"]).default("ONLINE"),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const status = request.nextUrl.searchParams.get("status");

    const bookings = await prisma.booking.findMany({
      where: status ? { status: status as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "DISPATCHED" } : undefined,
      include: {
        customer: true,
        vehicleType: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    const customer = await prisma.customer.upsert({
      where: { email: data.email },
      update: {
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      create: {
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    let reference = generateBookingReference();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.booking.findUnique({ where: { reference } });
      if (!existing) break;
      reference = generateBookingReference();
      attempts++;
    }

    const booking = await prisma.booking.create({
      data: {
        reference,
        status: "CONFIRMED",
        pickupAddress: data.pickupAddress,
        pickupLat: data.pickupLat,
        pickupLng: data.pickupLng,
        dropoffAddress: data.dropoffAddress,
        dropoffLat: data.dropoffLat,
        dropoffLng: data.dropoffLng,
        pickupDate: new Date(data.pickupDate),
        pickupTime: data.pickupTime,
        isReturn: data.isReturn ?? false,
        returnDate: data.isReturn && data.returnDate ? new Date(data.returnDate) : null,
        returnTime: data.isReturn ? data.returnTime ?? null : null,
        distanceMiles: data.distanceMiles,
        durationMinutes: data.durationMinutes,
        basePrice: data.basePrice,
        vehiclePrice: data.vehiclePrice,
        surgeMultiplier: data.surgeMultiplier,
        totalPrice: data.totalPrice,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === "ONLINE" ? "PAID" : "PENDING",
        flightNumber: data.flightNumber,
        passengers: data.passengers,
        luggage: data.luggage,
        notes: data.notes,
        customerId: customer.id,
        vehicleTypeId: data.vehicleTypeId,
      },
      include: { customer: true, vehicleType: true },
    });

    // Demo notification log (production: SendGrid + Twilio)
    console.log(`[NOTIFICATION] Booking ${reference} confirmed for ${data.email}`);
    console.log(`[SMS] Sent to ${data.phone}: Your transfer ${reference} is confirmed.`);

    return NextResponse.json({
      reference: booking.reference,
      booking,
      message: "Booking confirmed. Email and SMS notifications sent.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || "Invalid data" }, { status: 400 });
    }
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Demo Admin",
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });

  const vehicles = [
    { slug: "saloon", name: "Saloon", description: "Ideal for solo travellers and couples", example: "Toyota Prius or similar", passengers: 4, luggage: 2, handLuggage: 2, multiplier: 1.0, sortOrder: 1, imageUrl: "/img/vehicles/saloon.png" },
    { slug: "estate", name: "Estate", description: "Extra boot space for luggage", example: "Skoda Superb or similar", passengers: 4, luggage: 4, handLuggage: 2, multiplier: 1.12, sortOrder: 2, imageUrl: "/img/vehicles/estate.png" },
    { slug: "mpv", name: "MPV", description: "Comfortable for families and groups", example: "Ford Galaxy or similar", passengers: 6, luggage: 4, handLuggage: 4, multiplier: 1.28, sortOrder: 3, imageUrl: "/img/vehicles/mpv.png" },
    { slug: "business", name: "Business Class", description: "Premium executive travel", example: "Mercedes E-Class", passengers: 4, luggage: 2, handLuggage: 2, multiplier: 1.45, sortOrder: 4, imageUrl: "/img/vehicles/Business.png" },
    { slug: "8-seater", name: "8-Seater", description: "Large groups and airport runs", example: "Ford Tourneo or similar", passengers: 8, luggage: 6, handLuggage: 6, multiplier: 1.55, sortOrder: 5, imageUrl: "/img/vehicles/minibus.png" },
  ];

  for (const v of vehicles) {
    await prisma.vehicleType.upsert({ where: { slug: v.slug }, update: v, create: v });
  }

  const existingPricing = await prisma.pricingRule.findFirst();
  if (!existingPricing) {
    await prisma.pricingRule.create({
      data: {
        name: "Standard UK Rates",
        baseFare: 25,
        perMileRate: 1.85,
        perMinuteRate: 0.35,
        minimumFare: 35,
        airportFee: 5,
        nightMultiplier: 1.15,
        nightStartHour: 22,
        nightEndHour: 6,
        isActive: true,
      },
    });
  }

  await prisma.surgeRule.upsert({
    where: { id: "default-surge" },
    update: {},
    create: {
      id: "default-surge",
      name: "No Surge Policy",
      multiplier: 1.0,
      isActive: false,
      description: "Skyline Airport Transfers never applies surge pricing",
    },
  });

  const settings = [
    { key: "google_maps_api_key", value: "", label: "Google Maps API Key" },
    { key: "stripe_public_key", value: "", label: "Stripe Public Key" },
    { key: "stripe_secret_key", value: "", label: "Stripe Secret Key" },
    { key: "twilio_account_sid", value: "", label: "Twilio Account SID" },
    { key: "twilio_auth_token", value: "", label: "Twilio Auth Token" },
    { key: "twilio_phone_number", value: "", label: "Twilio Phone Number" },
    { key: "sendgrid_api_key", value: "", label: "SendGrid API Key" },
    { key: "notification_email", value: "support@example.com", label: "Notification Email" },
  ];

  for (const s of settings) {
    await prisma.apiSetting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  console.log("Database seeded successfully");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

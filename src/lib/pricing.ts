import { prisma } from "./prisma";
import { clearCache, getCached, setCache } from "./memory-cache";

const PRICING_CACHE_KEY = "pricing-rules";
const PRICING_CACHE_TTL = 5 * 60 * 1000;

export function invalidatePricingCache(): void {
  clearCache(PRICING_CACHE_KEY);
}

export type QuoteInput = {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  pickupDate: string;
  pickupTime: string;
  isReturn?: boolean;
};

export type VehicleQuote = {
  vehicleTypeId: string;
  slug: string;
  name: string;
  example: string;
  passengers: number;
  luggage: number;
  handLuggage: number;
  basePrice: number;
  vehiclePrice: number;
  surgeMultiplier: number;
  totalPrice: number;
  isReturn: boolean;
};

export type QuoteResult = {
  distanceMiles: number;
  durationMinutes: number;
  isNightRate: boolean;
  surgeMultiplier: number;
  vehicles: VehicleQuote[];
};

function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateDurationMinutes(miles: number): number {
  const avgSpeed = miles > 40 ? 48 : 28;
  return Math.max(15, Math.round((miles / avgSpeed) * 60 + 10));
}

function isNightTime(hour: number, start: number, end: number): boolean {
  if (start > end) return hour >= start || hour < end;
  return hour >= start && hour < end;
}

function getDaySurgeMultiplier(date: Date): number {
  const day = date.getDay();
  const hour = date.getHours();
  if (day === 5 && hour >= 16) return 1.05;
  if (day === 0 || day === 6) return 1.02;
  return 1.0;
}

async function getPricingData() {
  const cached = getCached<{
    pricing: Awaited<ReturnType<typeof prisma.pricingRule.findFirst>>;
    activeSurge: Awaited<ReturnType<typeof prisma.surgeRule.findFirst>>;
    vehicles: Awaited<ReturnType<typeof prisma.vehicleType.findMany>>;
  }>(PRICING_CACHE_KEY);

  if (cached) return cached;

  const [pricing, activeSurge, vehicles] = await Promise.all([
    prisma.pricingRule.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.surgeRule.findFirst({
      where: { isActive: true },
    }),
    prisma.vehicleType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const data = { pricing, activeSurge, vehicles };
  setCache(PRICING_CACHE_KEY, data, PRICING_CACHE_TTL);
  return data;
}

export async function calculateQuote(input: QuoteInput): Promise<QuoteResult> {
  const { pricing, activeSurge, vehicles } = await getPricingData();

  const rules = pricing ?? {
    baseFare: 25,
    perMileRate: 1.85,
    perMinuteRate: 0.35,
    minimumFare: 35,
    airportFee: 5,
    nightMultiplier: 1.15,
    nightStartHour: 22,
    nightEndHour: 6,
  };

  const distanceMiles =
    Math.round(
      haversineMiles(
        input.pickupLat,
        input.pickupLng,
        input.dropoffLat,
        input.dropoffLng
      ) * 10
    ) / 10;

  const durationMinutes = estimateDurationMinutes(distanceMiles);

  const pickupDateTime = new Date(`${input.pickupDate}T${input.pickupTime}`);
  const hour = pickupDateTime.getHours();
  const nightRate = isNightTime(hour, rules.nightStartHour, rules.nightEndHour);

  const daySurge = getDaySurgeMultiplier(pickupDateTime);
  const configuredSurge = activeSurge?.multiplier ?? 1.0;
  const surgeMultiplier =
    Math.round(Math.max(daySurge, configuredSurge) * 100) / 100;

  let basePrice =
    rules.baseFare +
    distanceMiles * rules.perMileRate +
    durationMinutes * rules.perMinuteRate +
    rules.airportFee;

  if (nightRate) basePrice *= rules.nightMultiplier;
  basePrice = Math.max(basePrice, rules.minimumFare);
  basePrice = Math.round(basePrice * surgeMultiplier * 100) / 100;

  const vehicleQuotes: VehicleQuote[] = vehicles.map((v) => {
    let vehiclePrice = Math.round(basePrice * v.multiplier * 100) / 100;
    if (input.isReturn) vehiclePrice = Math.round(vehiclePrice * 1.85 * 100) / 100;

    return {
      vehicleTypeId: v.id,
      slug: v.slug,
      name: v.name,
      example: v.example,
      passengers: v.passengers,
      luggage: v.luggage,
      handLuggage: v.handLuggage,
      basePrice,
      vehiclePrice,
      surgeMultiplier,
      totalPrice: vehiclePrice,
      isReturn: !!input.isReturn,
    };
  });

  return {
    distanceMiles,
    durationMinutes,
    isNightRate: nightRate,
    surgeMultiplier,
    vehicles: vehicleQuotes,
  };
}

export function generateBookingReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "LAT-";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export function formatDistance(miles: number): string {
  return `${miles.toFixed(1)} miles`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}

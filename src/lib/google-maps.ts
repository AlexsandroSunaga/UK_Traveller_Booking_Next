import { getCached, setCache } from "./memory-cache";

export type PlaceResult = {
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
};

const PLACES_CACHE_TTL = 10 * 60 * 1000;

const DEMO_PLACES: PlaceResult[] = [
  { address: "London Luton Airport (LTN), Luton LU2 9LY", lat: 51.8747, lng: -0.3683 },
  { address: "London Heathrow Airport (LHR), Longford TW6", lat: 51.47, lng: -0.4543 },
  { address: "London Gatwick Airport (LGW), Horley RH6", lat: 51.1537, lng: -0.1821 },
  { address: "London Stansted Airport (STN), Stansted CM24", lat: 51.885, lng: 0.235 },
  { address: "London City Airport (LCY), London E16 2PX", lat: 51.5055, lng: 0.0553 },
  { address: "London Southend Airport (SEN), Southend SS2 6YF", lat: 51.5714, lng: 0.6956 },
  { address: "Central London, Westminster, London SW1A", lat: 51.5074, lng: -0.1278 },
  { address: "King's Cross Station, London N1C 4AP", lat: 51.5308, lng: -0.1238 },
  { address: "St Pancras International, London N1C 4QP", lat: 51.5313, lng: -0.126 },
  { address: "Cambridge City Centre, Cambridge CB2", lat: 52.2053, lng: 0.1218 },
  { address: "Oxford City Centre, Oxford OX1", lat: 51.752, lng: -1.2577 },
  { address: "Milton Keynes Central, MK9 1LA", lat: 52.0406, lng: -0.7594 },
  { address: "Birmingham City Centre, Birmingham B1", lat: 52.4862, lng: -1.8904 },
  { address: "Manchester City Centre, Manchester M1", lat: 53.4808, lng: -2.2426 },
  { address: "Southampton Cruise Terminal, SO14 3QN", lat: 50.896, lng: -1.4044 },
  { address: "Dover Cruise Port, Dover CT17 9DQ", lat: 51.1279, lng: 1.3134 },
];

const PLACE_KEYWORDS: { keyword: string; match: (address: string) => boolean }[] = [
  { keyword: "luton", match: (a) => a.includes("luton airport") },
  { keyword: "heathrow", match: (a) => a.includes("heathrow") },
  { keyword: "gatwick", match: (a) => a.includes("gatwick") },
  { keyword: "stansted", match: (a) => a.includes("stansted") },
  { keyword: "city airport", match: (a) => a.includes("city airport") },
  { keyword: "southend", match: (a) => a.includes("southend") },
  { keyword: "central london", match: (a) => a.includes("central london") },
  { keyword: "westminster", match: (a) => a.includes("central london") },
  { keyword: "king's cross", match: (a) => a.includes("king's cross") },
  { keyword: "st pancras", match: (a) => a.includes("st pancras") },
  { keyword: "cambridge", match: (a) => a.includes("cambridge") },
  { keyword: "oxford", match: (a) => a.includes("oxford") },
  { keyword: "milton keynes", match: (a) => a.includes("milton keynes") },
  { keyword: "birmingham", match: (a) => a.includes("birmingham") },
  { keyword: "manchester", match: (a) => a.includes("manchester") },
  { keyword: "southampton", match: (a) => a.includes("southampton") },
  { keyword: "dover", match: (a) => a.includes("dover") },
];

export function getDemoPlaces(): PlaceResult[] {
  return DEMO_PLACES;
}

export function resolvePlaceFromText(text: string): PlaceResult | null {
  const q = text.trim().toLowerCase();
  if (q.length < 2) return null;

  const exact = DEMO_PLACES.find((p) => p.address.toLowerCase() === q);
  if (exact) return exact;

  const partial = DEMO_PLACES.filter(
    (p) => p.address.toLowerCase().includes(q) || q.includes(p.address.toLowerCase().slice(0, 24))
  );
  if (partial.length === 1) return partial[0];

  if (q === "london") {
    return DEMO_PLACES.find((p) => p.address.includes("Central London")) ?? null;
  }

  for (const { keyword, match } of PLACE_KEYWORDS) {
    if (q.includes(keyword)) {
      const found = DEMO_PLACES.find((p) => match(p.address.toLowerCase()));
      if (found) return found;
    }
  }

  if (partial.length > 1) {
    return partial.sort((a, b) => a.address.length - b.address.length)[0];
  }

  return null;
}

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const cacheKey = `places:${q}`;
  const cached = getCached<PlaceResult[]>(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&components=country:gb&key=${apiKey}`
      );
      const data = await res.json();
      if (data.status === "OK" && data.predictions?.length) {
        const details = await Promise.all(
          data.predictions.slice(0, 6).map(async (p: { place_id: string; description: string }) => {
            const detailRes = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=geometry&key=${apiKey}`
            );
            const detail = await detailRes.json();
            const loc = detail.result?.geometry?.location;
            if (!loc) return null;
            return {
              address: p.description,
              lat: loc.lat,
              lng: loc.lng,
              placeId: p.place_id,
            } satisfies PlaceResult;
          })
        );
        const results = details.filter(Boolean) as PlaceResult[];
        setCache(cacheKey, results, PLACES_CACHE_TTL);
        return results;
      }
    } catch {
      // fall through to demo data
    }
  }

  const results = DEMO_PLACES.filter((p) => p.address.toLowerCase().includes(q)).slice(0, 8);
  setCache(cacheKey, results, PLACES_CACHE_TTL);
  return results;
}

export async function getDistanceMatrix(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<{ miles: number; minutes: number } | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&units=imperial&key=${apiKey}`
      );
      const data = await res.json();
      const element = data.rows?.[0]?.elements?.[0];
      if (element?.status === "OK") {
        const miles = element.distance.value / 1609.34;
        const minutes = Math.round(element.duration.value / 60);
        return { miles: Math.round(miles * 10) / 10, minutes };
      }
    } catch {
      return null;
    }
  }
  return null;
}

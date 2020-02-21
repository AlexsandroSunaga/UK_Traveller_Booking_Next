export const IMAGES = {
  hero: "/img/redesign/logo.webp",
  heroAlt: "Skyline Airport Transfers",
  airport: "/img/vehicles/saloon.png",
  driver: "/img/vehicles/saloon.png",
  fleet: {
    saloon: "/img/vehicles/saloon.png",
    estate: "/img/vehicles/estate.png",
    mpv: "/img/vehicles/mpv.png",
    business: "/img/vehicles/Business.png",
    "8-seater": "/img/vehicles/minibus.png",
  },
} as const;

export function getVehicleImage(slug: string): string {
  return IMAGES.fleet[slug as keyof typeof IMAGES.fleet] ?? IMAGES.fleet.saloon;
}

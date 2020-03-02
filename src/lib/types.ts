export type VehicleRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  example: string;
  passengers: number;
  luggage: number;
  handLuggage: number;
  multiplier: number;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type ArtworkType = "physical" | "digital";

export interface Artist {
  slug: string;
  name: string;
  region: string;
  bio: string;
  avatar: string;
  featured?: boolean;
}

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  artistSlug: string;
  artistName: string;
  priceCents: number;
  type: ArtworkType;
  medium: string;
  movement: string;
  region: string;
  year: number;
  widthCm: number;
  heightCm: number;
  image: string;
  description: string;
  available: boolean;
}

export interface Supply {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  brand: string;
  image: string;
}

export interface Course {
  slug: string;
  title: string;
  artistSlug: string;
  artistName: string;
  priceCents: number;
  level: "Principiante" | "Intermedio" | "Avanzado";
  category: string;
  lessons: number;
  durationMin: number;
  cover: string;
  summary: string;
}

export interface MapLocation {
  id: string;
  name: string;
  kind: "gallery" | "studio" | "hub" | "landmark";
  region: string;
  description: string;
  lat: number;
  lng: number;
}

export interface CartLine {
  id: string;
  kind: "artwork" | "supply" | "course";
  title: string;
  priceCents: number;
  qty: number;
  image?: string;
}

/**
 * Geographic utility functions
 * - Haversine distance calculation
 * - GeoJSON helper functions
 */
import type { Feature } from "geojson";

/** Calculate distance between two lat/lng points using Haversine formula */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/** Map from GeoJSON NAME_1 (no spaces) to official display names */
const NAME_1_MAP: Record<string, string> = {
  "AndamanandNicobar": "Andaman & Nicobar Islands",
  "AndhraPradesh": "Andhra Pradesh",
  "ArunachalPradesh": "Arunachal Pradesh",
  "Assam": "Assam",
  "Bihar": "Bihar",
  "Chandigarh": "Chandigarh",
  "Chhattisgarh": "Chhattisgarh",
  "DadraandNagarHaveli": "Dadra & Nagar Haveli",
  "DamanandDiu": "Daman & Diu",
  "Goa": "Goa",
  "Gujarat": "Gujarat",
  "Haryana": "Haryana",
  "HimachalPradesh": "Himachal Pradesh",
  "JammuandKashmir": "Jammu & Kashmir",
  "Jharkhand": "Jharkhand",
  "Karnataka": "Karnataka",
  "Kerala": "Kerala",
  "Lakshadweep": "Lakshadweep",
  "MadhyaPradesh": "Madhya Pradesh",
  "Maharashtra": "Maharashtra",
  "Manipur": "Manipur",
  "Meghalaya": "Meghalaya",
  "Mizoram": "Mizoram",
  "Nagaland": "Nagaland",
  "NCTofDelhi": "NCT of Delhi",
  "Odisha": "Odisha",
  "Puducherry": "Puducherry",
  "Punjab": "Punjab",
  "Rajasthan": "Rajasthan",
  "Sikkim": "Sikkim",
  "TamilNadu": "Tamil Nadu",
  "Telangana": "Telangana",
  "Tripura": "Tripura",
  "UttarPradesh": "Uttar Pradesh",
  "Uttarakhand": "Uttarakhand",
  "WestBengal": "West Bengal",
};

/** Extract state name from a GeoJSON feature, mapping to official names */
export function getStateName(feature: Feature): string {
  const p = feature.properties || {};
  const raw = p.NAME_1 || p.st_nm || p.ST_NM || p.state || p.name || p.NAME || "Unknown";
  return NAME_1_MAP[raw] || raw;
}

/** Extract district name from a GeoJSON feature */
export function getDistrictName(feature: Feature): string {
  const p = feature.properties || {};
  return (
    p.dtname || p.district || p.DISTRICT || p.dt_name || p.name || p.NAME || "Unknown"
  );
}

/** Convert state name to URL slug for fetching district GeoJSON */
export function stateToSlug(stateName: string): string {
  const specialCases: Record<string, string> = {
    "Jammu & Kashmir": "jammu-&-kashmir",
    "Dadra & Nagar Haveli": "dadra-&-nagar-haveli-and-daman-&-diu",
    "Daman & Diu": "dadra-&-nagar-haveli-and-daman-&-diu",
    "Andaman & Nicobar Islands": "andaman-&-nicobar-island",
    "NCT of Delhi": "delhi",
    "Telangana": "telangana",
    "Himachal Pradesh": "himachal-pradesh",
    "Arunachal Pradesh": "arunachal-pradesh",
    "Uttarakhand": "uttarakhand",
  };

  if (specialCases[stateName]) return specialCases[stateName];

  return stateName
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/** Base URL for India maps GeoJSON data */
export const INDIA_GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data/geojson/india.json";

/** URL for state district GeoJSON */
export function getStateGeoJsonUrl(stateName: string): string {
  const slug = stateToSlug(stateName);
  return `https://cdn.jsdelivr.net/gh/udit-001/india-maps-data/geojson/states/${slug}.json`;
}

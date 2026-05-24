import { locations } from "./data";

/** Daily utilization % by location order in `locations`. */
export const LOCATION_UTILIZATION_PCT = [87, 75, 82, 91, 78] as const;

export function utilizationForLocationId(locationId: string): number {
  const i = locations.findIndex((l) => l.id === locationId);
  return LOCATION_UTILIZATION_PCT[i >= 0 ? i : 0];
}

export function getLowestUtilizationLocation() {
  let minIdx = 0;
  LOCATION_UTILIZATION_PCT.forEach((pct, i) => {
    if (pct < LOCATION_UTILIZATION_PCT[minIdx]) minIdx = i;
  });
  return locations[minIdx];
}

/** Demo delta vs 30-day average for the utilization insight card. */
export const UTILIZATION_ANOMALY_DELTA = "−12%";

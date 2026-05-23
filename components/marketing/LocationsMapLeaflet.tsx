"use client";

import { useEffect } from "react";
import Link from "next/link";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { Location } from "@/lib/demo/types";
import "leaflet/dist/leaflet.css";

const markerIcon = L.divIcon({
  className: "legacy-map-marker-icon",
  html: `<span class="legacy-map-marker-dot"></span>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
});

function FitBounds({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;
    const bounds = L.latLngBounds(
      locations.map((loc) => [loc.lat, loc.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 11 });
  }, [map, locations]);

  return null;
}

export function LocationsMapLeaflet({ locations }: { locations: Location[] }) {
  const center: [number, number] = [33.42, -111.86];

  return (
    <MapContainer
      center={center}
      zoom={10}
      scrollWheelZoom={false}
      className="legacy-locations-map h-full w-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds locations={locations} />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={markerIcon}>
          <Popup>
            <div className="legacy-map-popup">
              <p className="font-semibold text-[#F5F6F7]">{loc.name}</p>
              <p className="mt-1 text-xs text-[#9DA3AE]">{loc.address}</p>
              <Link
                href={`/locations/${loc.slug}`}
                className="mt-2 inline-block text-xs font-medium text-[#FF5A1F] hover:underline"
              >
                View location →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

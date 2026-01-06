"use client";

import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import { CustomRoute } from "../types/CustomRoute";

type Props = {
  routes: CustomRoute[];
};

export default function LeafletMapInner({ routes }: Props) {
  const bounds = routes.flat();

  const allNodes: LatLngTuple[] = routes.flatMap((route) => route.nodes);

  return (
    <MapContainer
      className="h-full w-full"
      bounds={allNodes.length ? allNodes : undefined} // only if we have nodes
      boundsOptions={{ padding: [30, 30] }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {routes.map((route, idx) => (
        <Polyline key={idx} positions={route.nodes} color="lime" />
      ))}
    </MapContainer>
  );
}

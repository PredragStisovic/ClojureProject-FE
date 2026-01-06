import { LatLngTuple } from "leaflet";

export type CustomRoute = {
  nodes: LatLngTuple[];
  distance: number;
};

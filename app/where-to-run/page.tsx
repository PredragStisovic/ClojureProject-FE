"use client";

import { useCallback, useMemo, useState } from "react";
import { whereShouldUserRun } from "../api/user-run-score";
import { getCurrentLocation } from "../helpers/location-helpers";
import dynamic from "next/dynamic";
import { CustomRoute } from "../types/CustomRoute";

export default function WhereToRun() {
  const [distance, setDistance] = useState<number>(5);
  const [unit, setUnit] = useState<"km" | "mi">("km");
  const [routes, setRoutes] = useState<CustomRoute[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const LeafletMap = dynamic(() => import("../components/LeafletMapInner"), {
    ssr: false,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        const distanceInKm = unit === "mi" ? distance * 1.609 : distance;

        const { latitude, longitude } = await getCurrentLocation();
        const res = await whereShouldUserRun(latitude, longitude, distanceInKm);

        if (!res.routes || res.routes.length === 0) {
          setError("No routes found.");
          return;
        }

        setRoutes(res.routes);
      } catch (err) {
        console.error(err);
        setError("Failed to generate routes.");
      } finally {
        setIsLoading(false);
      }
    },
    [distance, unit]
  );

  const bounds = useMemo<CustomRoute[] | null>(() => {
    if (!routes) return null;

    const points = routes
      .flat()
      .filter(
        (p): p is CustomRoute =>
          Array.isArray(p) &&
          p.length === 2 &&
          Number.isFinite(p[0]) &&
          Number.isFinite(p[1])
      );

    return points.length > 0 ? points : null;
  }, [routes]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-black px-6">
      <div className="w-full max-w-3xl bg-neutral-800 rounded-2xl shadow-lg p-8">
        {!routes && !isLoading && (
          <>
            <h1 className="text-xl font-semibold text-white text-center mb-6">
              Where should I run?
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-neutral-300 mb-2">
                  Distance
                </label>

                <div className="flex gap-3">
                  <input
                    type="number"
                    min={1}
                    step={0.5}
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="flex-1 rounded-lg bg-neutral-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  />

                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as "km" | "mi")}
                    className="rounded-lg bg-neutral-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="km">km</option>
                    <option value="mi">miles</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium py-2.5 rounded-lg"
              >
                Find routes
              </button>
            </form>
          </>
        )}

        {isLoading && (
          <p className="text-white text-center">
            Generating routes, please wait…
          </p>
        )}

        {error && (
          <p className="text-red-400 text-center font-medium">{error}</p>
        )}

        {!isLoading && routes && (
          <div className="h-[500px] rounded-xl overflow-hidden">
            <LeafletMap routes={routes} />
          </div>
        )}
      </div>
    </div>
  );
}

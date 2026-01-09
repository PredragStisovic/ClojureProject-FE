import { CustomRoute } from "../types/CustomRoute";

const axios = require("axios").default;

export const shouldUserRun = async (
  runs: any,
  latitude: number,
  longitude: number
) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/should-i-run-api/should-user-run/calculate",
      {
        runs,
        latitude,
        longitude,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching activities:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const whereShouldUserRun = async (
  latitude: number,
  longitude: number,
  distance: number
) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/should-i-run-api/return-routes",
      {
        latitude,
        longitude,
        distance,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching activities:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const exportRoutesToGPX = async (routes: CustomRoute[]) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/should-i-run-api/export-to-gpx",
      { routes },
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/gpx+xml",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "routes.gpx";
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error(
      "Error exporting GPX:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchStrava = async () => {
  const res = await axios.get("/api/strava");
  return res;
};

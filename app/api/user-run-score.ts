const axios = require("axios").default;

export const shouldUserRun = async (runs: any) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/should-i-run-api/should-user-run/calculate",
      {
        runs,
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

export const fetchStrava = async () => {
  const res = await axios.get("/api/strava");
  return res;
};

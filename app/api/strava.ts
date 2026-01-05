const axios = require("axios").default;

export const getStravaActivityData = async (token: string) => {
  try {
    const response = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: 1,
          per_page: 7,
        },
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

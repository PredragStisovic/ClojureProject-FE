import { getStravaActivityData } from "../api/strava";
import { JWT } from "next-auth/jwt";

export const isStravaTokenExpired = (currentExpirationTime?: number) => {
  const currentEpochTime = Math.floor(Date.now() / 1000);
  if (currentExpirationTime === undefined) {
    return `There is an error with the currentEpirationTime, it's value is: ${currentExpirationTime}.`;
  }
  return currentEpochTime > Number(currentExpirationTime);
};

export const fetchLastThreeStravaActivities = async (accessToken?: JWT) => {
  try {
    if (!accessToken) {
      return;
    }
    if (!accessToken.accessToken) {
      return;
    }

    const activities = await getStravaActivityData(accessToken.accessToken);
    return activities;
  } catch (error: any) {
    console.log("Error getting strava activity data");
  }
};

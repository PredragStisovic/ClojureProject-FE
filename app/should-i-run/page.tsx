"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { fetchLastThreeStravaActivities } from "../helpers/strava-helpers";
import { JWT } from "next-auth/jwt";
import { shouldUserRun } from "../api/user-run-score";

export default function ShouldIRun() {
  const { data: session } = useSession();

  const fetchActivitiesAndSendRuns = async (accessToken?: JWT) => {
    if (!accessToken) return;

    const fetchedActivities = await fetchLastThreeStravaActivities(accessToken);

    const runsFromActivities = fetchedActivities.filter(
      (activity: any) => activity.type === "Run"
    );

    await shouldUserRun(runsFromActivities);
  };

  useEffect(() => {
    if (!session) {
      signIn("strava");
    } else {
      fetchActivitiesAndSendRuns(session.accessToken);
    }
  }, [session]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-black px-6 text-white">
      <p>Loading your last activity...</p>
    </div>
  );
}

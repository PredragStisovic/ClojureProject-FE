"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { fetchLastSevenStravaActivities } from "../helpers/strava-helpers";
import { JWT } from "next-auth/jwt";
import { shouldUserRun } from "../api/user-run-score";
import { getCurrentLocation } from "../helpers/location-helpers";
import { useRouter } from "next/navigation";

export default function ShouldIRun() {
  const [userScore, setUserScore] = useState<number | null>(null);
  const [userScoreDescription, setUserScoreDescription] = useState<
    string | null
  >(null);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchActivitiesAndSendRuns = async (accessToken?: JWT) => {
    if (!accessToken) return;

    try {
      const activities = await fetchLastSevenStravaActivities(accessToken);
      const runs = activities.filter((a: any) => a.type === "Run");

      const { latitude, longitude } = await getCurrentLocation();

      const res = await shouldUserRun(runs, latitude, longitude);

      setUserScore(res.score);
      setUserScoreDescription(res.text_description);
    } catch (error) {
      console.error("Error fetching running score:", error);
    }
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
      <div className="max-w-lg w-full bg-neutral-800 rounded-2xl shadow-lg p-8 text-center">
        {userScore !== null && userScoreDescription ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Your Running Score</h1>
            <p className="text-4xl font-extrabold text-green-400 mb-4">
              {userScore.toFixed(2)}
            </p>
            <div className="bg-neutral-700 rounded-xl p-4">
              <p className="text-lg">{userScoreDescription}</p>
            </div>
            <div className="flex mt-5 gap-5">
              <button
                onClick={() => router.push("/")}
                className="
                px-8 py-4
                text-lg font-semibold
                text-neutral-200
                bg-neutral-800
                rounded-xl
                border border-neutral-700
                transition
                hover:bg-neutral-700
                hover:scale-105
                focus:outline-none
                focus:ring-2  
                focus:ring-neutral-500
              "
              >
                Back to main screen
              </button>
              {userScore > 0.3 && (
                <button
                  onClick={() => router.push("/where-to-run")}
                  className="
                px-8 py-4
                text-lg font-semibold
                text-neutral-200
                bg-orange-800
                rounded-xl
                border border-neutral-700
                transition
                hover:bg-neutral-700
                hover:scale-105
                focus:outline-none
                focus:ring-2  
                focus:ring-neutral-500
              "
                >
                  Want to know where to run?
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-300">
            Loading your latest activity...
          </p>
        )}
      </div>
    </div>
  );
}

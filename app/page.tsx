"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-black px-6">
      <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">
        Run decision
      </h1>

      <p className="text-lg text-neutral-400 mb-12 text-center max-w-md">
        Smart, simple recommendations based on your recent activity.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => router.push("/should-i-run")}
          className="
            px-8 py-4
            text-lg font-semibold
            text-white
            bg-orange-600
            rounded-xl
            shadow-lg
            transition
            hover:bg-orange-500
            hover:scale-105
            focus:outline-none
            focus:ring-2
            focus:ring-orange-400
          "
        >
          Should I run?
        </button>

        <button
          onClick={() => router.push("/where-to-run")}
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
          Where should I run?
        </button>
      </div>
    </div>
  );
}

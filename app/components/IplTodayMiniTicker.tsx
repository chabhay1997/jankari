"use client";

import { useEffect, useState } from "react";

type IplResponse = {
  todayMatches?: Array<{
    shortTitle: string;
    scoreLine: string;
    status: string;
  }>;
};

export default function IplTodayMiniTicker() {
  const [label, setLabel] = useState("IPL today");

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      try {
        const response = await fetch(`/api/live/ipl?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "cache-control": "no-cache" },
        });
        const payload = await response.json() as IplResponse;
        const firstMatch = payload.todayMatches?.[0];
        if (!firstMatch) {
          if (!cancelled) {
            setLabel("IPL today");
          }
          return;
        }

        const scoreLabel = firstMatch.scoreLine && firstMatch.scoreLine !== firstMatch.shortTitle
          ? firstMatch.scoreLine
          : firstMatch.shortTitle;
        if (!cancelled) {
          setLabel(scoreLabel);
        }
      } catch {
        if (!cancelled) {
          setLabel("IPL today");
        }
      }
    };

    void refresh();
    const intervalId = window.setInterval(() => {
      void refresh();
    }, 20000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="truncate border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-700">
      {label}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { IplPayload } from "@/app/lib/iplLive";

type IplLiveBoardProps = {
  initialData: IplPayload;
};

function MatchCard({ match }: { match: IplPayload["todayMatches"][number] }) {
  const badgeTone = match.status.toLowerCase().includes("live")
    ? "bg-red-50 text-red-600"
    : match.status.toLowerCase().includes("result")
      ? "bg-emerald-50 text-emerald-700"
      : "bg-slate-100 text-slate-600";

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${badgeTone}`}>
            {match.status}
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{match.venue}</p>
        </div>
        <h2 className="mt-3 text-2xl font-black text-slate-950">{match.shortTitle}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-700">{match.scoreLine}</p>
        <p className="mt-2 text-sm text-slate-600">{match.matchTime}</p>
        <p className="mt-3 text-sm text-slate-600">{match.summary}</p>
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">{match.title}</p>
        {match.href ? (
          <Link href={match.href} target="_blank" className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700 hover:underline">
            Open match
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default function IplLiveBoard({ initialData }: IplLiveBoardProps) {
  const [data, setData] = useState<IplPayload>(initialData);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }));

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      try {
        const response = await fetch(`/api/live/ipl?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "cache-control": "no-cache" },
        });
        const payload = await response.json() as IplPayload;
        if (!cancelled) {
          setData(payload);
          setLastUpdated(new Date().toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
          }));
        }
      } catch {
        if (!cancelled) {
          setLastUpdated("Update retrying");
        }
      }
    };

    const intervalId = window.setInterval(() => {
      void refresh();
    }, 20000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const todayMatches = data.todayMatches || [];

  return (
    <>
      <div className="border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-700">Live Scores</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Today&apos;s IPL Match Center</h1>
            <p className="mt-2 text-sm text-slate-600">Free IPL schedule and score summary from the public source, auto-refreshing every 20 seconds.</p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Last updated {lastUpdated}</p>
        </div>
      </div>

      <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {todayMatches.length > 0 ? todayMatches.map((match) => (
          <MatchCard key={`${match.shortTitle}-${match.matchTime}`} match={match} />
        )) : (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No IPL match found for today from the public source right now.
          </div>
        )}
      </section>
    </>
  );
}

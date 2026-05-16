"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type IplResponse = {
  live: {
    title: string;
    status: string;
    score: string;
    summary: string;
  };
  nextMatch: {
    title: string;
    matchTime: string;
    venue: string;
    note: string;
    href?: string;
  };
  source: string;
  liveEnabled: boolean;
};

export default function IplLiveCards() {
  const [data, setData] = useState<IplResponse | null>(null);

  useEffect(() => {
    void fetch("/api/live/ipl", { cache: "no-store" })
      .then((response) => response.json() as Promise<IplResponse>)
      .then(setData)
      .catch(() => null);
  }, []);

  return (
    <section className="rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_72%)] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-700">IPL Next Match</p>
          <h3 className="mt-2 text-xl font-black text-slate-950">{data?.nextMatch.title || "Loading official IPL fixture..."}</h3>
          <p className="mt-3 text-sm font-semibold text-slate-700">{data?.nextMatch.matchTime || data?.live.summary || "Loading..."}</p>
          <p className="mt-1 text-sm text-slate-600">{data?.nextMatch.venue || ""}</p>
        </div>
        {data?.nextMatch.href ? (
          <Link href={data.nextMatch.href} target="_blank" className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
            Open Official Match
          </Link>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-semibold text-blue-700">
          {data?.live.status || "Scheduled"}
        </span>
        <span>{data?.live.score || "Upcoming fixture"}</span>
        <span>{data?.nextMatch.note || "Official IPL schedule"}</span>
      </div>
    </section>
  );
}

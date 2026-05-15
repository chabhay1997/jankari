"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getStoryHrefWithSource, getTopicHref, type StoryCard, type Topic } from "@/app/lib/siteData";

interface InfiniteStoryFeedProps {
  initialStories: StoryCard[];
  totalCount: number;
  topics: Topic[];
}

const PAGE_SIZE = 6;
const DISCOVERY_MODES = [
  { id: "latest", label: "Latest" },
  { id: "india", label: "India" },
  { id: "world", label: "World Wide" },
  { id: "nearby", label: "Near You" },
  { id: "business", label: "Business" },
  { id: "health", label: "Health" },
] as const;

export default function InfiniteStoryFeed({ initialStories, totalCount, topics }: InfiniteStoryFeedProps) {
  const [stories, setStories] = useState(initialStories);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialStories.length < totalCount);
  const [mode, setMode] = useState<(typeof DISCOVERY_MODES)[number]["id"]>("latest");
  const [query, setQuery] = useState("");
  const [locationLabel, setLocationLabel] = useState("Location off");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [voiceReady, setVoiceReady] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<{
    start?: () => void;
    stop?: () => void;
    onresult?: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
    onerror?: (() => void) | null;
  } | null>(null);

  useEffect(() => {
    const Recognition = typeof window !== "undefined"
      ? (window as Window & {
        SpeechRecognition?: new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          start(): void;
          stop(): void;
          onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
          onerror: () => void;
        };
        webkitSpeechRecognition?: new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          start(): void;
          stop(): void;
          onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
          onerror: () => void;
        };
      }).SpeechRecognition || (window as Window & { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition
      : null;

    if (!Recognition) {
      return;
    }

    const recognition = new Recognition() as {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      start(): void;
      stop(): void;
      onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onerror: () => void;
    };
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || "";
      setQuery(transcript.trim());
    };
    recognition.onerror = () => {};
    recognitionRef.current = recognition;
    setVoiceReady(true);
  }, []);

  useEffect(() => {
    void reloadStories();
  }, [mode, query, coords?.lat, coords?.lng]);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) {
      return;
    }

    const sentinel = sentinelRef.current;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible && !loading) {
        void loadMore();
      }
    }, { rootMargin: "280px 0px" });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, stories.length]);

  async function reloadStories() {
    setLoading(true);
    try {
      const response = await fetch(buildFeedUrl(0, PAGE_SIZE), {
        cache: "no-store",
      });
      const payload = await response.json() as { items?: StoryCard[]; hasMore?: boolean };
      setStories(payload.items ?? []);
      setHasMore(Boolean(payload.hasMore));
    } catch {
      setStories(initialStories);
      setHasMore(initialStories.length < totalCount);
    } finally {
      setLoading(false);
    }
  }

function buildFeedUrl(offset: number, limit: number) {
    const params = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
      mode,
    });

    if (query.trim()) {
      params.set("query", query.trim());
    }

    if (coords) {
      params.set("lat", String(coords.lat));
      params.set("lng", String(coords.lng));
    }

    return `/api/stories-feed?${params.toString()}`;
  }

  async function loadMore() {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(buildFeedUrl(stories.length, PAGE_SIZE), {
        cache: "no-store",
      });
      const payload = await response.json() as { items?: StoryCard[]; hasMore?: boolean };
      const incoming = payload.items ?? [];
      setStories((current) => [...current, ...incoming.filter((item) => !current.some((entry) => entry.slug === item.slug))]);
      setHasMore(Boolean(payload.hasMore) && incoming.length > 0);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  const topicLabel = (slug: string) => topics.find((topic) => topic.slug === slug)?.label || slug.replace(/-/g, " ");

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const choice = document.cookie.split("; ").find((entry) => entry.startsWith("bj_location_choice="))?.split("=")[1];
    const coordsCookie = document.cookie.split("; ").find((entry) => entry.startsWith("bj_location_coords="))?.split("=")[1];

    if (choice !== "allowed" || !coordsCookie) {
      return;
    }

    const [lat, lng] = decodeURIComponent(coordsCookie).split(",").map((value) => Number(value));
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setCoords({ lat, lng });
      setLocationLabel("Using saved nearby preference");
      setMode("nearby");
    }
  }, []);

  function enableNearby() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationLabel("Location unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setCoords({
        lat: Number(position.coords.latitude.toFixed(3)),
        lng: Number(position.coords.longitude.toFixed(3)),
      });
      setLocationLabel(`Lat ${position.coords.latitude.toFixed(2)}, Lng ${position.coords.longitude.toFixed(2)}`);
      setMode("nearby");
    }, () => {
      setLocationLabel("Permission blocked");
    }, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 300000,
    });
  }

  function startVoiceSearch() {
    recognitionRef.current?.start?.();
  }

  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_40%,#ffffff_100%)] px-5 py-5 md:px-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-slate-500">Personal News Briefing</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-black text-slate-950">Smart story discovery across India, world, and your interests</h2>
            <p className="mt-2 max-w-3xl text-sm md:text-base text-slate-600">
              A rolling stream of fresh reporting across politics, business, trading, health, travel, and more.
            </p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{stories.length} of {totalCount}</span>
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type what the user wants to read: India politics, nearby business, market crash, health tips..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
              />
              {voiceReady ? (
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Speak
                </button>
              ) : null}
              <button
                type="button"
                onClick={enableNearby}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                Nearby
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {DISCOVERY_MODES.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setMode(entry.id)}
                  className={`rounded-full border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] transition ${
                    mode === entry.id
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-xs text-slate-500">
            <p className="font-bold uppercase tracking-[0.18em] text-slate-400">Smart Discovery</p>
            <p className="mt-2">Mode: <span className="font-semibold text-slate-700">{DISCOVERY_MODES.find((entry) => entry.id === mode)?.label}</span></p>
            <p className="mt-1">Location: <span className="font-semibold text-slate-700">{locationLabel}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.3fr)_320px] gap-0">
        <div className="p-5 md:p-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {stories.map((story, index) => (
              <article key={story.slug} className={`group overflow-hidden rounded-[24px] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg ${index === 0 ? "md:col-span-2 md:grid md:grid-cols-[1.1fr_0.9fr]" : ""}`}>
                <div className="overflow-hidden bg-slate-100">
                  <img
                    src={story.image}
                    alt={story.title}
                    className={`w-full object-cover transition duration-300 group-hover:scale-[1.02] ${index === 0 ? "h-72 md:h-full" : "h-52"}`}
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <Link href={getTopicHref(story.topic)} className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    {topicLabel(story.topic)}
                  </Link>
                  <Link href={getStoryHrefWithSource(story.slug, "feed")} className="block">
                    <h3 className={`mt-3 font-black leading-tight text-slate-950 transition group-hover:text-blue-600 ${index === 0 ? "text-2xl md:text-[2rem]" : "text-lg"}`}>
                      {story.title}
                    </h3>
                  </Link>
                  <p className="mt-3 text-sm leading-7 text-slate-600 line-clamp-4">{story.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-400">by {story.author}</span>
                    <Link href={getStoryHrefWithSource(story.slug, "feed")} className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 hover:underline">
                      Read now
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {hasMore ? <div ref={sentinelRef} className="h-6" /> : null}

          <div className="mt-6 flex justify-center">
            {loading ? (
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Loading more stories
              </div>
            ) : !hasMore ? (
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                You are all caught up
              </div>
            ) : null}
          </div>
        </div>

        <aside className="border-t border-slate-200 bg-slate-50/80 p-5 md:p-7 xl:border-l xl:border-t-0">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-slate-500">News Rhythm</p>
          <div className="mt-4 space-y-4">
            {stories.slice(0, 5).map((story, index) => (
              <div key={`${story.slug}-rail`} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <span className="pt-1 text-[11px] font-black text-slate-300">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">{topicLabel(story.topic)}</p>
                  <Link href={getStoryHrefWithSource(story.slug, "feed")} className="mt-2 block text-sm font-semibold leading-snug text-slate-900 hover:text-blue-600">
                    {story.title}
                  </Link>
                  <p className="mt-2 text-xs text-slate-400">by {story.author}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

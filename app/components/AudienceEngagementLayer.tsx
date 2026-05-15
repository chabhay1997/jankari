"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

function getCookie(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function getSessionId() {
  const existing = getCookie("bj_session");
  if (existing) {
    return existing;
  }

  const created = `bj_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  setCookie("bj_session", created);
  return created;
}

async function postAudience(path: string, payload: Record<string, unknown>) {
  try {
    await fetch(`${API_BASE_URL}/api/audience/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silent fail keeps the UX smooth if backend is temporarily unavailable.
  }
}

export default function AudienceEngagementLayer() {
  const [cookieChoice, setCookieChoice] = useState<"" | "accepted" | "rejected">("");
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    topics: "india,business,health",
    dailyBriefing: true,
    nearbyNews: false,
  });
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const sessionId = useMemo(() => getSessionId(), []);

  useEffect(() => {
    const consent = getCookie("bj_cookie_consent") as "" | "accepted" | "rejected";
    const newsletter = getCookie("bj_newsletter_done");
    const locationChoice = getCookie("bj_location_choice");
    const locationCoords = getCookie("bj_location_coords");

    setCookieChoice(consent || "");
    setNewsletterDone(newsletter === "yes");

    if (locationCoords) {
      const [latitude, longitude] = locationCoords.split(",").map((value) => Number(value));
      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        setCoords({ latitude, longitude });
      }
    }

    if (!consent) {
      return;
    }

    if (!locationChoice) {
      const timer = window.setTimeout(() => setLocationPromptVisible(true), 1800);
      return () => window.clearTimeout(timer);
    }

    if (newsletter !== "yes") {
      const timer = window.setTimeout(() => setNewsletterOpen(true), 3500);
      return () => window.clearTimeout(timer);
    }
  }, []);

  async function handleCookieChoice(choice: "accepted" | "rejected") {
    setCookie("bj_cookie_consent", choice);
    setCookieChoice(choice);
    await postAudience("cookie-consent", {
      sessionId,
      type: choice === "accepted" ? "accept" : "reject",
      source: "website",
    });

    if (!getCookie("bj_location_choice")) {
      setTimeout(() => setLocationPromptVisible(true), 900);
    }
  }

  function requestLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setCookie("bj_location_choice", "blocked");
      setLocationPromptVisible(false);
      void postAudience("location-consent", {
        sessionId,
        type: "block",
        source: "website",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = Number(position.coords.latitude.toFixed(4));
      const longitude = Number(position.coords.longitude.toFixed(4));
      setCoords({ latitude, longitude });
      setFormState((current) => ({ ...current, nearbyNews: true }));
      setCookie("bj_location_choice", "allowed");
      setCookie("bj_location_coords", `${latitude},${longitude}`);
      setLocationPromptVisible(false);
      void postAudience("location-consent", {
        sessionId,
        type: "allow",
        latitude,
        longitude,
        source: "website",
      });

      if (!newsletterDone) {
        setTimeout(() => setNewsletterOpen(true), 800);
      }
    }, () => {
      setCookie("bj_location_choice", "blocked");
      setLocationPromptVisible(false);
      void postAudience("location-consent", {
        sessionId,
        type: "block",
        source: "website",
      });
    }, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 300000,
    });
  }

  async function handleNewsletterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await postAudience("subscribe", {
      sessionId,
      name: formState.name,
      email: formState.email,
      topics: formState.topics,
      source: "website",
      dailyBriefing: formState.dailyBriefing,
      nearbyNews: formState.nearbyNews,
      cookieConsent: cookieChoice || "accepted",
      locationConsent: coords ? "allowed" : "unknown",
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    });

    setCookie("bj_newsletter_done", "yes");
    setNewsletterDone(true);
    setNewsletterOpen(false);
  }

  function closeNewsletter() {
    setCookie("bj_newsletter_done", "dismissed");
    setNewsletterOpen(false);
  }

  return (
    <>
      {!cookieChoice ? (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Cookie Choice</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                We use cookies to remember preferred topics, local-news choices, and newsletter prompts so readers get a smoother daily briefing experience.
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => void handleCookieChoice("rejected")} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                Reject
              </button>
              <button type="button" onClick={() => void handleCookieChoice("accepted")} className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                Accept
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {cookieChoice && locationPromptVisible ? (
        <div className="fixed bottom-6 left-6 z-40 max-w-sm rounded-[26px] border border-slate-200 bg-white p-5 shadow-xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Local News</p>
          <h3 className="mt-2 text-lg font-black text-slate-950">Show stories near you</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Allow location to surface nearby city and region stories first, while still keeping India and world coverage visible.
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => {
              setCookie("bj_location_choice", "later");
              setLocationPromptVisible(false);
            }} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
              Not now
            </button>
            <button type="button" onClick={requestLocation} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
              Allow location
            </button>
          </div>
        </div>
      ) : null}

      {cookieChoice === "accepted" && !newsletterDone && newsletterOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Daily Briefing</p>
                <h3 className="mt-2 text-2xl font-black text-slate-950">Get Bharat Jankari in your inbox</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Save your name, email, and preferred topics to receive fresh blogs, India updates, and nearby reads in one daily summary.
                </p>
              </div>
              <button type="button" onClick={closeNewsletter} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={(event) => void handleNewsletterSubmit(event)} className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                type="text"
                required
                placeholder="Your name"
                value={formState.name}
                onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formState.email}
                onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={formState.topics}
                onChange={(event) => setFormState((current) => ({ ...current, topics: event.target.value }))}
                placeholder="india,business,health,travel"
                className="md:col-span-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formState.dailyBriefing}
                  onChange={(event) => setFormState((current) => ({ ...current, dailyBriefing: event.target.checked }))}
                />
                Send daily briefing
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formState.nearbyNews}
                  onChange={(event) => setFormState((current) => ({ ...current, nearbyNews: event.target.checked }))}
                />
                Prefer nearby and local news
              </label>
              <div className="md:col-span-2 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400">You can update these preferences later from future email links or admin support.</p>
                <button type="submit" className="rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white">
                  Save my briefing
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

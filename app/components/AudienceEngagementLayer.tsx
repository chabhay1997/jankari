"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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

function getStoredValue(name: string) {
  const cookieValue = getCookie(name);
  if (cookieValue) {
    return cookieValue;
  }

  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(name) || "";
  } catch {
    return "";
  }
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // Ignore storage issues and continue with cookie-only mode.
    }
  }
}

function getSessionId() {
  const existing = getStoredValue("bj_session");
  if (existing) {
    return existing;
  }

  const created = `bj_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  setCookie("bj_session", created);
  return created;
}

async function postAudience(path: string, payload: Record<string, unknown>) {
  try {
    await fetch(`/api/audience/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Keep engagement UX resilient even if tracking fails.
  }
}

export default function AudienceEngagementLayer() {
  const pathname = usePathname();
  const sessionId = useMemo(() => getSessionId(), []);
  const activeMsRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const locationTimerReadyRef = useRef(false);
  const newsletterTimerReadyRef = useRef(false);
  const initialConsent = getStoredValue("bj_cookie_consent") as "" | "accepted" | "rejected";
  const initialNewsletterState = getStoredValue("bj_newsletter_done");
  const initialInteractionState = getStoredValue("bj_has_interacted");
  const initialLocationCoords = getStoredValue("bj_location_coords");
  const [isMounted, setIsMounted] = useState(false);
  const [cookieChoice, setCookieChoice] = useState<"" | "accepted" | "rejected">(initialConsent || "");
  const [cookieBannerVisible, setCookieBannerVisible] = useState(!initialConsent);
  const [locationPromptVisible, setLocationPromptVisible] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(initialNewsletterState === "yes" || initialNewsletterState === "dismissed");
  const [hasInteracted, setHasInteracted] = useState(initialInteractionState === "yes");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(() => {
    const [latitude, longitude] = initialLocationCoords.split(",").map((value) => Number(value));
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude };
    }
    return null;
  });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    topics: "india,business,health",
    dailyBriefing: true,
    nearbyNews: Boolean(initialLocationCoords),
  });

  function queueNewsletterOpen(delayMs = 1200) {
    const newsletterChoice = getStoredValue("bj_newsletter_done");
    if (cookieChoice !== "accepted" || newsletterChoice || newsletterDone) {
      return;
    }

    window.setTimeout(() => {
      const latestChoice = getStoredValue("bj_newsletter_done");
      if (latestChoice || newsletterDone) {
        return;
      }

      newsletterTimerReadyRef.current = true;
      setNewsletterOpen(true);
    }, delayMs);
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const latestConsent = getStoredValue("bj_cookie_consent") as "" | "accepted" | "rejected";
    if (latestConsent) {
      setCookieChoice(latestConsent);
      setCookieBannerVisible(false);
    }

    const locationChoice = getStoredValue("bj_location_choice");

    if (locationChoice) {
      locationTimerReadyRef.current = true;
    }

    if (initialNewsletterState) {
      newsletterTimerReadyRef.current = true;
    }
  }, [initialNewsletterState]);

  useEffect(() => {
    void postAudience("event", {
      sessionId,
      type: "page_view",
      source: "website",
      path: pathname || "/",
      metadata: {
        totalVisitCount: Number(getCookie("bj_visit_count") || "0") + 1,
      },
    });

    const nextVisitCount = Number(getStoredValue("bj_visit_count") || "0") + 1;
    setCookie("bj_visit_count", String(nextVisitCount));
    setCookie(`bj_page_seen_${(pathname || "/").replace(/[^a-z0-9]/gi, "_")}`, "yes");
  }, [pathname, sessionId]);

  useEffect(() => {
    const markInteraction = () => {
      setHasInteracted(true);
      setCookie("bj_has_interacted", "yes");
    };

    window.addEventListener("click", markInteraction, { passive: true });
    window.addEventListener("scroll", markInteraction, { passive: true });
    window.addEventListener("keydown", markInteraction);

    return () => {
      window.removeEventListener("click", markInteraction);
      window.removeEventListener("scroll", markInteraction);
      window.removeEventListener("keydown", markInteraction);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        lastTickRef.current = null;
        return;
      }

      const now = Date.now();
      if (lastTickRef.current) {
        activeMsRef.current += now - lastTickRef.current;
      }
      lastTickRef.current = now;

      const engagedForOneMinute = activeMsRef.current >= 60000;
      const newsletterChoice = getStoredValue("bj_newsletter_done");

      if (
        engagedForOneMinute
        && cookieChoice === "accepted"
        && hasInteracted
        && !newsletterChoice
        && !newsletterDone
        && !newsletterOpen
        && !newsletterTimerReadyRef.current
      ) {
        newsletterTimerReadyRef.current = true;
        setNewsletterOpen(true);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [cookieChoice, hasInteracted, locationPromptVisible, newsletterDone, newsletterOpen]);

  useEffect(() => {
    if (cookieChoice !== "accepted" || newsletterDone || newsletterOpen) {
      return;
    }

    const newsletterChoice = getStoredValue("bj_newsletter_done");
    if (newsletterChoice || newsletterTimerReadyRef.current) {
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      const latestChoice = getStoredValue("bj_newsletter_done");
      if (latestChoice || newsletterDone) {
        return;
      }

      newsletterTimerReadyRef.current = true;
      setNewsletterOpen(true);
    }, 60000);

    return () => window.clearTimeout(fallbackTimer);
  }, [cookieChoice, newsletterDone, newsletterOpen]);

  function handleCookieChoice(choice: "accepted" | "rejected") {
    setCookieBannerVisible(false);
    setCookie("bj_cookie_consent", choice);
    setCookieChoice(choice);

    const locationChoice = getStoredValue("bj_location_choice");
    if (!locationChoice && !locationTimerReadyRef.current) {
      locationTimerReadyRef.current = true;
      window.setTimeout(() => {
        setLocationPromptVisible(true);
      }, 200);
    }

    void postAudience("cookie-consent", {
      sessionId,
      type: choice === "accepted" ? "accept" : "reject",
      source: "website",
      path: pathname || "/",
    });
  }

  function requestLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setCookie("bj_location_choice", "blocked");
      setLocationPromptVisible(false);
      void postAudience("location-consent", {
        sessionId,
        type: "block",
        source: "website",
        path: pathname || "/",
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
      window.dispatchEvent(new CustomEvent("bj:location-updated", {
        detail: { latitude, longitude },
      }));
      setLocationPromptVisible(false);
      void postAudience("location-consent", {
        sessionId,
        type: "allow",
        latitude,
        longitude,
        source: "website",
        path: pathname || "/",
      });
      queueNewsletterOpen();
    }, () => {
      setCookie("bj_location_choice", "blocked");
      setLocationPromptVisible(false);
      void postAudience("location-consent", {
        sessionId,
        type: "block",
        source: "website",
        path: pathname || "/",
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
      path: pathname || "/",
    });

    setCookie("bj_newsletter_done", "yes");
    setNewsletterDone(true);
    setNewsletterOpen(false);
  }

  function closeNewsletter() {
    setCookie("bj_newsletter_done", "dismissed");
    setNewsletterDone(true);
    setNewsletterOpen(false);
    void postAudience("event", {
      sessionId,
      type: "newsletter_dismiss",
      source: "website",
      path: pathname || "/",
    });
  }

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {cookieBannerVisible ? (
        <div className="fixed inset-x-3 bottom-3 z-[2147483647] mx-auto max-w-4xl isolate pointer-events-auto rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur md:inset-x-4 md:bottom-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Cookie Choice</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                We use cookies to remember preferred topics, local-news choices, and briefing prompts for a smoother reading experience.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleCookieChoice("rejected");
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleCookieChoice("rejected");
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600"
              >
                Decline
              </button>
              <button
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleCookieChoice("accepted");
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleCookieChoice("accepted");
                }}
                className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {cookieChoice === "accepted" && locationPromptVisible ? (
        <div className="fixed inset-x-3 bottom-3 z-40 max-w-sm border border-slate-200 bg-white p-5 shadow-xl md:bottom-6 md:left-6 md:right-auto">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Local News</p>
          <h3 className="mt-2 text-lg font-black text-slate-950">Show stories near you</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Allow location so we can boost nearby city and region stories first.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setCookie("bj_location_choice", "later");
                setLocationPromptVisible(false);
                void postAudience("location-consent", {
                  sessionId,
                  type: "later",
                  source: "website",
                  path: pathname || "/",
                });
              }}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600"
            >
              Not now
            </button>
            <button type="button" onClick={requestLocation} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
              Allow location
            </button>
          </div>
        </div>
      ) : null}

      {cookieChoice === "accepted" && !newsletterDone && newsletterOpen ? (
        <div className="fixed inset-0 z-[160] flex items-start justify-center bg-black/40 px-4 pt-20">
          <div className="relative w-full max-w-[520px] border border-white/10 bg-black p-6 text-white shadow-2xl">
            <button
              type="button"
              onClick={closeNewsletter}
              className="absolute right-4 top-4 text-xl leading-none text-white/60 hover:text-white"
              aria-label="Close subscribe popup"
            >
              ×
            </button>
            <div className="pr-8">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/60">Daily Briefing</p>
              <h3 className="mt-2 text-2xl font-black">Get Bharat Jankari in your inbox</h3>
              <p className="mt-2 text-sm text-white/70">
                Add your name and email for daily updates.
              </p>
            </div>

            <form onSubmit={(event) => void handleNewsletterSubmit(event)} className="mt-5 flex flex-col gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={formState.name}
                  onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                  className="w-full border border-white/20 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/50"
                />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formState.email}
                  onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                  className="w-full border border-white/20 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-white/50"
                />
                <button type="submit" className="w-full border border-white/20 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-black">
                  Subscribe
                </button>
              </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

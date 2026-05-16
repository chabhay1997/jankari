import { headers } from "next/headers";
import { recordAudienceEvent, upsertNewsletterSubscriber } from "@/app/lib/audienceStore";

type SubscribePayload = {
  sessionId?: string;
  name?: string;
  email?: string;
  topics?: string | string[];
  source?: string;
  dailyBriefing?: boolean;
  nearbyNews?: boolean;
  cookieConsent?: string;
  locationConsent?: string;
  latitude?: number;
  longitude?: number;
  path?: string;
};

function normalizeTopics(topics: SubscribePayload["topics"]) {
  if (Array.isArray(topics)) {
    return topics.map((entry) => String(entry).trim()).filter(Boolean);
  }

  return String(topics || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const payload = await request.json() as SubscribePayload;
  const sessionId = String(payload.sessionId || "").trim();
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();

  if (!sessionId || !name || !email) {
    return Response.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const headerStore = await headers();
  const topics = normalizeTopics(payload.topics);
  const subscriber = await upsertNewsletterSubscriber({
    sessionId,
    name,
    email,
    topics,
    source: String(payload.source || "website"),
    dailyBriefing: Boolean(payload.dailyBriefing),
    nearbyNews: Boolean(payload.nearbyNews),
    cookieConsent: String(payload.cookieConsent || "unknown"),
    locationConsent: String(payload.locationConsent || "unknown"),
    latitude: typeof payload.latitude === "number" ? payload.latitude : null,
    longitude: typeof payload.longitude === "number" ? payload.longitude : null,
  });

  await recordAudienceEvent({
    type: "newsletter_subscribe",
    sessionId,
    source: String(payload.source || "website"),
    path: String(payload.path || "/"),
    userAgent: headerStore.get("user-agent") || undefined,
    referrer: headerStore.get("referer") || undefined,
    latitude: typeof payload.latitude === "number" ? payload.latitude : null,
    longitude: typeof payload.longitude === "number" ? payload.longitude : null,
    metadata: {
      email,
      topics,
      dailyBriefing: Boolean(payload.dailyBriefing),
      nearbyNews: Boolean(payload.nearbyNews),
    },
  });

  return Response.json({ ok: true, subscriber });
}

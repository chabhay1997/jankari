import { promises as fs } from "fs";
import path from "path";

export type AudienceEventType =
  | "page_view"
  | "cookie_accept"
  | "cookie_reject"
  | "location_allow"
  | "location_block"
  | "location_later"
  | "newsletter_subscribe"
  | "newsletter_dismiss";

export type AudienceEvent = {
  id: string;
  type: AudienceEventType;
  sessionId: string;
  path: string;
  source: string;
  createdAt: string;
  userAgent?: string;
  referrer?: string;
  latitude?: number | null;
  longitude?: number | null;
  metadata?: Record<string, unknown>;
};

export type NewsletterSubscriber = {
  id: string;
  sessionId: string;
  name: string;
  email: string;
  topics: string[];
  source: string;
  dailyBriefing: boolean;
  nearbyNews: boolean;
  cookieConsent: string;
  locationConsent: string;
  latitude?: number | null;
  longitude?: number | null;
  subscribedAt: string;
  lastUpdatedAt: string;
  digestStatus: "pending_config" | "ready";
};

type AudienceStore = {
  audience_events: AudienceEvent[];
  newsletter_subscribers: NewsletterSubscriber[];
};

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "audience-store.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(storePath);
  } catch {
    const initial: AudienceStore = {
      audience_events: [],
      newsletter_subscribers: [],
    };
    await fs.writeFile(storePath, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readStore(): Promise<AudienceStore> {
  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");
  const parsed = JSON.parse(raw) as Partial<AudienceStore>;
  return {
    audience_events: Array.isArray(parsed.audience_events) ? parsed.audience_events : [],
    newsletter_subscribers: Array.isArray(parsed.newsletter_subscribers) ? parsed.newsletter_subscribers : [],
  };
}

async function writeStore(store: AudienceStore) {
  await ensureStore();
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST
    && process.env.SMTP_PORT
    && process.env.SMTP_USER
    && process.env.SMTP_PASS
    && process.env.SMTP_FROM,
  );
}

export async function recordAudienceEvent(
  event: Omit<AudienceEvent, "id" | "createdAt">,
) {
  const store = await readStore();
  const nextEvent: AudienceEvent = {
    id: makeId("evt"),
    createdAt: new Date().toISOString(),
    ...event,
  };

  store.audience_events.unshift(nextEvent);
  await writeStore(store);
  return nextEvent;
}

export async function upsertNewsletterSubscriber(
  subscriber: Omit<NewsletterSubscriber, "id" | "subscribedAt" | "lastUpdatedAt" | "digestStatus">,
) {
  const store = await readStore();
  const now = new Date().toISOString();
  const email = subscriber.email.trim().toLowerCase();
  const existingIndex = store.newsletter_subscribers.findIndex((entry) => entry.email === email);
  const digestStatus = isSmtpConfigured() ? "ready" : "pending_config";

  if (existingIndex >= 0) {
    const updated: NewsletterSubscriber = {
      ...store.newsletter_subscribers[existingIndex],
      ...subscriber,
      email,
      lastUpdatedAt: now,
      digestStatus,
    };
    store.newsletter_subscribers[existingIndex] = updated;
    await writeStore(store);
    return updated;
  }

  const created: NewsletterSubscriber = {
    id: makeId("sub"),
    subscribedAt: now,
    lastUpdatedAt: now,
    digestStatus,
    ...subscriber,
    email,
  };
  store.newsletter_subscribers.unshift(created);
  await writeStore(store);
  return created;
}

export async function getAudienceOverview(search = "") {
  const store = await readStore();
  const query = search.trim().toLowerCase();
  const subscribers = query
    ? store.newsletter_subscribers.filter((entry) => {
      return [entry.name, entry.email, entry.topics.join(", ")]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    : store.newsletter_subscribers;

  const events = store.audience_events;
  const pageViews = events.filter((entry) => entry.type === "page_view");
  const uniqueVisitors = new Set(pageViews.map((entry) => entry.sessionId)).size;

  return {
    summary: {
      totalSubscribers: store.newsletter_subscribers.length,
      filteredSubscribers: subscribers.length,
      totalEvents: events.length,
      totalPageViews: pageViews.length,
      uniqueVisitors,
      cookieAccepted: events.filter((entry) => entry.type === "cookie_accept").length,
      cookieRejected: events.filter((entry) => entry.type === "cookie_reject").length,
      locationAllowed: events.filter((entry) => entry.type === "location_allow").length,
      locationBlocked: events.filter((entry) => entry.type === "location_block").length,
    },
    subscribers,
    recentEvents: events.slice(0, 50),
  };
}

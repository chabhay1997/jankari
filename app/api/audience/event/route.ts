import { headers } from "next/headers";
import { recordAudienceEvent, type AudienceEventType } from "@/app/lib/audienceStore";

const allowedTypes = new Set<AudienceEventType>(["page_view", "newsletter_dismiss"]);

export async function POST(request: Request) {
  const payload = await request.json() as {
    sessionId?: string;
    type?: AudienceEventType;
    source?: string;
    path?: string;
    metadata?: Record<string, unknown>;
  };

  const sessionId = String(payload.sessionId || "").trim();
  if (!sessionId || !payload.type || !allowedTypes.has(payload.type)) {
    return Response.json({ ok: false, error: "Invalid event payload." }, { status: 400 });
  }

  const headerStore = await headers();
  const event = await recordAudienceEvent({
    type: payload.type,
    sessionId,
    source: String(payload.source || "website"),
    path: String(payload.path || "/"),
    userAgent: headerStore.get("user-agent") || undefined,
    referrer: headerStore.get("referer") || undefined,
    metadata: payload.metadata || {},
  });

  return Response.json({ ok: true, event });
}

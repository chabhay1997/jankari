import { headers } from "next/headers";
import { recordAudienceEvent } from "@/app/lib/audienceStore";

export async function POST(request: Request) {
  const payload = await request.json() as {
    sessionId?: string;
    type?: string;
    source?: string;
    path?: string;
    latitude?: number;
    longitude?: number;
  };

  const sessionId = String(payload.sessionId || "").trim();
  if (!sessionId) {
    return Response.json({ ok: false, error: "sessionId is required." }, { status: 400 });
  }

  const mappedType = payload.type === "allow"
    ? "location_allow"
    : payload.type === "later"
      ? "location_later"
      : "location_block";

  const headerStore = await headers();
  const event = await recordAudienceEvent({
    type: mappedType,
    sessionId,
    source: String(payload.source || "website"),
    path: String(payload.path || "/"),
    userAgent: headerStore.get("user-agent") || undefined,
    referrer: headerStore.get("referer") || undefined,
    latitude: typeof payload.latitude === "number" ? payload.latitude : null,
    longitude: typeof payload.longitude === "number" ? payload.longitude : null,
  });

  return Response.json({ ok: true, event });
}

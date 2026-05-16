import { headers } from "next/headers";
import { recordAudienceEvent } from "@/app/lib/audienceStore";

export async function POST(request: Request) {
  const payload = await request.json() as {
    sessionId?: string;
    type?: string;
    source?: string;
    path?: string;
  };

  const action = payload.type === "reject" ? "cookie_reject" : "cookie_accept";
  const sessionId = String(payload.sessionId || "").trim();

  if (!sessionId) {
    return Response.json({ ok: false, error: "sessionId is required." }, { status: 400 });
  }

  const headerStore = await headers();
  const event = await recordAudienceEvent({
    type: action,
    sessionId,
    source: String(payload.source || "website"),
    path: String(payload.path || "/"),
    userAgent: headerStore.get("user-agent") || undefined,
    referrer: headerStore.get("referer") || undefined,
  });

  return Response.json({ ok: true, event });
}

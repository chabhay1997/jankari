import { fetchIplLiveData } from "@/app/lib/iplLive";

export async function GET() {
  const payload = await fetchIplLiveData();
  return Response.json(payload, { headers: { "Cache-Control": "no-store" } });
}

import { mergeSiteData } from "@/app/lib/siteData";

export async function GET() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.bharatjankari.com";

  try {
    const res = await fetch(`${apiBaseUrl}/api/site-data`, {
      cache: "no-store",
      signal: AbortSignal.timeout(700),
    });

    if (!res.ok) {
      return Response.json(mergeSiteData(null));
    }

    const payload = await res.json();
    return Response.json(mergeSiteData(payload.data));
  } catch {
    return Response.json(mergeSiteData(null));
  }
}

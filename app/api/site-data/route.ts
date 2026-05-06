import { mergeSiteData } from "@/app/lib/siteData";

export async function GET() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  try {
    const res = await fetch(`${apiBaseUrl}/api/site-data`, {
      cache: "no-store",
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

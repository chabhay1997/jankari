function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = escapeXml(searchParams.get("title") || "Bharat Jankari");
  const topic = escapeXml((searchParams.get("topic") || "latest").replace(/-/g, " "));

  const svg = `
    <svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="675" fill="#eff6ff"/>
      <rect x="28" y="28" width="1144" height="619" rx="32" fill="url(#bg)"/>
      <circle cx="130" cy="130" r="64" fill="#2563eb"/>
      <text x="130" y="144" text-anchor="middle" fill="white" font-size="34" font-family="Arial, sans-serif" font-weight="700">24 H</text>
      <text x="230" y="126" fill="white" font-size="54" font-family="Arial, sans-serif" font-weight="800">BHARAT</text>
      <text x="232" y="162" fill="#bfdbfe" font-size="20" font-family="Arial, sans-serif" font-weight="700" letter-spacing="8">JANKARI</text>
      <rect x="72" y="230" width="200" height="38" rx="19" fill="#dbeafe"/>
      <text x="172" y="255" text-anchor="middle" fill="#1d4ed8" font-size="20" font-family="Arial, sans-serif" font-weight="700" letter-spacing="4">${topic.toUpperCase()}</text>
      <foreignObject x="72" y="300" width="860" height="250">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;font-size:54px;font-weight:800;line-height:1.15;color:white;">
          ${title}
        </div>
      </foreignObject>
      <text x="72" y="590" fill="#cbd5e1" font-size="24" font-family="Arial, sans-serif">Dynamic preview image generated because no article image was available.</text>
      <defs>
        <linearGradient id="bg" x1="64" y1="64" x2="1110" y2="611" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0f172a"/>
          <stop offset="1" stop-color="#1d4ed8"/>
        </linearGradient>
      </defs>
    </svg>
  `.trim();

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

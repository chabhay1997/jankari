import { headers } from "next/headers";

function weatherLabel(code: number) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Weather update";
}

const DEFAULT_LOCATION = {
  latitude: 28.6139,
  longitude: 77.209,
  label: "New Delhi",
};

async function resolveApproximateLocation() {
  try {
    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for") || "";
    const firstIp = forwardedFor.split(",")[0]?.trim();
    const clientIp = firstIp && firstIp !== "::1" && firstIp !== "127.0.0.1" ? firstIp : "";
    const lookupUrl = clientIp ? `https://ipapi.co/${clientIp}/json/` : "https://ipapi.co/json/";
    const response = await fetch(lookupUrl, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const payload = await response.json() as {
      latitude?: number;
      longitude?: number;
      city?: string;
      region?: string;
      country_name?: string;
    };

    const latitude = Number(payload.latitude);
    const longitude = Number(payload.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    const parts = [payload.city, payload.region, payload.country_name].filter(Boolean);
    return {
      latitude,
      longitude,
      label: parts.join(", ") || "Approximate location",
      mode: "approximate" as const,
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitudeParam = Number(searchParams.get("lat"));
  const longitudeParam = Number(searchParams.get("lng"));
  const exactCoordsAvailable = Number.isFinite(latitudeParam) && Number.isFinite(longitudeParam);
  const approximateLocation = exactCoordsAvailable ? null : await resolveApproximateLocation();
  const latitude = exactCoordsAvailable ? latitudeParam : approximateLocation?.latitude ?? DEFAULT_LOCATION.latitude;
  const longitude = exactCoordsAvailable ? longitudeParam : approximateLocation?.longitude ?? DEFAULT_LOCATION.longitude;
  const locationLabel = exactCoordsAvailable
    ? "Nearby"
    : approximateLocation?.label ?? DEFAULT_LOCATION.label;
  const mode = exactCoordsAvailable ? "exact" : approximateLocation ? "approximate" : "default";

  const apiUrl = new URL("https://api.open-meteo.com/v1/forecast");
  apiUrl.searchParams.set("latitude", String(latitude));
  apiUrl.searchParams.set("longitude", String(longitude));
  apiUrl.searchParams.set("current", "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day");
  apiUrl.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
  apiUrl.searchParams.set("timezone", "auto");
  apiUrl.searchParams.set("forecast_days", "1");

  try {
    const response = await fetch(apiUrl.toString(), { cache: "no-store" });
    if (!response.ok) {
      return Response.json({ ok: false, error: "Weather fetch failed." }, { status: 502 });
    }

    const payload = await response.json() as {
      current?: {
        temperature_2m?: number;
        apparent_temperature?: number;
        relative_humidity_2m?: number;
        weather_code?: number;
        wind_speed_10m?: number;
        is_day?: number;
      };
      daily?: {
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
      };
      timezone?: string;
    };

    const code = Number(payload.current?.weather_code ?? -1);
    return Response.json({
      ok: true,
      source: "open-meteo",
      attribution: "Weather data by Open-Meteo.com",
      mode,
      locationLabel,
      current: {
        temperature: payload.current?.temperature_2m ?? null,
        feelsLike: payload.current?.apparent_temperature ?? null,
        humidity: payload.current?.relative_humidity_2m ?? null,
        windSpeed: payload.current?.wind_speed_10m ?? null,
        weatherCode: code,
        isDay: payload.current?.is_day === 1,
        condition: weatherLabel(code),
        high: payload.daily?.temperature_2m_max?.[0] ?? null,
        low: payload.daily?.temperature_2m_min?.[0] ?? null,
        timezone: payload.timezone ?? "auto",
      },
    });
  } catch {
    return Response.json({ ok: false, error: "Unable to load weather." }, { status: 502 });
  }
}

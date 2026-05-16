"use client";

import { useEffect, useState } from "react";

type WeatherResponse = {
  ok: boolean;
  attribution?: string;
  current?: {
    temperature: number | null;
    feelsLike: number | null;
    humidity: number | null;
    windSpeed: number | null;
    condition: string;
    high: number | null;
    low: number | null;
  };
};

export default function CurrentLocationWeatherCard() {
  const initialCoords = (() => {
    if (typeof document === "undefined") {
      return null;
    }
    const choice = document.cookie.split("; ").find((entry) => entry.startsWith("bj_location_choice="))?.split("=")[1];
    const coordsCookie = document.cookie.split("; ").find((entry) => entry.startsWith("bj_location_coords="))?.split("=")[1];
    if (choice !== "allowed" || !coordsCookie) {
      return null;
    }
    const [lat, lng] = decodeURIComponent(coordsCookie).split(",").map((value) => Number(value));
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  })();
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "blocked">(initialCoords ? "loading" : "blocked");
  const [weather, setWeather] = useState<WeatherResponse["current"] | null>(null);
  const [attribution, setAttribution] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!initialCoords) {
      return;
    }

    void fetch(`/api/weather/current?lat=${initialCoords.lat}&lng=${initialCoords.lng}`, { cache: "no-store" })
      .then((response) => response.json() as Promise<WeatherResponse>)
      .then((payload) => {
        if (!payload.ok || !payload.current) {
          setStatus("blocked");
          return;
        }
        setWeather(payload.current);
        setAttribution(payload.attribution || "");
        setStatus("ready");
      })
      .catch(() => setStatus("blocked"));
  }, [initialCoords]);

  function requestWeatherAccess() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }

    setRequesting(true);
    setStatus("loading");
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = Number(position.coords.latitude.toFixed(4));
      const lng = Number(position.coords.longitude.toFixed(4));
      document.cookie = `bj_location_choice=allowed; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`;
      document.cookie = `bj_location_coords=${encodeURIComponent(`${lat},${lng}`)}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`;
      window.dispatchEvent(new CustomEvent("bj:location-updated", {
        detail: { lat, lng },
      }));
      void fetch(`/api/weather/current?lat=${lat}&lng=${lng}`, { cache: "no-store" })
        .then((response) => response.json() as Promise<WeatherResponse>)
        .then((payload) => {
          if (!payload.ok || !payload.current) {
            setStatus("blocked");
            setRequesting(false);
            return;
          }
          setWeather(payload.current);
          setAttribution(payload.attribution || "");
          setStatus("ready");
          setRequesting(false);
        })
        .catch(() => {
          setStatus("blocked");
          setRequesting(false);
        });
    }, () => {
      setStatus("blocked");
      setRequesting(false);
    }, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 300000,
    });
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white/95 p-5 backdrop-blur">
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Weather Near You</p>
      {status === "ready" && weather ? (
        <>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-black text-slate-950">{weather.temperature}°C</p>
              <p className="mt-1 text-sm text-slate-600">{weather.condition}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Feels like {weather.feelsLike}°C</p>
              <p>Wind {weather.windSpeed} km/h</p>
              <p>Humidity {weather.humidity}%</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">High {weather.high}°C, low {weather.low}°C</p>
          {attribution ? <p className="mt-2 text-[11px] text-slate-400">{attribution}</p> : null}
        </>
      ) : status === "loading" ? (
        <p className="mt-3 text-sm text-slate-600">Loading local weather...</p>
      ) : (
        <div className="mt-3">
          <p className="text-sm text-slate-600">Allow location to see current weather for your area.</p>
          <button
            type="button"
            onClick={requestWeatherAccess}
            disabled={requesting}
            className="mt-3 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white disabled:opacity-60"
          >
            {requesting ? "Requesting..." : "Enable weather"}
          </button>
        </div>
      )}
    </div>
  );
}

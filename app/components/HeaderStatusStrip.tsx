import Link from "next/link";
import { useEffect, useState } from "react";
import { HiMoon, HiSparkles, HiSun } from "react-icons/hi";
import IplTodayMiniTicker from "@/app/components/IplTodayMiniTicker";

type WeatherResponse = {
  ok: boolean;
  mode?: "exact" | "approximate" | "default";
  locationLabel?: string;
  current?: {
    temperature: number | null;
    condition: string;
    isDay?: boolean;
  };
};

type WeatherChip = {
  label: string;
  tone: string;
  icon: "sun" | "moon" | "spark";
};

export default function HeaderStatusStrip() {
  function readStoredCoords() {
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
  }

  const [weatherChip, setWeatherChip] = useState<WeatherChip>({
    label: "Weather loading",
    tone: "border-slate-200 bg-slate-50 text-slate-600",
    icon: "spark",
  });

  useEffect(() => {
    let cancelled = false;

    const getWeatherChip = (temperature: number | null, isDay: boolean | undefined): WeatherChip => {
      if (!Number.isFinite(temperature)) {
        return {
          label: "Weather",
          tone: "border-slate-200 bg-slate-50 text-slate-600",
          icon: "spark",
        };
      }

      if ((temperature ?? 0) >= 34) {
        return {
          label: `${temperature}°C`,
          tone: "border-red-200 bg-red-50 text-red-700",
          icon: "sun",
        };
      }

      if ((temperature ?? 0) <= 19) {
        return {
          label: `${temperature}°C`,
          tone: "border-cyan-200 bg-cyan-50 text-cyan-700",
          icon: isDay ? "spark" : "moon",
        };
      }

      return {
        label: `${temperature}°C`,
        tone: isDay ? "border-amber-200 bg-amber-50 text-amber-700" : "border-indigo-200 bg-indigo-50 text-indigo-700",
        icon: isDay ? "sun" : "moon",
      };
    };

    const applyWeather = async (lat?: number, lng?: number) => {
      const query = Number.isFinite(lat) && Number.isFinite(lng) ? `?lat=${lat}&lng=${lng}` : "";
      const response = await fetch(`/api/weather/current${query}`, { cache: "no-store" });
      const payload = await response.json() as WeatherResponse;
      if (!payload.ok || !payload.current) {
        if (!cancelled) {
          setWeatherChip({
            label: "Weather unavailable",
            tone: "border-slate-200 bg-slate-50 text-slate-600",
            icon: "spark",
          });
        }
        return;
      }

      if (!cancelled) {
        setWeatherChip(getWeatherChip(payload.current.temperature, payload.current.isDay));
      }
    };

    const refreshWeather = () => {
      const storedCoords = readStoredCoords();
      if (storedCoords) {
        void applyWeather(storedCoords.lat, storedCoords.lng);
        return;
      }

      void applyWeather();
    };

    window.addEventListener("bj:location-updated", refreshWeather);

    const storedCoords = readStoredCoords();
    if (storedCoords) {
      void applyWeather(storedCoords.lat, storedCoords.lng);
      return () => {
        cancelled = true;
        window.removeEventListener("bj:location-updated", refreshWeather);
      };
    }

    if (typeof navigator !== "undefined" && "permissions" in navigator) {
      void navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (cancelled) {
          return;
        }

        if (result.state === "granted" && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = Number(position.coords.latitude.toFixed(4));
            const lng = Number(position.coords.longitude.toFixed(4));
            document.cookie = `bj_location_choice=allowed; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`;
            document.cookie = `bj_location_coords=${encodeURIComponent(`${lat},${lng}`)}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`;
            void applyWeather(lat, lng);
          }, () => {
            void applyWeather();
          }, {
            enableHighAccuracy: false,
            timeout: 8000,
            maximumAge: 300000,
          });
          return;
        }

        void applyWeather();
      }).catch(() => {
        void applyWeather();
      });
      return () => {
        cancelled = true;
        window.removeEventListener("bj:location-updated", refreshWeather);
      };
    }

    void applyWeather();

    return () => {
      cancelled = true;
      window.removeEventListener("bj:location-updated", refreshWeather);
    };
  }, []);

  const weatherIcon = weatherChip.icon === "sun"
    ? <HiSun size={14} />
    : weatherChip.icon === "moon"
      ? <HiMoon size={14} />
      : <HiSparkles size={14} />;

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <div className={`flex max-w-[190px] items-center gap-2 truncate border px-3 py-2 text-[11px] font-semibold ${weatherChip.tone}`}>
        <span className="shrink-0">{weatherIcon}</span>
        <span className="truncate">{weatherChip.label}</span>
      </div>
      <Link href="/live-scores" className="max-w-[310px]">
        <IplTodayMiniTicker />
      </Link>
    </div>
  );
}

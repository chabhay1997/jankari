import { getSiteData, getStoryImage } from "@/app/lib/siteData";

const INDIA_KEYWORDS = ["india", "indian", "delhi", "mumbai", "kolkata", "bengaluru", "ghaziabad", "parliament", "bcci", "ipl", "rupee"];
const WORLD_KEYWORDS = ["world", "global", "international", "europe", "america", "us ", "usa", "china", "uk", "united nations"];

type FeedStory = {
  title?: string;
  excerpt?: string;
  topic?: string;
  author?: string;
  tags?: string[];
  location?: {
    citySlug?: string;
    stateSlug?: string;
    countrySlug?: string;
    latitude?: number | null;
    longitude?: number | null;
    scope?: string;
  };
};

function storyText(story: FeedStory) {
  return [story.title, story.excerpt, story.topic, story.author].filter(Boolean).join(" ").toLowerCase();
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const deltaLat = toRad(lat2 - lat1);
  const deltaLng = toRad(lng2 - lng1);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(deltaLng / 2) ** 2;
  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreStory(
  story: FeedStory,
  mode: string,
  query: string,
  lat: number | null,
  lng: number | null,
) {
  const text = storyText(story);
  const tags = Array.isArray(story.tags) ? story.tags.join(" ").toLowerCase() : "";
  const citySlug = String(story.location?.citySlug || "").toLowerCase();
  const stateSlug = String(story.location?.stateSlug || "").toLowerCase();
  const countrySlug = String(story.location?.countrySlug || "").toLowerCase();
  let score = 0;

  if (query) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    score += words.reduce((total, word) => total + (text.includes(word) || tags.includes(word) || citySlug.includes(word) || stateSlug.includes(word) || countrySlug.includes(word) ? 5 : 0), 0);
  }

  if (mode === "india") {
    score += INDIA_KEYWORDS.reduce((total, word) => total + (text.includes(word) ? 4 : 0), 0);
    if (countrySlug === "india") {
      score += 12;
    }
  }

  if (mode === "world") {
    score += WORLD_KEYWORDS.reduce((total, word) => total + (text.includes(word) ? 4 : 0), 0);
    if (story.location?.scope === "world") {
      score += 12;
    }
    if (text.includes("international")) {
      score += 3;
    }
  }

  if (mode === "nearby") {
    const nearIndia = lat !== null && lng !== null && lat >= 6 && lat <= 38 && lng >= 68 && lng <= 98;
    score += INDIA_KEYWORDS.reduce((total, word) => total + (text.includes(word) ? 3 : 0), 0);
    if (nearIndia && ["travel", "business", "politics", "health"].includes(story.topic || "")) {
      score += 6;
    }
    if (!nearIndia && WORLD_KEYWORDS.some((word) => text.includes(word))) {
      score += 4;
    }
    if (
      lat !== null
      && lng !== null
      && typeof story.location?.latitude === "number"
      && typeof story.location?.longitude === "number"
    ) {
      const distance = distanceKm(lat, lng, story.location.latitude, story.location.longitude);
      if (distance <= 25) score += 20;
      else if (distance <= 75) score += 14;
      else if (distance <= 200) score += 10;
      else if (distance <= 600) score += 4;
    }
  }

  if (mode === "business" && ["business", "money", "trading", "markets", "finance"].includes(story.topic || "")) {
    score += 8;
  }

  if (mode === "health" && ["health", "mental-health", "nutrition-diet", "physical-fitness"].includes(story.topic || "")) {
    score += 8;
  }

  return score;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10) || 0, 0);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "6", 10) || 6, 1), 12);
  const mode = String(searchParams.get("mode") || "latest").trim().toLowerCase();
  const query = String(searchParams.get("query") || "").trim();
  const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : null;
  const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : null;
  const siteData = await getSiteData();
  const rawStories = siteData.stories ?? [];
  const filteredStories = query || mode !== "latest"
    ? [...rawStories]
      .map((story) => ({
        ...story,
        _score: scoreStory(story, mode, query, lat, lng),
      }))
      .filter((story) => story._score > 0 || mode === "latest")
      .sort((left, right) => right._score - left._score)
    : rawStories;
  const stories = filteredStories.map((story) => ({
    ...story,
    image: getStoryImage(story),
  }));
  const items = stories.slice(offset, offset + limit);

  return Response.json({
    items,
    nextOffset: offset + items.length,
    hasMore: offset + items.length < stories.length,
  });
}

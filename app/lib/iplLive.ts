export type MatchInfo = {
  name?: string;
  short_title?: string;
  t1?: string;
  t2?: string;
  t1abbr?: string;
  t2abbr?: string;
  t1s?: string;
  t2s?: string;
  status_str?: string;
  status_text?: string;
  date_time_gmt_format?: string;
  date_time_gmt?: string;
  venue?: string;
  url?: string;
  sort_start_time?: number;
};

export type IplPayload = {
  live: {
    title: string;
    status: string;
    score: string;
    summary: string;
  };
  nextMatch: {
    title: string;
    matchTime: string;
    venue: string;
    note: string;
    href?: string;
    shortTitle?: string;
    scoreLine?: string;
    isToday?: boolean;
  };
  source: string;
  liveEnabled: boolean;
  todayMatches: Array<{
    title: string;
    shortTitle: string;
    matchTime: string;
    venue: string;
    status: string;
    summary: string;
    scoreLine: string;
    href?: string;
    isToday: boolean;
  }>;
};

export const fallbackIplPayload: IplPayload = {
  live: {
    title: "IPL Match Center",
    status: "Schedule source unavailable",
    score: "Official schedule pending",
    summary: "We could not load the official IPL fixtures right now.",
  },
  nextMatch: {
    title: "Next IPL Match",
    matchTime: "Schedule source pending",
    venue: "Venue pending",
    note: "Official IPL fixture data could not be loaded at the moment.",
    shortTitle: "IPL",
    scoreLine: "",
    isToday: false,
  },
  source: "fallback",
  liveEnabled: false,
  todayMatches: [],
};

function parseMatches(html: string) {
  const rawMatches = [...html.matchAll(/data-info='([^']+)'/g)].map((entry) => entry[1]);
  return rawMatches
    .map((entry) => {
      try {
        return JSON.parse(entry) as MatchInfo;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is MatchInfo => Boolean(entry));
}

function getIstDateKeyFromUnix(timestampSeconds: number) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestampSeconds * 1000));
}

export async function fetchIplLiveData() {
  try {
    const response = await fetch("https://www.ipl.com/series/indian-premier-league-2026-129908/matches", {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 BharatJankariBot/1.0",
      },
    });

    if (!response.ok) {
      return fallbackIplPayload;
    }

    const html = await response.text();
    const matches = parseMatches(html)
      .filter((entry) => Number.isFinite(entry.sort_start_time))
      .sort((left, right) => Number(left.sort_start_time) - Number(right.sort_start_time));

    const now = Math.floor(Date.now() / 1000);
    const todayKey = getIstDateKeyFromUnix(now);
    const todayMatches = matches.filter((entry) => getIstDateKeyFromUnix(Number(entry.sort_start_time)) === todayKey);
    const liveOrStartedToday = todayMatches.find((entry) => {
      const teamOneScore = String(entry.t1s || "").trim();
      const teamTwoScore = String(entry.t2s || "").trim();
      return Boolean(teamOneScore || teamTwoScore) || !["Scheduled", "Upcoming"].includes(String(entry.status_str || ""));
    });
    const selectedMatch = liveOrStartedToday
      || todayMatches.find((entry) => Number(entry.sort_start_time) >= now)
      || todayMatches[0]
      || matches.find((entry) => Number(entry.sort_start_time) >= now)
      || matches[0];

    if (!selectedMatch) {
      return fallbackIplPayload;
    }

    const teamOneScore = String(selectedMatch.t1s || "").trim();
    const teamTwoScore = String(selectedMatch.t2s || "").trim();
    const hasScore = Boolean(teamOneScore || teamTwoScore);
    const shortTitle = selectedMatch.short_title
      ? selectedMatch.short_title.replace(/\s+vs\s+/i, "/")
      : `${selectedMatch.t1abbr || "T1"}/${selectedMatch.t2abbr || "T2"}`;
    const isToday = getIstDateKeyFromUnix(Number(selectedMatch.sort_start_time)) === todayKey;
    const scoreLine = hasScore
      ? `${selectedMatch.t1abbr || "T1"} ${teamOneScore || "-"} · ${selectedMatch.t2abbr || "T2"} ${teamTwoScore || "-"}`
      : shortTitle;

    const normalizedTodayMatches = todayMatches.map((entry) => {
      const currentTeamOneScore = String(entry.t1s || "").trim();
      const currentTeamTwoScore = String(entry.t2s || "").trim();
      const currentShortTitle = entry.short_title
        ? entry.short_title.replace(/\s+vs\s+/i, "/")
        : `${entry.t1abbr || "T1"}/${entry.t2abbr || "T2"}`;
      const currentScoreLine = currentTeamOneScore || currentTeamTwoScore
        ? `${entry.t1abbr || "T1"} ${currentTeamOneScore || "-"} · ${entry.t2abbr || "T2"} ${currentTeamTwoScore || "-"}`
        : currentShortTitle;

      return {
        title: entry.name || "IPL Match",
        shortTitle: currentShortTitle,
        matchTime: entry.date_time_gmt_format || entry.date_time_gmt || "Time unavailable",
        venue: entry.venue || "Venue unavailable",
        status: entry.status_str || "Scheduled",
        summary: entry.status_text || "Official IPL fixture from the schedule.",
        scoreLine: currentScoreLine,
        href: entry.url ? `https://www.ipl.com${entry.url}` : undefined,
        isToday: true,
      };
    });

    return {
      live: {
        title: isToday ? "Today's IPL Match" : "IPL Match Center",
        status: selectedMatch.status_str || "Scheduled",
        score: scoreLine,
        summary: selectedMatch.status_text || "Official IPL fixture from the schedule.",
      },
      nextMatch: {
        title: selectedMatch.name || "IPL Match",
        matchTime: selectedMatch.date_time_gmt_format || selectedMatch.date_time_gmt || "Time unavailable",
        venue: selectedMatch.venue || "Venue unavailable",
        note: isToday ? "Today from official IPL schedule" : "Official IPL schedule",
        href: selectedMatch.url ? `https://www.ipl.com${selectedMatch.url}` : undefined,
        shortTitle,
        scoreLine,
        isToday,
      },
      source: "ipl.com",
      liveEnabled: hasScore,
      todayMatches: normalizedTodayMatches,
    } satisfies IplPayload;
  } catch {
    return fallbackIplPayload;
  }
}

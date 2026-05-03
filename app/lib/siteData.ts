import { cache } from "react";

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  badgeRed?: boolean;
  dropdown?: NavChildItem[];
}

export interface NavChildItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  href: string;
}

export interface ServiceLink {
  label: string;
  href: string;
}

export interface CategoryLink {
  label: string;
  href: string;
  badge?: string;
  red?: boolean;
}

export interface StoryCard {
  id: number | string;
  slug: string;
  title: string;
  image: string;
  author: string;
  topic: string;
  excerpt?: string;
}

export interface Topic {
  slug: string;
  label: string;
  description: string;
}

export interface SiteData {
  navItems: NavItem[];
  socialLinks: SocialLink[];
  services: ServiceLink[];
  hero: {
    hotCategories: CategoryLink[][];
    entertainmentCategories: CategoryLink[][];
    popularStories: StoryCard[];
    editorsPick: StoryCard[];
  };
  home: {
    featuredTopic: Topic;
    featuredStories: StoryCard[];
    trendingStories: StoryCard[];
  };
  footer: {
    usefulLinks: ServiceLink[];
    editorsPicks: StoryCard[];
    latestArticles: StoryCard[];
    bottomLinks: ServiceLink[];
  };
  topics: Topic[];
  stories: StoryCard[];
}

export function getTopicHref(slug: string) {
  if (slug === "home") {
    return "/";
  }
  return `/topics/${slug}`;
}

export function getStoryHref(slug: string) {
  return `/stories/${slug}`;
}

const topics: Topic[] = [
  { slug: "home", label: "Home", description: "Fresh stories and essential reading from Bharat Jankari." },
  { slug: "lifestyle", label: "Life Style", description: "Wellness, routines, shopping, and practical lifestyle ideas." },
  { slug: "esports", label: "Esports", description: "Competitive gaming coverage, trends, and player stories." },
  { slug: "food", label: "Food", description: "Recipes, food culture, ingredients, and dining insights." },
  { slug: "entertainment", label: "Entertainment", description: "Celebrity, film, music, OTT, and pop culture updates." },
  { slug: "health", label: "Health", description: "Fitness, nutrition, mental health, and everyday care." },
  { slug: "money", label: "Money", description: "Personal finance, savings, business, and market explainers." },
  { slug: "travel", label: "Travel", description: "Destinations, guides, practical itineraries, and travel trends." },
  { slug: "tech", label: "Tech", description: "AI, gadgets, software, startups, and digital culture." },
  { slug: "politics", label: "Politics", description: "Policy, government, and election coverage in context." },
  { slug: "european-union", label: "European Union", description: "European policy and business developments." },
  { slug: "sport", label: "Sport", description: "Sports stories, fixtures, and commentary." },
  { slug: "covid-19", label: "Covid-19", description: "Public-health updates and long-tail pandemic reporting." },
  { slug: "city-business", label: "City & Business", description: "Urban growth, business shifts, and local economies." },
  { slug: "personal-finance", label: "Personal Finance", description: "Money habits, retirement, and financial planning." },
  { slug: "tv-radio", label: "TV & Radio", description: "Broadcast programming, anchors, and show highlights." },
  { slug: "gaming", label: "Gaming", description: "Games, releases, streams, and industry analysis." },
  { slug: "films-review", label: "Films Review", description: "Reviews, trailers, and movie commentary." },
  { slug: "celebrity-news", label: "Celebrity News", description: "Star interviews, fashion, and headline moments." },
  { slug: "hot-music", label: "Hot Music", description: "New music, streaming charts, and artist news." },
];

const stories: StoryCard[] = [
  {
    id: 1,
    slug: "vintage-in-vogue-fashion-trends",
    title: "Vintage in vogue: Latest fashion trends aren't new at all",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=260&fit=crop",
    author: "Bharat Jankari Desk",
    topic: "lifestyle",
    excerpt: "Luxury travel may be back, but fashion is looking backward for silhouettes, fabrics, and styling cues that still feel fresh.",
  },
  {
    id: 2,
    slug: "living-in-the-moment-everyday-habits",
    title: "5 tips for living in the moment and embracing short-term joy",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=260&fit=crop",
    author: "Bharat Jankari Desk",
    topic: "lifestyle",
    excerpt: "Small resets, slower routines, and honest boundaries can make daily life feel less rushed and more intentional.",
  },
  {
    id: 3,
    slug: "why-car-shopping-feels-bizarre-now",
    title: "Why car shopping is so bizarre in the United States",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=260&fit=crop",
    author: "Bharat Jankari Desk",
    topic: "money",
    excerpt: "Inventory swings, financing costs, and aggressive dealer tactics are changing how buyers approach the market.",
  },
  {
    id: 4,
    slug: "summer-2000s-fashion-trend-return",
    title: "Summer 2022 fashion trends are giving off that early 2000s vibe",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=260&fit=crop",
    author: "Bharat Jankari Desk",
    topic: "lifestyle",
    excerpt: "Cargo cuts, glossy accessories, and nostalgic palettes are back in rotation with a cleaner modern finish.",
  },
  {
    id: 5,
    slug: "passive-income-ideas-with-15000",
    title: "Want passive income? Invest $15,000 in these long-view ideas",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&h=80&fit=crop",
    author: "Markets Team",
    topic: "money",
    excerpt: "A patient mix of index exposure, income assets, and disciplined timing can do more than chasing a hot tip.",
  },
  {
    id: 6,
    slug: "real-estate-agent-homebuying-lessons",
    title: "Do you need a real estate agent? How this homebuyer got clarity",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&h=80&fit=crop",
    author: "Property Desk",
    topic: "money",
    excerpt: "For first-time buyers, knowing when to bring in an expert can shape the full deal, not just the final paperwork.",
  },
  {
    id: 7,
    slug: "remote-work-freedom-and-location-shifts",
    title: "Remote work has given us freedom to live and work anywhere",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=120&h=80&fit=crop",
    author: "Worklife Desk",
    topic: "tech",
    excerpt: "Hybrid careers are changing where people settle, what they value in cities, and how teams stay aligned.",
  },
  {
    id: 8,
    slug: "probiotic-skin-care-explained",
    title: "Does probiotic skin care work? Products, uses, and more",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=120&h=80&fit=crop",
    author: "Health Desk",
    topic: "health",
    excerpt: "The science is still evolving, but barrier support and microbiome language are shaping a new beauty category.",
  },
  {
    id: 9,
    slug: "world-health-day-practical-doctor-advice",
    title: "World Health Day: Doctors share the habits that matter most",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=120&h=80&fit=crop",
    author: "Health Desk",
    topic: "health",
    excerpt: "The basics still win: sleep, movement, food quality, and earlier check-ins before symptoms become routine.",
  },
  {
    id: 10,
    slug: "low-waste-lifestyle-earth-day",
    title: "Tips to start a low-waste lifestyle and make Earth Day last longer",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=120&h=80&fit=crop",
    author: "Climate Desk",
    topic: "lifestyle",
    excerpt: "Reusable systems only stick when they are cheaper, easier, and already part of your weekly rhythm.",
  },
  {
    id: 11,
    slug: "celeb-fashion-party-style-watch",
    title: "Celeb fashion: Ananya Panday and Kriti Sanon party in style",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=130&fit=crop",
    author: "Entertainment Desk",
    topic: "celebrity-news",
    excerpt: "The week’s party circuit leaned on polished monochrome looks with sharp tailoring and playful texture shifts.",
  },
  {
    id: 12,
    slug: "esports-retirement-age-problem",
    title: "Esports players retire extremely young these days. It's not why you think",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=130&fit=crop",
    author: "Esports Desk",
    topic: "esports",
    excerpt: "Burnout, support systems, and unstable career ladders matter as much as reflexes in early exits from pro play.",
  },
  {
    id: 13,
    slug: "travel-picks-with-global-demand-return",
    title: "With international travel picking up, here are the most popular escapes",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=130&fit=crop",
    author: "Travel Desk",
    topic: "travel",
    excerpt: "Demand is clustering around visa-light itineraries, shoulder-season deals, and places built for longer stays.",
  },
  {
    id: 14,
    slug: "retire-early-investment-experts-view",
    title: "How to retire early? Investment experts on what actually moves the needle",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=130&fit=crop",
    author: "Finance Desk",
    topic: "personal-finance",
    excerpt: "Income growth, cost discipline, and realistic withdrawal plans beat any one-off strategy every time.",
  },
  {
    id: 15,
    slug: "simple-yoga-poses-to-fix-posture",
    title: "Fitness alert: Count on these simple yoga poses to help fix your posture",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=80&h=80&fit=crop",
    author: "Health Desk",
    topic: "health",
    excerpt: "A few repeatable stretches can undo long desk days and make movement feel easier again.",
  },
  {
    id: 16,
    slug: "food-climate-charts-explained",
    title: "Five charts that show why our food is not ready for the climate shift",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=80&h=80&fit=crop",
    author: "Food Desk",
    topic: "food",
    excerpt: "Supply chains, heat stress, and water risk are reshaping what resilience means in agriculture.",
  },
  {
    id: 17,
    slug: "tech-companies-return-to-office-strategy",
    title: "How tech companies are trying to woo employees returning to work after the pandemic",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=80&fit=crop",
    author: "Tech Desk",
    topic: "tech",
    excerpt: "Perks alone are not enough; flexibility, team rituals, and commute tradeoffs are driving the conversation.",
  },
  {
    id: 18,
    slug: "celeb-instagram-style-roundup",
    title: "The most stylish celeb Instagram looks you missed this week",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=80&fit=crop",
    author: "Entertainment Desk",
    topic: "celebrity-news",
    excerpt: "From tonal tailoring to off-duty denim, the strongest looks felt wearable instead of overbuilt.",
  },
  {
    id: 19,
    slug: "netflix-summer-movie-slate-preview",
    title: "Netflix's summer movie slate is full of star power and risk",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&h=80&fit=crop",
    author: "Entertainment Desk",
    topic: "entertainment",
    excerpt: "The platform is doubling down on recognizable talent while still trying to mint the next breakout franchise.",
  },
  {
    id: 20,
    slug: "music-streamers-and-all-in-one-systems",
    title: "New issue of What Hi-Fi? out now: music streamers, all-in-one systems and more",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=120&h=80&fit=crop",
    author: "Tech Desk",
    topic: "hot-music",
    excerpt: "Audio buyers are leaning toward cleaner setups with fewer boxes and smarter control surfaces.",
  },
];

export const fallbackSiteData: SiteData = {
  navItems: [
    { label: "HOME", href: "/" },
    {
      label: "LIFE STYLE",
      href: getTopicHref("lifestyle"),
      dropdown: [
        { label: "Advice", href: getStoryHref("living-in-the-moment-everyday-habits") },
        { label: "Shopping", href: getStoryHref("vintage-in-vogue-fashion-trends") },
        { label: "Style", href: getStoryHref("summer-2000s-fashion-trend-return") },
        { label: "All", href: getTopicHref("lifestyle") },
      ],
    },
    { label: "ESPORTS", href: getTopicHref("esports") },
    { label: "FOOD", href: getTopicHref("food") },
    {
      label: "ENTERTAINMENT",
      href: getTopicHref("entertainment"),
      badge: "HOT",
      badgeRed: true,
      dropdown: [
        { label: "TV & Radio", href: getTopicHref("tv-radio") },
        { label: "Celebrity News", href: getTopicHref("celebrity-news") },
        { label: "Gaming", href: getTopicHref("gaming") },
        { label: "Films Review", href: getTopicHref("films-review") },
      ],
    },
    { label: "HEALTH", href: getTopicHref("health") },
    { label: "MONEY", href: getTopicHref("money") },
    { label: "TRAVEL", href: getTopicHref("travel") },
    { label: "TECH", href: getTopicHref("tech") },
  ],
  socialLinks: [
    { platform: "facebook", href: "https://facebook.com" },
    { platform: "x", href: "https://x.com" },
    { platform: "instagram", href: "https://instagram.com" },
    { platform: "youtube", href: "https://youtube.com" },
    { platform: "email", href: "/contact-us" },
  ],
  services: [
    { label: "Live Schedule", href: getTopicHref("sport") },
    { label: "Newsletter", href: "/contact-us" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  hero: {
    hotCategories: [
      [
        { label: "Politics", href: getTopicHref("politics") },
        { label: "European Union", href: getTopicHref("european-union") },
        { label: "Sport", href: getTopicHref("sport"), badge: "DAILY" },
      ],
      [
        { label: "Covid-19", href: getTopicHref("covid-19"), badge: "HOT", red: true },
        { label: "City & Business", href: getTopicHref("city-business") },
        { label: "Personal Finance", href: getTopicHref("personal-finance") },
      ],
    ],
    entertainmentCategories: [
      [
        { label: "TV & Radio", href: getTopicHref("tv-radio") },
        { label: "Gaming", href: getTopicHref("gaming") },
        { label: "Films Review", href: getTopicHref("films-review"), badge: "HOT", red: true },
      ],
      [
        { label: "Celebrity News", href: getTopicHref("celebrity-news") },
        { label: "Hot Music", href: getTopicHref("hot-music"), badge: "HOT", red: true },
        { label: "Esports", href: getTopicHref("esports") },
      ],
    ],
    popularStories: stories.slice(7, 11),
    editorsPick: stories.slice(10, 14),
  },
  home: {
    featuredTopic: topics.find((topic) => topic.slug === "lifestyle")!,
    featuredStories: stories.slice(0, 4),
    trendingStories: stories.slice(4, 7),
  },
  footer: {
    usefulLinks: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Entertainment", href: getTopicHref("entertainment") },
      { label: "Technology", href: getTopicHref("tech") },
      { label: "Trending Now", href: getTopicHref("money") },
      { label: "Help & Support", href: "/contact-us" },
    ],
    editorsPicks: [stories[14], stories[12], stories[15]],
    latestArticles: [stories[16], stories[17], stories[18], stories[19]],
    bottomLinks: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about-us" },
      { label: "Contact", href: "/contact-us" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
  topics,
  stories,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function withFallbackArray<T>(primary: T[] | undefined, fallbackValue: T[]) {
  return primary && primary.length > 0 ? primary : fallbackValue;
}

function withMinimumArray<T>(primary: T[] | undefined, fallbackValue: T[], minimumLength: number) {
  return primary && primary.length >= minimumLength ? primary : fallbackValue;
}

function mergeSiteData(remote: Partial<SiteData> | null | undefined): SiteData {
  if (!remote) {
    return fallbackSiteData;
  }

  return {
    navItems: withMinimumArray(remote.navItems, fallbackSiteData.navItems, fallbackSiteData.navItems.length),
    socialLinks: withFallbackArray(remote.socialLinks, fallbackSiteData.socialLinks),
    services: withFallbackArray(remote.services, fallbackSiteData.services),
    hero: {
      hotCategories: withFallbackArray(remote.hero?.hotCategories, fallbackSiteData.hero.hotCategories),
      entertainmentCategories: withFallbackArray(remote.hero?.entertainmentCategories, fallbackSiteData.hero.entertainmentCategories),
      popularStories: withFallbackArray(remote.hero?.popularStories, fallbackSiteData.hero.popularStories),
      editorsPick: withFallbackArray(remote.hero?.editorsPick, fallbackSiteData.hero.editorsPick),
    },
    home: {
      featuredTopic: remote.home?.featuredTopic && remote.home.featuredTopic.slug !== "home"
        ? remote.home.featuredTopic
        : fallbackSiteData.home.featuredTopic,
      featuredStories: withFallbackArray(remote.home?.featuredStories, fallbackSiteData.home.featuredStories),
      trendingStories: withFallbackArray(remote.home?.trendingStories, fallbackSiteData.home.trendingStories),
    },
    footer: {
      usefulLinks: withFallbackArray(remote.footer?.usefulLinks, fallbackSiteData.footer.usefulLinks),
      editorsPicks: withFallbackArray(remote.footer?.editorsPicks, fallbackSiteData.footer.editorsPicks),
      latestArticles: withFallbackArray(remote.footer?.latestArticles, fallbackSiteData.footer.latestArticles),
      bottomLinks: withFallbackArray(remote.footer?.bottomLinks, fallbackSiteData.footer.bottomLinks),
    },
    topics: withMinimumArray(remote.topics, fallbackSiteData.topics, 3),
    stories: withFallbackArray(remote.stories, fallbackSiteData.stories),
  };
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const payload = (await res.json()) as { data?: T };
    return payload.data ?? null;
  } catch {
    return null;
  }
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  const remote = await fetchJson<Partial<SiteData>>("/api/site-data");
  return mergeSiteData(remote);
});

export const getStoryBySlug = cache(async (slug: string) => {
  const remoteStory = await fetchJson<{
    _id?: string;
    slug: string;
    title: string;
    imageUrl?: string;
    image?: string;
    author?: string;
    categorySlug?: string;
    shortDesc?: string;
    metaDescription?: string;
    content?: string;
    section?: string;
  }>(`/api/posts/slug/${slug}`);

  if (remoteStory) {
    return {
      id: remoteStory._id || slug,
      slug: remoteStory.slug,
      title: remoteStory.title,
      image: remoteStory.imageUrl || remoteStory.image || "",
      author: remoteStory.author || "Bharat Jankari Desk",
      topic: remoteStory.categorySlug || "general",
      excerpt: remoteStory.shortDesc || remoteStory.metaDescription || "",
      content: remoteStory.content || "",
      section: remoteStory.section || "",
    };
  }

  const data = await getSiteData();
  return data.stories.find((story) => story.slug === slug) ?? null;
});

export const getTopicBySlug = cache(async (slug: string) => {
  const remoteTopic = await fetchJson<{ topic: Topic }>(`/api/topics/${slug}`);

  if (remoteTopic?.topic) {
    return remoteTopic.topic;
  }

  const data = await getSiteData();
  return data.topics.find((topic) => topic.slug === slug) ?? null;
});

export const getTopicStories = cache(async (slug: string) => {
  const remoteTopic = await fetchJson<{ topic: Topic; stories: StoryCard[] }>(`/api/topics/${slug}`);
  return remoteTopic?.stories ?? null;
});

export { mergeSiteData };

const TOPIC_SLUG_ALIASES: Record<string, string> = {
  political: "politics",
};

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
  createdAt?: string;
  section?: string;
}

export interface Topic {
  slug: string;
  label: string;
  description: string;
}

export interface TopicPageData {
  topic: Topic;
  stories: StoryCard[];
  requestedTopicSlug?: string;
  usedFallbackStories?: boolean;
}

interface RemoteTopicRecord {
  slug?: string;
  label?: string;
  description?: string;
  navLabel?: string;
  showInNavigation?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export interface SiteData {
  navItems: NavItem[];
  socialLinks: SocialLink[];
  services: ServiceLink[];
  topicGroups?: Record<string, string[]>;
  navPreviewMap?: Record<string, {
    topicSlug: string;
    topicLabel: string;
    stories: StoryCard[];
  }>;
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

const emptySiteData: SiteData = {
  navItems: [],
  socialLinks: [],
  services: [],
  topicGroups: {},
  navPreviewMap: {},
  hero: {
    hotCategories: [[], []],
    entertainmentCategories: [[], []],
    popularStories: [],
    editorsPick: [],
  },
  home: {
    featuredTopic: { slug: "home", label: "Home", description: "Fresh stories and essential reading from Bharat Jankari." },
    featuredStories: [],
    trendingStories: [],
  },
  footer: {
    usefulLinks: [],
    editorsPicks: [],
    latestArticles: [],
    bottomLinks: [],
  },
  topics: [],
  stories: [],
};

function titleFromSlug(slug: string) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeTopicSlug(slug: string) {
  const normalized = String(slug || "").trim().toLowerCase();
  return TOPIC_SLUG_ALIASES[normalized] || normalized;
}

export function getTopicHref(slug: string) {
  const normalizedSlug = normalizeTopicSlug(slug);

  if (normalizedSlug === "home") {
    return "/";
  }
  return `/topics/${normalizedSlug}`;
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
  { slug: "political", label: "Political", description: "Government, policy, elections, and public affairs coverage." },
  { slug: "business", label: "Business", description: "Markets, companies, startups, and economy explainers." },
  { slug: "trading", label: "Trading", description: "Stocks, crypto, forex, and trading analysis updates." },
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
  { slug: "physical-fitness", label: "Physical Fitness", description: "Workouts, movement plans, and active living." },
  { slug: "nutrition-diet", label: "Nutrition & Diet", description: "Healthy eating, nutrition guides, and food balance." },
  { slug: "mental-health", label: "Mental Health", description: "Mindset, stress care, and emotional wellbeing." },
  { slug: "home-remedies", label: "Home Remedies", description: "Natural care, everyday fixes, and traditional advice." },
  { slug: "diseases-care", label: "Diseases & Care", description: "Condition explainers, prevention, and care support." },
  { slug: "womens-health", label: "Women's Health", description: "Women-focused health guidance and awareness." },
  { slug: "fps", label: "FPS", description: "First-person shooter esports coverage." },
  { slug: "moba", label: "MOBA", description: "Multiplayer online battle arena updates and analysis." },
  { slug: "battle-royale", label: "Battle Royale", description: "Battle royale tournaments, teams, and highlights." },
  { slug: "sports-sim", label: "Sports Sim", description: "Sports simulation gaming and esports coverage." },
  { slug: "fighting", label: "Fighting", description: "Fighting game scene coverage and match breakdowns." },
  { slug: "strategy", label: "Strategy", description: "Strategy game tournaments and competitive meta shifts." },
  { slug: "mobile", label: "Mobile", description: "Mobile esports, releases, and player trends." },
  { slug: "elections", label: "Elections", description: "Election campaigns, polling, and results analysis." },
  { slug: "parliament", label: "Parliament", description: "Parliament proceedings and legislative updates." },
  { slug: "policy", label: "Policy", description: "Policy explainers and governance decisions." },
  { slug: "governance", label: "Governance", description: "Government administration and public systems reporting." },
  { slug: "courts", label: "Courts", description: "Court rulings, legal matters, and judicial coverage." },
  { slug: "international", label: "International", description: "Global affairs and diplomatic developments." },
  { slug: "economy", label: "Economy", description: "Macroeconomics, inflation, growth, and public finance." },
  { slug: "movies", label: "Movies", description: "Film news, trailers, and movie releases." },
  { slug: "tv", label: "TV", description: "Television stories, shows, and highlights." },
  { slug: "music", label: "Music", description: "Music releases, trends, and artist updates." },
  { slug: "celebrity", label: "Celebrity", description: "Celebrity updates, interviews, and style watch." },
  { slug: "web-series", label: "Web Series", description: "Streaming series coverage and reviews." },
  { slug: "ott", label: "OTT", description: "OTT releases, platforms, and viewing trends." },
  { slug: "reviews", label: "Reviews", description: "Reviews and verdicts across entertainment releases." },
  { slug: "ai", label: "AI", description: "Artificial intelligence tools, policy, and product coverage." },
  { slug: "gadgets", label: "Gadgets", description: "Devices, launches, and hands-on gadget news." },
  { slug: "software", label: "Software", description: "Apps, platforms, and software product updates." },
  { slug: "startups", label: "Startups", description: "Startup launches, fundraising, and founder stories." },
  { slug: "cybersecurity", label: "Cybersecurity", description: "Security alerts, privacy, and cyber risk coverage." },
  { slug: "web", label: "Web", description: "Internet culture, platforms, and web product shifts." },
  { slug: "markets", label: "Markets", description: "Market moves, sentiment, and daily trends." },
  { slug: "companies", label: "Companies", description: "Corporate news, earnings, and company strategies." },
  { slug: "finance", label: "Finance", description: "Finance sector updates and money explainers." },
  { slug: "real-estate", label: "Real Estate", description: "Property trends, housing, and real-estate advice." },
  { slug: "destinations", label: "Destinations", description: "Destination inspiration and place guides." },
  { slug: "guides", label: "Guides", description: "Travel planning guides and itineraries." },
  { slug: "hotels", label: "Hotels", description: "Hotel reviews, stays, and booking trends." },
  { slug: "culture", label: "Culture", description: "Culture-focused travel and local discovery." },
  { slug: "adventure", label: "Adventure", description: "Adventure travel and outdoor activity stories." },
  { slug: "tips", label: "Tips", description: "Practical travel tips and hacks." },
  { slug: "stocks", label: "Stocks", description: "Stock market coverage and trading ideas." },
  { slug: "crypto", label: "Crypto", description: "Crypto market updates and digital asset coverage." },
  { slug: "commodities", label: "Commodities", description: "Commodity prices, analysis, and outlooks." },
  { slug: "forex", label: "Forex", description: "Foreign exchange moves and market analysis." },
  { slug: "derivatives", label: "Derivatives", description: "Derivative markets, futures, and options coverage." },
  { slug: "charts", label: "Charts", description: "Technical charts, setups, and trend analysis." },
  { slug: "news", label: "News", description: "Breaking market and sector news." },
];

const TOPIC_CHILDREN: Record<string, string[]> = {
  lifestyle: [
    "lifestyle",
  ],
  esports: [
    "esports",
    "fps",
    "moba",
    "battle-royale",
    "sports-sim",
    "fighting",
    "strategy",
    "mobile",
    "gaming",
  ],
  food: [
    "food",
  ],
  entertainment: [
    "entertainment",
    "movies",
    "tv",
    "music",
    "celebrity",
    "web-series",
    "ott",
    "reviews",
    "tv-radio",
    "celebrity-news",
    "films-review",
    "hot-music",
  ],
  political: [
    "political",
    "politics",
    "elections",
    "parliament",
    "policy",
    "governance",
    "courts",
    "international",
    "economy",
  ],
  politics: [
    "politics",
    "political",
    "elections",
    "parliament",
    "policy",
    "governance",
    "courts",
    "international",
    "economy",
  ],
  health: [
    "health",
    "physical-fitness",
    "nutrition-diet",
    "mental-health",
    "home-remedies",
    "diseases-care",
    "lifestyle",
    "womens-health",
  ],
  money: [
    "money",
    "personal-finance",
  ],
  tech: [
    "tech",
    "technology",
    "ai",
    "gadgets",
    "software",
    "startups",
    "cybersecurity",
    "web",
  ],
  business: [
    "business",
    "markets",
    "companies",
    "finance",
    "real-estate",
    "economy",
  ],
  travel: [
    "travel",
    "destinations",
    "guides",
    "hotels",
    "culture",
    "adventure",
    "tips",
  ],
  trading: [
    "trading",
    "stocks",
    "crypto",
    "commodities",
    "forex",
    "derivatives",
    "charts",
    "news",
  ],
};

const CHILD_TOPIC_PARENTS: Record<string, string[]> = {
  "physical-fitness": ["health"],
  "nutrition-diet": ["health"],
  "mental-health": ["health"],
  "home-remedies": ["health"],
  "diseases-care": ["health"],
  "lifestyle": ["lifestyle", "health"],
  "womens-health": ["health"],
  fps: ["esports"],
  moba: ["esports"],
  "battle-royale": ["esports"],
  "sports-sim": ["esports"],
  fighting: ["esports"],
  strategy: ["esports"],
  mobile: ["esports", "tech"],
  gaming: ["esports"],
  movies: ["entertainment"],
  tv: ["entertainment"],
  music: ["entertainment"],
  celebrity: ["entertainment"],
  "web-series": ["entertainment"],
  ott: ["entertainment"],
  reviews: ["entertainment"],
  "tv-radio": ["entertainment"],
  "celebrity-news": ["entertainment"],
  "films-review": ["entertainment"],
  "hot-music": ["entertainment"],
  elections: ["politics"],
  parliament: ["politics"],
  policy: ["politics", "business"],
  governance: ["politics"],
  courts: ["politics"],
  international: ["politics"],
  economy: ["politics", "business"],
  "personal-finance": ["money"],
  markets: ["business"],
  companies: ["business"],
  finance: ["business"],
  "real-estate": ["business"],
  startups: ["business", "tech"],
  stocks: ["trading"],
  crypto: ["trading"],
  commodities: ["trading"],
  forex: ["trading"],
  derivatives: ["trading"],
  charts: ["trading"],
  news: ["trading"],
  ai: ["tech"],
  gadgets: ["tech"],
  software: ["tech"],
  cybersecurity: ["tech"],
  web: ["tech"],
  destinations: ["travel"],
  guides: ["travel"],
  hotels: ["travel"],
  food: ["food", "travel"],
  culture: ["travel"],
  adventure: ["travel"],
  tips: ["travel"],
};

function getChildTopicSlugs(slug: string) {
  const normalizedSlug = normalizeTopicSlug(slug);
  return TOPIC_CHILDREN[normalizedSlug] || [normalizedSlug];
}

function hasChildTopics(
  slug: string,
  topicGroups?: Record<string, string[]>,
) {
  const normalizedSlug = normalizeTopicSlug(slug);
  const backendChildren = topicGroups?.[normalizedSlug]?.map(normalizeTopicSlug) ?? [];
  const localChildren = TOPIC_CHILDREN[normalizedSlug]?.map(normalizeTopicSlug) ?? [];
  const children = backendChildren.length > 0 ? backendChildren : localChildren;
  return children.filter((child) => child !== normalizedSlug).length > 0;
}

function findParentTopicSlugs(
  slug: string,
  topicGroups?: Record<string, string[]>,
) {
  const normalizedSlug = normalizeTopicSlug(slug);
  const parents = new Set<string>();

  if (CHILD_TOPIC_PARENTS[normalizedSlug]) {
    for (const parent of CHILD_TOPIC_PARENTS[normalizedSlug]) {
      parents.add(normalizeTopicSlug(parent));
    }
  }

  if (topicGroups) {
    for (const [parentSlug, childSlugs] of Object.entries(topicGroups)) {
      if (childSlugs.map(normalizeTopicSlug).includes(normalizedSlug)) {
        parents.add(normalizeTopicSlug(parentSlug));
      }
    }
  }

  for (const [parentSlug, childSlugs] of Object.entries(TOPIC_CHILDREN)) {
    if (childSlugs.map(normalizeTopicSlug).includes(normalizedSlug)) {
      parents.add(normalizeTopicSlug(parentSlug));
    }
  }

  return [...parents];
}

function buildTopicIndex(items: Topic[]) {
  return new Map(items.map((topic) => [normalizeTopicSlug(topic.slug), {
    ...topic,
    slug: normalizeTopicSlug(topic.slug),
  }]));
}

function createTopicFromSlug(slug: string) {
  return {
    slug,
    label: titleFromSlug(slug),
    description: `${titleFromSlug(slug)} stories and updates from Bharat Jankari.`,
  };
}

function sortStoriesLatestFirst(items: StoryCard[]) {
  return [...items].sort((left, right) => {
    const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : Number.NaN;
    const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : Number.NaN;

    if (Number.isFinite(leftTime) && Number.isFinite(rightTime) && leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    const leftId = Number(left.id);
    const rightId = Number(right.id);

    if (Number.isFinite(leftId) && Number.isFinite(rightId) && leftId !== rightId) {
      return rightId - leftId;
    }

    return right.slug.localeCompare(left.slug);
  });
}

function matchesRequestedTopic(storyTopic: string | undefined, requestedSlug: string) {
  return normalizeTopicSlug(storyTopic || "") === normalizeTopicSlug(requestedSlug);
}

async function enrichStoriesWithCanonicalTopics(
  storiesToMerge: StoryCard[],
  fallbackTopic: string,
) {
  const enrichedStories = await Promise.all(
    storiesToMerge.map(async (story, index) => {
      const remoteStory = await getStoryBySlug(story.slug);

      return {
        ...story,
        topic: remoteStory?.topic || story.topic || fallbackTopic,
        author: remoteStory?.author || story.author || "Bharat Jankari Desk",
        image: remoteStory?.image || story.image || "",
        excerpt: remoteStory?.excerpt || story.excerpt || "",
        createdAt: remoteStory?.createdAt || story.createdAt,
        id: story.id || `${story.slug}-${index}`,
      };
    }),
  );

  return sortStoriesLatestFirst(enrichedStories);
}

export function getTopicChildren(slug: string) {
  const childSlugs = getChildTopicSlugs(slug);

  return childSlugs.map((childSlug) => {
    const existingTopic = topics.find((topic) => topic.slug === childSlug);

    return existingTopic || {
      slug: childSlug,
      label: titleFromSlug(childSlug),
      description: `${titleFromSlug(childSlug)} stories and updates from Bharat Jankari.`,
    };
  });
}

export function getTopicLabelFromTopics(topicList: Topic[], slug: string) {
  const normalizedSlug = normalizeTopicSlug(slug);
  const topicIndex = buildTopicIndex(topicList);
  return topicIndex.get(normalizedSlug)?.label || titleFromSlug(normalizedSlug);
}

export function getTopicChildrenFromData(
  topicList: Topic[],
  topicGroups: Record<string, string[]> | undefined,
  slug: string,
) {
  const normalizedSlug = normalizeTopicSlug(slug);
  const topicIndex = buildTopicIndex(topicList);
  const backendChildSlugs = topicGroups?.[normalizedSlug]?.map(normalizeTopicSlug).filter(Boolean) ?? [];
  const fallbackChildSlugs = getChildTopicSlugs(normalizedSlug);
  const childSlugs = backendChildSlugs.length > 0 ? backendChildSlugs : fallbackChildSlugs;

  return childSlugs.map((childSlug) => topicIndex.get(childSlug) || createTopicFromSlug(childSlug));
}

export function getTopicLabel(slug: string) {
  const normalizedSlug = normalizeTopicSlug(slug);
  const existingTopic = topics.find((topic) => topic.slug === normalizedSlug);
  return existingTopic?.label || titleFromSlug(normalizedSlug);
}

export function getTopicSlugFromHref(href: string) {
  const normalizedHref = String(href || "").trim();

  if (normalizedHref === "/") {
    return "home";
  }

  if (normalizedHref.startsWith("/topics/")) {
    return normalizeTopicSlug(normalizedHref.replace("/topics/", ""));
  }

  return normalizeTopicSlug(normalizedHref.replace(/^\/+/, ""));
}

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
    { label: "POLITICAL", href: getTopicHref("political") },
    { label: "BUSINESS", href: getTopicHref("business") },
    { label: "TRADING", href: getTopicHref("trading") },
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
  topicGroups: TOPIC_CHILDREN,
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.bharatjankari.com";

function mergeSiteData(remote: Partial<SiteData> | null | undefined): SiteData {
  if (!remote) {
    return emptySiteData;
  }

  const mergedStories = sortStoriesLatestFirst(remote.stories ?? []);
  const mergedFeaturedStories = sortStoriesLatestFirst(remote.home?.featuredStories ?? []);
  const mergedTrendingStories = sortStoriesLatestFirst(remote.home?.trendingStories ?? []);
  const mergedPopularStories = sortStoriesLatestFirst(remote.hero?.popularStories ?? []);
  const mergedEditorsPick = sortStoriesLatestFirst(remote.hero?.editorsPick ?? []);
  const mergedFooterEditorsPicks = sortStoriesLatestFirst(remote.footer?.editorsPicks ?? []);
  const mergedLatestArticles = sortStoriesLatestFirst(remote.footer?.latestArticles ?? []);

  return {
    navItems: remote.navItems ?? [],
    socialLinks: remote.socialLinks ?? [],
    services: remote.services ?? [],
    topicGroups: remote.topicGroups ?? {},
    navPreviewMap: remote.navPreviewMap || undefined,
    hero: {
      hotCategories: remote.hero?.hotCategories ?? [[], []],
      entertainmentCategories: remote.hero?.entertainmentCategories ?? [[], []],
      popularStories: mergedPopularStories,
      editorsPick: mergedEditorsPick,
    },
    home: {
      featuredTopic: remote.home?.featuredTopic && remote.home.featuredTopic.slug !== "home"
        ? remote.home.featuredTopic
        : emptySiteData.home.featuredTopic,
      featuredStories: mergedFeaturedStories,
      trendingStories: mergedTrendingStories,
    },
    footer: {
      usefulLinks: remote.footer?.usefulLinks ?? [],
      editorsPicks: mergedFooterEditorsPicks,
      latestArticles: mergedLatestArticles,
      bottomLinks: remote.footer?.bottomLinks ?? [],
    },
    topics: remote.topics ?? [],
    stories: mergedStories,
  };
}

function buildTopicsFromRemote(remoteTopics: RemoteTopicRecord[] | null | undefined) {
  if (!remoteTopics?.length) {
    return [];
  }

  return remoteTopics
    .filter((topic) => topic.slug && topic.label && topic.navLabel && topic.isActive !== false)
    .sort((left, right) => (left.sortOrder ?? 999) - (right.sortOrder ?? 999))
    .map((topic) => ({
      slug: normalizeTopicSlug(topic.slug || ""),
      label: topic.label || titleFromSlug(topic.slug || ""),
      description: topic.description || `${titleFromSlug(topic.slug || "")} stories and updates from Bharat Jankari.`,
    }));
}

function buildNavItemsFromRemote(remoteTopics: RemoteTopicRecord[] | null | undefined): NavItem[] {
  if (!remoteTopics?.length) {
    return [];
  }

  return remoteTopics
    .filter((topic) => topic.slug && topic.navLabel && topic.showInNavigation && topic.isActive !== false)
    .sort((left, right) => (left.sortOrder ?? 999) - (right.sortOrder ?? 999))
    .map((topic) => ({
      label: topic.navLabel || String(topic.label || "").toUpperCase(),
      href: getTopicHref(topic.slug || ""),
    }));
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

export async function getSiteData(): Promise<SiteData> {
  const remote = await fetchJson<Partial<SiteData>>("/api/site-data");
  const merged = mergeSiteData(remote);

  if (merged.navItems.length > 0 && merged.topics.length > 0) {
    return merged;
  }

  const remoteTopics = await fetchJson<RemoteTopicRecord[]>("/api/topics");
  const derivedTopics = buildTopicsFromRemote(remoteTopics);
  const derivedNavItems = buildNavItemsFromRemote(remoteTopics);

  return {
    ...merged,
    navItems: merged.navItems.length > 0 ? merged.navItems : derivedNavItems,
    topics: merged.topics.length > 0 ? merged.topics : derivedTopics,
  };
}

export async function getStoryBySlug(slug: string) {
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
    createdAt?: string;
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
      createdAt: remoteStory.createdAt,
    };
  }

  return null;
}

export async function getTopicBySlug(slug: string) {
  const normalizedSlug = normalizeTopicSlug(slug);
  const remoteTopic = await fetchJson<{ topic?: Topic; slug?: string; label?: string; description?: string }>(`/api/topics/${normalizedSlug}`);

  if (remoteTopic?.topic) {
    return remoteTopic.topic;
  }

  if (remoteTopic?.slug || remoteTopic?.label) {
    return {
      slug: normalizeTopicSlug(remoteTopic.slug || normalizedSlug),
      label: remoteTopic.label || titleFromSlug(normalizedSlug),
      description: remoteTopic.description || `${titleFromSlug(normalizedSlug)} stories and updates from Bharat Jankari.`,
    };
  }

  const siteData = await getSiteData();
  const topicIndex = buildTopicIndex(siteData.topics);
  const existingTopic = topicIndex.get(normalizedSlug);

  if (existingTopic) {
    return existingTopic;
  }

  if (siteData.topicGroups?.[normalizedSlug]?.length) {
    return createTopicFromSlug(normalizedSlug);
  }

  const parentSlugs = findParentTopicSlugs(normalizedSlug, siteData.topicGroups);
  if (parentSlugs.length > 0) {
    return topicIndex.get(normalizedSlug)
      || topics.find((topic) => topic.slug === normalizedSlug)
      || createTopicFromSlug(normalizedSlug);
  }

  return null;
}

export async function getTopicStories(slug: string) {
  const normalizedSlug = normalizeTopicSlug(slug);
  const siteData = await getSiteData();
  const groupedTopic = hasChildTopics(normalizedSlug, siteData.topicGroups);
  const remoteTopic = await fetchJson<TopicPageData>(`/api/topics/${normalizedSlug}`);

  if (remoteTopic?.stories && remoteTopic.stories.length > 0) {
    const enrichedRemoteStories = await enrichStoriesWithCanonicalTopics(remoteTopic.stories, normalizedSlug);
    const directMatches = enrichedRemoteStories.filter((story) => matchesRequestedTopic(story.topic, normalizedSlug));

    if (directMatches.length > 0) {
      return directMatches;
    }

    return groupedTopic ? [] : enrichedRemoteStories;
  }

  const parentSlugs = findParentTopicSlugs(normalizedSlug, siteData.topicGroups).filter((parentSlug) => parentSlug !== normalizedSlug);

  if (parentSlugs.length > 0) {
    const parentTopicResponses = await Promise.all(
      parentSlugs.map(async (parentSlug) => ({
        parentSlug,
        data: await fetchJson<TopicPageData>(`/api/topics/${parentSlug}`),
      })),
    );

    const enrichedParentStoryGroups = await Promise.all(
      parentTopicResponses
        .filter((entry) => entry.data?.stories && entry.data.stories.length > 0)
        .map(async ({ parentSlug, data }) => enrichStoriesWithCanonicalTopics(data!.stories, parentSlug)),
    );

    const childMatches = enrichedParentStoryGroups
      .flat()
      .filter((story) => matchesRequestedTopic(story.topic, normalizedSlug));

    if (childMatches.length > 0) {
      const uniqueStories = Array.from(new Map(childMatches.map((story) => [story.slug, story])).values());
      return sortStoriesLatestFirst(uniqueStories);
    }

    return [];
  }

  return [];
}

export { mergeSiteData };

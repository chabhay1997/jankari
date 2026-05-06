export const CATEGORY_TO_SECTION = {
    lifestyle: 'lifestyle',
    esports: 'esports',
    food: 'food',
    entertainment: 'entertainment',
    money: 'money',
    health: 'health',
    travel: 'travel',
    tech: 'technology',
    technology: 'technology',
    political: 'political',
    politics: 'political',
    business: 'business',
    trading: 'trading',

    'physical-fitness': 'health',
    'nutrition-diet': 'health',
    'mental-health': 'health',
    'home-remedies': 'health',
    'diseases-care': 'health',
    'womens-health': 'health',

    fps: 'esports',
    moba: 'esports',
    'battle-royale': 'esports',
    'sports-sim': 'esports',
    fighting: 'esports',
    strategy: 'esports',
    mobile: 'esports',

    elections: 'political',
    parliament: 'political',
    policy: 'political',
    governance: 'political',
    courts: 'political',
    international: 'political',
    economy: 'political',

    movies: 'entertainment',
    tv: 'entertainment',
    music: 'entertainment',
    celebrity: 'entertainment',
    'web-series': 'entertainment',
    ott: 'entertainment',
    reviews: 'entertainment',

    ai: 'technology',
    gadgets: 'technology',
    software: 'technology',
    startups: 'technology',
    cybersecurity: 'technology',
    web: 'technology',

    markets: 'business',
    companies: 'business',
    finance: 'business',
    'real-estate': 'business',

    destinations: 'travel',
    guides: 'travel',
    hotels: 'travel',
    culture: 'travel',
    adventure: 'travel',
    tips: 'travel',

    stocks: 'trading',
    crypto: 'trading',
    commodities: 'trading',
    forex: 'trading',
    derivatives: 'trading',
    charts: 'trading',
    news: 'trading',
};

export const SECTION_NAMES = new Set([
    'health',
    'lifestyle',
    'esports',
    'food',
    'political',
    'entertainment',
    'technology',
    'money',
    'business',
    'travel',
    'trading',
]);

export function resolvePostRoute(segments = []) {
    if (segments.length === 2) {
        const [category, slug] = segments;
        const section = CATEGORY_TO_SECTION[category];

        if (!section) {
            return null;
        }

        return {
            section,
            category,
            slug,
            shortUrl: `/${category}/${slug}`,
        };
    }

    if (segments.length === 3) {
        const [section, category, slug] = segments;

        if (!SECTION_NAMES.has(section)) {
            return null;
        }

        return {
            section,
            category,
            slug,
            shortUrl: `/${category}/${slug}`,
        };
    }

    return null;
}

import { cache } from 'react';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.bharatjankari.com';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharatjankari.com';
const API_AUTH_TOKEN = process.env.API_AUTH_TOKEN || 'ahshhshahahlljwi@!#!!9**&@^@!bsHHHShsgsgsiu000';
const REMOTE_FETCH_TIMEOUT_MS = 700;

function stripHtml(html = '') {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function buildPublicPostUrl(category, slug) {
    return `${SITE_URL}/${category}/${slug}`;
}

export function normalizeCanonicalUrl(post, fallbackCategory, fallbackSlug) {
    const category = post?.categorySlug || fallbackCategory;
    const slug = post?.slug || fallbackSlug;
    const canonical = post?.canonical?.trim();

    if (canonical?.startsWith('http://') || canonical?.startsWith('https://')) {
        return canonical;
    }

    if (canonical) {
        const normalized = canonical.replace(/^\/+|\/+$/g, '');

        if (normalized.includes('/')) {
            return `${SITE_URL}/${normalized}`;
        }

        if (category) {
            return buildPublicPostUrl(category, normalized);
        }
    }

    return buildPublicPostUrl(category, slug);
}

export function getSeoDescription(post) {
    return (
        post?.metaDescription ||
        post?.shortDesc ||
        stripHtml(post?.content).slice(0, 160)
    );
}

export function getSeoTitle(post) {
    return post?.metaTitle || post?.title || 'Bharat Jankari';
}

export function getSeoKeywords(post) {
    if (!post?.keywords) {
        return [];
    }

    return post.keywords
        .split(',')
        .map((keyword) => keyword.trim())
        .filter(Boolean);
}

export const getPostData = cache(async (section, category, slug) => {
    const path = `${API_BASE_URL}/api/${section}/${category}/${slug}`;

    try {
        const res = await fetch(path, {
            headers: {
                Authorization: API_AUTH_TOKEN,
                Accept: 'application/json',
            },
            cache: 'no-store',
            signal: AbortSignal.timeout(REMOTE_FETCH_TIMEOUT_MS),
        });

        if (!res.ok) {
            console.error(`Fetch failed. Status: ${res.status}. URL: ${path}`);
            return null;
        }

        const data = await res.json();
        return data?.data || null;
    } catch (error) {
        console.error('Fetch/JSON Error:', error);
        return null;
    }
});

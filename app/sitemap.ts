import type { MetadataRoute } from 'next';
import { getSiteData, getStoryHref, getTopicHref } from '@/app/lib/siteData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharatjankari.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const siteData = await getSiteData();
    const topicEntries = (siteData.topics || [])
        .filter((topic) => topic.slug && topic.slug !== 'home')
        .map((topic) => ({
            url: `${siteUrl}${getTopicHref(topic.slug)}`,
            lastModified: now,
            changeFrequency: 'daily' as const,
            priority: 0.8,
        }));
    const storyEntries = (siteData.stories || [])
        .filter((story) => story.slug)
        .slice(0, 500)
        .map((story) => ({
            url: `${siteUrl}${getStoryHref(story.slug)}`,
            lastModified: story.createdAt ? new Date(story.createdAt) : now,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

    return [
        {
            url: siteUrl,
            lastModified: now,
            changeFrequency: 'hourly',
            priority: 1,
        },
        {
            url: `${siteUrl}/about-us`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${siteUrl}/contact-us`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${siteUrl}/privacy-policy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${siteUrl}/disclaimer`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...topicEntries,
        ...storyEntries,
    ];
}

import { notFound, redirect } from 'next/navigation';
import { SITE_URL, buildPublicPostUrl, getPostData, getSeoDescription, getSeoKeywords, getSeoTitle, normalizeCanonicalUrl } from '@/app/lib/postApi';
import { resolvePostRoute } from '@/app/lib/postRoute';
import PostPage from '@/app/components/PostPage';

export async function generateMetadata({ params }) {
    const { segments } = await params;
    const route = resolvePostRoute(segments);

    if (!route) {
        return {
            title: 'Post Not Found | Bharat Jankari',
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const post = await getPostData(route.section, route.category, route.slug);

    if (!post) {
        return {
            title: 'Post Not Found | Bharat Jankari',
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = getSeoTitle(post);
    const description = getSeoDescription(post);
    const keywords = getSeoKeywords(post);
    const canonical = normalizeCanonicalUrl(post, route.category, route.slug);
    const image = post.imageUrl || undefined;
    const url = buildPublicPostUrl(post.categorySlug || route.category, post.slug || route.slug);
    const isIndexable = post.status !== 'draft' && post.status !== 'inactive';
    const other = {};

    if (post.createdAt) {
        other['article:published_time'] = post.createdAt;
    }

    if (route.section) {
        other['article:section'] = route.section;
    }

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical,
        },
        robots: {
            index: isIndexable,
            follow: isIndexable,
            googleBot: {
                index: isIndexable,
                follow: isIndexable,
                'max-image-preview': 'large',
                'max-snippet': -1,
                'max-video-preview': -1,
            },
        },
        openGraph: {
            type: 'article',
            url,
            title,
            description,
            siteName: 'Bharat Jankari',
            locale: 'en_IN',
            publishedTime: post.createdAt || undefined,
            images: image ? [{ url: image, alt: title }] : undefined,
        },
        twitter: {
            card: image ? 'summary_large_image' : 'summary',
            title,
            description,
            images: image ? [image] : undefined,
        },
        other,
        metadataBase: new URL(SITE_URL),
    };
}

export default async function FullPostPage({ params }) {
    const { segments } = await params;
    const route = resolvePostRoute(segments);

    if (!route) {
        notFound();
    }

    if (segments.length === 3) {
        redirect(route.shortUrl);
    }

    return (
        <PostPage
            section={route.section}
            category={route.category}
            slug={route.slug}
        />
    );
}

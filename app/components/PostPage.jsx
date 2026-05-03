import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { API_BASE_URL, SITE_URL, getPostData, getSeoDescription } from '@/app/lib/postApi';

function getHeroImage(post, section) {
    if (post?.imageUrl) {
        return post.imageUrl;
    }

    if (!post?.image) {
        return null;
    }

    if (post.image.startsWith('http')) {
        return post.image;
    }

    const folder = section || post.category || 'health';
    return `${API_BASE_URL}/uploads/${folder}/${post.image}`;
}

export default async function PostPage({ section, category, slug }) {
    const post = await getPostData(section, category, slug);
    const heroImage = getHeroImage(post, section);
    const categoryLabel = post?.categorySlug || category;
    const sectionLabel = section || post?.section;
    const seoDescription = getSeoDescription(post);
    const articleUrl = `${SITE_URL}/${categoryLabel}/${post?.slug || slug}`;
    const articleSchema = post ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.metaTitle || post.title,
        description: seoDescription,
        image: heroImage ? [heroImage] : undefined,
        url: articleUrl,
        mainEntityOfPage: articleUrl,
        datePublished: post.createdAt || undefined,
        dateModified: post.createdAt || undefined,
        articleSection: sectionLabel,
        keywords: post.keywords || undefined,
        publisher: {
            '@type': 'Organization',
            name: 'Bharat Jankari',
            url: SITE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/favicon/fav.png`,
            },
        },
    } : null;

    if (!post) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                    <h1 className="text-4xl font-black text-black mb-2">Post Not Found</h1>
                    <p className="text-black text-lg">
                        We couldn&apos;t find a post with the slug:{' '}
                        <span className="font-mono font-bold text-blue-700">{slug}</span>
                    </p>
                    <Link
                        href="/"
                        className="mt-6 text-black font-bold border-b-2 border-black hover:text-blue-700 hover:border-blue-700 transition-all"
                    >
                        ← Back to Homepage
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc]">
            <Header />

            <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
                    <article className="bg-white rounded-2xl border border-slate-300 p-5 md:p-8 shadow-sm">
                        <header className="mb-8">
                            {articleSchema && (
                                <script
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                                />
                            )}
                            <div className="mb-4 flex flex-wrap gap-2">
                                {sectionLabel && (
                                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                                        {sectionLabel.replace(/-/g, ' ')}
                                    </span>
                                )}
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                                    {categoryLabel.replace(/-/g, ' ')}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black text-black leading-tight mb-6">
                                {post.title}
                            </h1>

                            {post.metaDescription && (
                                <p className="text-lg md:text-xl text-black font-medium italic border-l-4 border-blue-600 pl-4 bg-slate-50 py-2">
                                    {post.metaDescription}
                                </p>
                            )}
                        </header>

                        {heroImage && (
                            <div className="relative h-[260px] sm:h-[360px] md:h-[540px] w-full mb-10 shadow-2xl rounded-xl overflow-hidden border-2 border-slate-100">
                                <img
                                    src={heroImage}
                                    alt={post.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}

                        <div
                            className="article-content max-w-none text-black text-lg leading-relaxed selection:bg-yellow-200"
                            style={{ color: '#000000' }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </article>

                    <aside className="space-y-6 lg:sticky lg:top-24 self-start">
                        <div className="p-4 bg-black text-white rounded-xl">
                            <h3 className="font-bold text-lg mb-2">
                                Trending in {categoryLabel.replace(/-/g, ' ')}
                            </h3>
                            <p className="text-sm text-slate-300">Stay updated with latest stories.</p>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}

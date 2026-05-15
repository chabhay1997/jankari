import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import StoryFollowupFeed from "@/app/components/StoryFollowupFeed";
import { getSiteData, getStoryBySlug, getStoryHrefWithSource, getTopicBySlug, getTopicHref, getStoryImage } from "@/app/lib/siteData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bharatjankari.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story Not Found | Bharat Jankari",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const image = getStoryImage(story);
  const description = story.excerpt || `${story.title} on Bharat Jankari.`;
  const canonical = `/stories/${story.slug}`;
  const metadataTopic = await getTopicBySlug(story.topic);

  return {
    title: story.title,
    description,
    keywords: story.tags,
    authors: [{ name: story.author || "Bharat Jankari Desk" }],
    category: metadataTopic?.label || story.topic,
    alternates: {
      canonical,
    },
    openGraph: {
      title: story.title,
      description,
      url: `${siteUrl}${canonical}`,
      type: "article",
      siteName: "Bharat Jankari",
      locale: "en_IN",
      publishedTime: story.createdAt || undefined,
      authors: [story.author || "Bharat Jankari Desk"],
      section: metadataTopic?.label || story.topic,
      tags: story.tags,
      images: image ? [{ url: image, alt: story.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "article:published_time": story.createdAt || "",
      "article:author": story.author || "Bharat Jankari Desk",
      "news_keywords": story.tags?.join(", ") || "",
    },
  };
}

export default async function StoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const [story, siteData] = await Promise.all([getStoryBySlug(slug), getSiteData()]);

  if (!story) {
    notFound();
  }

  const entrySource = String(resolvedSearchParams?.from || "").trim().toLowerCase();
  const topic = await getTopicBySlug(story.topic);
  const hasRichContent = "content" in story && typeof story.content === "string" && story.content.trim().length > 0;
  const heroImage = getStoryImage(story);
  const relatedStories = siteData.stories
    .filter((item) => item.slug !== story.slug && item.topic === story.topic)
    .slice(0, 4);
  const railStories = siteData.stories
    .filter((item) => item.slug !== story.slug)
    .slice(0, 5);
  const followupStories = siteData.stories
    .filter((item) => item.slug !== story.slug && (item.topic === story.topic || item.tags?.some((tag) => story.tags?.includes(tag))))
    .slice(0, 6);
  const sourceTheme = entrySource === "nav"
    ? {
      label: "Section Briefing",
      surface: "bg-white border border-gray-200",
      railTitle: "Explore This Section",
      accent: "text-blue-600",
    }
    : entrySource === "footer"
      ? {
        label: "Evergreen Read",
        surface: "bg-[#fdfbf7] border border-amber-100",
        railTitle: "More Trusted Reads",
        accent: "text-amber-700",
      }
      : entrySource === "home" || entrySource === "feed"
        ? {
          label: "Top Story",
          surface: "bg-white border border-slate-200 shadow-sm",
          railTitle: "Keep Reading",
          accent: "text-emerald-700",
        }
        : {
          label: "Topic Story",
          surface: "bg-white border border-gray-200",
          railTitle: "More In This Topic",
          accent: "text-blue-600",
        };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header siteData={siteData} />
      <main className="max-w-[1180px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,840px)_260px] gap-6 items-start">
          <article className={`${sourceTheme.surface} p-6 md:p-8`}>
            <div className="max-w-[840px] mx-auto">
              <p className={`text-xs font-bold uppercase tracking-[0.3em] ${sourceTheme.accent}`}>{sourceTheme.label}</p>
              <Link href={getTopicHref(story.topic)} className={`mt-3 inline-block text-xs font-bold uppercase tracking-[0.3em] ${sourceTheme.accent} hover:underline`}>
                {topic?.label || story.topic}
              </Link>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mt-4">
                {story.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span>by {story.author}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>In-depth read</span>
                {story.location?.city ? (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{story.location.city}{story.location.country ? `, ${story.location.country}` : ""}</span>
                  </>
                ) : null}
              </div>
              <p className="mt-6 text-lg md:text-xl leading-8 text-slate-600">{story.excerpt}</p>
              <img src={heroImage} alt={story.title} className="w-full h-[220px] md:h-[400px] object-cover mt-8 rounded-2xl" />
              <div className="mt-10 article-content">
                {hasRichContent ? (
                  <div dangerouslySetInnerHTML={{ __html: story.content }} />
                ) : (
                  <p>{story.excerpt}</p>
                )}
              </div>

              {(story.tags?.length || story.location?.state || story.location?.country) ? (
                <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5">
                  <div className="flex flex-wrap gap-2">
                    {story.location?.state ? (
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                        {story.location.state}
                      </span>
                    ) : null}
                    {story.location?.country ? (
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                        {story.location.country}
                      </span>
                    ) : null}
                    {story.tags?.slice(0, 6).map((tag: string) => (
                      <span key={tag} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="mt-12 pt-8 border-t border-slate-200">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-wide text-slate-900">Continue Reading</h2>
                  <Link href={getTopicHref(story.topic)} className="text-xs font-bold text-blue-600 hover:underline">View all</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedStories.map((item) => (
                    <Link key={item.slug} href={getStoryHrefWithSource(item.slug, "story")} className="block rounded-2xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/40 transition">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 mb-2">{item.topic}</p>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{item.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </section>

              <StoryFollowupFeed
                storySlug={story.slug}
                storyTopic={story.topic}
                storyTitle={story.title}
                storyTags={story.tags || []}
                initialStories={followupStories}
                topics={siteData.topics}
              />
            </div>
          </article>

          <aside className="hidden xl:block space-y-4 sticky top-24">
            <div className="bg-white border border-gray-200 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-500 mb-3">{sourceTheme.railTitle}</p>
              <div className="space-y-3">
                {relatedStories.length > 0 ? relatedStories.map((item) => (
                  <Link key={item.slug} href={getStoryHrefWithSource(item.slug, "story")} className="block group">
                    <p className="text-sm font-bold text-gray-800 leading-snug group-hover:text-blue-600 transition">{item.title}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{item.author}</p>
                  </Link>
                )) : (
                  <Link href={getTopicHref(story.topic)} className="block text-sm font-semibold text-blue-600 hover:underline">
                    Explore more stories
                  </Link>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">Editorial Signals</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Published by</p>
                  <p className="mt-1 font-semibold text-slate-900">{story.author || "Bharat Jankari Desk"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Coverage focus</p>
                  <p className="mt-1 font-semibold text-slate-900">{topic?.label || story.topic}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Location context</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {story.location?.city || story.location?.state || story.location?.country || "Global coverage"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] border border-slate-200 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-500">Readers Also Open</p>
              <div className="mt-4 space-y-4">
                {railStories.map((item, index) => (
                  <div key={`${item.slug}-rail-list`} className="flex gap-3">
                    <span className="pt-1 text-[11px] font-black text-slate-300">{String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">{item.topic}</p>
                      <Link href={getStoryHrefWithSource(item.slug, "story")} className="mt-1 block text-sm font-semibold leading-snug text-slate-900 hover:text-blue-600">
                        {item.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">Ad Space Ready</p>
              <p className="mt-3 leading-6">
                This area can switch to Google Ads later. Until then, it stays filled with editorial trust modules and related reading.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

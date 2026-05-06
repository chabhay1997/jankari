import Link from "next/link";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroGrid from "./components/HeroGrid";
import { getSiteData, getStoryHref, getTopicHref } from "./lib/siteData";

export default async function HomePage() {
  const siteData = await getSiteData();
  const featuredTopic = siteData.home?.featuredTopic ?? { slug: "home", label: "Home", description: "" };
  const featuredStories = siteData.home?.featuredStories ?? [];
  const trendingStories = siteData.home?.trendingStories ?? [];
  const popularStories = siteData.hero?.popularStories ?? [];
  const topics = siteData.topics ?? [];
  const leadStory = featuredStories[0] ?? null;
  const secondaryFeatured = featuredStories.slice(1, 4);
  const latestDigest = [...featuredStories.slice(0, 2), ...popularStories.slice(0, 2)].slice(0, 4);

  return (
    <div className="page-shell font-sans">
      <Header siteData={siteData} />
      <HeroGrid />

      <div className="content-wrap">
        <section className="surface-card overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_380px]">
            <div className="p-5 md:p-7 border-b xl:border-b-0 xl:border-r border-slate-200">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.32em] text-slate-500">Homepage Spotlight</p>
                  <h2 className="mt-2 text-2xl md:text-3xl font-black text-slate-950">{featuredTopic.label}</h2>
                  {featuredTopic.description && (
                    <p className="mt-2 max-w-2xl text-sm md:text-base text-slate-600">{featuredTopic.description}</p>
                  )}
                </div>
                <Link href={getTopicHref(featuredTopic.slug)} className="text-xs text-blue-600 hover:underline font-semibold whitespace-nowrap">
                  VIEW ALL
                </Link>
              </div>

              {leadStory ? (
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <article className="group">
                    <div className="overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={leadStory.image}
                        alt={leadStory.title}
                        className="w-full h-[280px] md:h-[380px] object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="pt-5">
                      <Link href={getTopicHref(leadStory.topic)}>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded">
                          {topics.find((topic) => topic.slug === leadStory.topic)?.label || leadStory.topic}
                        </span>
                      </Link>
                      <Link href={getStoryHref(leadStory.slug)}>
                        <h3 className="text-2xl md:text-4xl font-black text-slate-950 mt-3 leading-tight hover:text-blue-600 transition">
                          {leadStory.title}
                        </h3>
                      </Link>
                      <p className="text-sm md:text-base text-slate-600 mt-3 leading-7">{leadStory.excerpt}</p>
                      <span className="text-xs text-slate-400 mt-4 block">by {leadStory.author}</span>
                    </div>
                  </article>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                    {secondaryFeatured.map((article) => (
                      <article key={article.id} className="bg-white group border border-slate-200 rounded-2xl overflow-hidden">
                        <div className="overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <Link href={getTopicHref(article.topic)}>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded">
                              {topics.find((topic) => topic.slug === article.topic)?.label || article.topic}
                            </span>
                          </Link>
                          <Link href={getStoryHref(article.slug)}>
                            <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug hover:text-blue-600 transition line-clamp-2">
                              {article.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-3">{article.excerpt}</p>
                          <span className="text-[11px] text-slate-400 mt-3 block">by {article.author}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
                  Featured homepage stories will appear here when the backend sends `home.featuredStories`.
                </div>
              )}
            </div>

            <aside className="p-5 md:p-7 bg-slate-50/70">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.32em] text-slate-500">Daily Digest</p>
                  <h3 className="mt-2 text-xl font-black text-slate-950">Latest editor-curated reads</h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">{latestDigest.length} stories</span>
              </div>

              {latestDigest.length > 0 ? (
                <div className="space-y-4">
                  {latestDigest.map((article, index) => (
                    <article key={`${article.slug}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex gap-4 items-start">
                        <span className="text-[11px] font-black text-slate-300 pt-1">{String(index + 1).padStart(2, "0")}</span>
                        <div className="min-w-0">
                          <Link href={getTopicHref(article.topic)}>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded">
                              {topics.find((topic) => topic.slug === article.topic)?.label || article.topic}
                            </span>
                          </Link>
                          <Link href={getStoryHref(article.slug)} className="block mt-2 text-sm font-semibold text-slate-900 hover:text-blue-600 transition leading-snug">
                            {article.title}
                          </Link>
                          <span className="text-xs text-slate-400 block mt-2">by {article.author}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                  Digest cards will show here when the backend provides homepage or hero stories.
                </div>
              )}
            </aside>
          </div>
        </section>
      </div>

      <div className="content-wrap pt-0">
        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
          <div className="surface-card p-5 md:p-6">
            <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b-2 border-black">
              <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">
                Trending Now
              </h2>
              <span className="text-xs font-semibold text-slate-400">{trendingStories.length} live items</span>
            </div>

            {trendingStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingStories.map((article) => (
                  <div key={article.id} className="flex gap-4 items-start">
                    <img src={article.image} alt={article.title} className="w-24 h-16 object-cover flex-shrink-0 rounded-lg" />
                    <div>
                      <Link href={getStoryHref(article.slug)} className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition leading-snug">
                        {article.title}
                      </Link>
                      <span className="text-xs text-gray-400 block mt-1">by {article.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                Trending stories will appear here when the backend sends `home.trendingStories`.
              </div>
            )}
          </div>

          <aside className="surface-card p-5 md:p-6">
            <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b-2 border-black">
              <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">
                Popular This Week
              </h2>
              <span className="text-xs font-semibold text-slate-400">{popularStories.length} ranked</span>
            </div>

            {popularStories.length > 0 ? (
              <div className="space-y-4">
                {popularStories.map((article, index) => (
                  <div key={article.id} className="flex gap-4 items-start">
                    <span className="text-[11px] font-black text-slate-300 pt-1">{String(index + 1).padStart(2, "0")}</span>
                    <img src={article.image} alt={article.title} className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div>
                      <Link href={getStoryHref(article.slug)} className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition leading-snug">
                        {article.title}
                      </Link>
                      <span className="text-xs text-gray-400 block mt-1">by {article.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                Weekly popular stories will appear here when the backend sends `hero.popularStories`.
              </div>
            )}
          </aside>
        </section>
      </div>

      <Footer />
    </div>
  );
}

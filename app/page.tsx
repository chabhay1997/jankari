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
  const topics = siteData.topics ?? [];

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      <Header />
      <HeroGrid />

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black uppercase tracking-wide text-gray-900 border-b-2 border-black pb-1">
            {featuredTopic.label}
          </h2>
          <Link href={getTopicHref(featuredTopic.slug)} className="text-xs text-blue-600 hover:underline font-semibold">
            VIEW ALL
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredStories.map((article) => (
            <div key={article.id} className="bg-white group cursor-pointer">
              <div className="overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <Link href={getTopicHref(article.topic)}>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded">
                    {topics.find((topic) => topic.slug === article.topic)?.label || article.topic}
                  </span>
                </Link>
                <Link href={getStoryHref(article.slug)}>
                  <h3 className="text-sm font-bold text-gray-800 mt-2 leading-snug hover:text-blue-600 transition line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
                <span className="text-[11px] text-gray-400 mt-2 block">by {article.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 pb-10">
        <div className="bg-white border border-gray-100 p-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-gray-900 mb-4 pb-2 border-b-2 border-black">
            Trending Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingStories.map((article) => (
              <div key={article.id} className="flex gap-4 items-start">
                <img src={article.image} alt={article.title} className="w-24 h-16 object-cover flex-shrink-0" />
                <div>
                  <Link href={getStoryHref(article.slug)} className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition leading-snug">
                    {article.title}
                  </Link>
                  <span className="text-xs text-gray-400 block mt-1">by {article.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

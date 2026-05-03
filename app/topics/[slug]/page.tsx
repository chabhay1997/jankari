import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { getStoryHref, getTopicBySlug, getTopicHref, getSiteData, getTopicStories } from "@/app/lib/siteData";

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [topic, siteData, remoteStories] = await Promise.all([getTopicBySlug(slug), getSiteData(), getTopicStories(slug)]);

  if (!topic) {
    notFound();
  }

  const stories = remoteStories ?? [];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-3">Topic</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">{topic.label}</h1>
          <p className="text-gray-600 mt-3 max-w-2xl">{topic.description}</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-6 mb-6">
          {siteData.navItems.slice(1).map((item) => (
            <Link key={item.href} href={item.href} className="text-xs font-semibold uppercase tracking-wide px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 transition">
              {item.label}
            </Link>
          ))}
        </div>

        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stories.map((story) => (
              <article key={story.slug} className="bg-white border border-gray-200 overflow-hidden">
                <img src={story.image} alt={story.title} className="w-full h-52 object-cover" />
                <div className="p-4">
                  <Link href={getStoryHref(story.slug)}>
                    <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition leading-snug">
                      {story.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{story.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">by {story.author}</span>
                    <Link href={getStoryHref(story.slug)} className="text-xs font-bold text-blue-600 hover:underline">
                      READ STORY
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 p-6 text-gray-600">
            Fresh stories for this topic will appear here soon. Explore the <Link href={getTopicHref("home")} className="text-blue-600 hover:underline">homepage</Link> in the meantime.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

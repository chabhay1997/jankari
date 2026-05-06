import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { getSiteData, getStoryBySlug, getStoryHref, getTopicBySlug, getTopicHref } from "@/app/lib/siteData";

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [story, siteData] = await Promise.all([getStoryBySlug(slug), getSiteData()]);

  if (!story) {
    notFound();
  }

  const topic = await getTopicBySlug(story.topic);
  const hasRichContent = "content" in story && typeof story.content === "string" && story.content.trim().length > 0;
  const relatedStories = siteData.stories
    .filter((item) => item.slug !== story.slug && item.topic === story.topic)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header siteData={siteData} />
      <main className="max-w-[1180px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,840px)_260px] gap-6 items-start">
          <article className="bg-white border border-gray-200 p-6 md:p-8">
            <div className="max-w-[840px] mx-auto">
              <Link href={getTopicHref(story.topic)} className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 hover:underline">
                {topic?.label || story.topic}
              </Link>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mt-4">
                {story.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span>by {story.author}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>In-depth read</span>
              </div>
              <p className="mt-6 text-lg md:text-xl leading-8 text-slate-600">{story.excerpt}</p>
              <img src={story.image} alt={story.title} className="w-full h-[220px] md:h-[400px] object-cover mt-8 rounded-2xl" />
              <div className="mt-10 article-content">
                {hasRichContent ? (
                  <div dangerouslySetInnerHTML={{ __html: story.content }} />
                ) : (
                  <p>{story.excerpt}</p>
                )}
              </div>

              <section className="mt-12 pt-8 border-t border-slate-200">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-wide text-slate-900">Continue Reading</h2>
                  <Link href={getTopicHref(story.topic)} className="text-xs font-bold text-blue-600 hover:underline">View all</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedStories.map((item) => (
                    <Link key={item.slug} href={getStoryHref(item.slug)} className="block rounded-2xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/40 transition">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 mb-2">{item.topic}</p>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{item.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </article>

          <aside className="hidden xl:block space-y-4 sticky top-24">
            <div className="bg-white border border-gray-200 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-500 mb-3">More In This Topic</p>
              <div className="space-y-3">
                {relatedStories.length > 0 ? relatedStories.map((item) => (
                  <Link key={item.slug} href={getStoryHref(item.slug)} className="block group">
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
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

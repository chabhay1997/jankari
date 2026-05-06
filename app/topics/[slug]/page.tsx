import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import TopicExplorer from "@/app/components/TopicExplorer";
import TopicStoryList from "@/app/components/TopicStoryList";
import { getTopicBySlug, getTopicChildrenFromData, getTopicHref, getSiteData, getTopicStories } from "@/app/lib/siteData";

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [topic, siteData, remoteStories] = await Promise.all([getTopicBySlug(slug), getSiteData(), getTopicStories(slug)]);

  if (!topic) {
    notFound();
  }

  const stories = remoteStories;
  const subtopics = getTopicChildrenFromData(siteData.topics, siteData.topicGroups, slug);
  const siblingTopics = (siteData.topics ?? []).filter((entry) => (
    entry.slug === "home" ||
    !subtopics.some((subtopic) => subtopic.slug === entry.slug)
  ));

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header siteData={siteData} />
      <main className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-3">Topic</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">{topic.label}</h1>
          <p className="text-gray-600 mt-3 max-w-2xl">{topic.description}</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-6 mb-6">
          <Link href="/" className="text-xs font-semibold uppercase tracking-wide px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 transition">
            HOME
          </Link>
          {siteData.navItems.slice(1).map((item) => (
            <Link key={`${item.href}-${item.label}`} href={item.href} className="text-xs font-semibold uppercase tracking-wide px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 transition">
              {item.label}
            </Link>
          ))}
        </div>

        {subtopics.length > 1 && (
          <div className="bg-white border border-gray-200 p-5 mb-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-500">Subcategories</p>
                <p className="text-sm text-gray-600 mt-1">Browse all sections under {topic.label}.</p>
              </div>
              <p className="text-xs font-semibold text-gray-500">Latest stories are shown first.</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              {subtopics.map((subtopic) => (
                <Link
                  key={subtopic.slug}
                  href={getTopicHref(subtopic.slug)}
                  className={`text-xs font-semibold uppercase tracking-wide px-3 py-2 border transition ${
                    subtopic.slug === topic.slug
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  {subtopic.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {stories.length > 0 ? (
          <TopicStoryList stories={stories} />
        ) : (
          <div className="bg-white border border-gray-200 p-6 text-gray-600">
            Fresh stories for this topic will appear here soon. Explore the <Link href={getTopicHref("home")} className="text-blue-600 hover:underline">homepage</Link> in the meantime.
          </div>
        )}

        <TopicExplorer
          currentTopic={topic}
          stories={stories}
          subtopics={subtopics}
          siblingTopics={siblingTopics}
          allTopics={siteData.topics}
        />
      </main>
      <Footer />
    </div>
  );
}

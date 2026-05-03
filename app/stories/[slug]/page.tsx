import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { getStoryBySlug, getTopicBySlug, getTopicHref } from "@/app/lib/siteData";

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const topic = await getTopicBySlug(story.topic);
  const hasRichContent = "content" in story && typeof story.content === "string" && story.content.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main className="max-w-[980px] mx-auto px-4 py-8">
        <article className="bg-white border border-gray-200 p-6 md:p-8">
          <Link href={getTopicHref(story.topic)} className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 hover:underline">
            {topic?.label || story.topic}
          </Link>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mt-4">
            {story.title}
          </h1>
          <p className="text-sm text-gray-500 mt-4">by {story.author}</p>
          <img src={story.image} alt={story.title} className="w-full h-[280px] md:h-[480px] object-cover mt-8" />
          <div className="mt-8 space-y-5 text-[17px] leading-8 text-gray-700">
            <p>{story.excerpt}</p>
            {hasRichContent ? (
              <div dangerouslySetInnerHTML={{ __html: story.content }} />
            ) : (
              <>
                <p>
                  This story page is now linked dynamically from the site data layer, so header menus, homepage cards, hero modules, and footer links all resolve to a real destination instead of demo placeholders.
                </p>
                <p>
                  Once your backend exposes a dedicated homepage or navigation payload, we can swap the fallback dataset for live API content without changing the component structure again.
                </p>
              </>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

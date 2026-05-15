"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getStoryHrefWithSource, getTopicHref, type StoryCard, type Topic } from "@/app/lib/siteData";

interface StoryFollowupFeedProps {
  storySlug: string;
  storyTopic: string;
  storyTitle: string;
  storyTags: string[];
  initialStories: StoryCard[];
  topics: Topic[];
}

const PAGE_SIZE = 4;

export default function StoryFollowupFeed({
  storySlug,
  storyTopic,
  storyTitle,
  storyTags,
  initialStories,
  topics,
}: StoryFollowupFeedProps) {
  const [stories, setStories] = useState(initialStories);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialStories.length >= PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const topicLabel = topics.find((topic) => topic.slug === storyTopic)?.label || storyTopic.replace(/-/g, " ");
  const relatedQuery = useMemo(() => {
    const parts = [topicLabel, ...storyTags.slice(0, 3), ...storyTitle.split(" ").slice(0, 4)];
    return parts.join(" ").trim();
  }, [storyTags, storyTitle, topicLabel]);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) {
      return;
    }

    const sentinel = sentinelRef.current;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !loading) {
        void loadMore();
      }
    }, { rootMargin: "240px 0px" });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, stories.length]);

  async function loadMore() {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        offset: String(stories.length),
        limit: String(PAGE_SIZE),
        mode: "latest",
        query: relatedQuery,
      });
      const response = await fetch(`/api/stories-feed?${params.toString()}`, {
        cache: "no-store",
      });
      const payload = await response.json() as { items?: StoryCard[]; hasMore?: boolean };
      const incoming = (payload.items || []).filter((item) => item.slug !== storySlug);
      const deduped = incoming.filter((item) => !stories.some((entry) => entry.slug === item.slug));
      setStories((current) => [...current, ...deduped]);
      setHasMore(Boolean(payload.hasMore) && deduped.length > 0);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  const labelForTopic = (slug: string) => topics.find((topic) => topic.slug === slug)?.label || slug.replace(/-/g, " ");

  return (
    <section className="mt-12 border-t border-slate-200 pt-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">Keep Reading</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-black text-slate-950">More stories connected to this topic</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            A live stream of related reads, background context, and fresh follow-up coverage.
          </p>
        </div>
        <Link href={getTopicHref(storyTopic)} className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 hover:underline">
          Open full topic
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {stories.map((item, index) => (
          <article
            key={`${item.slug}-${index}`}
            className={`overflow-hidden rounded-[26px] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg ${
              index === 0 ? "md:col-span-2 md:grid md:grid-cols-[1fr_1.05fr]" : ""
            }`}
          >
            <div className="bg-slate-100">
              <img src={item.image} alt={item.title} className={`w-full object-cover ${index === 0 ? "h-72 md:h-full" : "h-52"}`} loading="lazy" />
            </div>
            <div className="p-5">
              <Link href={getTopicHref(item.topic)} className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                {labelForTopic(item.topic)}
              </Link>
              <Link href={getStoryHrefWithSource(item.slug, "story")} className="block">
                <h3 className={`mt-3 font-black leading-tight text-slate-950 transition hover:text-blue-600 ${index === 0 ? "text-2xl md:text-[2rem]" : "text-lg"}`}>
                  {item.title}
                </h3>
              </Link>
              <p className="mt-3 text-sm leading-7 text-slate-600 line-clamp-4">{item.excerpt}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">by {item.author}</span>
                <Link href={getStoryHrefWithSource(item.slug, "story")} className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 hover:underline">
                  Read next
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasMore ? <div ref={sentinelRef} className="h-8" /> : null}

      <div className="mt-6 flex justify-center">
        {loading ? (
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Loading related stories
          </div>
        ) : !hasMore ? (
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            More fresh reads will appear here automatically
          </div>
        ) : null}
      </div>
    </section>
  );
}

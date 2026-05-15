"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getStoryHrefWithSource, type StoryCard } from "@/app/lib/siteData";

const STORIES_PER_PAGE = 12;

export default function TopicStoryList({ stories }: { stories: StoryCard[] }) {
  const [visibleCount, setVisibleCount] = useState(STORIES_PER_PAGE);

  const visibleStories = useMemo(
    () => stories.slice(0, visibleCount),
    [stories, visibleCount],
  );

  const hasMoreStories = visibleCount < stories.length;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-bold text-gray-900">{visibleStories.length}</span> of{" "}
          <span className="font-bold text-gray-900">{stories.length}</span> stories
        </p>
        {stories.length > STORIES_PER_PAGE ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            View All
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleStories.map((story) => (
          <article key={story.slug} className="overflow-hidden border border-gray-200 bg-white">
            <img src={story.image} alt={story.title} className="h-52 w-full object-cover" />
            <div className="p-4">
              <Link href={getStoryHrefWithSource(story.slug, "topic")}>
                <h2 className="text-lg font-bold leading-snug text-gray-900 transition hover:text-blue-600">
                  {story.title}
                </h2>
              </Link>
              <p className="mt-2 line-clamp-3 text-sm text-gray-600">{story.excerpt}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">by {story.author}</span>
                <Link href={getStoryHrefWithSource(story.slug, "topic")} className="text-xs font-bold text-blue-600 hover:underline">
                  READ STORY
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasMoreStories ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((current) => current + STORIES_PER_PAGE)}
            className="border border-blue-200 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-600 transition hover:bg-blue-50"
          >
            Load More
          </button>
        </div>
      ) : null}
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type StoryCard, type Topic, getStoryHref, getTopicHref, getTopicLabelFromTopics } from "@/app/lib/siteData";

interface TopicExplorerProps {
  currentTopic: Topic;
  stories: StoryCard[];
  subtopics: Topic[];
  siblingTopics: Topic[];
  allTopics: Topic[];
}

export default function TopicExplorer({
  currentTopic,
  stories,
  subtopics,
  siblingTopics,
  allTopics,
}: TopicExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(currentTopic.slug);
  const [customTopics, setCustomTopics] = useState<string[]>(siblingTopics.slice(0, 6).map((topic) => topic.slug));

  const visibleStories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return stories.filter((story) => {
      const matchesTopic = selectedTopic === "all" || story.topic === selectedTopic;
      const matchesQuery = !normalizedQuery || [
        story.title,
        story.excerpt || "",
        story.author,
        getTopicLabelFromTopics(allTopics, story.topic),
      ].join(" ").toLowerCase().includes(normalizedQuery);

      return matchesTopic && matchesQuery;
    });
  }, [allTopics, query, selectedTopic, stories]);

  const customTopicItems = siblingTopics.filter((topic) => customTopics.includes(topic.slug));
  const availableFilterCount = subtopics.length + 1;

  const toggleCustomTopic = (slug: string) => {
    setCustomTopics((current) => (
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug].slice(0, 12)
    ));
  };

  return (
    <section className="mt-8 overflow-hidden border border-gray-200 bg-white">
      <div className="flex flex-col gap-6">
        <div className="border-b border-gray-200 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-5 py-5 md:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Search & Customize</p>
              <h3 className="mt-2 text-2xl font-black text-gray-900">Explore {currentTopic.label} your way</h3>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Search stories, filter by subcategory, and pin your favourite sections without changing the original page design.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left sm:max-w-sm">
              <div className="border border-gray-200 bg-white px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">Stories</p>
                <p className="mt-2 text-2xl font-black text-gray-900">{stories.length}</p>
              </div>
              <div className="border border-gray-200 bg-white px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">Filters</p>
                <p className="mt-2 text-2xl font-black text-gray-900">{availableFilterCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 md:px-6 md:pb-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full max-w-xl">
              <label htmlFor="topic-explorer-search" className="sr-only">Search stories</label>
              <input
                id="topic-explorer-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search stories, topics, authors..."
                className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <div className="border border-gray-200 bg-gray-50/50 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-500">Filters</p>
                  <p className="mt-1 text-sm text-gray-600">Choose a subcategory and search inside its stories.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelectedTopic(currentTopic.slug);
                  }}
                  className="border border-blue-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 transition hover:bg-blue-50"
                >
                  Reset Filters
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTopic("all")}
                  className={`border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    selectedTopic === "all"
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  All Stories
                </button>
                {subtopics.map((subtopic) => (
                  <button
                    key={subtopic.slug}
                    type="button"
                    onClick={() => setSelectedTopic(subtopic.slug)}
                    className={`border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                      selectedTopic === subtopic.slug
                        ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:text-blue-600"
                    }`}
                  >
                    {subtopic.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {visibleStories.length > 0 ? visibleStories.map((story) => (
                  <article key={story.slug} className="border border-gray-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">{getTopicLabelFromTopics(allTopics, story.topic)}</p>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">Story</span>
                    </div>
                    <Link href={getStoryHref(story.slug)}>
                      <h4 className="mt-2 text-lg font-bold text-gray-900 hover:text-blue-600 transition leading-snug">
                        {story.title}
                      </h4>
                    </Link>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{story.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-400">by {story.author}</span>
                      <Link href={getStoryHref(story.slug)} className="text-xs font-bold text-blue-600 hover:underline">
                        Read story
                      </Link>
                    </div>
                  </article>
                )) : (
                  <div className="border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-600 md:col-span-2">
                    No matching stories found for this search and filter.
                  </div>
                )}
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-4 md:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gray-500">Customizer</p>
              <p className="mt-2 text-sm text-gray-600">
                Pick up to 12 sections you want to keep visible for quick browsing.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {siblingTopics.map((topic) => {
                  const selected = customTopics.includes(topic.slug);

                  return (
                    <button
                      key={topic.slug}
                      type="button"
                      onClick={() => toggleCustomTopic(topic.slug)}
                      className={`border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:text-blue-600"
                      }`}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">Your Quick Sections</p>
                  <span className="text-xs font-semibold text-gray-500">{customTopicItems.length}/12</span>
                </div>

                <div className="mt-4 grid gap-3">
                  {customTopicItems.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={getTopicHref(topic.slug)}
                      className="flex items-center justify-between border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 hover:border-blue-200 hover:text-blue-600 transition"
                    >
                      <span>{topic.label}</span>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Open</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

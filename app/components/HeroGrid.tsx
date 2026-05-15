import Link from "next/link";
import { getSiteData, getStoryHref, getStoryImage, type CategoryLink } from "@/app/lib/siteData";

function SectionHeading({ title, id }: { title: string; id?: string }) {
  return (
    <h2
      id={id}
      className="text-[13px] font-black uppercase tracking-wider text-gray-900 mb-3 pb-2 border-b-2 border-black"
    >
      {title}
    </h2>
  );
}

function CatList({ items }: { items: CategoryLink[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label + item.href}>
          <Link href={item.href} className="text-[14px] text-gray-700 hover:text-blue-600 transition-colors font-medium leading-snug">
            {item.label}
            {item.badge && (
              <span className={`ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-sm align-middle ${item.red ? "bg-red-500 text-white" : "bg-blue-600 text-white"}`}>
                {item.badge}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function HeroGrid() {
  const siteData = await getSiteData();
  const hotCategories = siteData.hero?.hotCategories ?? [[], []];
  const entertainmentCategories = siteData.hero?.entertainmentCategories ?? [[], []];
  const popularStories = (siteData.hero?.popularStories ?? []).map((story) => ({ ...story, image: getStoryImage(story) }));
  const editorsPick = (siteData.hero?.editorsPick ?? []).map((story) => ({ ...story, image: getStoryImage(story) }));

  return (
    <section aria-label="Featured content" className="max-w-[1300px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr_290px] gap-0 border border-gray-200 bg-white">
        <aside aria-label="News categories" className="p-5 border-r border-gray-200">
          <SectionHeading title="Hot Categories" id="hot-categories" />
          <div className="grid grid-cols-2 gap-x-5 mb-7">
            <CatList items={hotCategories[0] ?? []} />
            <CatList items={hotCategories[1] ?? []} />
          </div>

          <SectionHeading title="Entertainment" id="entertainment-categories" />
          <div className="grid grid-cols-2 gap-x-5">
            <CatList items={entertainmentCategories[0] ?? []} />
            <CatList items={entertainmentCategories[1] ?? []} />
          </div>
        </aside>

        <section aria-labelledby="popular-heading" className="p-5 border-r border-gray-200">
          <SectionHeading title="Popular This Week" id="popular-heading" />
          <ol className="divide-y divide-gray-100">
            {popularStories.map((article, index) => (
              <li key={article.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <span className="text-[11px] font-black text-gray-300 w-5 flex-shrink-0 pt-1 leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <img src={article.image} alt={article.title} className="w-[100px] h-[65px] object-cover flex-shrink-0" loading="lazy" />
                <div className="flex flex-col justify-center gap-1">
                  <Link href={getStoryHref(article.slug)} className="text-[14px] font-semibold text-gray-800 hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </Link>
                  <p className="text-[12px] text-gray-400">by {article.author}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="editors-heading" className="p-5">
          <SectionHeading title="Editor's Pick" id="editors-heading" />
          <ol className="divide-y divide-gray-100">
            {editorsPick.map((article) => (
              <li key={article.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <img src={article.image} alt={article.title} className="w-[80px] h-[56px] object-cover flex-shrink-0" loading="lazy" />
                <div className="flex flex-col justify-center gap-1">
                  <Link href={getStoryHref(article.slug)} className="text-[13px] font-semibold text-gray-800 hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </Link>
                  <p className="text-[11px] text-gray-400">by {article.author}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}

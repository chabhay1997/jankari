"use client";

import { MouseEvent, useRef, useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import { HiMenu, HiSearch, HiX } from "react-icons/hi";
import {
  getStoryHref,
  getTopicChildrenFromData,
  getTopicHref,
  getTopicLabelFromTopics,
  getTopicSlugFromHref,
  type NavItem,
  type SiteData,
  type SocialLink,
} from "@/app/lib/siteData";

function getSocialIcon(platform: SocialLink["platform"]) {
  switch (platform) {
    case "facebook":
      return <FaFacebookF size={12} />;
    case "x":
      return <FaXTwitter size={12} />;
    case "instagram":
      return <FaInstagram size={12} />;
    case "youtube":
      return <FaYoutube size={12} />;
    case "email":
      return <MdEmail size={12} />;
    default:
      return <MdEmail size={12} />;
  }
}

function getSocialBg(platform: SocialLink["platform"]) {
  switch (platform) {
    case "facebook":
      return "bg-[#1877F2]";
    case "instagram":
      return "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]";
    case "youtube":
      return "bg-[#FF0000]";
    case "email":
      return "bg-gray-600";
    default:
      return "bg-black";
  }
}

export default function Header({ siteData }: { siteData: SiteData }) {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown((current) => (current === label ? null : label));
  };

  const handleDropdownClick = (event: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (item.dropdown) {
      event.preventDefault();
      toggleDropdown(item.label);
    }
  };

  const openMenuItem = siteData.navItems.find((item) => item.label === openDropdown);
  const openTopicSlug = openMenuItem ? getTopicSlugFromHref(openMenuItem.href) : "";
  const previewStories = (
    siteData.navPreviewMap?.[openTopicSlug]?.stories?.length
      ? siteData.navPreviewMap?.[openTopicSlug]?.stories
      : siteData.stories?.filter((entry) => entry.topic === openTopicSlug).slice(0, 4)
  ) ?? [];
  const previewSubtopics = getTopicChildrenFromData(siteData.topics, siteData.topicGroups, openTopicSlug)
    .filter((topic) => topic.slug !== "home")
    .slice(0, 8);
  const quickLinks = openMenuItem?.dropdown?.length
    ? openMenuItem.dropdown.slice(0, 8)
    : previewSubtopics.map((topic) => ({ label: topic.label, href: getTopicHref(topic.slug) }));
  const featuredPreview = previewStories[0];
  const storyList = previewStories.slice(featuredPreview ? 1 : 0, 4);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" aria-label="Bharat Jankari Home" className="flex-shrink-0 flex items-center gap-1.5">
          <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-white font-black text-sm leading-none">24*7 HH</span>
          </div>
          <div className="leading-none">
            <p className="text-blue-600 font-black text-[22px] tracking-tight leading-none">BHARAT</p>
            <p className="text-gray-700 font-bold text-[10px] tracking-[0.2em] leading-none mt-0.5">JANKARI</p>
          </div>
        </Link>

        <div className="flex-1 max-w-xl hidden md:flex">
          <label htmlFor="site-search" className="sr-only">Search news articles</label>
          <div className="flex w-full border border-gray-300 rounded overflow-hidden focus-within:border-blue-500 transition">
            <input
              id="site-search"
              type="search"
              placeholder="Type and hit enter..."
              className="flex-1 px-4 py-2 text-sm text-gray-700 outline-none bg-white"
            />
            <button aria-label="Search" className="bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
              <HiSearch size={18} />
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1.5 ml-auto">
          {siteData.socialLinks.map((link) => (
            <Link
              key={link.platform}
              href={link.href}
              aria-label={link.platform}
              className={`${getSocialBg(link.platform)} w-7 h-7 rounded flex items-center justify-center text-white hover:opacity-80 transition`}
            >
              {getSocialIcon(link.platform)}
            </Link>
          ))}
          <button onClick={() => setSideMenuOpen(true)} aria-label="Open menu" className="ml-2 text-gray-700 hover:text-blue-600 transition">
            <HiMenu size={22} />
          </button>
        </div>

        <div className="flex md:hidden items-center gap-3 ml-auto">
          <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Toggle search"><HiSearch size={20} /></button>
          <button onClick={() => setSideMenuOpen(!sideMenuOpen)} aria-label="Toggle menu">
            {sideMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <input type="search" placeholder="Type and hit enter..." className="flex-1 px-4 py-2 text-sm outline-none" />
            <button className="bg-blue-600 px-4 py-2 text-white"><HiSearch size={18} /></button>
          </div>
        </div>
      )}

      <nav aria-label="Main navigation" className="border-t border-gray-100 bg-white">
        <div className="max-w-[1300px] mx-auto px-4 relative" onMouseLeave={handleMouseLeave}>
          <ul className="hidden md:flex items-center justify-between">
            <div className="flex items-center">
              {siteData.navItems.map((item) => (
                <li key={item.href} className="relative" onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}>
                  <Link
                    href={item.href}
                    onClick={(event) => handleDropdownClick(event, item)}
                    aria-haspopup={item.dropdown ? "true" : undefined}
                    aria-expanded={openDropdown === item.label ? "true" : "false"}
                    className="group flex items-center gap-1 px-3 py-3.5 text-[13px] font-bold text-gray-800 hover:text-blue-600 transition-colors relative whitespace-nowrap"
                  >
                    {item.label}
                    {item.badge && item.badgeRed && (
                      <span className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded leading-none">
                        {item.badge}
                      </span>
                    )}
                    {item.dropdown && (
                      <FiChevronDown
                        size={13}
                        className={`opacity-50 transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`}
                      />
                    )}
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                  </Link>

                </li>
              ))}
            </div>

            <div className="flex items-center gap-3 ml-4">
              <time dateTime={new Date().toISOString().split("T")[0]} className="text-xs text-gray-500 whitespace-nowrap hidden lg:block">
                {today}
              </time>
              <Link href="/about-us" className="text-xs font-bold text-gray-700 border border-gray-300 px-3 py-1.5 hover:bg-gray-100 transition rounded-sm">
                AB
              </Link>
            </div>
          </ul>

          {openMenuItem && openDropdown && openTopicSlug !== "home" && (
            <div
              className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-2xl z-50 py-6"
              onMouseEnter={() => handleMouseEnter(openMenuItem.label)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-[1300px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px] gap-6">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Browse {getTopicLabelFromTopics(siteData.topics, openTopicSlug)}</p>
                      <p className="text-sm text-gray-500 mt-1">Quick category jumps for this section.</p>
                    </div>
                    <Link href={openMenuItem.href} className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    {quickLinks.map((category) => (
                      <Link key={category.href} href={category.href} className="block rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition">
                        {category.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-4">Featured Blogs</p>
                  {featuredPreview ? (
                    <div className="grid gap-4">
                      <Link href={getStoryHref(featuredPreview.slug)} className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 hover:border-blue-200 hover:shadow-sm transition md:grid-cols-[220px_minmax(0,1fr)]">
                        <div className="overflow-hidden rounded-xl bg-gray-100">
                          <img src={featuredPreview.image} alt={featuredPreview.title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">{getTopicLabelFromTopics(siteData.topics, featuredPreview.topic)}</p>
                          <h3 className="mt-2 text-xl font-black leading-snug text-gray-900">{featuredPreview.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-3">{featuredPreview.excerpt}</p>
                          <p className="mt-3 text-xs text-gray-400">by {featuredPreview.author}</p>
                        </div>
                      </Link>

                      <div className="grid gap-3 md:grid-cols-3">
                        {storyList.map((entry) => (
                          <Link key={entry.slug} href={getStoryHref(entry.slug)} className="rounded-xl border border-gray-200 bg-gray-50 p-4 hover:border-blue-200 hover:bg-blue-50 transition">
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">{getTopicLabelFromTopics(siteData.topics, entry.topic)}</p>
                            <p className="mt-2 text-sm font-semibold text-gray-900 leading-snug line-clamp-3">{entry.title}</p>
                            <p className="mt-2 text-xs text-gray-500">by {entry.author}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                      Fresh preview stories for this section will appear here soon.
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-4">Ideas For Readers</p>
                  <div className="space-y-3">
                    <Link href={openMenuItem.href} className="block rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 hover:border-blue-200 hover:bg-blue-50 transition">
                      <p className="text-sm font-semibold text-gray-900">Explore all {getTopicLabelFromTopics(siteData.topics, openTopicSlug)} blogs</p>
                      <p className="mt-1 text-xs text-gray-500">Open the full section page with latest stories first.</p>
                    </Link>
                    {previewSubtopics.slice(0, 3).map((topic) => (
                      <Link key={topic.slug} href={getTopicHref(topic.slug)} className="block rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 hover:border-blue-200 hover:bg-blue-50 transition">
                        <p className="text-sm font-semibold text-gray-900">{topic.label}</p>
                        <p className="mt-1 text-xs text-gray-500">Jump into this focused subcategory.</p>
                      </Link>
                    ))}
                    <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Dynamic Source</p>
                      <p className="mt-2 text-sm text-gray-600">
                        This menu now uses backend preview data when available, so blog recommendations can stay updated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${sideMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setSideMenuOpen(false)}
      />
      <aside className={`fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ${sideMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500">Menu</p>
            <p className="text-xs text-gray-500">Browse the site sections</p>
          </div>
          <button onClick={() => setSideMenuOpen(false)} aria-label="Close menu" className="text-gray-700 hover:text-blue-600 transition">
            <HiX size={24} />
          </button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          <nav className="space-y-1">
            {siteData.navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition"
                  onClick={() => setSideMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
                        onClick={() => setSideMenuOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-3">Services</p>
            <div className="space-y-2">
              {siteData.services.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="block rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                  onClick={() => setSideMenuOpen(false)}
                >
                  {service.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-5 py-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Bharat Jankari. All rights reserved.
        </div>
      </aside>
    </header>
  );
}

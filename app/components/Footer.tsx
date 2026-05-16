import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaRss, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { getSiteData, getStoryHrefWithSource, getStoryImage, type SocialLink } from "@/app/lib/siteData";

function getSocialIcon(platform: SocialLink["platform"]) {
  switch (platform) {
    case "facebook":
      return <FaFacebookF size={13} />;
    case "x":
      return <FaXTwitter size={13} />;
    case "instagram":
      return <FaInstagram size={13} />;
    case "youtube":
      return <FaYoutube size={13} />;
    case "linkedin":
      return <FaLinkedinIn size={13} />;
    case "email":
      return <MdEmail size={13} />;
    default:
      return <FaRss size={13} />;
  }
}

export default async function Footer() {
  const siteData = await getSiteData();
  const socialLinks = siteData.socialLinks ?? [];
  const usefulLinks = siteData.footer?.usefulLinks ?? [];
  const editorsPicks = (siteData.footer?.editorsPicks ?? []).slice(0, 4).map((story) => ({ ...story, image: getStoryImage(story) }));
  const latestArticles = (siteData.footer?.latestArticles ?? []).slice(0, 4).map((story) => ({ ...story, image: getStoryImage(story) }));
  const bottomLinks = siteData.footer?.bottomLinks ?? [];

  return (
    <footer className="bg-[#1c1c1c] text-gray-300">
      <div className="bg-[#111] py-5 px-4">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl flex-1 text-[14px] leading-6 text-gray-300">
            Subscribe for fresh Bharat Jankari updates across tech, money, travel, health, and entertainment.
          </p>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:max-w-[720px]">
            <label htmlFor="footer-name" className="sr-only">Your name</label>
            <input id="footer-name" type="text" placeholder="Name..." className="w-full min-w-0 border border-gray-700 bg-[#222] px-4 py-3 text-[14px] text-gray-300 outline-none transition focus:border-blue-500" />
            <label htmlFor="footer-email" className="sr-only">Your email</label>
            <input id="footer-email" type="email" placeholder="Email..." className="w-full min-w-0 border border-gray-700 bg-[#222] px-4 py-3 text-[14px] text-gray-300 outline-none transition focus:border-blue-500" />
            <button className="w-full whitespace-nowrap bg-gray-100 px-6 py-3 text-[13px] font-bold text-black transition hover:bg-white sm:w-auto">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Link href="/" aria-label="Bharat Jankari" className="flex items-center gap-1.5 mb-4">
              <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-white font-black text-sm">24 H</span>
              </div>
              <div>
                <p className="text-blue-500 font-black text-[22px] tracking-tight leading-none">BHARAT</p>
                <p className="text-gray-400 font-bold text-[10px] tracking-[0.2em] leading-none mt-0.5">JANKARI</p>
              </div>
            </Link>
            <p className="text-[14px] text-gray-400 leading-relaxed mb-5">
              Bharat Jankari covers practical stories from across India and beyond, with a clear focus on relevance, readability, and daily usefulness.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <Link key={social.platform + social.href} href={social.href} aria-label={social.platform} className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white transition">
                  {getSocialIcon(social.platform)}
                </Link>
              ))}
            </div>
          </div>

          <nav aria-label="Useful links">
            <h3 className="text-white font-bold text-[13px] uppercase tracking-wider mb-4 pb-2 border-b-2 border-blue-600 inline-block">
              Useful Links
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
              {usefulLinks.map((link) => (
                <Link key={link.href + link.label} href={link.href} className="text-[13px] text-gray-400 hover:text-blue-400 transition-colors leading-snug">
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <section aria-labelledby="footer-editors">
            <h3 id="footer-editors" className="text-white font-bold text-[13px] uppercase tracking-wider mb-4 pb-2 border-b-2 border-blue-600 inline-block">
              Editor&apos;s Picks
            </h3>
            <ul className="flex flex-col gap-4 mt-3">
              {editorsPicks.map((item) => (
                <li key={item.slug} className="flex gap-3 items-start">
                  <img src={item.image} alt={item.title} className="w-16 h-14 object-cover flex-shrink-0" loading="lazy" />
                  <Link href={getStoryHrefWithSource(item.slug, "footer")} className="text-[13px] text-gray-300 hover:text-blue-400 transition-colors leading-snug">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="footer-latest">
            <h3 id="footer-latest" className="text-white font-bold text-[13px] uppercase tracking-wider mb-4 pb-2 border-b-2 border-blue-600 inline-block">
              Latest Articles
            </h3>
            <ul className="flex flex-col gap-3 mt-3">
              {latestArticles.map((article) => (
                <li key={article.slug} className="pb-3 border-b border-gray-700 last:border-0">
                  <Link href={getStoryHrefWithSource(article.slug, "footer")} className="text-[13px] text-gray-300 hover:text-blue-400 transition-colors leading-snug">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 px-4">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-[12px] text-gray-500">
            ©2026 Bharat Jankari. All rights reserved.
          </p>
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-5">
            {bottomLinks.map((link) => (
              <Link key={link.href + link.label} href={link.href} className="text-[12px] text-gray-400 hover:text-blue-400 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

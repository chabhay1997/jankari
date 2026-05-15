import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getSiteData } from "@/app/lib/siteData";

export const metadata = {
  title: "Contact Bharat Jankari | Editorial, Partnership and Corrections",
  description: "Contact Bharat Jankari for editorial questions, partnership opportunities, corrections, and reader support related to India news, business, health, technology, and trading stories.",
  keywords: [
    "contact Bharat Jankari",
    "Bharat Jankari editorial contact",
    "news corrections contact India",
    "partnership contact Bharat Jankari",
  ],
  alternates: {
    canonical: "/contact-us",
  },
  openGraph: {
    title: "Contact Bharat Jankari | Editorial, Partnership and Corrections",
    description: "Contact Bharat Jankari for editorial questions, partnership opportunities, corrections, and reader support related to India news, business, health, technology, and trading stories.",
    url: "/contact-us",
    type: "website",
    siteName: "Bharat Jankari",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Bharat Jankari | Editorial, Partnership and Corrections",
    description: "Contact Bharat Jankari for editorial questions, partnership opportunities, corrections, and reader support related to India news, business, health, technology, and trading stories.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ContactUsPage() {
  const siteData = await getSiteData();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header siteData={siteData} />
      <main className="max-w-[980px] mx-auto px-4 py-8">
        <section className="bg-white border border-gray-200 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-3">Contact</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">Get in touch</h1>
          <div className="mt-5 space-y-4 text-gray-700 leading-7">
            <p>For editorial questions, partnerships, or corrections, reach the Bharat Jankari team through your preferred published contact channel.</p>
            <p>This route now exists as a proper page so the header and footer contact links land somewhere real instead of a blank placeholder.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

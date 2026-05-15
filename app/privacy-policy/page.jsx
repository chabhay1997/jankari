import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getSiteData } from "@/app/lib/siteData";

export const metadata = {
  title: "Privacy Policy | Bharat Jankari",
  description: "Read the Bharat Jankari privacy policy to understand how this India news and blog platform handles reader data, privacy expectations, and site usage information.",
  keywords: [
    "Bharat Jankari privacy policy",
    "news website privacy policy India",
    "reader privacy Bharat Jankari",
  ],
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Bharat Jankari",
    description: "Read the Bharat Jankari privacy policy to understand how this India news and blog platform handles reader data, privacy expectations, and site usage information.",
    url: "/privacy-policy",
    type: "website",
    siteName: "Bharat Jankari",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Bharat Jankari",
    description: "Read the Bharat Jankari privacy policy to understand how this India news and blog platform handles reader data, privacy expectations, and site usage information.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function PrivacyPolicyPage() {
  const siteData = await getSiteData();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header siteData={siteData} />
      <main className="max-w-[980px] mx-auto px-4 py-8">
        <section className="bg-white border border-gray-200 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-3">Privacy Policy</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">Privacy matters</h1>
          <div className="mt-5 space-y-4 text-gray-700 leading-7">
            <p>Bharat Jankari respects reader privacy and keeps data collection expectations visible and understandable.</p>
            <p>This page is ready for your full policy copy whenever you want to drop it in.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

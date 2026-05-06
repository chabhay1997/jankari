import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getSiteData } from "@/app/lib/siteData";

export default async function DisclaimerPage() {
  const siteData = await getSiteData();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header siteData={siteData} />
      <main className="max-w-[980px] mx-auto px-4 py-8">
        <section className="bg-white border border-gray-200 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-3">Disclaimer</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">Editorial disclaimer</h1>
          <div className="mt-5 space-y-4 text-gray-700 leading-7">
            <p>Content on Bharat Jankari is intended for general information and editorial reading, not as a substitute for professional legal, financial, or medical advice.</p>
            <p>This placeholder keeps the route valid for navigation today and can be replaced with your final legal copy anytime.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

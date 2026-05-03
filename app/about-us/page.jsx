import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <main className="max-w-[980px] mx-auto px-4 py-8">
        <section className="bg-white border border-gray-200 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-3">About Us</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">Bharat Jankari</h1>
          <div className="mt-5 space-y-4 text-gray-700 leading-7">
            <p>Bharat Jankari is built for readers who want sharp, readable coverage across health, business, tech, travel, entertainment, and everyday life.</p>
            <p>We focus on practical reporting, clear presentation, and stories that stay useful after the first click.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

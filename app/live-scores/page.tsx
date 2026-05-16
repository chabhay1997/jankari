import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import IplLiveBoard from "@/app/components/IplLiveBoard";
import { fetchIplLiveData } from "@/app/lib/iplLive";
import { getSiteData } from "@/app/lib/siteData";

export default async function LiveScoresPage() {
  const [siteData, iplData] = await Promise.all([getSiteData(), fetchIplLiveData()]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header siteData={siteData} />
      <main className="mx-auto max-w-[1280px] px-4 py-8">
        <IplLiveBoard initialData={iplData} />
      </main>
      <Footer />
    </div>
  );
}

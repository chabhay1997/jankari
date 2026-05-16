import { getAudienceOverview, isSmtpConfigured } from "@/app/lib/audienceStore";

export default async function AudiencePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q || "";
  const { summary, subscribers } = await getAudienceOverview(query);
  const smtpReady = isSmtpConfigured();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">Audience</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Subscribers and preferences</h1>
            <p className="mt-2 text-sm text-slate-600">
              {smtpReady ? "SMTP is configured and daily digest hook is ready." : "SMTP env missing, so digest sender stays in pending-config mode for now."}
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search name, email, topics"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <button className="rounded-2xl bg-slate-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white">
              Search
            </button>
          </form>
        </div>

        <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">
            Showing {summary.filteredSubscribers} of {summary.totalSubscribers} subscribers.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Topics</th>
                  <th className="pb-3 pr-4">Prefs</th>
                  <th className="pb-3 pr-4">Digest</th>
                  <th className="pb-3 pr-4">Updated</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-t border-slate-100 align-top">
                    <td className="py-3 pr-4 font-semibold text-slate-900">{subscriber.name}</td>
                    <td className="py-3 pr-4 text-slate-600">{subscriber.email}</td>
                    <td className="py-3 pr-4 text-slate-600">{subscriber.topics.join(", ") || "General"}</td>
                    <td className="py-3 pr-4 text-slate-600">
                      {subscriber.dailyBriefing ? "Daily" : "No daily"}
                      {" / "}
                      {subscriber.nearbyNews ? "Nearby on" : "Nearby off"}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{subscriber.digestStatus}</td>
                    <td className="py-3 pr-4 text-slate-500">{new Date(subscriber.lastUpdatedAt).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

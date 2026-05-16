import Link from "next/link";
import { getAudienceOverview } from "@/app/lib/audienceStore";

function SummaryCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{hint}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const { summary, recentEvents } = await getAudienceOverview();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Audience summary</h1>
          </div>
          <Link href="/admin/audience" className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
            Open Audience Page
          </Link>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Subscribers" value={summary.totalSubscribers} hint="Saved newsletter readers" />
          <SummaryCard label="Unique Visitors" value={summary.uniqueVisitors} hint="Unique sessions recorded from page views" />
          <SummaryCard label="Page Views" value={summary.totalPageViews} hint="Total visit count across tracked pages" />
          <SummaryCard label="Audience Events" value={summary.totalEvents} hint="All consent, visit, and subscribe actions" />
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Cookie Accepted" value={summary.cookieAccepted} hint="Readers who allowed preference cookies" />
          <SummaryCard label="Cookie Rejected" value={summary.cookieRejected} hint="Readers who denied preference cookies" />
          <SummaryCard label="Location Allowed" value={summary.locationAllowed} hint="Readers who enabled nearby boosting" />
          <SummaryCard label="Location Blocked" value={summary.locationBlocked} hint="Readers who skipped or denied location" />
        </section>

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">Recent Activity</p>
              <h2 className="mt-2 text-xl font-black text-slate-950">Latest audience events</h2>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3 pr-4">Time</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Path</th>
                  <th className="pb-3 pr-4">Session</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => (
                  <tr key={event.id} className="border-t border-slate-100">
                    <td className="py-3 pr-4 text-slate-600">{new Date(event.createdAt).toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-4 font-semibold text-slate-900">{event.type}</td>
                    <td className="py-3 pr-4 text-slate-600">{event.path}</td>
                    <td className="py-3 pr-4 text-slate-500">{event.sessionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

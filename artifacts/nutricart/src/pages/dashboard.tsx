import { useGetDashboardSummary } from "@workspace/api-client-react";
import { Pill, ShieldAlert, Sparkles, Bell, ArrowRight, Wallet } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data, isLoading } = useGetDashboardSummary();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="h-10 w-48 bg-[#DCE6E1]/50 rounded-lg animate-pulse" />
        <div className="h-4 w-96 bg-[#DCE6E1]/50 rounded-lg animate-pulse mt-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-[#DCE6E1]/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const summary = data;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-12">
      <header>
        <h1 className="font-serif text-[32px] font-semibold text-[#0A2E25] tracking-tight">Dashboard</h1>
        <p className="text-[#52655D] mt-2 text-[15px]">Here's what's happening with your pharmacy items today.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card title="Active Rx" value={summary?.activeMedicationsCount || 0} icon={Pill} color="bg-[#E4EFEA] text-[#114C3E]" href="/medications" />
        <Card title="Upcoming Refills" value={summary?.upcomingRemindersCount || 0} icon={Bell} color="bg-[#FFE7DE] text-[#D65C3C]" href="/reminders" />
        <Card title="Total Saved" value={`$${(summary?.totalSavedAllTime || 0).toFixed(2)}`} icon={Wallet} color="bg-[#F3F7F5] text-[#0A2E25]" href="/savings" />
        <Card title="Safety Flags" value={summary?.interactionFlagsCount || 0} icon={ShieldAlert} color="bg-red-100 text-red-600" href="/interactions" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-[#DCE6E1]/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#DCE6E1]/60 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-serif font-semibold text-lg text-[#0A2E25] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF7A59]" />
              Recent Savings
            </h2>
            <Link href="/savings" className="text-[#114C3E] text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-0">
            {summary?.recentSavings && summary.recentSavings.length > 0 ? (
              <div className="divide-y divide-[#DCE6E1]/40">
                {summary.recentSavings.map((saving) => (
                  <div key={saving.id} className="flex justify-between items-center p-6 hover:bg-[#F3F7F5]/50 transition-colors">
                    <div>
                      <h4 className="font-medium text-[#142621]">{saving.medicationName}</h4>
                      <p className="text-sm text-[#52655D] mt-1">{saving.pharmacyName} · {new Date(saving.purchaseDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-[#114C3E]">
                        +${saving.savedAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-[#8AA79B] mt-1">Saved</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center">
                <Wallet className="w-8 h-8 text-[#8AA79B] mx-auto mb-3 opacity-50" />
                <p className="text-[#52655D] text-sm">No recent savings recorded.</p>
                <Link href="/prices" className="mt-3 inline-block text-sm text-[#FF7A59] font-medium hover:underline">Compare prices now</Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#DCE6E1]/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#DCE6E1]/60 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-serif font-semibold text-lg text-[#0A2E25] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FF7A59]" />
              Action Needed
            </h2>
            <Link href="/reminders" className="text-[#114C3E] text-sm font-medium hover:underline flex items-center gap-1">
              Calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-0">
            {summary?.upcomingReminders && summary.upcomingReminders.length > 0 ? (
              <div className="divide-y divide-[#DCE6E1]/40">
                {summary.upcomingReminders.map((reminder) => (
                  <div key={reminder.id} className="flex justify-between items-center p-6 hover:bg-[#F3F7F5]/50 transition-colors">
                    <div>
                      <h4 className="font-medium text-[#142621]">{reminder.medicationName}</h4>
                      <p className="text-sm text-[#52655D] mt-1">Refill due {new Date(reminder.refillDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[#FFE7DE] text-[#D65C3C]">
                        {reminder.currentSupplyDays} days left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center">
                <Pill className="w-8 h-8 text-[#8AA79B] mx-auto mb-3 opacity-50" />
                <p className="text-[#52655D] text-sm">All caught up on refills.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon: Icon, color, href }: { title: string, value: string | number, icon: any, color: string, href: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white p-6 rounded-3xl border border-[#DCE6E1]/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(10,46,37,0.1)] hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[13px] font-medium text-[#52655D] tracking-wide">{title}</p>
            <h3 className="font-serif text-[34px] font-semibold text-[#0A2E25] mt-2 leading-none">{value}</h3>
          </div>
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon className="w-[22px] h-[22px]" />
          </div>
        </div>
      </div>
    </Link>
  );
}

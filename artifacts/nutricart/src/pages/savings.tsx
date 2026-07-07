import { useGetSavingsSummary, useListSavings } from "@workspace/api-client-react";
import { Wallet, TrendingUp, Receipt, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Savings() {
  const { data: summary, isLoading: summaryLoading } = useGetSavingsSummary();
  const { data: history, isLoading: historyLoading } = useListSavings();

  if (summaryLoading || historyLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-3xl border border-[#DCE6E1]/60" />)}
        </div>
        <div className="h-64 bg-white rounded-3xl border border-[#DCE6E1]/60" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12">
      <header>
        <h1 className="font-serif text-[32px] font-semibold text-[#0A2E25] tracking-tight">Savings Tracker</h1>
        <p className="text-[#52655D] mt-2 text-[15px]">See how much you've saved by comparing prices and using coupons.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#114C3E] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
          <p className="text-sm font-medium text-[#A9C2B8] uppercase tracking-wider mb-2">Total Saved</p>
          <div className="font-serif text-5xl font-semibold mb-4">${summary?.totalSaved.toFixed(2)}</div>
          <div className="inline-flex items-center text-sm font-medium text-[#E4EFEA] bg-white/10 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 mr-1.5" /> Across {summary?.savingsCount} purchases
          </div>
        </div>

        <div className="bg-white border border-[#DCE6E1]/60 rounded-3xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
          <p className="text-sm font-medium text-[#8AA79B] uppercase tracking-wider mb-2">Average Saving</p>
          <div className="font-serif text-4xl font-semibold text-[#0A2E25] mb-4">${summary?.avgSavingPerPurchase.toFixed(2)}</div>
          <div className="text-sm text-[#52655D] flex items-center gap-2">
            <Receipt className="w-4 h-4" /> Per transaction
          </div>
        </div>

        <div className="bg-white border border-[#DCE6E1]/60 rounded-3xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
          <p className="text-sm font-medium text-[#8AA79B] uppercase tracking-wider mb-2">Top Pharmacy</p>
          <div className="font-serif text-3xl font-semibold text-[#0A2E25] mb-4 leading-tight">{summary?.topPharmacy || "N/A"}</div>
          <div className="text-sm text-[#52655D] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FF7A59]" /> Best deals found here
          </div>
        </div>
      </div>

      {summary?.monthlySavings && summary.monthlySavings.length > 0 && (
        <div className="bg-white border border-[#DCE6E1]/60 rounded-3xl p-8 shadow-sm">
          <h3 className="font-serif text-xl font-semibold text-[#0A2E25] mb-6">Savings over time</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.monthlySavings} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8AA79B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8AA79B', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  cursor={{ fill: '#F3F7F5' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)', color: '#142621' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Saved']}
                />
                <Bar dataKey="saved" fill="#114C3E" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-serif text-xl font-semibold text-[#0A2E25] mb-4">Recent Transactions</h3>
        <div className="bg-white border border-[#DCE6E1]/60 rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-[#DCE6E1]/60 text-[12px] font-semibold text-[#8AA79B] uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Medication</th>
                <th className="px-6 py-4">Pharmacy</th>
                <th className="px-6 py-4 text-right">Paid</th>
                <th className="px-6 py-4 text-right">Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6E1]/40">
              {history?.map(entry => (
                <tr key={entry.id} className="hover:bg-[#F3F7F5]/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-[#52655D]">
                    {new Date(entry.purchaseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#142621]">{entry.medicationName}</td>
                  <td className="px-6 py-4 text-sm text-[#52655D]">
                    {entry.pharmacyName}
                    {entry.couponUsed && (
                      <span className="block text-[10px] font-mono text-[#FF7A59] mt-0.5">Code: {entry.couponUsed}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm">${entry.paidPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-[#114C3E]">+${entry.savedAmount.toFixed(2)}</td>
                </tr>
              ))}
              {history?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#8AA79B]">
                    No savings recorded yet. Search for prices and log your purchases to start tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

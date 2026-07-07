import { useGetInteractions } from "@workspace/api-client-react";
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";

export default function Interactions() {
  const { data: report, isLoading } = useGetInteractions();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-[#DCE6E1]/50 rounded-lg" />
        <div className="h-48 bg-white rounded-3xl border border-[#DCE6E1]/60" />
      </div>
    );
  }

  const isClear = report?.isClear || report?.flags.length === 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <h1 className="font-serif text-[32px] font-semibold text-[#0A2E25] tracking-tight">Interaction Check</h1>
        <p className="text-[#52655D] mt-2 text-[15px]">AI safety review of your current medication combinations.</p>
      </header>

      {isClear ? (
        <div className="bg-[#114C3E] text-white rounded-3xl p-10 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent_40%)] pointer-events-none" />
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm">
            <ShieldCheck className="w-10 h-10 text-[#A9C2B8]" />
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-3 relative z-10">Clear to Proceed</h2>
          <p className="text-[#A9C2B8] max-w-md relative z-10">
            Based on your profile, we didn't find any known severe interactions among your active medications.
          </p>
          <div className="mt-8 pt-6 border-t border-white/10 text-xs font-mono tracking-widest uppercase text-[#8AA79B] relative z-10">
            {report?.checkedMedications.length} items verified · Last checked today
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex gap-4">
            <div className="bg-red-100 rounded-full p-2 h-fit shrink-0">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 text-lg">Attention Required</h3>
              <p className="text-red-700 mt-1">We found {report?.flags.length} potential interaction(s) in your profile. Please consult your pharmacist or doctor before taking these together.</p>
            </div>
          </div>

          <div className="grid gap-6">
            {report?.flags.map((flag, i) => {
              const Icon = flag.severity === 'severe' ? ShieldAlert : flag.severity === 'moderate' ? AlertTriangle : AlertCircle;
              const severityColors = {
                severe: 'bg-red-50 border-red-200 text-red-700',
                moderate: 'bg-orange-50 border-orange-200 text-orange-700',
                mild: 'bg-yellow-50 border-yellow-200 text-yellow-700'
              };

              return (
                <div key={i} className="bg-white border border-[#DCE6E1]/60 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${severityColors[flag.severity].split(' ')[0]} ${severityColors[flag.severity].split(' ')[2]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex gap-2">
                          {flag.medications.map((m, j) => (
                            <span key={j} className="font-mono text-sm font-semibold bg-[#F3F7F5] px-2 py-1 rounded text-[#142621]">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full font-bold border ${severityColors[flag.severity]}`}>
                      {flag.severity}
                    </span>
                  </div>
                  
                  <div className="pl-12">
                    <p className="text-[#142621] font-medium">{flag.description}</p>
                    {flag.recommendation && (
                      <div className="mt-4 bg-[#F3F7F5] p-4 rounded-xl border border-[#DCE6E1]/60">
                        <span className="text-[11px] font-bold tracking-widest uppercase text-[#114C3E] mb-2 block">Recommendation</span>
                        <p className="text-[#52655D] text-sm leading-relaxed">{flag.recommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <p className="text-xs text-center text-[#8AA79B] mt-8">
        NutriCart provides safety screening based on standard pharmacy databases, but cannot replace professional medical advice.
      </p>
    </div>
  );
}

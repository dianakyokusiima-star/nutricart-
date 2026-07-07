import { useGetRecommendations } from "@workspace/api-client-react";
import { Sparkles, ArrowRight, Lightbulb, Wallet, Pill, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function Recommendations() {
  const { data: recs, isLoading } = useGetRecommendations();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-[#DCE6E1]/50 rounded-lg" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-3xl border border-[#DCE6E1]/50" />)}
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'savings_tip': return Wallet;
      case 'generic_alternative': return Pill;
      case 'interaction_warning': return AlertTriangle;
      default: return Lightbulb;
    }
  };

  const getRelevanceStyle = (relevance: string) => {
    switch(relevance) {
      case 'high': return 'bg-red-50 text-red-700 border-red-100';
      case 'medium': return 'bg-orange-50 text-orange-700 border-orange-100';
      default: return 'bg-[#F3F7F5] text-[#52655D] border-[#DCE6E1]';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <h1 className="font-serif text-[32px] font-semibold text-[#0A2E25] tracking-tight flex items-center gap-3">
          AI Recommendations
          <Sparkles className="w-6 h-6 text-[#FF7A59]" />
        </h1>
        <p className="text-[#52655D] mt-2 text-[15px]">Personalized insights to save money and optimize your pharmacy routine.</p>
      </header>

      {recs?.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCE6E1]/60 p-16 text-center">
          <Lightbulb className="w-12 h-12 text-[#8AA79B] mx-auto mb-4 opacity-50" />
          <h3 className="font-serif text-xl font-semibold text-[#0A2E25] mb-2">You're all optimized!</h3>
          <p className="text-[#52655D]">Our AI doesn't see any immediate savings or safety alerts for your profile.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {recs?.sort((a,b) => a.relevance === 'high' ? -1 : 1).map(rec => {
            const Icon = getTypeIcon(rec.type);
            return (
              <div key={rec.id} className="bg-white rounded-3xl border border-[#DCE6E1]/60 p-6 sm:p-8 hover:shadow-md transition-shadow relative overflow-hidden group">
                {rec.relevance === 'high' && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#FF7A59]" />
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${rec.relevance === 'high' ? 'bg-[#FFE7DE] text-[#D65C3C]' : 'bg-[#E4EFEA] text-[#114C3E]'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded border font-semibold ${getRelevanceStyle(rec.relevance)}`}>
                    {rec.relevance} priority
                  </span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-[#142621] mb-2">{rec.title}</h3>
                <p className="text-[#52655D] text-sm leading-relaxed mb-6">
                  {rec.description}
                </p>

                <div className="flex items-center justify-between border-t border-[#DCE6E1]/50 pt-5 mt-auto">
                  {rec.estimatedSavings ? (
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#8AA79B] mb-0.5">Est. Savings</div>
                      <div className="font-serif text-xl font-bold text-[#114C3E]">+${rec.estimatedSavings}</div>
                    </div>
                  ) : <div />}
                  
                  {rec.actionLabel && (
                    <Link href={rec.type === 'interaction_warning' ? '/interactions' : '/prices'} className="text-sm font-semibold text-[#114C3E] hover:text-[#0A2E25] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      {rec.actionLabel} <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

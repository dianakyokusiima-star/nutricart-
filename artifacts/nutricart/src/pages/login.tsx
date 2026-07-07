import { useAuth } from "@workspace/replit-auth-web";
import { Pill } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F3F7F5] font-sans selection:bg-[#FF7A59] selection:text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.35] bg-[radial-gradient(circle_at_top_right,_#114C3E,_transparent_50%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[radial-gradient(circle_at_bottom_left,_#FF7A59,_transparent_40%)]" />
      
      <header className="px-6 py-6 md:px-10 md:py-8 flex items-center justify-between z-10 relative max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#114C3E] flex items-center justify-center relative overflow-hidden shadow-lg shadow-[#114C3E]/20">
             <svg width="24" height="24" viewBox="0 0 128 128" fill="none">
               <rect x="4" y="4" width="120" height="120" rx="28" fill="#114C3E"/>
               <circle cx="94" cy="30" r="5" fill="#FF7A59"/>
               <path d="M40 92 Q64 104 88 92" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round"/>
               <circle cx="47" cy="100" r="6.5" fill="#FFFFFF"/>
               <circle cx="81" cy="100" r="6.5" fill="#FFFFFF"/>
               <rect x="54" y="28" width="20" height="56" rx="6" fill="#FFFFFF"/>
               <rect x="32" y="50" width="64" height="20" rx="6" fill="#FFFFFF"/>
             </svg>
          </div>
          <span className="font-serif font-semibold text-[22px] text-[#114C3E] tracking-tight">
            Nutri<em className="not-italic text-[#D65C3C]">Cart</em>
          </span>
        </div>
        <button 
          onClick={login} 
          className="bg-[#114C3E] hover:bg-[#0A2E25] text-white rounded-full px-7 py-3 text-sm font-semibold shadow-[0_10px_24px_-8px_rgba(10,46,37,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          Sign in
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 animate-in fade-in zoom-in-95 duration-700 ease-out pb-20">
        <div className="font-mono text-[11.5px] font-bold tracking-[0.15em] uppercase text-[#D65C3C] mb-8 flex items-center gap-3 bg-white/60 px-5 py-2.5 rounded-full border border-[#DCE6E1]/50 shadow-sm backdrop-blur-sm">
          <span className="w-[6px] h-[6px] rounded-full bg-[#FF7A59] animate-pulse" />
          AI pharmacy shopping assistant
        </div>
        
        <h1 className="font-serif font-semibold text-[44px] sm:text-[56px] md:text-[72px] text-[#0A2E25] tracking-tight leading-[1.05] max-w-4xl drop-shadow-sm">
          Your pharmacy,<br />powered by <span className="text-[#D65C3C] relative inline-block">
            AI.
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#FF7A59]/20 rounded-full"></span>
          </span>
        </h1>
        
        <p className="mt-8 text-[17px] md:text-[19px] text-[#52655D] max-w-[600px] leading-[1.65]">
          NutriCart compares prices across pharmacies, flags interactions, and keeps every prescription and refill organized — all from a single, quiet command center.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <button 
            onClick={login} 
            className="w-full sm:w-auto bg-[#114C3E] hover:bg-[#0A2E25] text-white rounded-full px-9 py-4 text-base font-semibold shadow-[0_14px_30px_-10px_rgba(10,46,37,0.4)] transition-all hover:-translate-y-1 active:translate-y-0"
          >
            Get Started — It's Free
          </button>
        </div>

        <div className="mt-20 flex items-center justify-center gap-8 md:gap-12 font-mono text-[11px] font-medium text-[#52655D]/70 tracking-widest uppercase flex-wrap max-w-2xl">
          <span className="flex items-center gap-2"><Pill className="w-4 h-4 text-[#114C3E]/50" /> Price Comparison</span>
          <span className="flex items-center gap-2"><Pill className="w-4 h-4 text-[#114C3E]/50" /> Interaction Checks</span>
          <span className="flex items-center gap-2"><Pill className="w-4 h-4 text-[#114C3E]/50" /> Smart Refills</span>
        </div>
      </main>
    </div>
  )
}

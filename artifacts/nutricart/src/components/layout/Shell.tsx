import { Link, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Pill, Activity, ShieldAlert, Search, Wallet, Bell, Sparkles, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Activity },
  { href: "/medications", label: "Medications", icon: Pill },
  { href: "/interactions", label: "Interactions", icon: ShieldAlert },
  { href: "/prices", label: "Price Search", icon: Search },
  { href: "/savings", label: "Savings", icon: Wallet },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/recommendations", label: "Recommendations", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-[100dvh] flex bg-[#F3F7F5] text-[#142621]">
      <aside className="w-72 flex-shrink-0 bg-[#0A2E25] text-white flex flex-col overflow-y-auto">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-10 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-[#114C3E] flex items-center justify-center relative overflow-hidden shadow-inner">
               <svg width="22" height="22" viewBox="0 0 128 128" fill="none">
                 <rect x="4" y="4" width="120" height="120" rx="28" fill="#114C3E"/>
                 <circle cx="94" cy="30" r="5" fill="#FF7A59"/>
                 <path d="M40 92 Q64 104 88 92" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round"/>
                 <circle cx="47" cy="100" r="6.5" fill="#FFFFFF"/>
                 <circle cx="81" cy="100" r="6.5" fill="#FFFFFF"/>
                 <rect x="54" y="28" width="20" height="56" rx="6" fill="#FFFFFF"/>
                 <rect x="32" y="50" width="64" height="20" rx="6" fill="#FFFFFF"/>
               </svg>
            </div>
            <span className="font-serif font-semibold text-[19px] tracking-tight">
              Nutri<em className="not-italic text-[#FF7A59]">Cart</em>
            </span>
          </Link>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              
              return (
                <Link key={item.href} href={item.href} className={cn(
                  "flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 text-[14.5px] font-medium",
                  isActive 
                    ? "bg-[#114C3E] text-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]" 
                    : "text-[#A9C2B8] hover:bg-[#114C3E]/40 hover:text-white"
                )}>
                  <Icon className={cn("w-[18px] h-[18px]", isActive ? "text-[#FF7A59]" : "text-[#8AA79B]")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="bg-[#114C3E]/30 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#114C3E] flex items-center justify-center font-serif text-sm border border-white/10 shadow-inner">
                {user?.firstName?.[0] || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium text-white truncate">{user?.firstName || 'User'} {user?.lastName || ''}</div>
                <div className="text-xs text-[#8AA79B] truncate">{user?.email || 'user@example.com'}</div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-[#FF7A59] bg-white/5 hover:bg-[#FF7A59]/10 transition-colors"
            >
              <LogOut className="w-[15px] h-[15px]" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#E4EFEA]/50 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto p-8 lg:p-12 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

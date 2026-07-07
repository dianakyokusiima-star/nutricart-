import { useGetProfile, useUpdateProfile, getGetProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { User, Activity, Store, HeartPulse } from "lucide-react";
import { useState, useEffect } from "react";

export default function Profile() {
  const { data: profile, isLoading } = useGetProfile();
  const updateMut = useUpdateProfile();
  const queryClient = useQueryClient();

  const [allergies, setAllergies] = useState<string>("");
  const [conditions, setConditions] = useState<string>("");
  const [pharmacies, setPharmacies] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile && !isEditing) {
      setAllergies(profile.allergies.join(", "));
      setConditions(profile.conditions.join(", "));
      setPharmacies(profile.preferredPharmacies.join(", "));
      setNotes(profile.notes || "");
    }
  }, [profile, isEditing]);

  const handleSave = () => {
    updateMut.mutate({
      data: {
        allergies: allergies.split(",").map(s => s.trim()).filter(Boolean),
        conditions: conditions.split(",").map(s => s.trim()).filter(Boolean),
        preferredPharmacies: pharmacies.split(",").map(s => s.trim()).filter(Boolean),
        notes
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        setIsEditing(false);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-[#DCE6E1]/50 rounded-lg" />
        <div className="h-[400px] bg-white rounded-3xl border border-[#DCE6E1]/60" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-4xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[32px] font-semibold text-[#0A2E25] tracking-tight">Health Profile</h1>
          <p className="text-[#52655D] mt-2 text-[15px]">Personalized baseline for AI recommendations and interaction checks.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-white border border-[#DCE6E1] text-[#114C3E] hover:bg-[#F3F7F5] rounded-full px-6 py-2.5 text-sm font-semibold transition-colors">
            Edit Profile
          </button>
        )}
      </header>

      <div className="bg-white rounded-3xl border border-[#DCE6E1]/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
        {isEditing ? (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#142621] flex items-center gap-2"><Activity className="w-4 h-4 text-[#FF7A59]" /> Allergies</label>
              <input value={allergies} onChange={e=>setAllergies(e.target.value)} placeholder="e.g. Penicillin, Sulfa drugs (comma separated)" className="w-full bg-[#F3F7F5] border-transparent focus:border-[#114C3E] focus:ring-1 rounded-xl px-4 py-3 text-sm" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#142621] flex items-center gap-2"><HeartPulse className="w-4 h-4 text-[#FF7A59]" /> Medical Conditions</label>
              <input value={conditions} onChange={e=>setConditions(e.target.value)} placeholder="e.g. Hypertension, Asthma (comma separated)" className="w-full bg-[#F3F7F5] border-transparent focus:border-[#114C3E] focus:ring-1 rounded-xl px-4 py-3 text-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#142621] flex items-center gap-2"><Store className="w-4 h-4 text-[#114C3E]" /> Preferred Pharmacies</label>
              <input value={pharmacies} onChange={e=>setPharmacies(e.target.value)} placeholder="e.g. CVS, Walgreens, Local Rx (comma separated)" className="w-full bg-[#F3F7F5] border-transparent focus:border-[#114C3E] focus:ring-1 rounded-xl px-4 py-3 text-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#142621]">Additional Notes</label>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4} className="w-full bg-[#F3F7F5] border-transparent focus:border-[#114C3E] focus:ring-1 rounded-xl px-4 py-3 text-sm resize-none" placeholder="Any other health context..." />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#DCE6E1]/50">
              <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-sm font-medium text-[#52655D] hover:bg-gray-100 rounded-full transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={updateMut.isPending} className="bg-[#114C3E] hover:bg-[#0A2E25] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors">
                {updateMut.isPending ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-0">
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#DCE6E1]/40 border-b border-[#DCE6E1]/40">
              <div className="p-8">
                <h3 className="text-sm font-mono tracking-widest uppercase text-[#8AA79B] flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-[#FF7A59]" /> Allergies</h3>
                {profile?.allergies.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((a,i) => <span key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">{a}</span>)}
                  </div>
                ) : <span className="text-[#52655D] italic">None listed</span>}
              </div>
              <div className="p-8">
                <h3 className="text-sm font-mono tracking-widest uppercase text-[#8AA79B] flex items-center gap-2 mb-4"><HeartPulse className="w-4 h-4 text-[#FF7A59]" /> Conditions</h3>
                {profile?.conditions.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.conditions.map((c,i) => <span key={i} className="bg-[#E4EFEA] text-[#114C3E] px-3 py-1 rounded-full text-sm font-medium">{c}</span>)}
                  </div>
                ) : <span className="text-[#52655D] italic">None listed</span>}
              </div>
            </div>
            
            <div className="p-8 border-b border-[#DCE6E1]/40">
              <h3 className="text-sm font-mono tracking-widest uppercase text-[#8AA79B] flex items-center gap-2 mb-4"><Store className="w-4 h-4 text-[#114C3E]" /> Preferred Pharmacies</h3>
              {profile?.preferredPharmacies.length ? (
                <div className="flex flex-wrap gap-2">
                  {profile.preferredPharmacies.map((p,i) => <span key={i} className="border border-[#DCE6E1] text-[#142621] bg-[#F3F7F5] px-3 py-1 rounded-full text-sm font-medium">{p}</span>)}
                </div>
              ) : <span className="text-[#52655D] italic">No preferences set</span>}
            </div>

            {profile?.notes && (
              <div className="p-8 bg-gray-50/50">
                <h3 className="text-sm font-mono tracking-widest uppercase text-[#8AA79B] mb-4">Notes</h3>
                <p className="text-[#52655D] whitespace-pre-wrap">{profile.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

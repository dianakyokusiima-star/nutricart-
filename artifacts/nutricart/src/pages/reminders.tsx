import { useState } from "react";
import { useListReminders, useCreateReminder, useUpdateReminder, useDeleteReminder, getListRemindersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Plus, Trash2, CheckCircle2, Calendar, Pill } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

export default function Reminders() {
  const { data: reminders, isLoading } = useListReminders();
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();
  const deleteMut = useDeleteReminder();
  const updateMut = useUpdateReminder();

  const handleDismiss = (id: number) => {
    updateMut.mutate({ id, data: { isDismissed: true } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListRemindersQueryKey() })
    });
  };

  const handleDelete = (id: number) => {
    if(confirm("Delete this reminder?")) {
      deleteMut.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListRemindersQueryKey() })
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[32px] font-semibold text-[#0A2E25] tracking-tight">Refill Reminders</h1>
          <p className="text-[#52655D] mt-2 text-[15px]">Never run out of your important medications.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#114C3E] hover:bg-[#0A2E25] text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Reminder
        </button>
      </header>

      {isAdding && <AddReminderForm onClose={() => setIsAdding(false)} />}

      {isLoading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-[#DCE6E1]/50 animate-pulse" />)}
        </div>
      ) : reminders?.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCE6E1]/60 p-16 text-center">
          <Calendar className="w-12 h-12 text-[#8AA79B] mx-auto mb-4 opacity-50" />
          <h3 className="font-serif text-xl font-semibold text-[#0A2E25] mb-2">No active reminders</h3>
          <p className="text-[#52655D] mb-6">Set up alerts to know when it's time to refill your prescriptions.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reminders?.sort((a,b) => new Date(a.refillDate).getTime() - new Date(b.refillDate).getTime()).map(reminder => {
            const daysUntil = differenceInDays(parseISO(reminder.refillDate), new Date());
            const isUrgent = daysUntil <= 7 && !reminder.isDismissed;
            
            return (
              <div key={reminder.id} className={`bg-white rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all ${isUrgent ? 'border-[#FF7A59]/50 shadow-md' : 'border-[#DCE6E1]/60'}`}>
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUrgent ? 'bg-[#FFE7DE] text-[#D65C3C]' : reminder.isDismissed ? 'bg-gray-100 text-gray-400' : 'bg-[#E4EFEA] text-[#114C3E]'}`}>
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${reminder.isDismissed ? 'text-gray-500 line-through' : 'text-[#142621]'}`}>
                      {reminder.medicationName}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[#52655D]">
                      <span className="flex items-center gap-1.5 font-mono"><Calendar className="w-3.5 h-3.5" /> {new Date(reminder.refillDate).toLocaleDateString()}</span>
                      {reminder.currentSupplyDays !== null && (
                        <span className="text-xs uppercase tracking-wider font-semibold border px-2 py-0.5 rounded-md">
                          {reminder.currentSupplyDays} days supply left
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t sm:border-t-0 pt-4 sm:pt-0">
                  {isUrgent && !reminder.isDismissed && (
                    <span className="text-xs font-bold uppercase tracking-widest text-[#D65C3C] mr-2">Refill Soon</span>
                  )}
                  {!reminder.isDismissed && (
                    <button 
                      onClick={() => handleDismiss(reminder.id)}
                      className="px-4 py-2 bg-[#F3F7F5] hover:bg-[#E4EFEA] text-[#114C3E] rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Dismiss
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(reminder.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AddReminderForm({ onClose }: { onClose: () => void }) {
  const [medicationName, setMedicationName] = useState("");
  const [refillDate, setRefillDate] = useState("");
  const [daysSupply, setDaysSupply] = useState("30");
  
  const createMut = useCreateReminder();
  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMut.mutate({
      data: {
        medicationName,
        refillDate: new Date(refillDate).toISOString(),
        daysSupply: Number(daysSupply)
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRemindersQueryKey() });
        onClose();
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DCE6E1]/60 p-6 shadow-lg shadow-[#0A2E25]/5 animate-in slide-in-from-top-4 duration-300 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-[#0A2E25]">Set New Reminder</h3>
        <button onClick={onClose} className="text-[#8AA79B] hover:text-[#142621]">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-5 items-end">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#142621]">Medication Name</label>
          <input required value={medicationName} onChange={e=>setMedicationName(e.target.value)} className="w-full bg-[#F3F7F5] border-transparent focus:border-[#114C3E] focus:ring-1 rounded-xl px-4 py-2.5 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#142621]">Next Refill Date</label>
          <input type="date" required value={refillDate} onChange={e=>setRefillDate(e.target.value)} className="w-full bg-[#F3F7F5] border-transparent focus:border-[#114C3E] focus:ring-1 rounded-xl px-4 py-2.5 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#142621]">Days Supply</label>
          <input type="number" required min="1" value={daysSupply} onChange={e=>setDaysSupply(e.target.value)} className="w-full bg-[#F3F7F5] border-transparent focus:border-[#114C3E] focus:ring-1 rounded-xl px-4 py-2.5 text-sm" />
        </div>
        <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-[#52655D] hover:bg-gray-100 rounded-full transition-colors">Cancel</button>
          <button type="submit" disabled={createMut.isPending} className="bg-[#114C3E] hover:bg-[#0A2E25] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors">
            {createMut.isPending ? 'Saving...' : 'Set Reminder'}
          </button>
        </div>
      </form>
    </div>
  );
}

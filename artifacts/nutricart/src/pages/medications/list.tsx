import { useState, useRef } from "react";
import { useListMedications, useCreateMedication, useDeleteMedication, useUpdateMedication, getListMedicationsQueryKey } from "@workspace/api-client-react";
import { Pill, Plus, Search, MoreVertical, Edit2, Trash2, ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

export default function MedicationsList() {
  const { data: medications, isLoading } = useListMedications();
  const queryClient = useQueryClient();
  const deleteMut = useDeleteMedication();
  const updateMut = useUpdateMedication();
  
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm("Remove this medication?")) {
      deleteMut.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMedicationsQueryKey() });
        }
      });
    }
  };

  const toggleActive = (id: number, current: boolean) => {
    updateMut.mutate({ id, data: { isActive: !current } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMedicationsQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[32px] font-semibold text-[#0A2E25] tracking-tight">Medications</h1>
          <p className="text-[#52655D] mt-2 text-[15px]">Manage your active prescriptions and supplements.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#114C3E] hover:bg-[#0A2E25] text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </header>

      {isAdding && (
        <AddMedicationForm onClose={() => setIsAdding(false)} />
      )}

      {isLoading ? (
        <div className="bg-white rounded-3xl border border-[#DCE6E1]/60 h-64 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-[#114C3E] border-t-transparent animate-spin" />
        </div>
      ) : medications?.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCE6E1]/60 p-16 text-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
          <div className="w-16 h-16 bg-[#E4EFEA] rounded-full flex items-center justify-center mx-auto mb-4">
            <Pill className="w-8 h-8 text-[#114C3E]" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-[#0A2E25] mb-2">No medications found</h3>
          <p className="text-[#52655D] mb-6 max-w-md mx-auto">Your profile is currently empty. Add your first prescription or supplement to get started.</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-[#FF7A59] hover:bg-[#D65C3C] text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition-all"
          >
            Add your first item
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#DCE6E1]/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-[#DCE6E1]/60 text-[13px] font-medium text-[#8AA79B] uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Dosage</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE6E1]/40">
                {medications?.map(med => (
                  <tr key={med.id} className="hover:bg-[#F3F7F5]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#142621]">{med.name}</div>
                      {med.genericName && <div className="text-xs text-[#52655D] mt-0.5">{med.genericName}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-[#114C3E]">{med.dosage}</div>
                      <div className="text-xs text-[#52655D] mt-0.5">{med.frequency}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide uppercase bg-[#E4EFEA] text-[#114C3E]">
                        {med.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleActive(med.id, med.isActive)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${med.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${med.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {med.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/medications/${med.id}/prices`}
                          className="p-2 text-[#FF7A59] hover:bg-[#FFE7DE] rounded-lg transition-colors"
                          title="Compare Prices"
                        >
                          <Search className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(med.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AddMedicationForm({ onClose }: { onClose: () => void }) {
  const createMut = useCreateMedication();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [type, setType] = useState<"prescription"|"supplement"|"otc">("prescription");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMut.mutate({
      data: {
        name,
        dosage,
        frequency,
        type,
        startDate: new Date().toISOString()
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMedicationsQueryKey() });
        onClose();
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DCE6E1]/60 p-6 shadow-lg shadow-[#0A2E25]/5 animate-in slide-in-from-top-4 duration-300 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl font-semibold text-[#0A2E25]">Add New Item</h3>
        <button onClick={onClose} className="text-[#8AA79B] hover:text-[#142621]">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#142621]">Medication Name *</label>
            <input required value={name} onChange={e=>setName(e.target.value)} className="w-full bg-[#F3F7F5] border-transparent focus:border-[#114C3E] focus:ring-1 focus:ring-[#114C3E] rounded-xl px-4 py-2.5 text-sm transition-all" placeholder="e.g. Lisinopril" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#142621]">Type</label>
            <select value={type} onChange={e=>setType(e.target.value as any)} className="w-full bg-[#F3F7F5] border-transparent focus:border-[#114C3E] focus:ring-1 focus:ring-[#114C3E] rounded-xl px-4 py-2.5 text-sm transition-all">
              <option value="prescription">Prescription</option>
              <option value="supplement">Supplement</option>
              <option value="otc">Over-the-counter</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#142621]">Dosage *</label>
            <input required value={dosage} onChange={e=>setDosage(e.target.value)} className="w-full bg-[#F3F7F5] border-transparent focus:border-[#114C3E] focus:ring-1 focus:ring-[#114C3E] rounded-xl px-4 py-2.5 text-sm transition-all" placeholder="e.g. 10mg" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#142621]">Frequency</label>
            <input required value={frequency} onChange={e=>setFrequency(e.target.value)} className="w-full bg-[#F3F7F5] border-transparent focus:border-[#114C3E] focus:ring-1 focus:ring-[#114C3E] rounded-xl px-4 py-2.5 text-sm transition-all" placeholder="e.g. Once daily" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-[#52655D] hover:bg-gray-100 rounded-full transition-colors">Cancel</button>
          <button type="submit" disabled={createMut.isPending} className="bg-[#114C3E] hover:bg-[#0A2E25] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-50">
            {createMut.isPending ? 'Saving...' : 'Save Medication'}
          </button>
        </div>
      </form>
    </div>
  );
}

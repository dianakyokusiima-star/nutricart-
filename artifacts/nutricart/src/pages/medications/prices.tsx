import { useParams } from "wouter";
import { useGetMedication, useGetMedicationPrices } from "@workspace/api-client-react";
import { Store, MapPin, Tag, Truck, AlertCircle, ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function MedicationPrices() {
  const params = useParams();
  const id = Number(params.id);

  const { data: medication, isLoading: medLoading } = useGetMedication(id, {
    query: { enabled: !!id }
  });

  const { data: comparison, isLoading: pricesLoading } = useGetMedicationPrices(id, {
    query: { enabled: !!id }
  });

  if (medLoading || pricesLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-[#DCE6E1]/50 rounded-lg" />
        <div className="h-32 bg-white rounded-3xl border border-[#DCE6E1]/60" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-[#DCE6E1]/60" />)}
        </div>
      </div>
    );
  }

  if (!medication) return <div>Medication not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <Link href="/medications" className="inline-flex items-center text-sm font-medium text-[#52655D] hover:text-[#114C3E] mb-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Medications
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[32px] font-semibold text-[#0A2E25] tracking-tight">{medication.name}</h1>
            <p className="text-[#52655D] mt-1 text-[15px]">{medication.dosage} · {medication.frequency}</p>
          </div>
          {comparison && (
            <div className="text-right">
              <div className="text-sm font-medium text-[#52655D] uppercase tracking-wider mb-1">Best Price</div>
              <div className="font-serif text-3xl font-semibold text-[#114C3E]">${comparison.bestPrice.toFixed(2)}</div>
            </div>
          )}
        </div>
      </header>

      {comparison && comparison.prices.length > 0 ? (
        <div className="space-y-4">
          {comparison.prices.sort((a, b) => (a.couponPrice || a.price) - (b.couponPrice || b.price)).map((price, idx) => {
            const finalPrice = price.couponPrice || price.price;
            const isBest = idx === 0;

            return (
              <div key={idx} className={`bg-white rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all ${isBest ? 'border-[#114C3E] shadow-[0_4px_20px_-8px_rgba(17,76,62,0.2)] relative overflow-hidden' : 'border-[#DCE6E1]/60 hover:shadow-sm'}`}>
                {isBest && <div className="absolute top-0 left-0 w-1 h-full bg-[#114C3E]" />}
                
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isBest ? 'bg-[#E4EFEA] text-[#114C3E]' : 'bg-gray-50 text-gray-400'}`}>
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#142621] flex items-center gap-2">
                      {price.pharmacyName}
                      {isBest && <span className="text-[10px] font-mono tracking-wider uppercase bg-[#114C3E] text-white px-2 py-0.5 rounded-full">Best Match</span>}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[#52655D]">
                      {price.distance && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {price.distance}</span>}
                      {price.deliveryAvailable && <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Delivery Available</span>}
                      {!price.inStock && <span className="flex items-center gap-1 text-red-500"><AlertCircle className="w-3.5 h-3.5" /> Out of stock</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                  {price.couponCode && (
                    <div className="bg-[#FFE7DE]/50 border border-[#FF7A59]/20 rounded-lg px-3 py-2 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-[#D65C3C] font-semibold mb-0.5">Apply Code</div>
                      <div className="font-mono text-sm font-bold text-[#FF7A59] flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> {price.couponCode}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-right">
                    {price.couponPrice && price.couponPrice < price.price ? (
                      <>
                        <div className="text-sm text-[#8AA79B] line-through mb-0.5">${price.price.toFixed(2)}</div>
                        <div className="font-serif text-2xl font-bold text-[#142621]">${price.couponPrice.toFixed(2)}</div>
                      </>
                    ) : (
                      <div className="font-serif text-2xl font-bold text-[#142621]">${price.price.toFixed(2)}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#DCE6E1]/60 p-16 text-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
          <Store className="w-12 h-12 text-[#8AA79B] mx-auto mb-4 opacity-50" />
          <h3 className="font-serif text-xl font-semibold text-[#0A2E25] mb-2">No prices found</h3>
          <p className="text-[#52655D]">We couldn't find pricing data for this medication in your area.</p>
        </div>
      )}
    </div>
  );
}

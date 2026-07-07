import { useState } from "react";
import { useSearchMedicationPrices } from "@workspace/api-client-react";
import { Search as SearchIcon, Store, Tag, MapPin } from "lucide-react";

export default function Prices() {
  const [query, setQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data: comparison, isLoading, isFetching } = useSearchMedicationPrices(
    { name: activeSearch },
    { query: { enabled: !!activeSearch } }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveSearch(query.trim());
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="max-w-2xl mx-auto text-center pt-8 mb-10">
        <h1 className="font-serif text-[36px] font-semibold text-[#0A2E25] tracking-tight">Compare Prices</h1>
        <p className="text-[#52655D] mt-3 text-[16px]">Search any prescription to see what it costs across pharmacies near you.</p>
      </header>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-[#8AA79B]" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Lipitor, Metformin, Adderall..."
          className="block w-full pl-14 pr-32 py-5 bg-white border border-[#DCE6E1] rounded-full text-lg shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-[#114C3E] focus:border-[#114C3E] transition-all outline-none"
        />
        <button
          type="submit"
          disabled={!query.trim() || isFetching}
          className="absolute right-3 top-3 bottom-3 bg-[#FF7A59] hover:bg-[#D65C3C] text-white px-6 rounded-full font-semibold transition-colors disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {isFetching && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-[#114C3E] border-t-transparent animate-spin" />
        </div>
      )}

      {comparison && !isFetching && (
        <div className="max-w-4xl mx-auto mt-12 space-y-6">
          <div className="flex items-end justify-between border-b border-[#DCE6E1] pb-4 px-2">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#0A2E25]">{comparison.medicationName}</h2>
              <p className="text-[#52655D] text-sm mt-1">{comparison.dosage} · Found {comparison.prices.length} prices</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono uppercase tracking-widest text-[#8AA79B]">Average Price</p>
              <p className="font-serif text-xl text-[#52655D]">${comparison.avgPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid gap-4">
            {comparison.prices.sort((a, b) => (a.couponPrice || a.price) - (b.couponPrice || b.price)).map((price, idx) => {
              const isBest = idx === 0;
              return (
                <div key={idx} className={`bg-white rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${isBest ? 'border-[#114C3E] shadow-md' : 'border-[#DCE6E1]/60'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isBest ? 'bg-[#114C3E] text-white' : 'bg-[#E4EFEA] text-[#114C3E]'}`}>
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#142621]">{price.pharmacyName}</h3>
                      {price.distance && (
                        <p className="text-sm text-[#52655D] flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {price.distance}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                    {price.couponCode && (
                      <div className="hidden sm:block text-right">
                        <div className="text-[10px] uppercase tracking-widest text-[#8AA79B] font-semibold mb-1">Coupon Available</div>
                        <div className="font-mono text-xs font-bold text-[#FF7A59] bg-[#FFE7DE] px-2 py-1 rounded inline-flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {price.couponCode}
                        </div>
                      </div>
                    )}
                    <div className="text-right flex-1 sm:flex-none">
                      {price.couponPrice ? (
                        <>
                          <div className="text-sm text-[#8AA79B] line-through mb-0.5">${price.price.toFixed(2)}</div>
                          <div className={`font-serif text-2xl font-bold ${isBest ? 'text-[#114C3E]' : 'text-[#142621]'}`}>${price.couponPrice.toFixed(2)}</div>
                        </>
                      ) : (
                        <div className={`font-serif text-2xl font-bold ${isBest ? 'text-[#114C3E]' : 'text-[#142621]'}`}>${price.price.toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

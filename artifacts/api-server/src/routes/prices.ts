import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, medicationsTable } from "@workspace/db";
import { SearchMedicationPricesQueryParams, SearchMedicationPricesResponse, GetMedicationPricesParams, GetMedicationPricesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const PHARMACIES = [
  { name: "CVS Pharmacy", baseMultiplier: 1.0, hasDelivery: true, distance: "0.8 mi" },
  { name: "Walgreens", baseMultiplier: 1.05, hasDelivery: true, distance: "1.2 mi" },
  { name: "Rite Aid", baseMultiplier: 0.92, hasDelivery: false, distance: "2.1 mi" },
  { name: "Walmart Pharmacy", baseMultiplier: 0.78, hasDelivery: true, distance: "3.4 mi" },
  { name: "Costco Pharmacy", baseMultiplier: 0.65, hasDelivery: false, distance: "5.2 mi" },
  { name: "Amazon Pharmacy", baseMultiplier: 0.72, hasDelivery: true, distance: null },
];

// Base prices for common medications (USD per 30-day supply)
const BASE_PRICES: Record<string, number> = {
  lisinopril: 12.5,
  metformin: 8.0,
  atorvastatin: 18.0,
  simvastatin: 15.0,
  amlodipine: 11.0,
  omeprazole: 14.0,
  levothyroxine: 9.5,
  sertraline: 22.0,
  metoprolol: 13.0,
  losartan: 16.0,
  fluoxetine: 19.0,
  warfarin: 11.5,
  aspirin: 6.0,
  ibuprofen: 7.5,
};

function getBasePrice(medicationName: string): number {
  const lower = medicationName.toLowerCase();
  for (const [drug, price] of Object.entries(BASE_PRICES)) {
    if (lower.includes(drug)) return price;
  }
  // Generate a deterministic price based on name length
  return 10 + (medicationName.length % 20) + Math.floor(medicationName.charCodeAt(0) % 25);
}

function buildPriceComparison(medicationName: string, dosage: string) {
  const base = getBasePrice(medicationName);
  const prices = PHARMACIES.map((pharmacy) => {
    const price = parseFloat((base * pharmacy.baseMultiplier).toFixed(2));
    const hasCoupon = Math.random() > 0.5;
    const couponPrice = hasCoupon ? parseFloat((price * 0.85).toFixed(2)) : null;
    return {
      pharmacyName: pharmacy.name,
      price,
      unit: "30-day supply",
      inStock: Math.random() > 0.1,
      deliveryAvailable: pharmacy.hasDelivery,
      couponCode: hasCoupon ? "GOODRX" + Math.floor(Math.random() * 1000) : null,
      couponPrice,
      distance: pharmacy.distance,
    };
  });

  const effectivePrices = prices.map((p) => p.couponPrice ?? p.price);
  const bestPrice = Math.min(...effectivePrices);
  const avgPrice = parseFloat((effectivePrices.reduce((a, b) => a + b, 0) / effectivePrices.length).toFixed(2));
  const bestPharmacy = prices.find((p) => (p.couponPrice ?? p.price) === bestPrice)?.pharmacyName ?? null;

  return {
    medicationName,
    dosage: dosage || "Standard",
    prices,
    bestPrice,
    avgPrice,
    bestPharmacy,
  };
}

router.get("/prices/search", async (req, res): Promise<void> => {
  const params = SearchMedicationPricesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "Missing required query parameter: name" });
    return;
  }

  const result = buildPriceComparison(params.data.name, "");
  res.json(SearchMedicationPricesResponse.parse(result));
});

router.get("/prices/compare/:medicationId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = GetMedicationPricesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [med] = await db
    .select()
    .from(medicationsTable)
    .where(and(eq(medicationsTable.id, params.data.medicationId), eq(medicationsTable.userId, req.user.id)));

  if (!med) {
    res.status(404).json({ error: "Medication not found" });
    return;
  }

  const result = buildPriceComparison(med.name, med.dosage);
  res.json(GetMedicationPricesResponse.parse(result));
});

export default router;

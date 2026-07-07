import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, medicationsTable, savingsTable } from "@workspace/db";
import { GetRecommendationsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/recommendations", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;

  const [meds, savings] = await Promise.all([
    db.select().from(medicationsTable).where(eq(medicationsTable.userId, userId)),
    db.select().from(savingsTable).where(eq(savingsTable.userId, userId)),
  ]);

  const activeMeds = meds.filter((m) => m.isActive);
  const recommendations = [];

  // Generic alternative suggestions
  const genericMap: Record<string, { generic: string; savings: number }> = {
    lipitor: { generic: "Atorvastatin", savings: 145 },
    crestor: { generic: "Rosuvastatin", savings: 180 },
    nexium: { generic: "Esomeprazole", savings: 120 },
    synthroid: { generic: "Levothyroxine", savings: 95 },
    zocor: { generic: "Simvastatin", savings: 130 },
  };

  for (const med of activeMeds) {
    const lower = med.name.toLowerCase();
    for (const [brand, info] of Object.entries(genericMap)) {
      if (lower.includes(brand)) {
        recommendations.push({
          id: `generic-${med.id}`,
          title: `Switch to Generic ${info.generic}`,
          description: `${info.generic} is the generic equivalent of ${med.name} and is therapeutically equivalent. Ask your pharmacist about switching.`,
          type: "generic_alternative" as const,
          relevance: "high" as const,
          medicationName: med.name,
          estimatedSavings: info.savings,
          actionLabel: "Compare Prices",
        });
      }
    }
  }

  // Savings tip based on purchase history
  if (savings.length > 0) {
    recommendations.push({
      id: "savings-tip-goodrx",
      title: "Use GoodRx for Extra Savings",
      description: "GoodRx coupons can reduce your medication costs by up to 80%. Always compare before paying full price.",
      type: "savings_tip" as const,
      relevance: "high" as const,
      medicationName: null,
      estimatedSavings: 40,
      actionLabel: "Compare Prices",
    });
  }

  // Mail-order pharmacy tip
  if (activeMeds.length >= 2) {
    recommendations.push({
      id: "mail-order",
      title: "90-Day Supply via Mail Order",
      description: "Getting a 90-day supply through a mail-order pharmacy typically saves 10-20% over monthly fills at retail pharmacies.",
      type: "savings_tip" as const,
      relevance: "medium" as const,
      medicationName: null,
      estimatedSavings: 25,
      actionLabel: "Learn More",
    });
  }

  // OTC alternatives for supplements
  const otcSuggestions: Record<string, string> = {
    "vitamin d": "Ensure you're getting the right IU dosage — store brands are identical to name brands and cost much less.",
    "omega-3": "Store-brand fish oil supplements are equivalent to name-brand options at a fraction of the price.",
    "calcium": "Calcium carbonate is just as effective as premium calcium supplements and significantly cheaper.",
  };

  for (const med of activeMeds.filter((m) => m.type === "supplement")) {
    const lower = med.name.toLowerCase();
    for (const [name, tip] of Object.entries(otcSuggestions)) {
      if (lower.includes(name)) {
        recommendations.push({
          id: `otc-${med.id}`,
          title: `Save on ${med.name}`,
          description: tip,
          type: "otc_option" as const,
          relevance: "medium" as const,
          medicationName: med.name,
          estimatedSavings: null,
          actionLabel: "Compare Prices",
        });
      }
    }
  }

  // General tip when list is short
  if (recommendations.length < 2) {
    recommendations.push({
      id: "price-compare-general",
      title: "Compare Prices Before Every Refill",
      description: "Medication prices vary significantly across pharmacies. Always check NutriCart's price comparison tool before filling a prescription.",
      type: "savings_tip" as const,
      relevance: "medium" as const,
      medicationName: null,
      estimatedSavings: null,
      actionLabel: "Search Prices",
    });
  }

  res.json(GetRecommendationsResponse.parse(recommendations));
});

export default router;

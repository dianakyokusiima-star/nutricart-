import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, savingsTable } from "@workspace/db";
import {
  ListSavingsResponse,
  RecordSavingBody,
  RecordSavingResponse,
  GetSavingsSummaryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toDateStr(d: Date | string): string {
  if (typeof d === "string") return d;
  return d.toISOString().split("T")[0];
}

function parseSaving(e: typeof savingsTable.$inferSelect) {
  return {
    ...e,
    listPrice: parseFloat(e.listPrice),
    paidPrice: parseFloat(e.paidPrice),
    savedAmount: parseFloat(e.savedAmount),
  };
}

router.get("/savings", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const entries = await db
    .select()
    .from(savingsTable)
    .where(eq(savingsTable.userId, req.user.id))
    .orderBy(desc(savingsTable.purchaseDate));

  res.json(ListSavingsResponse.parse(entries.map(parseSaving)));
});

router.post("/savings", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = RecordSavingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { listPrice, paidPrice, purchaseDate, ...rest } = parsed.data;
  const savedAmount = parseFloat((listPrice - paidPrice).toFixed(2));

  const [entry] = await db
    .insert(savingsTable)
    .values({
      ...rest,
      userId: req.user.id,
      listPrice: listPrice.toString(),
      paidPrice: paidPrice.toString(),
      savedAmount: savedAmount.toString(),
      purchaseDate: toDateStr(purchaseDate),
    })
    .returning();

  res.status(201).json(RecordSavingResponse.parse(parseSaving(entry)));
});

router.get("/savings/summary", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const entries = await db
    .select()
    .from(savingsTable)
    .where(eq(savingsTable.userId, req.user.id))
    .orderBy(desc(savingsTable.purchaseDate));

  if (entries.length === 0) {
    res.json(GetSavingsSummaryResponse.parse({
      totalSaved: 0,
      totalSpent: 0,
      savingsCount: 0,
      avgSavingPerPurchase: 0,
      topPharmacy: null,
      monthlySavings: [],
    }));
    return;
  }

  const totalSaved = entries.reduce((sum, e) => sum + parseFloat(e.savedAmount), 0);
  const totalSpent = entries.reduce((sum, e) => sum + parseFloat(e.paidPrice), 0);
  const avgSavingPerPurchase = totalSaved / entries.length;

  const pharmacyCounts: Record<string, number> = {};
  for (const e of entries) {
    pharmacyCounts[e.pharmacyName] = (pharmacyCounts[e.pharmacyName] ?? 0) + 1;
  }
  const topPharmacy = Object.entries(pharmacyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const monthlyMap: Record<string, { saved: number; spent: number }> = {};
  for (const e of entries) {
    const month = e.purchaseDate.substring(0, 7);
    if (!monthlyMap[month]) monthlyMap[month] = { saved: 0, spent: 0 };
    monthlyMap[month].saved += parseFloat(e.savedAmount);
    monthlyMap[month].spent += parseFloat(e.paidPrice);
  }
  const monthlySavings = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({
      month,
      saved: parseFloat(data.saved.toFixed(2)),
      spent: parseFloat(data.spent.toFixed(2)),
    }));

  res.json(GetSavingsSummaryResponse.parse({
    totalSaved: parseFloat(totalSaved.toFixed(2)),
    totalSpent: parseFloat(totalSpent.toFixed(2)),
    savingsCount: entries.length,
    avgSavingPerPurchase: parseFloat(avgSavingPerPurchase.toFixed(2)),
    topPharmacy,
    monthlySavings,
  }));
});

export default router;

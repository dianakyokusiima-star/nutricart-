import { Router, type IRouter } from "express";
import { eq, desc, asc } from "drizzle-orm";
import { db, medicationsTable, remindersTable, savingsTable } from "@workspace/db";
import { GetDashboardSummaryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  const [meds, reminders, savings] = await Promise.all([
    db.select().from(medicationsTable).where(eq(medicationsTable.userId, userId)),
    db.select().from(remindersTable).where(eq(remindersTable.userId, userId)).orderBy(asc(remindersTable.refillDate)),
    db.select().from(savingsTable).where(eq(savingsTable.userId, userId)).orderBy(desc(savingsTable.purchaseDate)),
  ]);

  const activeMedicationsCount = meds.filter((m) => m.isActive).length;
  const upcomingReminders = reminders.filter((r) => !r.isDismissed && r.refillDate >= today).slice(0, 5);
  const upcomingRemindersCount = upcomingReminders.length;

  const totalSavedAllTime = savings.reduce((sum, s) => sum + parseFloat(s.savedAmount), 0);
  const recentSavings = savings.slice(0, 5).map((s) => ({
    ...s,
    listPrice: parseFloat(s.listPrice),
    paidPrice: parseFloat(s.paidPrice),
    savedAmount: parseFloat(s.savedAmount),
  }));

  // Simple interaction flag count (check active medication names)
  const activeMedNames = meds.filter((m) => m.isActive).map((m) => m.name.toLowerCase());
  const knownInteractionPairs = [
    ["warfarin", "aspirin"], ["warfarin", "ibuprofen"], ["metformin", "alcohol"],
    ["simvastatin", "grapefruit"], ["ssri", "tramadol"], ["lisinopril", "spironolactone"],
  ];
  let interactionFlagsCount = 0;
  for (const [a, b] of knownInteractionPairs) {
    if (activeMedNames.some((n) => n.includes(a)) && activeMedNames.some((n) => n.includes(b))) {
      interactionFlagsCount++;
    }
  }

  res.json(GetDashboardSummaryResponse.parse({
    activeMedicationsCount,
    upcomingRemindersCount,
    totalSavedAllTime: parseFloat(totalSavedAllTime.toFixed(2)),
    interactionFlagsCount,
    recentSavings,
    upcomingReminders,
  }));
});

export default router;

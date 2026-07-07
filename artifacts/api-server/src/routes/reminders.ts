import { Router, type IRouter } from "express";
import { eq, and, asc } from "drizzle-orm";
import { db, remindersTable, type Reminder } from "@workspace/db";
import {
  ListRemindersResponse,
  CreateReminderBody,
  CreateReminderResponse,
  UpdateReminderParams,
  UpdateReminderBody,
  UpdateReminderResponse,
  DeleteReminderParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toDateStr(d: Date | string): string {
  if (typeof d === "string") return d;
  return d.toISOString().split("T")[0];
}

router.get("/reminders", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const reminders = await db
    .select()
    .from(remindersTable)
    .where(eq(remindersTable.userId, req.user.id))
    .orderBy(asc(remindersTable.refillDate));

  res.json(ListRemindersResponse.parse(reminders));
});

router.post("/reminders", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateReminderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { refillDate, ...rest } = parsed.data;
  const [reminder] = await db
    .insert(remindersTable)
    .values({ ...rest, userId: req.user.id, refillDate: toDateStr(refillDate) })
    .returning();

  res.status(201).json(CreateReminderResponse.parse(reminder));
});

router.patch("/reminders/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = UpdateReminderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateReminderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { refillDate, ...rest } = parsed.data;
  const updateData: Partial<Reminder> = { ...rest };
  if (refillDate !== undefined) updateData.refillDate = toDateStr(refillDate);

  const [reminder] = await db
    .update(remindersTable)
    .set(updateData)
    .where(and(eq(remindersTable.id, params.data.id), eq(remindersTable.userId, req.user.id)))
    .returning();

  if (!reminder) {
    res.status(404).json({ error: "Reminder not found" });
    return;
  }
  res.json(UpdateReminderResponse.parse(reminder));
});

router.delete("/reminders/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = DeleteReminderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [reminder] = await db
    .delete(remindersTable)
    .where(and(eq(remindersTable.id, params.data.id), eq(remindersTable.userId, req.user.id)))
    .returning();

  if (!reminder) {
    res.status(404).json({ error: "Reminder not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;

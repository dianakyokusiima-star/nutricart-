import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, medicationsTable, type Medication } from "@workspace/db";
import {
  ListMedicationsResponse,
  CreateMedicationBody,
  CreateMedicationResponse,
  GetMedicationParams,
  GetMedicationResponse,
  UpdateMedicationParams,
  UpdateMedicationBody,
  UpdateMedicationResponse,
  DeleteMedicationParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toDateStr(d: Date | string | null | undefined): string | undefined {
  if (d == null) return undefined;
  if (typeof d === "string") return d;
  return d.toISOString().split("T")[0];
}

router.get("/medications", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const meds = await db.select().from(medicationsTable).where(eq(medicationsTable.userId, req.user.id));
  res.json(ListMedicationsResponse.parse(meds));
});

router.post("/medications", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateMedicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { startDate, endDate, ...rest } = parsed.data;
  const [med] = await db
    .insert(medicationsTable)
    .values({
      ...rest,
      userId: req.user.id,
      startDate: toDateStr(startDate)!,
      endDate: toDateStr(endDate) ?? null,
    })
    .returning();
  res.status(201).json(CreateMedicationResponse.parse(med));
});

router.get("/medications/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = GetMedicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [med] = await db
    .select()
    .from(medicationsTable)
    .where(and(eq(medicationsTable.id, params.data.id), eq(medicationsTable.userId, req.user.id)));
  if (!med) {
    res.status(404).json({ error: "Medication not found" });
    return;
  }
  res.json(GetMedicationResponse.parse(med));
});

router.patch("/medications/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = UpdateMedicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateMedicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { startDate, endDate, ...rest } = parsed.data;
  const updateData: Partial<Medication> = { ...rest };
  if (startDate !== undefined) updateData.startDate = toDateStr(startDate) as string;
  if (endDate !== undefined) updateData.endDate = toDateStr(endDate) ?? null;

  const [med] = await db
    .update(medicationsTable)
    .set(updateData)
    .where(and(eq(medicationsTable.id, params.data.id), eq(medicationsTable.userId, req.user.id)))
    .returning();
  if (!med) {
    res.status(404).json({ error: "Medication not found" });
    return;
  }
  res.json(UpdateMedicationResponse.parse(med));
});

router.delete("/medications/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = DeleteMedicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [med] = await db
    .delete(medicationsTable)
    .where(and(eq(medicationsTable.id, params.data.id), eq(medicationsTable.userId, req.user.id)))
    .returning();
  if (!med) {
    res.status(404).json({ error: "Medication not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;

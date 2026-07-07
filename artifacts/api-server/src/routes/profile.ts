import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, healthProfilesTable } from "@workspace/db";
import { GetProfileResponse, UpdateProfileBody, UpdateProfileResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/profile", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;

  let [profile] = await db.select().from(healthProfilesTable).where(eq(healthProfilesTable.userId, userId));

  if (!profile) {
    // Auto-create an empty profile for new users
    [profile] = await db
      .insert(healthProfilesTable)
      .values({ userId, allergies: [], conditions: [], preferredPharmacies: [] })
      .returning();
  }

  res.json(GetProfileResponse.parse(profile));
});

router.put("/profile", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;

  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Upsert profile
  const [existing] = await db.select().from(healthProfilesTable).where(eq(healthProfilesTable.userId, userId));

  let profile;
  if (existing) {
    [profile] = await db
      .update(healthProfilesTable)
      .set(parsed.data)
      .where(eq(healthProfilesTable.userId, userId))
      .returning();
  } else {
    [profile] = await db
      .insert(healthProfilesTable)
      .values({ userId, allergies: [], conditions: [], preferredPharmacies: [], ...parsed.data })
      .returning();
  }

  res.json(UpdateProfileResponse.parse(profile));
});

export default router;

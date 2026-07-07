import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, medicationsTable } from "@workspace/db";
import { GetInteractionsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

// Known interaction pairs (simplified, non-medical-advice simulation)
const KNOWN_INTERACTIONS: Array<{
  drugs: string[];
  severity: "mild" | "moderate" | "severe";
  description: string;
  recommendation: string;
}> = [
  {
    drugs: ["warfarin", "aspirin", "ibuprofen"],
    severity: "severe",
    description: "Combining blood thinners increases bleeding risk significantly.",
    recommendation: "Consult your pharmacist or doctor before combining these medications.",
  },
  {
    drugs: ["metformin", "alcohol"],
    severity: "moderate",
    description: "Alcohol can increase the risk of lactic acidosis when taking metformin.",
    recommendation: "Limit alcohol consumption while taking metformin.",
  },
  {
    drugs: ["simvastatin", "grapefruit"],
    severity: "moderate",
    description: "Grapefruit can increase simvastatin levels in your blood.",
    recommendation: "Avoid consuming grapefruit or grapefruit juice while on this medication.",
  },
  {
    drugs: ["ssri", "tramadol", "sertraline", "fluoxetine"],
    severity: "severe",
    description: "Combining SSRIs with certain opioids can cause serotonin syndrome.",
    recommendation: "Discuss alternative pain management options with your doctor.",
  },
  {
    drugs: ["lisinopril", "potassium", "spironolactone"],
    severity: "moderate",
    description: "ACE inhibitors combined with potassium-sparing diuretics can cause hyperkalemia.",
    recommendation: "Monitor potassium levels regularly with your healthcare provider.",
  },
];

function checkInteractions(medications: string[]): Array<{ severity: "mild" | "moderate" | "severe"; description: string; medications: string[]; recommendation: string | null }> {
  const flags: Array<{ severity: "mild" | "moderate" | "severe"; description: string; medications: string[]; recommendation: string | null }> = [];
  const lowerMeds = medications.map((m) => m.toLowerCase());

  for (const interaction of KNOWN_INTERACTIONS) {
    const matches = interaction.drugs.filter((drug) =>
      lowerMeds.some((m) => m.includes(drug))
    );
    if (matches.length >= 2) {
      flags.push({
        severity: interaction.severity,
        description: interaction.description,
        medications: matches,
        recommendation: interaction.recommendation,
      });
    }
  }

  return flags;
}

router.get("/interactions", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const meds = await db
    .select()
    .from(medicationsTable)
    .where(eq(medicationsTable.userId, req.user.id));

  const activeMedNames = meds.filter((m) => m.isActive).map((m) => m.name);
  const flags = checkInteractions(activeMedNames);

  const report = {
    checkedAt: new Date().toISOString(),
    flags,
    checkedMedications: activeMedNames,
    isClear: flags.length === 0,
  };

  res.json(GetInteractionsResponse.parse(report));
});

export default router;

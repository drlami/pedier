import { Router } from "express";
import { getDifferentialDiagnosis } from "../ai/differential-diagnosis-flow";
import { checkDrugSafety } from "../ai/drug-safety-flow";
import { draftDiseaseProtocol } from "../ai/draft-protocol-flow";
import { draftCustomProtocol } from "../ai/draft-custom-protocol-flow";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/ai/differential-diagnosis", async (req, res) => {
  try {
    const { age, symptoms, history } = req.body;
    if (!age || !symptoms) {
      return res.status(400).json({ message: "age and symptoms are required." });
    }
    const result = await getDifferentialDiagnosis({ age, symptoms, history });
    return res.json(result);
  } catch (err: any) {
    console.error("Error in differential-diagnosis:", err);
    return res.status(500).json({ message: err?.message || "AI processing failed." });
  }
});

router.post("/ai/drug-safety", async (req, res) => {
  try {
    const { drugList } = req.body;
    if (!drugList || String(drugList).trim().length < 2) {
      return res.status(400).json({ message: "Please enter at least one medication name." });
    }
    const result = await checkDrugSafety({ drugList });
    return res.json(result);
  } catch (err: any) {
    console.error("Error in drug-safety:", err);
    return res.status(500).json({ message: err?.message || "AI processing failed." });
  }
});

router.post("/ai/draft-protocol", async (req, res) => {
  try {
    const { guidelineText } = req.body;
    if (!guidelineText || String(guidelineText).trim().length < 100) {
      return res.status(400).json({ message: "Guideline text must be at least 100 characters long." });
    }
    const result = await draftDiseaseProtocol({ guidelineText });
    return res.json(result);
  } catch (err: any) {
    console.error("Error in draft-protocol:", err);
    return res.status(500).json({ message: err?.message || "AI processing failed." });
  }
});

router.post("/ai/draft-custom-protocol", requireAdmin, async (req, res) => {
  try {
    const { description, name, system } = req.body;
    if (!description || String(description).trim().length < 20) {
      return res.status(400).json({ message: "Please provide a description of at least 20 characters." });
    }
    const result = await draftCustomProtocol(
      String(description),
      name ? String(name).trim() : undefined,
      system ? String(system).trim() : undefined
    );
    return res.json(result);
  } catch (err: any) {
    console.error("Error in draft-custom-protocol:", err);
    return res.status(500).json({ message: err?.message || "AI processing failed." });
  }
});

export default router;

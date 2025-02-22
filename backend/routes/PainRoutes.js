import express from "express";
import { getPainCauses } from "../controllers/painController.js";
import { getUserDiagnosis } from "../controllers/chatbotController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { analyzeSkinDisease } from "../controllers/skinDiagnosisController.js";

const router = express.Router();

router.post("/causes", authenticateUser, getPainCauses);
router.post("/diagnosis",authenticateUser, getUserDiagnosis);
router.post("/skin",authenticateUser, analyzeSkinDisease);

export default router;

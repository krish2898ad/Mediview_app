import express from "express";
import { getPainCauses } from "../controllers/PainController.js";
import { getUserDiagnosis } from "../controllers/chatbotController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/causes", authenticateUser, getPainCauses);
router.post("/diagnosis",authenticateUser, getUserDiagnosis);
export default router;

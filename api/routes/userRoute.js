import express from "express";
import {
  deleteUSer,
  getUSer,
  getUSers,
  saveHouse,
  updateUSer,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getUSers);
router.get("/:id", verifyToken, getUSer);
router.put("/:id", verifyToken, updateUSer);
router.delete("/:id", verifyToken, deleteUSer);

////////////////////////////////////////
router.post("/save", verifyToken, saveHouse);

export default router;

import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import {
  addHouse,
  deleteHouse,
  getHouse,
  getHouses,
  updateHouse,
} from "../controllers/houseController.js";

const router = express.Router();

router.post("/", verifyToken, addHouse);
router.get("/", getHouses);
router.get("/:id", getHouse);
router.put("/:id", verifyToken, updateHouse);
router.delete("/:id", verifyToken, deleteHouse);

export default router;

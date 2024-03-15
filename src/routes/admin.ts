import express from "express";
import {
  createUser,
  createWareHouse,
  loginController,
} from "../controller/adminController";
import { createProduct } from "../controller/wareHouseController";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginController);
router.post("/warehouse", createWareHouse);
router.post("/product", createProduct);

router.get("/health", (req, res) => {
  res.status(200).json({ health: "good" });
});

module.exports = router;

import express from "express";
import {
  createUser,
  createWareHouse,
  getWorkers,
  loginController,
} from "../controller/adminController";
import {
  createProduct,
  getProduct,
  getProductInGold,
  getWareHouse,
} from "../controller/wareHouseController";
import { assignWork } from "../controller/workerController";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginController);
router.post("/warehouse", createWareHouse);
router.post("/product", createProduct);
router.get("/product", getProduct);
router.get("/warehouse", getWareHouse);
router.get("/productingold", getProductInGold);
router.post("/assignwork/:workid/:productid", assignWork);
router.get("/workers", getWorkers);

router.get("/health", (req, res) => {
  res.status(200).json({ health: "good" });
});

module.exports = router;

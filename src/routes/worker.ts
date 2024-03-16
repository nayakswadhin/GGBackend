import express from "express";
import {
  createWorker,
  getTask,
  loginWorker,
  updateWork,
} from "../controller/workerController";

const router = express.Router();

router.post("/worker", createWorker);
router.post("/worker/login", loginWorker);
router.get("/works", getTask);
router.post("/:taskid", updateWork);

module.exports = router;

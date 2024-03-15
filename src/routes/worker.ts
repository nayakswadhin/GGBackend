import express from "express";
import { createWorker, loginWorker } from "../controller/workerController";

const router = express.Router();

router.post("/worker", createWorker);
router.post("/worker/login", loginWorker);

module.exports = router;

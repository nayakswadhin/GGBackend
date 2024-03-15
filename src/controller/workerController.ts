import Express from "express";
import { Db } from "mongodb";

export async function createWorker(
  req: Express.Request,
  res: Express.Response
) {
  try {
    const db: Db = req.app.get("db");
    const { userid } = req.headers;
    const { name, address, empId, salary } = req.body;
    const currentDate = new Date();
    const doj = currentDate.toLocaleDateString();
    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }
    if (!empId) {
      return res.status(400).json({ message: "Employee Id required" });
    }
    const newWorker = await db.collection("worker").insertOne({
      name,
      empId,
      address,
      salary,
      doj,
      userid,
    });
    if (newWorker.acknowledged) {
      return res.status(200).json({
        message: "New worker created successfully",
        name,
        empId,
        address,
        salary,
        doj,
        userid,
        _id: newWorker.insertedId,
      });
    }
    return res.status(400).json({ message: "Invalid Input" });
  } catch (error: any) {
    console.log(error);
  }
}

export async function loginWorker(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { name, empId } = req.body;
    const worker = await db.collection("worker").findOne({ name: name });
    if (worker) {
      const workerid = worker._id.toString();
      if (empId == worker.empId) {
        return res.status(200).json({
          message: "Logged In successfully",
          workerid: workerid,
        });
      }
      return res.status(400).json({ message: "Invalid Employee ID" });
    }
    return res.status(404).json({ message: "Worker Not Found" });
  } catch (error) {
    console.log(error);
  }
}

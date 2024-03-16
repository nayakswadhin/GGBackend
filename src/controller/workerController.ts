import Express from "express";
import { Db, ObjectId } from "mongodb";

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

export async function assignWork(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { workid, productid } = req.params;
    const { goldid, wareid } = req.headers;
    const { time, date } = req.body;
    if (!workid) {
      return res.status(400).json({ message: "Workid Required!!" });
    }
    if (!wareid) {
      return res.status(400).json({ message: "Wareid Required!!" });
    }
    if (!productid) {
      return res.status(400).json({ message: "ProductId Required" });
    }
    if (!time) {
      return res.status(400).json({ message: "Time is Required" });
    }
    if (!date) {
      return res.status(400).json({ message: "Date is Required" });
    }
    if (!goldid) {
      return res.status(400).json({ message: "Goldid is Required" });
    }
    if (typeof wareid !== "string") {
      return res.status(400).json({ message: "Invalid warehouse ID" });
    }
    if (typeof goldid !== "string") {
      return res.status(400).json({ message: "Invalid warehouse ID" });
    }
    let wareHouse = await db
      .collection("warehouse")
      .findOne({ _id: new ObjectId(wareid) });
    const product = await db
      .collection("product")
      .findOne({ _id: new ObjectId(productid) });
    let goldZone = await db
      .collection("goldstore")
      .findOne({ _id: new ObjectId(goldid) });
    if (product?.area > goldZone?.remainingSizeForGold) {
      return res.status(400).json({ message: "Gold is Full" });
    }
    const assignWork = await db.collection("assignWork").insertOne({
      workid,
      productid,
      time,
      date,
      isComplete: false,
    });
    if (assignWork.acknowledged) {
      const size = wareHouse?.remainingSize + product?.area;
      const sizeOfGold = goldZone?.remainingSizeForGold - product?.area;
      const updateWareHouse = await db
        .collection("warehouse")
        .updateOne(
          { _id: new ObjectId(wareid) },
          { $set: { remainingSize: size } }
        );
      const updateGoldStore = await db
        .collection("goldstore")
        .updateOne(
          { _id: new ObjectId(goldid) },
          { $set: { remainingSizeForGold: sizeOfGold } }
        );
      wareHouse = await db
        .collection("warehouse")
        .findOne({ _id: new ObjectId(wareid) });
      goldZone = await db
        .collection("goldstore")
        .findOne({ _id: new ObjectId(goldid) });
      const updateProduct = await db
        .collection("product")
        .updateOne(
          { _id: new ObjectId(productid) },
          { $set: { wareid: goldid } }
        );
      return res.status(200).json({
        message: "Successfully Assigned the Work",
        sizeOfwarehouse: wareHouse?.remainingSize,
        sizeOfGold: goldZone?.remainingSizeForGold,
      });
    }
    return res.status(400).json({ message: "Got some Error" });
  } catch (error) {
    console.log(error);
  }
}

export async function getTask(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { workid } = req.headers;
    const tasks = await db
      .collection("assignWork")
      .find({ workid: workid })
      .toArray();
    if (tasks.length) {
      return res.status(200).json({ tasks });
    }
    return res.status(400).json({ message: "No task is Present" });
  } catch (error) {
    console.log(error);
  }
}

export async function updateWork(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { taskid } = req.params;
    const { isComplete } = req.body;
    const task = await db
      .collection("assignWork")
      .updateOne(
        { _id: new ObjectId(taskid) },
        { $set: { isComplete: isComplete } }
      );
    if (task.matchedCount) {
      const updatedTask = await db
        .collection("assignWork")
        .findOne({ _id: new ObjectId(taskid) });
      return res
        .status(200)
        .json({ message: "Task Updated Sucessfully", updatedTask });
    }
    return res.status(400).json({ message: "Got some Error" });
  } catch (error) {
    console.log(error);
  }
}

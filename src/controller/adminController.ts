import { Db, ObjectId } from "mongodb";
import Express from "express";

export async function createUser(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { emailid, name, password } = req.body;

    if (!emailid) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!name) {
      return res.status(400).json({ message: "Invalid name" });
    }
    if (!password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const existingUser = await db
      .collection("user")
      .findOne({ emailid: emailid });
    if (existingUser) {
      return res.status(400).json({ message: "EmailId already exist." });
    }

    const newuser = await db
      .collection("user")
      .insertOne({ emailid, name, password });

    if (newuser.acknowledged) {
      return res.status(200).json({
        message: "user created sucessfully",
        userid: newuser.insertedId.toString(),
      });
    }
    return res.status(400).json({ message: "user not created" });
  } catch (error: any) {
    return res.status(400).json({ error: error.toString() });
  }
}

export async function loginController(
  req: Express.Request,
  res: Express.Response
) {
  try {
    const db: Db = req.app.get("db");
    const { emailid, password } = req.body;
    const user = await db.collection("user").findOne({ emailid: emailid });

    if (user) {
      const userId = user._id.toString();
      const name = user.name;
      if (password == user.password) {
        return res.status(200).json({
          message: "Successfully Logged In",
          userId: userId,
          name: name,
        });
      }
      return res.status(400).json({ message: "Incorrect Password" });
    }
    return res.status(404).json({ message: "User Not Found" });
  } catch (error: any) {
    return res.status(400).json({ error: error.toString() });
  }
}

export async function createWareHouse(
  req: Express.Request,
  res: Express.Response
) {
  try {
    const db: Db = req.app.get("db");
    const { userid } = req.headers;
    const { name, size } = req.body;
    const remainingSize = size;
    const maxSize = size;
    const medium = 0;
    const large = 0;
    const small = 0;
    const newWarehouse = await db
      .collection("warehouse")
      .insertOne({ name, maxSize, remainingSize, small, medium, large });
    if (newWarehouse.acknowledged) {
      const wareid = newWarehouse.insertedId.toString();
      return res.status(200).json({
        message: "Successfully Created",
        wareid: wareid,
        userid: userid,
        name: name,
        smallItems: small,
        mediumItems: medium,
        largeItems: large,
        maximumSize: maxSize,
        remainingSize: remainingSize,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

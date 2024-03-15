import Express from "express";
import { Db, ObjectId } from "mongodb";

export async function createProduct(
  req: Express.Request,
  res: Express.Response
) {
  try {
    const db: Db = req.app.get("db");
    const { userid, wareid } = req.headers;
    const { productName, productId, size, area } = req.body;

    if (typeof wareid !== "string") {
      return res.status(400).json({ message: "Invalid warehouse ID" });
    }

    if (!productName) {
      return res.status(400).json({ message: "Product Name Required" });
    }
    if (!productId) {
      return res.status(400).json({ message: "ProductId Requried" });
    }
    if (!size) {
      return res.status(400).json({ message: "Size Required" });
    }
    if (!area) {
      return res.status(400).json({ message: "Area Required" });
    }

    const wareHouse = await db
      .collection("warehouse")
      .findOne({ _id: new ObjectId(wareid) });
    console.log(wareHouse);
    console.log(area);
    if (wareHouse?.remainingSize >= area) {
      const newProduct = await db
        .collection("product")
        .insertOne({ wareid, userid, productName, productId, area, size });
      const updatedSize = wareHouse?.remainingSize - area;
      let updatedScale = 0;
      if (size == "Small") {
        updatedScale = wareHouse?.small + 1;
        const updateWareHouse = await db
          .collection("warehouse")
          .updateOne(
            { _id: new ObjectId(wareid) },
            { $set: { remainingSize: updatedSize, small: updatedScale } }
          );
      } else if ("Medium") {
        updatedScale = wareHouse?.medium + 1;
        const updateWareHouse = await db
          .collection("warehouse")
          .updateOne(
            { _id: new ObjectId(wareid) },
            { $set: { remainingSize: updatedSize, medium: updatedScale } }
          );
      } else if ("Large") {
        updatedScale = wareHouse?.large + 1;
        const updateWareHouse = await db
          .collection("warehouse")
          .updateOne(
            { _id: new ObjectId(wareid) },
            { $set: { remainingSize: updatedSize, large: updatedScale } }
          );
      }
      console.log(wareHouse);
      if (newProduct.acknowledged) {
        return res.status(200).json({
          message: "Product Created Sucessfully",
          wareid: wareid,
          userid: userid,
          productId: productId,
          productName: productName,
          size: size,
          area: area,
          _id: newProduct.insertedId.toString(),
        });
      }
    }
    return res.status(400).json({ message: "Size is full" });
  } catch (error) {
    console.log(error);
  }
}
export async function getWareHouse(
  req: Express.Request,
  res: Express.Response
) {
  try {
    const db: Db = req.app.get("db");
    const { userid } = req.headers;
    if (!userid) {
      return res.status(400).json({ message: "Required userid" });
    }
    const warehouses = await db
      .collection("warehouse")
      .find({ userid: userid })
      .toArray();
    if (warehouses.length) {
      return res.status(200).json({ warehouses });
    }
    return res.status(400).json({ message: "No warehouse found" });
  } catch (error) {
    console.log(error);
  }
}
export async function getProduct(req: Express.Request, res: Express.Response) {
  try {
    const db: Db = req.app.get("db");
    const { wareid } = req.headers;
    if (!wareid) {
      return res.status(400).json({ message: "Required wareid" });
    }
    const products = await db
      .collection("product")
      .find({ wareid: wareid })
      .toArray();
    console.log(products);
    if (products.length) {
      return res.status(200).json({ products });
    }
    return res.status(400).json({ message: "No products Found" });
  } catch (error) {
    console.log(error);
  }
}

export async function updateProduct(
  req: Express.Request,
  res: Express.Response
) {
  const db: Db = req.app.get("db");
  const { productid } = req.params;
  const { goldid } = req.headers;
  const updateProduct = await db
    .collection("product")
    .updateOne({ _id: new ObjectId(productid) }, { $set: { wareid: goldid } });
  if (updateProduct.acknowledged) {
    return res.status(200).json({ message: "Sucessfully Updated" });
  }
  return res.status(400).json({ message: "Not Updated" });
}

export async function getProductInGold(
  req: Express.Request,
  res: Express.Response
) {
  try {
    const db: Db = req.app.get("db");
    const { goldid } = req.headers;
    const products = await db
      .collection("product")
      .find({ wareid: goldid })
      .toArray();
    if (products.length) {
      return res.status(200).json({ products });
    }
    return res.status(400).json({ message: "products not found" });
  } catch (error) {
    console.log(error);
  }
}

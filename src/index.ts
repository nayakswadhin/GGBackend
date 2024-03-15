import { MongoClient, ServerApiVersion } from "mongodb";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

async function start() {
  try {
    const app = express();
    app.use(
      cors({
        origin: "*",
        optionsSuccessStatus: 200,
        credentials: true,
      })
    );
    const mongo = await MongoClient.connect(
      "mongodb+srv://nayakswadhin25:pupun007@cluster0.ck7vetx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    await mongo.connect();

    app.set("db", mongo.db());
    app.use(
      bodyParser.json({
        limit: "500kb",
      })
    );
    console.log("App is listening to database");

    app.use("/admin", require("./routes/admin"));
    app.use("/", require("./routes/worker"));

    const PORT = 8080;

    app.listen(PORT, () => {
      console.log(`APP is listening in PORT:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();

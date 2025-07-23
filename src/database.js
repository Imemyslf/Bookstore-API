import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db;
const { MONGODB_USER, MONGODB_PASS } = process.env;

async function connectToDB(cb) {
  const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@cluster0.aeoo8hn.mongodb.net/bookstore?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    db = client.db("bookstore");
    console.log("Connected to the database successfully");
    cb();
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
}

export { connectToDB, db };

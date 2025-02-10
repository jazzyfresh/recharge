import { MongoClient, Collection, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const connectionString = process.env.MONGO_URI || "mongodb://localhost:27017";
const collectionNames = ["users", "feedback", "favorites"];

let client: MongoClient;
let db: Db;

export const collections: { [key: string]: Collection } = {};

export async function connectToDatabase() {
  client = new MongoClient(connectionString);
  await client.connect();
  db = client.db("recharge");
  console.log(`Successfully connected to database: ${db.databaseName}`);

  collectionNames.forEach((name) => {
    const collection: Collection = db.collection(name);
    collections[name] = collection;
    console.log(`Successfully connected to collection: ${collection.collectionName}`);
  });
}

export async function dbCommand(command: {}) {
  await db.command(command);
}

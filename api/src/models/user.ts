import { ObjectId, WithId, Document } from "mongodb";
import { dbCommand } from "../services/db";

export default interface User extends WithId<Document> {
  username: string,
  email: string,
  password: string,
  id?: ObjectId
}

export async function userSchemaValidation() {
  await dbCommand({
    "collMod": "users",
    "validator": {
      $jsonSchema: {
        bsonType: "object",
        required: ["username", "email", "password"],
        additionalProperties: false,
        properties: {
          _id: {},
          username: {
            bsonType: "string",
            description: "'username' is required and is a string"
          },
          email: {
            bsonType: "string",
            description: "'email' is required and is a string"
          },
          password: {
            bsonType: "string",
            description: "'password' is required and is a string"
          }
        }
      }
    }
  })
}

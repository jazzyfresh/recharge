import { ObjectId, WithId, Document } from "mongodb";
import { dbCommand } from "../services/db";

export default interface Feedback extends WithId<Document> {
  username: string,
  chargerId: number,
  rating: number,
  description: string,
  id?: ObjectId
}

export async function feedbackSchemaValidation() {
  await dbCommand({
    "collMod": "feedback",
    "validator": {
      $jsonSchema: {
        bsonType: "object",
        required: ["username", "chargerId", "rating", "description"],
        additionalProperties: false,
        properties: {
          _id: {},
          username: {
            bsonType: "string",
            description: "'username' is required and is a string"
          },
          chargerId: {
            bsonType: "number",
            description: "'chargerId' is required and is a number"
          },
          rating: {
            bsonType: "number",
            description: "'rating' is required and is a number"
          },
          description: {
            bsonType: "string",
            description: "'description' is required and is a string"
          }
        }
      }
    }
  })
}

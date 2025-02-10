import { ObjectId, WithId, Document } from "mongodb";
import { dbCommand } from "../services/db";

export default interface Favorite extends WithId<Document> {
  username: string,
  chargerId: number,
  id?: ObjectId
}

export async function favoriteSchemaValidation() {
  await dbCommand({
    "collMod": "favorites",
    "validator": {
      $jsonSchema: {
        bsonType: "object",
        required: ["username", "chargerId"],
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
          }
        }
      }
    }
  })

}
// TODO: export schema validation and index creation
//       into a one time script
// db.favorites.createIndex( { chargerId: 1, username: 1 }, { unique: true } )
// db.users.createIndex( { username: 1 }, { unique: true} )

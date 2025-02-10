import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";

import { collections } from "../services/db";
import Favorite from "../models/favorite";

export const favoriteRouter = express.Router();

favoriteRouter.use(express.json());

favoriteRouter.get("/", async (req: Request, res: Response) => {
  try {
    const favorites = (await collections.favorites?.find({}).toArray()) as Favorite[];
    res.status(200).send(favorites);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

favoriteRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  
  try {
    const query = {_id: new ObjectId(id)};
    const favorite = (await collections.favorites?.findOne(query)) as Favorite;
    if (favorite) {
      res.status(200).send(favorite);
    }
  } catch (error) {
    res.status(404).send(`Unable to find favorite: ${req.params.id}`)
  }
});

favoriteRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newFavorite = req.body as Favorite;
    const result = await collections.favorites?.insertOne(newFavorite);

    result
      ? res.status(201).send(`Successfully created new favorite with id ${result.insertedId}`)
      : res.status(500).send("Failed to create a new favorite");
  } catch (error) {
    res.status(400).send({
      error: error.message,
      details: error.errInfo?.details,
    });
  }
});

favoriteRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const updatedFavorite: Favorite = req.body as Favorite;
    const query = { _id: new ObjectId(id) };
    const result = await collections.favorites?.updateOne(query, { $set: updatedFavorite });

    result
      ? res.status(200).send(`Successfully updated favorite with id ${id}`)
      : res.status(304).send(`Favorite with id: ${id} not updated`);
  } catch (error) {
    res.status(400).send({
      error: error.message,
      details: error.errInfo?.details,
    });
  }
});

favoriteRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.favorites?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Sucessfully removed favorite with id ${id}`);
    } else if (result && !result.deletedCount) {
      res.status(404).send(`Favorite with id ${id} does not exist`);
    } else if (!result) {
      res.status(400).send(`Failed to remove favorite with id ${id}`);
    }
  } catch (error) {
    res.status(400).send(error.message);
  };
});


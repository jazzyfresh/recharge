import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";

import { collections } from "../services/db";
import Review from "../models/review";

export const reviewRouter = express.Router();

reviewRouter.use(express.json());

reviewRouter.get("/", async (req: Request, res: Response) => {
  try {
    const reviews = (await collections.reviews?.find({}).toArray()) as Review[];
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

reviewRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  
  try {
    const query = {_id: new ObjectId(id)};
    const review = (await collections.reviews?.findOne(query)) as Review;
    if (review) {
      res.status(200).send(review);
    }
  } catch (error) {
    res.status(404).send(`Unable to find review: ${req.params.id}`)
  }
});

reviewRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newReview = req.body as Review;
    const result = await collections.reviews?.insertOne(newReview);

    result
      ? res.status(201).send(`Successfully created new review with id ${result.insertedId}`)
      : res.status(500).send("Failed to create a new review");
  } catch (error) {
    res.status(400).send({
      error: error.message,
      details: error.errInfo?.details,
    });
  }
});

reviewRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const updatedReview: Review = req.body as Review;
    const query = { _id: new ObjectId(id) };
    const result = await collections.reviews?.updateOne(query, { $set: updatedReview });

    result
      ? res.status(200).send(`Successfully updated review with id ${id}`)
      : res.status(304).send(`Review with id: ${id} not updated`);
  } catch (error) {
    res.status(400).send({
      error: error.message,
      details: error.errInfo?.details,
    });
  }
});

reviewRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.reviews?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Sucessfully removed review with id ${id}`);
    } else if (result && !result.deletedCount) {
      res.status(404).send(`Review with id ${id} does not exist`);
    } else if (!result) {
      res.status(400).send(`Failed to remove review with id ${id}`);
    }
  } catch (error) {
    res.status(400).send(error.message);
  };
});


import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";

import { collections } from "../services/db";
import Feedback from "../models/feedback";

export const feedbackRouter = express.Router();

feedbackRouter.use(express.json());

feedbackRouter.get("/", async (req: Request, res: Response) => {
  try {
    const feedback = (await collections.feedback?.find({}).toArray()) as Feedback[];
    res.status(200).send(feedback);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

feedbackRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  
  try {
    const query = {_id: new ObjectId(id)};
    const feedback = (await collections.feedback?.findOne(query)) as Feedback;
    if (feedback) {
      res.status(200).send(feedback);
    }
  } catch (error) {
    res.status(404).send(`Unable to find feedback: ${req.params.id}`)
  }
});

feedbackRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newFeedback = req.body as Feedback;
    const result = await collections.feedback?.insertOne(newFeedback);

    result
      ? res.status(201).send(`Successfully created new feedback with id ${result.insertedId}`)
      : res.status(500).send("Failed to create a new feedback");
  } catch (error) {
    res.status(400).send({
      error: error.message,
      details: error.errInfo?.details,
    });
  }
});

feedbackRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const updatedFeedback: Feedback = req.body as Feedback;
    const query = { _id: new ObjectId(id) };
    const result = await collections.feedback?.updateOne(query, { $set: updatedFeedback });

    result
      ? res.status(200).send(`Successfully updated feedback with id ${id}`)
      : res.status(304).send(`Feedback with id: ${id} not updated`);
  } catch (error) {
    res.status(400).send({
      error: error.message,
      details: error.errInfo?.details,
    });
  }
});

feedbackRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.feedback?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Sucessfully removed feedback with id ${id}`);
    } else if (result && !result.deletedCount) {
      res.status(404).send(`Feedback with id ${id} does not exist`);
    } else if (!result) {
      res.status(400).send(`Failed to remove feedback with id ${id}`);
    }
  } catch (error) {
    res.status(400).send(error.message);
  };
});


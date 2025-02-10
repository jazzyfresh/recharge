import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";

import { collections } from "../services/db";
import User from "../models/user";

export const userRouter = express.Router();

userRouter.use(express.json());

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = (await collections.users?.find({}).toArray()) as User[];
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  
  try {
    const query = {_id: new ObjectId(id)};
    const user = (await collections.users?.findOne(query)) as User;
    if (user) {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(404).send(`Unable to find user: ${req.params.id}`)
  }
});

userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newUser = req.body as User;
    const result = await collections.users?.insertOne(newUser);

    result
      ? res.status(201).send(`Successfully created new user with id ${result.insertedId}`)
      : res.status(500).send("Failed to create a new user");
  } catch (error) {
    res.status(400).send({
      error: error.message,
      details: error.errInfo?.details,
    });
  }
});

userRouter.put("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const updatedUser: User = req.body as User;
    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.updateOne(query, { $set: updatedUser });

    result
      ? res.status(200).send(`Successfully updated user with id ${id}`)
      : res.status(304).send(`User with id: ${id} not updated`);
  } catch (error) {
    res.status(400).send({
      error: error.message,
      details: error.errInfo?.details,
    });
  }
});

userRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Sucessfully removed user with id ${id}`);
    } else if (result && !result.deletedCount) {
      res.status(404).send(`User with id ${id} does not exist`);
    } else if (!result) {
      res.status(400).send(`Failed to remove user with id ${id}`);
    }
  } catch (error) {
    res.status(400).send(error.message);
  };
});


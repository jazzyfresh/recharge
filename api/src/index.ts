import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";

import { connectToDatabase } from './services/db';

import { userRouter } from './routes/userRoutes';
import { feedbackRouter } from './routes/feedbackRoutes';
import { favoriteRouter } from './routes/favoriteRoutes';

import { userSchemaValidation } from './models/user';
import { feedbackSchemaValidation } from './models/feedback';
import { favoriteSchemaValidation } from './models/favorite';

// Environment Variables
dotenv.config();
const PORT = process.env.PORT || 8000;

// Server initialization
const app: Express = express();
app.use(express.json());
app.use(cors());

// Database initialization
connectToDatabase()
  .then(() => {
    // Routes
    app.get("/", (req: Request, res: Response) => {
      res.send("¡Vamos!");
    });
    app.use('/users', userRouter);
    app.use('/feedback', feedbackRouter);
    app.use('/favorites', favoriteRouter);

    // Validators
    userSchemaValidation();
    feedbackSchemaValidation();
    favoriteSchemaValidation();

    // Start server
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`)
    })
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });

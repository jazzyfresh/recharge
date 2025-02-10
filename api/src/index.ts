import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";

import { connectToDatabase } from './services/db';
import { userRouter } from './routes/userRoutes';
import { userSchemaValidation } from './models/user';

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

    // Validators
    userSchemaValidation();

    // Start server
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`)
    })
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });

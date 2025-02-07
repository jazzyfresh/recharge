import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";

dotenv.config();

// Server initialization
const app: Express = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("¡Vamos!");
});

// Start server
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`)
})

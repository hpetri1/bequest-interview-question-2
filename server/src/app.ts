import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { Database } from "./types.js";

const PORT = 8080;
const app = express();
const database: Database = { data: "Hello World" };

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST",
  })
);
app.use(express.json());

// Routes

app.get("/", (req: Request, res: Response): void => {
  res.json(database);
});

app.post("/", (req: Request, res: Response): void => {
  if (typeof req.body.data === "string") {
    database.data = req.body.data;
    res.sendStatus(200);
  } else {
    res.status(400).json({ error: "Invalid data format" });
  }
});

app.listen(PORT, (): void => {
  console.log("Server running on port " + PORT);
});

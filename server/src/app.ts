import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { Database, PostRequestBody } from "./types.js";
import * as Yup from "yup";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { validationSchema } from "./utils/validationSchema.js";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

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

app.get("/", (req: Request, res: Response<Database>): void => {
  res.json(database);
});

app.post(
  "/",
  async (
    req: Request<{}, {}, PostRequestBody>,
    res: Response
  ): Promise<void> => {
    try {
      const sanitizedData = purify.sanitize(req.body.data);

      await validationSchema.validate({ data: sanitizedData });

      database.data = sanitizedData;
      res.sendStatus(200);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);

app.listen(PORT, (): void => {
  console.log("Server running on port " + PORT);
});

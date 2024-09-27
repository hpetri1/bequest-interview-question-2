import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { Database, PostRequestBody } from "./types.js";
import * as Yup from "yup";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { validateData } from "./utils/validation.js";
import { generateHash } from "./utils/generateHash.js";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

const PORT = 8080;
const app = express();
const database: Database = {
  data: "Hello World",
  hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
};

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
      const isValid = await validateData(sanitizedData);
      if (!isValid) return;

      const expectedHash = generateHash(sanitizedData);
      const newHash = req.body.hash;

      if (expectedHash === newHash) {
        database.data = sanitizedData;
        database.hash = newHash;
      }
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

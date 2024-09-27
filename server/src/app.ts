import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { Database, PostRequestBody } from "./types.js";
import * as Yup from "yup";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { validateData } from "./utils/validation.js";
import { decryptData, encryptData, generateHash } from "./utils/security.js";

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
  // Encrypt the data before sending it to the client
  const encryptedData = encryptData(database.data);
  res.json({ data: encryptedData, hash: database.hash });
});

app.post(
  "/",
  async (
    req: Request<{}, {}, PostRequestBody>,
    res: Response
  ): Promise<void> => {
    try {
      // Decrypt the incoming data
      const encryptedData = req.body.data;
      const decryptedData = decryptData(encryptedData);

      // Sanitize the decrypted data
      const sanitizedData = purify.sanitize(decryptedData);

      // Validate the sanitized data
      const isValid = await validateData(sanitizedData);
      if (!isValid) return;

      // Hash comparison
      const expectedHash = generateHash(sanitizedData);
      const newHash = req.body.hash;

      // Update the database if the hash matches
      if (expectedHash === newHash) {
        database.data = sanitizedData;
        database.hash = newHash;
        res.sendStatus(200);
      } else {
        res.status(400).json({ error: "Hash does not match" });
      }
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

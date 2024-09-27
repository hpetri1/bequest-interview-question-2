import { createHash } from "crypto";
import CryptoJS from "crypto-js";

const SECRET_KEY = "my-very-secure-secret-key";

export const generateHash = (input: string): string => {
  return createHash("sha256").update(input).digest("hex");
};

export const encryptData = (plainText: string): string => {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

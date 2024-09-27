import * as CryptoJS from "crypto-js";

export const generateHash = (input: string): string => {
  return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
};

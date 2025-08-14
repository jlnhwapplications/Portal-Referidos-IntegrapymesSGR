import CryptoJS from "crypto-js";
// import { secretKey } from "../constants/secret-key";

export const dataEncrpt = (value) => {
  try {
    debugger
    let key = process.env.NEXT_PUBLIC_SECRET_KEY
    return CryptoJS.AES.encrypt(JSON.stringify(value), '3*U{m1q#t$>.I!/<0/^NXe"|6...gE').toString();
  } catch (error) {
    console.log("🚀 ~ file: data-encrypt.js:9 ~ dataEncrpt ~ error:", error);
  }
};
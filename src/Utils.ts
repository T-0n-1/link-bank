import { Response } from "express";
import dotenv from "dotenv";

dotenv.config();

// Whitelist of allowed origins for backend
export const whitelist: string[] = [
  `${process.env.SERVERNAME}:${process.env.PROXYPORT}`,
];

// Function for checking if the request is from a whitelisted origin
export function isOriginAllowed(origin: string, whitelist: string[]): boolean {
  return whitelist.indexOf(origin) !== -1;
}

// Function for setting headers for CORS
export function setHeaders(res: Response, origin: string): void {
  res.header("Access-Control-Allow-Origin", origin);
}

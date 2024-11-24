import { whitelist, isOriginAllowed, setHeaders } from "../Utils";
import express, { Router, Request, Response } from "express";
import Joi from "joi";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from a .env file

const router: Router = express(); // Create an Express application

// CORS middleware
router.use((req: Request, res: Response, next) => {
  const origin: string = req.headers.origin || "";
  if (isOriginAllowed(origin, whitelist)) {
    setHeaders(res, origin);
  }
  next();
});

router.use(express.json()); // Enable JSON body parsing
router.use(express.urlencoded({ extended: true })); // Enable URL-encoded body parsing

export default router; // Export the router for use in main Backend app

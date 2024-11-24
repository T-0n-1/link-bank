import express, { Router, Request, Response } from "express";
import Joi from "joi";
import cors from "cors";
import dotenv from "dotenv";
import type { EJSData } from "../Interfaces";
import axios from "axios";

dotenv.config(); // Load environment variables from a .env file

const router: Router = express(); // Create an Express application
let EJSData: EJSData[]; // Data to pass to the EJS template

router.use(cors()); // Enable CORS for all origins
router.use(express.json()); // Enable JSON body parsing
router.use(express.urlencoded({ extended: true })); // Enable URL-encoded body parsing
router.use(express.static("public")); // Serve static files from the public directory

router.get("/getAll", (req: Request, res: Response) => {
  const querySchema = Joi.object().unknown(false);
  const { error } = querySchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    axios
      .get(
        `http://${process.env.SERVERNAME}:${process.env.BACKENDPORT}/api/getAll`,
      )
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .then((jsonObject) => res.json(jsonObject))
      .catch((error) => {
        console.error("Error fetching data: " + error);
        res.status(500).json({ error: "Failed to fetch data" });
      });
  }
});

export default router; // Export the router for use in main Proxy app

import express, { Router, Request, Response } from "express";
import Joi from "joi";
import cors from "cors";
import dotenv from "dotenv";
import type { EJSData } from "../Interfaces";
import axios from "axios";

dotenv.config(); // Load environment variables from a .env file

const router: Router = Router(); // Create an Express application
let EJSData: EJSData[]; // Data to pass to the EJS template

router.use(cors()); // Enable CORS for all origins
router.use(express.json()); // Enable JSON body parsing
router.use(express.urlencoded({ extended: true })); // Enable URL-encoded body parsing
router.use(express.static("public")); // Serve static files from the public directory

// Route for GETting all rows from the database
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
        return response.data;
      })
      .then((jsonObject) => res.json(jsonObject))
      .catch((error) => {
        console.error("Error fetching data: " + error);
        res.status(500).json({ error: "Failed to fetch data" });
      });
  }
});

// Route for GETting a single row from the database
router.get("/getbyid/:id", (req: Request, res: Response) => {
  const querySchema = Joi.object({
    id: Joi.number().integer().min(1).max(9999).required(),
  }).unknown(false);
  const { value, error } = querySchema.validate(req.params);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    axios
      .get(
        `http://${process.env.SERVERNAME}:${process.env.BACKENDPORT}/api/getbyid/${value.id}`,
      )
      .then((response) => {
        return response.data;
      })
      .then((jsonObject) => res.json(jsonObject))
      .catch((error) => {
        console.error("Error fetching data: " + error);
        res.status(500).json({ error: "Failed to fetch data" });
      });
  }
});

router.post("/insert", (req: Request, res: Response) => {
  const { error, value } = Joi.object({
    linkName: Joi.string().min(2).max(50).required(),
    link: Joi.string().uri().required(),
    description: Joi.string().min(2).max(400).required(),
  })
    .unknown(false)
    .validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  } else {
    axios
      .post(
        `http://${process.env.SERVERNAME}:${process.env.BACKENDPORT}/api/insert`,
        value,
      )
      .then((response) => {
        return response.data;
      })
      .then((jsonObject) => res.json(jsonObject))
      .catch((error) => {
        console.error("Error inserting data: " + error);
        res
          .status(error.response?.status || 500)
          .json({ error: error.response?.data || "Failed to insert data" });
      });
  }
});

export default router; // Export the router for use in main Proxy app

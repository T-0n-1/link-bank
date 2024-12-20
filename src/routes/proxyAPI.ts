import express, { Router, Request, Response } from "express";
import Joi from "joi";
import cors from "cors";
import dotenv from "dotenv";
import type { EJSData } from "../Interfaces";
import axios from "axios";
import { Link } from "../Interfaces";

dotenv.config(); // Load environment variables from a .env file

const router: Router = Router(); // Create an Express application
let EJSData: EJSData[]; // Data to pass to the EJS template

router.use(cors()); // Enable CORS for all origins
router.use(express.json()); // Enable JSON body parsing
router.use(express.urlencoded({ extended: true })); // Enable URL-encoded body parsing
router.use(express.static("public")); // Serve static files from the public directory

// Route for rendering listOfAllLinks.ejs
router.get("/links", async (req: Request, res: Response) => {
  const querySchema = Joi.object().unknown(false);
  const { error } = querySchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    try {
      const url = `http://${process.env.SERVERNAME}:${process.env.PROXYPORT}/api/getAll`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result: Link[] = await response.json();
      res.render("list", {
        title: "LinkBank - List of all Links",
        topicH1: "LinkBank",
        links: result,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.render("list", {
        title: "LinkBank - Error",
        topicH1: "Error",
        links: [],
      });
    }
  }
});

// Route for rendering editLink.ejs
router.get("/edit/:id", async (req: Request, res: Response) => {
  const querySchema = Joi.object({
    id: Joi.number().integer().min(1).max(9999).required(),
  });
  const { value, error } = querySchema.validate(req.params);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  try {
    const url = `http://${process.env.SERVERNAME}:${process.env.PROXYPORT}/api/getbyid/${value.id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    if (!Array.isArray(result) || result.length === 0) {
      throw new Error("No data found for the given ID.");
    }
    res.render("edit", {
      title: "LinkBank - Edit Link",
      topicH1: "LinkBank",
      editable: result[0],
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.render("edit", {
      title: "LinkBank - Error",
      topicH1: "Error",
      editable: {
        id: -1,
        linkName: "Error",
        link: "Error",
        description: "Error",
      },
    });
  }
});

// Route for rendering newLink page
router.get("/new", (req, res) => {
  const querySchema = Joi.object().unknown(false);
  const { error } = querySchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  } else {
    res.render("edit", {
      title: "LinkBank - New Link",
      topicH1: "LinkBank",
      editable: {
        id: null, // No ID for new links
        linkName: "",
        link: "",
        description: "",
      },
    });
  }
});

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

// Route for POSTing new row to the database
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

// Route for updating one row in the database using PUT method
router.put("/update", (req: Request, res: Response) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1).max(9999).required(),
    linkName: Joi.string().max(50).optional(),
    link: Joi.string().uri().optional(),
    description: Joi.string().max(400).optional(),
  }).unknown(false);
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  } else {
    axios
      .put(
        `http://${process.env.SERVERNAME}:${process.env.BACKENDPORT}/api/update`,
        value,
      )
      .then((response) => {
        return response.data;
      })
      .then((jsonObject) => res.json(jsonObject))
      .catch((error) => {
        console.error("Error updating data: " + error);
        res
          .status(error.response?.status || 500)
          .json({ error: error.response?.data || "Failed to update data" });
      });
  }
});

// Route for deleting one row from the database
router.delete("/delete/:id", (req: Request, res: Response) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1).max(9999),
  }).unknown(false);
  const { error, value } = schema.validate(req.params);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  } else {
    axios
      .delete(
        `http://${process.env.SERVERNAME}:${process.env.BACKENDPORT}/api/delete/${value.id}`,
      )
      .then((response) => {
        return response.data;
      })
      .then((jsonObject) => res.json(jsonObject))
      .catch((error) => {
        console.error("Error deleting data: " + error);
        res
          .status(error.response?.status || 500)
          .json({ error: error.response?.data || "Failed to delete data" });
      });
  }
});

export default router; // Export the router for use in main Proxy app

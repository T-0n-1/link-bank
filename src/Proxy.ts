import express, { Express, Request, Response } from "express";
import Joi from "joi";
import cors from "cors";
import dotenv from "dotenv";
import proxyRouter from "./routes/proxyAPI";
import type { EJSData } from "./Interfaces";
import path from "path";

dotenv.config(); // Load environment variables from a .env file

const port: number = Number(process.env.PROXYPORT) || 4330; // Port the server will listen on

const app: Express = express(); // Create an Express application
let EJSData: EJSData; // Data to pass to the EJS template

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Enable JSON body parsing
app.use(express.urlencoded({ extended: true })); // Enable URL-encoded body parsing
app.use(express.static("public")); // Serve static files from the public directory
app.set("view engine", "ejs"); // Set the view engine to EJS
app.set("views", path.join(__dirname, "views"));
app.use("/api", proxyRouter); // Use the proxyAPI router for all routes starting with /api

// Route for the home page with basic GET request
app.get("/", (req: Request, res: Response) => {
  const querySchema = Joi.object().unknown(false);
  const { error } = querySchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    EJSData = {
      title: "LinkBank",
      topicH1: "LinkBank",
    };
    res.render("index", EJSData);
  }
});

app.listen(port, () => console.log(`Proxy server listening on port ${port}`));

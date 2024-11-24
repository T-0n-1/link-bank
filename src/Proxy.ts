import express, { Express, Request, Response } from "express";
import Joi from "joi";
import cors from "cors";
import dotenv from "dotenv";
import proxyRouter from "./routes/proxyAPI";
import type { EJSData } from "./Interfaces";

dotenv.config(); // Load environment variables from a .env file

const port: number = Number(process.env.PROXYPORT) || 3210; // Port the server will listen on

const app: Express = express(); // Create an Express application
let EJSData: EJSData[]; // Data to pass to the EJS template

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Enable JSON body parsing
app.use(express.urlencoded({ extended: true })); // Enable URL-encoded body parsing
app.use(express.static("public")); // Serve static files from the public directory
app.set("viewengine", "ejs"); // Set the view engine to EJS
app.use("/api", proxyRouter);

// Route for the home page with basic GET request
app.get("/", (req: Request, res: Response) => {
  const querySchema = Joi.object().unknown(false);
  const { error } = querySchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    EJSData = ["LinkBank", "LinkBank"];
    res.render("index", EJSData);
  }
});

app.listen(port, () => console.log(`Proxy server listening on port ${port}`));

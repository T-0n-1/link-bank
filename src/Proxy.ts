import express, { Express, Request, Response } from "express";
import Joi from "joi";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from a .env file

const port = process.env.PROXYPORT || 3210; // Port the server will listen on

const app: Express = express(); // Create an Express application
const title = "LinkBank"; // Title of the website

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Enable JSON body parsing
app.use(express.urlencoded({ extended: true })); // Enable URL-encoded body parsing
app.use(express.static("public")); // Serve static files from the public directory
app.set("viewengine", "ejs"); // Set the view engine to EJS

app.get("/", (req: Request, res: Response) => {
  const querySchema = Joi.object().unknown(false);
  const { error } = querySchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    res.render("index", {
      title: title,
      topicH1: `LinkBank`,
    });
  }
});

app.listen(port, () => console.log(`Proxyserver listening on port ${port}`));

import express, { Express, Request, Response } from "express";
import Joi from "joi";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PROXYPORT || 3210;

const app: Express = express();

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
      greeting: `${greeting()} - this is the main app's landing page`,
      method: req.method,
      path: req.path,
      hostname: req.hostname,
      port: `${port} - BrowserSync using port ${getPort()} for dev purposess`,
    });
  }
});

app.listen(port, () => console.log(`Proxyserver listening on port ${port}`));

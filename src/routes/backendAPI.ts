import express, { Router, Request, Response } from "express";
import mysql, { MysqlError } from "mysql";
import { connectionPool, LinkRow } from "../Utils";
import Joi from "joi";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from a .env file

const router: Router = express(); // Create an Express application

router.use(express.json()); // Enable JSON body parsing
router.use(express.urlencoded({ extended: true })); // Enable URL-encoded body parsing

router.get("/getAll", (req: Request, res: Response) => {
  const querySchema = Joi.object().unknown(false);
  const { error } = querySchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    const queryStr: string = "SELECT * FROM ??";
    const query: string = mysql.format(queryStr, [process.env.DBTABLE]);
    const linkrow: LinkRow = new LinkRow();
    connectionPool.query(query, (err: MysqlError, rows: LinkRow[]) => {
      if (err) {
        res.status(400).send(err.sqlMessage);
        return;
      }
      rows.forEach((link: LinkRow) => {
        linkrow.id = link.id || -1;
        linkrow.linkName = link.linkName || "no linkName";
        linkrow.link = link.link || "no link";
        linkrow.description = link.description || "no description";
        console.log(linkrow.toString());
      });
      res.json(rows);
    });
  }
});

export default router; // Export the router for use in main Backend app

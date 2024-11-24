import express, { Router, Request, Response } from "express";
import mysql, { MysqlError, OkPacket } from "mysql";
import { connectionPool, LinkRow } from "../Utils";
import Joi from "joi";
import dotenv from "dotenv";
import type { queryArray } from "../Interfaces";

dotenv.config(); // Load environment variables from a .env file

const router: Router = Router(); // Create an Express application

router.use(express.json()); // Enable JSON body parsing
router.use(express.urlencoded({ extended: true })); // Enable URL-encoded body parsing

// Route for GETting all rows from the database
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

// Route for GETting a single row from the database
router.get("/getbyid/:id", (req: Request, res: Response) => {
  const querySchema = Joi.object({
    id: Joi.number().integer().min(1).max(9999).required(),
  }).unknown(false);
  const { value, error } = querySchema.validate(req.params);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    const queryStr: string = "SELECT * FROM ?? WHERE id = ?";
    const query: string = mysql.format(queryStr, [
      process.env.DBTABLE,
      value.id,
    ]);
    connectionPool.query(query, (err: MysqlError, rows: LinkRow[]) => {
      if (err) {
        res.status(400).send(err.sqlMessage);
        return;
      }
      res.json(rows);
    });
  }
});

// Route for POSTing a new row to the database
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
  }
  const query = mysql.format("INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)", [
    process.env.DBTABLE,
    "linkName",
    "link",
    "description",
    value.linkName,
    value.link,
    value.description,
  ]);
  connectionPool.query(query, (err: MysqlError, results: OkPacket) => {
    if (err) {
      console.error("Database error:", err.sqlMessage);
      return res
        .status(500)
        .json({ error: "Database error", details: err.sqlMessage });
    }
    res.status(201).json({
      message: "Row inserted successfully",
      insertId: results.insertId,
    });
  });
});

// Route for PUTting an update to a row in the database
router.put("/update", (req: Request, res: Response) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1).max(9999).required(),
    linkName: Joi.string().max(15).optional(),
    link: Joi.string().uri().optional(),
    description: Joi.string().optional(),
  }).unknown(false);
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  const { id, ...fieldsToUpdate } = value;
  if (Object.keys(fieldsToUpdate).length === 0) {
    res.status(400).json({ error: "No fields to update provided." });
    return;
  }
  const setClauses: string[] = [];
  const queryValues: queryArray = [process.env.DBTABLE];
  for (const key in fieldsToUpdate) {
    setClauses.push("?? = ?");
    queryValues.push(key, fieldsToUpdate[key]);
  }
  const queryStr = `
    UPDATE ?? 
    SET ${setClauses.join(", ")} 
    WHERE ?? = ?
  `;
  queryValues.push("id", id);
  const query = mysql.format(queryStr, queryValues);
  connectionPool.query(query, (err: MysqlError, okPacket: OkPacket) => {
    if (err) {
      res.status(400).send(err.sqlMessage);
      return;
    }
    console.log(`Row updated with id: ${id}`);
    res.json({ message: `Rows changed: ${okPacket.changedRows}` });
  });
});

// Route for DELETEing a row from the database
router.delete("/delete/:id", (req: Request, res: Response) => {
  const schema = Joi.object({
    id: Joi.number().integer().min(1).max(9999),
  }).unknown(false);
  const { error, value } = schema.validate(req.params);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  const queryStr = "DELETE FROM ?? WHERE ?? = ?";
  const query = mysql.format(queryStr, [process.env.DBTABLE, "id", value.id]);
  connectionPool.query(query, (err: MysqlError, okPacket: OkPacket) => {
    if (err) {
      res.status(400).send(err.sqlMessage);
      return;
    }
    console.log(`Row deleted with id: ${value.id}`);
    res.json({ message: `Rows deleted: ${okPacket.affectedRows}` });
  });
});

export default router; // Export the router for use in main Backend app

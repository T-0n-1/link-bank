import { Pool, createPool } from "mysql";
import { Response } from "express";
import dotenv from "dotenv";
import type { Link } from "./Interfaces";

dotenv.config();

// Whitelist of allowed origins for backend
export const whitelist: string[] = [
  `${process.env.SERVERNAME}:${process.env.PROXYPORT}`,
  `${process.env.SERVERNAME}:${process.env.BROWSERSYNCPORT}`,
];

// Function for checking if the request is from a whitelisted origin
export function isOriginAllowed(origin: string, whitelist: string[]): boolean {
  return whitelist.indexOf(origin) !== -1;
}

// Function for setting headers for CORS
export function setHeaders(res: Response, origin: string): void {
  res.header("Access-Control-Allow-Origin", origin);
}

export class LinkRow implements Link {
  id: number;
  linkName: string;
  link: string;
  description: string;
  constructor(
    id: number = 0,
    linkName: string = "no linkName",
    link: string = "no link",
    description: string = "no description",
  ) {
    this.id = id;
    this.linkName = linkName;
    this.link = link;
    this.description = description;
  }

  public toString(): string {
    return `(${this.id} ${this.linkName} ${this.link} ${this.description})`;
  }
}

export const connectionPool: Pool = createPool({
  connectionLimit: 10,
  host: process.env.DBSERVER,
  database: process.env.DBNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
});

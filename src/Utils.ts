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

export const mainContent: string = `
      <h2>Welcome to home of tech related links</h2>
    <p>Click the links to interact with app:</p>
    <ul>
      <li>
        Home
        <p>Takes you back home to this main page.</p>
      </li>
      <li>
        List all links
        <p>Fetches all links from MySQL database and lists them.</p>
      </li>
      <li>
        Add new link
        <p>Create new link and post it to database.</p>
      </li>
      <li>
        App in GitHub
        <p>App source code in GitHub</p>
      </li>
    </ul>`;

export const listContent = {
  title: "LinkBank - List of links",
  topicH1: "List of links",
  content: `<h2>Links List</h2>
  <ul id="links-list">
    <!-- Fetched links will be inserted here -->
  </ul>`,
};

export async function fetchLinks() {
  try {
    const response = await fetch(
      `${process.env.SERVERNAME}:${process.env.PROXYPORT}/api/getAll`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch links");
    }
    const links = await response.json();

    // Clear the current list
    const listContainer = document.getElementById("links-list")!;
    listContainer.innerHTML = "";

    // Add each link to the list
    links.forEach((link: Link) => {
      const listItem = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.href = link.link;
      anchor.textContent = link.linkName;
      anchor.target = "_blank";
      listItem.appendChild(anchor);
      listContainer.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching links:", error);
    alert("Failed to load links. Please try again.");
  }
}

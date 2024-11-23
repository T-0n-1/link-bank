// FIX PROCESS.ENV VARS AND TABLE/FIELDS NAMES AND VALUES

/* eslint-disable no-undef */
import dotenv from 'dotenv';
import { createConnection } from 'mysql';

dotenv.config();

function runSQLCommands() {
  // Create a connection to the MySQL server
  const connection = createConnection({
    host: process.env.DBSERVER, 
    user: process.env.DBUSER, 
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME, 
    multipleStatements: true,
  });

  try {
    // Connect to the MySQL server
    connection.connect((err) => {
      if (err) {
        console.error("An error occurred while connecting to the MySQL server:", err);
        return;
      }
      console.log("MySQL server ready.");
    });

    // Use the database
    connection.query(`USE ??`, [process.env.DBNAME]);

    // Create the table if it doesn’t exist
    connection.query(`
        DROP TABLE IF EXISTS ??;

        CREATE TABLE ?? (
            id INT PRIMARY KEY, 
            fname VARCHAR(255) NOT NULL,
            lname VARCHAR(255) NOT NULL,
            birth DATE NOT NULL
        );
        `, [process.env.DBTABLE, process.env.DBTABLE]);
    console.log("Table Person ensured.");

    // Insert sample data
    const result = connection.query(`
            INSERT INTO Person (id, fname, lname, birth)
            VALUES
                (1, 'Alice', 'Johnson', '1980-05-15'),
                (2, 'John', 'Doe', '1990-01-01'),
                (3, 'Jane', 'Smith', '1985-06-15'),
                (4, 'Bob', 'Brown', '1975-12-31'),
                (5, 'Eve', 'White', '2000-10-01'),
                (6, 'Charlie', 'Green', '1995-03-20'),
                (7, 'Grace', 'Black', '1988-07-04'),
                (8, 'Harry', 'Gray', '1970-11-11'),
                (9, 'Ivy', 'Taylor', '1992-09-30'),
                (10, 'Kevin', 'Carter', '1983-04-25')
        `);
    console.log(`Inserted ${result.affectedRows} rows into the Person table.`);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Close the connection
    connection.end();
    console.log("Connection closed.");
  }
}

// Execute the function
runSQLCommands();
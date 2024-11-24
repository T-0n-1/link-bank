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
            id INT PRIMARY KEY AUTO_INCREMENT, 
            linkName VARCHAR(255) NOT NULL,
            link VARCHAR(70) NOT NULL,
            description VARCHAR(400) NOT NULL
        );
        `, [process.env.DBTABLE, process.env.DBTABLE]);
    console.log(`Table ${process.env.DBTABLE} ensured.`);

    // Insert sample data
    const result = connection.query(`
            INSERT INTO ?? (linkName, link, description)
            VALUES
                ('Toni Mertanen', 'https://tonimertanen.fi', 'Potfolio website of Toni Mertanen'),
                ('Webbidevaus.fi', 'https://webbidevaus.fi', 'Website for web development podcast Webbidevaus.fi'),
                ('Turvakäräjät', 'https://turvakarajat.fi', 'Website for cybersecurity podcast Turvakäräjät'),
                ('Herrassmieshakkerit', 'https://herrasmieshakkerit.fi', 'Website for cybersecurity podcast Herrassmieshakkerit - hosts Mikko Hyppönen and Tomi Tuominen');
        `, [process.env.DBTABLE]);
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
![Static Badge](https://img.shields.io/badge/student_name-Toni_Mertanen-blue)

![Static Badge](https://img.shields.io/badge/student_number-x085916-blue)

# LinkBank

This repository contains the final compulsory task for the Palvelintekniikat (Server Technologies) course.
The project is a fullstack application with proxy and backend servers and client side app.
Project is using Node.js, Embedded JavaScript (EJS) and Express, demonstrating fundamental server technologies and practices.
TypeScript was used writing JS code for project.

## Table of Contents

- [LinkBank](#linkbank)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Structure Tree](#structure-tree)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Package json Scripts](#package-json-scripts)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [Author](#author)
  - [License](#license)

## Project Overview

The objective of this project is LinkBank - application for collecting and maintaining tech related links.
Typescript, nodemon and browser-sync have been used developing project.

## Structure Tree

```plaintext
link-bank/
├── public/
│   ├── styles.css                # Styles client side app
│   └── frontendScript.js         # Facilitates interaction in client side app
├── database/
│   └── initializeDatabase.mjs    # Script that reinstalls/-initializes MySQL database with basic data
├── src/
│    ├── routes/                  # Routes for proxy and backend server
│    ├── views/                   # Main and partial EJS files for rendering client side
│    ├── Backend.ts               # Backend server
│    ├── Proxy.ts                 # Proxy server
│    ├── Utils.ts                 # Functions for proxy and backend server
│    └── Interfaces.d.ts          # TypeScript types and interfaces for development purposes
├── README.md                     # This readme file
├── .prettierignore               # Prettier ignore file  (Prettier used through git precommit hook)
├── bs-config.js                  # Browser-sync config file
├── eslint.config.mjs             # ESLint config file    (ESLint used through git precommit hook)
├── nodemon-app.json              # Nodemon config, watches changes in src and public folders - reloads if change(s) occur
├── nodemon-ejs.json              # Nodemon config, watches changes in EJS files - copies views dir into dist and reloads if change(s) occur
├── test.http                     # Test cases for Visual Studio Code extension REST Client
├── start.mjs                     # Start script, action varies depending on is NODE_ENV 'development' or not
├── package.json                  # Node Package Managet setting file
└── tsconfig.json                 # TypeScript config file
```

## Features

- **Proxy and Backend Server**: Proxy for receiving client side requests and interacting with backend server secured with CORS.
- **Static File Serving**: Serves static files such as CSS and JavaScript.
- **Embedded Javascript Templates**: client side rendered dynamically with EJS.
- **Routing**: Implements routing from none-blocking proxy to proxy-only-accessible backend for different endpoints.
- **CORS**: CORS method used to secure backend access for only allowing entry from proxy server.
- **Valitading request**: Using Joi to valitade request on both Proxy and Backend server.
- **Middleware Usage**: Utilizes middleware for logging and request parsing.

## Technologies Used

- **TypeScript**: TypeScript used in dev environment for productivity, code quality and scalability.
- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **EJS**: Embedded JavaScript templating.
- **CSS**: Styling for the front-end.

## Installation

**Clone the repository** `git clone https://github.com/T-0n-1/link-bank`. **Navigate to the project directory** `cd link-bank` and
**Install dependencies** `npm install`.

## Package json Scripts

**_initDB_**

```
"node ./database/initializeDatabase.mjs",
```

Runs initializeDatabase file which reinstall/-initializes MySQL database with default data.

**_start_**

```
"node start.mjs",
```

Runs compiled Proxy.js in dist folder in development environment and concurrently Backend.js and Proxy.js in production environment.

**_dev_**

```
"dev": "concurrently \"nodemon --config nodemon-ejs.json\" \"nodemon --config nodemon-app.json\" \"NODE_ENV='development' browser-sync start --config bs-config.js\"",
```

Runs two different Nodemon instances -each with own config file- and browser-sync concurrently - at the same time. This script is used in dev environment (NODE_ENV = "development" takes care of that) and so the start.mjs file starts only proxy server.

> nodemon-app.json
>
> > Watches over changes in ts, js and css files inside src and public folders

> nodemon-ejs.json
>
> > Watches over changes in ejs view files - copying views folder from src to dist folder whenever change(s) occur

**_predev_**

```
"tsc -w & node ./dist/Backend.js &"
```

Predev script runs automatically before dev script - this one starts Typescript compiler on watch mode and compiled Backend.js in dist folder. Both the start to run on background asyncronously.

## Usage

**Start the server**:

```bash
npm start
```

**Access the application**:
Open your web browser and navigate to http://localhost:3000.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## Author

- **Toni Mertanen**
  - GitHub: [T-0n-1](https://github.com/T-0n-1)
  - LinkedIn: [Toni Mertanen](https://www.linkedin.com/in/toni-mertanen)
  - Website: [tonimertanen.fi](https://tonimertanen.fi)

## License

This project is licensed under the MIT License. See the LICENSE file for details.

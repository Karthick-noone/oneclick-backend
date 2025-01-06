const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5002;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS for all routes
// Middleware to parse JSON bodies
app.use(express.json());


const db = require('./db'); //external file for db



                                                   
// // Middleware function to check for direct access to API routes
// const preventDirectAccessToApi = (req, res, next) => {
//   const isApiRequest = req.originalUrl.startsWith("/");
//   if (isApiRequest && !req.headers.referer) {
//     // If it's an API request and there's no Referer header, respond with an error
//     return res.status(403).json({ error: "Direct access to API not allowed" });
//   }
//   // If it's not an API request or if there's a Referer header, proceed to the next middleware/route handler
//   next();
// };

// // Apply the middleware to all routes
// app.use(preventDirectAccessToApi);



////////////////////////////////////
app.get("/backend/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
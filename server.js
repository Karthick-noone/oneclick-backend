const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5001;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const axios = require("axios"); // Import axios
// const sendOtpSms = require("./smsService"); // Import the SMS service
// const config = require('./config'); // Import your config file
// Middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));  //first one
app.use(express.urlencoded({ limit: "10mb", extended: true })); //new one for extend file limit

app.use(cors()); // Enable CORS for all routes
// Middleware to parse JSON bodies
// app.use(express.json()); //first one
app.use(express.json({ limit: "10mb" })); //new one for extend file limit

const db = require("./db"); //external file for db

// const logStream = fs.createWriteStream(path.join(__dirname, "app.log"), { flags: "a" });

// console.log = (...args) => logStream.write(`[LOG] ${new Date().toISOString()} - ${args.join(" ")}\n`);
// console.error = (...args) => logStream.write(`[ERROR] ${new Date().toISOString()} - ${args.join(" ")}\n`);

// // Example log
// console.log("Server is starting...");
// console.error("This is a test error log.");

// fs.writeFile("test.log", "Testing file write", (err) => {
//   if (err) {
//     console.error("Failed to write file:", err);
//   } else {
//     console.log("File written successfully");
//   }
// });

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

// // MySQL connection configuration
// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'oneclick_empty',
// };

// // Create a MySQL connection
// const db = mysql.createConnection(dbConfig);

// // Connect to MySQL
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL');
// });

// // Middleware to handle MySQL errors
// db.on('error', (err) => {
//   console.error('MySQL error:', err);
//   if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//     // Reconnect if the connection is lost
//     db.connect((err) => {
//       if (err) {
//         console.error('Error reconnecting to MySQL:', err);
//       } else {
//         console.log('Reconnected to MySQL');
//       }
//     });
//   } else {
//     throw err;
//   }
// });

// // MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'oneclick',
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL');
// });

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "",
//     pass: "",
//   },
// });

// // Route to send email
// app.post("/backend/send-email", (req, res) => {
//   const { name, number, email, subject, message } = req.body;

//   const mailOptions = {
//     from: email,
//     to: "karthick.mindtek@gmail.com",
//     subject: subject,
//     text: `
//       Name: ${name}
//       Number: ${number}
//       Email: ${email}
//       Message: ${message}
//     `,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error sending email:", error);
//       res
//         .status(500)
//         .json({ error: "Failed to send email", details: error.message });
//     } else {
//       console.log("Email sent:", info.response);
//       res.status(200).json({ message: "Email sent successfully" });
//     }
//   });
// });

app.post("/backend/contact", (req, res) => {
  const { name, email, subject, message, number } = req.body;

  // Validate input
  if (!name || !email || !subject || !message || !number) {
    return res.status(400).send("All fields are required");
  }

  // Check if the email already exists
  const checkEmailQuery = `SELECT * FROM oneclick_contact_details WHERE email = ?`;
  db.query(checkEmailQuery, [email], (emailErr, emailResult) => {
    if (emailErr) {
      console.error("Error checking email:", emailErr);
      return res.status(500).send("Failed to check email.");
    }

    // Check if the phone number already exists
    const checkPhoneQuery = `SELECT * FROM oneclick_contact_details WHERE phone = ?`;
    db.query(checkPhoneQuery, [number], (phoneErr, phoneResult) => {
      if (phoneErr) {
        console.error("Error checking phone number:", phoneErr);
        return res.status(500).send("Failed to check phone number.");
      }

      // Construct the response message
      let responseMessage = "Message stored successfully";

      // If email exists
      if (emailResult.length > 0) {
        responseMessage = "Email already exists.";
      }

      // If phone number exists
      if (phoneResult.length > 0) {
        responseMessage = "Phone number already exists.";
      }

      // If both email and phone number exist
      if (emailResult.length > 0 && phoneResult.length > 0) {
        responseMessage = "Email and phone number already exists.";
      }

      // If neither exists, insert the new message
      if (emailResult.length === 0 && phoneResult.length === 0) {
        const insertQuery = `INSERT INTO oneclick_contact_details (name, email, subject, message, phone) VALUES (?, ?, ?, ?, ?)`;
        const values = [name, email, subject, message, number];

        db.query(insertQuery, values, (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting data:", insertErr);
            return res
              .status(500)
              .send("Failed to save the message. Please try again.");
          }

          // Add a notification for the contacted user
          const notificationMessage = `User ${name} contacted via email: ${email} with subject: ${subject}`;
          const notificationQuery =
            "INSERT INTO oneclick_notifications (message, is_read, type, created_at) VALUES (?, FALSE, ?, NOW())";
          const notificationType = "contacted users"; // Define type as 'contacted users'

          db.query(
            notificationQuery,
            [notificationMessage, notificationType],
            (notificationErr) => {
              if (notificationErr) {
                console.error("Error creating notification:", notificationErr);
                return res
                  .status(500)
                  .send("Message stored, but failed to create notification");
              }

              // Return the response message
              return res.status(200).send(responseMessage);
            }
          );
        });
      } else {
        // If we found existing email or phone, just send the response without inserting
        return res.status(409).send(responseMessage);
      }
    });
  });
});

// API endpoint to get contacts
app.get("/backend/fetchcontacts", (req, res) => {
  const sql = "SELECT * FROM oneclick_contact_details ORDER BY id DESC"; // Adjust table name as necessary

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching contacts:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

app.delete("/backend/api/deletecontact/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM oneclick_contact_details WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting contact entry:", err);
      return res
        .status(500)
        .json({ message: "Failed to delete contact entry" });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Contact entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Contact entry not found" });
    }
  });
});

// // Track Shipment Endpoint
// app.get('/backend/track-shipment', async (req, res) => {
//   const { order_id } = req.query;

//   console.log('Received request to track shipment with order_id:', order_id);  // Log incoming order_id

//   if (!order_id) {
//       console.error('Error: No order_id provided in the request');
//       return res.status(400).json({ error: 'Please provide an order ID' });
//   }

//   try {
//       db.query('SELECT * FROM oneclick_orders WHERE tracking_id = ?', [order_id], async (err, results) => {
//         if (err) {
//             console.error('Database query error:', err.message);
//             return res.status(500).json({ error: 'Database query failed' });
//         }

//         if (results.length === 0) {
//             console.error('Error: Order not found for order_id:', order_id);
//             return res.status(404).json({ error: 'Order not found' });
//         }

//         const trackingId = results[0].tracking_id;
//         console.log('Found tracking_id:', trackingId);

//         try {
//             const response = await axios.get(config.DELHIVERY_URL, {
//                 params: { waybill: trackingId },
//                 headers: {
//                     Authorization: `Bearer ${config.DELHIVERY_API_KEY}`,
//                 },
//             });

//             console.log('Delhivery API response:', response.data);
//             res.json(response.data);
//         } catch (apiError) {
//             console.error('Delhivery API error:', apiError.message);
//             res.status(500).json({ error: 'Failed to track shipment from Delhivery API' });
//         }
//       });
//   } catch (error) {
//       console.error('Server error:', error.message);
//       res.status(500).json({ error: 'Server error occurred' });
//   }
// });

// Set up multer for resume uploads
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/resumes";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save resumes
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp // Generate a unique file name
  },
});

// Create a multer instance for resume upload
const resumeUpload = multer({
  storage: resumeStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf, .doc, and .docx files are allowed."));
    }
  },
});
app.post(
  "/backend/submit-careers-form",
  resumeUpload.single("resume"),
  (req, res) => {
    const { name, email, phone, position, startDate } = req.body;
    const resumeLink = req.file ? req.file.filename : ""; // Get the uploaded file name

    // Query to check if the email already exists
    const checkEmailQuery = "SELECT * FROM oneclick_careers WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, emailResults) => {
      if (err) {
        console.error("Error checking email:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (emailResults.length > 0) {
        const lastApplication = emailResults[0];
        const previousStartDate = new Date(lastApplication.startDate);
        const currentDate = new Date();
        const timeDifference = currentDate - previousStartDate;
        const threeMonthsInMilliseconds = 3 * 30 * 24 * 60 * 60 * 1000; // Approx 3 months

        if (timeDifference < threeMonthsInMilliseconds) {
          const nextEligibleDate = new Date(
            previousStartDate.getTime() + threeMonthsInMilliseconds
          );
          return res.status(400).json({
            message: `You can re-apply after ${nextEligibleDate.toLocaleDateString()} (3 months from your previous application).`,
          });
        }
      }

      // Query to check if the phone number already exists
      const checkPhoneQuery = "SELECT * FROM oneclick_careers WHERE phone = ?";
      db.query(checkPhoneQuery, [phone], (err, phoneResults) => {
        if (err) {
          console.error("Error checking phone number:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        // Commented out phone number check
        // if (phoneResults.length > 0) {
        //   return res.status(400).json({ message: 'Phone number already exists' });
        // }

        if (phoneResults.length > 0) {
          const lastApplication = phoneResults[0];
          const previousStartDate = new Date(lastApplication.startDate);
          const currentDate = new Date();
          const timeDifference = currentDate - previousStartDate;
          const threeMonthsInMilliseconds = 3 * 30 * 24 * 60 * 60 * 1000; // Approx 3 months

          if (timeDifference < threeMonthsInMilliseconds) {
            const nextEligibleDate = new Date(
              previousStartDate.getTime() + threeMonthsInMilliseconds
            );
            return res.status(400).json({
              message: `You can re-apply after ${nextEligibleDate.toLocaleDateString()} (3 months from your previous application).`,
            });
          }
        }

        // If both email and phone are unique, insert into the database
        const insertQuery =
          "INSERT INTO oneclick_careers (name, email, phone, position, startDate, resumeLink) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(
          insertQuery,
          [name, email, phone, position, startDate, resumeLink],
          (err, result) => {
            if (err) {
              console.error("Error inserting data:", err);
              return res
                .status(500)
                .json({ message: "Failed to submit the form" });
            }

            // Add a notification for the careers application
            const notificationMessage = `User ${name} has applied for the position of ${position} via email: ${email}`;
            const notificationQuery =
              "INSERT INTO oneclick_notifications (message, is_read, type, created_at) VALUES (?, FALSE, ?, NOW())";
            const notificationType = "careers"; // Define type as 'careers'

            db.query(
              notificationQuery,
              [notificationMessage, notificationType],
              (notificationErr) => {
                if (notificationErr) {
                  console.error(
                    "Error creating notification:",
                    notificationErr
                  );
                  return res
                    .status(500)
                    .send("Form submitted, but failed to create notification");
                }

                // Return success message for form submission
                res
                  .status(200)
                  .json({ message: "Form submitted successfully" });
              }
            );
          }
        );
      });
    });
  }
);

app.get("/backend/api/careers", (req, res) => {
  const query = "SELECT * FROM oneclick_careers ORDER BY id DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    res.json(results);
  });
});

app.delete("/backend/api/deletecareers/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM oneclick_careers WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting career entry:", err);
      return res.status(500).json({ message: "Failed to delete career entry" });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Career entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Career entry not found" });
    }
  });
});

// db.query(query, (err, results) => {
//   if (err) throw err;
//   res.json(results);
//   console.log("resume",results)
// });
// db.query(sql, (err, results) => {
//   if (err) {
//    console.error('Error fetching product:', err);
//    return res.status(500).json({ message: 'Failed to fetch product' });
//  }

//  res.json(results);
// });
// // Error handler middleware for multer
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     // Multer-specific errors
//     return res.status(400).json({ message: err.message });
//   } else if (err) {
//     // Other errors
//     return res.status(500).json({ message: 'Server error.' });
//   }
// });

app.post("/backend/signup", (req, res) => {
  const { username, email, password, contactNumber } = req.body; // Include contactNumber

  // Validate input
  if (!username || !email || !password || !contactNumber) {
    // Add contactNumber to validation
    return res.status(400).json({ error: "All fields are required" });
  }

  // Function to generate the next user_id
  const generateUserId = (callback) => {
    db.query(
      "SELECT user_id FROM oneclick_users ORDER BY user_id DESC LIMIT 1",
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return callback(err);
        }

        let nextUserId = "usr000001"; // Default ID if no previous ID exists

        if (results.length > 0 && results[0].user_id) {
          const lastUserId = results[0].user_id;
          const numberPart = parseInt(lastUserId.slice(3)); // Extract the numeric part
          const newNumberPart = numberPart + 1;
          nextUserId = `usr${newNumberPart.toString().padStart(6, "0")}`;
        }

        callback(null, nextUserId);
      }
    );
  };

  // Check if the email, username, or contact number already exists
  db.query(
    "SELECT * FROM oneclick_users WHERE email = ? OR username = ? OR contact_number = ?",
    [email, username, contactNumber],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Server error" });
      }

      if (results.length > 0) {
        if (results.some((user) => user.email === email)) {
          return res.status(400).json({ error: "Email already exists" });
        }
        if (results.some((user) => user.username === username)) {
          return res.status(400).json({ error: "Username already exists" });
        }
        if (results.some((user) => user.contact_number === contactNumber)) {
          return res
            .status(400)
            .json({ error: "Contact number already exists" });
        }
      }

      // Generate the next user_id and insert the new user
      generateUserId((err, userId) => {
        if (err) {
          return res.status(500).json({ error: "Server error" });
        }

        const query =
          "INSERT INTO oneclick_users (username, email, password, user_id, contact_number) VALUES (?, ?, ?, ?, ?)";
        db.query(
          query,
          [username, email, password, userId, contactNumber],
          (err) => {
            if (err) {
              console.error("Error creating user:", err);
              return res.status(500).json({ error: "Server error" });
            }

            // Add a notification about the new user
            const notificationQuery =
              'INSERT INTO oneclick_notifications (type, message, is_read, created_at) VALUES ("New user",?, FALSE, NOW())';
            const notificationMessage = `New user ${username} has signed up.`;

            db.query(
              notificationQuery,
              [notificationMessage],
              (notificationErr) => {
                if (notificationErr) {
                  console.error(
                    "Error creating notification:",
                    notificationErr
                  );
                  return res
                    .status(500)
                    .json({
                      error: "User created but failed to create notification",
                    });
                }

                res
                  .status(200)
                  .json({
                    message: "User created successfully and notification sent",
                  });
              }
            );
          }
        );
      });
    }
  );
});

// Signup Route
app.post("/backend/adminsignup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  // Check if the email already exists
  db.query(
    "SELECT * FROM oneclick_admin WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Server error");
      }

      if (results.length > 0) {
        return res.status(400).send("Email already registered");
      }

      // If email doesn't exist, proceed to insert the new user
      const query =
        "INSERT INTO oneclick_admin (username, email, password) VALUES (?, ?, ?)";
      db.query(query, [username, email, password], (err) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).send("Server error");
        }
        res.status(200).send("User created successfully");
      });
    }
  );
});

// Login Route
app.post("/backend/login", (req, res) => {
  console.log("Received login request:", req.body); // Log incoming request

  const { contact_number, password } = req.body;

  if (!contact_number || !password) {
    console.log("Missing fields in login request"); // Log missing fields
    return res
      .status(400)
      .json({ message: "contact_number and password are required" });
  }

  db.query(
    "SELECT * FROM oneclick_users WHERE contact_number = ?",
    [contact_number],
    (err, results) => {
      if (err) {
        console.error("Database error:", err); // Log database errors
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        // console.log("User not found:", contact_number); // Log user not found
        return res.status(400).json({ message: "User not found" });
      }

      const user = results[0];

      // Compare plain text passwords
      if (password === user.password) {
        const { contact_number, email, user_id, username } = user;
        return res
          .status(200)
          .json({
            contact_number,
            email,
            user_id,
            username,
            message: "Login successful",
          });
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }
  );
});

// Login Route
app.post("/backend/adminlogin", (req, res) => {
  console.log("Received login request:", req.body); // Log incoming request

  const { username, password } = req.body;

  if (!username || !password) {
    console.log("Missing fields in login request"); // Log missing fields
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  db.query(
    "SELECT * FROM oneclick_admin WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Database error:", err); // Log database errors
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        // console.log("User not found:", username); // Log user not found
        return res.status(400).json({ message: "User not found" });
      }

      const user = results[0];

      // Compare plain text passwords
      if (password === user.password) {
        const { username, email } = user;
        return res
          .status(200)
          .json({ username, email, message: "Login successful" });
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }
  );
});

app.post("/backend/stafflogin", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  db.query(
    "SELECT * FROM oneclick_staff WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const staff = results[0];

      // Check if the password matches
      if (staff.password !== password) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check if the staff status is inactive
      if (staff.status === "inactive") {
        return res
          .status(400)
          .json({
            message: "Your account is inactive. Please contact the admin.",
          });
      }

      // If login is successful
      res
        .status(200)
        .json({
          message: "Staff login successful",
          staff: {
            id: staff.id,
            username: staff.username,
            role: staff.role,
            staffname: staff.staffname,
          },
        });
    }
  );
});

// // Generate a random 6-digit OTP
// const generateOTP = () => {
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   console.log(`Generated OTP: ${otp}`); // Log the generated OTP
//   return otp;
// };

// app.post("/backend/sendotp", async (req, res) => {
//   try {
//     const { number } = req.body;
//     console.log(`Received OTP request for number: ${number}`);

//     db.query(
//       "SELECT * FROM oneclick_users WHERE contact_number = ?",
//       [number],
//       async (error, results) => {
//         if (error) {
//           console.error("Error fetching user details from the database:", error);
//           return res.status(500).send("Failed to send OTP");
//         }

//         if (!results || results.length === 0) {
//           console.log(`Mobile number ${number} does not exist in the oneclick_users table.`);
//           return res.status(400).send("This number is not associated with any users.");
//         }

//         const otp = generateOTP();
//         db.query("UPDATE oneclick_users SET otp = ? WHERE contact_number = ?", [otp, number], async (dbError) => {
//           if (dbError) {
//             console.error("Error storing OTP in the database:", dbError);
//             return res.status(500).send("Failed to store OTP in the database");
//           }

//           try {
//             await sendOtpSms(number, otp); // Use the SMS service to send OTP
//             res.status(200).send("OTP sent successfully");
//           } catch (smsError) {
//             console.error("Error in SMS service:", smsError.message);
//             res.status(500).send("Failed to send OTP");
//           }
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Error in OTP sending process:", error.message);
//     res.status(500).send("Failed to send OTP");
//   }
// });

// // Configuration for the SMS Gateway
// const smsGatewayConfig = {
//   user: process.env.SMS_USER || "Seasensesoftwares",
//   password: process.env.SMS_PASSWORD || "Stripl@1",
//   senderid: process.env.SMS_SENDERID || "SEASEN",
//   DLTTemplateId: process.env.DLT_TEMPLATE_ID || "1707161044624969443",
//   PEID: process.env.PEID || "1701159125640974053",
// };

// // Function to send SMS
// async function sendSms(number, msg) {
//   try {
//     const response = await axios.get(
//       `https://login.smsgatewayhub.com/api/mt/SendSMS`,
//       {
//         params: {
//           user: smsGatewayConfig.user,
//           password: smsGatewayConfig.password,
//           senderid: smsGatewayConfig.senderid,
//           channel: "Trans",
//           DCS: "0",
//           flashsms: "0",
//           number: number,
//           text: `Dear ${msg}, Many more happy returns of the day. With regards Sea Sense Group.`,
//           route: "47",
//           DLTTemplateId: smsGatewayConfig.DLTTemplateId,
//           PEID: smsGatewayConfig.PEID,
//         },
//       }
//     );
//     console.log(`SMS sent successfully to ${number}. Response:`, response.data);
//   } catch (error) {
//     const logError = `Error sending SMS to ${number}: ${error.message}`;
//     fs.appendFileSync("sms-errors.log", logError + "\n");
//     if (error.response) {
//       console.error("Response Error:", error.response.data);
//     } else if (error.request) {
//       console.error("Request Error:", error.request);
//     } else {
//       console.error("Unexpected Error:", error.message);
//     }
//     throw new Error("Error sending SMS");
//   }
// }

// // Generate a random 6-digit OTP
// const generateOTP = () => {
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   console.log(`Generated OTP: ${otp}`); // Log the generated OTP
//   return otp;
// };

// // API to handle OTP requests
// app.post("/backend/sendotp", async (req, res) => {
//   try {
//     const { number } = req.body;
//     console.log(`Received OTP request for number: ${number}`);

//     // Query the database to validate the user
//     db.query(
//       "SELECT * FROM oneclick_users WHERE contact_number = ?",
//       [number],
//       async (error, results) => {
//         if (error) {
//           console.error("Error fetching user details from the database:", error);
//           return res.status(500).send("Failed to send OTP");
//         }

//         if (!results || results.length === 0) {
//           console.log(`Mobile number ${number} does not exist in the oneclick_users table.`);
//           return res.status(400).send("This number is not associated with any users.");
//         }

//         const otp = generateOTP();

//         // Update the OTP in the database
//         db.query("UPDATE oneclick_users SET otp = ? WHERE contact_number = ?", [otp, number], async (dbError) => {
//           if (dbError) {
//             console.error("Error storing OTP in the database:", dbError);
//             return res.status(500).send("Failed to store OTP in the database");
//           }

//           try {
//             // Send OTP using the updated SMS sending function
//             await sendSms(number, otp);
//             res.status(200).send("OTP sent successfully");
//           } catch (smsError) {
//             console.error("Error in SMS service:", smsError.message);
//             res.status(500).send("Failed to send OTP");
//           }
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Error in OTP sending process:", error.message);
//     res.status(500).send("Failed to send OTP");
//   }
// });

// app.post("/backend/verifyotp", async (req, res) => {
//   try {
//     const { number, otp } = req.body;
//     console.log(`Received OTP verification request for number: ${number} with OTP: ${otp}`); // Log OTP verification request

//     // Retrieve the user details from the database
//     db.query(
//       "SELECT * FROM oneclick_users WHERE contact_number = ? ORDER BY id DESC",
//       [number],
//       async (error, matchingUsers) => {
//         if (error) {
//           console.error("Error fetching matching user details:", error);
//           return res.status(500).send("Failed to verify OTP");
//         }

//         console.log(`Retrieved ${matchingUsers.length} matching user(s) for number: ${number}`);

//         // Check if there are any matching rows
//         if (matchingUsers && matchingUsers.length > 0) {
//           // Check if the provided OTP matches the stored OTP for the user
//           const matchedUsers = matchingUsers.filter(
//             (user) => user.otp === otp
//           );

//           if (matchedUsers.length > 0) {
//             // Update the OTP_verified field to true (mark OTP as verified)
//             db.query("UPDATE oneclick_users SET otp_verified = ? WHERE contact_number = ?", [
//               true,
//               number,
//             ], (updateError) => {
//               if (updateError) {
//                 console.error("Error updating OTP_verified status:", updateError);
//                 return res.status(500).send("Failed to update OTP verification status");
//               }

//               console.log(`OTP for ${number} verified successfully. OTP Verified status updated.`);

//               // Log user details after OTP verification
//               console.log("Verified User details:", matchedUsers);

//               res.status(200).send("OTP verified successfully"); // Send success message
//             });
//           } else {
//             console.log(`Invalid OTP for ${number}`);
//             res.status(400).send("Invalid OTP");
//           }
//         } else {
//           console.log(`No matching records found for number ${number}`);
//           res.status(400).send("No matching records for the provided number");
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Failed to verify OTP:", error);
//     res.status(500).send("Failed to verify OTP");
//   }
// });

// Forgot password route
app.post("/backend/forgot-password", (req, res) => {
  const { contactNumber, newPassword } = req.body;

  if (!contactNumber || !newPassword) {
    return res.status(400).send("Contact number and new password are required");
  }

  // Check if the user exists with the provided contact number
  db.query(
    "SELECT * FROM oneclick_users WHERE contact_number = ?",
    [contactNumber],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Server error");
      }

      if (results.length === 0) {
        return res.status(400).send("User not found");
      }

      // Update the password
      db.query(
        "UPDATE oneclick_users SET password = ? WHERE contact_number = ?",
        [newPassword, contactNumber],
        (err) => {
          if (err) {
            console.error("Error updating password:", err);
            return res.status(500).send("Server error");
          }
          res.status(200).send("Password updated successfully");
        }
      );
    }
  );
});

// Forgot password route
app.post("/backend/adminforgotpassword", (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).send("Email and new password are required");
  }

  // Check if the user exists
  db.query(
    "SELECT * FROM oneclick_admin WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Server error");
      }

      if (results.length === 0) {
        return res.status(400).send("User not found");
      }

      // Update the password
      db.query(
        "UPDATE oneclick_admin SET password = ? WHERE email = ?",
        [newPassword, email],
        (err) => {
          if (err) {
            console.error("Error updating password:", err);
            return res.status(500).send("Server error");
          }
          res.status(200).send("Password updated successfully");
        }
      );
    }
  );
});

// Verify user endpoint
app.post("/backend/verify-user", (req, res) => {
  const { email, username } = req.body;

  // Check if email and username are provided
  if (!email || !username) {
    return res
      .status(400)
      .json({ exists: false, message: "Email and username are required" });
  }

  // Query to check if the user exists
  db.query(
    "SELECT * FROM oneclick_users WHERE email = ? AND username = ?",
    [email, username],
    (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        return res
          .status(500)
          .json({ exists: false, message: "Internal Server Error" });
      }

      // Check if user was found
      if (results.length > 0) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    }
  );
});

// Update user's cart endpoint
app.post("/backend/update-user-cart", (req, res) => {
  const { email, username, product } = req.body;

  if (!email || !username || !product) {
    return res
      .status(400)
      .json({ error: "Email, username, and product are required" });
  }

  // Step 1: Retrieve the current cart
  db.query(
    "SELECT addtocart FROM oneclick_users WHERE email = ? AND username = ?",
    [email, username],
    (err, results) => {
      if (err) {
        console.error("Error retrieving cart:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      let cart = results[0].addtocart || [];

      // Step 2: Update the cart in application code
      try {
        cart = JSON.parse(cart);
      } catch (parseError) {
        cart = [];
      }

      cart.push(product);

      // Step 3: Save the updated cart
      const updatedCart = JSON.stringify(cart);

      db.query(
        "UPDATE oneclick_users SET addtocart = ? WHERE email = ? AND username = ?",
        [updatedCart, email, username],
        (err) => {
          if (err) {
            console.error("Error updating cart:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          res.json({ success: true });
        }
      );
    }
  );
});

// Update user's wishlist endpoint
// app.post('/backend/update-user-wishlist', (req, res) => {
//   const { email, username, product, action } = req.body;

//   if (!email || !username || !product || !action) {
//     return res.status(400).json({ error: 'Email, username, product, and action are required' });
//   }

//   // Step 1: Retrieve the current wishlist
//   db.query('SELECT wishlist FROM oneclick_users WHERE email = ? AND username = ?', [email, username], (err, results) => {
//     if (err) {
//       console.error('Error retrieving wishlist:', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     let wishlist = results[0].wishlist || [];

//     // Step 2: Update the wishlist in application code
//     try {
//       wishlist = JSON.parse(wishlist);
//     } catch (parseError) {
//       wishlist = [];
//     }

//     if (action === 'add') {
//       // Add product to wishlist
//       if (!wishlist.find(item => item.id === product.id)) {
//         wishlist.push(product);
//       }
//     } else if (action === 'remove') {
//       // Remove product from wishlist
//       wishlist = wishlist.filter(item => item.id !== product.id);
//     }

//     // Step 3: Save the updated wishlist
//     const updatedWishlist = JSON.stringify(wishlist);

//     db.query('UPDATE oneclick_users SET wishlist = ? WHERE email = ? AND username = ?', [updatedWishlist, email, username], (err) => {
//       if (err) {
//         console.error('Error updating wishlist:', err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       res.json({ success: true });
//     });
//   });
// });

app.post("/backend/update-user-wishlist", (req, res) => {
  const { email, username, prod_id, action } = req.body;

  if (!email || !username || !prod_id || !action) {
    return res
      .status(400)
      .json({ error: "Email, username, prod_id, and action are required" });
  }

  // Step 1: Retrieve the current wishlist
  db.query(
    "SELECT wishlist FROM oneclick_users WHERE email = ? AND username = ?",
    [email, username],
    (err, results) => {
      if (err) {
        console.error("Error retrieving wishlist:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      let wishlist = results[0].wishlist || [];

      // Step 2: Update the wishlist in application code
      try {
        wishlist = JSON.parse(wishlist);
      } catch (parseError) {
        wishlist = [];
      }

      if (action === "add") {
        // Add prod_id to wishlist
        if (!wishlist.includes(prod_id)) {
          wishlist.push(prod_id);
        }
      } else if (action === "remove") {
        // Remove prod_id from wishlist
        wishlist = wishlist.filter((id) => id !== prod_id);
      }

      // Step 3: Save the updated wishlist
      const updatedWishlist = JSON.stringify(wishlist);

      db.query(
        "UPDATE oneclick_users SET wishlist = ? WHERE email = ? AND username = ?",
        [updatedWishlist, email, username],
        (err) => {
          if (err) {
            console.error("Error updating wishlist:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          res.json({ success: true });
        }
      );
    }
  );
});
app.post("/backend/fetch-wishlist", (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    // console.log('Missing email or username in request');
    return res.status(400).json({ error: "Email and username are required" });
  }

  console.log(`Fetching wishlist for user: ${email}, ${username}`);

  db.query(
    "SELECT wishlist FROM oneclick_users WHERE email = ? AND username = ?",
    [email, username],
    (err, results) => {
      if (err) {
        console.error("Error retrieving wishlist:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        // console.log(`User not found: ${email}, ${username}`);
        return res.status(404).json({ error: "User not found" });
      }

      let wishlist = results[0].wishlist || "[]";

      try {
        wishlist = JSON.parse(wishlist);
      } catch (parseError) {
        console.error("Error parsing wishlist:", parseError);
        wishlist = [];
      }

      if (wishlist.length === 0) {
        console.log("Wishlist is empty for user:", email);
        return res.json({ products: [] });
      }

      const placeholders = wishlist.map(() => "?").join(",");
      const query = `SELECT * FROM oneclick_product_category WHERE id IN (${placeholders})`;

      db.query(query, wishlist, (err, productResults) => {
        if (err) {
          console.error("Error fetching product details:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        console.log("Fetched product details:", productResults);

        const featureProductIds = productResults
          .filter(
            (product) =>
              product.category === "Mobiles" || product.category === "Computers"
          )
          .map((product) => product.prod_id);

        if (featureProductIds.length === 0) {
          console.log("No wishlist products require additional features.");
          return res.json({ products: productResults });
        }

        console.log(
          "Fetching features for wishlist products:",
          featureProductIds
        );

        const featureQuery = `SELECT * FROM oneclick_mobile_features WHERE prod_id IN (${featureProductIds
          .map(() => "?")
          .join(",")})`;

        db.query(featureQuery, featureProductIds, (err, featureResults) => {
          if (err) {
            console.error("Error fetching product features:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          console.log("Fetched product features:", featureResults);

          const productsWithFeatures = productResults.map((product) => {
            const features = featureResults.find(
              (feature) => feature.prod_id === product.prod_id
            );
            return features ? { ...product, ...features } : product;
          });

          console.log(
            "Final wishlist product list with features:",
            productsWithFeatures
          );
          res.json({ products: productsWithFeatures });
        });
      });
    }
  );
});

app.post("/backend/api/addtocart", (req, res) => {
  const { email, productId, quantity, buyLater } = req.body; // Added buyLater flag

  if (!email || !productId || quantity === undefined) {
    return res.status(400).json({ message: "Email, Product ID, and Quantity are required" });
  }

  // Fetch current cart and buy_later fields from the database
  db.query(
    "SELECT addtocart, buy_later FROM oneclick_users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({ message: "Error fetching cart data" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Parse current cart and buy_later lists
      let currentCart = result[0].addtocart ? JSON.parse(result[0].addtocart) : [];
      let buyLaterList = result[0].buy_later ? JSON.parse(result[0].buy_later) : [];

      const productEntry = `${productId}-${quantity}`;
      const existingProductIndex = currentCart.findIndex((item) => item.startsWith(`${productId}-`));

      if (existingProductIndex !== -1) {
        // Product exists in the cart; update its quantity
        const [existingProductId, existingQuantity] = currentCart[existingProductIndex].split("-");
        currentCart[existingProductIndex] = `${existingProductId}-${parseInt(existingQuantity, 10) + quantity}`;
      } else {
        // Product is not in the cart; add it
        currentCart.push(productEntry);
      }

      // Update the cart in the database
      db.query(
        "UPDATE oneclick_users SET addtocart = ? WHERE email = ?",
        [JSON.stringify(currentCart), email],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating cart:", updateErr);
            return res.status(500).json({ message: "Error updating cart" });
          }

          // If the buyLater flag is set, remove the productId from buy_later
          if (buyLater) {
            buyLaterList = buyLaterList.filter((id) => id !== productId);
            db.query(
              "UPDATE oneclick_users SET buy_later = ? WHERE email = ?",
              [JSON.stringify(buyLaterList), email],
              (updateErr2) => {
                if (updateErr2) {
                  console.error("Error updating buy_later:", updateErr2);
                  return res.status(500).json({ message: "Error updating buy_later" });
                }
                return res.status(200).json({ message: "Product added to cart successfully" });
              }
            );
          } else {
            return res.status(200).json({ message: "Product added to cart successfully" });
          }
        }
      );
    }
  );
});

app.post("/backend/add-to-cart", (req, res) => {
  const { email, productId, quantity } = req.body; // Get email, productId, and quantity from the request body

  // Basic validation
  if (!email || !productId || quantity === undefined) {
    return res
      .status(400)
      .json({ message: "Email, Product ID, and Quantity are required" });
  }

  // Get the current cart (addtocart) field from the database
  db.query(
    "SELECT addtocart FROM oneclick_users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({ message: "Error fetching cart data" });
      }

      // If the user exists and has an existing cart
      if (result.length > 0) {
        let currentCart = result[0].addtocart
          ? JSON.parse(result[0].addtocart)
          : [];

        // Check if the product is already in the cart
        const productEntry = `${productId}-${quantity}`; // Format the string as "productId-quantity"
        const existingProductIndex = currentCart.findIndex((item) =>
          item.startsWith(`${productId}-`)
        );

        if (existingProductIndex !== -1) {
          // Product is already in the cart, update the quantity
          const existingProduct = currentCart[existingProductIndex];
          const [existingProductId, existingQuantity] =
            existingProduct.split("-");
          const updatedQuantity = parseInt(existingQuantity) + quantity;
          currentCart[
            existingProductIndex
          ] = `${existingProductId}-${updatedQuantity}`;
        } else {
          // Product is not in the cart, add it to the cart array
          currentCart.push(productEntry);
        }

        // Update the cart in the database
        db.query(
          "UPDATE oneclick_users SET addtocart = ? WHERE email = ?",
          [JSON.stringify(currentCart), email],
          (updateErr) => {
            if (updateErr) {
              console.error("Error updating cart:", updateErr);
              return res.status(500).json({ message: "Error updating cart" });
            }
            return res
              .status(200)
              .json({ message: "Product added to cart successfully" });
          }
        );
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    }
  );
});

app.post("/backend/get-cart-items", (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    // console.log('Missing email or username in request');
    return res.status(400).json({ error: "Email and username are required" });
  }

  // console.log(`Fetching cart items for user: ${email}, ${username}`);

  db.query(
    "SELECT addtocart FROM oneclick_users WHERE email = ? AND username = ?",
    [email, username],
    (err, results) => {
      if (err) {
        console.error("Error retrieving cart items:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        // console.log(`User not found: ${email}, ${username}`);
        return res.status(404).json({ error: "User not found" });
      }

      let cartItems = results[0].addtocart || "[]";

      try {
        cartItems = JSON.parse(cartItems);
      } catch (parseError) {
        console.error("Error parsing cart items:", parseError);
        cartItems = [];
      }

      if (cartItems.length === 0) {
        // console.log('Cart is empty for user:', email);
        return res.json({ products: [] });
      }

      const productIds = cartItems.map((item) => item.split("-")[0]);
      // console.log('Product IDs in cart:', productIds);

      const placeholders = productIds.map(() => "?").join(",");
      const query = `SELECT * FROM oneclick_product_category WHERE id IN (${placeholders})`;

      db.query(query, productIds, (err, productResults) => {
        if (err) {
          console.error("Error fetching product details:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // console.log('Fetched product details:', productResults);

        const productsWithQuantity = productResults.map((product) => {
          const cartItem = cartItems.find((item) =>
            item.startsWith(`${product.id}-`)
          );
          const quantity = cartItem ? parseInt(cartItem.split("-")[1]) : 0;

          return {
            ...product,
            quantity: quantity,
          };
        });

        const featureProductIds = productsWithQuantity
          .filter(
            (product) =>
              product.category === "Mobiles" || product.category === "Computers"
          )
          .map((product) => product.prod_id);

        if (featureProductIds.length === 0) {
          // console.log('No products require additional features.');
          return res.json({ products: productsWithQuantity });
        }

        // console.log('Fetching features for products:', featureProductIds);

        const featureQuery = `SELECT * FROM oneclick_mobile_features WHERE prod_id IN (${featureProductIds
          .map(() => "?")
          .join(",")})`;

        db.query(featureQuery, featureProductIds, (err, featureResults) => {
          if (err) {
            console.error("Error fetching product features:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // console.log('Fetched product features:', featureResults);

          const productsWithFeatures = productsWithQuantity.map((product) => {
            const features = featureResults.find(
              (feature) => feature.prod_id === product.prod_id
            );
            return features ? { ...product, ...features } : product;
          });

          // console.log('Final product list with features:', productsWithFeatures);
          res.json({ products: productsWithFeatures });
        });
      });
    }
  );
});

app.post("/backend/get-cart-quantity-sum", (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ error: "Email and username are required" });
  }

  // Step 1: Retrieve cart items (IDs with quantities) from oneclick_users table
  db.query(
    "SELECT addtocart FROM oneclick_users WHERE email = ? AND username = ?",
    [email, username],
    (err, results) => {
      if (err) {
        console.error("Error retrieving cart items:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      let cartItems = results[0].addtocart || "[]"; // Ensure the correct field name is used

      try {
        cartItems = JSON.parse(cartItems); // Parse the cart items as an array of "productId-quantity"
      } catch (parseError) {
        console.error("Error parsing cart items:", parseError);
        return res.status(400).json({ error: "Invalid cart format" });
      }

      // Step 2: Calculate the total quantity
      const totalQuantity = cartItems.reduce((sum, item) => {
        const quantity = parseInt(item.split("-")[1]); // Extract quantity from "productId-quantity"
        return sum + (isNaN(quantity) ? 0 : quantity); // Add only valid quantities
      }, 0);

      // Step 3: Return the total quantity
      res.json({ totalQuantity });
    }
  );
});

// app.post('/backend/update-cart-item-quantity', (req, res) => {

//   const { email, itemId, newQuantity } = req.body;

//   if (!email || !itemId || newQuantity < 1) {
//     return res.status(400).json({ error: 'Invalid data provided' });
//   }

//   // Update the cart item quantity in the database
//   db.query('SELECT addtocart FROM oneclick_users WHERE email = ?', [email], (err, results) => {
//     if (err) {
//       console.error('Error updating cart:', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     let cartItems = JSON.parse(results[0].addtocart || '[]');

//     // Find the item and update its quantity
//     const itemIndex = cartItems.findIndex(item => item.id === itemId);
//     if (itemIndex !== -1) {
//       cartItems[itemIndex].quantity = newQuantity;
//     }

//     // Update the cart in the database
//     db.query(
//       'UPDATE oneclick_users SET addtocart = ? WHERE email = ?',
//       [JSON.stringify(cartItems), email],
//       (err) => {
//         if (err) {
//           console.error('Error updating cart in database:', err);
//           return res.status(500).json({ error: 'Failed to update cart' });
//         }
//         res.status(200).json({ message: 'Cart updated successfully' });
//       }
//     );
//   });
// });

app.post("/backend/update-cart-quantity", (req, res) => {
  const { email, itemId, quantity } = req.body;

  if (!email || !itemId || quantity === undefined) {
    return res
      .status(400)
      .json({ error: "Email, itemId, and quantity are required" });
  }

  // Step 1: Retrieve the current cart (addtocart) from the database
  db.query(
    "SELECT addtocart FROM oneclick_users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Error retrieving cart:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Step 2: Parse the addtocart field to get the cart items
      let cartItems = results[0].addtocart
        ? JSON.parse(results[0].addtocart)
        : [];

      // Step 3: Update the quantity of the specified item in the cart
      const itemIndex = cartItems.findIndex((item) =>
        item.startsWith(`${itemId}-`)
      );

      if (itemIndex !== -1) {
        // Item exists, update its quantity
        const updatedItem = `${itemId}-${quantity}`;
        cartItems[itemIndex] = updatedItem; // Update the item in the array
      } else {
        // If the item doesn't exist in the cart, you can choose to add it
        cartItems.push(`${itemId}-${quantity}`);
      }

      // Step 4: Update the cart in the database with the modified cartItems array
      db.query(
        "UPDATE oneclick_users SET addtocart = ? WHERE email = ?",
        [JSON.stringify(cartItems), email],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating cart:", updateErr);
            return res.status(500).json({ error: "Failed to update cart" });
          }

          res
            .status(200)
            .json({ message: "Cart quantity updated successfully" });
        }
      );
    }
  );
});

// Route to fetch the wishlist for a user
app.post("/backend/fetchwishlist", (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ message: "Email and username are required" });
  }

  // Query to fetch the user's wishlist from the database
  const query =
    "SELECT wishlist FROM oneclick_users WHERE email = ? AND username = ?";

  db.query(query, [email, username], (err, result) => {
    if (err) {
      console.error("Error fetching wishlist: ", err);
      return res.status(500).json({ message: "Error fetching wishlist" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      // Parse the wishlist JSON field
      let wishlist = result[0].wishlist ? JSON.parse(result[0].wishlist) : [];

      // Sort the wishlist array in descending order
      wishlist = wishlist.sort((a, b) => b - a);

      return res.json({ wishlist });
    } catch (parseError) {
      console.error("Error parsing wishlist: ", parseError);
      return res.status(500).json({ message: "Error parsing wishlist" });
    }
  });
});

// // API endpoint to get cart items
// app.get('/backend/cart', (req, res) => {
//   const { email, username } = req.query;

//   if (!email || !username) {
//     return res.status(400).json({ error: 'Email and username are required' });
//   }

//   const query = 'SELECT * FROM oneclick_users WHERE email = ? AND username = ?';
//   db.query(query, [email, username], (err, results) => {
//     if (err) {
//       console.error('Error fetching cart items:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.json(results);
//   });
// });

// // API endpoint to get wishlist items
// app.get('/backend/wishlist', (req, res) => {
//   const { email, username } = req.query;

//   if (!email || !username) {
//     return res.status(400).json({ error: 'Email and username are required' });
//   }

//   const query = 'SELECT * FROM oneclick_users WHERE email = ? AND username = ?';
//   db.query(query, [email, username], (err, results) => {
//     if (err) {
//       console.error('Error fetching wishlist items:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.json(results);
//   });
// });

// app.post('/backend/remove-from-cart', (req, res) => {
//   const { email, itemId } = req.body;

//   if (!email || !itemId) {
//     return res.status(400).json({ message: "Email and itemId are required" });
//   }

//   // SQL query to get the addtocart column from the users table
//   const getQuery = 'SELECT addtocart FROM oneclick_users WHERE email = ?';

//   db.query(getQuery, [email], (err, results) => {
//     if (err) {
//       console.error("Error retrieving cart items:", {
//         message: err.message,
//         query: getQuery,
//         params: [email]
//       });

//       return res.status(500).json({ message: "Internal server error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let cartItems;
//     try {
//       // Check if `addtocart` is null or empty and assign an empty array
//       const addToCart = results[0].addtocart;
//       if (!addToCart) {
//         cartItems = [];
//       } else {
//         cartItems = JSON.parse(addToCart);
//       }
//     } catch (parseError) {
//       return res.status(500).json({ message: "Error parsing cart items", error: parseError.message });
//     }

//     // Filter out the item to be removed
//     const updatedCartItems = cartItems.filter(item => item.id !== itemId);

//     // SQL query to update the addtocart column with the new JSON data
//     const updateQuery = 'UPDATE oneclick_users SET addtocart = ? WHERE email = ?';

//     db.query(updateQuery, [JSON.stringify(updatedCartItems), email], (err, results) => {
//       if (err) {
//         console.error("Error updating cart items:", {
//           message: err.message,
//           query: updateQuery,
//           params: [JSON.stringify(updatedCartItems), email]
//         });
//         return res.status(500).json({ message: "Internal server error" });
//       }

//       if (results.affectedRows === 0) {
//         return res.status(404).json({ message: "Failed to update cart" });
//       }

//       res.status(200).json({ message: "Item removed from cart" });
//     });
//   });
// });

app.post("/backend/remove-from-cart", (req, res) => {
  const { email, itemId, quantity } = req.body;

  if (!email || !itemId || !quantity) {
    return res
      .status(400)
      .json({ error: "Email, ItemId, and Quantity are required" });
  }

  // Step 1: Retrieve the user's cart (addtocart) from the database
  db.query(
    "SELECT addtocart FROM oneclick_users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Error retrieving cart:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Step 2: Parse the addtocart field into an array
      let cartItems = [];
      try {
        cartItems = JSON.parse(results[0].addtocart || "[]");
      } catch (error) {
        console.error("Error parsing cart items:", error);
        return res.status(500).json({ error: "Failed to parse cart items" });
      }

      // Step 3: Find the item in the cart that matches the provided itemId
      let itemIndex = cartItems.findIndex((item) =>
        item.startsWith(`${itemId}-`)
      );

      if (itemIndex !== -1) {
        // The item exists, now check if the quantity matches the one to be removed
        let [existingItemId, existingQuantity] = cartItems[itemIndex]
          .split("-")
          .map(Number);

        if (
          existingItemId === parseInt(itemId) &&
          existingQuantity === parseInt(quantity)
        ) {
          // Remove the item from the cart
          cartItems.splice(itemIndex, 1);
        } else {
          return res
            .status(400)
            .json({ error: "Quantity mismatch or item not found in the cart" });
        }
      } else {
        return res.status(404).json({ error: "Item not found in the cart" });
      }

      // Step 4: Update the cart in the database with the new array
      db.query(
        "UPDATE oneclick_users SET addtocart = ? WHERE email = ?",
        [JSON.stringify(cartItems), email],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating cart:", updateErr);
            return res.status(500).json({ error: "Failed to update cart" });
          }

          // Step 5: Send success response back to the client
          res
            .status(200)
            .json({
              success: true,
              message: "Item removed from cart successfully",
            });
        }
      );
    }
  );
});

// app.post('/remove-from-wishlist', async (req, res) => {
//   const { email, username, productId } = req.body;

//   if (!email || !username || !productId) {
//     return res.status(400).json({ error: 'Missing parameters' });
//   }

//   try {
//     // Find user by email and username
//     const user = await User.findOne({ email, username });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Remove productId from wishlist
//     user.wishlist = user.wishlist.filter(item => item.id !== productId);

//     // Save updated user document
//     await user.save();

//     res.status(200).json({ message: 'Item removed from wishlist' });
//   } catch (error) {
//     console.error('Error removing from wishlist:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.post("/backend/remove-from-wishlist", (req, res) => {
  const { email, productId } = req.body;

  if (!email || !productId) {
    return res
      .status(400)
      .send({ error: "Email and product ID are required." });
  }

  // Step 1: Fetch the current wishlist
  db.query(
    "SELECT wishlist FROM oneclick_users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("Error fetching wishlist:", err);
        return res.status(500).send({ error: "Failed to fetch wishlist." });
      }

      if (result.length === 0) {
        return res.status(404).send({ error: "User not found." });
      }

      // Step 2: Remove the productId from the wishlist array
      let wishlist = JSON.parse(result[0].wishlist || "[]");
      wishlist = wishlist.filter((item) => item !== productId); // Remove product ID from the array

      // Step 3: Update the wishlist in the database
      const updatedWishlist = JSON.stringify(wishlist);
      db.query(
        "UPDATE oneclick_users SET wishlist = ? WHERE email = ?",
        [updatedWishlist, email],
        (err, updateResult) => {
          if (err) {
            console.error("Error updating wishlist:", err);
            return res
              .status(500)
              .send({ error: "Failed to update wishlist." });
          }

          if (updateResult.affectedRows === 0) {
            return res
              .status(404)
              .send({ error: "No changes made, user or wishlist not found." });
          }

          res
            .status(200)
            .send({ message: "Item removed from wishlist successfully." });
        }
      );
    }
  );
});
// app.post('/backend/remove-from-wishlist', (req, res) => {
//   const { email, itemId } = req.body;

//   if (!email || !itemId) {
//     return res.status(400).json({ message: "Email and itemId are required" });
//   }

//   // SQL query to get the wishlist column from the oneclick_users table
//   const getQuery = 'SELECT wishlist FROM oneclick_users WHERE email = ?';

//   db.query(getQuery, [email], (err, results) => {
//     if (err) {
//       console.error("Error retrieving wishlist items:", {
//         message: err.message,
//         query: getQuery,
//         params: [email]
//       });
//       return res.status(500).json({ message: "Internal server error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let wishlistItems;
//     try {
//       wishlistItems = JSON.parse(results[0].wishlist);
//     } catch (parseError) {
//       return res.status(500).json({ message: "Error parsing wishlist items", error: parseError.message });
//     }

//     // Filter out the item to be removed
//     const updatedWishlistItems = wishlistItems.filter(item => item.id !== itemId);

//     // SQL query to update the wishlist column with the new JSON data
//     const updateQuery = 'UPDATE oneclick_users SET wishlist = ? WHERE email = ?';

//     db.query(updateQuery, [JSON.stringify(updatedWishlistItems), email], (err, results) => {
//       if (err) {
//         console.error("Error updating wishlist items:", {
//           message: err.message,
//           query: updateQuery,
//           params: [JSON.stringify(updatedWishlistItems), email]
//         });
//         return res.status(500).json({ message: "Internal server error" });
//       }

//       if (results.affectedRows === 0) {
//         return res.status(404).json({ message: "Failed to update wishlist" });
//       }

//       res.status(200).json({ message: "Item removed from wishlist" });
//     });
//   });
// });

// app.get('/backend/api/products', (req, res) => {
//   const categories = [
//     // 'TV',
//     'Mobiles',
//     'Computers',
//     'Headphones',
//     'CCTV',
//     // 'Watch',
//     'Printers',
//     // 'Speakers',
//     // 'Mobileaccessories',
//     // 'Computeraccessories'
//   ];

//   // Create an array of promises for each category query
//   const promises = categories.map(category => new Promise((resolve, reject) => {
//     const query = `SELECT * FROM oneclick_product_category WHERE category = ? ORDER BY id DESC LIMIT 1`;
//     db.query(query, [category], (err, results) => {
//       if (err) return reject(err);
//       resolve(results[0]); // Resolve with the first row of the result for the category
//     });
//   }));

//   // Execute all promises and return results
//   Promise.all(promises)
//     .then(results => {
//       res.json(results); // Send the results as JSON
//     })
//     .catch(err => {
//       console.error('Database error:', err);
//       res.status(500).json({ error: 'Database error' });
//     });
// });

app.get("/backend/api/products", (req, res) => {
  const categories = [
    "Mobiles",
    "Computers",
    "CCTV",
    "Printers",
    "ComputerAccessories",
    "MobileAccessories",
    "CCTVAccessories",
    "PrinterAccessories",
    "Speakers",
    "Headphones",
  ];

  // Define limits for each category
  const categoryLimits = {
    Mobiles: 10,
    Computers: 10,
    CCTV: 10,
    Printers: 10,
    ComputerAccessories: 2,
    MobileAccessories: 2,
    CCTVAccessories: 2,
    PrinterAccessories: 2,
    Speakers: 5,
    Headphones: 5,
  };

  // Create an array of promises for each category query
  const promises = categories.map(
    (category) =>
      new Promise((resolve, reject) => {
        const limit = categoryLimits[category]; // Get the limit for the current category
        const query = `SELECT * FROM oneclick_product_category WHERE category = ? AND productStatus = 'approved' ORDER BY id DESC LIMIT ?`;

        // console.log(`Fetching ${limit} products for category: ${category}`); // Log category and limit

        db.query(query, [category, limit], (err, results) => {
          if (err) {
            console.error(
              `Error fetching products for category: ${category}`,
              err
            ); // Log error for specific category
            return reject(err);
          }
          console.log(
            `Fetched ${results.length} products for category: ${category}`
          ); // Log successful fetch with count
          resolve(results); // Resolve with all rows of the result for the category
        });
      })
  );

  // Execute all promises and return results
  Promise.all(promises)
    .then((results) => {
      // console.log('Successfully fetched all product categories:', results); // Log successful fetch of all categories
      res.json(results); // Send the results as JSON
    })
    .catch((err) => {
      console.error("Database error:", err); // Log any errors during the promise execution
      res.status(500).json({ error: "Database error" });
    });
});
// app.get('/backend/api/products', (req, res) => {
//   const categories = [
//     'Mobiles',
//     'Computers',
//     'CCTV',
//     'Printers'
//   ];

//   // Define limits for each category
//   const categoryLimits = {
//     'Mobiles': 5,
//     'Computers': 5,
//     'CCTV': 3,
//     'Printers': 2
//   };

//   // Create an array of promises for each category query
//   const promises = categories.map(category => new Promise((resolve, reject) => {
//     const limit = categoryLimits[category]; // Get the limit for the current category
//     const query = `SELECT * FROM oneclick_product_category WHERE category = ? ORDER BY id DESC LIMIT ?`;

//     console.log(`Fetching ${limit} products for category: ${category}`); // Log category and limit

//     db.query(query, [category, limit], (err, results) => {
//       if (err) {
//         console.error(`Error fetching products for category: ${category}`, err); // Log error for specific category
//         return reject(err);
//       }
//       console.log(`Fetched ${results.length} products for category: ${category}`); // Log successful fetch with count
//       resolve(results); // Resolve with all rows of the result for the category
//     });
//   }));

//   // Execute all promises and return results
//   Promise.all(promises)
//     .then(results => {
//       console.log('Successfully fetched all product categories:', results); // Log successful fetch of all categories
//       res.json(results); // Send the results as JSON
//     })
//     .catch(err => {
//       console.error('Database error:', err); // Log any errors during the promise execution
//       res.status(500).json({ error: 'Database error' });
//     });
// });

///////////////////////////admin dashbord api's/////////////////////////////////////////////////////////

app.use("/backend/uploads", express.static("uploads"));

const generateProductId = () => {
  const prefix = "PRD";
  const randomDigits = Math.floor(10000 + Math.random() * 90000); // generates a random 5-digit number
  return `${prefix}${randomDigits}`;
};

// Set up multer for file uploads in the `/cctv` endpoint
const computersStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/computers directory exists
    const dir = "uploads/computers";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const computersUpload = multer({ storage: computersStorage });

app.post(
  "/backend/uploadcomputersimages",
  computersUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);
// Endpoint to add a new product with multiple images
// app.post('/backend/computers', computersUpload.array('images', 5), (req, res) => { // Accept up to 5 images
//   const { name, features, price, category, actual_price,label, coupon_expiry_date, coupon,deliverycharge, subtitle  } = req.body;
//   const images = req.files.map(file => file.filename); // Get all uploaded image filenames

//   const sql = 'INSERT INTO oneclick_product_category (deliverycharge, subtitle ,coupon_expiry_date, coupon, offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//   const status = 'available'; // or any other status you might want to set
//   const prod_id = generateProductId();

//   // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
//   db.query(sql, [deliverycharge, subtitle ,coupon_expiry_date, coupon, label, actual_price, 'Computers', prod_id, name, features, price, JSON.stringify(images), status], (err, result) => {
//     if (err) {
//       console.error("Error inserting product into database:", err); // Log the error
//       return res.status(500).send('Error adding product');
//     }

//     console.log("Product added successfully with ID:", prod_id); // Log successful addition
//     res.send('Product added with multiple images');
//   });
// });

app.post(
  "/backend/computers",
  computersUpload.array("images", 5),
  (req, res) => {
    const {
      name,
      price,
      category,
      actual_price,
      label,
      // coupon_expiry_date,
      // coupon,
      deliverycharge,
      productStatus,
      subtitle,
      memory,
      storage,
      processor,
      // camera,
      display,
      // battery,
      os,
      // network,
      others,
    } = req.body;

    const images = req.files.map((file) => file.filename); // Get all uploaded image filenames
    const prod_id = generateProductId(); // Generate unique product ID
    const status = "available"; // Default status

    // Insert product into the oneclick_product_category table
    const sqlProduct =
      "INSERT INTO oneclick_product_category (productStatus, deliverycharge, subtitle,  offer_label, actual_price, category, prod_id, prod_name, prod_price, prod_img, status) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(
      sqlProduct,
      [
        productStatus,
        deliverycharge,
        subtitle,
        label,
        actual_price,
        "Computers",
        prod_id,
        name,
        price,
        JSON.stringify(images),
        status,
      ],
      (err, productResult) => {
        if (err) {
          console.error("Error inserting product into database:", err);
          return res.status(500).send("Error adding product");
        }

        // Insert features into the oneclick_mobile_features table
        const sqlFeatures =
          "INSERT INTO oneclick_mobile_features (prod_id, memory, storage, processor, display,  os, others) VALUES (?, ?, ?, ?, ?, ?, ?)";

        db.query(
          sqlFeatures,
          [prod_id, memory, storage, processor, display, os, others],
          (err, featuresResult) => {
            if (err) {
              console.error("Error inserting features into database:", err);
              return res.status(500).send("Error adding features");
            }

            console.log("Product and features added successfully");
            res.send("Product and features added successfully");
          }
        );
      }
    );
  }
);

// app.get('/backend/fetchcomputers', (req, res) => {
//   const sql = "SELECT * FROM oneclick_product_category WHERE category = 'computers' ORDER BY id DESC";
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching product:', err);
//       return res.status(500).json({ message: 'Failed to fetch product' });
//     }

//     // Parse the prod_img JSON string to an array for each product
//     const products = results.map(product => ({
//       ...product,
//       prod_img: JSON.parse(product.prod_img), // Convert to an array
//     }));

//     res.json(products);
//   });
// });

app.get("/backend/adminfetchcomputers", (req, res) => {
  const sql = `
    SELECT 
      p.prod_id, 
      p.prod_name,
      p.id, 
      p.category, 
      p.prod_price, 
      p.actual_price, 
      p.prod_img, 
      p.status,
      p.productStatus,
      p.deliverycharge,
      p.subtitle,
      p.offer_label,
      f.memory, 
      f.storage, 
      f.processor, 
      f.display, 
      f.os, 
      f.others
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id
    WHERE p.category = 'computers'
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
    // console.log("products", products)
  });
});

app.get("/backend/fetchcomputers", (req, res) => {
  const sql = `
    SELECT 
      p.prod_id, 
      p.prod_name,
      p.id, 
      p.category, 
      p.prod_price, 
      p.actual_price, 
      p.offer_price, 
      p.prod_img, 
      p.status,
      p.productStatus,
      p.deliverycharge,
      p.subtitle,
      p.offer_label,
      f.memory, 
      f.storage, 
      f.processor, 
      f.display, 
      f.os, 
      f.others
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id
    WHERE p.category = 'computers' AND productStatus = 'approved'
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
    // console.log("products", products)
  });
});

app.put(
  "/backend/updatecomputers/image/:id",
  computersUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/computers/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deletecomputers/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/computers/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route
// app.put('/backend/updatecomputers/:id', computersUpload.single('image'), (req, res) => {
//   const productId = req.params.id;
//   const { name, features, price, status, category, label, actual_price, coupon_expiry_date, coupon,deliverycharge, subtitle  } = req.body;
//   const image = req.file ? req.file.filename : null;
// console.log("req.body",req.body)
//   let sql = 'UPDATE oneclick_product_category SET deliverycharge = ?, subtitle = ?,  coupon_expiry_date = ?, coupon = ?, actual_price = ?, offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?,category = ?';
//   let values = [deliverycharge, subtitle ,coupon_expiry_date, coupon, actual_price, label, name, features, price, status, category];

//   if (image) {
//     // Update image and remove the old image file
//     const oldImageQuery = 'SELECT prod_img FROM oneclick_product_category WHERE id = ?';
//     db.query(oldImageQuery, [productId], (err, results) => {
//       if (err) return res.status(500).send(err);
//       const oldImage = results[0] && results[0].prod_img;
//       if (oldImage && oldImage !== image) {
//         fs.unlink(`uploads/computers/${oldImage}`, (err) => {
//           if (err) console.error('Failed to delete old image:', err);
//         });
//       }

//       sql += ', prod_img = ? WHERE id = ?';
//       values.push(image, productId);

//       db.query(sql, values, (err, results) => {
//         if (err) return res.status(500).send(err);
//         res.json({ message: 'Product updated successfully' });
//       });
//     });
//   } else {
//     sql += ' WHERE id = ?';
//     values.push(productId);

//     db.query(sql, values, (err, results) => {
//       if (err) return res.status(500).send(err);
//       res.json({ message: 'Product updated successfully' });
//     });
//   }
// });

app.put("/backend/updatecomputers/:id", (req, res) => {
  const productId = req.params.id;

  const {
    label,
    name,
    price,
    status,
    actual_price,
    productStatus,
    deliverycharge,
    subtitle,
    memory,
    storage,
    processor,
    // camera,
    display,
    // battery,
    os,
    // network,
    others,
  } = req.body;

  console.log("Computers Received update request for product ID :", productId);
  console.log("Computers Request body:", req.body);

  // Check if the product exists in the database
  const checkProductSql = `SELECT * FROM oneclick_product_category WHERE prod_id = ?`;
  db.query(checkProductSql, [productId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error(
        "Error checking product in `oneclick_product_category`:",
        checkErr
      );
      return res
        .status(500)
        .send({
          message: "Failed to check product existence.",
          error: checkErr,
        });
    }

    if (checkResults.length === 0) {
      // Product doesn't exist, insert a new one
      console.log("Product not found, inserting a new product.");

      const insertProductSql = `
        INSERT INTO oneclick_product_category (prod_id,productStatus, deliverycharge, subtitle, 
                                              actual_price, offer_label, prod_name, prod_price, status)
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const insertProductValues = [
        productId,
        productStatus || "",
        deliverycharge || 0,
        subtitle || "",
        actual_price || 0,
        label || "",
        name || "",
        price || 0,
        status || "",
      ];

      db.query(
        insertProductSql,
        insertProductValues,
        (insertErr, insertResults) => {
          if (insertErr) {
            console.error(
              "Error inserting product in `oneclick_product_category`:",
              insertErr
            );
            return res
              .status(500)
              .send({
                message: "Failed to insert new product.",
                error: insertErr,
              });
          }

          console.log(
            "New product inserted successfully in `oneclick_product_category`."
          );

          // Now insert features
          const insertFeaturesSql = `
          INSERT INTO oneclick_mobile_features (prod_id, memory, storage, processor,  display, 
                                                 os,  others)
          VALUES (?, ?, ?, ?, ?, ?, ?)`;
          const insertFeaturesValues = [
            productId,
            memory || "",
            storage || "",
            processor || "",
            // camera || '',
            display || "",
            // battery || '',
            os || "",
            // network || '',
            others || "",
          ];

          db.query(
            insertFeaturesSql,
            insertFeaturesValues,
            (featuresInsertErr, featuresInsertResults) => {
              if (featuresInsertErr) {
                console.error(
                  "Error inserting features in `oneclick_mobile_features`:",
                  featuresInsertErr
                );
                return res
                  .status(500)
                  .send({
                    message: "Failed to insert product features.",
                    error: featuresInsertErr,
                  });
              }

              console.log(
                "Product features inserted successfully in `oneclick_mobile_features`."
              );
              res.json({
                message: "Product and features inserted successfully.",
              });
            }
          );
        }
      );
    } else {
      // Product exists, update the product and features
      console.log("Product found, updating the existing product.");

      const updateProductSql = `
        UPDATE oneclick_product_category 
        SET productStatus = ?,  deliverycharge = ?, subtitle = ?, 
            actual_price = ?, offer_label = ?, prod_name = ?, prod_price = ?, 
            status = ? 
        WHERE prod_id = ?`;
      const updateProductValues = [
        productStatus || "",
        deliverycharge || 0,
        subtitle || "",
        actual_price || 0,
        label || "",
        name || "",
        price || 0,
        status || "",
        productId,
      ];

      db.query(
        updateProductSql,
        updateProductValues,
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error(
              "Error updating product in `oneclick_product_category`:",
              updateErr
            );
            return res
              .status(500)
              .send({
                message: "Failed to update product details.",
                error: updateErr,
              });
          }

          console.log(
            "Product updated successfully in `oneclick_product_category`."
          );
          console.log("Affected rows:", updateResults.affectedRows);

          // Check if features exist in the `oneclick_mobile_features` table
          const checkFeaturesSql = `SELECT * FROM oneclick_mobile_features WHERE prod_id = ?`;
          db.query(
            checkFeaturesSql,
            [productId],
            (checkFeaturesErr, checkFeaturesResults) => {
              if (checkFeaturesErr) {
                console.error(
                  "Error checking product features in `oneclick_mobile_features`:",
                  checkFeaturesErr
                );
                return res
                  .status(500)
                  .send({
                    message: "Failed to check product features.",
                    error: checkFeaturesErr,
                  });
              }

              if (checkFeaturesResults.length === 0) {
                // Features don't exist, insert them
                console.log("Features not found, inserting new features.");

                const insertFeaturesSql = `
              INSERT INTO oneclick_mobile_features (prod_id, memory, storage, processor, display, os, others)
              VALUES (?, ?, ?, ?, ?, ?, ?)`;
                const insertFeaturesValues = [
                  productId,
                  memory || "",
                  storage || "",
                  processor || "",
                  display || "",
                  os || "",
                  others || "",
                ];

                db.query(
                  insertFeaturesSql,
                  insertFeaturesValues,
                  (featuresInsertErr, featuresInsertResults) => {
                    if (featuresInsertErr) {
                      console.error(
                        "Error inserting features in `oneclick_mobile_features`:",
                        featuresInsertErr
                      );
                      return res
                        .status(500)
                        .send({
                          message: "Failed to insert product features.",
                          error: featuresInsertErr,
                        });
                    }

                    console.log(
                      "Product features inserted successfully in `oneclick_mobile_features`."
                    );
                    res.json({
                      success: true,
                      message:
                        "Product updated and features inserted successfully.",
                    });
                  }
                );
              } else {
                // Update features if they exist
                console.log("Features found, updating product features.");

                const updateFeaturesSql = `
              UPDATE oneclick_mobile_features 
              SET memory = ?, storage = ?, processor = ?, 
                  display = ?, os = ?, others = ? 
              WHERE prod_id = ?`;
                const updateFeatureValues = [
                  memory || "",
                  storage || "",
                  processor || "",
                  display || "",
                  os || "",
                  others || "",
                  productId,
                ];

                db.query(
                  updateFeaturesSql,
                  updateFeatureValues,
                  (featuresUpdateErr, featuresUpdateResults) => {
                    if (featuresUpdateErr) {
                      console.error(
                        "Error updating features in `oneclick_mobile_features`:",
                        featuresUpdateErr
                      );
                      return res
                        .status(500)
                        .send({
                          message: "Failed to update product features.",
                          error: featuresUpdateErr,
                        });
                    }

                    console.log(
                      "Product features updated successfully in `oneclick_mobile_features`."
                    );
                    res.json({
                      success: true,
                      message: "Product and features updated successfully.",
                    });
                  }
                );
              }
            }
          );
        }
      );
    }
  });
});

// Endpoint to delete a product
// Endpoint to delete a product
app.delete("/backend/deletecomputers/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/computers/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});

////////////////mobiles////////////////////////////

const mobilesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/mobiles directory exists
    const dir = "uploads/mobiles";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const mobilesUpload = multer({ storage: mobilesStorage });


app.post(
  "/backend/uploadmobilesimages",
  mobilesUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);

// // Endpoint to add a new product with multiple images
// app.post('/backend/mobiles', mobilesUpload.array('images', 5), (req, res) => { // Accept up to 5 images
//   const { name, features, price, category, actual_price, label, coupon_expiry_date , coupon,deliverycharge, subtitle  } = req.body;
//   const images = req.files.map(file => file.filename); // Get all uploaded image filenames

//   const sql = 'INSERT INTO oneclick_product_category (deliverycharge, subtitle ,coupon_expiry_date, coupon, offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//   const status = 'available'; // or any other status you might want to set
//   const prod_id = generateProductId();

//   // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
//   db.query(sql, [deliverycharge, subtitle ,coupon_expiry_date, coupon, label, actual_price, 'Mobiles', prod_id, name, features, price, JSON.stringify(images), status], (err, result) => {
//     if (err) {
//       console.error("Error inserting product into database:", err); // Log the error
//       return res.status(500).send('Error adding product');
//     }

//     console.log("Product added successfully with ID:", prod_id); // Log successful addition
//     res.send('Product added with multiple images');
//   });
// });

app.post("/backend/mobiles", mobilesUpload.array("images", 5), (req, res) => {
  const {
    name,
    price,
    category,
    productStatus,
    actual_price,
    label,
    // coupon_expiry_date,
    // coupon,
    deliverycharge,
    subtitle,
    memory,
    storage,
    processor,
    camera,
    display,
    battery,
    os,
    network,
    others,
  } = req.body;

  const images = req.files.map((file) => file.filename); // Get all uploaded image filenames
  const prod_id = generateProductId(); // Generate unique product ID
  const status = "available"; // Default status

  // Insert product into the oneclick_product_category table
  const sqlProduct =
    "INSERT INTO oneclick_product_category (productStatus, deliverycharge, subtitle,  offer_label, actual_price, category, prod_id, prod_name, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sqlProduct,
    [
      productStatus,
      deliverycharge,
      subtitle,
      // coupon_expiry_date,
      // coupon,
      label,
      actual_price,
      "Mobiles",
      prod_id,
      name,
      price,
      JSON.stringify(images),
      status,
    ],
    (err, productResult) => {
      if (err) {
        console.error("Error inserting product into database:", err);
        return res.status(500).send("Error adding product");
      }

      // Insert features into the oneclick_mobile_features table
      const sqlFeatures =
        "INSERT INTO oneclick_mobile_features (prod_id, memory, storage, processor, camera, display, battery, os, network, others) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      db.query(
        sqlFeatures,
        [
          prod_id,
          memory,
          storage,
          processor,
          camera,
          display,
          battery,
          os,
          network,
          others,
        ],
        (err, featuresResult) => {
          if (err) {
            console.error("Error inserting features into database:", err);
            return res.status(500).send("Error adding features");
          }

          console.log("Product and features added successfully");
          res.send("Product and features added successfully");
        }
      );
    }
  );
});

// app.get('/backend/fetchmobiles', (req, res) => {
//   const sql = "SELECT * FROM oneclick_product_category WHERE category = 'mobiles' ORDER BY id DESC";
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching product:', err);
//       return res.status(500).json({ message: 'Failed to fetch product' });
//     }

//     // Parse the prod_img JSON string to an array for each product
//     const products = results.map(product => ({
//       ...product,
//       prod_img: JSON.parse(product.prod_img), // Convert to an array
//     }));

//     res.json(products);
//   });
// });

app.get("/backend/adminfetchmobiles", (req, res) => {
  const sql = `
    SELECT 
      p.prod_id, 
      p.prod_name,
      p.id, 
      p.category, 
      p.prod_price, 
      p.actual_price, 
      p.prod_img, 
      p.status,
      p.productStatus,
      p.deliverycharge,
      p.subtitle,
      p.offer_label,
      f.memory, 
      f.storage, 
      f.processor, 
      f.camera, 
      f.display, 
      f.battery, 
      f.os, 
      f.network, 
      f.others
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id
    WHERE p.category = 'mobiles'
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
    // console.log("products", products)
  });
});

app.get("/backend/fetchmobiles", (req, res) => {
  const sql = `
    SELECT 
      p.prod_id, 
      p.prod_name,
      p.id, 
      p.category, 
      p.prod_price, 
      p.actual_price,
      p.offer_price, 
      p.prod_img, 
      p.status,
      p.productStatus,
      p.deliverycharge,
      p.subtitle,
      p.offer_label,
      f.memory, 
      f.storage, 
      f.processor, 
      f.camera, 
      f.display, 
      f.battery, 
      f.os, 
      f.network, 
      f.others
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id
    WHERE p.category = 'mobiles' AND productStatus = 'approved'
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
    // console.log("products", products)
  });
});

app.put(
  "/backend/updatemobiles/image/:id",
  mobilesUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/mobiles/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deletemobiles/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/mobiles/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// // Update product route with multiple images
// app.put('/backend/updatemobiles/:id', mobilesUpload.array('images', 5), (req, res) => {
//   const productId = req.params.id;
//   const { label , name, features, price, status, actual_price, coupon_expiry_date, coupon,deliverycharge, subtitle  } = req.body;
//   const images = req.files.map(file => file.filename);

//   let sql = 'UPDATE oneclick_product_category SET deliverycharge = ?, subtitle =?,  coupon_expiry_date = ?, coupon = ?, actual_price = ?, offer_label = ?,   prod_name = ?, prod_features = ?, prod_price = ?, status = ?';
//   let values = [deliverycharge, subtitle , coupon_expiry_date, coupon, actual_price, label, name, features, price, status];

//   if (images.length > 0) {
//     // Update image and remove the old image files
//     const oldImageQuery = 'SELECT prod_img FROM oneclick_product_category WHERE id = ?';
//     db.query(oldImageQuery, [productId], (err, results) => {
//       if (err) return res.status(500).send(err);
//       const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
//       if (oldImages && oldImages.length > 0) {
//         oldImages.forEach((oldImage) => {
//           fs.unlink(`uploads/mobiles/${oldImage}`, (err) => {
//             if (err) console.error('Failed to delete old image:', err);
//           });
//         });
//       }

//       sql += ', prod_img = ? WHERE id = ?';
//       values.push(JSON.stringify(images), productId);

//       db.query(sql, values, (err, results) => {
//         if (err) return res.status(500).send(err);
//         res.json({ message: 'Product updated successfully with multiple images' });
//       });
//     });
//   } else {
//     sql += ' WHERE id = ?';
//     values.push(productId);

//     db.query(sql, values, (err, results) => {
//       if (err) return res.status(500).send(err);
//       res.json({ message: 'Product updated successfully' });
//     });
//   }
// });
app.put("/backend/updatemobiles/:id", (req, res) => {
  const productId = req.params.id;
  const {
    label,
    name,
    price,
    status,
    actual_price,
    // coupon_expiry_date,
    // coupon,
    deliverycharge,
    subtitle,
    memory,
    storage,
    processor,
    camera,
    display,
    battery,
    os,
    network,
    others,
    productStatus,
  } = req.body;

  console.log("Received update request for product ID:", productId);
  console.log("Request body:", req.body);

  // Check if the product exists in the database
  const checkProductSql = `SELECT * FROM oneclick_product_category WHERE prod_id = ?`;
  db.query(checkProductSql, [productId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error(
        "Error checking product in `oneclick_product_category`:",
        checkErr
      );
      return res
        .status(500)
        .send({
          message: "Failed to check product existence.",
          error: checkErr,
        });
    }

    if (checkResults.length === 0) {
      // Product doesn't exist, insert a new one
      console.log("Product not found, inserting a new product.");

      const insertProductSql = `
        INSERT INTO oneclick_product_category (prod_id,productStatus,  deliverycharge, subtitle,
                                              actual_price, offer_label, prod_name, prod_price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const insertProductValues = [
        productId,
        deliverycharge || 0,
        subtitle || "",
        // coupon_expiry_date || null,
        productStatus || "",
        actual_price || 0,
        label || "",
        name || "",
        price || 0,
        status || "",
      ];

      db.query(
        insertProductSql,
        insertProductValues,
        (insertErr, insertResults) => {
          if (insertErr) {
            console.error(
              "Error inserting product in `oneclick_product_category`:",
              insertErr
            );
            return res
              .status(500)
              .send({
                message: "Failed to insert new product.",
                error: insertErr,
              });
          }

          console.log(
            "New product inserted successfully in `oneclick_product_category`."
          );

          // Now insert features
          const insertFeaturesSql = `
          INSERT INTO oneclick_mobile_features (prod_id, memory, storage, processor, camera, display, battery, 
                                                 os, network, others)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          const insertFeaturesValues = [
            productId,
            memory || "",
            storage || "",
            processor || "",
            camera || "",
            display || "",
            battery || "",
            os || "",
            network || "",
            others || "",
          ];

          db.query(
            insertFeaturesSql,
            insertFeaturesValues,
            (featuresInsertErr, featuresInsertResults) => {
              if (featuresInsertErr) {
                console.error(
                  "Error inserting features in `oneclick_mobile_features`:",
                  featuresInsertErr
                );
                return res
                  .status(500)
                  .send({
                    message: "Failed to insert product features.",
                    error: featuresInsertErr,
                  });
              }

              console.log(
                "Product features inserted successfully in `oneclick_mobile_features`."
              );
              res.json({
                message: "Product and features inserted successfully.",
              });
            }
          );
        }
      );
    } else {
      // Product exists, update the product and features
      console.log("Product found, updating the existing product.");

      const updateProductSql = `
        UPDATE oneclick_product_category 
        SET productStatus = ?,  deliverycharge = ?, subtitle = ?, 
            actual_price = ?, offer_label = ?, prod_name = ?, prod_price = ?, 
            status = ? 
        WHERE prod_id = ?`;
      const updateProductValues = [
        productStatus || "",
        deliverycharge || 0,
        subtitle || "",
        actual_price || 0,
        label || "",
        name || "",
        price || 0,
        status || "",
        productId,
      ];

      db.query(
        updateProductSql,
        updateProductValues,
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error(
              "Error updating product in `oneclick_product_category`:",
              updateErr
            );
            return res
              .status(500)
              .send({
                message: "Failed to update product details.",
                error: updateErr,
              });
          }

          console.log(
            "Product updated successfully in `oneclick_product_category`."
          );
          console.log("Affected rows:", updateResults.affectedRows);

          // Check if features exist in the `oneclick_mobile_features` table
          const checkFeaturesSql = `SELECT * FROM oneclick_mobile_features WHERE prod_id = ?`;
          db.query(
            checkFeaturesSql,
            [productId],
            (checkFeaturesErr, checkFeaturesResults) => {
              if (checkFeaturesErr) {
                console.error(
                  "Error checking product features in `oneclick_mobile_features`:",
                  checkFeaturesErr
                );
                return res
                  .status(500)
                  .send({
                    message: "Failed to check product features.",
                    error: checkFeaturesErr,
                  });
              }

              if (checkFeaturesResults.length === 0) {
                // Features don't exist, insert them
                console.log("Features not found, inserting new features.");

                const insertFeaturesSql = `
              INSERT INTO oneclick_mobile_features (prod_id, camera, battery, network, memory, storage, processor, display, os, others)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const insertFeaturesValues = [
                  productId,
                  camera || "",
                  battery || "",
                  network || "",
                  memory || "",
                  storage || "",
                  processor || "",
                  display || "",
                  os || "",
                  others || "",
                ];

                db.query(
                  insertFeaturesSql,
                  insertFeaturesValues,
                  (featuresInsertErr, featuresInsertResults) => {
                    if (featuresInsertErr) {
                      console.error(
                        "Error inserting features in `oneclick_mobile_features`:",
                        featuresInsertErr
                      );
                      return res
                        .status(500)
                        .send({
                          message: "Failed to insert product features.",
                          error: featuresInsertErr,
                        });
                    }

                    console.log(
                      "Product features inserted successfully in `oneclick_mobile_features`."
                    );
                    res.json({
                      success: true,
                      message:
                        "Product updated and features inserted successfully.",
                    });
                  }
                );
              } else {
                // Update features if they exist
                console.log("Features found, updating product features.");

                const updateFeaturesSql = `
              UPDATE oneclick_mobile_features 
              SET camera = ?, battery = ?, network = ?, memory = ?, storage = ?, processor = ?, 
                  display = ?, os = ?, others = ? 
              WHERE prod_id = ?`;
                const updateFeatureValues = [
                  camera || "",
                  battery || "",
                  network || "",
                  memory || "",
                  storage || "",
                  processor || "",
                  display || "",
                  os || "",
                  others || "",
                  productId,
                ];

                db.query(
                  updateFeaturesSql,
                  updateFeatureValues,
                  (featuresUpdateErr, featuresUpdateResults) => {
                    if (featuresUpdateErr) {
                      console.error(
                        "Error updating features in `oneclick_mobile_features`:",
                        featuresUpdateErr
                      );
                      return res
                        .status(500)
                        .send({
                          message: "Failed to update product features.",
                          error: featuresUpdateErr,
                        });
                    }

                    console.log(
                      "Product features updated successfully in `oneclick_mobile_features`."
                    );
                    res.json({
                      success: true,
                      message: "Product and features updated successfully.",
                    });
                  }
                );
              }
            }
          );
        }
      );
    }
  });
});

// Endpoint to delete a product
app.delete("/backend/deletemobiles/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/mobiles/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});
///////////cctv///////////////////////////////////////////////

// Set up multer for file uploads in the `/cctv` endpoint
const cctvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/cctv directory exists
    const dir = "uploads/cctv";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const cctvUpload = multer({ storage: cctvStorage });
app.post(
  "/backend/uploadcctvimages",
  cctvUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);

// Endpoint to add a new product with multiple images
app.post("/backend/cctv", cctvUpload.array("images", 5), (req, res) => {
  // Accept up to 5 images
  const {
    name,
    features,
    productStatus,
    price,
    category,
    actual_price,
    label,
    deliverycharge,
    subtitle,
  } = req.body;
  // console.log('req.body', req.body)
  const images = req.files.map((file) => file.filename); // Get all uploaded image filenames

  const sql =
    "INSERT INTO oneclick_product_category (productStatus, deliverycharge, subtitle,   offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?,  ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const status = "available"; // or any other status you might want to set
  const prod_id = generateProductId();

  // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
  db.query(
    sql,
    [
      productStatus,
      deliverycharge,
      subtitle,
      label,
      actual_price,
      "CCTV",
      prod_id,
      name,
      features,
      price,
      JSON.stringify(images),
      status,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting product into database:", err); // Log the error
        return res.status(500).send("Error adding product");
      }

      console.log("Product added successfully with ID:", prod_id); // Log successful addition
      res.send("Product added with multiple images");
    }
  );
});

app.get("/backend/adminfetchcctv", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'cctv' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});

app.get("/backend/fetchcctv", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'cctv' AND productStatus = 'approved' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});

app.put(
  "/backend/updatecctv/image/:id",
  cctvUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/cctv/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deletecctv/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/cctv/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route with multiple images
app.put(
  "/backend/updatecctv/:id",
  cctvUpload.array("images", 5),
  (req, res) => {
    console.log("Received update request with data:", req.body);

    const productId = req.params.id;
    const {
      productStatus,
      subtitle,
      deliverycharge,
      label,
      name,
      features,
      price,
      status,
      actual_price,
    } = req.body;
    const images = req.files.map((file) => file.filename);

    let sql =
      "UPDATE oneclick_product_category SET productStatus = ?, subtitle = ?, deliverycharge = ?, actual_price = ?, offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?";
    let values = [
      productStatus,
      subtitle,
      deliverycharge,
      actual_price,
      label,
      name,
      features,
      price,
      status,
    ];

    if (images.length > 0) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);
        const oldImages = JSON.parse(results[0].prod_img);
        if (oldImages && oldImages.length > 0) {
          oldImages.forEach((oldImage) => {
            fs.unlink(`uploads/cctv/${oldImage}`, (err) => {
              if (err) console.error("Failed to delete old image:", err);
            });
          });
        }

        sql += ", prod_img = ? WHERE id = ?";
        values.push(JSON.stringify(images), productId);

        db.query(sql, values, (err, results) => {
          if (err) return res.status(500).send(err);
          res.json({
            message: "Product updated successfully with multiple images",
          });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// Endpoint to delete a product
// Endpoint to delete a product
app.delete("/backend/deletecctv/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/cctv/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});
///////////////////////////////// secondhandproducts///////////

// Set up multer for file uploads in the `/cctv` endpoint
const secondhandproductsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/secondhandproducts directory exists
    const dir = "uploads/secondhandproducts";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const secondhandproductsUpload = multer({ storage: secondhandproductsStorage });

app.post(
  "/backend/uploadsecondhandproductsimages",
  secondhandproductsUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);

// Endpoint to add a new product with multiple images
app.post(
  "/backend/secondhandproducts",
  secondhandproductsUpload.array("images", 5),
  (req, res) => {
    // Accept up to 5 images
    const {
      name,
      features,
      productStatus,
      price,
      category,
      actual_price,
      label,
      deliverycharge,
      subtitle,
    } = req.body;
    // console.log('req.body', req.body)
    const images = req.files.map((file) => file.filename); // Get all uploaded image filenames

    const sql =
      "INSERT INTO oneclick_product_category (productStatus, deliverycharge, subtitle,   offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?,  ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const status = "available"; // or any other status you might want to set
    const prod_id = generateProductId();

    // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
    db.query(
      sql,
      [
        productStatus,
        deliverycharge,
        subtitle,
        label,
        actual_price,
        "secondhandproducts",
        prod_id,
        name,
        features,
        price,
        JSON.stringify(images),
        status,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting product into database:", err); // Log the error
          return res.status(500).send("Error adding product");
        }

        console.log("Product added successfully with ID:", prod_id); // Log successful addition
        res.send("Product added with multiple images");
      }
    );
  }
);

app.get("/backend/adminfetchsecondhandproducts", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'secondhandproducts' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});

app.get("/backend/fetchsecondhandproducts", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'secondhandproducts' AND productStatus = 'approved' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});

app.put(
  "/backend/updatesecondhandproducts/image/:id",
  secondhandproductsUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/secondhandproducts/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deletesecondhandproducts/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/secondhandproducts/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route with multiple images
app.put(
  "/backend/updatesecondhandproducts/:id",
  secondhandproductsUpload.array("images", 5),
  (req, res) => {
    console.log("Received update request with data:", req.body);

    const productId = req.params.id;
    const {
      productStatus,
      subtitle,
      deliverycharge,
      label,
      name,
      features,
      price,
      status,
      actual_price,
    } = req.body;
    const images = req.files.map((file) => file.filename);

    let sql =
      "UPDATE oneclick_product_category SET productStatus = ?, subtitle = ?, deliverycharge = ?, actual_price = ?, offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?";
    let values = [
      productStatus,
      subtitle,
      deliverycharge,
      actual_price,
      label,
      name,
      features,
      price,
      status,
    ];

    if (images.length > 0) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);
        const oldImages = JSON.parse(results[0].prod_img);
        if (oldImages && oldImages.length > 0) {
          oldImages.forEach((oldImage) => {
            fs.unlink(`uploads/secondhandproducts/${oldImage}`, (err) => {
              if (err) console.error("Failed to delete old image:", err);
            });
          });
        }

        sql += ", prod_img = ? WHERE id = ?";
        values.push(JSON.stringify(images), productId);

        db.query(sql, values, (err, results) => {
          if (err) return res.status(500).send(err);
          res.json({
            message: "Product updated successfully with multiple images",
          });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// Endpoint to delete a product
// Endpoint to delete a product
app.delete("/backend/deletesecondhandproducts/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/secondhandproducts/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});
/////////////////////////tv///////////////////

// Set up multer for file uploads in the `/cctv` endpoint
const tvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/tv directory exists
    const dir = "uploads/tv";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const tvUpload = multer({ storage: tvStorage });

app.post("/backend/uploadtvimages", tvUpload.array("images", 5), (req, res) => {
  const productId = req.body.productId; // Get the product ID from the request body
  const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

  console.log(`Received upload request for product ID: ${productId}`); // Log product ID
  console.log("New images:", newImages); // Log new images

  const fetchImagesSql =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  db.query(fetchImagesSql, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching product images:", err.message);
      return res.status(500).send("Error fetching product images");
    }

    if (results.length > 0) {
      const existingImages = JSON.parse(results[0].prod_img) || [];
      const updatedImages = [...existingImages, ...newImages];

      console.log(
        `Existing images found for product ID ${productId}:`,
        existingImages
      );
      console.log(`Updated images for product ID ${productId}:`, updatedImages);

      const updateImagesSql =
        "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
      db.query(
        updateImagesSql,
        [JSON.stringify(updatedImages), productId],
        (err, result) => {
          if (err) {
            console.error("Error updating product images:", err.message);
            return res.status(500).send("Error updating product images");
          }

          console.log("Number of rows affected:", result.affectedRows);
          if (result.affectedRows === 0) {
            console.warn("No rows updated. Check if the product ID exists.");
          } else {
            console.log(
              "Images updated successfully for product ID:",
              productId
            );
            res.send("Images uploaded and updated successfully");
          }
        }
      );
    } else {
      console.warn(`Product not found for ID: ${productId}`);
      res.status(404).send("Product not found");
    }
  });
});
// Endpoint to add a new product with multiple images
app.post("/backend/tv", tvUpload.array("images", 5), (req, res) => {
  // Accept up to 5 images
  const {
    productStatus,
    name,
    features,
    price,
    category,
    actual_price,
    label,
    deliverycharge,
    subtitle,
  } = req.body;
  const images = req.files.map((file) => file.filename); // Get all uploaded image filenames

  const sql =
    "INSERT INTO oneclick_product_category (productStatus, deliverycharge, subtitle ,offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const status = "available"; // or any other status you might want to set
  const prod_id = generateProductId();

  // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
  db.query(
    sql,
    [
      productStatus,
      deliverycharge,
      subtitle,
      label,
      actual_price,
      "TV",
      prod_id,
      name,
      features,
      price,
      JSON.stringify(images),
      status,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting product into database:", err); // Log the error
        return res.status(500).send("Error adding product");
      }

      console.log("Product added successfully with ID:", prod_id); // Log successful addition
      res.send("Product added with multiple images");
    }
  );
});

app.get("/backend/adminfetchtv", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'tv' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});
app.get("/backend/fetchtv", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'tv' AND productStatus = 'approved' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});
app.put("/backend/updatetv/image/:id", tvUpload.single("image"), (req, res) => {
  const productId = req.params.id;
  const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
  console.log(
    "Received request to update image for product ID:",
    productId,
    "at index:",
    imageIndex
  );

  // Check if a new image file is uploaded
  if (req.file) {
    const oldImageQuery =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    // Fetch the existing image data
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);

      const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
      console.log("Current images in DB before update:", oldImages);

      // Check if the specified index is valid
      if (imageIndex >= 0 && imageIndex < oldImages.length) {
        const oldImagePath = `uploads/tv/${oldImages[imageIndex]}`; // Old image path

        // Delete the old image file
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });

        // Prepare the new images array, replacing the specified old image
        const newImageFileName = req.file.filename; // Get the new image filename
        oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

        // Log the new images array
        console.log("New images array to be updated in DB:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            // Pass both parameters here
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }
            console.log("Update results:", results);
            res.json({ message: "Product image updated successfully" });
          }
        );
      } else {
        // Invalid index
        res.status(400).json({ message: "Invalid image index." });
      }
    });
  } else {
    // No image uploaded
    res.status(400).json({ message: "No image file uploaded" });
  }
});

app.delete("/backend/deletetv/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/tv/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route with multiple images
app.put("/backend/updatetv/:id", tvUpload.array("images", 5), (req, res) => {
  const productId = req.params.id;
  const {
    productStatus,
    label,
    name,
    features,
    price,
    status,
    actual_price,
    deliverycharge,
    subtitle,
  } = req.body;
  const images = req.files.map((file) => file.filename);

  let sql =
    "UPDATE oneclick_product_category SET productStatus = ?, deliverycharge = ?, subtitle = ?,   actual_price = ?, offer_label = ?,   prod_name = ?, prod_features = ?, prod_price = ?, status = ?";
  let values = [
    productStatus,
    deliverycharge,
    subtitle,
    actual_price,
    label,
    name,
    features,
    price,
    status,
  ];

  if (images.length > 0) {
    // Update image and remove the old image files
    const oldImageQuery =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);
      const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
      if (oldImages && oldImages.length > 0) {
        oldImages.forEach((oldImage) => {
          fs.unlink(`uploads/tv/${oldImage}`, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        });
      }

      sql += ", prod_img = ? WHERE id = ?";
      values.push(JSON.stringify(images), productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({
          message: "Product updated successfully with multiple images",
        });
      });
    });
  } else {
    sql += " WHERE id = ?";
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Product updated successfully" });
    });
  }
});

// Endpoint to delete a product
// Endpoint to delete a product
app.delete("/backend/deletetv/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/tv/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});
////////////////headphones///////////////

// Set up multer for file uploads in the `/cctv` endpoint
const headphonesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/headphones directory exists
    const dir = "uploads/headphones";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const headphonesUpload = multer({ storage: headphonesStorage });

app.post(
  "/backend/uploadheadphonesimages",
  headphonesUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);
// Endpoint to add a new product with multiple images
app.post(
  "/backend/headphones",
  headphonesUpload.array("images", 5),
  (req, res) => {
    // Accept up to 5 images
    const {
      productStatus,
      name,
      features,
      price,
      category,
      actual_price,
      label,
      deliverycharge,
      subtitle,
    } = req.body;
    const images = req.files.map((file) => file.filename); // Get all uploaded image filenames

    const sql =
      "INSERT INTO oneclick_product_category (productStatus, deliverycharge, subtitle , offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const status = "available"; // or any other status you might want to set
    const prod_id = generateProductId();

    // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
    db.query(
      sql,
      [
        productStatus,
        deliverycharge,
        subtitle,
        label,
        actual_price,
        "Headphones",
        prod_id,
        name,
        features,
        price,
        JSON.stringify(images),
        status,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting product into database:", err); // Log the error
          return res.status(500).send("Error adding product");
        }

        console.log("Product added successfully with ID:", prod_id); // Log successful addition
        res.send("Product added with multiple images");
      }
    );
  }
);

app.get("/backend/adminfetchheadphones", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'headphones' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});

app.get("/backend/fetchheadphones", (req, res) => {
  console.log("Received request to fetch headphones");

  const sql =
    "SELECT * FROM oneclick_product_category WHERE LOWER(category) = 'headphones' AND productStatus = 'approved' ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products from database:", err);
      return res.status(500).json({ message: "Failed to fetch products" });
    }

    console.log(`Fetched ${results.length} products from the database`);

    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    console.log("Sending fetched products to the client...");
    res.json(products);
  });
});

app.put(
  "/backend/updateheadphones/image/:id",
  headphonesUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/headphones/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deleteheadphones/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/headphones/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route
app.put(
  "/backend/updateheadphones/:id",
  headphonesUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const {
      productStatus,
      name,
      features,
      price,
      status,
      label,
      actual_price,
      deliverycharge,
      subtitle,
    } = req.body;
    const image = req.file ? req.file.filename : null;

    let sql =
      "UPDATE oneclick_product_category SET productStatus = ?, deliverycharge = ?, subtitle = ?,  actual_price = ?,  offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?";
    let values = [
      productStatus,
      deliverycharge,
      subtitle,
      actual_price,
      label,
      name,
      features,
      price,
      status,
    ];

    if (image) {
      // Update image and remove the old image file
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);
        const oldImage = results[0] && results[0].prod_img;
        if (oldImage && oldImage !== image) {
          fs.unlink(`uploads/headphones/${oldImage}`, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }

        sql += ", prod_img = ? WHERE id = ?";
        values.push(image, productId);

        db.query(sql, values, (err, results) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Product updated successfully" });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// Endpoint to delete a product
// Endpoint to delete a product
app.delete("/backend/deleteheadphones/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/headphones/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});
/////////////speaker////////////////

// Set up multer for file uploads in the `/cctv` endpoint
const speakersStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/speakers directory exists
    const dir = "uploads/speakers";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const speakersUpload = multer({ storage: speakersStorage });

app.post(
  "/backend/uploadspeakersimages",
  speakersUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);
// Endpoint to add a new product with multiple images
app.post("/backend/speakers", speakersUpload.array("images", 5), (req, res) => {
  // Accept up to 5 images
  const {
    productStatus,
    name,
    features,
    price,
    category,
    actual_price,
    label,
    deliverycharge,
    subtitle,
  } = req.body;
  const images = req.files.map((file) => file.filename); // Get all uploaded image filenames

  const sql =
    "INSERT INTO oneclick_product_category (productStatus, deliverycharge, subtitle ,  offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const status = "available"; // or any other status you might want to set
  const prod_id = generateProductId();

  // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
  db.query(
    sql,
    [
      productStatus,
      deliverycharge,
      subtitle,
      label,
      actual_price,
      "Speakers",
      prod_id,
      name,
      features,
      price,
      JSON.stringify(images),
      status,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting product into database:", err); // Log the error
        return res.status(500).send("Error adding product");
      }

      console.log("Product added successfully with ID:", prod_id); // Log successful addition
      res.send("Product added with multiple images");
    }
  );
});

app.get("/backend/adminfetchspeakers", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'speakers' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});
app.get("/backend/fetchspeakers", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'speakers' AND productStatus = 'approved' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});
app.put(
  "/backend/updatespeakers/image/:id",
  speakersUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/speakers/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deletespeakers/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/speakers/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route
app.put(
  "/backend/updatespeakers/:id",
  speakersUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const {
      productStatus,
      name,
      features,
      price,
      status,
      label,
      actual_price,
      deliverycharge,
      subtitle,
    } = req.body;
    const image = req.file ? req.file.filename : null;

    let sql =
      "UPDATE oneclick_product_category SET productStatus = ?,  deliverycharge = ?, subtitle = ?,  actual_price = ?, offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?";
    let values = [
      productStatus,
      deliverycharge,
      subtitle,
      actual_price,
      label,
      name,
      features,
      price,
      status,
    ];

    if (image) {
      // Update image and remove the old image file
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);
        const oldImage = results[0] && results[0].prod_img;
        if (oldImage && oldImage !== image) {
          fs.unlink(`uploads/speakers/${oldImage}`, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }

        sql += ", prod_img = ? WHERE id = ?";
        values.push(image, productId);

        db.query(sql, values, (err, results) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Product updated successfully" });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// Endpoint to delete a product
// Endpoint to delete a product
app.delete("/backend/deletespeakers/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/speakers/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});
/////////////watch///////////////////////

// Set up multer for file uploads in the `/cctv` endpoint
const watchStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/watch directory exists
    const dir = "uploads/watch";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const watchUpload = multer({ storage: watchStorage });
app.post(
  "/backend/uploadwatchimages",
  watchUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);
// Endpoint to add a new product with multiple images
app.post("/backend/watch", watchUpload.array("images", 5), (req, res) => {
  // Accept up to 5 images
  const {
    productStatus,
    name,
    features,
    price,
    category,
    actual_price,
    label,
    deliverycharge,
    subtitle,
  } = req.body;
  const images = req.files.map((file) => file.filename); // Get all uploaded image filenames

  const sql =
    "INSERT INTO oneclick_product_category (productStatus, deliverycharge, subtitle , offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const status = "available"; // or any other status you might want to set
  const prod_id = generateProductId();

  // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
  db.query(
    sql,
    [
      productStatus,
      deliverycharge,
      subtitle,
      label,
      actual_price,
      "Watch",
      prod_id,
      name,
      features,
      price,
      JSON.stringify(images),
      status,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting product into database:", err); // Log the error
        return res.status(500).send("Error adding product");
      }

      console.log("Product added successfully with ID:", prod_id); // Log successful addition
      res.send("Product added with multiple images");
    }
  );
});

app.get("/backend/adminfetchwatch", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'watch' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});
app.get("/backend/fetchwatch", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'watch' AND productStatus = 'approved' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});
app.put(
  "/backend/updatewatch/image/:id",
  watchUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/watch/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deletewatch/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/watch/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route with multiple images
app.put(
  "/backend/updatewatch/:id",
  watchUpload.array("images", 5),
  (req, res) => {
    const productId = req.params.id;
    const {
      productStatus,
      label,
      name,
      features,
      price,
      status,
      actual_price,
      deliverycharge,
      subtitle,
    } = req.body;
    const images = req.files.map((file) => file.filename);

    let sql =
      "UPDATE oneclick_product_category SET productStatus = ?, deliverycharge = ?, subtitle = ?,   actual_price = ?, offer_label = ?,   prod_name = ?, prod_features = ?, prod_price = ?, status = ?";
    let values = [
      productStatus,
      deliverycharge,
      subtitle,
      actual_price,
      label,
      name,
      features,
      price,
      status,
    ];

    if (images.length > 0) {
      // Update image and remove the old image files
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);
        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        if (oldImages && oldImages.length > 0) {
          oldImages.forEach((oldImage) => {
            fs.unlink(`uploads/watch/${oldImage}`, (err) => {
              if (err) console.error("Failed to delete old image:", err);
            });
          });
        }

        sql += ", prod_img = ? WHERE id = ?";
        values.push(JSON.stringify(images), productId);

        db.query(sql, values, (err, results) => {
          if (err) return res.status(500).send(err);
          res.json({
            message: "Product updated successfully with multiple images",
          });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// Endpoint to delete a product
// Endpoint to delete a product
app.delete("/backend/deletewatch/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/watch/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});

//////////////printers//////////////////////////////

// Set up multer for file uploads in the `/cctv` endpoint
const printersStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/printers directory exists
    const dir = "uploads/printers";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const printersUpload = multer({ storage: printersStorage });

app.post(
  "/backend/uploadprintersimages",
  printersUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);
// Endpoint to add a new product with multiple images
app.post("/backend/printers", printersUpload.array("images", 5), (req, res) => {
  // Accept up to 5 images
  const {
    productStatus,
    name,
    features,
    price,
    category,
    actual_price,
    label,
    deliverycharge,
    subtitle,
  } = req.body;
  const images = req.files.map((file) => file.filename); // Get all uploaded image filenames

  const sql =
    "INSERT INTO oneclick_product_category (productStatus, deliverycharge, subtitle , offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const status = "available"; // or any other status you might want to set
  const prod_id = generateProductId();

  // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
  db.query(
    sql,
    [
      productStatus,
      deliverycharge,
      subtitle,
      label,
      actual_price,
      "Printers",
      prod_id,
      name,
      features,
      price,
      JSON.stringify(images),
      status,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting product into database:", err); // Log the error
        return res.status(500).send("Error adding product");
      }

      console.log("Product added successfully with ID:", prod_id); // Log successful addition
      res.send("Product added with multiple images");
    }
  );
});

app.get("/backend/adminfetchprinters", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE LOWER(category) = 'printers' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});
app.get("/backend/fetchprinters", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE LOWER(category) = 'printers' AND productStatus = 'approved' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});

app.put(
  "/backend/updateprinters/image/:id",
  printersUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/printers/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deleteprinters/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/printers/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route
app.put(
  "/backend/updateprinters/:id",
  printersUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const {
      productStatus,
      name,
      features,
      price,
      status,
      label,
      actual_price,
      deliverycharge,
      subtitle,
    } = req.body;
    const image = req.file ? req.file.filename : null;

    let sql =
      "UPDATE oneclick_product_category SET productStatus = ?,  deliverycharge = ?, subtitle = ?,   actual_price = ?,  offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?";
    let values = [
      productStatus,
      deliverycharge,
      subtitle,
      actual_price,
      label,
      name,
      features,
      price,
      status,
    ];

    if (image) {
      // Update image and remove the old image file
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);
        const oldImage = results[0] && results[0].prod_img;
        if (oldImage && oldImage !== image) {
          fs.unlink(`uploads/printers/${oldImage}`, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }

        sql += ", prod_img = ? WHERE id = ?";
        values.push(image, productId);

        db.query(sql, values, (err, results) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Product updated successfully" });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// Endpoint to delete a product
app.delete("/backend/deleteprinters/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/printers/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});
/////////////mobileaccessories////////////////////

// Set up multer for file uploads in the `/cctv` endpoint
const mobileaccessoriesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/mobileaccessories directory exists
    const dir = "uploads/mobileaccessories";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const mobileaccessoriesUpload = multer({ storage: mobileaccessoriesStorage });

app.post(
  "/backend/uploadmobileaccessoriesimages",
  mobileaccessoriesUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);
// Endpoint to add a new product with multiple images
app.post(
  "/backend/mobileaccessories",
  mobileaccessoriesUpload.array("images", 5),
  (req, res) => {
    // Accept up to 5 images
    const {
      productStatus,
      effectiveprice,
      name,
      features,
      price,
      category,
      actual_price,
      label,
      deliverycharge,
      subtitle,
    } = req.body;
    const images = req.files.map((file) => file.filename); // Get all uploaded image filenames

    const sql =
      "INSERT INTO oneclick_product_category (productStatus, effectiveprice, deliverycharge, subtitle , offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const status = "available"; // or any other status you might want to set
    const prod_id = generateProductId();

    // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
    db.query(
      sql,
      [
        productStatus,
        effectiveprice,
        deliverycharge,
        subtitle,
        label,
        actual_price,
        "MobileAccessories",
        prod_id,
        name,
        features,
        price,
        JSON.stringify(images),
        status,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting product into database:", err); // Log the error
          return res.status(500).send("Error adding product");
        }

        console.log("Product added successfully with ID:", prod_id); // Log successful addition
        res.send("Product added with multiple images");
      }
    );
  }
);

app.get("/backend/adminfetchmobileaccessories", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'mobileaccessories' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});

app.get("/backend/fetchmobileaccessories", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'mobileaccessories' AND productStatus = 'approved' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});
app.put(
  "/backend/updatemobileaccessories/image/:id",
  mobileaccessoriesUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/mobileaccessories/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deletemobileaccessories/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/mobileaccessories/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route
app.put(
  "/backend/updatemobileaccessories/:id",
  mobileaccessoriesUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const {
      productStatus,
      effectiveprice,
      name,
      features,
      price,
      status,
      label,
      actual_price,
      deliverycharge,
      subtitle,
    } = req.body;
    const image = req.file ? req.file.filename : null;

    let sql =
      "UPDATE oneclick_product_category SET productStatus = ?, effectiveprice = ?,  deliverycharge = ?, subtitle = ?,  actual_price = ?, offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?";
    let values = [
      productStatus,
      effectiveprice,
      deliverycharge,
      subtitle,
      actual_price,
      label,
      name,
      features,
      price,
      status,
    ];

    if (image) {
      // Update image and remove the old image file
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);
        const oldImage = results[0] && results[0].prod_img;
        if (oldImage && oldImage !== image) {
          fs.unlink(`uploads/mobileaccessories/${oldImage}`, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }

        sql += ", prod_img = ? WHERE id = ?";
        values.push(image, productId);

        db.query(sql, values, (err, results) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Product updated successfully" });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// Endpoint to delete a product
// Endpoint to delete a product
app.delete("/backend/deletemobileaccessories/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/mobileaccessories/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});

////////////////////printeraccessories/////////////////////

// Set up multer for file uploads in the `/cctv` endpoint
const printeraccessoriesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/printeraccessories directory exists
    const dir = "uploads/printeraccessories";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const printeraccessoriesUpload = multer({ storage: printeraccessoriesStorage });

app.post(
  "/backend/uploadprinteraccessoriesimages",
  printeraccessoriesUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);
// Endpoint to add a new product with multiple images
app.post(
  "/backend/printeraccessories",
  printeraccessoriesUpload.array("images", 5),
  (req, res) => {
    // Accept up to 5 images
    const {
      productStatus,
      effectiveprice,
      name,
      features,
      price,
      category,
      actual_price,
      label,
      deliverycharge,
      subtitle,
    } = req.body;
    const images = req.files.map((file) => file.filename); // Get all uploaded image filenames

    const sql =
      "INSERT INTO oneclick_product_category (productStatus, effectiveprice, deliverycharge, subtitle , offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const status = "available"; // or any other status you might want to set
    const prod_id = generateProductId();

    // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
    db.query(
      sql,
      [
        productStatus,
        effectiveprice,
        deliverycharge,
        subtitle,
        label,
        actual_price,
        "PrinterAccessories",
        prod_id,
        name,
        features,
        price,
        JSON.stringify(images),
        status,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting product into database:", err); // Log the error
          return res.status(500).send("Error adding product");
        }

        console.log("Product added successfully with ID:", prod_id); // Log successful addition
        res.send("Product added with multiple images");
      }
    );
  }
);

app.get("/backend/adminfetchprinteraccessories", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'printeraccessories' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});
app.get("/backend/fetchprinteraccessories", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'printeraccessories' AND productStatus = 'approved' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});
app.put(
  "/backend/updateprinteraccessories/image/:id",
  printeraccessoriesUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/printeraccessories/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deleteprinteraccessories/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/printeraccessories/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route
app.put(
  "/backend/updateprinteraccessories/:id",
  printeraccessoriesUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const {
      productStatus,
      effectiveprice,
      name,
      features,
      price,
      status,
      label,
      actual_price,
      deliverycharge,
      subtitle,
    } = req.body;
    const image = req.file ? req.file.filename : null;

    let sql =
      "UPDATE oneclick_product_category SET productStatus = ?, effectiveprice = ?, deliverycharge = ?, subtitle = ?,   actual_price = ?, offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?";
    let values = [
      productStatus,
      effectiveprice,
      deliverycharge,
      subtitle,
      actual_price,
      label,
      name,
      features,
      price,
      status,
    ];

    if (image) {
      // Update image and remove the old image file
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);
        const oldImage = results[0] && results[0].prod_img;
        if (oldImage && oldImage !== image) {
          fs.unlink(`uploads/printeraccessories/${oldImage}`, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }

        sql += ", prod_img = ? WHERE id = ?";
        values.push(image, productId);

        db.query(sql, values, (err, results) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Product updated successfully" });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// Endpoint to delete a product
// Endpoint to delete a product
app.delete("/backend/deleteprinteraccessories/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/printeraccessories/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});
///////////////////////cctvaccessories////////////////////////

// Set up multer for file uploads in the `/cctv` endpoint
const cctvaccessoriesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/cctvaccessories directory exists
    const dir = "uploads/cctvaccessories";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const cctvaccessoriesUpload = multer({ storage: cctvaccessoriesStorage });

app.post(
  "/backend/uploadcctvaccessoriesimages",
  cctvaccessoriesUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);
// Endpoint to add a new product with multiple images
app.post(
  "/backend/cctvaccessories",
  cctvaccessoriesUpload.array("images", 5),
  (req, res) => {
    // Accept up to 5 images
    const {
      name,
      features,
      productStatus,
      price,
      category,
      actual_price,
      label,
      deliverycharge,
      subtitle,
    } = req.body;
    // console.log('req.body', req.body)
    const images = req.files.map((file) => file.filename); // Get all uploaded image filenames

    const sql =
      "INSERT INTO oneclick_product_category (productStatus, deliverycharge, subtitle,   offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?,  ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const status = "available"; // or any other status you might want to set
    const prod_id = generateProductId();

    // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
    db.query(
      sql,
      [
        productStatus,
        deliverycharge,
        subtitle,
        label,
        actual_price,
        "CCTVAccessories",
        prod_id,
        name,
        features,
        price,
        JSON.stringify(images),
        status,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting product into database:", err); // Log the error
          return res.status(500).send("Error adding product");
        }

        console.log("Product added successfully with ID:", prod_id); // Log successful addition
        res.send("Product added with multiple images");
      }
    );
  }
);

app.get("/backend/adminfetchcctvaccessories", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'cctvaccessories' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});

app.get("/backend/fetchcctvaccessories", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'cctvaccessories' AND productStatus = 'approved' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});

app.put(
  "/backend/updatecctvaccessories/image/:id",
  cctvaccessoriesUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/cctvaccessories/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deletecctvaccessories/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/cctvaccessories/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route
app.put(
  "/backend/updatecctvaccessories/:id",
  cctvaccessoriesUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const {
      productStatus,
      effectiveprice,
      name,
      features,
      price,
      status,
      label,
      actual_price,
      deliverycharge,
      subtitle,
    } = req.body;
    const image = req.file ? req.file.filename : null;

    let sql =
      "UPDATE oneclick_product_category SET productStatus = ?, effectiveprice = ?, deliverycharge = ?, subtitle = ?,   actual_price = ?, offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?";
    let values = [
      productStatus,
      effectiveprice,
      deliverycharge,
      subtitle,
      actual_price,
      label,
      name,
      features,
      price,
      status,
    ];

    if (image) {
      // Update image and remove the old image file
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);
        const oldImage = results[0] && results[0].prod_img;
        if (oldImage && oldImage !== image) {
          fs.unlink(`uploads/cctvaccessories/${oldImage}`, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }

        sql += ", prod_img = ? WHERE id = ?";
        values.push(image, productId);

        db.query(sql, values, (err, results) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Product updated successfully" });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// Endpoint to delete a product
// Endpoint to delete a product
app.delete("/backend/deletecctvaccessories/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/cctvaccessories/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});
///////////////////////////computeraccessories///////////////

// Set up multer for file uploads in the `/cctv` endpoint
const computeraccessoriesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/computeraccessories directory exists
    const dir = "uploads/computeraccessories";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const computeraccessoriesUpload = multer({
  storage: computeraccessoriesStorage,
});

app.post(
  "/backend/uploadcomputeraccessoriesimages",
  computeraccessoriesUpload.array("images", 5),
  (req, res) => {
    const productId = req.body.productId; // Get the product ID from the request body
    const newImages = req.files.map((file) => file.filename); // Get all uploaded image filenames

    console.log(`Received upload request for product ID: ${productId}`); // Log product ID
    console.log("New images:", newImages); // Log new images

    const fetchImagesSql =
      "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

    db.query(fetchImagesSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product images:", err.message);
        return res.status(500).send("Error fetching product images");
      }

      if (results.length > 0) {
        const existingImages = JSON.parse(results[0].prod_img) || [];
        const updatedImages = [...existingImages, ...newImages];

        console.log(
          `Existing images found for product ID ${productId}:`,
          existingImages
        );
        console.log(
          `Updated images for product ID ${productId}:`,
          updatedImages
        );

        const updateImagesSql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          updateImagesSql,
          [JSON.stringify(updatedImages), productId],
          (err, result) => {
            if (err) {
              console.error("Error updating product images:", err.message);
              return res.status(500).send("Error updating product images");
            }

            console.log("Number of rows affected:", result.affectedRows);
            if (result.affectedRows === 0) {
              console.warn("No rows updated. Check if the product ID exists.");
            } else {
              console.log(
                "Images updated successfully for product ID:",
                productId
              );
              res.send("Images uploaded and updated successfully");
            }
          }
        );
      } else {
        console.warn(`Product not found for ID: ${productId}`);
        res.status(404).send("Product not found");
      }
    });
  }
);

// Endpoint to add a new product with multiple images
app.post(
  "/backend/computeraccessories",
  computeraccessoriesUpload.array("images", 5),
  (req, res) => {
    // Accept up to 5 images
    const {
      productStatus,
      effectiveprice,
      name,
      features,
      price,
      category,
      actual_price,
      label,
      subtitle,
      deliverycharge,
    } = req.body;
    const images = req.files.map((file) => file.filename); // Get all uploaded image filenames

    const sql =
      "INSERT INTO oneclick_product_category (productStatus, effectiveprice, deliverycharge, subtitle,  offer_label, actual_price, category, prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const status = "available"; // or any other status you might want to set
    const prod_id = generateProductId();

    // Save the product with multiple image names (you can store them as a JSON string or in a separate table)
    db.query(
      sql,
      [
        productStatus,
        effectiveprice,
        deliverycharge,
        subtitle,
        label,
        actual_price,
        "ComputerAccessories",
        prod_id,
        name,
        features,
        price,
        JSON.stringify(images),
        status,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting product into database:", err); // Log the error
          return res.status(500).send("Error adding product");
        }

        console.log("Product added successfully with ID:", prod_id); // Log successful addition
        res.send("Product added with multiple images");
      }
    );
  }
);

app.get("/backend/adminfetchcomputeraccessories", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'computeraccessories'  ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});

app.get("/backend/fetchcomputeraccessories", (req, res) => {
  const sql =
    "SELECT * FROM oneclick_product_category WHERE category = 'computeraccessories' AND productStatus = 'approved' ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    // Parse the prod_img JSON string to an array for each product
    const products = results.map((product) => ({
      ...product,
      prod_img: JSON.parse(product.prod_img), // Convert to an array
    }));

    res.json(products);
  });
});

app.put(
  "/backend/updatecomputeraccessories/image/:id",
  computeraccessoriesUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const imageIndex = parseInt(req.query.index); // Get the image index from the query parameters
    console.log(
      "Received request to update image for product ID:",
      productId,
      "at index:",
      imageIndex
    );

    // Check if a new image file is uploaded
    if (req.file) {
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

      // Fetch the existing image data
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format
        console.log("Current images in DB before update:", oldImages);

        // Check if the specified index is valid
        if (imageIndex >= 0 && imageIndex < oldImages.length) {
          const oldImagePath = `uploads/computeraccessories/${oldImages[imageIndex]}`; // Old image path

          // Delete the old image file
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });

          // Prepare the new images array, replacing the specified old image
          const newImageFileName = req.file.filename; // Get the new image filename
          oldImages[imageIndex] = newImageFileName; // Replace the old image with the new one

          // Log the new images array
          console.log("New images array to be updated in DB:", oldImages);

          // Update the database with the modified images array
          const sql =
            "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
          db.query(
            sql,
            [JSON.stringify(oldImages), productId],
            (err, results) => {
              // Pass both parameters here
              if (err) {
                console.error("Error updating images in DB:", err);
                return res.status(500).send(err);
              }
              console.log("Update results:", results);
              res.json({ message: "Product image updated successfully" });
            }
          );
        } else {
          // Invalid index
          res.status(400).json({ message: "Invalid image index." });
        }
      });
    } else {
      // No image uploaded
      res.status(400).json({ message: "No image file uploaded" });
    }
  }
);

app.delete("/backend/deletecomputeraccessories/image/:id", (req, res) => {
  const productId = req.params.id;
  const imageIndex = req.query.index; // Get the index of the image to delete

  console.log(
    `Received request to delete image for product ID: ${productId} at index: ${imageIndex}`
  );

  const oldImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";

  // Fetch the existing image data
  db.query(oldImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching old images:", err);
      return res.status(500).send("Error fetching old images");
    }

    console.log("Fetched images from DB:", results);

    if (results.length === 0) {
      console.log(`No product found with ID: ${productId}`);
      return res.status(404).send("Product not found");
    }

    const oldImages = JSON.parse(results[0].prod_img); // Assuming stored images are in JSON format

    // If there are old images
    if (oldImages && oldImages.length > 0) {
      if (imageIndex < 0 || imageIndex >= oldImages.length) {
        console.log(
          `Invalid index: ${imageIndex}. Must be between 0 and ${
            oldImages.length - 1
          }`
        );
        return res.status(400).json({ message: "Invalid image index." });
      }

      const oldImagePath = `uploads/computeraccessories/${oldImages[imageIndex]}`; // Get the old image path using the index
      console.log(`Attempting to delete image at path: ${oldImagePath}`);

      // Delete the old image file from the server
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
          return res.status(500).send("Error deleting image file");
        }

        console.log(`Successfully deleted image: ${oldImagePath}`);

        // Prepare the new images array, removing the old image
        oldImages.splice(imageIndex, 1); // Remove the image at the specified index
        console.log("Updated images array after deletion:", oldImages);

        // Update the database with the modified images array
        const sql =
          "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
        db.query(
          sql,
          [JSON.stringify(oldImages), productId],
          (err, results) => {
            if (err) {
              console.error("Error updating images in DB:", err);
              return res.status(500).send(err);
            }

            console.log(`Updated product images for product ID: ${productId}`);
            res.json({ message: "Product image deleted successfully" });
          }
        );
      });
    } else {
      // No old images found, handle accordingly
      console.log(`No old images found for product ID: ${productId}`);
      res
        .status(400)
        .json({ message: "No old images found for this product." });
    }
  });
});

// Update product route
app.put(
  "/backend/updatecomputeraccessories/:id",
  computeraccessoriesUpload.single("image"),
  (req, res) => {
    const productId = req.params.id;
    const {
      productStatus,
      effectiveprice,
      name,
      features,
      price,
      status,
      category,
      label,
      actual_price,
      deliverycharge,
      subtitle,
    } = req.body;
    const image = req.file ? req.file.filename : null;
    console.log("req.body", req.body);
    let sql =
      "UPDATE oneclick_product_category SET productStatus = ?, effectiveprice = ?, deliverycharge = ?, subtitle = ?,   actual_price =?,  offer_label = ?, prod_name = ?, prod_features = ?, prod_price = ?, status = ?,category = ?";
    let values = [
      productStatus,
      effectiveprice,
      deliverycharge,
      subtitle,
      actual_price,
      label,
      name,
      features,
      price,
      status,
      category,
    ];

    if (image) {
      // Update image and remove the old image file
      const oldImageQuery =
        "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) return res.status(500).send(err);
        const oldImage = results[0] && results[0].prod_img;
        if (oldImage && oldImage !== image) {
          fs.unlink(`uploads/computeraccessories/${oldImage}`, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }

        sql += ", prod_img = ? WHERE id = ?";
        values.push(image, productId);

        db.query(sql, values, (err, results) => {
          if (err) return res.status(500).send(err);
          res.json({ message: "Product updated successfully" });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// Endpoint to delete a product
// Endpoint to delete a product
app.delete("/backend/deletecomputeraccessories/:id", (req, res) => {
  const { id } = req.params;

  // Fetch the product to get the image file name
  const fetchImageQuery =
    "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch product image");

    const image = results[0] && results[0].prod_img;
    if (image) {
      const imagePath = `uploads/computeraccessories/${image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the product after the image is handled
    const deleteQuery = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).send("Failed to delete product");
      res.json({ message: "Product deleted successfully" });
    });
  });
});

//////////////////edithomepage//////////////////////////////

// // Set up multer for file uploads (multiple files)
// const edithomepageStorageMultiple = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = 'uploads/edithomepage';
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}_${Date.now()}${ext}`);
//   }
// });

// const edithomepageUploadMultiple = multer({ storage: edithomepageStorageMultiple }).array('images');

// // Set up multer for file uploads (single file)
// const edithomepageStorageSingle = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = 'uploads/edithomepage';
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}_${Date.now()}${ext}`);
//   }
// });

// const edithomepageUploadSingle = multer({ storage: edithomepageStorageSingle }).single('image');

// // Route to fetch all products
// app.get('/backend/fetchedithomepage', (req, res) => {
//   const sql = 'SELECT * FROM oneclick_edithomepage ORDER By id DESC LIMIT 1 ';
//   db.query(sql, (err, results) => {
//      if (err) {
//       console.error('Error fetching product:', err);
//       return res.status(500).json({ message: 'Failed to fetch product' });
//     }

//     res.json(results);
//   });
// });

// // Endpoint to add a new product with multiple images
// app.post('/backend/edithomepage', edithomepageUploadMultiple, (req, res) => {
//   // console.log('Received files:', req.files);
//   // console.log('Request body:', req.body);

//   const { title, description, category } = req.body;
//   const images = req.files.map(file => file.filename);
//   const createdAt = new Date();

//   const sql = 'INSERT INTO oneclick_edithomepage (title, description,category, image, created_at) VALUES (?, ?, ?, ?, ?)';
//   db.query(sql, [title, description, category, images.join(','), createdAt], (err, result) => {
//     if (err) {
//       console.error('Error inserting into database:', err);
//       return res.status(500).send(err);
//     }
//     // console.log('Product added:', result);
//     res.send('Product added');
//   });
// });

// // Endpoint to update a product with a single image
// app.put('/backend/updateedithomepage/:id', edithomepageUploadSingle, (req, res) => {
//   const productId = req.params.id;
//   const { title, description, category } = req.body;
//   const image = req.file ? req.file.filename : null;

//   let sql = 'UPDATE oneclick_edithomepage SET title = ?, description = ?, category = ?, created_at = ?';
//   let values = [title, description, category, new Date()];

//   if (image) {
//     const oldImageQuery = 'SELECT image FROM oneclick_edithomepage WHERE id = ?';
//     db.query(oldImageQuery, [productId], (err, results) => {
//       if (err) {
//         // console.error('Error fetching old image:', err);
//         return res.status(500).send(err);
//       }

//       // const oldImage = results[0]?.image;
//       const oldImage = results[0] && results[0].image;

//       if (oldImage && oldImage !== image) {
//         fs.unlink(`uploads/edithomepage/${oldImage}`, (err) => {
//           if (err) {
//             console.error('Failed to delete old image:', err);
//           } else {
//             console.log('Old image deleted:', oldImage);
//           }
//         });
//       }

//       sql += ', image = ? WHERE id = ?';
//       values.push(image, productId);

//       db.query(sql, values, (err, results) => {
//         if (err) {
//           console.error('Error updating database:', err);
//           return res.status(500).send(err);
//         }
//         console.log('Product updated:', results);
//         res.json({ message: 'Product updated successfully' });
//       });
//     });
//   } else {
//     sql += ' WHERE id = ?';
//     values.push(productId);

//     db.query(sql, values, (err, results) => {
//       if (err) {
//         console.error('Error updating database:', err);
//         return res.status(500).send(err);
//       }
//       console.log('Product updated:', results);
//       res.json({ message: 'Product updated successfully' });
//     });
//   }
// });

// // Endpoint to delete a product
// app.delete('/backend/deleteedithomepage/:id', (req, res) => {
//   const { id } = req.params;

//   const fetchImageQuery = 'SELECT image FROM oneclick_edithomepage WHERE id = ?';
//   db.query(fetchImageQuery, [id], (err, results) => {
//     if (err) {
//       console.error('Error fetching image for deletion:', err);
//       return res.status(500).send(err);
//     }

//     const image = results[0] && results[0].image;
//     if (image) {
//       fs.unlink(`uploads/edithomepage/${image}`, (err) => {
//         if (err) {
//           console.error('Failed to delete image:', err);
//         } else {
//           console.log('Image deleted:', image);
//         }
//       });
//     }

//     const sql = 'DELETE FROM oneclick_edithomepage WHERE id = ?';
//     db.query(sql, [id], (err, result) => {
//       if (err) {
//         console.error('Error deleting product:', err);
//         return res.status(500).send(err);
//       }
//       console.log('Product deleted:', result);
//       res.send('Product deleted');
//     });
//   });
// });

// app.put('/backend/updateedithomepageimage/:id/:imageIndex', edithomepageUploadSingle, (req, res) => {
//   const productId = req.params.id;
//   const imageIndex = parseInt(req.params.imageIndex, 10);
//   const newImage = req.file ? req.file.filename : null;

//   if (!newImage) {
//     console.error('No image uploaded');
//     return res.status(400).json({ message: 'No image uploaded' });
//   }

//   const fetchImagesQuery = 'SELECT image FROM oneclick_edithomepage WHERE id = ?';
//   db.query(fetchImagesQuery, [productId], (err, results) => {
//     if (err) {
//       console.error('Error fetching old images:', err);
//       return res.status(500).send(err);
//     }

//     const images = results[0] && results[0].image ? results[0].image.split(',') : [];

//     if (images[imageIndex]) {
//       const oldImage = images[imageIndex];
//       fs.unlink(`uploads/edithomepage/${oldImage}`, (err) => {
//         if (err) {
//           console.error(`Failed to delete old image ${oldImage}:`, err);
//         } else {
//           console.log(`Old image deleted: ${oldImage}`);
//         }
//       });

//       images[imageIndex] = newImage;
//     } else {
//       images.push(newImage);
//     }

//     const updatedImages = images.join(',');
//     const updateQuery = 'UPDATE oneclick_edithomepage SET image = ? WHERE id = ?';
//     db.query(updateQuery, [updatedImages, productId], (err, results) => {
//       if (err) {
//         console.error('Error updating image in database:', err);
//         return res.status(500).send(err);
//       }
//       console.log('Image updated successfully:', results);
//       res.json({ updatedImages: images });
//     });
//   });
// });

// app.put('/backend/deleteedithomepageimage/:id', (req, res) => {
//   const productId = req.params.id;
//   const updatedImages = req.body.images ? req.body.images.split(',') : [];

//   // Fetch the current images from the database
//   const fetchImageQuery = 'SELECT image FROM oneclick_edithomepage WHERE id = ?';
//   db.query(fetchImageQuery, [productId], (err, results) => {
//     if (err) {
//       console.error('Error fetching image for deletion:', err);
//       return res.status(500).send(err);
//     }

//     const currentImages = results[0] && results[0].image ? results[0].image.split(',') : [];

//     // Ensure the images are correctly synchronized
//     if (currentImages.length !== updatedImages.length + 1) {
//       console.error('Image count mismatch, skipping file deletion.');
//       return res.status(400).json({ message: 'Image count mismatch, skipping file deletion.' });
//     }

//     // Find the image to delete
//     const imageToDelete = currentImages.find(img => !updatedImages.includes(img));

//     if (imageToDelete) {
//       // Delete the image file from the filesystem
//       fs.unlink(`uploads/edithomepage/${imageToDelete}`, (err) => {
//         if (err) {
//           console.error('Failed to delete image:', err);
//         } else {
//           console.log('Image deleted:', imageToDelete);
//         }
//       });
//     }

//     // Update the image array in the database
//     const sql = 'UPDATE oneclick_edithomepage SET image = ? WHERE id = ?';
//     db.query(sql, [updatedImages.join(','), productId], (err, result) => {
//       if (err) {
//         console.error('Error updating image in database:', err);
//         return res.status(500).send(err);
//       }
//       console.log('Image updated:', result);
//       res.json({ message: 'Image deleted and updated successfully' });
//     });
//   });
// });

// // server.js or routes.js (Backend API)
// app.delete('/backend/api/deletehomepagead/:id', (req, res) => {
//   const productId = req.params.id;
//   const deleteQuery = 'DELETE FROM oneclick_edithomepage WHERE id = ?';

//   db.query(deleteQuery, [productId], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Failed to delete product' });
//     }

//     return res.status(200).json({ message: 'Product deleted successfully' });
//   });
// });

/////////////new edit home page/////////////////////

// // Set up multer for file uploads (multiple files)
// const edithomepageStorageMultiple = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = 'uploads/edithomepage';
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}_${Date.now()}${ext}`);
//   }
// });

// const edithomepageUploadMultiple = multer({ storage: edithomepageStorageMultiple }).array('images');

// // Set up multer for file uploads (single file)
// const edithomepageStorageSingle = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = 'uploads/edithomepage';
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}_${Date.now()}${ext}`);
//   }
// });

// const edithomepageUploadSingle = multer({ storage: edithomepageStorageSingle }).single('image');

// // Route to fetch all products
// app.get('/backend/fetchedithomepage', (req, res) => {
//   const sql = 'SELECT * FROM oneclick_edithomepage ORDER BY id DESC';

//   console.log('Received request to fetch homepage data'); // Log the incoming request

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('Error fetching product:', err);
//       return res.status(500).json({ message: 'Failed to fetch product' });
//     }

//     console.log('Fetched results:', results); // Log the fetched results
//     res.json(results);
//   });
// });

// // Endpoint to add a new product with multiple images
// app.post('/backend/edithomepage', edithomepageUploadMultiple, (req, res) => {
//   // console.log('Received files:', req.files);
//   // console.log('Request body:', req.body);

//   const { title, description, category } = req.body;
//   const images = req.files.map(file => file.filename);
//   const createdAt = new Date();

//   const sql = 'INSERT INTO oneclick_edithomepage (title, description, category, image, created_at) VALUES (?, ?, ?, ?, ?)';
//   db.query(sql, [title, description, category, images.join(','), createdAt], (err, result) => {
//     if (err) {
//       console.error('Error inserting into database:', err);
//       return res.status(500).send(err);
//     }
//     // console.log('Product added:', result);
//     res.send('Product added');
//   });
// });

// // Endpoint to update a product with a single image
// app.put('/backend/updateedithomepage/:id', edithomepageUploadSingle, (req, res) => {
//   const productId = req.params.id;
//   const { title, description, category } = req.body;
//   const image = req.file ? req.file.filename : null;

//   let sql = 'UPDATE oneclick_edithomepage SET title = ?, description = ?, category =?, created_at = ?';
//   let values = [title, description, category, new Date()];

//   if (image) {
//     const oldImageQuery = 'SELECT image FROM oneclick_edithomepage WHERE id = ?';
//     db.query(oldImageQuery, [productId], (err, results) => {
//       if (err) {
//         // console.error('Error fetching old image:', err);
//         return res.status(500).send(err);
//       }

//       const oldImage = results[0] && results[0].image;
//       // const oldImage = results[0]?.image;

//       if (oldImage && oldImage !== image) {
//         fs.unlink(`uploads/edithomepage/${oldImage}`, (err) => {
//           if (err) {
//             console.error('Failed to delete old image:', err);
//           } else {
//             console.log('Old image deleted:', oldImage);
//           }
//         });
//       }

//       sql += ', image = ? WHERE id = ?';
//       values.push(image, productId);

//       db.query(sql, values, (err, results) => {
//         if (err) {
//           console.error('Error updating database:', err);
//           return res.status(500).send(err);
//         }
//         console.log('Product updated:', results);
//         res.json({ message: 'Product updated successfully' });
//       });
//     });
//   } else {
//     sql += ' WHERE id = ?';
//     values.push(productId);

//     db.query(sql, values, (err, results) => {
//       if (err) {
//         console.error('Error updating database:', err);
//         return res.status(500).send(err);
//       }
//       console.log('Product updated:', results);
//       res.json({ message: 'Product updated successfully' });
//     });
//   }
// });

// // // Endpoint to delete a product
// // app.delete('/backend/deleteedithomepage/:id', (req, res) => {
// //   const { id } = req.params;

// //   const fetchImageQuery = 'SELECT image FROM edithomepage WHERE id = ?';
// //   db.query(fetchImageQuery, [id], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching image for deletion:', err);
// //       return res.status(500).send(err);
// //     }

// //     const image = results[0]?.image;
// //     if (image) {
// //       fs.unlink(`uploads/edithomepage/${image}`, (err) => {
// //         if (err) {
// //           console.error('Failed to delete image:', err);
// //         } else {
// //           console.log('Image deleted:', image);
// //         }
// //       });
// //     }

// //     const sql = 'DELETE FROM edithomepage WHERE id = ?';
// //     db.query(sql, [id], (err, result) => {
// //       if (err) {
// //         console.error('Error deleting product:', err);
// //         return res.status(500).send(err);
// //       }
// //       console.log('Product deleted:', result);
// //       res.send('Product deleted');
// //     });
// //   });
// // });

// // server.js or routes.js (Backend API)
// app.delete('/backend/api/deleteedithomepage/:id', (req, res) => {
//   const productId = req.params.id;
//   const deleteQuery = 'DELETE FROM oneclick_edithomepage WHERE id = ?';

//   db.query(deleteQuery, [productId], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Failed to delete product' });
//     }

//     return res.status(200).json({ message: 'Product deleted successfully' });
//   });
// });
// app.put('/backend/updateedithomepageimage/:id', edithomepageUploadSingle, (req, res) => {
//   const productId = req.params.id;
//   const newImage = req.file ? req.file.filename : null;

//   console.log("=== Image Update Request Received ===");
//   console.log("Product ID:", productId);
//   console.log("New image filename:", newImage); // Log the new image filename

//   if (!newImage) {
//       console.error("Error: No image was uploaded.");
//       return res.status(400).json({ message: 'No image uploaded' });
//   }

//   const fetchImagesQuery = 'SELECT image FROM oneclick_edithomepage WHERE id = ?';
//   db.query(fetchImagesQuery, [productId], (err, results) => {
//       if (err) {
//           console.error("Error fetching old images from database:", err);
//           return res.status(500).json({ message: 'Failed to fetch old images' });
//       }

//       const images = results[0] && results[0].image ? results[0].image.split(',') : [];
//       console.log("Current images associated with the product:", images);

//       // Replace the first image (assuming this is the required behavior)
//       if (images.length > 0) {
//           const oldImage = images[0]; // The first image
//           fs.unlink(`uploads/edithomepage/${oldImage}`, (err) => {
//               if (err) {
//                   console.error(`Failed to delete old image (${oldImage}):`, err);
//               } else {
//                   console.log(`Old image deleted successfully: ${oldImage}`);
//               }
//           });

//           images[0] = newImage; // Replace the first image
//       } else {
//           images.push(newImage); // If no images exist, add the new one
//       }

//       const updatedImages = images.join(',');
//       console.log("Updated image list to save:", updatedImages);

//       const updateQuery = 'UPDATE oneclick_edithomepage SET image = ? WHERE id = ?';
//       db.query(updateQuery, [updatedImages, productId], (err, results) => {
//           if (err) {
//               console.error("Error updating image in the database:", err);
//               return res.status(500).json({ message: 'Failed to update image' });
//           }

//           console.log("Database update successful. Updated record:", results);
//           console.log("Updated images sent in response:", images);
//           res.json({ updatedImages: images });
//       });
//   });
// });

app.get("/backend/api/mostpopular", (req, res) => {
  console.log("Received request for most popular products");

  const categories = [
    "Mobiles",
    "Computers",
    "CCTV",
    "Printers",
    "ComputerAccessories",
    "MobileAccessories",
    "CCTVAccessories",
    "PrinterAccessories",
    "Speakers",
    "Headphones",
    "Watch",
  ];

  let query = `
    SELECT p.*, 
           CASE 
             WHEN p.category IN ('Mobiles', 'Computers') THEN m.memory
             ELSE NULL 
           END AS memory,
           CASE 
             WHEN p.category IN ('Mobiles', 'Computers') THEN m.storage
             ELSE NULL 
           END AS storage,
           CASE 
             WHEN p.category IN ('Mobiles', 'Computers') THEN m.processor
             ELSE NULL 
           END AS processor,
           CASE 
             WHEN p.category IN ('Mobiles', 'Computers') THEN m.camera
             ELSE NULL 
           END AS camera,
           CASE 
             WHEN p.category IN ('Mobiles', 'Computers') THEN m.display
             ELSE NULL 
           END AS display,
           CASE 
             WHEN p.category IN ('Mobiles', 'Computers') THEN m.battery
             ELSE NULL 
           END AS battery,
           CASE 
             WHEN p.category IN ('Mobiles', 'Computers') THEN m.os
             ELSE NULL 
           END AS os,
           CASE 
             WHEN p.category IN ('Mobiles', 'Computers') THEN m.network
             ELSE NULL 
           END AS network,
           CASE 
             WHEN p.category IN ('Mobiles', 'Computers') THEN m.others
             ELSE NULL 
           END AS others
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features m 
    ON p.prod_id = m.prod_id AND p.category IN ('Mobiles', 'Computers')
    WHERE p.category IN (${categories.map(() => "?").join(",")}) 
    AND p.productStatus = 'approved' 
    ORDER BY p.category, p.id DESC`;

  console.log("Executing query:", query);
  console.log("Query Parameters:", categories);

  db.query(query, categories, (err, products) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    console.log("Raw products fetched:", products);

    if (!products || products.length === 0) {
      console.error(
        "No products found in the database for the given categories."
      );
      return res.status(404).json({ error: "No products found" });
    }

    // Group the products by category and select one per category
    try {
      const latestProducts = categories.reduce((result, category) => {
        const product = products.find(
          (product) => product.category === category
        );
        if (product) {
          result.push(product);
        } else {
          console.log(`No product found for category: ${category}, skipping.`);
        }
        return result;
      }, []);

      console.log("Latest products:", latestProducts);

      res.json(latestProducts);
    } catch (error) {
      console.error("Error while processing products:", error);
      return res
        .status(500)
        .json({ error: "Error processing products", details: error });
    }
  });
});

// app.put('/backend/deleteedithomepageimage/:id', (req, res) => {
//   const productId = req.params.id;
//   const updatedImages = req.body.images ? req.body.images.split(',') : [];

//   // Fetch the current images from the database
//   const fetchImageQuery = 'SELECT image FROM oneclick_edithomepage WHERE id = ?';
//   db.query(fetchImageQuery, [productId], (err, results) => {
//     if (err) {
//       console.error('Error fetching image for deletion:', err);
//       return res.status(500).send(err);
//     }

//     const currentImages = results[0] && results[0].image ? results[0].image.split(',') : [];

//     // Ensure the images are correctly synchronized
//     if (currentImages.length !== updatedImages.length + 1) {
//       console.error('Image count mismatch, skipping file deletion.');
//       return res.status(400).json({ message: 'Image count mismatch, skipping file deletion.' });
//     }

//     // Find the image to delete
//     const imageToDelete = currentImages.find(img => !updatedImages.includes(img));

//     if (imageToDelete) {
//       // Delete the image file from the filesystem
//       fs.unlink(`uploads/edithomepage/${imageToDelete}`, (err) => {
//         if (err) {
//           console.error('Failed to delete image:', err);
//         } else {
//           console.log('Image deleted:', imageToDelete);
//         }
//       });
//     }

//     // Update the image array in the database
//     const sql = 'UPDATE oneclick_edithomepage SET image = ? WHERE id = ?';
//     db.query(sql, [updatedImages.join(','), productId], (err, result) => {
//       if (err) {
//         console.error('Error updating image in database:', err);
//         return res.status(500).send(err);
//       }
//       console.log('Image updated:', result);
//       res.json({ message: 'Image deleted and updated successfully' });
//     });
//   });
// });
// /////////////////////////////////////////

// // Configure multer for file uploads
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/edithomepage');
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + path.extname(file.originalname));
//     }
//   })
// });

// app.post('/backend/uploadimage/:id', edithomepageUploadMultiple, (req, res) => {
//   const productId = req.params.id;
//   console.log('productId', productId);

//   const images = req.files.map(file => file.filename); // Get filenames from uploaded files

//   // Ensure that the images array is not empty
//   if (images.length === 0) {
//     return res.status(400).send('No images were uploaded.');
//   }

//   // Insert new images into the database
//   const sql = 'SELECT image FROM oneclick_edithomepage WHERE id = ?';
//   db.query(sql, [productId], (err, result) => {
//     if (err) {
//       console.error('Error retrieving product from database:', err);
//       return res.status(500).send(err);
//     }

//     let existingImages = [];
//     if (result.length > 0) {
//       existingImages = result[0].image ? result[0].image.split(',') : [];
//     }

//     // Add new images to existing images
//     const updatedImages = [...existingImages, ...images];

//     // Update the database with the new list of images
//     const updateSql = 'UPDATE oneclick_edithomepage SET image = ? WHERE id = ?';
//     db.query(updateSql, [updatedImages.join(','), productId], (err, result) => {
//       if (err) {
//         console.error('Error updating database:', err);
//         return res.status(500).send(err);
//       }
//       res.send('Images uploaded successfully');
//     });
//   });
// });

////////////////updated new edit home page //////////////////////

// Serve static files (for serving images)
app.use(
  "/backend/uploads/edithomepage",
  express.static(path.join(__dirname, "uploads/edithomepage"))
);

// Multer setup for image upload
const edithomepagestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/edithomepage/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload13 = multer({
  storage: edithomepagestorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
});
// Fetch all single ad page images
app.get("/backend/fetchedithomepage", (req, res) => {
  const sql = "SELECT * FROM oneclick_edithomepage ORDER BY id DESC";

  // console.log('Received request to fetch homepage data'); // Log the incoming request

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    console.log("Fetched results:", results); // Log the fetched results
    res.json(results);
  });
});

// Add a new image
app.post("/backend/edithomepage", upload13.single("image"), (req, res) => {
  const { category } = req.body; // Get the category from the request body
  if (!req.file || !category) {
    return res.status(400).json({ error: "Image and category are required" });
  }

  const image = req.file.filename;
  const query =
    "INSERT INTO oneclick_edithomepage (image, category) VALUES (?, ?)";
  db.query(query, [image, category], (err, result) => {
    if (err) {
      console.error("Error inserting image:", err);
      res.status(500).json({ error: "Failed to add image" });
    } else {
      res.json({ message: "Image added successfully", id: result.insertId });
    }
  });
});
app.put(
  "/backend/updateedithomepageimage/:id",
  upload13.single("image"),
  (req, res) => {
    const { id } = req.params;
    const { category } = req.body; // Get the new category from the request body

    // Initialize variables for new image and category updates
    let newImage = req.file ? req.file.filename : null; // Set newImage if a new file is uploaded
    let updateFields = [];
    let updateValues = [];

    // Check if both image and category are provided
    if (!newImage && !category) {
      return res.status(400).json({ error: "Image or category is required" });
    }

    const selectQuery = "SELECT image FROM oneclick_edithomepage WHERE id = ?";
    db.query(selectQuery, [id], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error fetching image:", selectErr);
        return res.status(500).json({ error: "Failed to fetch current image" });
      }

      if (selectResult.length === 0) {
        return res.status(404).json({ error: "Image not found" });
      }

      const oldImage = selectResult[0].image;

      // Prepare update query based on fields that need to be updated
      if (newImage) {
        updateFields.push("image = ?");
        updateValues.push(newImage);
      }

      if (category) {
        updateFields.push("category = ?");
        updateValues.push(category);
      }

      // Always add the ID at the end of update values
      updateValues.push(id);

      const updateQuery = `UPDATE oneclick_edithomepage SET ${updateFields.join(
        ", "
      )} WHERE id = ?`;

      db.query(updateQuery, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating image or category:", updateErr);
          return res
            .status(500)
            .json({ error: "Failed to update image or category" });
        }

        // Delete the old image if a new image has been uploaded
        if (newImage) {
          const oldImagePath = path.join(
            __dirname,
            "uploads",
            "edithomepage",
            oldImage
          );
          fs.unlink(oldImagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting old image:", unlinkErr);
            }
          });
        }

        res.json({
          message: "Image and/or category updated successfully",
          updatedImage: newImage,
        });
      });
    });
  }
);

// Delete an image
app.delete("/backend/deleteedithomepageimage/:id", (req, res) => {
  const { id } = req.params;

  // First, fetch the image filename from the database
  const selectQuery = "SELECT image FROM oneclick_edithomepage WHERE id = ?";
  db.query(selectQuery, [id], (selectErr, selectResult) => {
    if (selectErr) {
      console.error("Error fetching image:", selectErr);
      return res.status(500).json({ error: "Failed to fetch image" });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const image = selectResult[0].image;

    // Delete the image file from the folder
    const imagePath = path.join(__dirname, "uploads", "edithomepage", image);
    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image file:", unlinkErr);
        return res.status(500).json({ error: "Failed to delete image file" });
      }

      // Delete the entry from the database
      const deleteQuery = "DELETE FROM oneclick_edithomepage WHERE id = ?";
      db.query(deleteQuery, [id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error("Error deleting image from database:", deleteErr);
          return res
            .status(500)
            .json({ error: "Failed to delete image from database" });
        }

        res.json({ message: "Image deleted successfully" });
      });
    });
  });
});

////////////////////doubleadpage/////////////////////////////////

// // Set up multer for file uploads (multiple files)
// const doubleadpageStorageMultiple = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = 'uploads/doubleadpage';
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}_${Date.now()}${ext}`);
//   }
// });

// const doubleadpageUploadMultiple = multer({ storage: doubleadpageStorageMultiple }).array('images');

// // Set up multer for file uploads (single file)
// const doubleadpageStorageSingle = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = 'uploads/doubleadpage';
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}_${Date.now()}${ext}`);
//   }
// });

// const doubleadpageUploadSingle = multer({ storage: doubleadpageStorageSingle }).single('image');

// // Route to fetch all products
// app.get('/backend/fetchdoubleadpage', (req, res) => {
//   const sql = 'SELECT * FROM oneclick_doubleadpage ORDER BY id DESC LIMIT 4 ';
//   db.query(sql, (err, results) => {
//      if (err) {
//       console.error('Error fetching product:', err);
//       return res.status(500).json({ message: 'Failed to fetch product' });
//     }

//     res.json(results);
//   });
// });

// // Endpoint to add a new product with multiple images
// app.post('/backend/doubleadpage', doubleadpageUploadMultiple, (req, res) => {
//   // console.log('Received files:', req.files);
//   // console.log('Request body:', req.body);

//   const { title, description, category } = req.body;
//   const images = req.files.map(file => file.filename);
//   const createdAt = new Date();

//   const sql = 'INSERT INTO oneclick_doubleadpage (title, description, category, image, created_at) VALUES (?, ?, ?, ?, ?)';
//   db.query(sql, [title, description, category, images.join(','), createdAt], (err, result) => {
//     if (err) {
//       console.error('Error inserting into database:', err);
//       return res.status(500).send(err);
//     }
//     // console.log('Product added:', result);
//     res.send('Product added');
//   });
// });

// // Endpoint to update a product with a single image
// app.put('/backend/updatedoubleadpage/:id', doubleadpageUploadSingle, (req, res) => {
//   const productId = req.params.id;
//   const { title, description, category } = req.body;
//   const image = req.file ? req.file.filename : null;

//   let sql = 'UPDATE oneclick_doubleadpage SET title = ?, description = ?, category =?, created_at = ?';
//   let values = [title, description, category, new Date()];

//   if (image) {
//     const oldImageQuery = 'SELECT image FROM oneclick_doubleadpage WHERE id = ?';
//     db.query(oldImageQuery, [productId], (err, results) => {
//       if (err) {
//         // console.error('Error fetching old image:', err);
//         return res.status(500).send(err);
//       }

//       const oldImage = results[0] && results[0].image;
//       // const oldImage = results[0]?.image;

//       if (oldImage && oldImage !== image) {
//         fs.unlink(`uploads/doubleadpage/${oldImage}`, (err) => {
//           if (err) {
//             console.error('Failed to delete old image:', err);
//           } else {
//             console.log('Old image deleted:', oldImage);
//           }
//         });
//       }

//       sql += ', image = ? WHERE id = ?';
//       values.push(image, productId);

//       db.query(sql, values, (err, results) => {
//         if (err) {
//           console.error('Error updating database:', err);
//           return res.status(500).send(err);
//         }
//         console.log('Product updated:', results);
//         res.json({ message: 'Product updated successfully' });
//       });
//     });
//   } else {
//     sql += ' WHERE id = ?';
//     values.push(productId);

//     db.query(sql, values, (err, results) => {
//       if (err) {
//         console.error('Error updating database:', err);
//         return res.status(500).send(err);
//       }
//       console.log('Product updated:', results);
//       res.json({ message: 'Product updated successfully' });
//     });
//   }
// });

// // // Endpoint to delete a product
// // app.delete('/backend/deletedoubleadpage/:id', (req, res) => {
// //   const { id } = req.params;

// //   const fetchImageQuery = 'SELECT image FROM doubleadpage WHERE id = ?';
// //   db.query(fetchImageQuery, [id], (err, results) => {
// //     if (err) {
// //       console.error('Error fetching image for deletion:', err);
// //       return res.status(500).send(err);
// //     }

// //     const image = results[0]?.image;
// //     if (image) {
// //       fs.unlink(`uploads/doubleadpage/${image}`, (err) => {
// //         if (err) {
// //           console.error('Failed to delete image:', err);
// //         } else {
// //           console.log('Image deleted:', image);
// //         }
// //       });
// //     }

// //     const sql = 'DELETE FROM doubleadpage WHERE id = ?';
// //     db.query(sql, [id], (err, result) => {
// //       if (err) {
// //         console.error('Error deleting product:', err);
// //         return res.status(500).send(err);
// //       }
// //       console.log('Product deleted:', result);
// //       res.send('Product deleted');
// //     });
// //   });
// // });

// // server.js or routes.js (Backend API)
// app.delete('/backend/api/deletedoubleadpage/:id', (req, res) => {
//   const productId = req.params.id;
//   const deleteQuery = 'DELETE FROM oneclick_doubleadpage WHERE id = ?';

//   db.query(deleteQuery, [productId], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Failed to delete product' });
//     }

//     return res.status(200).json({ message: 'Product deleted successfully' });
//   });
// });

// app.put('/backend/updatedoubleadpageimage/:id/:imageIndex', doubleadpageUploadSingle, (req, res) => {
//   const productId = req.params.id;
//   const imageIndex = parseInt(req.params.imageIndex, 10);
//   const newImage = req.file ? req.file.filename : null;

//   if (!newImage) {
//     console.error('No image uploaded');
//     return res.status(400).json({ message: 'No image uploaded' });
//   }

//   const fetchImagesQuery = 'SELECT image FROM oneclick_doubleadpage WHERE id = ?';
//   db.query(fetchImagesQuery, [productId], (err, results) => {
//     if (err) {
//       console.error('Error fetching old images:', err);
//       return res.status(500).send(err);
//     }

//     const images = results[0] && results[0].image ? results[0].image.split(',') : [];

//     if (images[imageIndex]) {
//       const oldImage = images[imageIndex];
//       fs.unlink(`uploads/doubleadpage/${oldImage}`, (err) => {
//         if (err) {
//           console.error(`Failed to delete old image ${oldImage}:`, err);
//         } else {
//           console.log(`Old image deleted: ${oldImage}`);
//         }
//       });

//       images[imageIndex] = newImage;
//     } else {
//       images.push(newImage);
//     }

//     const updatedImages = images.join(',');
//     const updateQuery = 'UPDATE oneclick_doubleadpage SET image = ? WHERE id = ?';
//     db.query(updateQuery, [updatedImages, productId], (err, results) => {
//       if (err) {
//         console.error('Error updating image in database:', err);
//         return res.status(500).send(err);
//       }
//       console.log('Image updated successfully:', results);
//       res.json({ updatedImages: images });
//     });
//   });
// });

// app.put('/backend/deletedoubleadpageimage/:id', (req, res) => {
//   const productId = req.params.id;
//   const updatedImages = req.body.images ? req.body.images.split(',') : [];

//   // Fetch the current images from the database
//   const fetchImageQuery = 'SELECT image FROM oneclick_doubleadpage WHERE id = ?';
//   db.query(fetchImageQuery, [productId], (err, results) => {
//     if (err) {
//       console.error('Error fetching image for deletion:', err);
//       return res.status(500).send(err);
//     }

//     const currentImages = results[0] && results[0].image ? results[0].image.split(',') : [];

//     // Ensure the images are correctly synchronized
//     if (currentImages.length !== updatedImages.length + 1) {
//       console.error('Image count mismatch, skipping file deletion.');
//       return res.status(400).json({ message: 'Image count mismatch, skipping file deletion.' });
//     }

//     // Find the image to delete
//     const imageToDelete = currentImages.find(img => !updatedImages.includes(img));

//     if (imageToDelete) {
//       // Delete the image file from the filesystem
//       fs.unlink(`uploads/doubleadpage/${imageToDelete}`, (err) => {
//         if (err) {
//           console.error('Failed to delete image:', err);
//         } else {
//           console.log('Image deleted:', imageToDelete);
//         }
//       });
//     }

//     // Update the image array in the database
//     const sql = 'UPDATE oneclick_doubleadpage SET image = ? WHERE id = ?';
//     db.query(sql, [updatedImages.join(','), productId], (err, result) => {
//       if (err) {
//         console.error('Error updating image in database:', err);
//         return res.status(500).send(err);
//       }
//       console.log('Image updated:', result);
//       res.json({ message: 'Image deleted and updated successfully' });
//     });
//   });
// });

/////////// new doubleadpage ///////////////////////////

// Serve static files (for serving images)
app.use(
  "/backend/uploads/doubleadpage",
  express.static(path.join(__dirname, "uploads/doubleadpage"))
);

// Multer setup for image upload
const doubleadstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/doubleadpage/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const doubleadupload = multer({ storage: doubleadstorage });

app.get("/backend/fetchdoubleadpage", (req, res) => {
  const sql = "SELECT * FROM oneclick_doubleadpage ORDER BY id DESC LIMIT 4 ";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    res.json(results);
  });
});

// Add a new image
app.post(
  "/backend/doubleadpage",
  doubleadupload.single("image"),
  (req, res) => {
    const { category } = req.body; // Get the category from the request body
    if (!req.file || !category) {
      return res.status(400).json({ error: "Image and category are required" });
    }

    const image = req.file.filename;
    const query =
      "INSERT INTO oneclick_doubleadpage (image, category) VALUES (?, ?)";
    db.query(query, [image, category], (err, result) => {
      if (err) {
        console.error("Error inserting image:", err);
        res.status(500).json({ error: "Failed to add image" });
      } else {
        res.json({ message: "Image added successfully", id: result.insertId });
      }
    });
  }
);

app.put(
  "/backend/updatedoubleadpageimage/:id",
  doubleadupload.single("image"),
  (req, res) => {
    const { id } = req.params;
    const { category } = req.body; // Get the new category from the request body

    // Initialize variables for new image and category updates
    let newImage = req.file ? req.file.filename : null; // Set newImage if a new file is uploaded
    let updateFields = [];
    let updateValues = [];

    // Check if both image and category are provided
    if (!newImage && !category) {
      return res.status(400).json({ error: "Image or category is required" });
    }

    const selectQuery = "SELECT image FROM oneclick_doubleadpage WHERE id = ?";
    db.query(selectQuery, [id], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error fetching image:", selectErr);
        return res.status(500).json({ error: "Failed to fetch current image" });
      }

      if (selectResult.length === 0) {
        return res.status(404).json({ error: "Image not found" });
      }

      const oldImage = selectResult[0].image;

      // Prepare update query based on fields that need to be updated
      if (newImage) {
        updateFields.push("image = ?");
        updateValues.push(newImage);
      }

      if (category) {
        updateFields.push("category = ?");
        updateValues.push(category);
      }

      // Always add the ID at the end of update values
      updateValues.push(id);

      const updateQuery = `UPDATE oneclick_doubleadpage SET ${updateFields.join(
        ", "
      )} WHERE id = ?`;

      db.query(updateQuery, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating image or category:", updateErr);
          return res
            .status(500)
            .json({ error: "Failed to update image or category" });
        }

        // Delete the old image if a new image has been uploaded
        if (newImage) {
          const oldImagePath = path.join(
            __dirname,
            "uploads",
            "doubleadpage",
            oldImage
          );
          fs.unlink(oldImagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting old image:", unlinkErr);
            }
          });
        }

        res.json({
          message: "Image and/or category updated successfully",
          updatedImage: newImage,
        });
      });
    });
  }
);

// Delete an image
app.delete("/backend/deletedoubleadpageimage/:id", (req, res) => {
  const { id } = req.params;

  // First, fetch the image filename from the database
  const selectQuery = "SELECT image FROM oneclick_doubleadpage WHERE id = ?";
  db.query(selectQuery, [id], (selectErr, selectResult) => {
    if (selectErr) {
      console.error("Error fetching image:", selectErr);
      return res.status(500).json({ error: "Failed to fetch image" });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const image = selectResult[0].image;

    // Delete the image file from the folder
    const imagePath = path.join(__dirname, "uploads", "doubleadpage", image);
    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image file:", unlinkErr);
        return res.status(500).json({ error: "Failed to delete image file" });
      }

      // Delete the entry from the database
      const deleteQuery = "DELETE FROM oneclick_doubleadpage WHERE id = ?";
      db.query(deleteQuery, [id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error("Error deleting image from database:", deleteErr);
          return res
            .status(500)
            .json({ error: "Failed to delete image from database" });
        }

        res.json({ message: "Image deleted successfully" });
      });
    });
  });
});

//////////////////computersoffers page ////////////////

// Set up multer for file uploads (multiple files)
const offerspageStorageMultiple = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/offerspage";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const offerspageUploadMultiple = multer({
  storage: offerspageStorageMultiple,
}).array("images");

// Set up multer for file uploads (single file)
const offerspageStorageSingle = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/offerspage";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const offerspageUploadSingle = multer({
  storage: offerspageStorageSingle,
}).single("image");

// Route to fetch all products
app.get("/backend/fetchcomputersofferspage", (req, res) => {
  const sql =
    'SELECT * FROM oneclick_offerspage WHERE category="computers" ORDER BY id DESC ';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    res.json(results);
  });
});

// Endpoint to add a new product with multiple images
app.post(
  "/backend/computersofferspage",
  offerspageUploadMultiple,
  (req, res) => {
    // console.log('Received files:', req.files);
    // console.log('Request body:', req.body);

    const { offer, brand_name, title, description } = req.body;
    const images = req.files.map((file) => file.filename);
    // const createdAt = new Date();

    const sql =
      "INSERT INTO oneclick_offerspage (offer, brand_name, title, description, category, image) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [offer, brand_name, title, description, "computers", images.join(",")],
      (err, result) => {
        if (err) {
          console.error("Error inserting into database:", err);
          return res.status(500).send(err);
        }
        // console.log('Product added:', result);
        res.send("Product added");
      }
    );
  }
);

// Endpoint to update a product with a single image
app.put(
  "/backend/computersupdateofferspage/:id",
  offerspageUploadSingle,
  (req, res) => {
    const productId = req.params.id;
    const { title, description, brand_name, offer } = req.body;
    const image = req.file ? req.file.filename : null;

    let sql =
      "UPDATE oneclick_offerspage SET title = ?, description = ?, brand_name =?, offer = ? ";
    let values = [title, description, brand_name, offer];

    if (image) {
      const oldImageQuery =
        "SELECT image FROM oneclick_offerspage WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) {
          // console.error('Error fetching old image:', err);
          return res.status(500).send(err);
        }

        const oldImage = results[0] && results[0].image;
        // const oldImage = results[0]?.image;

        if (oldImage && oldImage !== image) {
          fs.unlink(`uploads/offerspage/${oldImage}`, (err) => {
            if (err) {
              console.error("Failed to delete old image:", err);
            } else {
              console.log("Old image deleted:", oldImage);
            }
          });
        }

        sql += ", image = ? WHERE id = ?";
        values.push(image, productId);

        db.query(sql, values, (err, results) => {
          if (err) {
            console.error("Error updating database:", err);
            return res.status(500).send(err);
          }
          console.log("Product updated:", results);
          res.json({ message: "Product updated successfully" });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) {
          console.error("Error updating database:", err);
          return res.status(500).send(err);
        }
        console.log("Product updated:", results);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// server.js or routes.js (Backend API)
app.delete("/backend/api/deletecomputersofferspage/:id", (req, res) => {
  const productId = req.params.id;
  const deleteQuery = "DELETE FROM oneclick_offerspage WHERE id = ?";

  db.query(deleteQuery, [productId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete product" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  });
});

app.put(
  "/backend/updatecomputersofferspageimage/:id",
  offerspageUploadSingle,
  (req, res) => {
    const productId = req.params.id;
    const newImage = req.file ? req.file.filename : null;

    console.log(
      `Received request to update image for product ID: ${productId}`
    );

    if (!newImage) {
      console.error("No image uploaded");
      return res.status(400).json({ message: "No image uploaded" });
    }

    const fetchImagesQuery =
      "SELECT image FROM oneclick_offerspage WHERE id = ?";
    db.query(fetchImagesQuery, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching old images:", err);
        return res.status(500).send(err);
      }

      const images =
        results[0] && results[0].image ? results[0].image.split(",") : [];
      console.log(`Current images for product ID ${productId}:`, images);

      // Delete old images if they exist
      images.forEach((oldImage) => {
        const oldImagePath = `uploads/offerspage/${oldImage}`;
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(`Failed to delete old image ${oldImage}:`, err);
          } else {
            console.log(`Old image deleted: ${oldImage}`);
          }
        });
      });

      // Set the new image (or reset images to only the new image)
      const updatedImages = newImage; // You may use newImage as a string or modify this as needed
      const updateQuery =
        "UPDATE oneclick_offerspage SET image = ? WHERE id = ?";
      db.query(updateQuery, [updatedImages, productId], (err, results) => {
        if (err) {
          console.error("Error updating image in database:", err);
          return res.status(500).send(err);
        }
        console.log("Image updated successfully:", results);
        res.json({ updatedImages: updatedImages });
      });
    });
  }
);

app.put("/backend/deletecomputersofferspageimage/:id", (req, res) => {
  const productId = req.params.id;
  const updatedImages = req.body.images ? req.body.images.split(",") : [];

  // Fetch the current images from the database
  const fetchImageQuery = "SELECT image FROM oneclick_offerspage WHERE id = ?";
  db.query(fetchImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching image for deletion:", err);
      return res.status(500).send(err);
    }

    const currentImages =
      results[0] && results[0].image ? results[0].image.split(",") : [];

    // Ensure the images are correctly synchronized
    if (currentImages.length !== updatedImages.length + 1) {
      console.error("Image count mismatch, skipping file deletion.");
      return res
        .status(400)
        .json({ message: "Image count mismatch, skipping file deletion." });
    }

    // Find the image to delete
    const imageToDelete = currentImages.find(
      (img) => !updatedImages.includes(img)
    );

    if (imageToDelete) {
      // Delete the image file from the filesystem
      fs.unlink(`uploads/offerspage/${imageToDelete}`, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imageToDelete);
        }
      });
    }

    // Update the image array in the database
    const sql = "UPDATE oneclick_offerspage SET image = ? WHERE id = ?";
    db.query(sql, [updatedImages.join(","), productId], (err, result) => {
      if (err) {
        console.error("Error updating image in database:", err);
        return res.status(500).send(err);
      }
      console.log("Image updated:", result);
      res.json({ message: "Image deleted and updated successfully" });
    });
  });
});
/////////////////////// end//////////////////

// Set up multer for file uploads (multiple files)
const mobileofferspageStorageMultiple = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/offerspage";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const mobileofferspageUploadMultiple = multer({
  storage: mobileofferspageStorageMultiple,
}).array("images");

// Set up multer for file uploads (single file)
const mobileofferspageStorageSingle = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/offerspage";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const mobileofferspageUploadSingle = multer({
  storage: mobileofferspageStorageSingle,
}).single("image");

// Route to fetch all products
app.get("/backend/fetchmobileofferspage", (req, res) => {
  const sql =
    'SELECT * FROM oneclick_offerspage WHERE category="mobiles" ORDER BY id DESC LIMIT 2 ';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    res.json(results);
  });
});


// Route to fetch all products
app.get("/backend/fetchproductdetailsofferspage", (req, res) => {
  const sql =
    'SELECT * FROM oneclick_offerspage WHERE category="product_details" ORDER BY id DESC LIMIT 2 ';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    res.json(results);
  });
});

// Endpoint to add a new product with multiple images
app.post(
  "/backend/add-productdetails-offerspage-banner",
  mobileofferspageUploadMultiple,
  (req, res) => {
    // console.log('Received files:', req.files);
    // console.log('Request body:', req.body);

    const { offer, brand_name, title, description } = req.body;
    const images = req.files.map((file) => file.filename);
    // const createdAt = new Date();

    const sql =
      "INSERT INTO oneclick_offerspage (offer, brand_name, title, description, category, image) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [offer, brand_name, title, description, "product_details", images.join(",")],
      (err, result) => {
        if (err) {
          console.error("Error inserting into database:", err);
          return res.status(500).send(err);
        }
        // console.log('Product added:', result);
        res.send("Product added");
      }
    );
  }
);

// Endpoint to update a product with a single image
app.put(
  "/backend/mobileupdateofferspage/:id",
  mobileofferspageUploadSingle,
  (req, res) => {
    const productId = req.params.id;
    const { title, description, brand_name, offer } = req.body;
    const image = req.file ? req.file.filename : null;

    let sql =
      "UPDATE oneclick_offerspage SET title = ?, description = ?, brand_name =?, offer = ? ";
    let values = [title, description, brand_name, offer];

    if (image) {
      const oldImageQuery =
        "SELECT image FROM oneclick_offerspage WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) {
          // console.error('Error fetching old image:', err);
          return res.status(500).send(err);
        }

        const oldImage = results[0] && results[0].image;
        // const oldImage = results[0]?.image;

        if (oldImage && oldImage !== image) {
          fs.unlink(`uploads/offerspage/${oldImage}`, (err) => {
            if (err) {
              console.error("Failed to delete old image:", err);
            } else {
              console.log("Old image deleted:", oldImage);
            }
          });
        }

        sql += ", image = ? WHERE id = ?";
        values.push(image, productId);

        db.query(sql, values, (err, results) => {
          if (err) {
            console.error("Error updating database:", err);
            return res.status(500).send(err);
          }
          console.log("Product updated:", results);
          res.json({ message: "Product updated successfully" });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) {
          console.error("Error updating database:", err);
          return res.status(500).send(err);
        }
        console.log("Product updated:", results);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// server.js or routes.js (Backend API)
app.delete("/backend/api/deletemobileofferspage/:id", (req, res) => {
  const productId = req.params.id;
  const deleteQuery = "DELETE FROM oneclick_offerspage WHERE id = ?";

  db.query(deleteQuery, [productId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete product" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  });
});

app.put(
  "/backend/updatemobileofferspageimage/:id",
  mobileofferspageUploadSingle,
  (req, res) => {
    const productId = req.params.id;
    const newImage = req.file ? req.file.filename : null;

    console.log(
      `Received request to update image for product ID: ${productId}`
    );

    if (!newImage) {
      console.error("No image uploaded");
      return res.status(400).json({ message: "No image uploaded" });
    }

    const fetchImagesQuery =
      "SELECT image FROM oneclick_offerspage WHERE id = ?";
    db.query(fetchImagesQuery, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching old images:", err);
        return res.status(500).send(err);
      }

      const images =
        results[0] && results[0].image ? results[0].image.split(",") : [];
      console.log(`Current images for product ID ${productId}:`, images);

      // Delete old images if they exist
      images.forEach((oldImage) => {
        const oldImagePath = `uploads/offerspage/${oldImage}`;
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(`Failed to delete old image ${oldImage}:`, err);
          } else {
            console.log(`Old image deleted: ${oldImage}`);
          }
        });
      });

      // Set the new image (or reset images to only the new image)
      const updatedImages = newImage; // You may use newImage as a string or modify this as needed
      const updateQuery =
        "UPDATE oneclick_offerspage SET image = ? WHERE id = ?";
      db.query(updateQuery, [updatedImages, productId], (err, results) => {
        if (err) {
          console.error("Error updating image in database:", err);
          return res.status(500).send(err);
        }
        console.log("Image updated successfully:", results);
        res.json({ updatedImages: updatedImages });
      });
    });
  }
);

app.put("/backend/deletemobileofferspageimage/:id", (req, res) => {
  const productId = req.params.id;
  const updatedImages = req.body.images ? req.body.images.split(",") : [];

  // Fetch the current images from the database
  const fetchImageQuery = "SELECT image FROM oneclick_offerspage WHERE id = ?";
  db.query(fetchImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching image for deletion:", err);
      return res.status(500).send(err);
    }

    const currentImages =
      results[0] && results[0].image ? results[0].image.split(",") : [];

    // Ensure the images are correctly synchronized
    if (currentImages.length !== updatedImages.length + 1) {
      console.error("Image count mismatch, skipping file deletion.");
      return res
        .status(400)
        .json({ message: "Image count mismatch, skipping file deletion." });
    }

    // Find the image to delete
    const imageToDelete = currentImages.find(
      (img) => !updatedImages.includes(img)
    );

    if (imageToDelete) {
      // Delete the image file from the filesystem
      fs.unlink(`uploads/offerspage/${imageToDelete}`, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imageToDelete);
        }
      });
    }

    // Update the image array in the database
    const sql = "UPDATE oneclick_offerspage SET image = ? WHERE id = ?";
    db.query(sql, [updatedImages.join(","), productId], (err, result) => {
      if (err) {
        console.error("Error updating image in database:", err);
        return res.status(500).send(err);
      }
      console.log("Image updated:", result);
      res.json({ message: "Image deleted and updated successfully" });
    });
  });
});
//////////////////end////////////////////////////////

// Set up multer for file uploads (multiple files)
const cctvofferspageStorageMultiple = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/offerspage";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const cctvofferspageUploadMultiple = multer({
  storage: cctvofferspageStorageMultiple,
}).array("images");

// Set up multer for file uploads (single file)
const cctvofferspageStorageSingle = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/offerspage";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
   const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);

    // Remove spaces and special characters from filename
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    cb(null, `${sanitizedFileName}${ext}`); // Store image without timestamp
  },
});

const cctvofferspageUploadSingle = multer({
  storage: cctvofferspageStorageSingle,
}).single("image");

// Route to fetch all products
app.get("/backend/fetchcctvofferspage", (req, res) => {
  const sql =
    'SELECT * FROM oneclick_offerspage WHERE category="cctv" ORDER BY id DESC ';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    res.json(results);
  });
});

// Route to fetch all products
app.get("/backend/productdetailsofferspage", (req, res) => {
  const sql = "SELECT * FROM oneclick_offerspage ORDER BY id DESC ";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    res.json(results);
  });
});

// Endpoint to add a new product with multiple images
app.post(
  "/backend/cctvofferspage",
  cctvofferspageUploadMultiple,
  (req, res) => {
    // console.log('Received files:', req.files);
    // console.log('Request body:', req.body);

    const { offer, brand_name, title, description } = req.body;
    const images = req.files.map((file) => file.filename);
    // const createdAt = new Date();

    const sql =
      "INSERT INTO oneclick_offerspage (offer, brand_name, title, description, category, image) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [offer, brand_name, title, description, "cctv", images.join(",")],
      (err, result) => {
        if (err) {
          console.error("Error inserting into database:", err);
          return res.status(500).send(err);
        }
        // console.log('Product added:', result);
        res.send("Product added");
      }
    );
  }
);

// Endpoint to update a product with a single image
app.put(
  "/backend/cctvupdateofferspage/:id",
  cctvofferspageUploadSingle,
  (req, res) => {
    const productId = req.params.id;
    const { title, description, brand_name, offer } = req.body;
    const image = req.file ? req.file.filename : null;

    let sql =
      "UPDATE oneclick_offerspage SET title = ?, description = ?, brand_name =?, offer = ? ";
    let values = [title, description, brand_name, offer];

    if (image) {
      const oldImageQuery =
        "SELECT image FROM oneclick_offerspage WHERE id = ?";
      db.query(oldImageQuery, [productId], (err, results) => {
        if (err) {
          // console.error('Error fetching old image:', err);
          return res.status(500).send(err);
        }

        const oldImage = results[0] && results[0].image;
        // const oldImage = results[0]?.image;

        if (oldImage && oldImage !== image) {
          fs.unlink(`uploads/offerspage/${oldImage}`, (err) => {
            if (err) {
              console.error("Failed to delete old image:", err);
            } else {
              console.log("Old image deleted:", oldImage);
            }
          });
        }

        sql += ", image = ? WHERE id = ?";
        values.push(image, productId);

        db.query(sql, values, (err, results) => {
          if (err) {
            console.error("Error updating database:", err);
            return res.status(500).send(err);
          }
          console.log("Product updated:", results);
          res.json({ message: "Product updated successfully" });
        });
      });
    } else {
      sql += " WHERE id = ?";
      values.push(productId);

      db.query(sql, values, (err, results) => {
        if (err) {
          console.error("Error updating database:", err);
          return res.status(500).send(err);
        }
        console.log("Product updated:", results);
        res.json({ message: "Product updated successfully" });
      });
    }
  }
);

// server.js or routes.js (Backend API)
app.delete("/backend/api/deletecctvofferspage/:id", (req, res) => {
  const productId = req.params.id;
  const deleteQuery = "DELETE FROM oneclick_offerspage WHERE id = ?";

  db.query(deleteQuery, [productId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete product" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  });
});

app.put(
  "/backend/updatecctvofferspageimage/:id",
  cctvofferspageUploadSingle,
  (req, res) => {
    const productId = req.params.id;
    const newImage = req.file ? req.file.filename : null;

    console.log(
      `Received request to update image for product ID: ${productId}`
    );

    if (!newImage) {
      console.error("No image uploaded");
      return res.status(400).json({ message: "No image uploaded" });
    }

    const fetchImagesQuery =
      "SELECT image FROM oneclick_offerspage WHERE id = ?";
    db.query(fetchImagesQuery, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching old images:", err);
        return res.status(500).send(err);
      }

      const images =
        results[0] && results[0].image ? results[0].image.split(",") : [];
      console.log(`Current images for product ID ${productId}:`, images);

      // Delete old images if they exist
      images.forEach((oldImage) => {
        const oldImagePath = `uploads/offerspage/${oldImage}`;
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(`Failed to delete old image ${oldImage}:`, err);
          } else {
            console.log(`Old image deleted: ${oldImage}`);
          }
        });
      });

      // Set the new image (or reset images to only the new image)
      const updatedImages = newImage; // You may use newImage as a string or modify this as needed
      const updateQuery =
        "UPDATE oneclick_offerspage SET image = ? WHERE id = ?";
      db.query(updateQuery, [updatedImages, productId], (err, results) => {
        if (err) {
          console.error("Error updating image in database:", err);
          return res.status(500).send(err);
        }
        console.log("Image updated successfully:", results);
        res.json({ updatedImages: updatedImages });
      });
    });
  }
);

app.put("/backend/deletecctvofferspageimage/:id", (req, res) => {
  const productId = req.params.id;
  const updatedImages = req.body.images ? req.body.images.split(",") : [];

  // Fetch the current images from the database
  const fetchImageQuery = "SELECT image FROM oneclick_offerspage WHERE id = ?";
  db.query(fetchImageQuery, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching image for deletion:", err);
      return res.status(500).send(err);
    }

    const currentImages =
      results[0] && results[0].image ? results[0].image.split(",") : [];

    // Ensure the images are correctly synchronized
    if (currentImages.length !== updatedImages.length + 1) {
      console.error("Image count mismatch, skipping file deletion.");
      return res
        .status(400)
        .json({ message: "Image count mismatch, skipping file deletion." });
    }

    // Find the image to delete
    const imageToDelete = currentImages.find(
      (img) => !updatedImages.includes(img)
    );

    if (imageToDelete) {
      // Delete the image file from the filesystem
      fs.unlink(`uploads/offerspage/${imageToDelete}`, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        } else {
          console.log("Image deleted:", imageToDelete);
        }
      });
    }

    // Update the image array in the database
    const sql = "UPDATE oneclick_offerspage SET image = ? WHERE id = ?";
    db.query(sql, [updatedImages.join(","), productId], (err, result) => {
      if (err) {
        console.error("Error updating image in database:", err);
        return res.status(500).send(err);
      }
      console.log("Image updated:", result);
      res.json({ message: "Image deleted and updated successfully" });
    });
  });
});
//////////////////////////////////////////end///////////////

// // Configure multer for file uploads
// const upload2 = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/doubleadpage');
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + path.extname(file.originalname));
//     }
//   })
// });

// app.post('/backend/uploadimage/:id', doubleadpageUploadMultiple, (req, res) => {
//   const productId = req.params.id;
//   console.log('productId', productId);

//   const images = req.files.map(file => file.filename); // Get filenames from uploaded files

//   // Ensure that the images array is not empty
//   if (images.length === 0) {
//     return res.status(400).send('No images were uploaded.');
//   }

//   // Insert new images into the database
//   const sql = 'SELECT image FROM doubleadpage WHERE id = ?';
//   db.query(sql, [productId], (err, result) => {
//     if (err) {
//       console.error('Error retrieving product from database:', err);
//       return res.status(500).send(err);
//     }

//     let existingImages = [];
//     if (result.length > 0) {
//       existingImages = result[0].image ? result[0].image.split(',') : [];
//     }

//     // Add new images to existing images
//     const updatedImages = [...existingImages, ...images];

//     // Update the database with the new list of images
//     const updateSql = 'UPDATE doubleadpage SET image = ? WHERE id = ?';
//     db.query(updateSql, [updatedImages.join(','), productId], (err, result) => {
//       if (err) {
//         console.error('Error updating database:', err);
//         return res.status(500).send(err);
//       }
//       res.send('Images uploaded successfully');
//     });
//   });
// });

/////////////////////////////singleadpage /////////////////////////

// Serve static files (for serving images)
app.use(
  "/backend/uploads/singleadpage",
  express.static(path.join(__dirname, "uploads/singleadpage"))
);

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/singleadpage/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload3 = multer({ storage: storage });

// Fetch all single ad page images
app.get("/backend/fetchsingleadpage", (req, res) => {
  const query = `SELECT * FROM oneclick_singleadpage WHERE category != 'loginbg' ORDER BY id DESC LIMIT 1`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching images:", err);
      res.status(500).json({ error: "Failed to fetch images" });
    } else {
      res.json(results);
    }
  });
});

// Add a new image
app.post("/backend/singleadpage", upload3.single("image"), (req, res) => {
  const { category } = req.body; // Get the category from the request body
  if (!req.file || !category) {
    return res.status(400).json({ error: "Image and category are required" });
  }

  const image = req.file.filename;
  const query =
    "INSERT INTO oneclick_singleadpage (image, category) VALUES (?, ?)";
  db.query(query, [image, category], (err, result) => {
    if (err) {
      console.error("Error inserting image:", err);
      res.status(500).json({ error: "Failed to add image" });
    } else {
      res.json({ message: "Image added successfully", id: result.insertId });
    }
  });
});
app.put(
  "/backend/updatesingleadpageimage/:id",
  upload3.single("image"),
  (req, res) => {
    const { id } = req.params;
    const { category } = req.body; // Get the new category from the request body

    // Initialize variables for new image and category updates
    let newImage = req.file ? req.file.filename : null; // Set newImage if a new file is uploaded
    let updateFields = [];
    let updateValues = [];

    // Check if both image and category are provided
    if (!newImage && !category) {
      return res.status(400).json({ error: "Image or category is required" });
    }

    const selectQuery = "SELECT image FROM oneclick_singleadpage WHERE id = ?";
    db.query(selectQuery, [id], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error fetching image:", selectErr);
        return res.status(500).json({ error: "Failed to fetch current image" });
      }

      if (selectResult.length === 0) {
        return res.status(404).json({ error: "Image not found" });
      }

      const oldImage = selectResult[0].image;

      // Prepare update query based on fields that need to be updated
      if (newImage) {
        updateFields.push("image = ?");
        updateValues.push(newImage);
      }

      if (category) {
        updateFields.push("category = ?");
        updateValues.push(category);
      }

      // Always add the ID at the end of update values
      updateValues.push(id);

      const updateQuery = `UPDATE oneclick_singleadpage SET ${updateFields.join(
        ", "
      )} WHERE id = ?`;

      db.query(updateQuery, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating image or category:", updateErr);
          return res
            .status(500)
            .json({ error: "Failed to update image or category" });
        }

        // Delete the old image if a new image has been uploaded
        if (newImage) {
          const oldImagePath = path.join(
            __dirname,
            "uploads",
            "singleadpage",
            oldImage
          );
          fs.unlink(oldImagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting old image:", unlinkErr);
            }
          });
        }

        res.json({
          message: "Image and/or category updated successfully",
          updatedImage: newImage,
        });
      });
    });
  }
);

// Delete an image
app.delete("/backend/deletesingleadpageimage/:id", (req, res) => {
  const { id } = req.params;

  // First, fetch the image filename from the database
  const selectQuery = "SELECT image FROM oneclick_singleadpage WHERE id = ?";
  db.query(selectQuery, [id], (selectErr, selectResult) => {
    if (selectErr) {
      console.error("Error fetching image:", selectErr);
      return res.status(500).json({ error: "Failed to fetch image" });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const image = selectResult[0].image;

    // Delete the image file from the folder
    const imagePath = path.join(__dirname, "uploads", "singleadpage", image);
    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image file:", unlinkErr);
        return res.status(500).json({ error: "Failed to delete image file" });
      }

      // Delete the entry from the database
      const deleteQuery = "DELETE FROM oneclick_singleadpage WHERE id = ?";
      db.query(deleteQuery, [id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error("Error deleting image from database:", deleteErr);
          return res
            .status(500)
            .json({ error: "Failed to delete image from database" });
        }

        res.json({ message: "Image deleted successfully" });
      });
    });
  });
});

/////////loginbg///////

// Fetch all single ad page images
app.get("/backend/fetchloginbg", (req, res) => {
  const query = `SELECT * FROM oneclick_singleadpage WHERE category = 'loginbg'  ORDER BY id DESC LIMIT 1`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching images:", err);
      res.status(500).json({ error: "Failed to fetch images" });
    } else {
      res.json(results);
    }
  });
});

// Add a new image
app.post("/backend/loginbg", upload3.single("image"), (req, res) => {
  const category = "loginbg"; // Set default category to "loginbg"
  if (!req.file || !category) {
    return res.status(400).json({ error: "Image and category are required" });
  }

  const image = req.file.filename;
  const query =
    "INSERT INTO oneclick_singleadpage (image, category) VALUES (?, ?)";
  db.query(query, [image, category], (err, result) => {
    if (err) {
      console.error("Error inserting image:", err);
      res.status(500).json({ error: "Failed to add image" });
    } else {
      res.json({ message: "Image added successfully", id: result.insertId });
    }
  });
});

app.put(
  "/backend/updateloginbgimage/:id",
  upload3.single("image"),
  (req, res) => {
    const { id } = req.params;
    const category = "loginbg"; // Set default category to "loginbg"

    // Initialize variables for new image and category updates
    let newImage = req.file ? req.file.filename : null; // Set newImage if a new file is uploaded
    let updateFields = [];
    let updateValues = [];

    // Check if both image and category are provided
    if (!newImage) {
      return res.status(400).json({ error: "Image is required" });
    }

    const selectQuery = "SELECT image FROM oneclick_singleadpage WHERE id = ?";
    db.query(selectQuery, [id], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error fetching image:", selectErr);
        return res.status(500).json({ error: "Failed to fetch current image" });
      }

      if (selectResult.length === 0) {
        return res.status(404).json({ error: "Image not found" });
      }

      const oldImage = selectResult[0].image;

      // Prepare update query based on fields that need to be updated
      if (newImage) {
        updateFields.push("image = ?");
        updateValues.push(newImage);
      }

      if (category) {
        updateFields.push("category = ?");
        updateValues.push(category);
      }

      // Always add the ID at the end of update values
      updateValues.push(id);

      const updateQuery = `UPDATE oneclick_singleadpage SET ${updateFields.join(
        ", "
      )} WHERE id = ?`;

      db.query(updateQuery, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating image or category:", updateErr);
          return res
            .status(500)
            .json({ error: "Failed to update image or category" });
        }

        // Delete the old image if a new image has been uploaded
        if (newImage) {
          const oldImagePath = path.join(
            __dirname,
            "uploads",
            "singleadpage",
            oldImage
          );
          fs.unlink(oldImagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting old image:", unlinkErr);
            }
          });
        }

        res.json({
          message: "Image and/or category updated successfully",
          updatedImage: newImage,
        });
      });
    });
  }
);

// Delete an image
app.delete("/backend/deleteloginbgimage/:id", (req, res) => {
  const { id } = req.params;

  // First, fetch the image filename from the database
  const selectQuery = "SELECT image FROM oneclick_singleadpage WHERE id = ?";
  db.query(selectQuery, [id], (selectErr, selectResult) => {
    if (selectErr) {
      console.error("Error fetching image:", selectErr);
      return res.status(500).json({ error: "Failed to fetch image" });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const image = selectResult[0].image;

    // Delete the image file from the folder
    const imagePath = path.join(__dirname, "uploads", "singleadpage", image);
    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting image file:", unlinkErr);
        return res.status(500).json({ error: "Failed to delete image file" });
      }

      // Delete the entry from the database
      const deleteQuery = "DELETE FROM oneclick_singleadpage WHERE id = ?";
      db.query(deleteQuery, [id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error("Error deleting image from database:", deleteErr);
          return res
            .status(500)
            .json({ error: "Failed to delete image from database" });
        }

        res.json({ message: "Image deleted successfully" });
      });
    });
  });
});

/////////////////changepassword///////////

// Change Password API Endpoint
app.post("/backend/api/change-password", (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Old and new passwords are required" });
  }

  // Query to check if old password is correct
  db.query(
    "SELECT * FROM oneclick_admin WHERE password = ?",
    [oldPassword],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      if (results.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Old password is incorrect" });
      }

      // Query to update the password
      db.query(
        "UPDATE oneclick_admin SET password = ? WHERE password = ?",
        [newPassword, oldPassword],
        (err) => {
          if (err) {
            console.error("Database update error:", err);
            return res
              .status(500)
              .json({ success: false, message: "Internal server error" });
          }

          res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
        }
      );
    }
  );
});
//////////////////////searchbox suggestion////////////////////////////////
// app.get('/backend/api/suggestions', (req, res) => {
//   const query = req.query.query.toLowerCase();

//   // Define categories and products
//   const suggestions = [
//     { term: "Computers", keywords: ["laptop","laptops", "desktop","desktops", "computer","computers", "notebook"] },
//     { term: "Mobiles", keywords: ["mobile", "mobiles", "smartphone","smartphones", "phones", "phone", "android"] },
//     { term: "Headphones", keywords: ["headphone", "headphones", "earphone","earphones", "earbuds", "headset", "wireless headphone", "wired headphone" ,"wired headphones"] },
//     { term: "Printers", keywords: ["printer", "scanner", "fax"] },
//     { term: "Speaker", keywords: ["speaker", "speakers","bluetooth speaker", "audio","home theatre"] },
//     { term: "Television", keywords: ["television", "tv", "tele"] },
//     { term: "Watch", keywords: ["watch", "smart watch", "time", "clock", 'wall clock',] },
//     { term: "CCTV", keywords: ["cctv", "security camera", "surveillance"] },
//     { term: "ComputerAccessories", keywords: ["keyboard", "mouse", "monitor", "webcam", "laptop charger", "adapter"] },
//     { term: "MobileAccessories", keywords: ["charger","mobile charger","back cover","back case","flip cover", "case", "screen protector", "power bank", 'c type charger' ] },
//   ];

//   // Find the most specific matching category term based on the query
//   const matchingCategory = suggestions.find(({ keywords }) =>
//     keywords.some(keyword => keyword.includes(query))
//   );

//   // Return the category term if found, otherwise return a not found message
//   if (matchingCategory) {
//     res.json({ category: matchingCategory.term });
//   } else {
//     res.status(404).json({ message: "Product not found" });
//   }
// });
// API endpoint for fetching product suggestions
app.get("/backend/api/suggestions", (req, res) => {
  // Convert the incoming query to lowercase
  let query = req.query.query.toLowerCase();
  console.log(`Search query received: "${query}"`);

  // Normalize the query by removing spaces
  const normalizedQuery = query.replace(/\s+/g, '');
  console.log(`Normalized search query: "${normalizedQuery}"`);

  // Build a SQL query that concatenates prod_name and prod_features,
  // converts them to lowercase, and removes spaces so the search becomes uniform.
  const sql = `
    SELECT category 
    FROM oneclick_product_category 
    WHERE REPLACE(LOWER(CONCAT_WS('', prod_name, prod_features)), ' ', '') LIKE ?
    ORDER BY 
      CASE 
        WHEN category IN ('Computers', 'Mobiles', 'CCTV', 'Printers') THEN 1
        WHEN category IN ('ComputerAccessories', 'MobileAccessories') THEN 2
        ELSE 3
      END,
      CASE 
        WHEN REPLACE(LOWER(prod_name), ' ', '') LIKE ? THEN 1
        WHEN REPLACE(LOWER(prod_features), ' ', '') LIKE ? THEN 2
        ELSE 3
      END
  `;

  // Use the normalized query wrapped in wildcards
  const searchTerm = `%${normalizedQuery}%`;

  db.query(
    sql,
    [searchTerm, searchTerm, searchTerm],
    (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      console.log("Query results:", results);

      if (results.length > 0) {
        console.log(`Product found. Category: "${results[0].category}"`);
        res.json({ category: results[0].category });
      } else {
        console.warn(`No products found for query: "${query}"`);
        res.status(404).json({ message: "Product not found" });
      }
    }
  );
});


////////////useraddress/////////////////////

// Route to handle address submission
app.post("/backend/useraddress", (req, res) => {
  const { userId, address } = req.body;

  if (!userId || !address) {
    return res.status(400).send("User ID and address are required");
  }

  // Update all existing addresses for the user to not current
  const updateQuery =
    "UPDATE oneclick_useraddress SET current_address = 0 WHERE user_id = ?";

  db.query(updateQuery, [userId], (err) => {
    if (err) {
      console.error("Error updating existing addresses:", err);
      return res.status(500).send("Server error");
    }

    // Insert the new address and set it as the current address
    const insertQuery =
      "INSERT INTO oneclick_useraddress (user_id, name, street, city, state, postal_code, country, phone, current_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      userId,
      address.name,
      address.street,
      address.city,
      address.state,
      address.postal_code,
      address.country,
      address.phone,
      1,
    ];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error inserting address:", err);
        return res.status(500).send("Server error");
      }
      res.status(200).send("Address added successfully");
    });
  });
});

// Update address
app.put("/backend/updateuseraddress/:id", (req, res) => {
  const addressId = req.params.id;
  const updatedAddress = req.body;
  const sql = `
    UPDATE oneclick_useraddress 
    SET name = ?, street = ?, city = ?, state = ?, postal_code = ?, country = ?, phone = ? 
    WHERE address_id = ?
  `;
  db.query(
    sql,
    [
      updatedAddress.name,
      updatedAddress.street,
      updatedAddress.city,
      updatedAddress.state,
      updatedAddress.postal_code,
      updatedAddress.country,
      updatedAddress.phone,
      addressId,
    ],
    (err, results) => {
      if (err) {
        console.error("Error updating address:", err);
        return res.status(500).json({ message: "Error updating address" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Address not found" });
      }
      res.json({ message: "Address updated successfully" });
    }
  );
});

// Check for existing address
app.post("/backend/checkAddressExists", (req, res) => {
  const { userId, address } = req.body;

  if (!userId || !address) {
    return res.status(400).send("User ID and address are required");
  }

  const checkQuery = `
    SELECT COUNT(*) AS count FROM oneclick_useraddress 
    WHERE user_id = ? AND 
    name = ? AND 
    street = ? AND 
    city = ? AND 
    state = ? AND 
    postal_code = ? AND 
    country = ? AND 
    phone = ?
  `;

  const values = [
    userId,
    address.name,
    address.street,
    address.city,
    address.state,
    address.postal_code,
    address.country,
    address.phone,
  ];

  db.query(checkQuery, values, (err, results) => {
    if (err) {
      console.error("Error checking address:", err);
      return res.status(500).send("Server error");
    }

    const count = results[0].count;
    if (count > 0) {
      return res.status(409).send("Address already exists"); // Conflict
    }

    return res.status(200).send("Address does not exist"); // Address is unique
  });
});

// Check if phone number exists for different user
app.post("/backend/checkPhoneNumber", (req, res) => {
  const { phone, userId } = req.body;
  console.log("phone", phone);
  console.log("userId", userId);
  if (!phone) {
    return res.status(400).send("Phone number is required");
  }

  const sql =
    "SELECT COUNT(*) AS count FROM oneclick_useraddress WHERE phone = ? AND user_id != ?";

  db.query(sql, [phone, userId], (err, results) => {
    if (err) {
      console.error("Error checking phone number:", err);
      return res.status(500).send("Server error");
    }

    if (results[0].count > 0) {
      // Phone number exists for a different user
      return res.status(200).send("Phone number exists for a different user");
    } else {
      // Phone number does not exist for a different user
      return res
        .status(404)
        .send("Phone number does not exist for a different user");
    }
  });
});

app.delete("/backend/deleteuseraddress/:address_id", (req, res) => {
  const addressId = req.params.address_id;

  if (!addressId) {
    return res.status(400).json({ message: "Address ID is required" });
  }

  const sql = "DELETE FROM oneclick_useraddress WHERE address_id = ?";
  db.query(sql, [addressId], (err, results) => {
    if (err) {
      console.error("Error deleting address:", err);
      return res.status(500).json({ message: "Error deleting address" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ message: "Address deleted successfully" });
  });
});

// Fetch addresses for a specific user
app.get("/backend/useraddress/:userId", (req, res) => {
  const userId = req.params.userId;
  const query =
    "SELECT * FROM oneclick_useraddress WHERE user_id = ? order by address_id DESC";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching addresses:", err);
      return res.status(500).send("Server Error");
    }
    res.json(results);
  });
});

// Update the current address
app.post("/backend/update-current-address", async (req, res) => {
  const { userId, addressId } = req.body;

  try {
    // Set all addresses to false
    await db.query(
      "UPDATE oneclick_useraddress SET current_address = FALSE WHERE user_id = ?",
      [userId]
    );

    // Set the selected address to true
    await db.query(
      "UPDATE oneclick_useraddress SET current_address = TRUE WHERE user_id = ? AND address_id = ?",
      [userId, addressId]
    );

    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/backend/singleaddress/:userId", (req, res) => {
  const userId = req.params.userId;

  // Log the incoming userId
  console.log(`Fetching address for userId: ${userId}`);

  const query =
    "SELECT * FROM oneclick_useraddress WHERE user_id = ? AND current_address = 1";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching addresses:", err);
      return res.status(500).send("Server Error");
    }

    // Log the results fetched from the database
    console.log(`Fetched addresses for userId ${userId}:`, results);

    res.json(results);
  });
});

// API endpoint to update current address
app.post("/backend/update-current-address", (req, res) => {
  const { userId, addressId } = req.body;

  // Validate input
  if (!userId || !addressId) {
    return res
      .status(400)
      .json({ error: "User ID and Address ID are required" });
  }

  // Begin a transaction
  db.beginTransaction((err) => {
    if (err) throw err;

    // SQL query to set all addresses to 0 for the user
    const resetSql = `UPDATE user_address SET current_address = 0 WHERE user_id = ?`;
    db.query(resetSql, [userId], (error) => {
      if (error) {
        return db.rollback(() => {
          console.error("Error resetting addresses:", error);
          return res.status(500).json({ error: "Failed to reset addresses" });
        });
      }

      // SQL query to set the current address to 1
      const updateSql = `UPDATE user_address SET current_address = 1 WHERE address_id = ? AND user_id = ?`;
      db.query(updateSql, [addressId, userId], (error, results) => {
        if (error) {
          return db.rollback(() => {
            console.error("Error updating address:", error);
            return res.status(500).json({ error: "Failed to update address" });
          });
        }

        // Commit the transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Transaction commit failed:", err);
              return res
                .status(500)
                .json({ error: "Transaction commit failed" });
            });
          }

          // Check if any rows were affected
          if (results.affectedRows === 0) {
            return res
              .status(404)
              .json({ error: "Address not found or not updated" });
          }

          res
            .status(200)
            .json({ message: "Current address updated successfully" });
        });
      });
    });
  });
});

/////////////////////products order and store details /////////////////////

// Function to generate unique ID
const generateUniqueId = () => {
  // Generate a random 8-digit number
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  // Format it as a string with prefix 'ORD'
  return `ORD${randomNumber}`;
};

// Configure multer to store images in the 'uploads/products' folder
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products"); // Destination folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload7 = multer({ storage: productStorage });

// app.post('/backend/place-order', upload7.array('image'), (req, res) => {
//   const { user_id, total_amount, payment_method, status,  shipping_address, address_id, cartItems } = req.body;

//   // Ensure req.files exists
//   const files = req.files || [];
//   console.log('Uploaded Files:', files);

//   let items;
//   try {
//     items = Array.isArray(cartItems) ? cartItems : JSON.parse(cartItems);
//   } catch (e) {
//     console.error('Error parsing cartItems:', e);
//     return res.status(400).json({ message: 'Invalid cart items format' });
//   }

//   if (!user_id || !total_amount || !address_id || !items || items.length === 0) {
//     console.error('Invalid data provided:', { user_id, total_amount, shipping_address, address_id, items });
//     return res.status(400).json({ message: 'Invalid data' });
//   }

//   // Generate unique ID for the order
//   const unique_id = generateUniqueId();

//   // Insert order into `oneclick_orders` table
//   const orderQuery = 'INSERT INTO oneclick_orders ( payment_method, unique_id, user_id, total_amount, shipping_address, address_id, status, delivery_status, delivery_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 DAY))';
//   db.query(orderQuery, [payment_method, unique_id, user_id, total_amount, shipping_address, address_id, status, 'Order Placed'], (err, result) => {
//     if (err) {
//       console.error('Error inserting order:', err);
//       return res.status(500).json({ message: 'Error inserting order', error: err.message });
//     }

//     // Prepare values for order items
//     const orderItemsQuery = 'INSERT INTO oneclick_order_items (order_id, product_id, quantity, price) VALUES ?';
//     const orderItemsValues = items.map(item => [
//       unique_id,
//       item.product_id,
//       item.quantity,
//       item.price * item.quantity
//     ]);

//     console.log("orderItemsValues", orderItemsValues)

//     // Insert order items
//     db.query(orderItemsQuery, [orderItemsValues], (err) => {
//       if (err) {
//         console.error('Error inserting order items:', err);
//         return res.status(500).json({ message: 'Error inserting order items', error: err.message });
//       }

//       // Prepare query for inserting or updating products (excluding image URLs for now)
//       const productsQuery = `
//       INSERT INTO oneclick_products (product_id, name, category, price, description)
//       VALUES ?
//       ON DUPLICATE KEY UPDATE
//         name = VALUES(name),
//         category = VALUES(category),
//         price = VALUES(price),
//         description = VALUES(description)
//       `;

//       // Prepare values for products
//       const productsValues = items.map(item => [
//         item.product_id,
//         item.name,
//         item.category,
//         item.price,
//         item.description
//       ]);

//     console.log("productsValues", productsValues)

//       // Insert or update product information
//       db.query(productsQuery, [productsValues], (err) => {
//         if (err) {
//           console.error('Error inserting or updating products:', err);
//           return res.status(500).json({ message: 'Error inserting or updating products', error: err.message });
//         }

//          // Insert notification
//       const notificationMessage = `New order placed by user ${user_id}. Order ID: ${unique_id}, Total Amount: Rs.${total_amount}`;
//       const notificationQuery = 'INSERT INTO oneclick_notifications (type, message, is_read) VALUES (?, ?, ?)';
//       db.query(notificationQuery, ['order', notificationMessage, false], (err) => {
//         if (err) {
//           console.error('Error inserting notification:', err);
//           return res.status(500).json({ message: 'Error inserting notification', error: err.message });
//         }

//         console.log('Notification created successfully.');
//       });

//         console.log('Products inserted or updated successfully');

//         // Now handle inserting images into `product_images` table
//         const productImagesQuery = `
//         INSERT INTO oneclick_product_images (product_id, image_url)
//         VALUES ?
//         `;

//         // Prepare values for product images
//         let imagesValues = [];
//         items.forEach(item => {
//           // Find the corresponding uploaded file(s)
//           const filesForProduct = files.filter(file => file.originalname === item.image);

//           if (filesForProduct.length > 0) {
//             // If files were uploaded, use the filenames
//             filesForProduct.forEach(file => {
//               imagesValues.push([item.product_id, file.filename]);
//             });
//           } else {
//             // If no files were uploaded, fall back to using the existing image URL (single or multiple)
//             const imageUrls = Array.isArray(item.image) ? item.image : [item.image];
//             imageUrls.forEach(url => {
//               imagesValues.push([item.product_id, url]);
//             });
//           }
//         });

//         // Insert the product images into the database
//         if (imagesValues.length > 0) {
//           db.query(productImagesQuery, [imagesValues], (err) => {
//             if (err) {
//               console.error('Error inserting product images:', err);
//               return res.status(500).json({ message: 'Error inserting product images', error: err.message });
//             }

//             console.log('Product images inserted successfully');
//             return res.status(200).json({ message: 'Order placed successfully', unique_id });
//           });
//         } else {
//           console.log('No images to insert.');
//           return res.status(200).json({ message: 'Order placed successfully', unique_id });
//         }
//       });
//     });
//   });
// });

// app.post('/backend/place-order', upload7.array('image'), (req, res) => {
//   const { user_id, total_amount, payment_method, status, shipping_address, address_id, cartItems } = req.body;

//   const files = req.files || [];
//   console.log('Uploaded Files:', files);

//   let items;
//   try {
//     items = Array.isArray(cartItems) ? cartItems : JSON.parse(cartItems);
//   } catch (e) {
//     console.error('Error parsing cartItems:', e);
//     return res.status(400).json({ message: 'Invalid cart items format' });
//   }

//   if (!user_id || !total_amount || !address_id || !items || items.length === 0) {
//     console.error('Invalid data provided:', { user_id, total_amount, shipping_address, address_id, items });
//     return res.status(400).json({ message: 'Invalid data' });
//   }

//   const unique_id = generateUniqueId();

//   const orderQuery = 'INSERT INTO oneclick_orders (payment_method, unique_id, user_id, total_amount, shipping_address, address_id, status, delivery_status, delivery_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 DAY))';
//   db.query(orderQuery, [payment_method, unique_id, user_id, total_amount, shipping_address, address_id, status, 'Order Placed'], (err) => {
//     if (err) {
//       console.error('Error inserting order:', err);
//       return res.status(500).json({ message: 'Error inserting order', error: err.message });
//     }

//     const orderItemsQuery = 'INSERT INTO oneclick_order_items (order_id, product_id, quantity, price) VALUES ?';
//     const orderItemsValues = items.map(item => [unique_id, item.product_id, item.quantity, item.price * item.quantity]);

//     db.query(orderItemsQuery, [orderItemsValues], (err) => {
//       if (err) {
//         console.error('Error inserting order items:', err);
//         return res.status(500).json({ message: 'Error inserting order items', error: err.message });
//       }

//       const productImagesQuery = `
//         INSERT INTO oneclick_product_images (product_id, image_url)
//         VALUES ?
//       `;

//       const imagesValues = [];
//       items.forEach(item => {
//         const filesForProduct = files.filter(file => file.originalname === item.image);
//         if (filesForProduct.length > 0) {
//           filesForProduct.forEach(file => {
//             imagesValues.push([item.product_id, file.filename]);
//           });
//         } else if (item.image) {
//           const imageUrls = Array.isArray(item.image) ? item.image : [item.image];
//           imageUrls.forEach(url => {
//             imagesValues.push([item.product_id, url]);
//           });
//         }
//       });

//       if (imagesValues.length > 0) {
//         db.query(productImagesQuery, [imagesValues], (err) => {
//           if (err) {
//             console.error('Error inserting product images:', err);
//             return res.status(500).json({ message: 'Error inserting product images', error: err.message });
//           }

//           console.log('Product images inserted successfully');
//           return res.status(200).json({ message: 'Order placed successfully', unique_id });
//         });
//       } else {
//         console.log('No images to insert.');
//         return res.status(200).json({ message: 'Order placed successfully', unique_id });
//       }
//     });
//   });
// });
// app.post('/backend/place-order', upload7.array('image'), (req, res) => {
//   const { user_id, total_amount, payment_method, status, shipping_address, address_id, cartItems } = req.body;

//   const files = req.files || [];
//   console.log('Uploaded Files:', files);

//   let items;
//   try {
//     // Handle cartItems which is already structured based on the frontend enrichedCartItems
//     items = Array.isArray(cartItems) ? cartItems : JSON.parse(cartItems);
//   } catch (e) {
//     console.error('Error parsing cartItems:', e);
//     return res.status(400).json({ message: 'Invalid cart items format' });
//   }

//   if (!user_id || !total_amount || !address_id || !items || items.length === 0) {
//     console.error('Invalid data provided:', { user_id, total_amount, shipping_address, address_id, items });
//     return res.status(400).json({ message: 'Invalid data' });
//   }

//   const unique_id = generateUniqueId();

//   // Insert the order into the 'oneclick_orders' table
//   const orderQuery = 'INSERT INTO oneclick_orders (payment_method, unique_id, user_id, total_amount, shipping_address, address_id, status, delivery_status, delivery_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 DAY))';
//   db.query(orderQuery, [payment_method, unique_id, user_id, total_amount, shipping_address, address_id, status, 'Order Placed'], (err) => {
//     if (err) {
//       console.error('Error inserting order:', err);
//       return res.status(500).json({ message: 'Error inserting order', error: err.message });
//     }

//     // Insert the order items into 'oneclick_order_items' table using the new field names
//     const orderItemsQuery = 'INSERT INTO oneclick_order_items (order_id, product_id, quantity, price) VALUES ?';
//     const orderItemsValues = items.map(item => [
//       unique_id,
//       item.prod_id,               // Use 'prod_id' for product ID
//       item.quantity,         // Use 'prod_quantity' for quantity
//       item.prod_price * item.quantity  // Use 'prod_price' for price (multiplied by quantity)
//     ]);

//     db.query(orderItemsQuery, [orderItemsValues], (err) => {
//       if (err) {
//         console.error('Error inserting order items:', err);
//         return res.status(500).json({ message: 'Error inserting order items', error: err.message });
//       }

//       // Insert product images into 'oneclick_product_images' table using 'prod_image'
//       const productImagesQuery = `
//         INSERT INTO oneclick_product_images (product_id, image_url)
//         VALUES ?
//       `;

//       const imagesValues = [];
//       items.forEach(item => {
//         const filesForProduct = files.filter(file => file.originalname === item.prod_img);  // Use 'prod_img' to find image
//         if (filesForProduct.length > 0) {
//           filesForProduct.forEach(file => {
//             imagesValues.push([item.prod_id, file.filename]);  // Store the image file with 'prod_id'
//           });
//         } else if (item.prod_img) {
//           // If the image URL is passed in, handle it
//           const imageUrls = Array.isArray(item.prod_img) ? item.prod_img : [item.prod_img];
//           imageUrls.forEach(url => {
//             imagesValues.push([item.prod_id, url]);  // Store image URL with 'prod_id'
//           });
//         }
//       });

//       if (imagesValues.length > 0) {
//         db.query(productImagesQuery, [imagesValues], (err) => {
//           if (err) {
//             console.error('Error inserting product images:', err);
//             return res.status(500).json({ message: 'Error inserting product images', error: err.message });
//           }

//           console.log('Product images inserted successfully');
//           return res.status(200).json({ message: 'Order placed successfully', unique_id });
//         });
//       } else {
//         console.log('No images to insert.');
//         return res.status(200).json({ message: 'Order placed successfully', unique_id });
//       }
//     });
//   });
// });

app.post("/backend/place-order", upload7.array("image"), (req, res) => {
  const {
    user_id,
    total_amount,
    payment_method,
    status,
    shipping_address,
    address_id,
    cartItems,
  } = req.body;
  const files = req.files || [];
  console.log("Uploaded Files:", files);

  let items;
  try {
    items = Array.isArray(cartItems) ? cartItems : JSON.parse(cartItems);
  } catch (e) {
    console.error("Error parsing cartItems:", e);
    return res.status(400).json({ message: "Invalid cart items format" });
  }

  if (
    !user_id ||
    !total_amount ||
    !address_id ||
    !items ||
    items.length === 0
  ) {
    console.error("Invalid data provided:", {
      user_id,
      total_amount,
      shipping_address,
      address_id,
      items,
    });
    return res.status(400).json({ message: "Invalid data" });
  }

  const unique_id = generateUniqueId();

  // Log affected tables
  let affectedTables = [];

  // Insert the order into the 'oneclick_orders' table
  const orderQuery =
    "INSERT INTO oneclick_orders (payment_method, unique_id, user_id, total_amount, shipping_address, address_id, status, delivery_status, delivery_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 DAY))";
  db.query(
    orderQuery,
    [
      payment_method,
      unique_id,
      user_id,
      total_amount,
      shipping_address,
      address_id,
      status,
      "Order Placed",
    ],
    (err) => {
      if (err) {
        console.error("Error inserting order:", err);
        return res
          .status(500)
          .json({ message: "Error inserting order", error: err.message });
      }

      affectedTables.push("oneclick_orders"); // Log affected table

      // Insert or update products into 'oneclick_products'
      const productsQuery = `
      INSERT INTO oneclick_products (product_id, name, category, price, description) 
      VALUES ? 
      ON DUPLICATE KEY UPDATE 
        name = VALUES(name), 
        category = VALUES(category), 
        price = VALUES(price), 
        description = VALUES(description)
    `;
      const productsValues = items.map((item) => [
        item.prod_id,
        item.prod_name,
        item.prod_category,
        item.prod_price,
        item.prod_description,
      ]);

      db.query(productsQuery, [productsValues], (err) => {
        if (err) {
          console.error("Error inserting or updating products:", err);
          return res
            .status(500)
            .json({
              message: "Error inserting or updating products",
              error: err.message,
            });
        }

        affectedTables.push("oneclick_products"); // Log affected table

        // Insert order items into 'oneclick_order_items'
        const orderItemsQuery =
          "INSERT INTO oneclick_order_items (order_id, product_id, quantity, price) VALUES ?";
        const orderItemsValues = items.map((item) => [
          unique_id,
          item.prod_id,
          item.quantity,
          item.prod_price * item.quantity,
        ]);

        db.query(orderItemsQuery, [orderItemsValues], (err) => {
          if (err) {
            console.error("Error inserting order items:", err);
            return res
              .status(500)
              .json({
                message: "Error inserting order items",
                error: err.message,
              });
          }

          affectedTables.push("oneclick_order_items"); // Log affected table

          // Insert product images into 'oneclick_product_images'
          const productImagesQuery =
            "INSERT INTO oneclick_product_images (product_id, image_url) VALUES ?";
          const imagesValues = [];
          items.forEach((item) => {
            const filesForProduct = files.filter(
              (file) => file.originalname === item.prod_img
            );
            if (filesForProduct.length > 0) {
              filesForProduct.forEach((file) => {
                imagesValues.push([item.prod_id, file.filename]);
              });
            } else if (item.prod_img) {
              const imageUrls = Array.isArray(item.prod_img)
                ? item.prod_img
                : [item.prod_img];
              imageUrls.forEach((url) => {
                imagesValues.push([item.prod_id, url]);
              });
            }
          });

          if (imagesValues.length > 0) {
            db.query(productImagesQuery, [imagesValues], (err) => {
              if (err) {
                console.error("Error inserting product images:", err);
                return res
                  .status(500)
                  .json({
                    message: "Error inserting product images",
                    error: err.message,
                  });
              }

              affectedTables.push("oneclick_product_images"); // Log affected table

              // Log the affected tables
              console.log("Affected Tables:");
              affectedTables.forEach((table) => {
                console.log(`Table: ${table}`);
              });

              return res
                .status(200)
                .json({ message: "Order placed successfully", unique_id });
            });
          } else {
            console.log("No images to insert.");
            console.log("Affected Tables:");
            affectedTables.forEach((table) => {
              console.log(`Table: ${table}`);
            });
            return res
              .status(200)
              .json({ message: "Order placed successfully", unique_id });
          }
        });
      });
    }
  );
});

// app.post('/backend/clear-cart', (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: 'Email is required' });
//   }

//   // Update the addtocart field to an empty array
//   db.query(
//     'UPDATE oneclick_users SET addtocart = ? WHERE email = ?',
//     ['[]', email],
//     (err, result) => {
//       if (err) {
//         console.error('Error clearing cart:', err);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       res.json({ message: 'Cart cleared successfully' });
//     }
//   );
// });

app.post("/backend/clear-cart", (req, res) => {
  const { email, cartItems } = req.body;

  console.log("Received clear-cart request for:", email);
  console.log("Cart items to remove:", cartItems);

  if (!email || !Array.isArray(cartItems)) {
    console.error(
      "Invalid request: Missing email or cartItems is not an array"
    );
    return res.status(400).json({ error: "Email and cartItems are required" });
  }

  // Fetch the current cart
  db.query(
    "SELECT addtocart FROM oneclick_users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.length === 0) {
        // console.warn("User not found:", email);
        return res.status(404).json({ error: "User not found" });
      }

      let currentCart = [];
      try {
        currentCart = JSON.parse(result[0].addtocart);
        console.log("Current Cart from DB:", currentCart);
      } catch (e) {
        console.error("Error parsing addtocart:", e);
        return res.status(500).json({ error: "Corrupted cart data" });
      }

      // Create a Set of items to remove (ensure consistent string format)
      const itemsToRemove = new Set(
        cartItems.map((item) => `${item.id}-${item.quantity}`)
      );
      console.log("Items to remove (Set):", itemsToRemove);

      // Filter out the items that need to be removed
      const updatedCart = currentCart.filter((cartItem) => {
        const shouldRemove = itemsToRemove.has(cartItem);
        console.log(`Checking cartItem: ${cartItem} - Remove: ${shouldRemove}`);
        return !shouldRemove;
      });

      console.log("Updated Cart after removal:", updatedCart);

      // Update the database with the modified cart
      db.query(
        "UPDATE oneclick_users SET addtocart = ? WHERE email = ?",
        [JSON.stringify(updatedCart), email],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating cart:", updateErr);
            return res.status(500).json({ error: "Failed to update cart" });
          }

          console.log("Cart updated successfully for user:", email);
          res.json({
            message: "Selected cart items removed successfully",
            updatedCart,
          });
        }
      );
    }
  );
});

//////////////////////////

app.get("/backend/fetchorders", (req, res) => {
  console.log("Received request to fetch orders");

  // Fetch all orders with related items and product details
  const queryOrders = `
     SELECT o.*, 
           oi.order_item_id, 
           oi.quantity, 
           oi.price, 
           p.product_id, 
           p.name AS product_name, 
           p.description AS product_description,
           o.shipping_address 
    FROM oneclick_orders o
    LEFT JOIN oneclick_order_items oi ON o.order_id = oi.order_id
    LEFT JOIN oneclick_products p ON oi.product_id = p.product_id
    ORDER BY o.order_id DESC
  `;

  db.query(queryOrders, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Error fetching orders" });
    }

    console.log("Orders fetched:", results);

    // Group results by order_id to format them properly
    const orders = results.reduce((acc, row) => {
      const {
        order_id,
        user_id,
        total_amount,
        shipping_address,
        order_date,
        status,
        payment_method,
        unique_id,
        order_item_id,
        product_name,
        quantity,
        price,
        product_description,
      } = row;

      // Check if order already exists
      if (!acc[order_id]) {
        acc[order_id] = {
          order_id,
          user_id,
          total_amount,
          shipping_address,
          order_date,
          status,
          payment_method,
          unique_id,
          items: [],
        };
      }

      // Add the order item details to the items array
      if (order_item_id) {
        acc[order_id].items.push({
          order_item_id,
          product_name,
          quantity,
          price,
          product_description,
        });
      }

      return acc;
    }, {});

    const enrichedOrders = Object.values(orders);

    // Collect all unique user_ids from orders
    const userIds = [...new Set(enrichedOrders.map((order) => order.user_id))];
    // console.log('Unique user IDs:', userIds);

    if (userIds.length === 0) {
      // No user_ids to fetch
      // console.log('No user IDs to fetch. Returning orders.');
      return res.json(enrichedOrders);
    }

    // Prepare query to fetch names from users table
    const queryUsers =
      "SELECT user_id, username FROM oneclick_users WHERE user_id IN (?)";
    // console.log('Query to fetch user names:', queryUsers);

    db.query(queryUsers, [userIds], (err, users) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Error fetching users" });
      }

      // console.log('Users fetched:', users);

      // Map user_id to name
      const userMap = users.reduce((acc, user) => {
        acc[user.user_id] = user.username;
        return acc;
      }, {});
      // console.log('User ID to name map:', userMap);

      // Add customerName to orders based on user_id
      const finalOrders = enrichedOrders.map((order) => ({
        ...order,
        customerName: userMap[order.user_id] || "Unknown", // Default to 'Unknown' if name is not found
      }));

      // console.log('Final enriched orders:', finalOrders);

      res.json(finalOrders);
    });
  });
});

app.delete("/backend/deleteOrder/:orderId", (req, res) => {
  const { orderId } = req.params;

  // Query to delete the order from the database
  const sql = `DELETE FROM oneclick_orders WHERE unique_id = ?`;

  db.query(sql, [orderId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting order" });
    }
    res.json({ message: "Order deleted successfully" });
  });
});

// Fetch Orders Data
app.get("/backend/fetchordersdashboard", (req, res) => {
  const query = "SELECT * FROM oneclick_orders"; // Adjust your query as needed
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).send("Error fetching orders");
      return;
    }
    res.json(results);
  });
});

// Fetch Product Categories for Pie Chart
app.get("/backend/fetchcategories", (req, res) => {
  const query = `
    SELECT 
      category, 
      COUNT(*) AS total_category 
    FROM oneclick_product_category 
    GROUP BY category;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching product categories:", err);
      res.status(500).send("Error fetching product categories");
      return;
    }
    res.json(results);
  });
});

app.get("/backend/fetchproductcategories", (req, res) => {
  const query = `
    SELECT 
      category, 
      COUNT(*) AS total_amount 
    FROM oneclick_products
    GROUP BY category
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching product categories:", err);
      res.status(500).send("Error fetching product categories");
      return;
    }
    res.json(results);
  });
});
///////////reportspage////////////////
// Sales Report API
// Sales Report API
app.get("/backend/api/salesreport", (req, res) => {
  console.log("Received request for Sales Report");

  const query = `
    SELECT 
        p.name AS product_name, 
        p.category, 
        IFNULL(SUM(oi.price * oi.quantity), 0) AS sales
    FROM 
        oneclick_products p
    LEFT JOIN 
        oneclick_order_items oi ON oi.product_id = p.product_id
    LEFT JOIN 
        oneclick_orders o ON oi.order_id = o.order_id
    GROUP BY 
        p.name, p.category
  `;

  console.log("Executing query:", query);

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching sales report:", err);
      res.status(500).send("Error fetching sales report");
    } else {
      console.log("Sales Report Results:", results);
      res.json(results);
    }
  });
});

// Orders Report API
app.get("/backend/api/ordersreport", (req, res) => {
  const query = `
    SELECT 
      o.*, 
      u.* 
    FROM 
      oneclick_orders o
    JOIN 
      oneclick_users u ON o.user_id = u.user_id
    ORDER BY 
      o.order_id DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders report:", err);
      res.status(500).send("Error fetching orders report");
    } else {
      res.json(results);
    }
  });
});

// Customers Report API
app.get("/backend/api/customersreport", (req, res) => {
  const query = `
    SELECT 
      u.username AS user_name, 
      COUNT(o.unique_id) AS total_orders, 
      SUM(o.total_amount) AS total_spent
    FROM 
      oneclick_orders o
    JOIN 
      oneclick_users u ON o.user_id = u.user_id
    GROUP BY 
      u.username
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching customers report:", err);
      res.status(500).send("Error fetching customers report");
    } else {
      res.json(results);
    }
  });
});

app.delete("/backend/api/salesreport/:id", (req, res) => {
  const productId = req.params.id;
  const query = `DELETE FROM oneclick_products WHERE product_id = ?`;

  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error("Error deleting sales report:", err);
      res.status(500).json({ message: "Error deleting sales report" });
    } else {
      res.status(200).json({ message: "Sales report deleted successfully" });
    }
  });
});

app.delete("/backend/api/ordersreport/:id", (req, res) => {
  const orderId = req.params.id;
  const query = `DELETE FROM oneclick_orders WHERE order_id = ?`;

  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error("Error deleting order report:", err);
      res.status(500).json({ message: "Error deleting order report" });
    } else {
      res.status(200).json({ message: "Order report deleted successfully" });
    }
  });
});

app.delete("/backend/api/customersreport/:id", (req, res) => {
  const userId = req.params.id;
  const query = `DELETE FROM oneclick_users WHERE user_id = ?`;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting customer report:", err);
      res.status(500).json({ message: "Error deleting customer report" });
    } else {
      res.status(200).json({ message: "Customer report deleted successfully" });
    }
  });
});

app.get("/backend/api/users", (req, res) => {
  const query = `
    SELECT 
      u.user_id,
      contact_number, 
      u.username, 
      u.email, 
      u.id, 
      GROUP_CONCAT(ua.address_id) AS address_ids,
      GROUP_CONCAT(ua.name SEPARATOR ', ') AS address_names,
      GROUP_CONCAT(ua.street SEPARATOR ', ') AS streets, 
      GROUP_CONCAT(ua.city SEPARATOR ', ') AS cities,
      GROUP_CONCAT(ua.state SEPARATOR ', ') AS states,
      GROUP_CONCAT(ua.postal_code SEPARATOR ', ') AS postal_codes,
      GROUP_CONCAT(ua.country SEPARATOR ', ') AS countries,
      GROUP_CONCAT(ua.phone SEPARATOR ', ') AS phones
    FROM oneclick_users u
    LEFT JOIN oneclick_useraddress ua ON u.user_id = ua.user_id 
    GROUP BY u.user_id, u.username, u.email
    ORDER BY u.user_id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).send("Error fetching users");
    } else {
      res.json(results);
    }
  });
});

app.delete("/backend/api/deleteuser/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM oneclick_users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting career entry:", err);
      return res.status(500).json({ message: "Failed to delete career entry" });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Career entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Career entry not found" });
    }
  });
});

// app.get("/backend/api/fetchusers", (req, res) => {
//   const sql = "SELECT * FROM oneclick_useraddress";

//   db.query(sql, (error, results) => {
//     if (error) {
//       console.log('Error fetching users:', error); // Log the error
//       return res.status(500).json({ message: 'Failed to fetch users', error }); // Return an error message
//     }

//     console.log('Users fetched:', results); // Log the fetched users
//     res.status(200).json(results); // Send the results as a response
//   });
// });

app.get("/backend/my-orders/:userId", (req, res) => {
  const userId = req.params.userId;

  // Query to get orders
  const ordersQuery = `SELECT * FROM oneclick_orders WHERE user_id = ? ORDER BY order_id DESC`;

  db.query(ordersQuery, [userId], (error, orders) => {
    if (error)
      return res.status(500).json({ message: "Error fetching orders" });
    if (orders.length === 0)
      return res.status(404).json({ message: "No orders found for this user" });

    const orderIds = orders.map((order) => order.unique_id);

    if (!orderIds.length) return res.status(200).json({ orders: [] });

    // Query to get product details for the orders
    const productsQuery = `
      SELECT oi.order_id, oi.product_id, oi.quantity, c.prod_name, c.prod_features, c.prod_price, c.prod_img, c.status, 
             c.category, c.prod_id, c.actual_price, c.offer_label, c.productStatus, c.coupon_value, c.subtitle, 
             c.deliverycharge, c.effectiveprice, c.additional_accessories, c.offer_start_time, c.offer_end_time, c.offer_price
      FROM oneclick_order_items oi
      JOIN oneclick_product_category c ON oi.product_id = c.prod_id
      WHERE oi.order_id IN (?)
    `;

    db.query(productsQuery, [orderIds], (err, products) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error fetching products", error: err.message });

      // Group products by order_id
      const productsByOrder = products.reduce((acc, product) => {
        if (!acc[product.order_id]) acc[product.order_id] = [];
        acc[product.order_id].push({
          product_id: product.product_id,
          name: product.prod_name,
          features: product.prod_features,
          price: product.prod_price,
          image: product.prod_img,
          status: product.status,
          category: product.category,
          quantity: product.quantity,
          total_price: product.quantity * product.prod_price,
        });
        return acc;
      }, {});

      // Merge products with the respective orders
      const formattedOrders = orders.map((order) => ({
        ...order,
        products: productsByOrder[order.unique_id] || [],
      }));

      return res.status(200).json({ orders: formattedOrders });
    });
  });
});

// Fetch orders with product details
// Fetch user orders with products

app.get("/backend/api/my-orders/:userId", (req, res) => {
  const userId = req.params.userId;
  console.log("Fetching orders for user:", userId);

  // 1. Fetch orders for the given user
  const ordersQuery = `
    SELECT *
    FROM oneclick_orders
    WHERE user_id = ?
    ORDER BY order_id DESC
  `;

  db.query(ordersQuery, [userId], (orderError, orders) => {
    if (orderError) {
      console.error("Error fetching orders:", orderError);
      return res.status(500).json({ 
        message: "Error fetching orders", 
        error: orderError.message 
      });
    }

    console.log(`Orders retrieved for user ${userId}:`, orders);

    if (!orders || orders.length === 0) {
      console.log("No orders found for user:", userId);
      return res.status(200).json({ orders: [] });
    }

    // 2. Extract order unique identifiers (using unique_id)
    const orderUniqueIds = orders.map((order) => order.unique_id);
    console.log("Extracted order unique IDs:", orderUniqueIds);

    // Build a comma-separated list of placeholders for the IN clause
    const placeholders = orderUniqueIds.map(() => "?").join(",");
    console.log("Placeholders for product query:", placeholders);

    // 3. Fetch product details for the orders using the unique_id
    const productsQuery = `
      SELECT 
        oi.order_id, 
        oi.product_id, 
        oi.quantity, 
        c.prod_name, 
        c.prod_features, 
        c.prod_price, 
        c.prod_img, 
        c.status, 
        c.category
      FROM oneclick_order_items oi
      JOIN oneclick_product_category c ON oi.product_id = c.prod_id
      WHERE oi.order_id IN (${placeholders})
    `;

    console.log("Fetching products for order unique IDs:", orderUniqueIds);
    console.log("Products query:", productsQuery);

    db.query(productsQuery, orderUniqueIds, (prodError, products) => {
      if (prodError) {
        console.error("Error fetching products:", prodError);
        return res.status(500).json({ 
          message: "Error fetching products", 
          error: prodError.message 
        });
      }

      console.log("Products retrieved:", products);

      if (!products || products.length === 0) {
        console.warn("No products found for order unique IDs:", orderUniqueIds);
      }

      // Group products by order_id (which is now the unique_id)
      const productsByOrder = {};
      products.forEach((product) => {
        if (!productsByOrder[product.order_id]) {
          productsByOrder[product.order_id] = [];
        }
        productsByOrder[product.order_id].push({
          product_id: product.product_id,
          name: product.prod_name,
          features: product.prod_features,
          price: product.prod_price,
          image: product.prod_img,
          status: product.status,
          category: product.category,
          quantity: product.quantity,
          total_price: product.quantity * product.prod_price,
        });
      });
      console.log("Grouped products by order (unique_id):", productsByOrder);

      // Merge products with their respective orders using unique_id as key
      const formattedOrders = orders.map((order) => ({
        ...order,
        products: productsByOrder[order.unique_id] || [],
      }));
      console.log("Formatted orders with products:", formattedOrders);

      res.status(200).json({ orders: formattedOrders });
    });
  });
});



///////////buy later/////////////
app.post("/backend/api/store-buy-later", (req, res) => {
  const { productIds, userId } = req.body;

  console.log("🟢 Received request to store buy later items:", req.body);

  if (!Array.isArray(productIds) || productIds.length === 0) {
    console.error("🟡 Validation Error: Invalid productIds provided", productIds);
    return res.status(400).json({
      error: "Invalid productIds provided. It should be a non-empty array.",
    });
  }

  if (!userId) {
    console.error("🟡 Validation Error: Missing userId in request");
    return res.status(400).json({ error: "Missing userId. Unable to store buy later items." });
  }

  // Step 1: Get existing buy_later & addtocart values
  const getUserQuery = "SELECT buy_later, addtocart FROM oneclick_users WHERE user_id = ?";

  db.query(getUserQuery, [userId], (err, results) => {
    if (err) {
      console.error("🔴 Database error while fetching user data:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (results.length === 0) {
      console.warn("🟡 User not found in database.");
      return res.status(404).json({ error: "User not found" });
    }

    let existingBuyLaterItems = [];
    let existingCartItems = [];

    if (results[0].buy_later) {
      try {
        existingBuyLaterItems = JSON.parse(results[0].buy_later);
      } catch (parseError) {
        console.error("🔴 JSON Parse Error: Invalid buy_later data", parseError);
        return res.status(500).json({ error: "Invalid buy_later format" });
      }
    }

    if (results[0].addtocart) {
      try {
        existingCartItems = JSON.parse(results[0].addtocart);
      } catch (parseError) {
        console.error("🔴 JSON Parse Error: Invalid addtocart data", parseError);
        return res.status(500).json({ error: "Invalid addtocart format" });
      }
    }

    console.log("🟡 Existing Buy Later Items:", existingBuyLaterItems);
    console.log("🟡 Existing Cart Items:", existingCartItems);

    // Step 2: Append new product IDs to existing buy_later list
    const updatedBuyLaterList = [...new Set([...existingBuyLaterItems, ...productIds])];

    // Step 3: Remove matching product IDs from addtocart
    const updatedCartItems = existingCartItems.filter((cartItem) => {
      const cartProductId = parseInt(cartItem.split("-")[0], 10);
      return !productIds.includes(cartProductId);
    });

    console.log("🟢 Updated Buy Later List:", updatedBuyLaterList);
    console.log("🟢 Updated Cart Items After Removal:", updatedCartItems);

    // Step 4: Update database
    const updateQuery = "UPDATE oneclick_users SET buy_later = ?, addtocart = ? WHERE user_id = ?";
    db.query(
      updateQuery,
      [JSON.stringify(updatedBuyLaterList), JSON.stringify(updatedCartItems), userId],
      (updateErr, updateResults) => {
        if (updateErr) {
          console.error("🔴 Database error while updating fields:", updateErr);
          return res.status(500).json({ error: "Database error", details: updateErr });
        }

        console.log(`🟢 Database Update Success: Affected Rows: ${updateResults.affectedRows}`);
        res.json({
          message: "Items successfully added to Buy Later and removed from cart.",
          buyLater: updatedBuyLaterList,
          updatedCart: updatedCartItems,
        });
      }
    );
  });
});


app.post("/backend/api/remove-buy-later", (req, res) => {
  const { productId, userId } = req.body;

  console.log("🟢 Received request to remove buy later item:", req.body);

  if (!productId || !userId) {
    console.error("🟡 Validation Error: Missing productId or userId");
    return res.status(400).json({ error: "Missing productId or userId." });
  }

  // Step 1: Get existing buy_later list
  const getUserQuery = "SELECT buy_later FROM oneclick_users WHERE user_id = ?";

  db.query(getUserQuery, [userId], (err, results) => {
    if (err) {
      console.error("🔴 Database error while fetching buy_later:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (results.length === 0 || !results[0].buy_later) {
      console.warn("🟡 No buy later items found.");
      return res.json({ message: "No items found in Buy Later." });
    }

    let existingBuyLaterItems = JSON.parse(results[0].buy_later);
    console.log("🟡 Existing Buy Later Items:", existingBuyLaterItems);

    // Step 2: Remove the selected product ID
    const updatedBuyLaterItems = existingBuyLaterItems.filter(id => id !== productId);
    console.log("🟢 Updated Buy Later List:", updatedBuyLaterItems);

    // Step 3: Update database
    const updateQuery = "UPDATE oneclick_users SET buy_later = ? WHERE user_id = ?";
    db.query(updateQuery, [JSON.stringify(updatedBuyLaterItems), userId], (updateErr, updateResults) => {
      if (updateErr) {
        console.error("🔴 Database error while updating buy_later:", updateErr);
        return res.status(500).json({ error: "Database error", details: updateErr });
      }

      console.log(`🟢 Database Update Success: Affected Rows: ${updateResults.affectedRows}`);
      res.json({
        message: "Item successfully removed from Buy Later.",
        buyLater: updatedBuyLaterItems,
      });
    });
  });
});


app.get("/backend/api/get-buy-later/:userId", (req, res) => {
  const { userId } = req.params;

  console.log(`Fetching buy later items for user: ${userId}`);

  // Step 1: Get the stored buy_later product IDs
  const query = "SELECT buy_later FROM oneclick_users WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error while fetching buy_later:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0 || !results[0].buy_later) {
      console.log("No buy later items found.");
      return res.json({ buyLater: [] });
    }

    let buyLaterItems = JSON.parse(results[0].buy_later);
    console.log("Fetched buy later product IDs:", buyLaterItems);

    if (buyLaterItems.length === 0) {
      return res.json({ buyLater: [] });
    }

    // Reverse the order to show the last added item first
    buyLaterItems = buyLaterItems.reverse();

    // Step 2: Fetch product details from oneclick_product_category
    const placeholders = buyLaterItems.map(() => "?").join(","); // Create ?,?,? for SQL query
    const productQuery = `SELECT * FROM oneclick_product_category WHERE id IN (${placeholders})`;

    db.query(productQuery, buyLaterItems, (err, productResults) => {
      if (err) {
        console.error("Database error while fetching product details:", err);
        return res.status(500).json({ error: "Database error" });
      }

      console.log("Fetched buy later product details:", productResults);
      
      // Reorder productResults to match the reversed buyLaterItems order
      const orderedProducts = buyLaterItems.map(id => 
        productResults.find(product => product.id === id)
      ).filter(product => product); // Remove undefined entries

      res.json({ buyLater: orderedProducts });
    });
  });
});

app.get("/backend/getProductByOrderId/:orderId", (req, res) => {
  const { orderId } = req.params;
  console.log("Fetching Product IDs for Order ID:", orderId);

  // SQL query to fetch product IDs
  const query = `
    SELECT *
    FROM oneclick_order_items oi
    JOIN oneclick_orders o ON o.unique_id = oi.order_id
    WHERE o.unique_id = ?
  `;

  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error("Error fetching product IDs by order ID:", err);
      return res.status(500).json({ error: "Failed to fetch product IDs" });
    } else {
      console.log("Product IDs fetched:", result);

      if (result.length === 0) {
        console.warn("No product IDs found for order ID:", orderId);
        return res
          .status(404)
          .json({ message: "No products found for this order" });
      }

      // Extract product IDs and quantities from the result
      const productIdsWithQuantities = result.map((row) => ({
        prod_id: row.product_id,
        quantity: row.quantity,
      }));

      console.log(
        "Extracted Product IDs and Quantities:",
        productIdsWithQuantities
      );

      // Fetch product details for these IDs
      getProductDetails(productIdsWithQuantities, res);
    }
  });
});

function getProductDetails(productIdsWithQuantities, res) {
  // Create placeholders for the query
  const placeholders = productIdsWithQuantities.map(() => "?").join(", ");

  const sql = `
    SELECT * 
    FROM oneclick_product_category 
    WHERE prod_id IN (${placeholders})
  `;

  db.query(
    sql,
    productIdsWithQuantities.map((p) => p.prod_id),
    (err, result) => {
      if (err) {
        console.error("Error fetching product details:", err);
        return res
          .status(500)
          .json({ error: "Failed to fetch product details" });
      }

      if (result.length === 0) {
        console.log("No products found for given IDs");
        return res.status(404).json({ error: "Products not found" });
      }

      // Combine the product details with their respective quantities
      const combinedResults = result.map((product) => {
        const foundProduct = productIdsWithQuantities.find(
          (p) => p.prod_id === product.prod_id
        );
        return {
          ...product,
          quantity: foundProduct ? foundProduct.quantity : 0, // Add quantity to each product detail
        };
      });

      console.log("Combined Product Details fetched:", combinedResults);
      res.json(combinedResults); // Return all product details as an array with quantities
    }
  );
}

// app.get('/backend/getProductDetails', (req, res) => {
//   const { product_id } = req.query;
//   console.log("Fetching Product Details with Product ID:", product_id);

//   // List of tables to search for the product_id
//   const tables = [
//     'computers',
//     'mobiles',
//     'speakers',
//     'headphones',
//     'cctv',
//     'tv',
//     'printers',
//     'watch',
//     'computeraccessories',
//     'mobileaccessories',
//   ];

//   // Generate queries for each table
//   const queries = tables.map(table => {
//     return {
//       tableName: table,
//       query: `
//         SELECT '${table}' AS table_name, prod_name, prod_features, prod_price, prod_img, category
//         FROM ${table}
//         WHERE prod_id = ?
//       `
//     };
//   });

//   let results = [];
//   let completedQueries = 0;

//   const checkProductDetails = (queryIndex) => {
//     if (queryIndex >= queries.length) {
//       // All queries have been processed
//       if (results.length === 0) {
//         console.log("Product not found in any table");
//         return res.status(404).json({ error: 'Product not found in any table' });
//       }
//       console.log("Product Details fetched:", results[0]);
//       return res.json(results[0]); // Return the first match (assuming one product per ID)
//     }

//     const { tableName, query } = queries[queryIndex];
//     console.log("Executing SQL Query:", query);

//     db.query(query, [product_id], (err, result) => {
//       if (err) {
//         console.error(`Error fetching product details from table ${tableName}:`, err);
//         return res.status(500).json({ error: 'Failed to fetch product details' });
//       }

//       if (result.length > 0) {
//         results = result; // Store the result
//         console.log(`Product found in table ${tableName}`);
//         return res.json(result[0]); // Return the first match immediately
//       }

//       completedQueries++;
//       checkProductDetails(queryIndex + 1); // Proceed to the next table
//     });
//   };

//   // Start checking product details from the first table
//   checkProductDetails(0);
// });

// app.get('/getProductDetails', async (req, res) => {
//   const { product_id } = req.query;

//   try {
//     // Assuming you have a database connection instance named db
//     const productQuery = `
//       SELECT p.*, c.prod_price
//       FROM oneclick_products AS p
//       JOIN oneclick_product_category AS c ON p.category_id = c.id
//       WHERE p.id = ?`;

//     const [productDetails] = await db.query(productQuery, [product_id]);

//     if (!productDetails) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json(productDetails);
//   } catch (error) {
//     console.error("Error fetching product details:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// app.get('/backend/getProductDetails', (req, res) => {
//   const { product_id } = req.query;
//   console.log("Fetching Product Details with Product ID:", product_id);

//   const sql = `
//     SELECT prod_name, prod_features, prod_price, prod_img, category
//     FROM oneclick_product_category
//     WHERE prod_id = ?`;

//   db.query(sql, [product_id], (err, result) => {
//     if (err) {
//       console.error('Error fetching product details:', err);
//       return res.status(500).json({ error: 'Failed to fetch product details' });
//     }

//     if (result.length === 0) {
//       console.log("Product not found");
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     console.log("Product Details fetched:", result[0]);
//     res.json(result[0]);
//   });
// });
app.put("/backend/api/update-status", (req, res) => {
  const { orderId, deliveryStatus, deliveryDate } = req.body; // Include deliveryDate

  // Log the incoming request details
  console.log(
    `Received request to update status: orderId=${orderId}, deliveryStatus=${deliveryStatus}, deliveryDate=${deliveryDate}`
  );

  // Validate orderId and deliveryStatus before proceeding
  if (!orderId || !deliveryStatus) {
    console.log("Invalid request data:", req.body);
    return res
      .status(400)
      .json({ message: "Order ID and delivery status are required" });
  }

  // SQL query to update the delivery status and delivery date
  const sql = `UPDATE oneclick_orders SET delivery_status = ?, delivery_date = ? WHERE unique_id = ?`;

  // Execute the SQL query
  db.query(sql, [deliveryStatus, deliveryDate, orderId], (error, results) => {
    if (error) {
      console.error("Error updating delivery status:", error); // Log the error
      return res
        .status(500)
        .json({ message: "Error updating delivery status" });
    }

    // Check if any row was affected
    if (results.affectedRows === 0) {
      console.log(`No order found with orderId: ${orderId}`); // Log when no order is found
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(
      `Delivery status and date updated successfully for orderId: ${orderId}`
    ); // Log successful update
    return res.json({
      message: "Delivery status and date updated successfully",
    });
  });
});

// Endpoint to get order status along with delivery date
app.get("/backend/api/get-order-status", (req, res) => {
  const { orderId } = req.query; // Get orderId from the request query

  // SQL query to get delivery status, unique_id, and delivery_date from the oneclick_orders table
  const query =
    "SELECT unique_id, payment_method, delivery_status, delivery_date, order_date FROM oneclick_orders WHERE unique_id = ?";

  db.query(query, [orderId], (error, results) => {
    if (error) {
      console.error("Error fetching order status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(200).json(results[0]); // Send the first result as the response
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  });
});

//////////////////////
// Route to get product details by ID, including features
app.get("/backend/products/:id", (req, res) => {  
  const { id } = req.params; // Extract the ID from the request parameters

  console.log("id",id)

  // Query to fetch product details and features by product ID
  const query = `
    SELECT 
      p.prod_id, 
      p.prod_name,
      p.id, 
      p.category, 
      p.prod_price, 
      p.actual_price, 
      p.prod_features, 
      p.offer_price, 
      p.offer_start_time, 
      p.offer_end_time, 
      p.prod_img, 
      p.status,
      p.deliverycharge,
      p.subtitle,
      p.offer_label,
      f.memory, 
      f.storage, 
      f.processor, 
      f.camera, 
      f.display, 
      f.battery, 
      f.os, 
      f.network, 
      f.others
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id
    WHERE p.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return the product details along with the features
    res.json(results[0]);
  });
});

app.get("/backend/recently-viewed-products/:id", (req, res) => {
  const id = req.params.id;
  console.log("Requested Product ID:", id);

  const query = "SELECT * FROM oneclick_product_category WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {  
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(results); // Return only the first result (since IDs are unique)
  });
});


//////////////////////////////////////

// Assuming 'db' is your MySQL connection object
app.get("/backend/products/related/:category", (req, res) => {
  const category = req.params.category;

  console.log(`Fetching related products for category: ${category}`);

  const query = "SELECT * FROM oneclick_product_category WHERE category = ?";

  db.query(query, [category], (err, results) => {
    if (err) {
      console.error(`Error fetching related products: ${err.message}`);
      return res.status(500).json({ error: "Error fetching related products" });
    }

    // console.log(`Related products fetched successfully: `, results);
    res.json(results);
  });
});

//////////////////////////////////////////////////////////

// Assuming 'db' is your MySQL connection object
app.get("/backend/products2/related/:category", (req, res) => {
  const category = req.params.category;

  // Define a mapping for main categories and their related subcategories
  const categoryMap = {
    Computers: "ComputerAccessories",
    CCTV: "CCTVAccessories",
    Mobiles: "MobileAccessories",
    Printers: "PrinterAccessories",
  };

  // Fetch the related category or use the default category
  const relatedCategory = categoryMap[category] || category;

  // console.log(`Fetching related products for category: ${relatedCategory}`);

  const query = "SELECT * FROM oneclick_product_category WHERE category = ?";

  db.query(query, [relatedCategory], (err, results) => {
    if (err) {
      console.error(`Error fetching related products: ${err.message}`);
      return res.status(500).json({ error: "Error fetching related products" });
    }

    // console.log(`Related products fetched successfully for category ${relatedCategory}: `, results);
    res.json(results);
  });
});

// Assuming 'db' is your MySQL connection object
app.get("/backend/products/relatedaccessories/:category", (req, res) => {
  const category = req.params.category;

  console.log(`Fetching related products for category: ${category}`);

  // Map of categories to their corresponding accessory categories
  const categoryMapping = {
    Computers: "ComputerAccessories",
    CCTV: "CCTVAccessories",
    Mobile: "MobileAccessories",
    Printers: "PrinterAccessories",
  };

  // Determine the accessory category to fetch
  const accessoryCategory = categoryMapping[category.toLowerCase()] || null;

  // If there is no corresponding accessory category, just fetch the regular products
  const query = accessoryCategory
    ? "SELECT * FROM oneclick_product_category WHERE category = ?"
    : "SELECT * FROM oneclick_product_category WHERE category = ?"; // Update to fetch the right category products

  db.query(query, [accessoryCategory || category], (err, results) => {
    if (err) {
      console.error(`Error fetching related products: ${err.message}`);
      return res.status(500).json({ error: "Error fetching related products" });
    }

    console.log(`Related products fetched successfully: `, results);
    res.json(results);
  });
});

// // Fetch coupon details
// app.get('/backend/api/coupon/:prod_id', (req, res) => {
//   const prodId = req.params.prod_id;

//   const query = `SELECT coupon, coupon_expiry_date FROM oneclick_product_category WHERE prod_id = ?`;

//   db.query(query, [prodId], (err, results) => {
//       if (err) {
//           return res.status(500).json({ error: 'Database query failed.' });
//       }
//       res.json(results);
//   });
// });

// Validate coupon code
app.post("/backend/api/apply-coupon", (req, res) => {
  const { couponCode, product_ids } = req.body;
  console.log("Received data:", req.body);

  const normalizedCouponCode = couponCode.toUpperCase();
  const productIdsArray = Array.isArray(product_ids)
    ? product_ids
    : [product_ids];

  // Query table 1: oneclick_coupons
  const queryCoupons = `
    SELECT coupon_id, coupon_code, expiry_date, discount_value 
    FROM oneclick_coupons 
    WHERE product_id IN (?) AND LOWER(coupon_code) = LOWER(?)`;

  db.query(
    queryCoupons,
    [productIdsArray, normalizedCouponCode],
    (err, results) => {
      if (err)
        return (
          console.error("DB error:", err),
          res.status(500).json({ error: "Database query failed." })
        );

      console.log("Coupons table results:", results);

      if (results.length > 0) {
        const validCoupons = results.filter(
          (coupon) => new Date(coupon.expiry_date) >= new Date()
        );
        if (validCoupons.length === 0)
          return res.status(400).json({ error: "Coupon has expired." });

        const totalDiscount = validCoupons.reduce(
          (sum, coupon) => sum + parseInt(coupon.discount_value, 10),
          0
        );
        return res.json({
          success: true,
          message: "Coupon applied successfully!",
          discount2: totalDiscount,
          min_purchase_limit: 0,
        });
      }

      // Query table 2: oneclick_common_coupon
      const queryCommonCoupon = `SELECT min_purchase_limit, value FROM oneclick_common_coupon WHERE LOWER(name) = LOWER(?)`;
      db.query(
        queryCommonCoupon,
        [normalizedCouponCode],
        (err, commonCouponResults) => {
          if (err)
            return (
              console.error("DB error:", err),
              res.status(500).json({ error: "Database query failed." })
            );

          console.log("Common coupons table results:", commonCouponResults);

          if (commonCouponResults.length === 0)
            return res.status(400).json({ error: "Invalid coupon code." });

          const { min_purchase_limit, value } = commonCouponResults[0];
          return res.json({
            success: true,
            message: "Coupon applied successfully!",
            discount1: value,
            min_purchase_limit,
          });
        }
      );
    }
  );
});

//////////////////////////////////
// Assuming 'db' is your MySQL connection object
// app.get('/backend/products/accessories/:category', (req, res) => {
//   const category = req.params.category.toLowerCase(); // Convert to lowercase

//   console.log(`Fetching related accessories for category: ${category}`);

//   // Define the accessories categories based on your available categories
//   const accessoryCategories = ['computeraccessories', 'mobileaccessories', 'printeraccessories', 'cctvaccessories'];

//   // Check if the category is one of the accessory categories
//   if (!accessoryCategories.includes(category)) {
//     console.warn(`Invalid category requested: ${category}`); // Log warning for invalid category
//     return res.status(400).json({ error: 'Invalid category' }); // Respond with a 400 error for invalid categories
//   }

//   const query = `
//     SELECT *
//     FROM oneclick_product_category
//     WHERE category = ?
//   `;

//   console.log('Executing SQL query:', query, 'with category:', category); // Log the SQL query before execution

//   // Execute the query
//   db.query(query, [category], (err, results) => {
//     if (err) {
//       console.error(`Error fetching related accessories: ${err.message}`); // Log error message
//       return res.status(500).json({ error: 'Error fetching related accessories' });
//     }

//     console.log(`Related accessories fetched successfully. Number of records: ${results.length}`); // Log successful fetch
//     res.json(results);
//   });
// });

app.get("/backend/products/accessories/:productId", (req, res) => {
  const { productId } = req.params;

  // Fetch related accessories using the productId
  const sql = `
    SELECT additional_accessories 
    FROM oneclick_product_category 
    WHERE id = ?
  `;

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("Error fetching additional accessories:", err);
      return res.status(500).send("Error fetching additional accessories");
    }

    if (result.length > 0) {
      const additionalAccessories = result[0].additional_accessories;

      // Check if additional accessories are available
      if (additionalAccessories && additionalAccessories.length > 0) {
        res.json({ additional_accessories: additionalAccessories });
      } else {
        res
          .status(404)
          .send("No additional accessories found for the given product ID");
      }
    } else {
      res.status(404).send("No product found for the given ID");
    }
  });
});

app.get("/backend/products/accessory-details/:id", (req, res) => {
  const { id: accessoryId } = req.params;

  console.log(`Fetching accessory details for accessory ID: ${accessoryId}`);

  // Query for accessory details
  const sql = `
    SELECT *
    FROM oneclick_product_category  
    WHERE id = ?
  `;
  // const sql = `
  //   SELECT id, prod_name, prod_price, prod_img, category, effectiveprice
  //   FROM oneclick_product_category
  //   WHERE id = ?
  // `;

  console.log("SQL Query:", sql, "with accessoryId:", accessoryId);

  db.query(sql, [accessoryId], (err, result) => {
    if (err) {
      console.error("Error fetching accessory details:", err);
      return res.status(500).send("Error fetching accessory details");
    }

    if (result.length > 0) {
      console.log("Fetched accessory details:", result[0]);

      // Ensure prod_img is returned as a proper JSON array if it's a stringified JSON
      if (
        typeof result[0].prod_img === "string" &&
        result[0].prod_img.startsWith("blob_")
      ) {
        result[0].prod_img = [result[0].prod_img]; // Treat as a single image in an array
      }

      // Directly send the fetched result as response
      res.json(result[0]);
    } else {
      console.warn(`No accessory found for the given ID: ${accessoryId}`);
      res.status(404).send("Accessory not found for the given ID");
    }
  });
});

/////////////////coupons /////////

// API Endpoint to Add Multiple Coupons
app.post("/backend/multiplecoupons", (req, res) => {
  const { coupons } = req.body; // Expecting an array of coupons

  // Validate input
  if (!Array.isArray(coupons) || coupons.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid input data. Expecting an array of coupons." });
  }

  // Prepare values for SQL query
  const values = [];
  for (const coupon of coupons) {
    const { product_id, coupon_code, discount_value, expiry_date } = coupon;

    // Check for required fields
    if (
      !product_id ||
      !coupon_code ||
      typeof discount_value !== "number" ||
      !expiry_date
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid coupon data. Each coupon must include product_id, coupon_code, discount_value, and expiry_date.",
        });
    }

    values.push([product_id, coupon_code, discount_value, expiry_date]);
  }

  // Prepare SQL query for batch insert
  const sql = `INSERT INTO oneclick_coupons (product_id, coupon_code, discount_value, expiry_date) VALUES ?`;

  // Execute the query
  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Error inserting coupons:", err);
      return res.status(500).json({ message: "Error inserting coupons" });
    }
    res
      .status(200)
      .json({
        message: "Coupons added successfully",
        affectedRows: result.affectedRows,
      });
  });
});

// API Endpoint to Get Coupons by Product ID
app.get("/backend/coupons/:productId", (req, res) => {
  const productId = req.params.productId;

  // Log the incoming request
  console.log(`Received request for coupons with product ID: ${productId}`);

  const sql =
    "SELECT coupon_id, coupon_code, discount_value, expiry_date FROM oneclick_coupons WHERE product_id = ? ORDER BY coupon_id DESC";
  db.query(sql, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching coupons:", err);
      return res.status(500).json({ message: "Error fetching coupons" });
    }

    // Log the results fetched
    console.log(
      `Fetched ${results.length} coupons for product ID: ${productId}`
    );
    res.status(200).json({ coupons: results });
  });
});

// Update Coupon Route
app.put("/backend/edit/coupons/:id", (req, res) => {
  const { id } = req.params; // Coupon ID from URL
  const { coupon_code, expiry_date, couponValue } = req.body; // Get data from request body

  // SQL query to update coupon
  const query =
    "UPDATE oneclick_coupons SET discount_value = ?, coupon_code = ?, expiry_date = ? WHERE coupon_id = ?";
  const values = [couponValue, coupon_code, expiry_date, id];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error updating coupon:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json({ message: "Coupon updated successfully" });
  });
});

// Delete Coupon Route
app.delete("/backend/deletecoupons/:id", (req, res) => {
  const { id } = req.params; // Coupon ID from URL

  // SQL query to delete coupon
  const query = "DELETE FROM oneclick_coupons WHERE coupon_id = ?";

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting coupon:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted successfully" });
  });
});

//////////////////////////////////////
// Fetch all notifications ordered by created_at
app.get("/backend/notifications", (req, res) => {
  db.query(
    "SELECT * FROM oneclick_notifications ORDER BY created_at DESC",
    (err, results) => {
      if (err) {
        console.error("Error fetching notifications:", err);
        return res
          .status(500)
          .json({ message: "Error fetching notifications" });
      }
      res.json(results);
    }
  );
});

// Mark notification as read
app.patch("/backend/notifications/:id/read", (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE oneclick_notifications SET is_read = TRUE WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        console.error("Error marking notification as read:", err);
        return res.status(500).json({ message: "Error updating notification" });
      }
      res.sendStatus(200);
    }
  );
});

// Delete notifications older than 15 days
// Delete notifications older than 15 days
app.delete("/backend/notifications/delete-old", (req, res) => {
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

  db.query(
    "DELETE FROM oneclick_notifications WHERE created_at < ?",
    [fifteenDaysAgo],
    (err) => {
      if (err) {
        console.error("Error deleting old notifications:", err);
        return res
          .status(500)
          .json({ message: "Error deleting old notifications" });
      }
      res.sendStatus(200);
    }
  );
});

// Mark all notifications as read
app.patch("/backend/notifications/mark-all-read", (req, res) => {
  // Query to update all notifications as read (set `is_read` to TRUE)
  db.query("UPDATE oneclick_notifications SET is_read = 1", (err, results) => {
    if (err) {
      console.error("Error marking all notifications as read:", err);
      return res.status(500).json({ message: "Error updating notifications" });
    }
    res.sendStatus(200); // Successfully marked all notifications as read
  });
});
////////common coupon code//////////

// Get all coupons
app.get("/backend/api/fetchcoupons", (req, res) => {
  console.log("Fetching all coupons...");

  // Query to fetch coupons
  db.query(
    "SELECT * FROM oneclick_common_coupon ORDER BY id DESC LIMIT 1",
    (err, results) => {
      if (err) {
        console.error("Error fetching coupons:", err);
        return res
          .status(500)
          .json({ error: "Failed to fetch coupons", details: err });
      }

      // Log the fetched results
      console.log("Fetched coupons successfully:", results);

      if (results.length > 0) {
        // Send the coupon data as a JSON response
        res.json(results);
      } else {
        // Handle case where no coupons are found
        console.log("No coupons found in database.");
        res.status(404).json({ error: "No coupons found" });
      }
    }
  );
});

// Add a new coupon
app.post("/backend/api/addcoupons", (req, res) => {
  const { name, value, minPurchaseLimit } = req.body;
  console.log("Adding new coupon:", { name, value });
  db.query(
    "INSERT INTO oneclick_common_coupon (name, value, min_purchase_limit) VALUES (?, ?, ?)",
    [name, value, minPurchaseLimit],
    (err, results) => {
      if (err) {
        console.error("Error adding coupon:", err);
        return res.status(500).json(err);
      }
      console.log("Added new coupon successfully:", results.insertId);
      res.json({ id: results.insertId, name, value });
    }
  );
});

// Update a coupon
app.put("/backend/api/editcoupons/:id", (req, res) => {
  const { id } = req.params;
  const { name, value, minPurchaseLimit } = req.body;
  console.log("Updating coupon:", { id, name, value, minPurchaseLimit });
  db.query(
    "UPDATE oneclick_common_coupon SET min_purchase_limit = ? , name = ?, value = ? WHERE id = ?",
    [minPurchaseLimit, name, value, id],
    (err) => {
      if (err) {
        console.error("Error updating coupon:", err);
        return res.status(500).json(err);
      }
      console.log("Coupon updated successfully:", id);
      res.json({ message: "Coupon updated successfully" });
    }
  );
});

// Delete a coupon
app.delete("/backend/api/deletecoupons/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Deleting coupon with ID: ${id}`);
  db.query("DELETE FROM oneclick_common_coupon WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting coupon:", err);
      return res.status(500).json(err);
    }
    console.log("Deleted coupon successfully:", id);
    res.json({ message: "Coupon deleted successfully" });
  });
});
///////////staff logins///////////////

// Get all staff
app.get("/backend/api/fetchstaff", (req, res) => {
  const query = "SELECT * FROM oneclick_staff ORDER BY id DESC";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new staff
app.post("/backend/api/addstaff", (req, res) => {
  const { staffname, username, password, status } = req.body;
  const query =
    "INSERT INTO oneclick_staff (staffname, username, password, status) VALUES (?, ?, ?, ?)";
  db.query(query, [staffname, username, password, status], (err, results) => {
    if (err) throw err;
    res.json({ id: results.insertId, staffname, username, password, status });
  });
});

app.put("/backend/api/updatestaff/:id", (req, res) => {
  const { staffname, username, password, status } = req.body;
  const staffId = req.params.id;

  const query = `
    UPDATE oneclick_staff 
    SET staffname = ?, username = ?, password = ?, status = ? 
    WHERE id = ?
  `;

  db.query(
    query,
    [staffname, username, password, status, staffId],
    (err, results) => {
      if (err) {
        console.error("Error updating staff:", err);
        return res.status(500).json({ message: "Failed to update staff." });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Staff not found" });
      }

      res.json({
        message: "Staff updated successfully",
        staff: { id: staffId, staffname, username, password, status },
      });
    }
  );
});

// Delete a staff
app.delete("/backend/api/deletestaff/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Staff ID is required" });
  }

  const query = "DELETE FROM oneclick_staff WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting staff:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });
  });
});

/////////frequent products///////////
// GET: Fetch accessories by category
// GET: Fetch accessories by category
app.get("/backend/getcomputeraccessories", (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ error: "productId is required." });
  }

  const fetchAdditionalAccessoriesSQL = `
    SELECT additional_accessories 
    FROM oneclick_product_category 
    WHERE id = ?
  `;

  db.query(
    fetchAdditionalAccessoriesSQL,
    [productId],
    (err, additionalAccessoriesResult) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching additional accessories." });
      }

      const additionalAccessories = additionalAccessoriesResult.length
        ? additionalAccessoriesResult[0].additional_accessories
        : null;

      const fetchCategoryAccessoriesSQL = `
      SELECT * 
      FROM oneclick_product_category 
      WHERE category = 'ComputerAccessories'
    `;

      db.query(
        fetchCategoryAccessoriesSQL,
        (err, categoryAccessoriesResult) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error fetching accessories for category." });
          }

          const result = {
            additionalAccessories,
            categoryAccessories: categoryAccessoriesResult,
          };

          res.status(200).json(result);
        }
      );
    }
  );
});

app.get("/backend/getmobileaccessories", (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ error: "productId is required." });
  }

  const fetchAdditionalAccessoriesSQL = `
    SELECT additional_accessories 
    FROM oneclick_product_category 
    WHERE id = ?
  `;

  db.query(
    fetchAdditionalAccessoriesSQL,
    [productId],
    (err, additionalAccessoriesResult) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching additional accessories." });
      }

      const additionalAccessories = additionalAccessoriesResult.length
        ? additionalAccessoriesResult[0].additional_accessories
        : null;

      const fetchCategoryAccessoriesSQL = `
      SELECT * 
      FROM oneclick_product_category 
      WHERE category = 'MobileAccessories'
    `;

      db.query(
        fetchCategoryAccessoriesSQL,
        (err, categoryAccessoriesResult) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error fetching accessories for category." });
          }

          const result = {
            additionalAccessories,
            categoryAccessories: categoryAccessoriesResult,
          };

          res.status(200).json(result);
        }
      );
    }
  );
});

app.get("/backend/getcctvaccessories", (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ error: "productId is required." });
  }

  const fetchAdditionalAccessoriesSQL = `
    SELECT additional_accessories 
    FROM oneclick_product_category 
    WHERE id = ?
  `;

  db.query(
    fetchAdditionalAccessoriesSQL,
    [productId],
    (err, additionalAccessoriesResult) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching additional accessories." });
      }

      const additionalAccessories = additionalAccessoriesResult.length
        ? additionalAccessoriesResult[0].additional_accessories
        : null;

      const fetchCategoryAccessoriesSQL = `
      SELECT * 
      FROM oneclick_product_category 
      WHERE category = 'CCTVAccessories'
    `;

      db.query(
        fetchCategoryAccessoriesSQL,
        (err, categoryAccessoriesResult) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error fetching accessories for category." });
          }

          const result = {
            additionalAccessories,
            categoryAccessories: categoryAccessoriesResult,
          };

          res.status(200).json(result);
        }
      );
    }
  );
});

app.get("/backend/getprinteraccessories", (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ error: "productId is required." });
  }

  const fetchAdditionalAccessoriesSQL = `
    SELECT additional_accessories 
    FROM oneclick_product_category 
    WHERE id = ?
  `;

  db.query(
    fetchAdditionalAccessoriesSQL,
    [productId],
    (err, additionalAccessoriesResult) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error fetching additional accessories." });
      }

      const additionalAccessories = additionalAccessoriesResult.length
        ? additionalAccessoriesResult[0].additional_accessories
        : null;

      const fetchCategoryAccessoriesSQL = `
      SELECT * 
      FROM oneclick_product_category 
      WHERE category = 'PrinterAccessories'
    `;

      db.query(
        fetchCategoryAccessoriesSQL,
        (err, categoryAccessoriesResult) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error fetching accessories for category." });
          }

          const result = {
            additionalAccessories,
            categoryAccessories: categoryAccessoriesResult,
          };

          res.status(200).json(result);
        }
      );
    }
  );
});

app.post("/backend/addfrequentlybuy", (req, res) => {
  const { id, accessoryIds } = req.body;
  if (!id) return res.status(400).send("Product ID is required.");

  const sql = `UPDATE oneclick_product_category SET additional_accessories = ? WHERE id = ?`;
  db.query(sql, [accessoryIds || null, id], (err) => {
    if (err) return res.status(500).send("Error updating accessories.");
    return res.send("Accessories updated successfully.");
  });
});

/////////////offerprice///////////////
// POST: Create a new offer
// POST: Add a new offer
app.post("/backend/api/products/addoffer", (req, res) => {
  const { productId, offer_start_time, offer_end_time, offer_price } = req.body;

  console.log("Received request to add offer:", req.body); // Log received data

  const sql = `
    INSERT INTO oneclick_product_category (id, offer_start_time, offer_end_time, offer_price)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [productId, offer_start_time, offer_end_time, offer_price],
    (err, result) => {
      if (err) {
        console.error("Error creating offer:", err); // Log error
        return res.status(500).json({ error: "Error creating offer" });
      }
      console.log("Offer created successfully for productId:", productId); // Log success
      res.status(200).json({ message: "Offer created successfully" });
    }
  );
});

// PUT: Update an existing offer
app.put("/backend/api/products/updateoffer/:id", (req, res) => {
  const { offer_start_time, offer_end_time, offer_price } = req.body;
  const { id } = req.params;

  console.log(
    `Received request to update offer for productId: ${id}`,
    req.body
  ); // Log received data

  const sql = `
    UPDATE oneclick_product_category
    SET offer_start_time = ?, offer_end_time = ?, offer_price = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [offer_start_time, offer_end_time, offer_price, id],
    (err, result) => {
      if (err) {
        console.error(`Error updating offer for productId: ${id}`, err); // Log error
        return res.status(500).json({ error: "Error updating offer" });
      }
      console.log(`Offer updated successfully for productId: ${id}`); // Log success
      res.status(200).json({ message: "Offer updated successfully" });
    }
  );
});

// DELETE: Delete an offer
app.delete("/backend/api/products/deleteoffer/:id", (req, res) => {
  const { id } = req.params;

  console.log(`Received request to delete offer for productId: ${id}`); // Log received productId

  const sql = `
    DELETE FROM oneclick_product_category WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(`Error deleting offer for productId: ${id}`, err); // Log error
      return res.status(500).json({ error: "Error deleting offer" });
    }
    console.log(`Offer deleted successfully for productId: ${id}`); // Log success
    res.status(200).json({ message: "Offer deleted successfully" });
  });
});

// GET: Get offer details for a product
app.get("/backend/api/products/fetchoffer/:id", (req, res) => {
  const { id } = req.params;

  console.log(`Received request to fetch offer for productId: ${id}`);

  const sql = `
    SELECT *,
           DATE_FORMAT(offer_start_time, '%Y-%m-%dT%H:%i') AS offer_start_time,
           DATE_FORMAT(offer_end_time, '%Y-%m-%dT%H:%i') AS offer_end_time
    FROM oneclick_product_category 
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(`Error fetching offer details for productId: ${id}`, err);
      return res.status(500).json({ error: "Error fetching offer details" });
    }
    if (result.length === 0) {
      console.warn(`No offer found for productId: ${id}`);
      return res.status(404).json({ error: "Offer not found" });
    }
    console.log(`Offer details fetched successfully for productId: ${id}`);
    res.status(200).json(result[0]);
  });
});

///////////copyproduct//////////////

app.post("/backend/api/copy-product/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const newProdId = generateProductId();

    // Step 1: Get the original product details
    const getProductQuery = `SELECT * FROM oneclick_product_category WHERE id = ?`;
    db.query(getProductQuery, [productId], (err, productResult) => {
      if (err || productResult.length === 0) {
        console.error("Error fetching original product:", err);
        return res.status(500).json({ message: "Error fetching product" });
      }

      const originalProduct = productResult[0];

      // Step 2: Copy the product with a new ID
      const copyProductQuery = `
        INSERT INTO oneclick_product_category 
        (prod_id, prod_name, category, subtitle, prod_features, actual_price, prod_price, deliverycharge, offer_label, prod_img, productStatus)
        SELECT ?, prod_name, category, subtitle, prod_features, actual_price, prod_price, deliverycharge, offer_label, prod_img, productStatus
        FROM oneclick_product_category 
        WHERE id = ?
      `;

      db.query(
        copyProductQuery,
        [newProdId, productId],
        (copyErr, copyResult) => {
          if (copyErr) {
            console.error("Error copying product:", copyErr);
            return res
              .status(500)
              .json({ message: "Server error while copying product" });
          }

          // Step 3: Check if category is Mobiles or Computers
          if (
            originalProduct.category === "Mobiles" ||
            originalProduct.category === "Computers"
          ) {
            const fetchFeaturesQuery = `SELECT * FROM oneclick_mobile_features WHERE prod_id = ?`;

            db.query(
              fetchFeaturesQuery,
              [originalProduct.prod_id],
              (featureErr, featureResult) => {
                if (featureErr) {
                  console.error("Error fetching features:", featureErr);
                  return res
                    .status(500)
                    .json({ message: "Error fetching features" });
                }

                if (featureResult.length > 0) {
                  // Step 4: Insert features for the new product (handling all fields)
                  const features = featureResult[0]; // Assuming one feature set per product

                  const insertFeaturesQuery = `
                INSERT INTO oneclick_mobile_features 
                (prod_id, memory, storage, processor, camera, display, battery, os, network, others) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;

                  db.query(
                    insertFeaturesQuery,
                    [
                      newProdId,
                      features.memory,
                      features.storage,
                      features.processor,
                      features.camera,
                      features.display,
                      features.battery,
                      features.os,
                      features.network,
                      features.others,
                    ],
                    (insertErr) => {
                      if (insertErr) {
                        console.error("Error inserting features:", insertErr);
                        return res
                          .status(500)
                          .json({ message: "Error copying features" });
                      }

                      // Step 5: Success response with new product ID
                      return res.status(200).json({
                        message: "Product and features copied successfully",
                        newProductId: copyResult.insertId,
                      });
                    }
                  );
                } else {
                  // No features found, but product copied successfully
                  return res.status(200).json({
                    message:
                      "Product copied successfully (no features to copy)",
                    newProductId: copyResult.insertId,
                  });
                }
              }
            );
          } else {
            // Category is not Mobiles or Computers
            return res.status(200).json({
              message: "Product copied successfully",
              newProductId: copyResult.insertId,
            });
          }
        }
      );
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/backend/pending-payment", (req, res) => {
  const sql = "SELECT total_amount FROM oneclick_orders WHERE status != 'Paid'";

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching pending payments:", error);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json(results); // Return all pending payments data
  });
});

////////////Cancel process/////////

app.post("/backend/cancelOrder", (req, res) => {
  const { orderId } = req.body;

  console.log("Received orderId:", orderId);

  if (!orderId || typeof orderId !== "string" || !/^ORD\d{8,}$/.test(orderId)) {
    return res.status(400).json({ error: "Invalid Order ID format." });
  }

  const query = `
    UPDATE oneclick_orders
    SET delivery_status = 'Cancelled'
    WHERE unique_id = ? AND delivery_status != 'Cancelled'
  `;

  db.query(query, [orderId], (error, result) => {
    if (error) {
      console.error("Database error while cancelling order:", error);
      return res.status(500).json({ error: "Internal server error." }); //  Response is returned immediately
    }

    if (result.affectedRows > 0) {
      return res.json({ message: "Order successfully cancelled." }); //  Return added to prevent multiple responses
    }

    return res
      .status(404)
      .json({ error: "Order not found or already cancelled." }); //  Return added
  });
});

///////////new method for adding products//////////

// app.post("/api/add-product", (req, res) => {
//   const { name, image, mrp_price, selling_price, offer_label, subtitle, delivery_charge, category, features } = req.body;

//   const sql = `INSERT INTO oneclick_products (name, image, mrp_price, selling_price, offer_label, subtitle, delivery_charge, category, features)
//                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//   db.query(sql, [name, image, mrp_price, selling_price, offer_label, subtitle, delivery_charge, category, features], (err, result) => {
//     if (err) return res.status(500).json({ message: "Database Error", error: err });
//     res.json({ message: "Product added successfully" });
//   });
// });

//////////////////////////
// API endpoint to update the status
app.post("/backend/api/update-order-status", (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: "orderId and status are required." });
  }

  // SQL query to update the status
  const query = "UPDATE oneclick_orders SET status = ? WHERE unique_id = ?";
  db.query(query, [status, orderId], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res.status(500).json({ error: "Failed to update the status." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    return res.status(200).json({ message: "Status updated successfully!" });
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong." });
});

////////////////////////////////////
app.get("/backend/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

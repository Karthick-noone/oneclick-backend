const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5001;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS for all routes
// Middleware to parse JSON bodies
app.use(express.json());

// MySQL connection configuration
const dbConfig = {
  host: 'sql12.freesqldatabase.com',
  user: 'sql12730517',
  password: 'vhAGYSxNep',
  database: 'sql12730517',
};

// // MySQL connection configuration
// const dbConfig = {
//   host: 'sql12.freesqldatabase.com',
//   user: 'sql12730517',
//   password: 'vhAGYSxNep',
//   database: 'sql12730517',
// };


// Create a MySQL connection
const db = mysql.createConnection(dbConfig);

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Middleware to handle MySQL errors
db.on('error', (err) => {
  console.error('MySQL error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    // Reconnect if the connection is lost
    db.connect((err) => {
      if (err) {
        console.error('Error reconnecting to MySQL:', err);
      } else {
        console.log('Reconnected to MySQL');
      }
    });
  } else {
    throw err;
  }
});


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

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "karthick.mindtek@gmail.com",
    pass: "clrs yxco eozh idqd",
  },
});

// Route to send email
app.post("/send-email", (req, res) => {
  const { name, number, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: "karthick.mindtek@gmail.com",
    subject: subject,
    text: `
      Name: ${name}
      Number: ${number}
      Email: ${email}
      Message: ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res
        .status(500)
        .json({ error: "Failed to send email", details: error.message });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
});

app.post('/submit-careers-form', (req, res) => {
  const { name, email, phone, position, startDate, resumeLink } = req.body;
  console.log("req.body", req.body);

  // Combine first and last name into a single name field
  // const name = `${firstName} ${lastName}`;

  // Check if email already exists
  const checkEmailQuery = 'SELECT * FROM careers WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ message: 'Error checking email.' });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const insertQuery = `
      INSERT INTO careers (name, email, phone, position, startDate, resumeLink)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [name, email, phone, position, startDate, resumeLink], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ message: 'Error submitting form.' });
      }
      res.status(200).json({ message: 'Form submitted successfully!' });
    });
  });
});

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Function to generate the next user_id
  const generateUserId = (callback) => {
    // Query to get the latest user_id
    db.query('SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1', (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return callback(err);
      }

      let nextUserId = 'usr000001'; // Default ID if no previous ID exists

      if (results.length > 0 && results[0].user_id) {
        const lastUserId = results[0].user_id;
        const numberPart = parseInt(lastUserId.slice(3)); // Extract the numeric part
        const newNumberPart = numberPart + 1;
        
        // Ensure the ID is padded to 6 digits
        nextUserId = `usr${newNumberPart.toString().padStart(6, '0')}`;
      }

      callback(null, nextUserId);
    });
  };

  // Check if the email already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate the next user_id and insert the new user
    generateUserId((err, userId) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      const query = 'INSERT INTO users (username, email, password, user_id) VALUES (?, ?, ?, ?)';
      db.query(query, [username, email, password, userId], (err) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json({ message: 'User created successfully' });
      });
    });
  });
});
// Signup Route
app.post('/adminsignup', (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).send('All fields are required');
    }
  
    // Check if the email already exists
    db.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Server error');
      }
  
      if (results.length > 0) {
        return res.status(400).send('Email already registered');
      }
  
      // If email doesn't exist, proceed to insert the new user
      const query = 'INSERT INTO admin (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [username, email, password], (err) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).send('Server error');
        }
        res.status(200).send('User created successfully');
      });
    });
  });


// Login Route
app.post("/login", (req, res) => {
    console.log("Received login request:", req.body); // Log incoming request
  
    const { username, password } = req.body;
  
    if (!username || !password) {
      console.log("Missing fields in login request"); // Log missing fields
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
      if (err) {
        console.error('Database error:', err); // Log database errors
        return res.status(500).json({ message: "Database error" });
      }
  
      if (results.length === 0) {
        console.log("User not found:", username); // Log user not found
        return res.status(400).json({ message: "User not found" });
      }
  
      const user = results[0];
  
      // Compare plain text passwords
      if (password === user.password) {
        const { username, email, user_id  } = user;
        return res.status(200).json({ username, email, user_id , message: "Login successful" });
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    });
  });
// Login Route
app.post("/adminlogin", (req, res) => {
    console.log("Received login request:", req.body); // Log incoming request
  
    const { username, password } = req.body;
  
    if (!username || !password) {
      console.log("Missing fields in login request"); // Log missing fields
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    db.query("SELECT * FROM admin WHERE username = ?", [username], (err, results) => {
      if (err) {
        console.error('Database error:', err); // Log database errors
        return res.status(500).json({ message: "Database error" });
      }
  
      if (results.length === 0) {
        console.log("User not found:", username); // Log user not found
        return res.status(400).json({ message: "User not found" });
      }
  
      const user = results[0];
  
      // Compare plain text passwords
      if (password === user.password) {
        const { username, email } = user;
        return res.status(200).json({ username, email, message: "Login successful" });
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    });
  });
  
// Forgot password route
app.post('/forgot-password', (req, res) => {
    const { email, newPassword } = req.body;
  
    if (!email || !newPassword) {
      return res.status(400).send('Email and new password are required');
    }
  
    // Check if the user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Server error');
      }
  
      if (results.length === 0) {
        return res.status(400).send('User not found');
      }
  
      // Update the password
      db.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email], (err) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).send('Server error');
        }
        res.status(200).send('Password updated successfully');
      });
    });
  });


// Forgot password route
app.post('/adminforgotpassword', (req, res) => {
    const { email, newPassword } = req.body;
  
    if (!email || !newPassword) {
      return res.status(400).send('Email and new password are required');
    }
  
    // Check if the user exists
    db.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Server error');
      }
  
      if (results.length === 0) {
        return res.status(400).send('User not found');
      }
  
      // Update the password
      db.query('UPDATE admin SET password = ? WHERE email = ?', [newPassword, email], (err) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).send('Server error');
        }
        res.status(200).send('Password updated successfully');
      });
    });
  });


// Verify user endpoint
app.post('/verify-user', (req, res) => {
  const { email, username } = req.body;

  // Check if email and username are provided
  if (!email || !username) {
    return res.status(400).json({ exists: false, message: 'Email and username are required' });
  }

  // Query to check if the user exists
  db.query('SELECT * FROM users WHERE email = ? AND username = ?', [email, username], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ exists: false, message: 'Internal Server Error' });
    }

    // Check if user was found
    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});

// Update user's cart endpoint
app.post('/update-user-cart', (req, res) => {
  const { email, username, product } = req.body;

  if (!email || !username || !product) {
    return res.status(400).json({ error: 'Email, username, and product are required' });
  }

  // Step 1: Retrieve the current cart
  db.query('SELECT addtocart FROM users WHERE email = ? AND username = ?', [email, username], (err, results) => {
    if (err) {
      console.error('Error retrieving cart:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
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

    db.query('UPDATE users SET addtocart = ? WHERE email = ? AND username = ?', [updatedCart, email, username], (err) => {
      if (err) {
        console.error('Error updating cart:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ success: true });
    });
  });
});



// Update user's wishlist endpoint
app.post('/update-user-wishlist', (req, res) => {
  const { email, username, product, action } = req.body;

  if (!email || !username || !product || !action) {
    return res.status(400).json({ error: 'Email, username, product, and action are required' });
  }

  // Step 1: Retrieve the current wishlist
  db.query('SELECT wishlist FROM users WHERE email = ? AND username = ?', [email, username], (err, results) => {
    if (err) {
      console.error('Error retrieving wishlist:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    let wishlist = results[0].wishlist || [];

    // Step 2: Update the wishlist in application code
    try {
      wishlist = JSON.parse(wishlist);
    } catch (parseError) {
      wishlist = [];
    }

    if (action === 'add') {
      // Add product to wishlist
      if (!wishlist.find(item => item.id === product.id)) {
        wishlist.push(product);
      }
    } else if (action === 'remove') {
      // Remove product from wishlist
      wishlist = wishlist.filter(item => item.id !== product.id);
    }

    // Step 3: Save the updated wishlist
    const updatedWishlist = JSON.stringify(wishlist);

    db.query('UPDATE users SET wishlist = ? WHERE email = ? AND username = ?', [updatedWishlist, email, username], (err) => {
      if (err) {
        console.error('Error updating wishlist:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ success: true });
    });
  });
});

// API endpoint to get cart items
app.get('/cart', (req, res) => {
  const { email, username } = req.query;

  if (!email || !username) {
    return res.status(400).json({ error: 'Email and username are required' });
  }

  const query = 'SELECT * FROM users WHERE email = ? AND username = ?';
  db.query(query, [email, username], (err, results) => {
    if (err) {
      console.error('Error fetching cart items:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

// API endpoint to get wishlist items
app.get('/wishlist', (req, res) => {
  const { email, username } = req.query;

  if (!email || !username) {
    return res.status(400).json({ error: 'Email and username are required' });
  }

  const query = 'SELECT * FROM users WHERE email = ? AND username = ?';
  db.query(query, [email, username], (err, results) => {
    if (err) {
      console.error('Error fetching wishlist items:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

app.post('/remove-from-cart', (req, res) => {
  const { email, itemId } = req.body;

  if (!email || !itemId) {
    return res.status(400).json({ message: "Email and itemId are required" });
  }

  // SQL query to get the addtocart column from the users table
  const getQuery = 'SELECT addtocart FROM users WHERE email = ?';

  db.query(getQuery, [email], (err, results) => {
    if (err) {
      console.error("Error retrieving cart items:", {
        message: err.message,
        query: getQuery,
        params: [email]
      });

      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let cartItems;
    try {
      // Check if `addtocart` is null or empty and assign an empty array
      const addToCart = results[0].addtocart;
      if (!addToCart) {
        cartItems = [];
      } else {
        cartItems = JSON.parse(addToCart);
      }
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing cart items", error: parseError.message });
    }

    // Filter out the item to be removed
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);

    // SQL query to update the addtocart column with the new JSON data
    const updateQuery = 'UPDATE users SET addtocart = ? WHERE email = ?';

    db.query(updateQuery, [JSON.stringify(updatedCartItems), email], (err, results) => {
      if (err) {
        console.error("Error updating cart items:", {
          message: err.message,
          query: updateQuery,
          params: [JSON.stringify(updatedCartItems), email]
        });
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Failed to update cart" });
      }

      res.status(200).json({ message: "Item removed from cart" });
    });
  });
});


app.post('/remove-from-wishlist', (req, res) => {
  const { email, itemId } = req.body;

  if (!email || !itemId) {
    return res.status(400).json({ message: "Email and itemId are required" });
  }

  // SQL query to get the wishlist column from the users table
  const getQuery = 'SELECT wishlist FROM users WHERE email = ?';

  db.query(getQuery, [email], (err, results) => {
    if (err) {
      console.error("Error retrieving wishlist items:", {
        message: err.message,
        query: getQuery,
        params: [email]
      });
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let wishlistItems;
    try {
      wishlistItems = JSON.parse(results[0].wishlist);
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing wishlist items", error: parseError.message });
    }

    // Filter out the item to be removed
    const updatedWishlistItems = wishlistItems.filter(item => item.id !== itemId);

    // SQL query to update the wishlist column with the new JSON data
    const updateQuery = 'UPDATE users SET wishlist = ? WHERE email = ?';

    db.query(updateQuery, [JSON.stringify(updatedWishlistItems), email], (err, results) => {
      if (err) {
        console.error("Error updating wishlist items:", {
          message: err.message,
          query: updateQuery,
          params: [JSON.stringify(updatedWishlistItems), email]
        });
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Failed to update wishlist" });
      }

      res.status(200).json({ message: "Item removed from wishlist" });
    });
  });
});



app.get('/api/products', (req, res) => {
  const queries = [
   "SELECT * FROM tv ORDER BY id DESC LIMIT 1",
"SELECT * FROM mobiles ORDER BY id DESC LIMIT 1",
"SELECT * FROM headphones ORDER BY id DESC LIMIT 1",
"SELECT * FROM cctv ORDER BY id DESC LIMIT 1",
"SELECT * FROM computers ORDER BY id DESC LIMIT 1",
"SELECT * FROM watch ORDER BY id DESC LIMIT 1",
"SELECT * FROM printers ORDER BY id DESC LIMIT 1",
"SELECT * FROM speakers ORDER BY id DESC LIMIT 1",
"SELECT * FROM mobileaccessories ORDER BY id DESC LIMIT 1",
"SELECT * FROM computeraccessories ORDER BY id DESC LIMIT 1"
  ];

  // Create an array of promises for each query
  const promises = queries.map(query => new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // Resolve with the first row of the result
    });
  }));

  // Execute all promises and return results
  Promise.all(promises)
    .then(results => {
      res.json(results); // Send the results as JSON
    })
    .catch(err => {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error' });
    });
});
///////////////////////////admin dashbord api's/////////////////////////////////////////////////////////

app.use('/uploads', express.static('uploads'));



// Set up multer for file uploads in the `/computers` endpoint
const computersStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/computers directory exists
    const dir = 'uploads/computers';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const computersUpload = multer({ storage: computersStorage });

const generateProductId = () => {
  const prefix = 'PRD';
  const randomDigits = Math.floor(10000 + Math.random() * 90000); // generates a random 5-digit number
  return `${prefix}${randomDigits}`;
};

// Endpoint to add a new product
app.post('/computers', computersUpload.single('image'), (req, res) => {
  const { name, features, price } = req.body;
  const image = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO computers (prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set
  const prod_id = generateProductId();

  db.query(sql, [prod_id, name, features, price, image, status], (err, result) => {
    if (err) throw err;
    res.send('Product added');
  });
});

// Route to fetch all products
app.get('/fetchcomputers', (req, res) => {
  const sql = 'SELECT * FROM computers ';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update product route
app.put('/updatecomputers/:id', computersUpload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, features, price, status } = req.body;
  const image = req.file ? req.file.filename : null;
console.log("req.body",req.body)
  let sql = 'UPDATE computers SET prod_name = ?, prod_features = ?, prod_price = ?, status = ?';
  let values = [name, features, price, status];

  if (image) {
    // Update image and remove the old image file
    const oldImageQuery = 'SELECT prod_img FROM computers WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);
      const oldImage = results[0]?.prod_img;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/computers/${oldImage}`, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      sql += ', prod_img = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deletecomputers/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM computers WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Product deleted');
  });
});


////////////////mobiles////////////////////////////



// Set up multer for file uploads in the `/computers` endpoint
const mobilesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/mobiles directory exists
    const dir = 'uploads/mobiles';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const mobilesUpload = multer({ storage: mobilesStorage });



// Endpoint to add a new product
app.post('/mobiles', mobilesUpload.single('image'), (req, res) => {
  const { name, features, price } = req.body;
  const image = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO mobiles (prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set
  const prod_id = generateProductId();

  db.query(sql, [prod_id, name, features, price, image, status], (err, result) => {
    if (err) throw err;
    res.send('Product added');
  });
});

// Route to fetch all products
app.get('/fetchmobiles', (req, res) => {
  const sql = 'SELECT * FROM mobiles ';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update product route
app.put('/updatemobiles/:id', mobilesUpload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, features, price, status } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE mobiles SET prod_name = ?, prod_features = ?, prod_price = ?, status = ?';
  let values = [name, features, price, status];

  if (image) {
    // Update image and remove the old image file
    const oldImageQuery = 'SELECT prod_img FROM mobiles WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);
      const oldImage = results[0]?.prod_img;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/mobiles/${oldImage}`, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      sql += ', prod_img = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deletemobiles/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM mobiles WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Product deleted');
  });
});
///////////cctv///////////////////////////////////////////////



// Set up multer for file uploads in the `/computers` endpoint
const cctvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/cctv directory exists
    const dir = 'uploads/cctv';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const cctvUpload = multer({ storage: cctvStorage });



// Endpoint to add a new product
app.post('/cctv', cctvUpload.single('image'), (req, res) => {
  const { name, features, price } = req.body;
  const image = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO cctv (prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set
  const prod_id = generateProductId();

  db.query(sql, [prod_id, name, features, price, image, status], (err, result) => {
    if (err) throw err;
    res.send('Product added');
  });
});

// Route to fetch all products
app.get('/fetchcctv', (req, res) => {
  const sql = 'SELECT * FROM cctv ';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update product route
app.put('/updatecctv/:id', cctvUpload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, features, price, status } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE cctv SET prod_name = ?, prod_features = ?, prod_price = ?, status = ?';
  let values = [name, features, price, status];

  if (image) {
    // Update image and remove the old image file
    const oldImageQuery = 'SELECT prod_img FROM cctv WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);
      const oldImage = results[0]?.prod_img;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/cctv/${oldImage}`, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      sql += ', prod_img = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deletecctv/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM cctv WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Product deleted');
  });
});


/////////////////////////tv///////////////////



// Set up multer for file uploads in the `/computers` endpoint
const tvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/tv directory exists
    const dir = 'uploads/tv';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const tvUpload = multer({ storage: tvStorage });



// Endpoint to add a new product
app.post('/tv', tvUpload.single('image'), (req, res) => {
  const { name, features, price } = req.body;
  const image = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO tv (prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set
  const prod_id = generateProductId();

  db.query(sql, [prod_id, name, features, price, image, status], (err, result) => {
    if (err) throw err;
    res.send('Product added');
  });
});

// Route to fetch all products
app.get('/fetchtv', (req, res) => {
  const sql = 'SELECT * FROM tv ';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update product route
app.put('/updatetv/:id', tvUpload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, features, price, status } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE tv SET prod_name = ?, prod_features = ?, prod_price = ?, status = ?';
  let values = [name, features, price, status];

  if (image) {
    // Update image and remove the old image file
    const oldImageQuery = 'SELECT prod_img FROM tv WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);
      const oldImage = results[0]?.prod_img;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/tv/${oldImage}`, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      sql += ', prod_img = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deletetv/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM tv WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Product deleted');
  });
});

////////////////headphones///////////////



// Set up multer for file uploads in the `/computers` endpoint
const headphonesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/headphones directory exists
    const dir = 'uploads/headphones';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const headphonesUpload = multer({ storage: headphonesStorage });



// Endpoint to add a new product
app.post('/headphones', headphonesUpload.single('image'), (req, res) => {
  const { name, features, price } = req.body;
  const image = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO headphones (prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set
  const prod_id = generateProductId();

  db.query(sql, [prod_id, name, features, price, image, status], (err, result) => {
    if (err) throw err;
    res.send('Product added');
  });
});

// Route to fetch all products
app.get('/fetchheadphones', (req, res) => {
  const sql = 'SELECT * FROM headphones ';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update product route
app.put('/updateheadphones/:id', headphonesUpload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, features, price, status } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE headphones SET prod_name = ?, prod_features = ?, prod_price = ?, status = ?';
  let values = [name, features, price, status];

  if (image) {
    // Update image and remove the old image file
    const oldImageQuery = 'SELECT prod_img FROM headphones WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);
      const oldImage = results[0]?.prod_img;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/headphones/${oldImage}`, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      sql += ', prod_img = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deleteheadphones/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM headphones WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Product deleted');
  });
});

/////////////speaker////////////////



// Set up multer for file uploads in the `/computers` endpoint
const speakersStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/speakers directory exists
    const dir = 'uploads/speakers';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const speakersUpload = multer({ storage: speakersStorage });



// Endpoint to add a new product
app.post('/speakers', speakersUpload.single('image'), (req, res) => {
  const { name, features, price } = req.body;
  const image = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO speakers (prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set
  const prod_id = generateProductId();

  db.query(sql, [prod_id, name, features, price, image, status], (err, result) => {
    if (err) throw err;
    res.send('Product added');
  });
});

// Route to fetch all products
app.get('/fetchspeakers', (req, res) => {
  const sql = 'SELECT * FROM speakers ';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update product route
app.put('/updatespeakers/:id', speakersUpload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, features, price, status } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE speakers SET prod_name = ?, prod_features = ?, prod_price = ?, status = ?';
  let values = [name, features, price, status];

  if (image) {
    // Update image and remove the old image file
    const oldImageQuery = 'SELECT prod_img FROM speakers WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);
      const oldImage = results[0]?.prod_img;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/speakers/${oldImage}`, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      sql += ', prod_img = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deletespeakers/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM speakers WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Product deleted');
  });
});
/////////////watch///////////////////////


// Set up multer for file uploads in the `/computers` endpoint
const watchStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/watch directory exists
    const dir = 'uploads/watch';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const watchUpload = multer({ storage: watchStorage });



// Endpoint to add a new product
app.post('/watch', watchUpload.single('image'), (req, res) => {
  const { name, features, price } = req.body;
  const image = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO watch (prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set
  const prod_id = generateProductId();

  db.query(sql, [prod_id, name, features, price, image, status], (err, result) => {
    if (err) throw err;
    res.send('Product added');
  });
});

// Route to fetch all products
app.get('/fetchwatch', (req, res) => {
  const sql = 'SELECT * FROM watch ';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update product route
app.put('/updatewatch/:id', watchUpload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, features, price, status } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE watch SET prod_name = ?, prod_features = ?, prod_price = ?, status = ?';
  let values = [name, features, price, status];

  if (image) {
    // Update image and remove the old image file
    const oldImageQuery = 'SELECT prod_img FROM watch WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);
      const oldImage = results[0]?.prod_img;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/watch/${oldImage}`, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      sql += ', prod_img = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deletewatch/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM watch WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Product deleted');
  });
});

//////////////printers//////////////////////////////


// Set up multer for file uploads in the `/computers` endpoint
const printersStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/printers directory exists
    const dir = 'uploads/printers';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const printersUpload = multer({ storage: printersStorage });



// Endpoint to add a new product
app.post('/printers', printersUpload.single('image'), (req, res) => {
  const { name, features, price } = req.body;
  const image = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO printers (prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set
  const prod_id = generateProductId();

  db.query(sql, [prod_id, name, features, price, image, status], (err, result) => {
    if (err) throw err;
    res.send('Product added');
  });
});

// Route to fetch all products
app.get('/fetchprinters', (req, res) => {
  const sql = 'SELECT * FROM printers ';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update product route
app.put('/updateprinters/:id', printersUpload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, features, price, status } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE printers SET prod_name = ?, prod_features = ?, prod_price = ?, status = ?';
  let values = [name, features, price, status];

  if (image) {
    // Update image and remove the old image file
    const oldImageQuery = 'SELECT prod_img FROM printers WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);
      const oldImage = results[0]?.prod_img;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/printers/${oldImage}`, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      sql += ', prod_img = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deleteprinters/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM printers WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Product deleted');
  });
});

/////////////mobileaccessories////////////////////


// Set up multer for file uploads in the `/computers` endpoint
const mobileaccessoriesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/mobileaccessories directory exists
    const dir = 'uploads/mobileaccessories';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const mobileaccessoriesUpload = multer({ storage: mobileaccessoriesStorage });



// Endpoint to add a new product
app.post('/mobileaccessories', mobileaccessoriesUpload.single('image'), (req, res) => {
  const { name, features, price } = req.body;
  const image = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO mobileaccessories (prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set
  const prod_id = generateProductId();

  db.query(sql, [prod_id, name, features, price, image, status], (err, result) => {
    if (err) throw err;
    res.send('Product added');
  });
});

// Route to fetch all products
app.get('/fetchmobileaccessories', (req, res) => {
  const sql = 'SELECT * FROM mobileaccessories ';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update product route
app.put('/updatemobileaccessories/:id', mobileaccessoriesUpload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, features, price, status } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE mobileaccessories SET prod_name = ?, prod_features = ?, prod_price = ?, status = ?';
  let values = [name, features, price, status];

  if (image) {
    // Update image and remove the old image file
    const oldImageQuery = 'SELECT prod_img FROM mobileaccessories WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);
      const oldImage = results[0]?.prod_img;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/mobileaccessories/${oldImage}`, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      sql += ', prod_img = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deletemobileaccessories/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM mobileaccessories WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Product deleted');
  });
});

///////////////////////////computeraccessories///////////////


// Set up multer for file uploads in the `/computers` endpoint
const computeraccessoriesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads/computeraccessories directory exists
    const dir = 'uploads/computeraccessories';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir); // Directory to save the images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const computeraccessoriesUpload = multer({ storage: computeraccessoriesStorage });



// Endpoint to add a new product
app.post('/computeraccessories', computeraccessoriesUpload.single('image'), (req, res) => {
  const { name, features, price } = req.body;
  const image = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO computeraccessories (prod_id, prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set
  const prod_id = generateProductId();

  db.query(sql, [prod_id, name, features, price, image, status], (err, result) => {
    if (err) throw err;
    res.send('Product added');
  });
});

// Route to fetch all products
app.get('/fetchcomputeraccessories', (req, res) => {
  const sql = 'SELECT * FROM computeraccessories ';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update product route
app.put('/updatecomputeraccessories/:id', computeraccessoriesUpload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, features, price, status } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE computeraccessories SET prod_name = ?, prod_features = ?, prod_price = ?, status = ?';
  let values = [name, features, price, status];

  if (image) {
    // Update image and remove the old image file
    const oldImageQuery = 'SELECT prod_img FROM computeraccessories WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) return res.status(500).send(err);
      const oldImage = results[0]?.prod_img;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/computeraccessories/${oldImage}`, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      sql += ', prod_img = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deletecomputeraccessories/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM computeraccessories WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Product deleted');
  });
});

//////////////////edithomepage//////////////////////////////

// Set up multer for file uploads (multiple files)
const edithomepageStorageMultiple = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/edithomepage';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const edithomepageUploadMultiple = multer({ storage: edithomepageStorageMultiple }).array('images');

// Set up multer for file uploads (single file)
const edithomepageStorageSingle = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/edithomepage';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const edithomepageUploadSingle = multer({ storage: edithomepageStorageSingle }).single('image');


// Route to fetch all products
app.get('/fetchedithomepage', (req, res) => {
  const sql = 'SELECT * FROM edithomepage ORDER By id DESC LIMIT 1 ';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


// Endpoint to add a new product with multiple images
app.post('/edithomepage', edithomepageUploadMultiple, (req, res) => {
  // console.log('Received files:', req.files);
  // console.log('Request body:', req.body);

  const { title, description, category } = req.body;
  const images = req.files.map(file => file.filename);
  const createdAt = new Date();

  const sql = 'INSERT INTO edithomepage (title, description,category, image, created_at) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, description, category, images.join(','), createdAt], (err, result) => {
    if (err) {
      console.error('Error inserting into database:', err);
      return res.status(500).send(err);
    }
    // console.log('Product added:', result);
    res.send('Product added');
  });
});

// Endpoint to update a product with a single image
app.put('/updateedithomepage/:id', edithomepageUploadSingle, (req, res) => {
  const productId = req.params.id;
  const { title, description, category } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE edithomepage SET title = ?, description = ?, category = ?, created_at = ?';
  let values = [title, description, category, new Date()];

  if (image) {
    const oldImageQuery = 'SELECT image FROM edithomepage WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) {
        // console.error('Error fetching old image:', err);
        return res.status(500).send(err);
      }

      const oldImage = results[0]?.image;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/edithomepage/${oldImage}`, (err) => {
          if (err) {
            console.error('Failed to delete old image:', err);
          } else {
            console.log('Old image deleted:', oldImage);
          }
        });
      }

      sql += ', image = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) {
          console.error('Error updating database:', err);
          return res.status(500).send(err);
        }
        console.log('Product updated:', results);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error updating database:', err);
        return res.status(500).send(err);
      }
      console.log('Product updated:', results);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deleteedithomepage/:id', (req, res) => {
  const { id } = req.params;

  const fetchImageQuery = 'SELECT image FROM edithomepage WHERE id = ?';
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) {
      console.error('Error fetching image for deletion:', err);
      return res.status(500).send(err);
    }

    const image = results[0]?.image;
    if (image) {
      fs.unlink(`uploads/edithomepage/${image}`, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        } else {
          console.log('Image deleted:', image);
        }
      });
    }

    const sql = 'DELETE FROM edithomepage WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error deleting product:', err);
        return res.status(500).send(err);
      }
      console.log('Product deleted:', result);
      res.send('Product deleted');
    });
  });
});

app.put('/updateedithomepageimage/:id/:imageIndex', edithomepageUploadSingle, (req, res) => {
  const productId = req.params.id;
  const imageIndex = parseInt(req.params.imageIndex, 10);
  const newImage = req.file ? req.file.filename : null;

  if (!newImage) {
    console.error('No image uploaded');
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const fetchImagesQuery = 'SELECT image FROM edithomepage WHERE id = ?';
  db.query(fetchImagesQuery, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching old images:', err);
      return res.status(500).send(err);
    }

    const images = results[0]?.image ? results[0].image.split(',') : [];

    if (images[imageIndex]) {
      const oldImage = images[imageIndex];
      fs.unlink(`uploads/edithomepage/${oldImage}`, (err) => {
        if (err) {
          console.error(`Failed to delete old image ${oldImage}:`, err);
        } else {
          console.log(`Old image deleted: ${oldImage}`);
        }
      });

      images[imageIndex] = newImage;
    } else {
      images.push(newImage);
    }

    const updatedImages = images.join(',');
    const updateQuery = 'UPDATE edithomepage SET image = ? WHERE id = ?';
    db.query(updateQuery, [updatedImages, productId], (err, results) => {
      if (err) {
        console.error('Error updating image in database:', err);
        return res.status(500).send(err);
      }
      console.log('Image updated successfully:', results);
      res.json({ updatedImages: images });
    });
  });
});


app.put('/deleteedithomepageimage/:id', (req, res) => {
  const productId = req.params.id;
  const updatedImages = req.body.images ? req.body.images.split(',') : [];

  // Fetch the current images from the database
  const fetchImageQuery = 'SELECT image FROM edithomepage WHERE id = ?';
  db.query(fetchImageQuery, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching image for deletion:', err);
      return res.status(500).send(err);
    }

    const currentImages = results[0]?.image ? results[0].image.split(',') : [];

    // Ensure the images are correctly synchronized
    if (currentImages.length !== updatedImages.length + 1) {
      console.error('Image count mismatch, skipping file deletion.');
      return res.status(400).json({ message: 'Image count mismatch, skipping file deletion.' });
    }

    // Find the image to delete
    const imageToDelete = currentImages.find(img => !updatedImages.includes(img));

    if (imageToDelete) {
      // Delete the image file from the filesystem
      fs.unlink(`uploads/edithomepage/${imageToDelete}`, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        } else {
          console.log('Image deleted:', imageToDelete);
        }
      });
    }

    // Update the image array in the database
    const sql = 'UPDATE edithomepage SET image = ? WHERE id = ?';
    db.query(sql, [updatedImages.join(','), productId], (err, result) => {
      if (err) {
        console.error('Error updating image in database:', err);
        return res.status(500).send(err);
      }
      console.log('Image updated:', result);
      res.json({ message: 'Image deleted and updated successfully' });
    });
  });
});
/////////////////////////////////////////



// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/edithomepage');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
});

app.post('/uploadimage/:id', edithomepageUploadMultiple, (req, res) => {
  const productId = req.params.id;
  console.log('productId', productId);

  const images = req.files.map(file => file.filename); // Get filenames from uploaded files

  // Ensure that the images array is not empty
  if (images.length === 0) {
    return res.status(400).send('No images were uploaded.');
  }

  // Insert new images into the database
  const sql = 'SELECT image FROM edithomepage WHERE id = ?';
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Error retrieving product from database:', err);
      return res.status(500).send(err);
    }

    let existingImages = [];
    if (result.length > 0) {
      existingImages = result[0].image ? result[0].image.split(',') : [];
    }

    // Add new images to existing images
    const updatedImages = [...existingImages, ...images];
    
    // Update the database with the new list of images
    const updateSql = 'UPDATE edithomepage SET image = ? WHERE id = ?';
    db.query(updateSql, [updatedImages.join(','), productId], (err, result) => {
      if (err) {
        console.error('Error updating database:', err);
        return res.status(500).send(err);
      }
      res.send('Images uploaded successfully');
    });
  });
});
////////////////////doubleadpage/////////////////////////////////



// Set up multer for file uploads (multiple files)
const doubleadpageStorageMultiple = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/doubleadpage';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const doubleadpageUploadMultiple = multer({ storage: doubleadpageStorageMultiple }).array('images');

// Set up multer for file uploads (single file)
const doubleadpageStorageSingle = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/doubleadpage';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const doubleadpageUploadSingle = multer({ storage: doubleadpageStorageSingle }).single('image');


// Route to fetch all products
app.get('/fetchdoubleadpage', (req, res) => {
  const sql = 'SELECT * FROM doubleadpage LIMIT 2';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


// Endpoint to add a new product with multiple images
app.post('/doubleadpage', doubleadpageUploadMultiple, (req, res) => {
  // console.log('Received files:', req.files);
  // console.log('Request body:', req.body);

  const { title, description, category } = req.body;
  const images = req.files.map(file => file.filename);
  const createdAt = new Date();

  const sql = 'INSERT INTO doubleadpage (title, description, category, image, created_at) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, description, category, images.join(','), createdAt], (err, result) => {
    if (err) {
      console.error('Error inserting into database:', err);
      return res.status(500).send(err);
    }
    // console.log('Product added:', result);
    res.send('Product added');
  });
});

// Endpoint to update a product with a single image
app.put('/updatedoubleadpage/:id', doubleadpageUploadSingle, (req, res) => {
  const productId = req.params.id;
  const { title, description, category } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql = 'UPDATE doubleadpage SET title = ?, description = ?, category =?, created_at = ?';
  let values = [title, description, category, new Date()];

  if (image) {
    const oldImageQuery = 'SELECT image FROM doubleadpage WHERE id = ?';
    db.query(oldImageQuery, [productId], (err, results) => {
      if (err) {
        // console.error('Error fetching old image:', err);
        return res.status(500).send(err);
      }

      const oldImage = results[0]?.image;
      if (oldImage && oldImage !== image) {
        fs.unlink(`uploads/doubleadpage/${oldImage}`, (err) => {
          if (err) {
            console.error('Failed to delete old image:', err);
          } else {
            console.log('Old image deleted:', oldImage);
          }
        });
      }

      sql += ', image = ? WHERE id = ?';
      values.push(image, productId);

      db.query(sql, values, (err, results) => {
        if (err) {
          console.error('Error updating database:', err);
          return res.status(500).send(err);
        }
        console.log('Product updated:', results);
        res.json({ message: 'Product updated successfully' });
      });
    });
  } else {
    sql += ' WHERE id = ?';
    values.push(productId);

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error updating database:', err);
        return res.status(500).send(err);
      }
      console.log('Product updated:', results);
      res.json({ message: 'Product updated successfully' });
    });
  }
});

// Endpoint to delete a product
app.delete('/deletedoubleadpage/:id', (req, res) => {
  const { id } = req.params;

  const fetchImageQuery = 'SELECT image FROM doubleadpage WHERE id = ?';
  db.query(fetchImageQuery, [id], (err, results) => {
    if (err) {
      console.error('Error fetching image for deletion:', err);
      return res.status(500).send(err);
    }

    const image = results[0]?.image;
    if (image) {
      fs.unlink(`uploads/doubleadpage/${image}`, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        } else {
          console.log('Image deleted:', image);
        }
      });
    }

    const sql = 'DELETE FROM doubleadpage WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error deleting product:', err);
        return res.status(500).send(err);
      }
      console.log('Product deleted:', result);
      res.send('Product deleted');
    });
  });
});

app.put('/updatedoubleadpageimage/:id/:imageIndex', doubleadpageUploadSingle, (req, res) => {
  const productId = req.params.id;
  const imageIndex = parseInt(req.params.imageIndex, 10);
  const newImage = req.file ? req.file.filename : null;

  if (!newImage) {
    console.error('No image uploaded');
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const fetchImagesQuery = 'SELECT image FROM doubleadpage WHERE id = ?';
  db.query(fetchImagesQuery, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching old images:', err);
      return res.status(500).send(err);
    }

    const images = results[0]?.image ? results[0].image.split(',') : [];

    if (images[imageIndex]) {
      const oldImage = images[imageIndex];
      fs.unlink(`uploads/doubleadpage/${oldImage}`, (err) => {
        if (err) {
          console.error(`Failed to delete old image ${oldImage}:`, err);
        } else {
          console.log(`Old image deleted: ${oldImage}`);
        }
      });

      images[imageIndex] = newImage;
    } else {
      images.push(newImage);
    }

    const updatedImages = images.join(',');
    const updateQuery = 'UPDATE doubleadpage SET image = ? WHERE id = ?';
    db.query(updateQuery, [updatedImages, productId], (err, results) => {
      if (err) {
        console.error('Error updating image in database:', err);
        return res.status(500).send(err);
      }
      console.log('Image updated successfully:', results);
      res.json({ updatedImages: images });
    });
  });
});


app.put('/deletedoubleadpageimage/:id', (req, res) => {
  const productId = req.params.id;
  const updatedImages = req.body.images ? req.body.images.split(',') : [];

  // Fetch the current images from the database
  const fetchImageQuery = 'SELECT image FROM doubleadpage WHERE id = ?';
  db.query(fetchImageQuery, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching image for deletion:', err);
      return res.status(500).send(err);
    }

    const currentImages = results[0]?.image ? results[0].image.split(',') : [];

    // Ensure the images are correctly synchronized
    if (currentImages.length !== updatedImages.length + 1) {
      console.error('Image count mismatch, skipping file deletion.');
      return res.status(400).json({ message: 'Image count mismatch, skipping file deletion.' });
    }

    // Find the image to delete
    const imageToDelete = currentImages.find(img => !updatedImages.includes(img));

    if (imageToDelete) {
      // Delete the image file from the filesystem
      fs.unlink(`uploads/doubleadpage/${imageToDelete}`, (err) => {
        if (err) {
          console.error('Failed to delete image:', err);
        } else {
          console.log('Image deleted:', imageToDelete);
        }
      });
    }

    // Update the image array in the database
    const sql = 'UPDATE doubleadpage SET image = ? WHERE id = ?';
    db.query(sql, [updatedImages.join(','), productId], (err, result) => {
      if (err) {
        console.error('Error updating image in database:', err);
        return res.status(500).send(err);
      }
      console.log('Image updated:', result);
      res.json({ message: 'Image deleted and updated successfully' });
    });
  });
});
/////////////////////////////////////////



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

// app.post('/uploadimage/:id', doubleadpageUploadMultiple, (req, res) => {
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
app.use('/uploads/singleadpage', express.static(path.join(__dirname, 'uploads/singleadpage')));

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/singleadpage/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload3 = multer({ storage: storage });

// Fetch all single ad page images
app.get('/fetchsingleadpage', (req, res) => {
  const query = 'SELECT * FROM singleadpage';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching images:', err);
      res.status(500).json({ error: 'Failed to fetch images' });
    } else {
      res.json(results);
    }
  });
});

// Add a new image
app.post('/singleadpage', upload3.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const image = req.file.filename;
  const query = 'INSERT INTO singleadpage (image) VALUES (?)';
  db.query(query, [image], (err, result) => {
    if (err) {
      console.error('Error inserting image:', err);
      res.status(500).json({ error: 'Failed to add image' });
    } else {
      res.json({ message: 'Image added successfully', id: result.insertId });
    }
  });
});

// Update an existing image
app.put('/updatesingleadpageimage/:id', upload3.single('image'), (req, res) => {
  const { id } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const newImage = req.file.filename;

  // First, fetch the current image filename from the database
  const selectQuery = 'SELECT image FROM singleadpage WHERE id = ?';
  db.query(selectQuery, [id], (selectErr, selectResult) => {
    if (selectErr) {
      console.error('Error fetching image:', selectErr);
      return res.status(500).json({ error: 'Failed to fetch current image' });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const oldImage = selectResult[0].image;

    // Proceed with the update in the database
    const updateQuery = 'UPDATE singleadpage SET image = ? WHERE id = ?';
    db.query(updateQuery, [newImage, id], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating image:', updateErr);
        return res.status(500).json({ error: 'Failed to update image' });
      }

      // Delete the old image from the uploads folder
      const oldImagePath = path.join(__dirname, 'uploads', 'singleadpage', oldImage);
      fs.unlink(oldImagePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting old image:', unlinkErr);
        }
      });

      res.json({ message: 'Image updated successfully', updatedImage: newImage });
    });
  });
});


// Delete an image
app.delete('/deletesingleadpageimage/:id', (req, res) => {
  const { id } = req.params;

  // First, fetch the image filename from the database
  const selectQuery = 'SELECT image FROM singleadpage WHERE id = ?';
  db.query(selectQuery, [id], (selectErr, selectResult) => {
    if (selectErr) {
      console.error('Error fetching image:', selectErr);
      return res.status(500).json({ error: 'Failed to fetch image' });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const image = selectResult[0].image;

    // Delete the image file from the folder
    const imagePath = path.join(__dirname, 'uploads', 'singleadpage', image);
    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting image file:', unlinkErr);
        return res.status(500).json({ error: 'Failed to delete image file' });
      }

      // Delete the entry from the database
      const deleteQuery = 'DELETE FROM singleadpage WHERE id = ?';
      db.query(deleteQuery, [id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error('Error deleting image from database:', deleteErr);
          return res.status(500).json({ error: 'Failed to delete image from database' });
        }

        res.json({ message: 'Image deleted successfully' });
      });
    });
  });
});

/////////////////changepassword///////////

// Change Password API Endpoint
app.post('/api/change-password', (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Old and new passwords are required' });
  }

  // Query to check if old password is correct
  db.query('SELECT * FROM admin WHERE password = ?', [oldPassword], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'Old password is incorrect' });
    }

    // Query to update the password
    db.query('UPDATE admin SET password = ? WHERE password = ?', [newPassword, oldPassword], (err) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      res.status(200).json({ success: true, message: 'Password updated successfully' });
    });
  });
});
//////////////////////searchbox suggestion////////////////////////////////
app.get('/api/suggestions', (req, res) => {
  const query = req.query.query.toLowerCase();
  
  // Define categories and products
  // Define categories and products
  const suggestions = [
    { term: "Computers", keywords: ["laptop","laptops", "desktop","desktops", "computer","computers", "notebook"] },
    { term: "Mobiles", keywords: ["mobile", "mobiles", "smartphone","smartphones", "phones", "phone", "android"] },
    { term: "Headphones", keywords: ["headphone", "headphones", "earphone","earphones", "earbuds", "headset", "wireless headphone", "wired headphone" ,"wired headphones"] },
    { term: "Printers", keywords: ["printer", "scanner", "fax"] },
    { term: "Speaker", keywords: ["speaker", "speakers","bluetooth speaker", "audio","home theatre"] },
    { term: "Television", keywords: ["television", "tv", "tele"] },
    { term: "Watch", keywords: ["watch", "smart watch", "time", "clock", 'wall clock',] },
    { term: "CCTV", keywords: ["cctv", "security camera", "surveillance"] },
    { term: "ComputerAccessories", keywords: ["keyboard", "mouse", "monitor", "webcam", "laptop charger", "adapter"] },
    { term: "MobileAccessories", keywords: ["charger","mobile charger","back cover","back case","flip cover", "case", "screen protector", "power bank", 'c type charger' ] },
  ];
  // Find the most specific matching category term based on the query
  const matchingCategory = suggestions.find(({ keywords }) =>
    keywords.some(keyword => keyword.includes(query))
  );

  // Return the category term if found, otherwise return a not found message
  if (matchingCategory) {
    res.json({ category: matchingCategory.term });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

////////////useraddress/////////////////////

// Route to handle address submission
app.post('/useraddress', (req, res) => {
  const { userId, address } = req.body;

  if (!userId || !address) {
    return res.status(400).send('User ID and address are required');
  }

  // Update all existing addresses for the user to not current
  const updateQuery = 'UPDATE useraddress SET current_address = 0 WHERE user_id = ?';
  
  db.query(updateQuery, [userId], (err) => {
    if (err) {
      console.error('Error updating existing addresses:', err);
      return res.status(500).send('Server error');
    }

    // Insert the new address and set it as the current address
    const insertQuery = 'INSERT INTO useraddress (user_id, name, street, city, state, postal_code, country, phone, current_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [userId, address.name, address.street, address.city, address.state, address.postal_code, address.country, address.phone, 1];

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error('Error inserting address:', err);
        return res.status(500).send('Server error');
      }
      res.status(200).send('Address added successfully');
    });
  });
});

// Update address
app.put('/updateuseraddress/:id', (req, res) => {
  const addressId = req.params.id;
  const updatedAddress = req.body;
  const sql = `
    UPDATE useraddress 
    SET name = ?, street = ?, city = ?, state = ?, postal_code = ?, country = ?, phone = ? 
    WHERE address_id = ?
  `;
  db.query(sql, [
    updatedAddress.name, 
    updatedAddress.street, 
    updatedAddress.city, 
    updatedAddress.state, 
    updatedAddress.postal_code, 
    updatedAddress.country, 
    updatedAddress.phone, 
    addressId
  ], (err, results) => {
    if (err) {
      console.error('Error updating address:', err);
      return res.status(500).json({ message: 'Error updating address' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address updated successfully' });
  });
});



app.delete('/deleteuseraddress/:address_id', (req, res) => {
  const addressId = req.params.address_id;

  if (!addressId) {
    return res.status(400).json({ message: 'Address ID is required' });
  }

  const sql = 'DELETE FROM useraddress WHERE address_id = ?';
  db.query(sql, [addressId], (err, results) => {
    if (err) {
      console.error('Error deleting address:', err);
      return res.status(500).json({ message: 'Error deleting address' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted successfully' });
  });
});


// Fetch addresses for a specific user
app.get('/useraddress/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM useraddress WHERE user_id = ? order by address_id DESC';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching addresses:', err);
      return res.status(500).send('Server Error');
    }
    res.json(results);
  });
});


// Update the current address
app.post('/update-current-address', async (req, res) => {
  const { userId, addressId } = req.body;

  try {
    // Set all addresses to false
    await db.query('UPDATE useraddress SET current_address = FALSE WHERE user_id = ?', [userId]);

    // Set the selected address to true
    await db.query('UPDATE useraddress SET current_address = TRUE WHERE user_id = ? AND address_id = ?', [userId, addressId]);

    res.status(200).json({ message: 'Address updated successfully' });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/singleaddress/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM useraddress WHERE user_id = ? AND current_address = 1';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching addresses:', err);
      return res.status(500).send('Server Error');
    }
    res.json(results);
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
    cb(null, 'uploads/products'); // Destination folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

const upload7 = multer({ storage: productStorage });

app.post('/place-order', upload7.array('image'), (req, res) => {
  const { user_id, total_amount, shipping_address, address_id, cartItems } = req.body;

  // Ensure req.files exists
  const files = req.files || [];
  console.log('Uploaded Files:', files);

  let items;
  try {
    items = Array.isArray(cartItems) ? cartItems : JSON.parse(cartItems);
  } catch (e) {
    console.error('Error parsing cartItems:', e);
    return res.status(400).json({ message: 'Invalid cart items format' });
  }

  if (!user_id || !total_amount || !address_id || !items || items.length === 0) {
    console.error('Invalid data provided:', { user_id, total_amount, shipping_address, address_id, items });
    return res.status(400).json({ message: 'Invalid data' });
  }

  // Generate unique ID
  const unique_id = generateUniqueId();

  // Insert order
  const orderQuery = 'INSERT INTO orders (unique_id, user_id, total_amount, shipping_address, address_id, status) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(orderQuery, [unique_id, user_id, total_amount, shipping_address, address_id, 'Paid'], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).json({ message: 'Error inserting order', error: err.message });
    }

    // const unique_id = result.insertId;
    // console.log("order_id",order_id)

    // Prepare values for order items
    const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
    const orderItemsValues = items.map(item => [
      unique_id,
      item.product_id,
      item.quantity,
      item.price * item.quantity
    ]);
// console.log("orderItemsValues",orderItemsValues)
    // Prepare values for products with image paths
    const productsQuery = `
      INSERT INTO products (product_id, name, category, price, image_url, description) 
      VALUES ? 
      ON DUPLICATE KEY UPDATE 
        name = VALUES(name), 
        category = VALUES(category), 
        image_url = VALUES(image_url), 
        description = VALUES(description)
    `;

    const productsValues = items.map(item => {
      const file = files.find(file => file.originalname === item.image);
      return [
        item.product_id,
        item.name,
        item.category,
        item.price,
        file ? file.filename : item.image, // Use filename if file exists
        item.description
      ];
    });

    // Insert order items
    db.query(orderItemsQuery, [orderItemsValues], (err) => {
      if (err) {
        console.error('Error inserting order items:', err);
        return res.status(500).json({ message: 'Error inserting order items', error: err.message });
      }

      // Insert or update products
      db.query(productsQuery, [productsValues], (err) => {
        if (err) {
          console.error('Error inserting or updating products:', err);
          return res.status(500).json({ message: 'Error inserting or updating products', error: err.message });
        }

        console.log('Order items and products inserted successfully');
        res.status(200).json({ message: 'Order placed successfully', unique_id });
      });
    });
  });
});

//////////////////////////

app.get('/fetchorders', (req, res) => {
  console.log('Received request to fetch orders');

  const queryOrders = 'SELECT * FROM orders ORDER BY order_id DESC'; // Fetch all orders

  db.query(queryOrders, (err, orders) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ message: 'Error fetching orders' });
    }

    console.log('Orders fetched:', orders);

    // Collect all unique user_ids from orders
    const userIds = [...new Set(orders.map(order => order.user_id))];
    console.log('Unique user IDs:', userIds);

    if (userIds.length === 0) {
      // No user_ids to fetch
      console.log('No user IDs to fetch. Returning orders.');
      return res.json(orders);
    }

    // Prepare query to fetch names from users table
    const queryUsers = 'SELECT user_id, username FROM users WHERE user_id IN (?)';
    console.log('Query to fetch user names:', queryUsers);
    
    db.query(queryUsers, [userIds], (err, users) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ message: 'Error fetching users' });
      }

      console.log('Users fetched:', users);

      // Map user_id to name
      const userMap = users.reduce((acc, user) => {
        acc[user.user_id] = user.username;
        return acc;
      }, {});
      console.log('User ID to name map:', userMap);

      // Add customerName to orders based on user_id
      const enrichedOrders = orders.map(order => ({
        ...order,
        customerName: userMap[order.user_id] || 'Unknown' // Default to 'Unknown' if name is not found
      }));

      console.log('Enriched orders:', enrichedOrders);

      res.json(enrichedOrders);
    });
  });
});


// Fetch Orders Data
app.get('/fetchordersdashboard', (req, res) => {
  const query = 'SELECT * FROM orders'; // Adjust your query as needed
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      res.status(500).send('Error fetching orders');
      return;
    }
    res.json(results);
  });
});

// Fetch Product Categories for Pie Chart
app.get('/fetchcategories', (req, res) => {
  const query = `
    SELECT 
      category, 
      COUNT(*) AS total_amount 
    FROM products
    GROUP BY category
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching product categories:', err);
      res.status(500).send('Error fetching product categories');
      return;
    }
    res.json(results);
  });
});
///////////reportspage////////////////

// Sales Report API
app.get('/api/salesreport', (req, res) => {
  const query = `
    SELECT p.name AS product_name, p.category, SUM(oi.price * oi.quantity) AS sales
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN orders o ON oi.order_id = o.order_id
    GROUP BY p.name, p.category
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching sales report:', err);
      res.status(500).send('Error fetching sales report');
    } else {
      res.json(results);
    }
  });
});

// Orders Report API
app.get('/api/ordersreport', (req, res) => {
  const query = `
    SELECT unique_id, user_id, shipping_address, total_amount, status, order_date
    FROM orders ORDER BY order_id DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders report:', err);
      res.status(500).send('Error fetching orders report');
    } else {
      res.json(results);
    }
  });
});

// Customers Report API
app.get('/api/customersreport', (req, res) => {
  const query = `
    SELECT user_id, COUNT(unique_id) AS total_orders, SUM(total_amount) AS total_spent
    FROM orders 
    GROUP BY user_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching customers report:', err);
      res.status(500).send('Error fetching customers report');
    } else {
      res.json(results);
    }
  });
});



// Fetch Users with their Addresses
app.get('/api/users', (req, res) => {
  const query = `
    SELECT 
      u.user_id, 
      u.username, 
      u.email, 
      ua.address_id, 
      ua.name AS address_name, 
      ua.street, 
      ua.city, 
      ua.state, 
      ua.postal_code, 
      ua.country, 
      ua.phone
    FROM users u
    LEFT JOIN useraddress ua ON u.user_id = ua.user_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Error fetching users');
    } else {
      res.json(results);
    }
  });
});


app.get("/api/my-orders/:userId", (req, res) => {
  const userId = req.params.userId;

  // Query the orders table based on the userId
  const ordersQuery = `SELECT * FROM orders WHERE user_id = ? ORDER BY order_id DESC`;
  
  db.query(ordersQuery, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error fetching orders" });
    }
    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: "No orders found for this user" });
    }
  });
});


///////////////////////////////////
app.get('/getProductByOrderId/:orderId', (req, res) => {
  const { orderId } = req.params;
  console.log("Fetching Product ID for Order ID:", orderId);

  // Define the SQL query to fetch product_id from order_items where order_id matches the unique_id in orders
  const query = `
    SELECT oi.product_id
    FROM order_items oi
    JOIN orders o ON o.unique_id = oi.order_id
    WHERE o.unique_id = ?
  `;

  console.log("SQL Query to fetch product ID:", query);

  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error("Error fetching product by order ID:", err);
      res.status(500).json({ error: 'Failed to fetch product details' });
    } else {
      console.log("Product ID fetched:", result);
      if (result.length === 0) {
        console.warn("No product ID found for order ID:", orderId);
      }
      res.json(result[0] || {}); // Ensure response is always an object
    }
  });
});



app.get('/getProductDetails', (req, res) => {
  const { product_id } = req.query;
  console.log("Fetching Product Details with Product ID:", product_id);

  // List of tables to search for the product_id
  const tables = [
    'computers',
    'mobiles',
    'speakers',
    'headphones',
    'cctv',
    'tv',
    'printers',
    'watch',
    'computeraccessories',
    'mobileaccessories',
  ];

  // Generate queries for each table
  const queries = tables.map(table => {
    return {
      tableName: table,
      query: `
        SELECT '${table}' AS table_name, prod_name, prod_features, prod_price, prod_img, category
        FROM ${table}
        WHERE prod_id = ?
      `
    };
  });

  let results = [];
  let completedQueries = 0;

  const checkProductDetails = (queryIndex) => {
    if (queryIndex >= queries.length) {
      // All queries have been processed
      if (results.length === 0) {
        console.log("Product not found in any table");
        return res.status(404).json({ error: 'Product not found in any table' });
      }
      console.log("Product Details fetched:", results[0]);
      return res.json(results[0]); // Return the first match (assuming one product per ID)
    }

    const { tableName, query } = queries[queryIndex];
    console.log("Executing SQL Query:", query);

    db.query(query, [product_id], (err, result) => {
      if (err) {
        console.error(`Error fetching product details from table ${tableName}:`, err);
        return res.status(500).json({ error: 'Failed to fetch product details' });
      }

      if (result.length > 0) {
        results = result; // Store the result
        console.log(`Product found in table ${tableName}`);
        return res.json(result[0]); // Return the first match immediately
      }

      completedQueries++;
      checkProductDetails(queryIndex + 1); // Proceed to the next table
    });
  };

  // Start checking product details from the first table
  checkProductDetails(0);
});

////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

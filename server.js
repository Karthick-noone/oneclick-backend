const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS for all routes
// Middleware to parse JSON bodies
app.use(express.json());

// MySQL connection configuration
const dbConfig = {
  host: 'sql12.freesqldatabase.com',
  user: 'sql12728767',
  password: 'UGZRm9w2hF',
  database: 'sql12728767',
};

let db;

function handleDisconnect() {
  db = mysql.createConnection(dbConfig); // Recreate the connection

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); // Retry after 2 seconds if there's an error
    } else {
      console.log('Connected to MySQL');
    }
  });

  db.on('error', (err) => {
    console.error('MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
      handleDisconnect(); // Reconnect if the connection is lost
    } else {
      throw err;
    }
  });
}

handleDisconnect(); // Initial connection setup

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

// Signup Route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).send('All fields are required');
    }
  
    // Check if the email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Server error');
      }
  
      if (results.length > 0) {
        return res.status(400).send('Email already registered');
      }
  
      // If email doesn't exist, proceed to insert the new user
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [username, email, password], (err) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).send('Server error');
        }
        res.status(200).send('User created successfully');
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
        const { username, email } = user;
        return res.status(200).json({ username, email, message: "Login successful" });
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
      cartItems = JSON.parse(results[0].addtocart);
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



// Endpoint to add a new product
app.post('/computers', computersUpload.single('image'), (req, res) => {
  const { name, features, price } = req.body;
  const image = req.file ? req.file.filename : '';

  const sql = 'INSERT INTO computers (prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set

  db.query(sql, [name, features, price, image, status], (err, result) => {
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

  const sql = 'INSERT INTO mobiles (prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set

  db.query(sql, [name, features, price, image, status], (err, result) => {
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

  const sql = 'INSERT INTO cctv (prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set

  db.query(sql, [name, features, price, image, status], (err, result) => {
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

  const sql = 'INSERT INTO tv (prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set

  db.query(sql, [name, features, price, image, status], (err, result) => {
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

  const sql = 'INSERT INTO headphones (prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set

  db.query(sql, [name, features, price, image, status], (err, result) => {
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

  const sql = 'INSERT INTO speakers (prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set

  db.query(sql, [name, features, price, image, status], (err, result) => {
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

  const sql = 'INSERT INTO watch (prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set

  db.query(sql, [name, features, price, image, status], (err, result) => {
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

  const sql = 'INSERT INTO printers (prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set

  db.query(sql, [name, features, price, image, status], (err, result) => {
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

  const sql = 'INSERT INTO mobileaccessories (prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set

  db.query(sql, [name, features, price, image, status], (err, result) => {
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

  const sql = 'INSERT INTO computeraccessories (prod_name, prod_features, prod_price, prod_img, status) VALUES (?, ?, ?, ?, ?)';
  const status = 'available'; // or any other status you might want to set

  db.query(sql, [name, features, price, image, status], (err, result) => {
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
  const suggestions = [
    { term: "Computers", keywords: ["laptop","laptops", "desktop","desktops", "computer","computers", "notebook"] },
    { term: "Mobiles", keywords: ["mobile", "smartphone", "phone", "android"] },
    { term: "Headphones", keywords: ["headphone", "earphone", "earbuds", "headset", "wireless headphone","wired headphone"] },
    { term: "Printers", keywords: ["printer", "scanner", "fax"] },
    { term: "Speakers", keywords: ["speaker", "bluetooth speaker", "audio","home theatre"] },
    { term: "TV", keywords: ["television", "tv", "tele"] },
    { term: "CCTV", keywords: ["cctv", "security camera", "surveillance"] },
    { term: "ComputerAccessories", keywords: ["keyboard", "mouse", "monitor", "webcam", "laptop charger", "adapter"] },
    { term: "MobileAccessories", keywords: ["charger","mobile charger","back cover","back case","flip cover", "case", "screen protector", "power bank"] },
  ];

  // Find the matching category term based on the query
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


////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

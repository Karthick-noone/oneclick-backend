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



// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'oneclick',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

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
//////////////////////////////////////////////////////////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
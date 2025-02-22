const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Key for JWT
const JWT_SECRET = 'your_jwt_secret';

// Register a new user
router.post('/register', async (req, res) => {
  try {
    console.log("register");
    const { email, password } = req.body;
    console.log("register");

    // Check if the user already exists
    console.log("register");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    console.log("register");

    // Create a new user
    const user = new User({
      email,
      password
    });
    console.log("register");

    await user.save();
    console.log("register");

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ userId: user._id, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user profile
router.post('/profile', async (req, res) => {
  try {
    // const token = req.headers.authorization.split(' ')[1];
    // const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log("user", user);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const jwt = require('express-jwt');
// const jwksRsa = require('jwks-rsa');

// // Middleware to validate JWT token from Auth0
// const authenticate = jwt({

// });

// router.post('/',authenticate, async (req, res) => {
//   try {
//     const { email, name } = req.body;
//     console.log(req.user);
//     const user = new User({
//       firebaseId: req.user.sub, // Auth0 user ID
//       email,
//       name
//     });
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.post('/noauth', async (req, res) => {
//   try {
//     const { email, name } = req.body;
//     const user = new User({
//       // You may store a custom ID or leave it out
//       email,
//       name
//     });
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.get('/profile', authenticate, async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseId: req.user.sub }); // Auth0 user ID
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
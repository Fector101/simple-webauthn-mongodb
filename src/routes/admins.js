const path = require('path')
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Student');


const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in headers
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
  //   const decoded = jwt.verify(token, process.env.ADMIN_PS || 'admin');
    
    // Add user from payload
  //   console.log(await decoded.id ,'stain ')
    req.user = 'admin'
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};




const router = express.Router();

// router.get('/admin-dashboard', async (req, res) => {
//     try {
//       // const users = await User.find().select('-password'); // Don't send passwords
//       res.json({ users });
//     } catch (err) {
//       res.status(500).json({ message: 'Server error' });
//     }
// })
router.get('/admin-dashboard', authMiddleware, async (req, res) => {
  try {
      // req.user is set by the middleware
      res.json({ 
      message: 'Admin dashboard accessed successfully', 
      user: req.user
      });
      
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
  });

router.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/admin.html'));
})

module.exports = router;

const path = require('path')
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Student');

const router = express.Router();

// router.get('/admin-dashboard', async (req, res) => {
//     try {
//       // const users = await User.find().select('-password'); // Don't send passwords
//       res.json({ users });
//     } catch (err) {
//       res.status(500).json({ message: 'Server error' });
//     }
// })


router.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/admin.html'));
})

module.exports = router;

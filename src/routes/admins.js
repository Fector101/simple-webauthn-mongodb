const path = require('path')
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")
const User = require('../models/Student');

const { getAllStudents } = require("./../db-utils")

const authMiddleware = (req, res, next) => {
  if (req.cookies.authenticated === 'true') {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};


function formatData(data) {
  let formatted_data=`
  <h1> Registered Students </h1>
  <table>
  <thead> <tr> <th> Name </th> <th> Matric No </th> </tr> </thead>`
  data.forEach((student) => {
    formatted_data += `<tr>
    <td>${student.name}</td>
    <td>${student.matric_no}</td></tr>
    `
  }
  )
  formatted_data += '</table>'
  return formatted_data
}
    

const router = express.Router();
router.use(cookieParser())

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
    const studentsData = getAllStudents();
      // req.user is set by the middleware
      // res.json({ 
      // message: 'Admin dashboard accessed successfully', 
      // "studentsData": formatData(studentsData)

      // });
      res.send(formatData(studentsData))
      
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
  });

router.get('/admin-login', (req, res) => {
    res.render('admin-dashboard',{students:[],markedInfo:[]})
    // res.sendFile(path.join(__dirname, '../../public/pages/admin.html'));
})

module.exports = router;

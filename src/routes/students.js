const express = require('express')
const cookieParser = require("cookie-parser")
const path = require('path')
const verifyToken = require('./../helper/basic')

const router = express.Router();
router.use(cookieParser())

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/signup.html'));
})

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/login.html'));
})

router.get('/dashboard',verifyToken, (req, res) => {
    const user = req.user
    res.render('dashboard', { username: user.username ,matric_no: user.matric_no});
})


module.exports = router;

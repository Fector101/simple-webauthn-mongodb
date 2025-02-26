const express = require('express')
const path = require('path')

const router = express.Router();


router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/signup.html'));
})

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/login.html'));
})

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/dashboard.html'));
})


module.exports = router;

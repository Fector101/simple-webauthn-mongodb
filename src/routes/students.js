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
    const userInfo = req.cookies.userInfo

    try{
        console.log(JSON.parse(userInfo.username),'|----|')
    }catch(err){
        console.log(err)
    }
    console.log(req)
    // res.clearCookie("userInfo")
    res.render('dashboard', { username: req.user.username });
})


module.exports = router;

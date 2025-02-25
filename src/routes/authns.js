const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const path = require('path')
const crypto = require("crypto");
const base64url = require("base64url");
const router = express.Router()
const {generateAuthenticationOptions,generateRegistrationOptions} =require("@simplewebauthn/server")
// router.post('/signup', async (req, res) => {
    // try {
    //     const student_name = req.body['name']
    //     const matric_no = req.body['matric-no']

    //     let user = await User.findOne({ matric_no })
    //     if (user) return res.status(400).json({ error: 'Student already exists' })

    //     // Get fingerprint data
    //     // const hashedPassword = await bcrypt.hash(password, 10)

    //     // user = new User({ matric_no, matric_no, password: hashedPassword })
    //     user = new User({ student_name, matric_no })
    //     await user.save()

    //     res.status(201).json({ message: 'Student registered successfully' })
    // } catch (err) {
    //     console.log('signup error: ', err)
    //     res.status(500).json({ error: 'Server error' })
    // }
// })


let data={}

router.post('/init-reg', async (req, res) => {
    try {
        const student_name = req.body['name'] || 'Fabian'
        const matric_no = req.body.matric_no || 'FT23CMP0001'
        console.log(matric_no, ' matric_no')
        const opts = await generateRegistrationOptions({
            rpName: "Clean Kohl",
            // rpID: "clean-kohl.vercel.app",
            rpID: "localhost",
            userName: matric_no,
            userDisplayName: student_name,
            authenticatorSelection: {userVerification: 'preferred' }
            // userID: 'matric_no',
            
        })
        
        // rpID: "clean-kohl.vercel.app",
        // const publicKeyCredentialCreationOptions = {
        //     challenge,
        //     rp: {
        //         name: "Duo Security",
        //         // id: "duosecurity.com",
        //     },
        //     user: {
        //         id: userId,
        //         name: "lee@webauthn.guide",
        //         displayName: "Lee",
        //     },
        //     pubKeyCredParams: [{alg: -7, type: "public-key"}],
        //     authenticatorSelection: {
        //         authenticatorAttachment: "platform",
        //         userVerification: "preferred" 
        //     },
        //     timeout: 60000,
        //     attestation: "direct"
        //     };
        
            
        console.log('-----------------------------------')
        console.log(opts, ' opts')
        // await db.collection("users").doc(email).set({ challenge });
        res.json(opts);
        
        // Get fingerprint data
        // const hashedPassword = await bcrypt.hash(password, 10)

        // user = new User({ matric_no, matric_no, password: hashedPassword })
        // user = new User({ student_name, matric_no })
        // await user.save()

        // res.status(201).json({ message: 'Student registered successfully' })
    } catch (err) {
        console.log('signup error: ', err)
        res.status(500).json({ error: 'Server error' })
    }
})



router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        console.log(username, password)

        const user = await User.findOne({ username })
        console.log(user, ' user')
        if (!user) return res.status(400).json({ error: 'Student doesn\'t exist' })


        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ error: 'Invalid password' })


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.json({ message: 'Login successful', token })
    } catch (err) {
        console.log('login error: ', err)
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const path = require('path')
const crypto = require("crypto");
const base64url = require("base64url");
const router = express.Router()
const {generateAuthenticationOptions,generateRegistrationOptions, verifyRegistrationResponse} =require("@simplewebauthn/server")
const { json } = require('stream/consumers')


const CLIENT_URL =  process.env.CLIENT_URL || 'http://localhost:3000'
const RP_NAME = process.env.RP_NAME || 'Clean Kohl'
const RP_ID = process.env.RP_ID || 'localhost'
console.log(CLIENT_URL, ' CLIENT_URL from env.')
console.log(RP_NAME, ' RP_NAME from env.')
console.log(RP_ID, ' RP_ID from env.')
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
            rpName: RP_NAME,
            rpID: RP_ID,
            // rpID: "clean-kohl.vercel.app",
            // rpID: "localhost",
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
        
        data={
            matric_no, 
            userId: opts.user.id,
            challenge: opts.challenge
        }
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
        res.status(400).json({ error: 'Server error' })
    }
})

router.post('/verify-reg', async (req, res) => {

    console.log('data value ',data)
    console.log('-------------------------------')
    console.log('req matric_no ',req.body.matric_no)
    console.log('-------------------------------')
    console.log('req body ',req.body)
    console.log('-------------------------------')
    console.log('req value ',req.body.registationJSON)
    const body = req.body
    try{
        const verification = await verifyRegistrationResponse({
            response: body.registationJSON,
            expectedChallenge: data.challenge,
            expectedOrigin: CLIENT_URL,
            expectedRPID: 'https://' + RP_ID,
        })
    
        const val = {id: verification.registrationInfo.credential.id,
        publicKey:verification.registrationInfo.credential.publicKey,
        counter: verification.registrationInfo.credential.counter,
        counter:body.registationJSON.transports
        }
        res.json(val);

    }catch(err){
        console.log('verification error: ', err)
        res.status(400).json({ error: 'Server error' })
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
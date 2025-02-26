const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Student = require('../models/Student')
const path = require('path')
const crypto = require("crypto");
const base64url = require("base64url");
const cookieParser = require("cookie-parser")

const router = express.Router()
const {generateAuthenticationOptions,generateRegistrationOptions, verifyRegistrationResponse} =require("@simplewebauthn/server")

const {
    getUserByMatricNo,
    createUser,
    updateUserCounter,
    getUserById,
  } = require("./../db")
  

const CLIENT_URL =  process.env.CLIENT_URL || 'http://localhost:3000'
const RP_NAME = process.env.RP_NAME || 'Clean Kohl'
const RP_ID = process.env.RP_ID || 'localhost'

router.use(cookieParser())

let data={}

router.post('/init-reg', async (req, res) => {
    try {
        const student_name = req.body.student_name || 'NSUK Student'
        const matric_no = req.body.matric_no || 'FT23CMP0001'
        console.log(matric_no, ' matric_no')

        let student = getUserByMatricNo(matric_no)
        if (student) return res.status(400).json({ exists: true })

        // let student = await Student.findOne({ matric_no })
        // if (student) return res.status(400).json({ exists: true })

        const opts = await generateRegistrationOptions({
            rpName: RP_NAME,
            rpID: RP_ID,
            userName: matric_no,
            userDisplayName: student_name,
            // authenticatorSelection: {userVerification: 'preferred' 
            // }

            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'preferred',
                requireResidentKey: true
              },
            
        })
        


        // Storing Information From Request

        res.cookie('regInfo',JSON.stringify({
            matric_no, 
            userId: opts.user.id,
            challenge: opts.challenge
        }), {httpOnly: true, maxAge: 50*1000, secure: true}
        )
        data={
            matric_no, 
            userId: opts.user.id,
            challenge: opts.challenge
        }
        console.log('-----------------------------------')
        console.log(opts, ' opts')
        console.log('-----------------------------------')
        console.log(opts.challenge, ' challenge')
        // await db.collection("users").doc(email).set({ challenge });
        res.json(opts)

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

    console.log(req.cookies, ' req.cookies')
    const regInfo = JSON.parse(req.cookies.regInfo)
    if (!regInfo) {
        return res.status(400).json({ error: "Authentication info not found" })
    }
    
    // const Student = getUserById(regInfo.userId)
    // if (Student == null || Student.matric_no != req.body.matric_no) {
    //     return res.status(400).json({ error: `Invalid user excepted ${Student}` })
    // }


    console.log('data value ',data)
    console.log('-------------------------------')
    console.log('req matric_no ',req.body.matric_no)
    console.log('-------------------------------')
    console.log('req body ',req.body)
    console.log('-------------------------------')
    console.log('req value ',req.body.registationJSON)
    const body = req.body

    console.log('regInfo', regInfo)
    
    try{
        const verification = await verifyRegistrationResponse({
            response: body.registationJSON,
            expectedChallenge: regInfo.challenge,
            expectedOrigin: CLIENT_URL,
            expectedRPID: RP_ID,
        })
    

        if (verification.verified) {
            // Store Student in DB
            const data_to_store = {
                id: verification.registrationInfo.credential.id,
                matric_no: req.body.matric_no,
                student_name: req.body.student_name,
                publicKey:verification.registrationInfo.credential.publicKey,
                counter: verification.registrationInfo.credential.counter,
                deviceType: verification.registrationInfo.credentialDeviceType,
                backedUp: verification.registrationInfo.credentialBackedUp,
                transports:body.registationJSON.transports,
            }
            createUser(data_to_store.id, data_to_store.matric_no, passKey={
                publicKey: data_to_store.publicKey,
                counter: data_to_store.counter,
                deviceType: data_to_store.deviceType,
                backedUp: data_to_store.backedUp,
                transports: data_to_store.transports
            })
            console.log(data_to_store, ' data_to_store')
            console.log(getUserByMatricNo(req.body.matric_no), ' getUserByMatricNo(req.body.matric_no)')
            res.clearCookie("regInfo")

            // createUser(id:'')
            // user = new User(data_to_store)
            // await user.save()
            res.json(data_to_store);
        }else{
            return res.status(400).json({ error: "Verification failed" })
        }


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
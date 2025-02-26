const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Student = require('../models/Student')
const path = require('path')
const crypto = require("crypto");
const base64url = require("base64url");
const { isoBase64URL } = require('@simplewebauthn/server/helpers');
const cookieParser = require("cookie-parser")
// isoBase64URL.toUTF8String(base64url.toBuffer("dGVzdA=="))
const router = express.Router()
const {generateAuthenticationOptions,generateRegistrationOptions, verifyRegistrationResponse, verifyAuthenticationResponse } =require("@simplewebauthn/server")

const {
    getUserByMatricNo,
    createUser,
    updateUserCounter,
    getUserById,
    getUserByaaguid
  } = require("./../db")
  

const CLIENT_URL =  process.env.CLIENT_URL || 'http://localhost:3000'
const RP_NAME = process.env.RP_NAME || 'Clean Kohl'
const RP_ID = process.env.RP_ID || 'localhost'

router.use(cookieParser())


router.post('/init-reg', async (req, res) => {
    try {
        const student_name = req.body.student_name || 'NSUK Student'
        const matric_no = req.body.matric_no || 'FT23CMP0001'
        console.log(matric_no, ' matric_no, student_name ', student_name)

        let student = getUserByMatricNo(matric_no)
        if (student) return res.status(400).json({ exists: true,student_name:student.student_name||'Student' })

        // let student = await Student.findOne({ matric_no })
        // if (student) return res.status(400).json({ exists: true })

        const opts = await generateRegistrationOptions({
            rpName: RP_NAME,
            rpID: RP_ID,
            userName: matric_no,
            userDisplayName: student_name,
            attestationType:'direct',
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


        
        console.log('-----------------------------------')
        console.log(opts, ' opts')
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


    console.log('-------------------------------')
    console.log('req body ',req.body)
    console.log('-------------------------------')
    console.log('regInfo', regInfo)
    
    const body = req.body
    try{
        const verification = await verifyRegistrationResponse({
            response: body.registationJSON,
            expectedChallenge: regInfo.challenge,
            expectedOrigin: CLIENT_URL,
            expectedRPID: RP_ID,
        })
    

        
        
        if (verification.verified) {
            const student = getUserByaaguid(verification.registrationInfo?.aaguid)
            console.log('Checking for aaguid and student obj ',student, '||', student?.aaguid)
            if (student?.aaguid) return res.status(400).json({ already_reg_device: true,student_name:student.student_name||'Student' })
            // Store Student in DB
            const data_to_store = {
                id: verification.registrationInfo.credential.id,
                matric_no: req.body.matric_no,
                student_name: req.body.student_name,
                publicKey:verification.registrationInfo.credential.publicKey,
                // publicKey: body.registationJSON.response.publicKey,
                counter: verification.registrationInfo.credential.counter,
                deviceType: verification.registrationInfo.credentialDeviceType,
                backedUp: verification.registrationInfo.credentialBackedUp,
                transports:body.registationJSON.response.transports,

            }
            createUser(data_to_store.id, data_to_store.matric_no,data_to_store.student_name, 
                aaguid= verification.registrationInfo.aaguid,
                passKey={
                publicKey: data_to_store.publicKey,
                counter: data_to_store.counter,
                deviceType: data_to_store.deviceType,
                backedUp: data_to_store.backedUp,
                transports: data_to_store.transports,

            })
            console.log(verification, ' verification ')
            console.log(getUserByMatricNo(req.body.matric_no), ' getUserByMatricNo--')
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


router.post('/init-auth', async (req, res) => {
    try {
        console.log('From login route --------------------')
        const matric_no = req.body.matric_no || 'FT23CMP0001'
        console.log(matric_no, ' matric_no')
        let student = getUserByMatricNo(matric_no)
        console.log('student---| ',student)
        if (!student) return res.status(400).json({ exists: false })
            
        const opts = await generateAuthenticationOptions({
            rpID: RP_ID,
            allowCredentials: [
                {
                    id: student.id,
                    type: 'public-key',
                    transports: student.passKey.transports
                }
            ]
        })
        console.log('What\'s in opts-------------| ',opts)
        

        res.cookie('authInfo',JSON.stringify({
            matric_no, 
            userId: student.id,
            challenge: opts.challenge
        }), {httpOnly: true, maxAge: 50*1000, secure: true}
        )

        res.json(opts)

        // const user = await User.findOne({ username })
        // console.log(user, ' user')


        // const isMatch = await bcrypt.compare(password, user.password)
        // if (!isMatch) return res.status(400).json({ error: 'Invalid password' })


        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        // res.json({ message: 'Login successful', token })
    } catch (err) {
        console.log('login error: ', err)
        res.status(500).json({ error: 'Server error' })
    }
})



router.post('/verify-auth', async (req, res) => {
    console.log('From login route verify-auth--------------------')
    
    const authInfo = JSON.parse(req.cookies.authInfo)
    if (!authInfo) {
        return res.status(400).json({ error: "Authentication info not found" })
      }
    
    console.log('-------------------------------')
    const body = req.body
    const matric_no = body.matric_no
    console.log('req body ',body)
    console.log('-------------------------------')
    console.log('authInfo', authInfo)
    console.log('-------------------------------')
    
    const student = getUserById(authInfo.userId)
    console.log('student-----| ', student)
    console.log('project test ', student.matric_no, '||',matric_no)
    // if student exists ||| student id === the id frm request and thumbprint public key matches with matric no
    if ( !student || (student.id != body.authJSON.id && student.matric_no != matric_no)) {
        return res.status(400).json({ error: "Invalid Student" })
    }
    console.log('-------------------------------')
    // const publicKeyBuffer = isoBase64URL.toBuffer(student.passKey.publicKey)
    // const idBuffer = isoBase64URL.toBuffer(student.id)
  
    // console.log('-------------------------------')
    // console.log('publicKeyBuffer', publicKeyBuffer)
    // console.log('idBuffer', idBuffer)
    try{
        console.log('idBuffer 1 ',  new Uint8Array(isoBase64URL.toBase64(student.id)))
    }catch(err){console.log('idBuffer', err)}
    console.log('----------------------------')
    try{
        const verification = await verifyAuthenticationResponse({
            response: body.authJSON,
            expectedChallenge: authInfo.challenge,
            expectedOrigin: CLIENT_URL,
            expectedRPID: RP_ID,
            credential: {
                id:student.id,
                publicKey: student.passKey.publicKey,
                counter: student.passKey.counter,
                transports: student.passKey.transports
            }
        })
    

        if (verification.verified) {
            // Store Student in DB
            const data_to_store = {
                id: verification.authenticationInfo.credentialID,
                matric_no,
                student_name: req.body.student_name,
                publicKey: body.publicKey,
                counter: verification.authenticationInfo.newCounter,
                deviceType: verification.authenticationInfo.credentialDeviceType,
                backedUp: verification.authenticationInfo.credentialBackedUp,
                transports:body.authJSON.response.transports,

            }
            updateUserCounter(student.id,verification.authenticationInfo.newCounter)
            console.log('-------------------------------')
            console.log(data_to_store, ' data_to_store')
            console.log('-------------------------------')
            console.log(getUserByMatricNo(matric_no), ' getUserByMatricNo--')
            res.clearCookie("authInfo")
            // Save Student in a session cookie

            res.json(data_to_store);
            console.log('Good End of login route verify-auth--------------------')
        }else{
            console.log('Error End of login route verify-auth--------------------')
            return res.status(400).json({ error: "Verification failed" })
        }


    }catch(err){
        console.log('verification error: ', err)
        res.status(400).json({ error: 'Server error' })
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


module.exports = router
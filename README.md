# group-project-e3

// export the app for vercel serverless functions
// module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/auth', require('./src/routes/auth'));



app.get('/',(req,res)=>{
  res.sendFile('index.html')
})




app.post("/submit", async(req, res) => {
  const matric_no = req.body['matric-no']
  const password = req.body['password']
  console.log(matric_no,password)
res.json({ success: true, message: "Form submitted to server" });
});


// 404 Route
app.use((req,res)=>{
  res.status(404).send('Page This Page dosen\'t exist')
})



// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
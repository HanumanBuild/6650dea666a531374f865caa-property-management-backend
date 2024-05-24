// Adding necessary imports and configurations
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connecting to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.MONGODB_DBNAME,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Setting up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to handle contact form submissions
app.post('/contact', (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'navinrmani@gmail.com',
    subject: 'New Contact Form Submission',
    text: `You have a new contact form submission from: ${email}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('Property Management Backend');
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
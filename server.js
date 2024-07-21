const express = require('express');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config;

dotenv.config()
const cors = require('cors');
var app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post('/referrals', async (req, res) => {
  const { referrerName, referrerMail, refereeName, refereeMail } = req.body;
  if (!referrerName || !referrerMail || !refereeName || !refereeMail) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Save referral data
    const referral = await prisma.referral.create({
      data: { referrerName, referrerMail, refereeName, refereeMail },
    });
    res.status(201).json(referral);

    //Send referral email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iamsandip.com@gmail.com',
        pass: 'uhzy qxqd clvy taan',
      },
    });

    const mailOptions = {
      from: 'iamsandip.com@gmail.com',
      to: refereeMail,
      subject: 'Referral Confirmation',
      text: `Hi ${refereeName},\n\nYou have been referred by ${referrerName}.\n\nBest regards,\nSandip`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to send email' });
      }
      res.status(201).json(referral);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to save referral' });
  }
});

app.listen(4000, () => console.log('Express server is running on port 4000'));
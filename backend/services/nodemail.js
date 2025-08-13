const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.NODE_MAILER_GMAIL ,
    pass: process.env.NODE_MAILER_PASS 
  }
});

async function sendMail(to, sub, msg) {
  try {
    const info = await transporter.sendMail({
      from: '"OrgFlow" <dmelloserene08@gmail.com>', 
      to: to, 
      subject: sub,
      html: msg
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error; 
  }
}

module.exports = sendMail;
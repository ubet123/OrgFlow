const nodemailer = require('nodemailer');
require('dotenv').config()


const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false, 
  auth: {
    user: 'apikey', 
    pass: process.env.SENDGRID_API_KEY 
  }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

async function sendMail(to, sub, msg) {
  try {
    console.log('Attempting to send email to:', to);
    
    const info = await transporter.sendMail({
      from: '"OrgFlow" <dmelloserene08@gmail.com>', 
      to: to, 
      subject: sub,
      html: msg
    });
    
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error; 
  }
}

module.exports = sendMail;
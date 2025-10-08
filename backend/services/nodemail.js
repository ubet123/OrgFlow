const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use service instead of host/port for better reliability
  auth: {
    user: process.env.NODE_MAILER_GMAIL,
    pass: process.env.NODE_MAILER_PASS 
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
    console.log('Using email account:', process.env.NODE_MAILER_GMAIL);
    
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
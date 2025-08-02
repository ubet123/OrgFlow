const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: 'dmelloserene08@gmail.com',
    pass: 'wzenwdxaldnlmnfd' // Consider using environment variables
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
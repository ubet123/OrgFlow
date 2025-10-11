const sgMail = require('@sendgrid/mail');
require('dotenv').config();


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(to, subject, html) {
  try {
    console.log('Attempting to send email via SendGrid API to:', to);
    
    const msg = {
      to: to,
      from: {
        email: 'dmelloserene08@gmail.com', 
        name: 'OrgFlow'
      },
      subject: subject,
      html: html,
    };

    const response = await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid API');
    console.log('Response:', response[0].statusCode);
    return response;
  } catch (error) {
    console.error('SendGrid API error:', error);
    
    if (error.response) {
      console.error('SendGrid response error:', error.response.body);
    }
    
    throw error;
  }
}

module.exports = sendMail;
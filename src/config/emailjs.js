// EmailJS Configuration
// Replace these with your actual EmailJS credentials from https://www.emailjs.com/
export const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICEID, // Create a service in EmailJS dashboard and use its ID
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATEID, // Create an email template and use its ID
  publicKey: process.env.REACT_APP_EMAILJS_PUBLICKEY, // Your EmailJS public key
  
  // The email address that will receive the contact form submissions
  recipientEmail: process.env.REACT_APP_EMAILJS_EMAIL
};

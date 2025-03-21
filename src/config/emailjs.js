// EmailJS Configuration
// Replace these with your actual EmailJS credentials from https://www.emailjs.com/
export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICEID, // Create a service in EmailJS dashboard and use its ID
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATEID, // Create an email template and use its ID
  publicKey: import.meta.env.VITE_EMAILJS_PUBLICKEY, // Your EmailJS public key
  
  // The email address that will receive the contact form submissions
  recipientEmail: import.meta.env.VITE_APP_EMAILJS_EMAIL
};


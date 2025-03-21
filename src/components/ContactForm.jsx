import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: 'Please fill in all required fields'
      });
      return;
    }
    
    setFormStatus({
      isSubmitting: true,
      isSubmitted: false,
      error: null
    });

    // EmailJS configuration
    const { serviceId, templateId, publicKey } = EMAILJS_CONFIG;

    // Prepare template parameters
    const templateParams = {
      to_email: EMAILJS_CONFIG.recipientEmail,
      from_name: formData.name,
      from_email: formData.email,
      company: formData.company || 'Not specified',
      message: formData.message
    };

    try {
      // Send email using EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        error: null
      });

      // Reset form
      setFormData({
        name: '',
        company: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: 'Failed to send message. Please try again later.'
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/94 rounded-lg shadow-lg p-6">
      {formStatus.isSubmitted ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Thank You!</h3>
          <p className="text-gray-600 dark:text-gray-300">Your message has been sent successfully. I'll get back to you as soon as possible.</p>
          <button
            onClick={() => setFormStatus({ isSubmitting: false, isSubmitted: false, error: null })}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message <span className="text-red-500">*</span></label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              required
            ></textarea>
          </div>
          
          {formStatus.error && (
            <div className="text-red-500 text-sm">
              {formStatus.error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={formStatus.isSubmitting}
            className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors duration-300 ${
              formStatus.isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {formStatus.isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            * Required fields
          </p>
          
          {/* Note: Remove this comment block after setting up EmailJS */}
          {(!EMAILJS_CONFIG.serviceId || EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID') && (
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm rounded-md">
              <strong>Note:</strong> To make this contact form functional, you need to set up EmailJS. 
              See the <a href="https://github.com/swizzleshizzle/React-Portfolio/blob/main/docs/EMAILJS_SETUP.md" className="underline" target="_blank" rel="noopener noreferrer">EmailJS Setup Guide</a> for instructions.
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default ContactForm;

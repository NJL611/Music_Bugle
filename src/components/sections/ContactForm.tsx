'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    // In a real application, you would send this to an API endpoint
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }, 1000);
  };

  return (
    <div>
      <h2 className="text-[32px] font-prata text-gray-900 mb-6 border-b border-gray-200 pb-4">
        Send Us a Message
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="inquiryType" className="block text-sm font-graphiknormal text-gray-700 mb-2">
            Inquiry Type
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-500 bg-white"
            required
          >
            <option value="general">General Inquiry</option>
            <option value="press">Press Inquiry</option>
            <option value="tip">Story Tip</option>
            <option value="feedback">Feedback</option>
            <option value="partnership">Partnership</option>
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-graphiknormal text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-500 bg-white"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-graphiknormal text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-500 bg-white"
            required
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-graphiknormal text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What is this regarding?"
            className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-500 bg-white"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-graphiknormal text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us what's on your mind..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-500 bg-white resize-none"
            required
          />
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-sm text-sm">
            Thank you for your message! We&apos;ll get back to you soon.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-sm text-sm">
            Something went wrong. Please try again later.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-theme-red text-white text-sm py-3 rounded-sm hover:bg-[#a03b3c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-graphiknormal"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}




import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Send, 
  Facebook, 
  Youtube, 
  Instagram, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';

interface ContactPageProps {
  language: Language;
}

export const ContactPage: React.FC<ContactPageProps> = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে সব ঘর পূরণ করুন।' : 'Please fill in all required fields.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    // Smooth response simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 600);
  };

  return (
    <div className="min-h-screen pt-4 sm:pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header matching engliana */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {language === 'bn' ? 'যোগাযোগ করুন' : 'Get in Touch'}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {language === 'bn'
              ? 'কোনো প্রশ্ন, পরামর্শ বা মতামত জানাতে চান? আমরা আপনার বার্তা শোনার জন্য সদা প্রস্তুত।'
              : "Have a question, suggestion, or just want to say hi? We'd love to hear from you."}
          </p>
        </div>

        {/* 5-Column Grid matching engliana (3 cols Form, 2 cols Info) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left Column: Form (md:col-span-3) */}
          <div className="md:col-span-3">
            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-center">
                <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {language === 'bn' ? 'বার্তাটি পাঠানো হয়েছে!' : 'Message Sent!'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {language === 'bn'
                    ? 'ধন্যবাদ আমাদের সাথে যোগাযোগের জন্য। আমরা দ্রুত উত্তর দেব।'
                    : "Thank you for reaching out. We'll get back to you within 24 hours."}
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-purple-50/90 dark:from-indigo-950/60 dark:to-purple-950/60 border border-indigo-200 dark:border-indigo-800/50 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name and Email in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {language === 'bn' ? 'নাম' : 'Name'}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition-all"
                        placeholder={language === 'bn' ? 'আপনার নাম' : 'Your name'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {language === 'bn' ? 'ইমেইল' : 'Email'}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {language === 'bn' ? 'বিষয়' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition-all"
                      placeholder={language === 'bn' ? 'কী বিষয়ে?' : "What's this about?"}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {language === 'bn' ? 'বার্তা' : 'Message'}
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition-all resize-none"
                      placeholder={language === 'bn' ? 'আপনার বার্তা বিস্তারিত লিখুন...' : 'Tell us more...'}
                    />
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 px-4 py-2.5 rounded-xl">
                      <AlertCircle size={16} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Gradient button with shadow-indigo */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>{language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'}</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: md:col-span-2 space-y-6 */}
          <div className="md:col-span-2 space-y-6">
            {/* Contact Info Card matching engliana exact colors */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-100/80 to-blue-100/80 dark:from-indigo-950/60 dark:to-blue-950/40 border border-indigo-300 dark:border-indigo-800/50 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                {language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Info'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-200 dark:bg-indigo-800/70 flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-indigo-700 dark:text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {language === 'bn' ? 'ইমেইল' : 'Email'}
                    </p>
                    <a 
                      href="mailto:editorial@thegeopacts.com" 
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      editorial@thegeopacts.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-200 dark:bg-purple-800/70 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-purple-700 dark:text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {language === 'bn' ? 'অবস্থান' : 'Location'}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Available worldwide 🌍
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Us Card matching engliana exact colors */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-50/80 to-rose-50/80 dark:from-pink-950/50 dark:to-rose-950/40 border border-pink-200 dark:border-pink-800/40 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                {language === 'bn' ? 'আমাদের অনুসরণ করুন' : 'Follow Us'}
              </h3>
              <div className="space-y-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <Facebook size={16} className="text-blue-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Facebook</span>
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <Youtube size={16} className="text-red-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">YouTube</span>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <Instagram size={16} className="text-pink-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

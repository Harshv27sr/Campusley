// src/pages/PrivacyPage.jsx
import { motion } from 'framer-motion'
import { Shield, Eye, Lock, FileText, Globe, Cookie, Info } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'

export default function PrivacyPage() {
  document.title = 'Privacy Policy — Campusley'

  return (
    <MainLayout>
      <div className="py-16 transition-colors duration-300" style={{ backgroundColor: '#1A1A24' }}>
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center text-[#818CF8] mb-4">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Privacy Policy
            </h1>
            <p className="text-dark-muted mt-2 text-sm sm:text-base max-w-xl">
              We value your privacy and are committed to protecting your personal data. Learn how we handle your information on Campusley.
            </p>
          </motion.div>

          {/* Policy Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-black/20 rounded-3xl p-6 sm:p-10 border border-white/5 space-y-8 text-dark-muted leading-relaxed"
          >
            {/* Introduction */}
            <section className="border-b border-white/5 pb-6">
              <p>
                Welcome to <strong>Campusley</strong> (accessible from <a href="https://campusley-kappa.vercel.app" className="text-[#818CF8] hover:underline">campusley-kappa.vercel.app</a>). 
                This Privacy Policy document outlines the types of personal data collected, how we use it, our cookie practices, and how third-party services like Google AdSense process information. 
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
              </p>
            </section>

            {/* 1. Information We Collect */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Info size={20} className="text-[#818CF8]" />
                1. Information We Collect
              </h2>
              <p>
                Campusley collects information in order to provide academic resources and verification services to our users. This includes:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2 text-sm sm:text-base">
                <li><strong>Account Credentials:</strong> Full Name, Email Address, Password, and Location Details (State & City).</li>
                <li><strong>Education Verification:</strong> Educational Level (College/School), Institution Name, Branch, Board, and Class.</li>
                <li><strong>Verification Media:</strong> An uploaded image of your Student ID Card and a Live Selfie to verify you are a genuine student. These media files are processed securely.</li>
                <li><strong>Log Files:</strong> Like other websites, we log internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and clicks. These are not linked to personally identifiable information.</li>
              </ul>
            </section>

            {/* 2. How We Use Your Information */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock size={20} className="text-[#818CF8]" />
                2. How We Use Your Information
              </h2>
              <p> We use the collected data for various purposes, including to: </p>
              <ul className="list-disc list-inside pl-4 space-y-2 text-sm sm:text-base">
                <li>Provide, operate, maintain, and optimize the Campusley portal.</li>
                <li>Verify student credentials dynamically using AI and administrative review.</li>
                <li>Ensure a secure community by preventing academic fraud and duplicate profiles.</li>
                <li>Improve user experience, analyze site usage, and expand academic notes content.</li>
                <li>Process notes uploads, downloads, and bookmark selections.</li>
                <li>Communicate with you for customer support, system updates, and security alerts.</li>
              </ul>
            </section>

            {/* 3. Cookies and Web Beacons */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Cookie size={20} className="text-[#818CF8]" />
                3. Cookies and Web Beacons
              </h2>
              <p>
                Campusley uses 'cookies' to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. 
                The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
              </p>
            </section>

            {/* 4. Google DoubleClick DART Cookie & Google AdSense */}
            <section className="space-y-3 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe size={20} className="text-[#818CF8]" />
                4. Google AdSense & Third-Party Advertising
              </h2>
              <p className="text-sm sm:text-base">
                Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. 
              </p>
              <p className="text-sm sm:text-base mt-2">
                Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#818CF8] hover:underline">https://policies.google.com/technologies/ads</a>.
              </p>
              <p className="text-sm sm:text-base mt-2">
                Note that Campusley has no access to or control over these cookies that are used by third-party advertisers. You should consult the respective Privacy Policies of these third-party ad servers for more detailed information.
              </p>
            </section>

            {/* 5. Third-Party Privacy Policies */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText size={20} className="text-[#818CF8]" />
                5. Third-Party Links & External Sites
              </h2>
              <p>
                Campusley's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>
            </section>

            {/* 6. User Data Rights */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Eye size={20} className="text-[#818CF8]" />
                6. Your Data Protection Rights
              </h2>
              <p>
                We want to make sure you are fully aware of all of your data protection rights (including CCPA, GDPR, and Indian DPDP Act guidelines):
              </p>
              <ul className="list-disc list-inside pl-4 space-y-2 text-sm sm:text-base">
                <li><strong>The Right to Access:</strong> You have the right to request copies of your personal data stored on Campusley.</li>
                <li><strong>The Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
                <li><strong>The Right to Erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
                <li><strong>The Right to Withdraw Consent:</strong> Since verification requires uploading credentials, you can withdraw consent and delete your uploaded images by contacting us.</li>
              </ul>
            </section>

            {/* 7. Contact Info */}
            <section className="border-t border-white/5 pt-6 space-y-2">
              <h2 className="text-xl font-bold text-white">7. Contact Information</h2>
              <p>
                If you have any questions or queries regarding this Privacy Policy or user data deletion, please contact us:
              </p>
              <div className="bg-white/5 rounded-xl p-4 inline-block border border-white/5">
                <p className="text-sm font-semibold text-white">Campusley Support</p>
                <p className="text-xs text-slate-400 mt-0.5">Country: India</p>
                <a href="mailto:support@campusley.in" className="text-sm text-[#818CF8] font-bold hover:underline block mt-1.5">
                  support@campusley.in
                </a>
              </div>
            </section>

            {/* Last updated footer */}
            <div className="border-t border-white/5 pt-6 text-center text-xs text-dark-muted font-semibold uppercase tracking-wider">
              Last Updated: June 2026
            </div>

          </motion.div>
          
        </div>
      </div>
    </MainLayout>
  )
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaGlobeAmericas, FaUserShield, FaPassport, FaHotel, FaPlane, FaUmbrellaBeach } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";


const Privacy = () => {
  const privacySections = [
    {
      icon: <FaPassport className="text-2xl" />,
      title: "Traveler Information",
      content: "We collect passport details, travel preferences, and booking information to create seamless travel experiences. Your data helps us customize recommendations for destinations, accommodations, and activities."
    },
    {
      icon: <FaPlane className="text-2xl" />,
      title: "Booking Data Usage",
      content: "Your itinerary details are used to coordinate flights, hotels, and tours. We share necessary information with trusted partners to fulfill your travel arrangements while maintaining strict confidentiality."
    },
    {
      icon: <FaUserShield className="text-2xl" />,
      title: "Security Measures",
      content: "We employ advanced encryption for all transactions and store sensitive data in secure systems. Regular audits ensure compliance with international data protection standards for travelers worldwide."
    },
    {
      icon: <FaHotel className="text-2xl" />,
      title: "Third-Party Sharing",
      content: "Essential booking details are shared only with verified partners (hotels, airlines, tour operators) required to deliver your travel services. We never sell your personal information."
    },
    {
      icon: <FaGlobeAmericas className="text-2xl" />,
      title: "Global Compliance",
      content: "Our privacy practices adhere to GDPR, CCPA, and other international regulations. Regardless of where you travel from, we protect your data with the highest global standards."
    },
    {
      icon: <FaUmbrellaBeach className="text-2xl" />,
      title: "Vacation Preferences",
      content: "We use cookies to remember your favorite destinations, travel styles, and special requests. This allows us to suggest personalized vacation options for your next adventure."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with World Map Texture */}
      <header className="relative overflow-hidden bg-blue-900 text-white">
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ 
       
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center justify-center mb-6">
                <FaGlobeAmericas className="text-5xl text-teal-400 mr-4" />
                <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight">
                  Exotoura Privacy Commitment
                </h1>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl text-blue-100 max-w-2xl mx-auto"
              >
                Protecting your travel data as carefully as we plan your journeys
              </motion.p>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-16 bg-white rounded-xl shadow-lg p-8 border border-gray-200"
          >
            <div className="text-center mb-8">
              <p className="text-sm uppercase tracking-wider text-teal-600 font-semibold mb-2">
                Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Privacy Promise
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-gray-600">
                  At Exotoura, we understand that your travel plans are personal. This Privacy Policy explains how we collect, 
                  use, and protect your information as you explore the world with us. We're committed to maintaining your trust 
                  as we help you discover extraordinary destinations.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Privacy Sections */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {privacySections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="mb-4 text-teal-500">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{section.title}</h3>
                  <p className="text-gray-600 flex-grow">{section.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Policies */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-16 bg-white rounded-xl shadow-lg p-8 border border-gray-200"
          >
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Detailed Information Collection
                </h3>
                <p className="text-gray-600 mb-4">
                  When you book with Exotoura, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Identification Data:</strong> Full name, passport details, nationality</li>
                  <li><strong>Contact Information:</strong> Email, phone number, emergency contacts</li>
                  <li><strong>Travel Details:</strong> Itineraries, flight preferences, dietary restrictions</li>
                  <li><strong>Payment Information:</strong> Encrypted credit card details for bookings</li>
                  <li><strong>Behavioral Data:</strong> Website interactions to improve your experience</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Your Rights as a Traveler
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Access & Correction</h4>
                    <p className="text-gray-700">
                      Review and update your travel profile at any time through your Exotoura account.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Data Portability</h4>
                    <p className="text-gray-700">
                      Request a copy of your travel data in a machine-readable format.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Deletion Rights</h4>
                    <p className="text-gray-700">
                      Ask us to delete your personal data, subject to legal retention requirements.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Consent Withdrawal</h4>
                    <p className="text-gray-700">
                      Opt-out of marketing communications while retaining essential travel updates.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                  International Data Transfers
                </h3>
                <p className="text-gray-600">
                  As a global travel company, your information may be transferred to and processed in countries outside 
                  your residence. We ensure all data transfers comply with applicable laws and implement Standard 
                  Contractual Clauses where required. Our partners are carefully vetted for compliance with international 
                  data protection standards.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-16 bg-gradient-to-r from-blue-800 to-teal-700 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-8 md:p-10 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Questions About Your Travel Data?</h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                Our Privacy Team is available to help you understand how we protect and manage your travel information.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-100 text-blue-800 font-semibold rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                >
                  Contact Privacy Team
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-6 py-3 text-white hover:text-blue-100 font-medium rounded-lg transition duration-300 border border-white hover:border-blue-200"
                >
                  Return to Homepage
                  <HiChevronRight className="ml-1 text-xl" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="text-2xl font-bold text-white">
                <span className="text-teal-400">Exotoura</span>
              </Link>
              <p className="text-sm mt-2">
                Crafting unforgettable journeys around the globe
              </p>
            </div>
            <div className="text-sm text-center md:text-right">
              <p className="mb-2">© {new Date().getFullYear()} Exotoura International Ltd.</p>
              <div className="flex flex-wrap justify-center md:justify-end space-x-4">
                <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
                <Link to="/privacy" className="hover:text-white transition font-semibold text-teal-400">Privacy Policy</Link>
                <Link to="/cookies" className="hover:text-white transition">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaGlobeAmericas, FaPassport, FaHotel, FaPlane, FaUmbrellaBeach, FaHandshake, FaUserShield, FaInfoCircle } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";



const Terms = () => {
  const termsSections = [
    {
      icon: <FaGlobeAmericas className="text-2xl" />,
      title: "Welcome to Exotoura",
      content: "By accessing our platform, you agree to these terms that govern your use of Exotoura's travel services. We connect adventurers with extraordinary global experiences while maintaining the highest standards of service."
    },
    {
      icon: <FaPassport className="text-2xl" />,
      title: "Account Responsibilities",
      content: "Travelers must provide accurate passport and personal information for bookings. You're responsible for maintaining account security and all activities under your profile. Notify us immediately of any unauthorized use."
    },
    {
      icon: <FaPlane className="text-2xl" />,
      title: "Booking Policies",
      content: "Flight, hotel, and tour reservations are subject to provider terms. Prices may change until confirmed. We recommend reviewing cancellation policies carefully as they vary by destination and service type."
    },
    {
      icon: <FaHandshake className="text-2xl" />,
      title: "Cultural Respect",
      content: "We expect all travelers to respect local customs, traditions, and laws. Exotoura reserves the right to refuse service to anyone displaying disrespectful behavior toward cultures or communities."
    },
    {
      icon: <FaHotel className="text-2xl" />,
      title: "Service Accuracy",
      content: "While we strive for accuracy, travel information may change. Verify visa requirements, health advisories, and entry regulations with official sources before departure."
    },
    {
      icon: <FaUserShield className="text-2xl" />,
      title: "Safety & Liability",
      content: "Travel involves inherent risks. We partner with reputable providers but aren't liable for accidents, injuries, or unforeseen events. Comprehensive travel insurance is strongly recommended."
    },
    {
      icon: <FaInfoCircle className="text-2xl" />,
      title: "Content Usage",
      content: "Travel photos and reviews shared with Exotoura may be used for promotional purposes. You retain ownership but grant us a worldwide license to showcase your travel experiences."
    },
    {
      icon: <FaUmbrellaBeach className="text-2xl" />,
      title: "Changes to Terms",
      content: "We may update these terms as our services evolve. Continued use after changes constitutes acceptance. Major updates will be communicated to active travelers via email."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
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
                  Exotoura Terms of Service
                </h1>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl text-blue-100 max-w-2xl mx-auto"
              >
                The guidelines that shape our global travel community
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
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Understanding Your Travel Agreement
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-gray-600">
                  These Terms of Service outline the relationship between you and Exotoura as we facilitate your global adventures. 
                  Please read them carefully before booking travel services through our platform.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Terms Sections */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {termsSections.map((section, index) => (
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

          {/* Legal Details */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-16 bg-white rounded-xl shadow-lg p-8 border border-gray-200"
          >
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Detailed Terms and Conditions
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">1. Booking and Payments</h4>
                    <p className="text-gray-600">
                      All bookings are subject to availability. Full payment may be required for certain destinations. 
                      Prices include estimated taxes and fees but may change due to currency fluctuations or government actions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">2. Cancellations and Refunds</h4>
                    <p className="text-gray-600">
                      Cancellation policies vary by provider. Generally, flights follow airline policies, while tours and 
                      accommodations may have stricter timelines. Review each booking's specific terms before confirming.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">3. Travel Documents</h4>
                    <p className="text-gray-600">
                      It's your responsibility to ensure proper documentation including valid passports, visas, and health 
                      certificates. We provide guidance but cannot be held responsible for denied entry due to incomplete paperwork.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">4. Limitation of Liability</h4>
                    <p className="text-gray-600">
                      Exotoura acts as an intermediary between travelers and service providers. We're not liable for acts of 
                      nature, political unrest, or provider failures beyond our control. Our responsibility is limited to the 
                      commission received for bookings.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Intellectual Property
                </h3>
                <p className="text-gray-600">
                  All Exotoura content including logos, trip designs, and website materials are protected by international 
                  copyright laws. Travelers may use itinerary details for personal travel purposes but may not reproduce, 
                  distribute, or commercialize our proprietary content without express written permission.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Acceptance Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-16 bg-gradient-to-r from-blue-800 to-teal-700 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-8 md:p-10 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Explore the World?</h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                By using Exotoura's services, you acknowledge that you've read and agreed to these Terms of Service.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-100 text-blue-800 font-semibold rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                >
                  Contact Our Team
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
                <Link to="/terms" className="hover:text-white transition font-semibold text-teal-400">Terms of Service</Link>
                <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                <Link to="/cookies" className="hover:text-white transition">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
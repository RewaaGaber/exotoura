import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div>
            <h3 className="font-extrabold text-2xl mb-3 text-amber-400 tracking-tight">
              Exotoura
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Explore unique destinations and create memorable experiences with Exotoura.
              Your journey starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-white hover:text-amber-300 transition-colors duration-200">
              Explore
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-200 hover:text-amber-300 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/places"
                  className="text-gray-200 hover:text-amber-300 transition-colors duration-200"
                >
                  Places
                </Link>
              </li>
              <li>
                <Link
                  to="/accommodation"
                  className="text-gray-200 hover:text-amber-300 transition-colors duration-200"
                >
                  Accommodation
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-gray-200 hover:text-amber-300 transition-colors duration-200"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/hangouts"
                  className="text-gray-200 hover:text-amber-300 transition-colors duration-200"
                >
                  Hangouts
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-white hover:text-amber-300 transition-colors duration-200">
              Support
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  to="/faq"
                  className="text-gray-200 hover:text-amber-300 transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-200 hover:text-amber-300 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-200 hover:text-amber-300 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-200 hover:text-amber-300 transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-white hover:text-amber-300 transition-colors duration-200">
              Stay in Touch
            </h4>
            <p className="text-gray-200 text-sm mb-3">
              Get the latest travel tips and event updates.
            </p>
            <div className="flex gap-1">
              <InputText
                placeholder="Your email"
                className="w-full p-2 rounded-l-md border-none focus:ring-amber-400 text-gray-800 bg-white"
              />
              <button
                className="bg-amber-400 text-gray-900  hover:bg-amber-500  rounded-r-md border-none "
              >
                <span className="p-2 text-sm font-semibold">Subscribe</span>
              </button>
            </div>
            {/* Social Media Icons */}
            <div className="flex space-x-3 mt-4">
              <a
                href="https://facebook.com"
                className="text-gray-200 hover:text-amber-300 transition-colors duration-200 p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-200 hover:text-amber-300 transition-colors duration-200 p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                aria-label="Twitter"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-200 hover:text-amber-300 transition-colors duration-200 p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-200 hover:text-amber-300 transition-colors duration-200 p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-300 text-xs">
            © {new Date().getFullYear()} Exotoura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

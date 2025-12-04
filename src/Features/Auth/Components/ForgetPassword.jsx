import { FaEnvelope } from "react-icons/fa";
import { useFormik } from "formik";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { forgetPasswordSchema } from "../Validations/auth.validation.js";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleForgetPassword = async (values) => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await axios.post(
        "https://exotoura-api.vercel.app/auth/forgotpassword",
        values
      );
      if (data.status === "success") {
        setSuccess(true);
        setTimeout(() => {
          navigate("/auth/password-reset-code");
        }, 3000);
      }
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgetPasswordSchema,
    onSubmit: handleForgetPassword,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-4">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            animate={{
              x: [0, 100, 0],
              y: [0, 100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
            style={{
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="mx-auto bg-gradient-to-r from-cyan-400 to-blue-500 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-6"
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -15, 0],
              }}
              transition={{
                y: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 4, repeat: Infinity },
              }}
            >
              <FaEnvelope className="text-white text-3xl" />
            </motion.div>

            <motion.h1
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Reset your password
            </motion.h1>
            <p className="text-white/80">Enter your email to receive a reset link</p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
              <p className="text-white/90 mb-4">
                Password reset instructions have been sent to your email.
              </p>
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-4 text-white/70 text-sm">Redirecting to reset page...</p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={formik.handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <FaEnvelope className="text-white/70" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300 py-4 pl-12 pr-4"
                    placeholder="Enter your email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <motion.p
                    className="text-red-300 ps-1 text-sm mt-2 flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formik.errors.email}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formik.isValid || formik.isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <BiLoaderCircle className="animate-spin text-2xl" />
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>

              {error && (
                <motion.div
                  className="mt-4 p-3 bg-red-400/20 border border-red-400/30 rounded-xl text-red-200 flex items-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <svg
                    className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </motion.div>
              )}

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-white/70">
                  Remember your password?{" "}
                  <a
                    href="#"
                    className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/auth/login");
                    }}
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </motion.form>
          )}
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">© 2023 SecureAuth. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgetPassword;

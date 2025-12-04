import { useState, useRef } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PasswordResetCode = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;

        if (value && index < 3) {
          inputRefs.current[index + 1]?.focus();
        }

        if (newOtp.every((digit) => digit !== "")) {
          setTimeout(() => handleSubmit(newOtp), 0);
        }

        return newOtp;
      });
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";

        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }

        return newOtp;
      });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").trim().slice(0, 4);
    if (/^\d{4}$/.test(text)) {
      const newOtp = text.split("");
      setOtp(newOtp);
      inputRefs.current[3]?.focus();
      setTimeout(() => handleSubmit(newOtp), 0);
    }
  };

  const handleSubmit = (otpArray) => {
    if (otpArray.some((digit) => digit === "")) return;
    setLoading(true);
    localStorage.setItem("passwordResetCode", otpArray.join(""));
    navigate("/auth/reset-password");
  };

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
                y: [0, -15, 0] 
              }}
              transition={{ 
                y: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 4, repeat: Infinity }
              }}
            >
              <svg 
                className="text-white text-3xl" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </motion.div>
            
            <motion.h1 
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Verification Code
            </motion.h1>
            <p className="text-white/80">
              Enter the 4-digit code sent to your email
            </p>
          </div>

          <motion.form
            onSubmit={(e) => e.preventDefault()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  type="text"
                  value={digit}
                  maxLength="1"
                  className="w-16 h-16 text-center text-3xl font-bold bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-300"
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  ref={(el) => (inputRefs.current[index] = el)}
                  whileFocus={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
              ))}
            </div>

            <motion.button
              type="button"
              onClick={() => handleSubmit(otp)}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={otp.some((digit) => digit === "")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <BiLoaderCircle className="animate-spin text-2xl" />
              ) : (
                "Verify Code"
              )}
            </motion.button>
          </motion.form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/70">
              Didn't receive code?{" "}
              <button 
                className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors duration-300"
                onClick={() => navigate(-1)}
              >
                Resend
              </button>
            </p>
          </div>
        </motion.div>
        
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            © 2023 SecureAuth. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordResetCode;
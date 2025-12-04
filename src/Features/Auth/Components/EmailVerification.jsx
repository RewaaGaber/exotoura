import axios from "axios";
import { useState, useRef, useContext } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo_1.png";
import { motion } from "framer-motion";
import { useAuthStore } from "../Hooks/useAuthStore.js";

const EmailVerification = () => {
  const navigate = useNavigate();
  const { setToken, persistLogin, setPersist } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState(null);

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
    setError(null);
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

  const handleSubmit = async (otpArray) => {
    if (otpArray.some((digit) => digit === "")) return;
    try {
      setLoading(true);
      const code = otpArray.join("");
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/verifyemail/${code}`
      );

      if (data.status === "success") {
        setToken(data.accessToken);
        navigate("/disabilities");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      const email = localStorage.getItem("email");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/resendcode`, {
        email,
      });
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-28">
      <div className="logo flex justify-center mb-5">
        <motion.img
          src={logo}
          alt="logo"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </div>
      <div className="max-w-md mx-auto px-10 py-12 bg-white my-3 shadow-2xl rounded-2xl text-center">
        <h1 className="text-3xl font-bold">Email Verification</h1>
        <p className="text-slate-500 mt-2">
          Enter the 4-digit verification code sent to your email.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="mt-6">
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength="1"
                className="w-16 h-16 text-center text-2xl font-bold bg-slate-100 border rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => handleSubmit(otp)}
            className="mt-6 w-full bg-stone-700 hover:bg-stone-600 text-white py-3 rounded-lg transition text-lg"
            disabled={otp.some((digit) => digit === "")}
          >
            {loading ? (
              <BiLoaderCircle className="animate-spin text-white text-2xl inline " />
            ) : (
              "Verify Account"
            )}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-4">
          Didn't receive a code?{" "}
          <span className="text-stone-500 cursor-pointer" onClick={handleResend}>
            {resendLoading ? (
              <BiLoaderCircle className="animate-spin text-stone-500 text-xl inline " />
            ) : (
              "Resend"
            )}
          </span>
        </p>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default EmailVerification;

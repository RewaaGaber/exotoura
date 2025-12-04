import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { resetPasswordSchema } from "../Validations/auth.validation.js";
import { AuthContext } from "../AuthContext.jsx";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const otp = localStorage.getItem("passwordResetCode");
  const { setToken } = useContext(AuthContext);

  const handleResetPassword = async (values) => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await axios.patch(`${import.meta.env.VITE_BASE_URL}/auth/resetpassword/${otp}`, values);
      if (data.status === "success") {
        navigate("/");
        localStorage.removeItem("passwordResetCode");
        setToken(data.accessToken);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      localStorage.removeItem("passwordResetCode");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: handleResetPassword,
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
        <motion.form
          onSubmit={formik.handleSubmit}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-center mb-6">
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
              <FaLock className="text-white text-3xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-white/80">Enter your new password</p>
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="bg-white/10 border border-white/20 text-white focus:outline-none text-sm rounded-lg focus:ring-2 focus:ring-yellow-400 block w-full pl-10 pr-10 p-2.5"
                placeholder="Enter new password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock className="text-white/60" />
              </div>
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-white/60" />
                ) : (
                  <FaEye className="text-white/60" />
                )}
              </div>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!formik.isValid || loading}
          >
            {loading ? <BiLoaderCircle className="animate-spin text-2xl" /> : "Reset Password"}
          </button>

          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </motion.form>

        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">© 2023 SecureAuth. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

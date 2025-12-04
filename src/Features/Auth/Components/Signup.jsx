import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaMonument,
} from "react-icons/fa";
import { useFormik } from "formik";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { registerSchema } from "../Validations/auth.validation.js";
import egyptBackground from "../../../assets/home2.png";
import { useGoogleLogin } from "@react-oauth/google";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { Google } from "../../../utils/icons.utils.jsx";
import { useAuthStore } from "../Hooks/useAuthStore.js";

const Signup = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (values) => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/signup`,
        values
      );
      if (data.status == "success") {
        navigate("/auth/email-verification");
        localStorage.setItem("email", values.email);
      }
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/google/token`,
          { googleAccessToken: tokenResponse.access_token }
        );
        setToken(data.accessToken);
        navigate("/disabilities");
      } catch (error) {
        setError(error.response.data.message);
        console.error("Google login error:", error);
        setLoading(false);
      }
    },
    onError: () => console.error("Login Failed"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      fullName: {
        firstName: "",
        lastName: "",
      },
    },
    validationSchema: registerSchema,
    onSubmit: handleSignUp,
  });

  return (
    <div
      className="min-h-screen flex items-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.88), rgba(0, 0, 0, 0.4)), url(${egyptBackground})`,
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row bg-white bg-opacity-90 rounded-xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
          {/* Left Side - Image */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          >
            <div className="h-full  bg-gradient-to-br from-blue-900/80 via-purple-800/80 to-amber-700/80 flex items-center justify-center p-8 relative overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center relative z-10"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-1 bg-amber-400 mb-2"></div>
                </div>

                <h2 className="text-3xl font-bold mb-3 text-amber-300 font-serif tracking-wide">
                  Unlock Egypt's <span className="text-white">Timeless Mysteries</span>
                </h2>

                <p className="text-base mb-6 max-w-2xl mx-auto leading-relaxed">
                  Journey through millennia of history where pharaohs ruled and gods
                  walked among mortals
                </p>

                <div className="flex justify-center items-center mb-4">
                  {["𓃭", "𓂀", "𓃹", "𓆣"].map((glyph, i) => (
                    <motion.span
                      key={i}
                      className="text-xl mx-1 text-amber-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                      {glyph}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 p-6 md:p-8"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-amber-800 mb-1">
                Create Your Account
              </h2>
              <p className="text-gray-600 text-sm">
                Start your journey through Egypt's ancient wonders
              </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="First Name"
                      name="fullName.firstName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.fullName.firstName}
                    />
                  </div>
                  {formik.touched.fullName?.firstName &&
                    formik.errors.fullName?.firstName && (
                      <Message
                        severity="error"
                        className="mt-1 w-full text-start text-sm"
                        text={formik.errors.fullName.firstName}
                      />
                    )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Last Name"
                      name="fullName.lastName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.fullName.lastName}
                    />
                  </div>
                  {formik.touched.fullName?.lastName &&
                    formik.errors.fullName?.lastName && (
                      <Message
                        severity="error"
                        className="mt-1 w-full text-start text-sm"
                        text={formik.errors.fullName.lastName}
                      />
                    )}
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Email Address"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <Message
                    severity="error"
                    className="mt-1 w-full text-start text-sm"
                    text={formik.errors.email}
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Password"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400" />
                    ) : (
                      <FaEye className="text-gray-400" />
                    )}
                  </div>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <Message
                    severity="error"
                    className="mt-1 w-full text-start text-sm"
                    text={formik.errors.password}
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex justify-center items-center"
                disabled={!formik.isValid || formik.isSubmitting || !formik.dirty}
              >
                {loading ? (
                  <BiLoaderCircle className="animate-spin text-xl mr-2" />
                ) : null}
                {loading ? "" : "Sign Up & Explore"}
              </button>

              {error && (
                <Message
                  severity="error"
                  className="my-3 w-full text-start text-sm"
                  text={error}
                />
              )}

              <Divider align="center" className="my-4">
                <span className="text-sm text-gray-500 px-3 bg-white">
                  or continue with
                </span>
              </Divider>

              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="w-full flex justify-center items-center gap-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg shadow-sm transition duration-300"
              >
                <Google />
                Google
              </button>

              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    Log In
                  </Link>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link to="/auth/terms" className="text-amber-600 hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/auth/privacy" className="text-amber-600 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

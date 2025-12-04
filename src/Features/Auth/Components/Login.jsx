import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaMonument } from "react-icons/fa";
import { useFormik } from "formik";
import { Message } from "primereact/message";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { Divider } from "primereact/divider";
import { Google } from "../../../utils/icons.utils.jsx";
import egyptBackground from "../../../assets/home2.png";
import { useGoogleLogin } from "@react-oauth/google";
import { loginSchema } from "../Validations/auth.validation.js";
import { useGoogleLoginMutation, useLoginMutation } from "../Hooks/useAuthApi.js";
import { useAuthStore } from "../Hooks/useAuthStore.js";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setToken, persistLogin, setPersist, setRefreshToken } = useAuthStore();

  const {
    execute: login,
    error: loginError,
    isError: isLoginError,
    isLoading: isLoginLoading,
    isSuccess: isLoginSuccess,
  } = useLoginMutation();

  const {
    execute: googleLogin,
    error: googleLoginError,
    isError: isGoogleLoginError,
    isLoading: isGoogleLoginLoading,
    isSuccess: isGoogleLoginSuccess,
  } = useGoogleLoginMutation();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const data = await googleLogin({ googleAccessToken: tokenResponse.access_token });
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      navigate("/");
    },
    onError: () => console.error("Login Failed"),
  });

  const handleLogin = async (values) => {
    const data = await login(values);
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    navigate("/");
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className="min-h-screen bg-cover bg-center flex justify-center items-center" style={{ backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.88), rgba(0, 0, 0, 0.4)), url(${egyptBackground})`,
    backgroundPosition: "center center" }}>
      <div className="container mx-auto px-4 py-6">
      
        <div className="flex flex-col lg:flex-row bg-white bg-opacity-90 rounded-xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block lg:w-1/2 bg-cover bg-center"
           
          >
            <div className="h-full bg-gradient-to-br from-blue-900/80 via-purple-800/80 to-amber-700/80 flex items-center justify-center p-8">
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome Back Explorer</h2>
                <p className="mb-4">Continue your journey through Egypt's timeless wonders.</p>
                <div className="flex items-center space-x-2">
                
           
                </div>
              </div>
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
              <h2 className="text-2xl font-bold text-amber-800 mb-1">Log In to Your Account</h2>
              <p className="text-gray-600 text-sm">Access your personalized Egypt travel experience</p>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
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
                  <Message severity="error" className="mt-1 w-full text-start text-sm" text={formik.errors.email} />
                )}
              </div>

              <div className="mb-3">
                <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
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
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </div>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <Message severity="error" className="mt-1 w-full text-start text-sm" text={formik.errors.password} />
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    checked={persistLogin}
                    onChange={(e) => setPersist(e.target.checked)}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/auth/forget-password"
                  className="text-sm text-amber-600 hover:text-amber-700"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex justify-center items-center"
                disabled={!formik.isValid || formik.isSubmitting || !formik.dirty}
              >
                {isGoogleLoginLoading || isLoginLoading ? (
                  <BiLoaderCircle className="animate-spin text-xl mr-2" />
                ) : null}
                {isGoogleLoginLoading || isLoginLoading ? "" : "Log In"}
              </button>

              {(isGoogleLoginError || isLoginError) && (
                <Message
                  severity="error"
                  className="my-3 w-full text-start text-sm"
                  text={loginError?.message || googleLoginError?.message}
                />
              )}

              <Divider align="center" className="my-4">
                <span className="text-sm text-gray-500 px-3 bg-white">or continue with</span>
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
                  Don't have an account?{" "}
                  <Link to="/auth/signup" className="text-amber-600 hover:text-amber-700 font-semibold">
                    Sign Up
                  </Link>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  By logging in, you agree to our{" "}
                  <Link to="/auth/terms" className="text-amber-600 hover:underline">Terms</Link> and{" "}
                  <Link to="/auth/privacy" className="text-amber-600 hover:underline">Privacy Policy</Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
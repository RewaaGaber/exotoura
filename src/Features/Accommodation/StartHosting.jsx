import { Link } from "react-router-dom";
const StartHosting = ({ user }) => {
  return (
    <div className="relative flex justify-start items-center h-[500px] color-light text-white bg-[url('/src/assets/startHosting1.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
      <div className="relative ml-[8%] max-w-[50%]">
        <h1 className="text-7xl font-bold text-amber-50">More ways to start hosting</h1>
        <p className="text-gray-50 mt-2">
          No matter where you start, we have tips, videos, and guides for each step.
        </p>
        <div className="flex justify-start gap-4 mt-4">
          <Link
            to="/accommodation/learn-about-hosting"
            className="px-6 py-3 bg-white text-black rounded-md hover:opacity-80 transition"
          >
            Learn about hosting
          </Link>
          {user && user.role.includes("HOSTER") ? (
            <Link
              to="/accommodation/new/overview"
              className="px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-gray-800 transition"
            >
              Start hosting your place
            </Link>
          ) : (
            <Link
              to={user ? "/role/request" : "/auth/login"}
              className="px-6 py-3 bg-amber-500 text-white rounded-md hover:bg-gray-800 transition"
            >
              Get Started to host your place
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartHosting;

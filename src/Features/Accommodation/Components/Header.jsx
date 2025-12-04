import { Link } from "react-router-dom";
import logo from "../../../assets/logo_1.png";

const Header = ({ Save = true }) => {
  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white py-3 px-20 flex justify-end items-center">
        <div className="mr-auto">
          <a href="/accomodation" aria-label="Airbnb homepage" className="inline-flex items-center justify-center  rounded-full">
            <img src={logo} className="h-8" alt="" />
          </a>
        </div>
        <div className="pr-4">
          <Link
            to="/accommodation"
            className="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
          >
            {Save ? "Save & " : ""}Exit
          </Link>
        </div>
      </div>
    </>
  );
};
export default Header;

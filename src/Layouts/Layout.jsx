import Footer from "../Components/Footer/Footer.jsx";
import Loader from "../Components/Loader/Loader.jsx";
import Navbar from "../Components/Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";
import FloatingChatButton from "../Features/Chat/components/FloatingChatButton";

const Layout = () => {
  return (
    <div className="">
      <Navbar />

      <div className="flex flex-col flex-1">
        <div className="flex-1">
          <Outlet />
        </div>

        <Footer />
        <FloatingChatButton />
      </div>
    </div>
  );
};

export default Layout;

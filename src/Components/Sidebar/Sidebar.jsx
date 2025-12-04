import { Button } from "primereact/button";
import { PanelMenu } from "primereact/panelmenu";
import { classNames } from "primereact/utils";
import { Link, useNavigate } from "react-router-dom";
import { FaUsersCog, FaUsers } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { LuKeySquare, LuLocateFixed } from "react-icons/lu";

import logo from "../../assets/logo_1.png";
import useAuth from "../../Features/Auth/Hooks/useAuth.js";

const Sidebar = ({ isOpen, close }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const items = [
    {
      label: "profile",
      icon: <FaUsersCog className="w-5 h-7" />,
      command: () => navigate("/dashboard"),
    },
    isAdmin && {
      label: "role requests",
      icon: <LuKeySquare className="w-5 h-7" />,
      command: () => navigate("/dashboard/role-requests"),
    },
    isAdmin && {
      label: "place requests",
      icon: <LuLocateFixed className="w-5 h-7" />,
      command: () => navigate("/dashboard/place-requests"),
    },
    isAdmin && {
      label: "Users",
      icon: <FaUsers className="w-5 h-7" />,
      command: () => navigate("/dashboard/users"),
    },
    isAdmin && {
      label: "Events",
      icon: <FiCalendar className="w-5 h-7" />,
      command: () => navigate("/dashboard/events"),
    },
  ].filter(Boolean);

  return (
    <div
      className={classNames(
        "h-full w-full max-w-80 shrink-0",
        "bg-white max-lg:absolute top-0",
        "transition-all duration-500 z-50",
        {
          "left-0": isOpen,
          "lg:hidden max-lg:-left-96": !isOpen,
        }
      )}
    >
      <div className="row p-4 lg:hidden">
        <Button
          icon="pi pi-bars"
          pt={{
            root: "bg-transparent border-0",
            icon: "text-xl text-black",
          }}
          severity="contrast"
          onClick={close}
        />
        <Link to="/" className="sm:max-w-32">
          <img src={logo} alt="logo" className="max-w-32" />
        </Link>
      </div>

      <div className="p-4">
        <PanelMenu
          model={items}
          pt={{
            headerAction: "gap-3 bg-white px-3 py-4 rounded-md",
            headerIcon: "text-xl mr-0",
            headerLabel: "text-sm text-neutral-700 capitalize",
            headerSubmenuIcon: "order-1 ml-auto",
            action: "pl-10 gap-1 hover:bg-white py-2",
            icon: "text-[6px] text-neutral-400",
            label: "text-sm text-neutral-500 font-semibold capitalize",
            submenuicon: "order-1 ml-auto",
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;

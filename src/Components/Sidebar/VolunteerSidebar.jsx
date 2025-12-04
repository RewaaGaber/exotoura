import { Button } from "primereact/button";
import { PanelMenu } from "primereact/panelmenu";
import { classNames } from "primereact/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "../../assets/logo_1.png";

const Sidebar = ({ isOpen, close }) => {
  const { pathname } = useLocation();
  const [activeItem, setActiveItem] = useState(pathname.split("/").pop());

  const navigate = useNavigate();

  const handleItemClick = ({ item }) => {
    setActiveItem(item.key);
    const link = `/volunteering/dashboard/${item.key}`;
    navigate(link);
  };
  // /volunteering/dashboard/volunteer-request
  // /volunteering/dashboard/my-assigned-requests
  // /volunteering/dashboard/Finished-Requests
  const items = [
    {
      key: "volunteer-request",
      label: "All Volunteering Requests",
      icon: "pi pi-list",
      command: handleItemClick,
    },
    {
      key: "my-assigned-requests",
      label: "My Volunteering Requests",
      icon: "pi pi-user-edit",
      command: handleItemClick,
    },
    {
      key: "Finished-Requests",
      label: "Finished Requests",
      icon: "pi pi-check-circle",
      command: handleItemClick,
    },
  ];

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
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => handleItemClick({ item })}
            className={`border-2 ${
              item.key == activeItem
                ? " bg-gray-100 border-black "
                : "bg-gray-50 border-gray-200"
            } px-3 py-5 my-1 w-full text-start rounded-2xl `}
          >
            <i className={item.icon + " mr-3"} />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Menu } from "primereact/menu";
import { useRef } from "react";

import person from "../../assets/pfp.jpg";
import logo from "../../assets/logo_1.png";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUser } from "../../Features/Users";
import { useAuthStore } from "../../Features/Auth/index.js";
import { useLogoutMutation } from "../../Features/Auth/Hooks/useAuthApi.js";

const VolunteerNavbar = ({ toggle }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { token, setToken } = useAuthStore();
  const { execute, isLoading } = useLogoutMutation();
  const { isSuccess, data } = useGetCurrentUser();
  const user = isSuccess ? data.data.user : null;

  const items = [
    {
      label: "Options",
      items: [
        {
          label: "Settings",
          icon: "pi pi-home",
          command: () => {},
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: async () => {
            await execute();
            navigate("/");
            setToken(null);
            clearAllData();
          },
        },
      ],
    },
  ];

  return (
    <div className="flex w-full">
      <div className={classNames("row flex-1", "p-4 md:pr-6 max-w-80")}>
        <Button
          icon="pi pi-bars"
          pt={{
            root: "bg-transparent border-0",
            icon: "text-xl text-black",
          }}
          severity="contrast"
          onClick={toggle}
        />
        <Link to="/" className="sm:max-w-32">
          <img src={logo} alt="logo" className="max-w-32" />
        </Link>
      </div>

      <div className="row justify-end pr-4 md:px-12 flex-1">
        <div
          className="row gap-0.5 cursor-pointer shrink-0"
          onClick={(e) => menuRef.current.toggle(e)}
        >
          <img
            src={user?.profilePicture}
            alt="person"
            className="size-12 rounded-full object-cover"
          />
          <i className="pi pi-ellipsis-v text-sm" />
          <Menu model={items} popup ref={menuRef} />
        </div>
      </div>
    </div>
  );
};

export default VolunteerNavbar;

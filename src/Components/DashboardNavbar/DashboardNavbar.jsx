import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Menu } from "primereact/menu";
import { useRef } from "react";

import pfp from "../../assets/pfp.jpg";
import logo from "../../assets/logo_1.png";
import { useGetCurrentUser } from "../../Features/Users";
import { useAuthStore } from "../../Features/Auth";
import { useLogoutMutation } from "../../Features/Auth/Hooks/useAuthApi";
import { useApiStore } from "../../hooks/useApiStore";
import Loader from "../Loader/Loader";

const DashboardNavbar = ({ toggle }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isSuccess, data } = useGetCurrentUser();
  const { setToken, setRefreshToken } = useAuthStore();
  const { execute, isLoading } = useLogoutMutation();
  const { clearAllData } = useApiStore();

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
            setToken(null);
            setRefreshToken(null);
            clearAllData();
            setTimeout(() => {
              navigate("/auth/login");
            }, 0);
          },
        },
      ],
    },
  ];

  if (isLoading) return <Loader />;

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
          <button
            className="cursor-pointer"
            onClick={(event) => menuRef.current.toggle(event)}
          >
            <img
              src={(isSuccess && data.data.user.profilePicture) || pfp}
              className="size-12 rounded-full object-cover bg-center"
              alt="profile picture"
            />
          </button>
          <i className="pi pi-ellipsis-v text-sm" />
          <Menu model={items} popup ref={menuRef} />
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;

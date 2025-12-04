import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo_1.png";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import pfp from "../../assets/pfp.jpg";
import { Menu } from "primereact/menu";
import { useGetCurrentUser } from "../../Features/Users";
import { useAuth, useAuthStore } from "../../Features/Auth/index.js";
import { useLogoutMutation } from "../../Features/Auth/Hooks/useAuthApi.js";
import Loader from "../Loader/Loader.jsx";
import { useApiStore } from "../../hooks/useApiStore.js";

const Navbar = () => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isSuccess, data } = useGetCurrentUser();
  const { setToken, setRefreshToken } = useAuthStore();
  const { execute, isLoading } = useLogoutMutation();
  const { clearAllData } = useApiStore();
  const { isLoggedIn } = useAuth();

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
      if (menuRef.current) {
        const fakeEvent = {
          currentTarget: null,
        };
        menuRef.current.hide(fakeEvent);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const pages = [
    ,
    {
      name: "Home",
      path: "/",
    },
    ,
    {
      name: "Places",
      path: "/places",
    },
    {
      name: "Events",
      path: "/events",
    },
    {
      name: "CouchSurfing",
      path: "/accommodation",
    },
    {
      name: "Volunteering",
      path: "/Volunteering",
    },
    {
      name: "Hangout",
      path: "/hangouts",
    },
    {
      name: "About",
      path: "/about",
    },
  ];
  const items = [
    ...(isSmallScreen
      ? [
          {
            label: "Links",
            items: pages.map((page) => ({
              label: page.name,
              command: () => navigate(page.path),
            })),
          },
        ]
      : []),
    {
      label: "Options",
      items: isLoggedIn
        ? [
            {
              label: "Dashboard",
              icon: "pi pi-cog",
              command: () => navigate("/dashboard"),
            },
            {
              label: "Logout",
              icon: "pi pi-sign-out",
              command: async () => {
                await execute();
                navigate("/");
                setToken(null);
                setRefreshToken(null);
                clearAllData();
              },
            },
          ]
        : [
            {
              label: "Sign in",
              icon: "pi pi-sign-in",
              command: () => navigate("/auth/login"),
            },
            {
              label: "Sign up",
              icon: "pi pi-user-plus",
              command: () => navigate("/auth/signup"),
            },
          ],
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <nav
      className={classNames(
        "w-full sticky backdrop-blur-sm top-0 z-40 transition-normal duration-1000",
        scrolled
          ? "bg-white/60 shadow-md rounded-full mx-auto top-2 max-w-[calc(100%-4rem)]"
          : "bg-white/50 shadow-md"
      )}
    >
      <div
        className={classNames(
          "flex items-center mx-auto py-3.5 px-5 sm:px-8",
          scrolled
            ? "max-w-7xl xl:max-w-full xl:px-12"
            : "max-w-7xl xl:max-w-full xl:px-20"
        )}
      >
        <div className="flex items-center gap-8 flex-1">
          <Link to="/" className="shrink-0">
            <img src={logo} className="w-32" alt="logo" />
          </Link>

          <ul
            className={classNames(
              "flex items-center gap-3 lg:gap-6 max-md:hidden",
              isLoggedIn && "mx-auto"
            )}
          >
            {pages.map((page) => (
              <li key={page.name}>
                <NavLink
                  to={page.path}
                  className={({ isActive }) =>
                    classNames("text-neutral-700 font-medium text-[17px]", {
                      "border-b-2": isActive,
                      "hover:underline": !isActive,
                    })
                  }
                >
                  {page.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center">
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
          </div>
        ) : (
          <div className="flex items-center gap-4 max-lg:hidden">
            <button
              className={classNames(
                "text-gray-600 font-semibold text-[15px]",
                "cursor-pointer hover:underline mr-4"
              )}
              onClick={() => navigate("/auth/login")}
            >
              Sign in
            </button>

            <Button
              label="GET STARTED"
              pt={{
                root: "px-4.5 py-2.5 bg-gray-700 hover:opacity-80 transition border-0 rounded-sm",
                label: "font-medium font-roboto text-sm text-white tracking-wide",
              }}
              severity="secondary"
              onClick={() => navigate("/auth/signup")}
            />
          </div>
        )}
        {!isLoggedIn && (
          <Button
            icon="pi pi-align-justify"
            className="lg:hidden"
            pt={{ root: "bg-transparent border-0 p-0", icon: "text-black text-2xl" }}
            severity="secondary"
            onClick={(event) => menuRef.current.toggle(event)}
          />
        )}
        <Menu
          model={items}
          popup
          popupAlignment="right"
          ref={menuRef}
          pt={{
            menuitem: "text-sm",
            action: "py-2.5",
            submenuHeader: "text-sm py-2",
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;

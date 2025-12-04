import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "./useAuthStore";

const roles = {
  admin: "ADMIN",
  user: "USER",
  hoster: "HOSTER",
  organizer: "ORGANIZER",
  volunteer: "VOLUNTEER",
};

const useAuth = () => {
  const { token } = useAuthStore();

  const isLoggedIn = Boolean(token);
  let isGuest = true;
  let isUser = false;
  let isAdmin = false;
  let isHoster = false;
  let isOrganizer = false;
  let isVolunteer = false;
  let name = "guest";

  if (isLoggedIn) {
    const {
      userInfo: {
        fullName: { firstName, lastName },
        role,
      },
    } = jwtDecode(token);

    isGuest = false;
    isUser = true;
    isAdmin = role.includes(roles.admin) || role === roles.admin;
    isHoster = role.includes(roles.hoster) || role === roles.hoster;
    isOrganizer = role.includes(roles.organizer) || role === roles.organizer;
    isVolunteer = role.includes(roles.volunteer) || role === roles.volunteer;
    name = `${firstName} ${lastName}`;
  }

  return {
    isLoggedIn,
    isGuest,
    isUser,
    isAdmin,
    isHoster,
    isOrganizer,
    isVolunteer,
    name,
  };
};

export default useAuth;

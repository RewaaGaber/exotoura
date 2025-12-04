import { FaUser, FaUsers } from "react-icons/fa"; // Added FaUsers for group avatar
// Assuming you have a classNames utility
import { classNames } from "primereact/utils";

const UserAvatar = ({ profilePicture, size = 40, isGroup = false, unreadCount = 0 }) => {
  // Color scheme matching the image
  const avatarColors = {
    background: "#E0E0E0", // Light gray background
    iconColor: "#757575", // Dark gray icon color
    border: "#BDBDBD", // Medium gray border
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div
      className={classNames(
        "rounded-full flex items-center justify-center border-2 shrink-0 relative",
        typeof size === "string" ? sizeClasses[size] : ""
      )}
      style={{
        width: typeof size === "number" ? `${size}px` : undefined,
        height: typeof size === "number" ? `${size}px` : undefined,
        backgroundColor: avatarColors.background,
        borderColor: avatarColors.border,
      }}
    >
      {/* Avatar Content */}
      {isGroup ? (
        <FaUsers
          size={typeof size === "string" ? iconSize[size] : size * 0.5}
          color={avatarColors.iconColor}
        />
      ) : profilePicture ? (
        <img
          src={profilePicture}
          alt="User profile"
          className="rounded-full w-full h-full object-cover"
        />
      ) : (
        <FaUser
          size={typeof size === "string" ? iconSize[size] : size * 0.5}
          color={avatarColors.iconColor}
        />
      )}

      {/* Unread Count Badge */}
      {unreadCount > 0 && (
        <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;

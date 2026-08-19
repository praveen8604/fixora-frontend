import { useContext, useState } from "react";
import Cookies from "js-cookie";
import { IoLogOutOutline } from "react-icons/io5";
import { AdminContext } from "@/context/AdminContext";
import AlertDialog from "../common/AlterDialogBox";

const SidebarProfile = () => {
  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state;
  const [hovered, setHovered] = useState(false);

  const name = adminInfo?.userName || adminInfo?.name || "Admin";
  const email = adminInfo?.email || "";
  const initial = (email || name || "A").charAt(0).toUpperCase();

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
    Cookies.remove("token");
    const adminDomain = import.meta.env.VITE_APP_ADMIN_DOMAIN;
    window.location.replace(adminDomain ? `${adminDomain}/login` : "/login");
  };

  return (
    <div
      className="absolute bottom-4 left-0 right-0 flex justify-center px-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#211e27] text-sm font-medium text-white"
          aria-label="Profile"
        >
          {adminInfo?.image ? (
            <img
              src={adminInfo.image}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </button>

        {hovered && (
          <div className="absolute bottom-0 left-full z-[80] pl-3">
            <div className="w-[240px] rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-[0_12px_32px_rgba(33,30,39,0.12)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#211e27] text-sm font-medium text-white">
                  {adminInfo?.image ? (
                    <img
                      src={adminInfo.image}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#211e27]">
                    {name}
                  </p>
                  <p className="truncate text-xs text-[#A3AED0]">{email}</p>
                </div>
              </div>

              <AlertDialog
                onAgree={handleLogOut}
                dialogTitle={"Logout?"}
                dialogDetails={"Are you sure you want to logout?"}
                AgreeButtonValue="Yes, Logout!"
                CancelButton="Cancel"
                triggerButton={(onClickFunc) => (
                  <button
                    type="button"
                    onClick={onClickFunc}
                    className="logout-btn mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm"
                  >
                    <IoLogOutOutline className="text-base" />
                    Logout
                  </button>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfile;

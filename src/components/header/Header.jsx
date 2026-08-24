import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiGrid, FiLogOut } from "react-icons/fi";
import { Avatar } from "@windmill/react-ui";
import Cookies from "js-cookie";
import sidebar from "@/routes/sidebar";
import { AdminContext } from "@/context/AdminContext";
import AlertDialog from "@/components/common/AlterDialogBox";

const Header = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state || {};

  const [profileOpen, setProfileOpen] = useState(false);
  const pRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pRef.current && !pRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileOpen = () => {
    setProfileOpen((prev) => !prev);
  };

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
    Cookies.remove("token");
    window.location.replace("/login");
  };

  const getHeaderTitle = () => {
    const extraTitles = [
      { path: "/services/servicerequests/request", name: "Service Request" },
      { path: "/users/technician/details", name: "Technician Details" },
      { path: "/users/rider/details", name: "Rider Details" },
      { path: "/users/customer/details", name: "Customer Details" },
      { path: "/appliance/overview", name: "Appliance Overview" },
      { path: "/user", name: "User Details" },
    ];

    const extraMatch = extraTitles.find(
      (item) => pathname === item.path || pathname.startsWith(`${item.path}?`)
    );
    if (extraMatch) return extraMatch.name;

    for (const route of sidebar) {
      if (route.subMenu?.length) {
        const child = [...route.subMenu]
          .sort((a, b) => b.path.length - a.path.length)
          .find(
            (item) =>
              pathname === item.path || pathname.startsWith(`${item.path}/`)
          );
        if (child) return child.name;
      }
      if (pathname === route.path || pathname.startsWith(`${route.path}/`)) {
        return route.name;
      }
    }

    return "Dashboard";
  };

  return (
    <>
      <header className="z-30 py-4 bg-[var(--primary-color)] backdrop-blur-lg shadow-sm">
        <div className="container flex items-center justify-between px-6 h-full mx-auto">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {getHeaderTitle()}
          </h2>
          <ul className="flex justify-end items-center">
            {/* <!-- Profile menu --> */}
            <li className="relative inline-block text-left" ref={pRef}>
              <button
                className="rounded-full dark:bg-gray-500 bg-[#211e27] text-white h-8 w-8 font-medium mx-auto focus:outline-none"
                onClick={handleProfileOpen}
              >
                {adminInfo?.image ? (
                  <Avatar
                    className="align-middle"
                    src={adminInfo.image}
                    aria-hidden="true"
                  />
                ) : (
                  <span>
                    {adminInfo?.email ? adminInfo.email[0].toUpperCase() : "A"}
                  </span>
                )}
              </button>

              {profileOpen && (
                <ul className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 focus:outline-none z-50">
                  <li className="justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                    <Link to="/dashboard">
                      <span className="flex items-center text-sm">
                        <FiGrid className="w-4 h-4 mr-3" aria-hidden="true" />
                        <span>{t("Dashboard")}</span>
                      </span>
                    </Link>
                  </li>

                  <AlertDialog
                    onClickInsider={() => setProfileOpen(true)}
                    onAgree={() => handleLogOut()}
                    dialogTitle={"Logout?"}
                    dialogDetails={"Are you sure you want to logout?"}
                    AgreeButtonValue="Yes, Logout!"
                    CancelButton="Cancel"
                    triggerButton={(onClickFunc) => {
                      return (
                        <li
                          onClick={onClickFunc}
                          className="cursor-pointer justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        >
                          <span className="flex items-center text-sm">
                            <FiLogOut
                              className="w-4 h-4 mr-3"
                              aria-hidden="true"
                            />
                            <span>{t("LogOut")}</span>
                          </span>
                        </li>
                      );
                    }}
                  />
                </ul>
              )}
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;

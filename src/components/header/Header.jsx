import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import {
  FiChevronDown,
  FiGrid,
  FiLogOut,
} from "react-icons/fi";

import sidebar from "@/routes/sidebar";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AlertDialog from "@/components/common/AlterDialogBox";

const Header = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state || {};

  const { isSidebarOpen } = useContext(SidebarContext);

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  /* =========================================================
     CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     PROFILE DROPDOWN
  ========================================================= */

  const handleProfileOpen = () => {
    setProfileOpen((prev) => !prev);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogOut = () => {
    dispatch({
      type: "USER_LOGOUT",
    });

    Cookies.remove("adminInfo");
    Cookies.remove("token");

    setProfileOpen(false);

    window.location.replace("/login");
  };

  /* =========================================================
     HEADER TITLE
  ========================================================= */

  const getHeaderTitle = () => {
    const extraTitles = [
      {
        path: "/services/servicerequests/request",
        name: "Service Request",
      },
      {
        path: "/users/technician/details",
        name: "Technician Details",
      },
      {
        path: "/users/rider/details",
        name: "Rider Details",
      },
      {
        path: "/users/customer/details",
        name: "Customer Details",
      },
      {
        path: "/appliance/overview",
        name: "Appliance Overview",
      },
      {
        path: "/user",
        name: "User Details",
      },
    ];

    const extraMatch = extraTitles.find(
      (item) =>
        pathname === item.path ||
        pathname.startsWith(`${item.path}?`)
    );

    if (extraMatch) {
      return extraMatch.name;
    }

    for (const route of sidebar) {
      if (route.subMenu?.length) {
        const child = [...route.subMenu]
          .sort(
            (a, b) =>
              b.path.length - a.path.length
          )
          .find(
            (item) =>
              pathname === item.path ||
              pathname.startsWith(`${item.path}/`)
          );

        if (child) {
          return child.name;
        }
      }

      if (
        pathname === route.path ||
        pathname.startsWith(`${route.path}/`)
      ) {
        return route.name;
      }
    }

    return "Dashboard";
  };

  const headerTitle = getHeaderTitle();

  /* =========================================================
     SIDEBAR BASED HEADER POSITION
  ========================================================= */

  const headerLeft = isSidebarOpen ? "256px" : "70px";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          fixed
          top-0
          right-0
          z-[40]
          h-[72px]
          border-b
          border-slate-200
          bg-white/95
          backdrop-blur-md
          shadow-sm
        "
        style={{
          left: headerLeft,
          width: `calc(100% - ${headerLeft})`,
          transition:
            "left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className="
            flex
            h-full
            items-center
            justify-between
            px-5
            md:px-8
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================== */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="min-w-0 flex flex-col justify-center">
              {/* Admin Panel */}
              <div
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                  mb-0.5
                "
              >
                Admin Panel
              </div>

              {/* Page Title */}
              <h1
                className="
                  truncate
                  text-[20px]
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                {headerTitle}
              </h1>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="flex items-center">
            {/* =================================================
                PROFILE
            ================================================== */}

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={handleProfileOpen}
                aria-label="Open profile menu"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  py-1.5
                  pl-1.5
                  pr-3
                  transition-all
                  duration-200
                  hover:border-slate-300
                  hover:bg-slate-50
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500/20
                "
              >
                {/* Avatar */}
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-md
                    bg-indigo-600
                    text-xs
                    font-medium
                    text-white
                  "
                >
                  {adminInfo?.image ? (
                    <img
                      className="h-full w-full object-cover"
                      src={adminInfo.image}
                      alt="Admin"
                    />
                  ) : (
                    <span>
                      {adminInfo?.email
                        ? adminInfo.email[0].toUpperCase()
                        : "A"}
                    </span>
                  )}
                </div>

                {/* Profile Info */}
                <div className="hidden max-w-[140px] text-left sm:block">
                  <p
                    className="
                      truncate
                      text-[13px]
                      font-semibold
                      text-slate-900
                      leading-none
                      mb-1
                    "
                  >
                    {adminInfo?.email || "Administrator"}
                  </p>
                  <p
                    className="
                      text-[11px]
                      font-medium
                      text-slate-500
                      leading-none
                    "
                  >
                    Administrator
                  </p>
                </div>

                {/* Chevron */}
                <FiChevronDown
                  size={16}
                  className={`
                    text-slate-400
                    transition-transform
                    duration-200
                    ${profileOpen ? "rotate-180" : "rotate-0"}
                  `}
                />
              </button>

              {/* =================================================
                  PROFILE DROPDOWN
              ================================================== */}
              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[56px]
                    w-[240px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-100
                    bg-white
                    shadow-lg
                    shadow-slate-200/50
                  "
                >
                  {/* Dropdown Header */}
                  <div
                    className="
                      border-b
                      border-slate-100
                      bg-slate-50/50
                      px-4
                      py-3.5
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-widest
                        text-slate-500
                      "
                    >
                      Account
                    </p>
                    <p
                      className="
                        mt-1
                        truncate
                        text-[13px]
                        font-semibold
                        text-slate-900
                      "
                    >
                      {adminInfo?.email || "Administrator"}
                    </p>
                  </div>

                  <div className="py-1.5">
                    {/* DASHBOARD */}
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="
                        group
                        flex
                        items-center
                        gap-3
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-slate-600
                        transition-colors
                        hover:bg-slate-50
                        hover:text-slate-900
                      "
                    >
                      <FiGrid size={16} className="text-slate-400 group-hover:text-indigo-600" />
                      <span>{t("Dashboard")}</span>
                    </Link>

                    {/* LOGOUT */}
                    <AlertDialog
                      onClickInsider={() => setProfileOpen(true)}
                      onAgree={handleLogOut}
                      dialogTitle="Logout?"
                      dialogDetails="Are you sure you want to logout?"
                      AgreeButtonValue="Yes, Logout!"
                      CancelButton="Cancel"
                      triggerButton={(onClickFunc) => (
                        <button
                          type="button"
                          onClick={onClickFunc}
                          className="
                            group
                            flex
                            w-full
                            items-center
                            gap-3
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-red-600
                            transition-colors
                            hover:bg-red-50
                          "
                        >
                          <FiLogOut size={16} className="text-red-500 group-hover:text-red-600" />
                          <span>{t("LogOut")}</span>
                        </button>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          HEADER SPACER
      ====================================================== */}

      <div
        className="w-full shrink-0"
        style={{
          height: "72px",
          minHeight: "72px",
        }}
      />
    </>
  );
};

export default Header;
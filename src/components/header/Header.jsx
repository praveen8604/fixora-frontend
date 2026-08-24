import React, { useContext, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { FiGrid, FiLogOut, FiChevronDown } from "react-icons/fi";

import sidebar from "@/routes/sidebar";
import { AdminContext } from "@/context/AdminContext";
import AlertDialog from "@/components/common/AlterDialogBox";

const Header = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const profileRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const { adminInfo, dispatch } = useContext(AdminContext);

  const handleProfileOpen = () => {
    setProfileOpen((prev) => !prev);
  };

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
    setProfileOpen(false);
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
      (item) => pathname === item.path || pathname.startsWith(`${item.path}?`),
    );

    if (extraMatch) {
      return extraMatch.name;
    }

    for (const route of sidebar) {
      if (route.subMenu?.length) {
        const child = [...route.subMenu]
          .sort((a, b) => b.path.length - a.path.length)
          .find(
            (item) =>
              pathname === item.path || pathname.startsWith(`${item.path}/`),
          );

        if (child) {
          return child.name;
        }
      }

      if (pathname === route.path || pathname.startsWith(`${route.path}/`)) {
        return route.name;
      }
    }

    return "Dashboard";
  };

  const headerTitle = getHeaderTitle();

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
    w-full
    bg-white/95
    backdrop-blur-xl
    border-b
    border-[#E7EAF3]
    shadow-[0_4px_20px_rgba(99,102,241,0.06)]
  "
      >
        <div
          className="
            h-full
            flex
            items-center
            justify-between
            px-5
            md:px-7
            lg:pl-[80px]
            lg:pr-7
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div className="flex items-center min-w-0">
            {/* Small decorative line */}

            <div
              className="
                hidden
                md:block
                w-[4px]
                h-9
                rounded-full
                mr-4
                bg-gradient-to-b
                from-[var(--primary-elite-color)]
                to-[#8B7CF6]
              "
            />

            <div className="min-w-0">
              <div
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#8B91A7]
                  mb-0.5
                "
              >
                Admin Panel
              </div>

              <h1
                className="
                  text-[18px]
                  md:text-[20px]
                  font-bold
                  text-[#252B4A]
                  truncate
                  leading-tight
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
            {/* PROFILE */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={handleProfileOpen}
                className="
                  group
                  flex
                  items-center
                  gap-2.5
                  pl-2
                  pr-3
                  py-1.5
                  rounded-full
                  bg-[#F5F4FF]
                  border
                  border-[#E4E1FF]
                  hover:bg-[#EEECFF]
                  hover:border-[#D8D4FF]
                  hover:shadow-[0_6px_18px_rgba(99,102,241,0.12)]
                  transition-all
                  duration-200
                  focus:outline-none
                "
                aria-label="Open profile menu"
              >
                {/* Avatar */}

                <div
                  className="
                    h-9
                    w-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    bg-gradient-to-br
                    from-[var(--primary-elite-color)]
                    to-[#8B7CF6]
                    text-white
                    font-bold
                    text-sm
                    shadow-[0_4px_10px_rgba(99,102,241,0.20)]
                    ring-2
                    ring-white
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

                {/* Profile info */}

                <div className="hidden sm:block text-left max-w-[130px]">
                  <p
                    className="
                      text-[12px]
                      font-bold
                      text-[#303653]
                      truncate
                    "
                  >
                    {adminInfo?.email || "Administrator"}
                  </p>

                  <p
                    className="
                      text-[10px]
                      font-medium
                      text-[#8B91A7]
                    "
                  >
                    Administrator
                  </p>
                </div>

                <FiChevronDown
                  size={15}
                  className={`
                    text-[#7379A0]
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
                    top-[52px]
                    w-[230px]
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    border
                    border-[#E8E7F4]
                    shadow-[0_16px_40px_rgba(74,70,130,0.14)]
                    animate-[fadeIn_0.18s_ease-out]
                  "
                >
                  {/* Dropdown Header */}

                  <div
                    className="
                      px-4
                      py-3.5
                      bg-gradient-to-r
                      from-[#F7F6FF]
                      to-[#F0EEFF]
                      border-b
                      border-[#E9E7F6]
                    "
                  >
                    <p
                      className="
                        text-[11px]
                        uppercase
                        tracking-wider
                        font-bold
                        text-[#8B7CF6]
                      "
                    >
                      Account
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-sm
                        font-bold
                        text-[#303653]
                        truncate
                      "
                    >
                      {adminInfo?.email || "Administrator"}
                    </p>
                  </div>

                  {/* Dashboard */}

                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-[#596078]
                      hover:bg-[#F4F2FF]
                      hover:text-[var(--primary-elite-color)]
                      transition-all
                      duration-200
                    "
                  >
                    <span
                      className="
                        h-9
                        w-9
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        bg-[#F0EEFF]
                        text-[var(--primary-elite-color)]
                        group-hover:bg-[var(--primary-elite-color)]
                        group-hover:text-white
                        transition-all
                        duration-200
                      "
                    >
                      <FiGrid size={16} />
                    </span>

                    <span>{t("Dashboard")}</span>
                  </Link>

                  {/* Logout */}

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
                          w-full
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-[#596078]
                          hover:bg-[#FFF5F5]
                          hover:text-[#E46A6A]
                          transition-all
                          duration-200
                          border-t
                          border-[#F0EFF6]
                        "
                      >
                        <span
                          className="
                            h-9
                            w-9
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            bg-[#FFF1F1]
                            text-[#E46A6A]
                            group-hover:bg-[#E46A6A]
                            group-hover:text-white
                            transition-all
                            duration-200
                          "
                        >
                          <FiLogOut size={16} />
                        </span>

                        <span>{t("LogOut")}</span>
                      </button>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          HEADER SPACER

          This prevents page content from going underneath
          the fixed header.
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

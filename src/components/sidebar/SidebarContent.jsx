import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { FaArrowCircleLeft } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { Button } from "@windmill/react-ui";
import sidebar from "@/routes/sidebar";
import logo from "@/assets/img/logo/logo.png";
import logo_short from "@/assets/img/logo/logohead.png";
import { SidebarContext } from "@/context/SidebarContext";
import { AdminContext } from "@/context/AdminContext";
import SidebarProfile from "@/components/sidebar/SidebarProfile";
import SidebarSubMenu from "@/components/sidebar/SidebarSubMenu";
import AlertDialog from "@/components/common/AlterDialogBox";

const SidebarContent = () => {
  const { isSidebarOpen, toggleSidebar, openSidebar, closeSidebar } =
    useContext(SidebarContext);
  const { dimentions, dispatch } = useContext(AdminContext);

  const { t } = useTranslation();
  const { pathname } = useLocation();

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
    Cookies.remove("token");
    window.location.replace("/login");
  };

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      {/* =====================================================
          LOGO
      ====================================================== */}

      <div className="flex items-center">
        <a href="/dashboard" className="overflow-hidden p-4 py-0">
          <div className="w-64">
            <img
              src={isSidebarOpen ? logo : logo_short}
              alt="fixmate"
              style={{
                height: "40px",
              }}
              onMouseOver={openSidebar}
            />
          </div>
        </a>

        {/* COLLAPSE BUTTON */}

        <div className="absolute right-[-10px] mt-[10px] text-[var(--primary-elite-color)]">
          <button
            type="button"
            className={`
              relative
              rounded-full
              bg-white
              transition-all
              duration-500
              ease-in-out
              focus:outline-none
              ${isSidebarOpen ? "rotate-0" : "rotate-180"}
            `}
            style={{
              transitionDuration: "0.5s",
              ...(dimentions?.width <= 1024 && !isSidebarOpen
                ? { left: "20px" }
                : { left: "0px" }),
            }}
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <FaArrowCircleLeft size="20" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* =====================================================
          SIDEBAR MENU
      ====================================================== */}

      <ul className="mt-8 px-2">
        {sidebar.map((route) => {
          const isActive =
            route?.path === pathname ||
            route?.path?.split("/")[1] === pathname?.split("/")[1];

          return (
            <li className="relative mb-1" key={route?.name}>
              <NavLink
                exact
                to={route?.path}
                rel="noreferrer"
                onMouseOver={openSidebar}
                className={`
                  group
                  relative
                  flex
                  h-[55px]
                  w-full
                  items-center
                  justify-between
                  rounded-[12px]
                  px-4
                  text-sm
                  font-semibold
                  no-underline
                  transition-all
                  duration-200
                  ease-in-out

                  ${
                    isActive
                      ? "bg-[#20242B] text-white shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
                      : "bg-transparent text-[#68717F] hover:bg-[#F1F2F4] hover:text-[#282D35]"
                  }
                `}
              >
                {/* =================================================
                    ICON + TEXT
                ================================================== */}

                <div className="inline-flex min-w-0 items-center">
                  <route.icon
                    className={`
                      h-5
                      w-5
                      shrink-0
                      transition-colors
                      duration-200

                      ${
                        isActive
                          ? "text-white"
                          : "text-[#68717F] group-hover:text-[#282D35]"
                      }
                    `}
                    aria-hidden="true"
                  />

                  {isSidebarOpen && (
                    <div
                      className={`
                        ml-4
                        overflow-hidden
                        text-nowrap
                        transition-colors
                        duration-200

                        ${
                          isActive
                            ? "text-white"
                            : "text-[#68717F] group-hover:text-[#282D35]"
                        }
                      `}
                    >
                      {t(`${route?.name}`)}
                    </div>
                  )}
                </div>

                {/* =================================================
                    SUBMENU ARROW
                ================================================== */}

                {route?.subMenu?.length > 0 && (
                  <div
                    className={`
                      shrink-0
                      transition-all
                      duration-300

                      ${
                        route?.path?.split("/")[1] === pathname?.split("/")[1]
                          ? "-rotate-180"
                          : ""
                      }

                      ${
                        isActive
                          ? "text-white"
                          : "text-[#8C94A0] group-hover:text-[#282D35]"
                      }
                    `}
                  >
                    <IoIosArrowDown size={16} />
                  </div>
                )}
              </NavLink>

              {/* =================================================
                  SUBMENU
              ================================================== */}

              {route?.subMenu?.length > 0 && (
                <SidebarSubMenu
                  route={route?.subMenu}
                  parentLink={route?.path?.split("/")[1]}
                  currentParentPath={pathname?.split("/")[1]}
                  pathname={pathname}
                />
              )}
            </li>
          );
        })}
      </ul>

      {/* =====================================================
          LOGOUT
      ====================================================== */}

      <div
        className={`
          absolute
          bottom-0
          p-6
          ${
            isSidebarOpen
              ? "w-64 px-6 py-6"
              : "flex items-center justify-center"
          }
        `}
        style={{
          width: "-webkit-fill-available",
        }}
      >
        <AlertDialog
          onAgree={() => handleLogOut()}
          dialogTitle={"Logout?"}
          dialogDetails={"Are you sure you want to logout?"}
          AgreeButtonValue="Yes, Logout!"
          CancelButton="Cancel"
          triggerButton={(onClickFunc) => {
            return (
              <Button
                onClick={onClickFunc}
                size="large"
                className="logout-btn w-full overflow-hidden"
              >
                <span className="flex items-center gap-3">
                  <IoLogOutOutline className="text-lg" />

                  {isSidebarOpen && (
                    <span className="text-sm text-nowrap">{t("LogOut")}</span>
                  )}
                </span>
              </Button>
            );
          }}
        />
      </div>
    </div>
  );
};

export default SidebarContent;

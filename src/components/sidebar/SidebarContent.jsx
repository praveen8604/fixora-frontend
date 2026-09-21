import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { NavLink, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Button } from "@windmill/react-ui";

import { FaArrowCircleLeft } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";

import sidebar from "@/routes/sidebar";


import logo_short from "@/assets/img/logo/logo.png";
import logo from "@/assets/img/logo/logohead.png";

import { SidebarContext } from "@/context/SidebarContext";
import { AdminContext } from "@/context/AdminContext";

import SidebarSubMenu from "@/components/sidebar/SidebarSubMenu";
import AlertDialog from "@/components/common/AlterDialogBox";

const SidebarContent = () => {
  const { dimentions, dispatch } = useContext(AdminContext);

  const {
    isSidebarOpen,
    toggleSidebar,
    openSidebar,
  } = useContext(SidebarContext);

  const { t } = useTranslation();
  const { pathname } = useLocation();

  const isRouteActive = (route) => {
    if (!route) return false;

    const currentPath = pathname || "";
    const routePath = route.path || "";

    return (
      routePath === currentPath ||
      routePath.split("/")[1] ===
      currentPath.split("/")[1]
    );
  };

  const [openMenu, setOpenMenu] = useState(() => {
    const activeRoute = sidebar.find((route) => isRouteActive(route));
    return activeRoute ? activeRoute.name : null;
  });
  const [panelPos, setPanelPos] = useState(0);

  const itemRefs = useRef({});
  const panelRef = useRef(null);

  useEffect(() => {
    if (isSidebarOpen) {
      const activeRoute = sidebar.find((route) => isRouteActive(route));
      setOpenMenu(activeRoute ? activeRoute.name : null);
    } else {
      setOpenMenu(null);
    }
  }, [pathname, isSidebarOpen]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogOut = () => {
    dispatch({
      type: "USER_LOGOUT",
    });

    Cookies.remove("adminInfo");
    Cookies.remove("token");

    window.location.replace("/login");
  };

  // =========================================================
  // SUBMENU
  // =========================================================

  const handleIconClick = (route) => {
    if (!route?.subMenu?.length) {
      setOpenMenu(null);
      return;
    }

    if (openMenu === route.name) {
      setOpenMenu(null);
      return;
    }

    const element = itemRefs.current[route.name];

    if (element) {
      setPanelPos(element.getBoundingClientRect().top);
    }

    setOpenMenu(route.name);
  };

  // =========================================================
  // CLOSE FLOATING SUBMENU ON OUTSIDE CLICK
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
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

  // =========================================================
  // CLOSE FLOATING MENU WHEN SIDEBAR OPENS
  // =========================================================

  // =========================================================
  // ACTIVE ROUTE (Moved up)
  // =========================================================

  const activePanel = sidebar.find(
    (route) => route.name === openMenu
  );

  return (
    <div
      className="
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        bg-white
        text-[#6B7280]
      "
    >
      {/* =====================================================
          LOGO HEADER
      ====================================================== */}

      <div
        className="
          relative
          z-20
          shrink-0
          px-3
          pt-3
          pb-2
        "
      >
        <div
          className={`
            relative
            flex
            h-[60px]
            w-full
            items-center
            rounded-lg
            bg-slate-50
            transition-all
            duration-300

            ${isSidebarOpen ? "px-3" : "justify-center px-2"}
          `}
        >
          {/* Logo */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSidebar();
            }}
            role="button"
            tabIndex={0}
            className={`
              relative
              z-50
              flex
              min-w-0
              cursor-pointer
              items-center
              overflow-visible
              no-underline

              ${isSidebarOpen ? "w-full" : "justify-center"}
            `}
          >
            {isSidebarOpen ? (
              <div
                className="
                  flex
                  h-[48px]
                  w-full
                  items-center
                  justify-start
                  rounded-md
                  bg-slate-50
                "
              >
                <img
                  src={logo}
                  alt="RepairMint"
                  className="
                    block
                    h-[36px]
                    w-auto
                    max-w-[180px]
                    object-contain
                    object-left
                  "
                />
              </div>
            ) : (
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-md
                  bg-slate-50
                "
              >
                <img
                  src={logo_short}
                  alt="RepairMint"
                  className="
                    block
                    h-8
                    w-8
                    object-contain
                  "
                />
              </div>
            )}
          </div>
        </div>

        {/* Workspace Label */}
        {isSidebarOpen && (
          <div
            className="
              mt-4
              mb-1
              flex
              items-center
              gap-3
              px-3
            "
          >
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-widest
                text-slate-400
              "
            >
              Workspace
            </span>

            <div
              className="
                h-px
                flex-1
                bg-slate-200
              "
            />
          </div>
        )}
      </div>

      {/* =====================================================
          SIDEBAR MENU
      ====================================================== */}

      <div
        className="
          sidebar-menu
          relative
          z-10
          mt-3
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-2
          pb-24
        "
      >
        <ul className="space-y-1">
          {sidebar.map((route) => {
            const isActive = isRouteActive(route);

            return (
              <li
                className="relative"
                key={route?.name}
                ref={(element) => {
                  itemRefs.current[route.name] = element;
                }}
              >
                {/* =================================================
                    MAIN ROUTE
                ================================================== */}

                <NavLink
                  exact
                  to={route?.path}
                  rel="noreferrer"
                  onMouseOver={openSidebar}
                  onClick={() => {
                    if (!route?.subMenu?.length) {
                      setOpenMenu(null);
                    }
                  }}
                  className={`
                      group
                      relative
                      flex
                      min-h-[44px]
                      w-full
                      items-center
                      justify-between
                      overflow-hidden
                      rounded-lg
                      px-3
                      py-2
                      no-underline
                      transition-all
                      duration-200

                      ${isActive
                      ? "bg-accent/10 text-primary shadow-sm border border-brandGreen/20"
                      : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-primary"
                    }

                      ${isSidebarOpen ? "justify-between" : "justify-center px-0"}
                    `}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <span
                      className="
                          absolute
                          left-0
                          top-1/2
                          h-5
                          w-[3px]
                          -translate-y-1/2
                          rounded-r-md
                          bg-brandGreen
                        "
                    />
                  )}

                  {/* Icon + Text */}
                  <div
                    className={`
                        relative
                        z-10
                        flex
                        min-w-0
                        items-center

                        ${isSidebarOpen ? "" : "justify-center"}
                      `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          transition-all
                          duration-200

                          ${isActive
                          ? "bg-brandGreen/10 text-brandGreen"
                          : "bg-transparent text-slate-400 group-hover:text-primary"
                        }
                        `}
                    >
                      {route?.icon && (
                        <route.icon
                          className="h-[18px] w-[18px] shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    {/* Text */}
                    {isSidebarOpen && (
                      <div
                        className={`
                            ml-3
                            overflow-hidden
                            text-nowrap
                            text-[13px]
                            ${isActive
                            ? "font-semibold text-primary"
                            : "font-medium text-slate-600 group-hover:text-primary"
                          }
                          `}
                      >
                        {t(`${route?.name}`)}
                      </div>
                    )}
                  </div>

                  {/* Submenu Arrow */}
                  {route?.subMenu?.length > 0 && isSidebarOpen && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleIconClick(route);
                      }}
                      className={`
                          relative
                          z-10
                          flex
                          h-6
                          w-6
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          border-0
                          bg-transparent
                          transition-transform
                          duration-200

                          ${openMenu === route.name ? "-rotate-180" : ""}
                          ${isActive ? "text-primary" : "text-slate-400 group-hover:text-primary"}
                        `}
                      aria-label={`Toggle ${route.name} submenu`}
                    >
                      <IoIosArrowDown size={14} />
                    </button>
                  )}
                </NavLink>

                {/* =================================================
                    COLLAPSED TOOLTIP
                ================================================== */}

                {!isSidebarOpen && (
                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-[62px]
                      top-1/2
                      z-[100]
                      -translate-y-1/2
                      translate-x-[-5px]
                      whitespace-nowrap
                      rounded-lg
                      border
                      border-slate-200
                      bg-slate-200
                      px-3
                      py-2
                      text-[10px]
                      font-bold
                      text-slate-900
                      opacity-0
                      shadow-xl
                      transition-all
                      duration-200
                      group-hover:translate-x-0
                      group-hover:opacity-100
                    "
                  >
                    {t(`${route?.name}`)}

                    <span
                      className="
                        absolute
                        left-[-4px]
                        top-1/2
                        h-2
                        w-2
                        -translate-y-1/2
                        rotate-45
                        border-l
                        border-b
                        border-slate-200
                        bg-slate-200
                      "
                    />
                  </div>
                )}

                {/* =================================================
                    EXPANDED SUBMENU
                ================================================== */}

                {route?.subMenu?.length > 0 &&
                  isSidebarOpen &&
                  openMenu === route.name && (
                    <SidebarSubMenu
                      route={route?.subMenu}
                      parentLink={route?.path?.split("/")[1]}
                      currentParentPath={
                        pathname?.split("/")[1]
                      }
                      pathname={pathname}
                    />
                  )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* =====================================================
          LOGOUT
      ====================================================== */}

      <div
        className={`
            absolute
            bottom-0
            left-0
            z-20
            w-full
            border-t
            border-slate-200
            bg-slate-50
            px-3
            py-3

            ${isSidebarOpen ? "" : "flex justify-center"}
          `}
      >
        <AlertDialog
          onAgree={handleLogOut}
          dialogTitle="Logout?"
          dialogDetails="Are you sure you want to logout?"
          AgreeButtonValue="Yes, Logout!"
          CancelButton="Cancel"
          triggerButton={(onClickFunc) => (
            <Button
              onClick={onClickFunc}
              size="large"
              className={`
                  !m-0
                  !min-h-[44px]
                  !w-full
                  !min-w-0
                  !overflow-hidden
                  !rounded-lg
                  !border-0
                  !bg-transparent
                  !px-2
                  !normal-case
                  !text-accent
                  !shadow-none
                  transition-all
                  duration-200
                  hover:!bg-slate-200
                  hover:!text-slate-900
                  ${!isSidebarOpen ? "!px-0" : ""}
                `}
            >
              <span
                className={`
                    flex
                    w-full
                    items-center

                    ${isSidebarOpen ? "gap-3" : "justify-center"}
                  `}
              >
                <span
                  className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-md
                      bg-slate-200
                      text-slate-600
                      transition-colors
                      group-hover:bg-slate-300
                      group-hover:text-slate-900
                    "
                >
                  <IoLogOutOutline className="text-lg" />
                </span>

                {isSidebarOpen && (
                  <span
                    className="
                        text-[13px]
                        font-medium
                        text-nowrap
                        text-slate-600
                      "
                  >
                    {t("LogOut")}
                  </span>
                )}
              </span>
            </Button>
          )}
        />
      </div>

      {/* =====================================================
          COLLAPSED FLOATING SUBMENU
      ====================================================== */}

      {!isSidebarOpen &&
        openMenu &&
        activePanel?.subMenu?.length > 0 && (
          <div
            ref={panelRef}
            className="
              fixed
              left-[78px]
              z-[300]
              min-w-[190px]
              rounded-xl
              border
              border-slate-200
              bg-slate-200
              py-2
              shadow-xl
            "
            style={{
              top: panelPos,
            }}
          >
            <p
              className="
                px-4
                py-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-slate-400
              "
            >
              {t(activePanel.name)}
            </p>

            {activePanel.subMenu.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                onClick={() => setOpenMenu(null)}
                className={`
                  block
                  border-l-2
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  no-underline
                  transition-colors
                  duration-150

                  ${pathname === child.path
                    ? `
                        border-slate-800
                        bg-slate-700
                        font-semibold
                        text-slate-900
                      `
                    : `
                        border-transparent
                        text-slate-600
                        hover:border-slate-400
                        hover:bg-slate-700
                        hover:text-slate-900
                      `
                  }
                `}
              >
                {t(child.name)}
              </NavLink>
            ))}
          </div>
        )}
    </div>
  );
};

export default SidebarContent;
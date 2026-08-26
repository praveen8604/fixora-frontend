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
import {
  FaArrowCircleLeft,
} from "react-icons/fa";
import {
  IoIosArrowDown,
} from "react-icons/io";
import {
  IoLogOutOutline,
} from "react-icons/io5";
import {
  LuSparkles,
} from "react-icons/lu";

import sidebar from "@/routes/sidebar";
import logo from "@/assets/img/logo/logo.png";
import logo_short from "@/assets/img/logo/logohead.png";

import { SidebarContext } from "@/context/SidebarContext";
import { AdminContext } from "@/context/AdminContext";

import SidebarSubMenu from "@/components/sidebar/SidebarSubMenu";
import AlertDialog from "@/components/common/AlterDialogBox";

const SidebarContent = () => {
  const { dimentions, dispatch } =
    useContext(AdminContext);

  const {
    isSidebarOpen,
    toggleSidebar,
    openSidebar,
  } = useContext(SidebarContext);

  const { t } = useTranslation();
  const { pathname } = useLocation();

  const [openMenu, setOpenMenu] = useState(null);
  const [panelPos, setPanelPos] = useState(0);

  const itemRefs = useRef({});
  const panelRef = useRef(null);

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  const handleLogOut = () => {
    dispatch({
      type: "USER_LOGOUT",
    });

    Cookies.remove("adminInfo");
    Cookies.remove("token");

    window.location.replace("/login");
  };

  /*
   * =========================================================
   * HANDLE SUBMENU
   * =========================================================
   */

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
      setPanelPos(
        element.getBoundingClientRect().top
      );
    }

    setOpenMenu(route.name);
  };

  /*
   * =========================================================
   * CLOSE FLOATING SUBMENU WHEN CLICKING OUTSIDE
   * =========================================================
   */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * =========================================================
   * CLOSE FLOATING MENU WHEN SIDEBAR OPENS
   * =========================================================
   */

  useEffect(() => {
    if (isSidebarOpen) {
      setOpenMenu(null);
    }
  }, [isSidebarOpen]);

  /*
   * =========================================================
   * ACTIVE FLOATING PANEL
   * =========================================================
   */

  const activePanel = sidebar.find(
    (route) => route.name === openMenu
  );

  /*
   * =========================================================
   * ACTIVE ROUTE CHECK
   * =========================================================
   */

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

  return (
    <div
      className="
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        bg-[#0f172a]
        text-slate-300
      "
    >
      {/* =====================================================
          BACKGROUND EFFECTS
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Indigo glow */}

        <div
          className="
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-indigo-600/10
            blur-3xl
          "
        />

        {/* Violet glow */}

        <div
          className="
            absolute
            -bottom-28
            -left-24
            h-64
            w-64
            rounded-full
            bg-violet-600/[0.08]
            blur-3xl
          "
        />

        {/* Cyan glow */}

        <div
          className="
            absolute
            bottom-[25%]
            -right-24
            h-52
            w-52
            rounded-full
            bg-cyan-500/[0.05]
            blur-3xl
          "
        />

        {/* Subtle grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* =====================================================
          LOGO HEADER
      ====================================================== */}

      <div
        className="
          relative
          z-20
          shrink-0
          px-3
          pt-4
        "
      >
        <div
          className={`
            relative
            flex
            h-[72px]
            w-full
            items-center
            rounded-2xl
            border
            border-white/[0.08]
            bg-white/[0.035]
            shadow-[0_10px_30px_rgba(0,0,0,0.12)]
            backdrop-blur-xl
            transition-all
            duration-300

            ${
              isSidebarOpen
                ? "px-2 pr-7"
                : "justify-center px-2"
            }
          `}
        >
          {/* Decorative top line */}

          <div
            className="
              absolute
              left-4
              top-0
              h-[2px]
              w-12
              rounded-full
              bg-gradient-to-r
              from-indigo-400
              via-violet-400
              to-cyan-300
            "
          />

          {/* =================================================
              LOGO
          ================================================== */}

          <a
            href="/dashboard"
            onMouseOver={openSidebar}
            className={`
              relative
              flex
              min-w-0
              items-center
              overflow-visible
              no-underline

              ${
                isSidebarOpen
                  ? "w-full"
                  : "justify-center"
              }
            `}
          >
            {isSidebarOpen ? (
              /* Expanded Logo */
              <div
                className="
                  flex
                  h-[54px]
                  w-full
                  items-center
                  justify-start
                  rounded-xl
                  bg-white
                  px-3
                  shadow-[0_5px_18px_rgba(0,0,0,0.12)]
                "
              >
                <img
                  src={logo}
                  alt="Fix Mantra"
                  className="
                    block
                    h-[43px]
                    w-auto
                    max-w-[205px]
                    object-contain
                    object-left
                  "
                />
              </div>
            ) : (
              /* Collapsed Logo */
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  shadow-[0_5px_18px_rgba(0,0,0,0.15)]
                "
              >
                <img
                  src={logo_short}
                  alt="Fix Mantra"
                  className="
                    block
                    h-8
                    w-8
                    object-contain
                  "
                />
              </div>
            )}
          </a>

          {/* =================================================
              COLLAPSE BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className={`
              absolute
              -right-[11px]
              top-[23px]
              z-30
              flex
              h-[26px]
              w-[26px]
              items-center
              justify-center
              rounded-full
              border
              border-slate-700
              bg-[#172033]
              text-indigo-300
              shadow-[0_4px_15px_rgba(0,0,0,0.3)]
              transition-all
              duration-300
              hover:scale-110
              hover:border-indigo-400/40
              hover:bg-indigo-600
              hover:text-white

              ${
                isSidebarOpen
                  ? "rotate-0"
                  : "rotate-180"
              }
            `}
            style={{
              ...(dimentions?.width <= 1024 &&
              !isSidebarOpen
                ? {
                    left: "20px",
                    right: "auto",
                  }
                : {}),
            }}
          >
            <FaArrowCircleLeft size={14} />
          </button>
        </div>

        {/* =================================================
            WORKSPACE LABEL
        ================================================== */}

        {isSidebarOpen && (
          <div
            className="
              mt-5
              flex
              items-center
              gap-2
              px-2
            "
          >
            <LuSparkles
              size={11}
              className="text-cyan-400"
            />

            <span
              className="
                text-[8px]
                font-extrabold
                uppercase
                tracking-[0.22em]
                text-slate-500
              "
            >
              Workspace
            </span>

            <div
              className="
                h-px
                flex-1
                bg-white/[0.06]
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
          relative
          z-10
          mt-3
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-2
          pb-24

          [&::-webkit-scrollbar]:w-[3px]
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-slate-700/50
        "
      >
        <ul className="space-y-1">
          {sidebar.map((route) => {
            const isActive = isRouteActive(route);

            return (
              <li
                className="relative"
                key={route?.name}
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
                    min-h-[52px]
                    w-full
                    items-center
                    justify-between
                    overflow-hidden
                    rounded-[14px]
                    border
                    px-3
                    no-underline
                    transition-all
                    duration-300
                    ease-out

                    ${
                      isActive
                        ? `
                          border-indigo-400/10
                          bg-gradient-to-r
                          from-indigo-600
                          via-indigo-600
                          to-violet-600
                          text-white
                          shadow-[0_8px_24px_rgba(79,70,229,0.22)]
                        `
                        : `
                          border-transparent
                          bg-transparent
                          text-slate-400
                          hover:translate-x-[3px]
                          hover:border-indigo-400/[0.08]
                          hover:bg-indigo-500/[0.08]
                          hover:text-white
                        `
                    }

                    ${
                      isSidebarOpen
                        ? "justify-between"
                        : "justify-center"
                    }
                  `}
                >
                  {/* Hover shine */}

                  {!isActive && (
                    <span
                      className="
                        pointer-events-none
                        absolute
                        inset-y-0
                        left-[-100%]
                        w-[70%]
                        rotate-12
                        bg-gradient-to-r
                        from-transparent
                        via-white/[0.05]
                        to-transparent
                        transition-all
                        duration-700
                        group-hover:left-[130%]
                      "
                    />
                  )}

                  {/* Active indicator */}

                  {isActive && (
                    <span
                      className="
                        absolute
                        left-0
                        top-1/2
                        h-7
                        w-[3px]
                        -translate-y-1/2
                        rounded-r-full
                        bg-cyan-300
                        shadow-[0_0_12px_rgba(103,232,249,0.8)]
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

                      ${
                        isSidebarOpen
                          ? ""
                          : "justify-center"
                      }
                    `}
                  >
                    {/* Icon */}

                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? `
                              bg-white/15
                              text-white
                              shadow-inner
                            `
                            : `
                              bg-white/[0.025]
                              text-slate-500
                              group-hover:scale-110
                              group-hover:bg-indigo-500/15
                              group-hover:text-cyan-300
                            `
                        }
                      `}
                    >
                      {route?.icon && (
                        <route.icon
                          className="
                            h-[17px]
                            w-[17px]
                            shrink-0
                          "
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
                          text-xs
                          font-bold
                          tracking-[-0.01em]
                          transition-all
                          duration-300

                          ${
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-white"
                          }
                        `}
                      >
                        {t(`${route?.name}`)}
                      </div>
                    )}
                  </div>

                  {/* Submenu Arrow */}

                  {route?.subMenu?.length > 0 &&
                    isSidebarOpen && (
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
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border-0
                          bg-transparent
                          transition-all
                          duration-300

                          ${
                            openMenu === route.name ||
                            isActive
                              ? "-rotate-180"
                              : ""
                          }

                          ${
                            isActive
                              ? "bg-white/10 text-white"
                              : "text-slate-600 group-hover:bg-indigo-500/10 group-hover:text-cyan-300"
                          }
                        `}
                        aria-label={`Toggle ${route.name} submenu`}
                      >
                        <IoIosArrowDown size={13} />
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
                      border-white/10
                      bg-[#172033]
                      px-3
                      py-2
                      text-[10px]
                      font-bold
                      text-white
                      opacity-0
                      shadow-[0_10px_30px_rgba(0,0,0,0.25)]
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
                        bg-[#172033]
                      "
                    />
                  </div>
                )}

                {/* =================================================
                    EXPANDED SUBMENU
                ================================================== */}

                {route?.subMenu?.length > 0 &&
                  isSidebarOpen && (
                    <SidebarSubMenu
                      route={route?.subMenu}
                      parentLink={
                        route?.path?.split("/")[1]
                      }
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
          border-white/[0.06]
          bg-[#0f172a]/95
          px-3
          py-3
          backdrop-blur-xl

          ${
            isSidebarOpen
              ? "px-3"
              : "flex justify-center"
          }
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
              className="
                !m-0
                !min-h-[48px]
                !w-full
                !min-w-0
                !overflow-hidden
                !rounded-[14px]
                !border
                !border-red-400/[0.08]
                !bg-red-500/[0.05]
                !px-3
                !normal-case
                !text-slate-400
                !shadow-none
                transition-all
                duration-300
                hover:!translate-x-[2px]
                hover:!border-red-400/20
                hover:!bg-red-500/10
                hover:!text-red-300
              "
            >
              <span
                className={`
                  flex
                  w-full
                  items-center

                  ${
                    isSidebarOpen
                      ? "gap-3"
                      : "justify-center"
                  }
                `}
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-500/[0.08]
                    text-red-400
                  "
                >
                  <IoLogOutOutline className="text-lg" />
                </span>

                {isSidebarOpen && (
                  <span className="text-xs font-bold text-nowrap">
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
              min-w-[180px]
              rounded-[12px]
              border
              border-[#E8EBEF]
              bg-white
              py-2
              shadow-[0_8px_32px_rgba(30,40,55,0.14)]
            "
            style={{
              top: panelPos,
            }}
          >
            <p
              className="
                px-4
                py-1.5
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-[#8C94A0]
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
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  no-underline
                  transition-colors
                  duration-150

                  ${
                    pathname === child.path
                      ? "bg-[#F1F2F4] font-semibold text-[#20242B]"
                      : "text-[#68717F] hover:bg-[#F1F2F4] hover:text-[#282D35]"
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
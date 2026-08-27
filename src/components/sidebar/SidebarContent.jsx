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

import logo from "@/assets/img/logo/logo.png";
import logo_short from "@/assets/img/logo/logohead.png";

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

  const [openMenu, setOpenMenu] = useState(null);
  const [panelPos, setPanelPos] = useState(0);

  const itemRefs = useRef({});
  const panelRef = useRef(null);

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

  // =========================================================
  // CLOSE FLOATING MENU WHEN SIDEBAR OPENS
  // =========================================================

  useEffect(() => {
    if (isSidebarOpen) {
      setOpenMenu(null);
    }
  }, [isSidebarOpen]);

  // =========================================================
  // ACTIVE FLOATING PANEL
  // =========================================================

  const activePanel = sidebar.find(
    (route) => route.name === openMenu
  );

  // =========================================================
  // ACTIVE ROUTE
  // =========================================================

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
        bg-[#FFFBE9]
        text-[#59483D]
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
            rounded-xl
            border
            border-[#E3CAA5]
            bg-white
            shadow-[0_3px_12px_rgba(173,139,115,0.08)]
            transition-all
            duration-300

            ${
              isSidebarOpen
                ? "px-2 pr-7"
                : "justify-center px-2"
            }
          `}
        >
          {/* Logo */}

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
              <div
                className="
                  flex
                  h-[54px]
                  w-full
                  items-center
                  justify-start
                  rounded-lg
                  bg-white
                  px-3
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
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-white
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

          {/* Collapse Button */}

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
              border-[#CEAB93]
              bg-[#AD8B73]
              text-white
              shadow-[0_3px_10px_rgba(173,139,115,0.20)]
              transition-all
              duration-200
              hover:bg-[#8F705B]
              hover:shadow-[0_4px_12px_rgba(173,139,115,0.25)]

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

        {/* Workspace Label */}

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
            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-[#AD8B73]
              "
            >
              Workspace
            </span>

            <div
              className="
                h-px
                flex-1
                bg-[#E3CAA5]
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
                    min-h-[50px]
                    w-full
                    items-center
                    justify-between
                    overflow-hidden
                    rounded-xl
                    border
                    px-3
                    no-underline
                    transition-all
                    duration-200

                    ${
  isActive
    ? `
      border-[#CEAB93]
      bg-[#604637]
      text-[#FFFBE9]
      shadow-[0_4px_12px_rgba(89,72,61,0.16)]
    `
    : `
      border-transparent
      bg-transparent
      text-[#75665C]
      hover:border-[#E3CAA5]
      hover:bg-[#E3CAA5]/20
      hover:text-[#59483D]
    `
}

                    ${
                      isSidebarOpen
                        ? "justify-between"
                        : "justify-center"
                    }
                  `}
                >
                  {/* Active Indicator */}

                  {isActive && (
                    <span
                      className="
                        absolute
                        left-0
                        top-1/2
                        h-6
                        w-[3px]
                        -translate-y-1/2
                        rounded-r-full
                        bg-[#FFFBE9]
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
                        rounded-lg
                        transition-all
                        duration-200

                        ${
                          isActive
                            ? `
                              bg-white/15
                              text-white
                            `
                            : `
                              bg-[#E3CAA5]/20
                              text-[#AD8B73]
                              group-hover:bg-[#CEAB93]/25
                              group-hover:text-[#8F705B]
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

                          ${
                            isActive
                              ? "text-white"
                              : "text-[#67584E] group-hover:text-[#4F4037]"
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
                          duration-200

                          ${
                            openMenu === route.name ||
                            isActive
                              ? "-rotate-180"
                              : ""
                          }

                          ${
                            isActive
                              ? "text-white"
                              : "text-[#AD8B73] hover:bg-[#E3CAA5]/30 hover:text-[#8F705B]"
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
                      border-[#E3CAA5]
                      bg-white
                      px-3
                      py-2
                      text-[10px]
                      font-bold
                      text-[#59483D]
                      opacity-0
                      shadow-[0_8px_20px_rgba(89,72,61,0.12)]
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
                        border-[#E3CAA5]
                        bg-white
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
          border-[#E3CAA5]
          bg-[#FFFBE9]
          px-3
          py-3

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
                !rounded-xl
                !border
                !border-[#E3CAA5]
                !bg-white
                !px-3
                !normal-case
                !text-[#75665C]
                !shadow-none
                transition-all
                duration-200
                hover:!border-[#CEAB93]
                hover:!bg-[#E3CAA5]/20
                hover:!text-[#8F705B]
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
                    rounded-lg
                    bg-[#E3CAA5]/30
                    text-[#AD8B73]
                  "
                >
                  <IoLogOutOutline className="text-lg" />
                </span>

                {isSidebarOpen && (
                  <span
                    className="
                      text-xs
                      font-bold
                      text-nowrap
                      text-[#67584E]
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
              border-[#E3CAA5]
              bg-white
              py-2
              shadow-[0_10px_30px_rgba(89,72,61,0.14)]
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
                text-[#AD8B73]
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

                  ${
                    pathname === child.path
                      ? `
                        border-[#AD8B73]
                        bg-[#FFFBE9]
                        font-semibold
                        text-[#8F705B]
                      `
                      : `
                        border-transparent
                        text-[#75665C]
                        hover:border-[#CEAB93]
                        hover:bg-[#FFFBE9]
                        hover:text-[#59483D]
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
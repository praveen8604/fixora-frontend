import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { IoLogOutOutline } from "react-icons/io5";
import { Button } from "@windmill/react-ui";
import sidebar from "@/routes/sidebar";
import logo_short from "@/assets/img/logo/logohead.png";
import { AdminContext } from "@/context/AdminContext";
import AlertDialog from "@/components/common/AlterDialogBox";

const SidebarContent = () => {
  const { dispatch } = useContext(AdminContext);
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [panelPos, setPanelPos] = useState(0);
  const itemRefs = useRef({});
  const panelRef = useRef(null);

  const handleLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("adminInfo");
    Cookies.remove("token");
    window.location.replace("/login");
  };

  const handleIconClick = (route) => {
    if (!route.subMenu?.length) {
      setOpenMenu(null);
      return;
    }
    if (openMenu === route.name) {
      setOpenMenu(null);
      return;
    }
    const el = itemRefs.current[route.name];
    if (el) setPanelPos(el.getBoundingClientRect().top);
    setOpenMenu(route.name);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activePanel = sidebar.find((r) => r.name === openMenu);

  return (
    <div className="flex flex-col items-center py-4 h-full text-gray-500">
      {/* LOGO */}
      <a href="/dashboard" className="mb-6 mt-1">
        <img src={logo_short} alt="fixmate" style={{ height: "32px" }} />
      </a>

      {/* NAV ICONS */}
      <ul className="flex flex-col items-center gap-1 w-full px-2 flex-1">
        {sidebar.map((route) => {
          const isActive =
            route?.path === pathname ||
            route?.path?.split("/")[1] === pathname?.split("/")[1];

          return (
            <li key={route.name} className="relative w-full group">
              {route.subMenu?.length ? (
                <button
                  ref={(el) => (itemRefs.current[route.name] = el)}
                  onClick={() => handleIconClick(route)}
                  className={`
                    relative flex h-[46px] w-full items-center justify-center rounded-[10px]
                    transition-all duration-200 focus:outline-none
                    ${isActive || openMenu === route.name
                      ? "bg-[#20242B] text-white shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
                      : "text-[#68717F] hover:bg-[#F1F2F4] hover:text-[#282D35]"}
                  `}
                >
                  <route.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {/* TOOLTIP */}
                  <span className="pointer-events-none absolute left-[58px] z-[200] whitespace-nowrap rounded-md bg-[#20242B] px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                    {t(route.name)}
                  </span>
                </button>
              ) : (
                <NavLink
                  exact
                  to={route.path}
                  ref={(el) => (itemRefs.current[route.name] = el)}
                  onClick={() => setOpenMenu(null)}
                  className={`
                    relative flex h-[46px] w-full items-center justify-center rounded-[10px]
                    transition-all duration-200 no-underline
                    ${isActive
                      ? "bg-[#20242B] text-white shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
                      : "text-[#68717F] hover:bg-[#F1F2F4] hover:text-[#282D35]"}
                  `}
                >
                  <route.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {/* TOOLTIP */}
                  <span className="pointer-events-none absolute left-[58px] z-[200] whitespace-nowrap rounded-md bg-[#20242B] px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                    {t(route.name)}
                  </span>
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>

      {/* LOGOUT */}
      <div className="mb-2 w-full px-2">
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
              className="logout-btn w-full flex items-center justify-center"
            >
              <IoLogOutOutline className="text-lg" />
            </Button>
          )}
        />
      </div>

      {/* FLOATING SUBMENU PANEL */}
      {openMenu && activePanel?.subMenu?.length > 0 && (
        <div
          ref={panelRef}
          className="fixed z-[300] left-[78px] bg-white rounded-[12px] shadow-[0_8px_32px_rgba(30,40,55,0.14)] border border-[#E8EBEF] py-2 min-w-[180px]"
          style={{ top: panelPos }}
        >
          <p className="px-4 py-1.5 text-xs font-bold text-[#8C94A0] uppercase tracking-wider">
            {t(activePanel.name)}
          </p>
          {activePanel.subMenu.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              onClick={() => setOpenMenu(null)}
              className={`
                block px-4 py-2.5 text-sm font-medium no-underline transition-colors duration-150
                ${pathname === child.path
                  ? "text-[#20242B] bg-[#F1F2F4] font-semibold"
                  : "text-[#68717F] hover:bg-[#F1F2F4] hover:text-[#282D35]"}
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

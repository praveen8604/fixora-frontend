import React, { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import sidebar from "@/routes/sidebar";
import logo_short from "@/assets/img/logo/logohead.png";
import { SidebarContext } from "@/context/SidebarContext";
import SidebarProfile from "@/components/sidebar/SidebarProfile";

const SidebarContent = () => {
  const { t } = useTranslation();
  const { closeSidebar } = useContext(SidebarContext);
  const { pathname } = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const isRouteActive = (route) =>
    route?.path === pathname ||
    route?.path?.split("/")[1] === pathname?.split("/")[1];

  return (
    <div className="relative h-full py-4 text-gray-500">
      <a href="/dashboard" className="flex items-center justify-center px-2">
        <img
          src={logo_short}
          alt="fixmate"
          className="h-10 w-10 object-contain"
        />
      </a>

      <ul className="mt-8 flex flex-col items-center gap-1 px-2">
        {sidebar.map((route) => {
          const isActive = isRouteActive(route);
          const options =
            route?.subMenu?.length > 0
              ? route.subMenu
              : [{ path: route.path, name: route.name }];
          const isHovered = hoveredItem === route.name;

          return (
            <li
              key={route.name}
              className="relative"
              onMouseEnter={() => setHoveredItem(route.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <NavLink
                exact
                to={route.path}
                className={`flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-150 ${
                  isActive
                    ? "text-[var(--primary-elite-color)] bg-[#2b318c14]"
                    : "text-[#6B7280] hover:text-[var(--primary-elite-color)] hover:bg-[#F4F7FE]"
                }`}
                rel="noreferrer"
              >
                <route.icon className="w-5 h-5" aria-hidden="true" />
              </NavLink>

              {isHovered && (
                <div className="absolute left-full top-0 z-[80] pl-3">
                  <div className="min-w-[220px] rounded-xl border border-[#E2E8F0] bg-white py-2 shadow-[0_12px_32px_rgba(33,30,39,0.12)]">
                    <p className="px-3 pb-2 text-[11px] font-medium tracking-[0.14em] uppercase text-[#A3AED0]">
                      {t(route.name)}
                    </p>
                    {options.map((child) => {
                      const childActive = pathname === child.path;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => {
                            setHoveredItem(null);
                            closeSidebar();
                          }}
                          className={`block px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
                            childActive
                              ? "bg-[#F4F7FE] text-[var(--primary-elite-color)]"
                              : "text-[#211e27] hover:bg-[#F4F7FE] hover:text-[var(--primary-elite-color)]"
                          }`}
                        >
                          {t(child.name)}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <SidebarProfile />
    </div>
  );
};

export default SidebarContent;

import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SidebarContext } from "@/context/SidebarContext";

const SidebarSubMenu = ({
  route,
  parentLink,
  currentParentPath,
  pathname,
}) => {
  const { isSidebarOpen, openSidebar } =
    useContext(SidebarContext);

  const { t } = useTranslation();

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="relative ml-3 mt-1 pl-3">
      {/* SUB MENU CONNECTOR */}
      <div
        className="
          absolute
          left-0
          top-2
          bottom-2
          w-[1px]
          rounded-full
          bg-secondary/60
        "
      />

      <ul className="space-y-1">
        {route?.map((subRoute) => {
          const subPath = subRoute?.path || "";

          const fullPath = subPath.startsWith("/")
            ? subPath
            : `/${subPath}`;

          const isActive =
            pathname === fullPath ||
            pathname?.startsWith(`${fullPath}/`);

          return (
            <li
              key={
                subRoute?.name ||
                subRoute?.path
              }
            >
              <NavLink
                exact
                to={fullPath}
                onMouseOver={openSidebar}
                className={`
                  group
                  relative
                  flex
                  min-h-[42px]
                  w-full
                  items-center
                  rounded-xl
                  border
                  px-3
                  py-2
                  pl-3
                  no-underline
                  transition-all
                  duration-200
                  ease-out

                  ${
                    isActive
                      ? `
                        border-accent
                        bg-accent
                        text-primary
                        shadow-[0_4px_12px_rgba(176,212,203,0.12)]
                      `
                      : `
                        border-transparent
                        bg-transparent
                        text-accent
                        hover:border-secondary
                        hover:bg-secondary
                        hover:text-white
                      `
                  }
                `}
              >
                {/* ACTIVE SIDE INDICATOR */}
                <span
                  className={`
                    absolute
                    left-0
                    top-1/2
                    h-0
                    w-[3px]
                    -translate-y-1/2
                    rounded-r-full
                    bg-accent
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "h-6"
                        : "group-hover:h-5"
                    }
                  `}
                />

                {/* ICON */}
                {subRoute?.icon && (
                  <div
                    className={`
                      relative
                      z-10
                      mr-3
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? `
                            border-primary/20
                            bg-primary/10
                            text-primary
                          `
                          : `
                            border-transparent
                            bg-secondary/40
                            text-accent
                            group-hover:translate-x-0.5
                            group-hover:border-accent/40
                            group-hover:bg-accent/20
                            group-hover:text-white
                          `
                      }
                    `}
                  >
                    <subRoute.icon
                      className="
                        h-[14px]
                        w-[14px]
                        transition-transform
                        duration-200
                        group-hover:scale-105
                      "
                      aria-hidden="true"
                    />
                  </div>
                )}

                {/* TEXT */}
                <span
                  className={`
                    relative
                    z-10
                    overflow-hidden
                    text-nowrap
                    text-[11px]
                    leading-5
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          font-semibold
                          text-primary
                        `
                        : `
                          font-medium
                          text-accent
                          group-hover:font-semibold
                          group-hover:text-white
                        `
                    }
                  `}
                >
                  {t(`${subRoute?.name}`)}
                </span>

                {/* ACTIVE ARROW */}
                <span
                  className={`
                    ml-auto
                    text-[12px]
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          translate-x-0
                          opacity-100
                          text-primary
                        `
                        : `
                          -translate-x-1
                          opacity-0
                          group-hover:translate-x-0
                          group-hover:opacity-100
                          group-hover:text-accent
                        `
                    }
                  `}
                >
                  ›
                </span>
              </NavLink>

              {/* NESTED SUBMENU */}
              {subRoute?.subMenu?.length > 0 && (
                <SidebarSubMenu
                  route={subRoute.subMenu}
                  parentLink={parentLink}
                  currentParentPath={currentParentPath}
                  pathname={pathname}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarSubMenu;
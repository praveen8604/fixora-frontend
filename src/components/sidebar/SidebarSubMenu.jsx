// import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const SidebarSubMenu = ({ route, parentLink, currentParentPath, pathname }) => {
//   const { t } = useTranslation();
//   const [open, setOpen] = useState(false);
//   useEffect(() => {
//     if (route?.length > 0 && parentLink === currentParentPath) {
//       setOpen(true);
//     } else {
//       setOpen(false);
//     }
//   }, [route, parentLink, currentParentPath]);
//   return (
//     <div
//       className={`overflow-hidden`}
//       style={{
//         height: open ? route?.length * 55 : 0,
//         transition: "height 0.3s ease-in-out",
//       }}
//     >
//       {route.map((child, i) => {
        
//         return (
//           <li key={i + 1} className="flex bg-[#2b318c1a]">
//             <div
//               className={`${
//                 route?.length - 1 === i ? "h-[26.5px] rounded-bl-xl" : "h-[55px]"
//               } border-l-[2px] border-[#adaeb5] w-[20px] relative left-[30px]`}
//             >
//               <div className="h-[27.5px] border-b-[2px] border-[#adaeb5] rounded-bl-xl w-[26px] relative left-[0px]"></div>
//             </div>
//             <NavLink
//               to={child?.path}
//               className={`flex items-center font-serif overflow-hidden max-w-[256px] font-semibold text-sm h-[55px] ${
//                 pathname === child.path ? "text-[var(--primary-elite-color)]" : "text-gray-500"
//               } hover:text-[var(--primary-elite-color)] cursor-pointer`}
//               activeStyle={{
//                 color: "var(--primary-elite-color)",
//               }}
//               rel="noreferrer"
//             >
//               <span className="text-nowrap overflow-hidden w-[196px] relative left-[60px] hover:text-[var(--primary-elite-color)]">
//                 {t(`${child?.name}`)}
//               </span>
//             </NavLink>
//           </li>
//         );
//       })}
//     </div>
//   );
// };

// export default SidebarSubMenu;


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
          bg-[#E3CAA5]
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
                        border-[#CEAB93]
                        bg-[#604637]
                        text-[#FFFBE9]
                        shadow-[0_4px_12px_rgba(89,72,61,0.16)]
                      `
                      : `
                        border-transparent
                        bg-transparent
                        text-[#806B5D]
                        hover:border-[#E3CAA5]
                        hover:bg-[#FFFBE9]
                        hover:text-[#5F4637]
                        hover:shadow-[0_3px_10px_rgba(173,139,115,0.08)]
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
                    bg-[#CEAB93]
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
                            border-[#CEAB93]
                            bg-[#AD8B73]
                            text-[#FFFBE9]
                          `
                          : `
                            border-transparent
                            bg-[#E3CAA5]/20
                            text-[#9A806D]
                            group-hover:translate-x-0.5
                            group-hover:border-[#E3CAA5]
                            group-hover:bg-[#CEAB93]/25
                            group-hover:text-[#AD8B73]
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
                          text-[#FFFBE9]
                        `
                        : `
                          font-medium
                          text-[#806B5D]
                          group-hover:font-semibold
                          group-hover:text-[#5F4637]
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
                          text-[#CEAB93]
                        `
                        : `
                          -translate-x-1
                          opacity-0
                          group-hover:translate-x-0
                          group-hover:opacity-100
                          group-hover:text-[#CEAB93]
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
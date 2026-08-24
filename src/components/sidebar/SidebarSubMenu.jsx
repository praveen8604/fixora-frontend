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
    <div
      className="
        relative
        ml-3
        mt-1
        overflow-hidden
        border-l
        border-white/[0.07]
        pl-2
      "
    >
      {/* Vertical active glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-[-1px]
          top-1
          h-[calc(100%-8px)]
          w-px
          bg-gradient-to-b
          from-indigo-400/20
          via-cyan-400/10
          to-transparent
        "
      />

      <ul className="space-y-1">

        {route?.map((subRoute) => {

          const subPath =
            subRoute?.path || "";

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
                  min-h-[43px]
                  w-full
                  items-center
                  overflow-hidden
                  rounded-xl
                  px-3
                  py-2
                  pl-4
                  no-underline
                  transition-all
                  duration-300
                  ease-out

                  ${
                    isActive
                      ? `
                        translate-x-[2px]
                        border
                        border-cyan-400/[0.08]
                        bg-cyan-400/[0.08]
                        text-cyan-300
                        shadow-[inset_3px_0_0_#67e8f9]
                      `
                      : `
                        border
                        border-transparent
                        text-slate-400
                        hover:translate-x-[3px]
                        hover:border-white/[0.05]
                        hover:bg-white/[0.05]
                        hover:text-white
                      `
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
                      w-[60%]
                      rotate-12
                      bg-gradient-to-r
                      from-transparent
                      via-white/[0.06]
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
                      h-5
                      w-[3px]
                      -translate-y-1/2
                      rounded-r-full
                      bg-cyan-300
                      shadow-[0_0_10px_rgba(103,232,249,0.8)]
                    "
                  />
                )}

                {/* Icon */}

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
                      transition-all
                      duration-300

                      ${
                        isActive
                          ? `
                            bg-cyan-400/[0.10]
                            text-cyan-300
                          `
                          : `
                            bg-white/[0.025]
                            text-slate-500
                            group-hover:scale-110
                            group-hover:bg-indigo-400/[0.10]
                            group-hover:text-cyan-300
                          `
                      }
                    `}
                  >
                    <subRoute.icon
                      className="h-[14px] w-[14px]"
                      aria-hidden="true"
                    />
                  </div>
                )}

                {/* Text */}

                <span
                  className={`
                    relative
                    z-10
                    overflow-hidden
                    text-nowrap
                    text-[11px]
                    font-medium
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? "font-semibold text-cyan-300"
                        : "text-slate-400 group-hover:text-white"
                    }
                  `}
                >
                  {t(`${subRoute?.name}`)}
                </span>

                {/* Active dot */}

                {isActive && (
                  <span
                    className="
                      absolute
                      right-3
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-cyan-300
                      shadow-[0_0_8px_rgba(103,232,249,0.8)]
                    "
                  />
                )}

              </NavLink>

              {/* Nested submenu */}

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
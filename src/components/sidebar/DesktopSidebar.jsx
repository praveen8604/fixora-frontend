// import React, { useContext } from "react";
// import SidebarContent from "@/components/sidebar/SidebarContent";
// import { AdminContext } from "@/context/AdminContext";
// import { SidebarContext } from "@/context/SidebarContext";

// const DesktopSidebar = () => {
//   const { dimentions } = useContext(AdminContext);
//   const { isSidebarOpen } = useContext(SidebarContext);

//   const sidebarWidth = isSidebarOpen ? "256px" : "70px";

//   return (
//     <aside
//       className="
//         fixed
//         left-0
//         top-0
//         z-[50]
//         flex-shrink-0
//         overflow-hidden
//         border-r
//         border-[#E3CAA5]
//         bg-[#FFFBE9]
//         shadow-[4px_0_20px_rgba(89,72,61,0.08)]
//       "
//       style={{
//         width: sidebarWidth,
//         height: dimentions?.height,

//         transition:
//           "width 0.35s cubic-bezier(0.4, 0, 0.2, 1), left 0.35s ease-in-out",

//         ...(dimentions?.width <= 1024 &&
//         !isSidebarOpen
//           ? {
//               left: "-70px",
//             }
//           : {}),
//       }}
//     >
//       {/* =========================================
//           SIDEBAR CONTENT
//       ========================================== */}

//       <div className="relative z-10 h-full w-full overflow-hidden">
//         <SidebarContent />
//       </div>
//     </aside>
//   );
// };

// export default DesktopSidebar;























import React, { useContext } from "react";
import SidebarContent from "@/components/sidebar/SidebarContent";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";

const DesktopSidebar = () => {
  const { dimentions } = useContext(AdminContext);
  const { isSidebarOpen } = useContext(SidebarContext);

  const sidebarWidth = isSidebarOpen ? "256px" : "70px";

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-[50]
        flex-shrink-0
        overflow-hidden
        border-r
        border-secondary
        bg-primary
        shadow-[4px_0_18px_rgba(10,48,36,0.12)]
      "
      style={{
        width: sidebarWidth,
        height: dimentions?.height,

        transition:
          "width 0.35s cubic-bezier(0.4, 0, 0.2, 1), left 0.35s ease-in-out",

        ...(dimentions?.width <= 1024 && !isSidebarOpen
          ? {
              left: "-70px",
            }
          : {}),
      }}
    >
      {/* =========================================
          SIDEBAR CONTENT
      ========================================== */}

      <div className="relative z-10 h-full w-full overflow-hidden">
        <SidebarContent />
      </div>
    </aside>
  );
};

export default DesktopSidebar;
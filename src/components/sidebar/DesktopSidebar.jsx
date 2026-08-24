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
        bg-white
        shadow-[4px_0_24px_rgba(30,40,55,0.06)]
      "
      style={{
        width: sidebarWidth,
        height: dimentions?.height,
        transition: "width 0.35s ease-in-out, left 0.35s ease-in-out",
        borderRight: "1px solid #E8EBEF",

        ...(dimentions?.width <= 1024 && !isSidebarOpen
          ? {
              left: "-70px",
            }
          : {}),
      }}
    >
      <div className="h-full w-full overflow-hidden">
        <SidebarContent />
      </div>
    </aside>
  );
};

export default DesktopSidebar;

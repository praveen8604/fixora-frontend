import React, { useContext } from "react";
import SidebarContent from "@/components/sidebar/SidebarContent";
import { AdminContext } from "@/context/AdminContext";

const DesktopSidebar = () => {
  const { dimentions } = useContext(AdminContext);

  return (
    <aside
      className="fixed left-0 top-0 z-[50] flex-shrink-0 overflow-visible bg-white shadow-[4px_0_24px_rgba(30,40,55,0.06)]"
      style={{
        width: "70px",
        height: dimentions?.height,
        borderRight: "1px solid #E8EBEF",
      }}
    >
      <div className="h-full w-full overflow-visible">
        <SidebarContent />
      </div>
    </aside>
  );
};

export default DesktopSidebar;

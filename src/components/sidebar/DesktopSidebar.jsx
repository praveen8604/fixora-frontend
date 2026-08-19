import React, { useContext } from "react";
import SidebarContent from "@/components/sidebar/SidebarContent";
import { AdminContext } from "@/context/AdminContext";

const DesktopSidebar = () => {
  const { dimentions } = useContext(AdminContext);
  return (
    <aside
      className="z-50 flex-shrink-0 w-[72px] bg-[var(--primary-color)] lg:block absolute overflow-visible"
      style={{
        height: dimentions?.height,
        borderRight: "1.5px solid #d8d8d8",
      }}
    >
      <SidebarContent />
    </aside>
  );
};

export default DesktopSidebar;

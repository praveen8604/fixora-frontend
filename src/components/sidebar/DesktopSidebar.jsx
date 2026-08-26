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
        bg-[#0f172a]
        border-r
        border-white/10
        shadow-[8px_0_35px_rgba(15,23,42,0.16)]
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
      {/* ================= BACKGROUND GLOW ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Indigo glow */}

        <div
          className="
            absolute
            -right-24
            top-16
            h-64
            w-64
            rounded-full
            bg-indigo-600/10
            blur-3xl
          "
        />

        {/* Cyan glow */}

        <div
          className="
            absolute
            -left-24
            bottom-24
            h-56
            w-56
            rounded-full
            bg-cyan-500/[0.06]
            blur-3xl
          "
        />

        {/* Violet glow */}

        <div
          className="
            absolute
            right-[-80px]
            bottom-[-80px]
            h-48
            w-48
            rounded-full
            bg-violet-600/[0.08]
            blur-3xl
          "
        />

        {/* Subtle grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ================= SIDEBAR CONTENT ================= */}

      <div className="relative z-10 h-full w-full overflow-hidden">
        <SidebarContent />
      </div>
    </aside>
  );
};

export default DesktopSidebar;
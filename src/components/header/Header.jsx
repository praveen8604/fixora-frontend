import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import sidebar from "@/routes/sidebar";

const Header = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const getHeaderTitle = () => {
    const extraTitles = [
      { path: "/services/servicerequests/request", name: "Service Request" },
      { path: "/users/technician/details", name: "Technician Details" },
      { path: "/users/rider/details", name: "Rider Details" },
      { path: "/users/customer/details", name: "Customer Details" },
      { path: "/appliance/overview", name: "Appliance Overview" },
      { path: "/user", name: "User Details" },
    ];

    const extraMatch = extraTitles.find(
      (item) => pathname === item.path || pathname.startsWith(`${item.path}?`)
    );
    if (extraMatch) return extraMatch.name;

    for (const route of sidebar) {
      if (route.subMenu?.length) {
        const child = [...route.subMenu]
          .sort((a, b) => b.path.length - a.path.length)
          .find(
            (item) =>
              pathname === item.path || pathname.startsWith(`${item.path}/`)
          );
        if (child) return child.name;
      }
      if (pathname === route.path || pathname.startsWith(`${route.path}/`)) {
        return route.name;
      }
    }

    return "Dashboard";
  };

  return (
    <header className="z-30 py-3.5 bg-white/90 backdrop-blur-md border-b border-[#E6EAF0]">
      <div className="flex items-center h-full pl-[88px] pr-8">
        <h1 className="text-[15px] font-medium tracking-tight text-[#1B2559]">
          {t(getHeaderTitle())}
        </h1>
      </div>
    </header>
  );
};

export default Header;

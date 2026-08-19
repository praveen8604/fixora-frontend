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
    <header className="z-30 py-4 bg-[var(--primary-color)] backdrop-blur-lg shadow-sm">
      <div className="flex items-center h-full pl-[88px] pr-6">
        <h1 className="text-base font-semibold tracking-tight text-[#211e27]">
          {t(getHeaderTitle())}
        </h1>
      </div>
    </header>
  );
};

export default Header;

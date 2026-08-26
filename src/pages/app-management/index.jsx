import React, { useState } from "react";
import AppManagementHeader from "./layouts/AppManagementHeader";
import ManagementList from "./layouts/ManagementList";
import AnimatedContent from "@/components/common/AnimatedContent";
import { GrSystem } from "react-icons/gr";
import { FaTag, FaRegNewspaper } from "react-icons/fa";

const AppManagement = () => {
  const [isDispatch, setIsDispatch] = useState(false);
  const [filterDragger, setFilterDragger] = useState(false);
  const [currentLink, setCurrentLink] = useState("");
  const [editValue, setEditValue] = useState({});

  const getManagementList = () => {
    setIsDispatch(true);
    setTimeout(() => setIsDispatch(false), 100);
  };

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#F4F7FB] pb-10">
        {/* HERO BANNER */}
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-[30px] bg-[#0B1220] px-6 py-7 shadow-[0_20px_55px_rgba(15,23,42,0.15)] sm:px-8 sm:py-9">
            <div className="pointer-events-none absolute -right-24 -top-28 h-[340px] w-[340px] rounded-full bg-[#2563EB]/20 blur-[2px]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8]/50" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#38BDF8]" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">App Management</span>
                </div>
                <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-[34px]">Offers & Blogs</h1>
                <p className="mt-2 max-w-[520px] text-[13px] leading-6 text-white/50">Create and manage promotional offers and blog content for your app.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 backdrop-blur-xl">
                  <FaTag size={13} className="text-[#60A5FA]" />
                  <span className="text-[12px] font-bold text-white/85">Offers</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 backdrop-blur-xl">
                  <FaRegNewspaper size={13} className="text-emerald-400" />
                  <span className="text-[12px] font-bold text-white/85">Blogs</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#2563EB]/50 to-transparent" />
          </div>
        </section>

        <AppManagementHeader
          setFilterDragger={setFilterDragger}
          getManagementList={getManagementList}
          filterDragger={filterDragger}
          setCurrentLink={setCurrentLink}
          currentLink={currentLink}
          editValue={editValue}
        />
        <ManagementList
          isDispatch={isDispatch}
          setFilterDragger={setFilterDragger}
          currentLink={currentLink}
          setEditValue={setEditValue}
          filterDragger={filterDragger}
        />
      </div>
    </AnimatedContent>
  );
};

export default AppManagement;

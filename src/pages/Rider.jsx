import React, { useContext, useEffect, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import { FaExternalLinkAlt, FaMotorcycle, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { BsBox } from "react-icons/bs";
import { FiArrowUpRight } from "react-icons/fi";
import AnimatedContent from "@/components/common/AnimatedContent";
import { statusTheme } from "@/utils/getStatusTheme";
import Pagination from "@/components/common/Pagination";

const Rider = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const history = useHistory();
  const [riders, setRiders] = useState([]);
  const [id, setId] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);

  const getRiders = (page, lim) => {
    DashboardServices.getRiders(page, lim)
      .then((res) => {
        if (!res) return;
        const d = DecryptData(res);
        setTotalPages(d?.data?.totalPages || 0);
        setRiders(d?.data?.riders || []);
      })
      .catch(console.error);
  };

  useEffect(() => { getRiders(activePage, limit); }, []);

  const eligible    = riders.filter((r) => r?.isPracticingEligible === "eligible").length;
  const pending     = riders.filter((r) => r?.isPracticingEligible === "pending").length;
  const notEligible = riders.filter((r) => r?.isPracticingEligible === "not-eligible").length;

  const metrics = [
    { title: "Total Riders", value: riders.length, desc: "All riders",         tone: "blue",    Icon: FaUsers },
    { title: "Eligible",     value: eligible,       desc: "Approved to work",  tone: "emerald", Icon: FaCheckCircle },
    { title: "Pending",      value: pending,        desc: "Awaiting approval", tone: "amber",   Icon: FaClock },
    { title: "Not Eligible", value: notEligible,    desc: "Not approved",      tone: "rose",    Icon: FaTimesCircle },
  ];

  const toneClasses = {
    blue:    { icon: "bg-blue-500",    soft: "bg-blue-50",    line: "bg-blue-500" },
    emerald: { icon: "bg-emerald-500", soft: "bg-emerald-50", line: "bg-emerald-500" },
    amber:   { icon: "bg-amber-500",   soft: "bg-amber-50",   line: "bg-amber-500" },
    rose:    { icon: "bg-rose-500",    soft: "bg-rose-50",    line: "bg-rose-500" },
  };

  const getEligibilityStyle = (status) => {
    const map = {
      "eligible":     { backgroundColor: "#EAF8F0", color: "#17864B", borderColor: "#CBEBD8" },
      "pending":      { backgroundColor: "#FFF7E5", color: "#A86B00", borderColor: "#F5DEAE" },
      "not-eligible": { backgroundColor: "#FFF0F0", color: "#D14343", borderColor: "#F2CCCC" },
    };
    return map[status] || { backgroundColor: "#F3F5F7", color: "#737B86", borderColor: "#E2E6EB" };
  };

  return (
    <>
      <AnimatedContent>
        <div className="min-h-screen bg-[#F4F6F8] pb-10">

          {/* PAGE HEADER */}
          <div className="mb-7 flex items-end justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--primary-color)] shadow-[0_0_0_5px_rgba(0,0,0,0.04)]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#89919D]">User Management</span>
              </div>
              <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">Riders</h1>
              <p className="mt-2 text-sm leading-6 text-[#7C8592]">Manage and monitor all registered riders</p>
            </div>
            <div className="flex items-center rounded-2xl border border-[#E4E8ED] bg-white px-4 py-3 shadow-[0_3px_12px_rgba(30,40,55,0.04)]">
              <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F2F5]">
                <FaMotorcycle className="text-[17px] text-[#20242B]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA1AC]">Total</p>
                <p className="mt-0.5 text-xs font-bold text-[#414853]">{riders.length} riders</p>
              </div>
            </div>
          </div>

          {/* KPI CARDS */}
          <section className="mb-7">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {metrics.map((item) => {
                const tone = toneClasses[item.tone];
                const Icon = item.Icon;
                return (
                  <div key={item.title} className="group relative min-h-[140px] overflow-hidden rounded-[22px] border border-[#E4E8ED] bg-white p-5 shadow-[0_3px_12px_rgba(30,40,55,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(30,40,55,0.10)]">
                    <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${tone.soft} opacity-80 transition-transform duration-500 group-hover:scale-[1.45]`} />
                    <div className={`pointer-events-none absolute -bottom-14 -left-14 h-24 w-24 rounded-full ${tone.soft} opacity-40`} />
                    <div className="relative z-20 flex items-start justify-between">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${tone.icon} text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-2`}>
                        <Icon size={20} color="#fff" />
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F8FA] text-[#A0A7B1] transition-all duration-300 group-hover:bg-[#20242B] group-hover:text-white">
                        <FiArrowUpRight size={14} />
                      </div>
                    </div>
                    <div className="relative z-20 mt-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8B94A0]">{item.title}</p>
                      <div className="mt-2 flex items-end justify-between gap-2">
                        <h3 className="text-[24px] font-extrabold leading-none tracking-tight text-[#22272F]">{item.value}</h3>
                        <span className="text-right text-[10px] font-medium text-[#A2A9B3]">{item.desc}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-5 right-5 z-20 h-[3px] overflow-hidden rounded-full bg-[#F0F2F5]">
                      <div className={`h-full w-0 ${tone.line} rounded-full transition-all duration-500 group-hover:w-full`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* TABLE */}
          <section>
            <div className="overflow-hidden rounded-[22px] border border-[#E4E8ED] bg-white shadow-[0_3px_12px_rgba(30,40,55,0.035)]">
              <div className="flex items-center justify-between border-b border-[#F0F2F5] px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-[#282D35]">Rider List</h2>
                  <p className="mt-0.5 text-xs text-[#929AA5]">Rider information, status and eligibility</p>
                </div>
                <span className="text-[10px] font-semibold text-[#9AA2AC]">{riders.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[1100px] w-full">
                  <thead>
                    <tr className="bg-[#20242B]">
                      {["Rider", "Mobile No.", "Email", "Role", "Status", "Eligibility", "Action"].map((h) => (
                        <th key={h} className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white ${h === "Action" ? "text-center" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {riders.length > 0 ? riders.map((data, i) => (
                      <tr key={data?._id || i}
                        onClick={() => history.push(`/users/rider/details?userId=${data?._id}`)}
                        className="group cursor-pointer border-b border-[#F0F1F3] transition-all duration-200 hover:bg-[#FAFBFC]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F6F8] text-[#20242B] transition-transform duration-200 group-hover:scale-105">
                              <FaMotorcycle size={17} />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-[170px] truncate text-[12px] font-bold text-[#343B45]">{data?.userName || "--"}</p>
                              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#A0A7B0]">Rider</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4"><span className="whitespace-nowrap text-[11px] font-semibold text-[#59626E]">{data?.phoneNumber || "--"}</span></td>
                        <td className="px-5 py-4"><span className="block max-w-[230px] truncate text-[11px] font-medium text-[#69727E]" title={data?.email}>{data?.email || "--"}</span></td>
                        <td className="px-5 py-4"><span className="inline-flex rounded-full px-3 py-1 text-[9px] font-bold capitalize bg-[#F4F6F8] text-[#20242B]">{data?.role || "--"}</span></td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-bold capitalize" style={statusTheme(data?.userStatus)}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {data?.userStatus === "inactive" ? "Blocked" : data?.userStatus || "--"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center rounded-full border px-3 py-1 text-[9px] font-bold capitalize" style={getEligibilityStyle(data?.isPracticingEligible)}>
                            {data?.isPracticingEligible || "--"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-center">
                            <button type="button" title="Manage Rider"
                              onClick={(e) => { e.stopPropagation(); setId(data?._id); toggleDrawer(); }}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] text-[#20242B] transition-all duration-200 hover:scale-105 hover:bg-[#20242B] hover:text-white">
                              <FaExternalLinkAlt size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={7}>
                        <div className="flex min-h-[280px] flex-col items-center justify-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4F6F8] text-[#A0A7B0]"><BsBox size={28} /></div>
                          <p className="mt-4 text-[13px] font-bold text-[#69727E]">No Riders Found</p>
                        </div>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-[#F0F2F5] px-5 py-3">
                <Pagination totalPages={totalPages} activePage={activePage} limit={limit}
                  setPageValue={(p) => { setActivePage(p); getRiders(p, limit); }}
                  setLimit={(l) => { setLimit(l); setActivePage(1); getRiders(1, l); }} />
              </div>
            </div>
          </section>

        </div>
      </AnimatedContent>

      <MainDrawer windowDimensionHighWidth="400px">
        <StaffDrawer id={id} toggleDrawer={toggleDrawer}
          handleCallBack={() => getRiders(activePage, limit)}
          defaultStatus={riders.find((r) => r?._id === id)?.isPracticingEligible}
        />
      </MainDrawer>
    </>
  );
};

export default Rider;

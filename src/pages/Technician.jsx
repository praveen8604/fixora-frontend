import React, { useContext, useEffect, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import { FaUsers, FaCheckCircle, FaClock, FaTimesCircle, FaUserCog, FaExternalLinkAlt } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { BsBox } from "react-icons/bs";
import AnimatedContent from "@/components/common/AnimatedContent";
import Pagination from "@/components/common/Pagination";

const toneClasses = {
  orange:  { icon: "bg-orange-500",  soft: "bg-orange-50",  line: "bg-orange-500" },
  emerald: { icon: "bg-emerald-500", soft: "bg-emerald-50", line: "bg-emerald-500" },
  amber:   { icon: "bg-amber-500",   soft: "bg-amber-50",   line: "bg-amber-500" },
  rose:    { icon: "bg-rose-500",    soft: "bg-rose-50",    line: "bg-rose-500" },
};

const getEligibilityClass = (status) => {
  const map = {
    "eligible":     "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "pending":      "bg-amber-50 text-amber-700 border border-amber-200",
    "not-eligible": "bg-rose-50 text-rose-700 border border-rose-200",
  };
  return map[status] || "bg-orange-50 text-orange-700 border border-orange-200";
};

const KpiCard = ({ title, value, desc, tone, Icon }) => {
  const t = toneClasses[tone];
  return (
    <div className="group relative min-h-[140px] overflow-hidden rounded-[22px] border border-orange-100 bg-white p-5 shadow-[0_3px_12px_rgba(249,115,22,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(249,115,22,0.13)]">
      <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${t.soft} opacity-80 transition-transform duration-500 group-hover:scale-[1.45]`} />
      <div className={`pointer-events-none absolute -bottom-14 -left-14 h-24 w-24 rounded-full ${t.soft} opacity-40`} />
      <div className="relative z-20 flex items-start justify-between">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${t.icon} text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-2`}>
          <Icon size={20} color="#fff" />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-300 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
          <FiArrowUpRight size={14} />
        </div>
      </div>
      <div className="relative z-20 mt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-orange-400">{title}</p>
        <div className="mt-2 flex items-end justify-between gap-2">
          <h3 className="text-[24px] font-extrabold leading-none tracking-tight text-[#22272F]">{value}</h3>
          <span className="text-right text-[10px] font-medium text-orange-300">{desc}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-5 right-5 z-20 h-[3px] overflow-hidden rounded-full bg-orange-50">
        <div className={`h-full w-0 ${t.line} rounded-full transition-all duration-500 group-hover:w-full`} />
      </div>
    </div>
  );
};

const Technician = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const history = useHistory();
  const [technicians, setTechnicians] = useState([]);
  const [id, setId] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);

  const getTechniciansData = (page, lim) => {
    DashboardServices.getTechnicians(page, lim)
      .then((res) => {
        if (res) {
          const d = DecryptData(res);
          setTechnicians(d?.data?.technicians || []);
          setTotalPages(d?.data?.totalPages || 0);
        }
      })
      .catch(console.error);
  };

  useEffect(() => { getTechniciansData(activePage, limit); }, []);

  const metrics = [
    { title: "Total",        value: technicians.length,                                                           desc: "All technicians",   tone: "orange",  Icon: FaUsers },
    { title: "Eligible",     value: technicians.filter((t) => t?.isPracticingEligible === "eligible").length,     desc: "Approved to work",  tone: "emerald", Icon: FaCheckCircle },
    { title: "Pending",      value: technicians.filter((t) => t?.isPracticingEligible === "pending").length,      desc: "Awaiting approval", tone: "amber",   Icon: FaClock },
    { title: "Not Eligible", value: technicians.filter((t) => t?.isPracticingEligible === "not-eligible").length, desc: "Not approved",      tone: "rose",    Icon: FaTimesCircle },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#FDF8F4] pb-10">

        {/* HEADER */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_0_5px_rgba(249,115,22,0.15)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400">User Management</span>
            </div>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">Technicians</h1>
            <p className="mt-2 text-sm leading-6 text-[#7C8592]">Manage and monitor all repair technicians</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-100 px-3 py-1.5">
            <FaUserCog size={13} className="text-orange-500" />
            <span className="text-[10px] font-bold text-orange-600">{technicians.length} technicians</span>
          </div>
        </div>

        {/* KPI CARDS */}
        <section className="mb-7">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metrics.map((m) => <KpiCard key={m.title} {...m} />)}
          </div>
        </section>

        {/* TABLE */}
        <section>
          <div className="overflow-hidden rounded-[22px] border border-orange-100 bg-white shadow-[0_3px_12px_rgba(249,115,22,0.07)]">
            <div className="flex items-center justify-between border-b border-orange-50 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-[#282D35]">Technician List</h2>
                <p className="mt-0.5 text-xs text-orange-400">Technician information, status and eligibility</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full">
                <thead>
                  <tr style={{ backgroundColor: "#FFF3E8", borderBottom: "1px solid #FED7AA" }}>
                    {["Technician", "Mobile No.", "Email", "Role", "Status", "Eligibility", "Action"].map((h) => (
                      <th key={h} className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-orange-500 ${h === "Action" ? "text-center" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {technicians.length > 0 ? technicians.map((data, i) => (
                    <tr key={data?._id || i}
                      onClick={() => history.push(`/users/technician/details?userId=${data?._id}`)}
                      className="group cursor-pointer border-b border-orange-50 transition-all duration-200 hover:bg-[#FDF8F4]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-500 font-bold text-sm transition-all group-hover:bg-orange-500 group-hover:text-white">
                            {data?.userName?.[0]?.toUpperCase() || "T"}
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-[170px] truncate text-[12px] font-bold text-[#343B45]">{data?.userName || "--"}</p>
                            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-orange-300">Technician</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className="text-[11px] font-semibold text-[#59626E]">{data?.phoneNumber || "--"}</span></td>
                      <td className="px-5 py-4"><span className="block max-w-[220px] truncate text-[11px] font-medium text-[#69727E]" title={data?.email}>{data?.email || "--"}</span></td>
                      <td className="px-5 py-4"><span className="inline-flex rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-[9px] font-bold capitalize text-orange-600">{data?.role || "--"}</span></td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold capitalize ${data?.userStatus === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${data?.userStatus === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {data?.userStatus === "inactive" ? "Blocked" : data?.userStatus || "--"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-bold capitalize ${getEligibilityClass(data?.isPracticingEligible)}`}>
                          {data?.isPracticingEligible || "--"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          <button type="button" onClick={(e) => { e.stopPropagation(); setId(data?._id); toggleDrawer(); }}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-500 transition-all hover:bg-orange-500 hover:text-white focus:outline-none">
                            <FaExternalLinkAlt size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={7}>
                      <div className="flex min-h-[300px] flex-col items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50"><BsBox size={28} className="text-orange-400" /></div>
                        <p className="mt-4 text-sm font-bold text-[#59626E]">No Technicians Found</p>
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-orange-50 px-5 py-3">
              <Pagination totalPages={totalPages} activePage={activePage} limit={limit}
                setPageValue={(p) => { setActivePage(p); getTechniciansData(p, limit); }}
                setLimit={(l) => { setLimit(l); setActivePage(1); getTechniciansData(1, l); }} />
            </div>
          </div>
        </section>

      </div>

      <MainDrawer windowDimensionHighWidth="400px">
        <StaffDrawer
          defaultStatus={technicians.find((t) => t?._id === id)?.isPracticingEligible}
          id={id} toggleDrawer={toggleDrawer}
          handleCallBack={() => getTechniciansData(activePage, limit)}
        />
      </MainDrawer>
    </AnimatedContent>
  );
};

export default Technician;

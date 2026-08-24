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

const tones = {
  slate:   { icon: "bg-slate-600",   soft: "bg-slate-50",   line: "bg-slate-600" },
  emerald: { icon: "bg-emerald-500", soft: "bg-emerald-50", line: "bg-emerald-500" },
  amber:   { icon: "bg-amber-500",   soft: "bg-amber-50",   line: "bg-amber-500" },
  rose:    { icon: "bg-rose-500",    soft: "bg-rose-50",    line: "bg-rose-500" },
};

const getEligibilityClass = (s) => ({
  "eligible":     "bg-emerald-50 text-emerald-600 border-emerald-100",
  "pending":      "bg-amber-50 text-amber-600 border-amber-100",
  "not-eligible": "bg-rose-50 text-rose-600 border-rose-100",
}[s] || "bg-slate-50 text-slate-600 border-slate-100");

const KpiCard = ({ title, value, desc, tone, Icon }) => {
  const t = tones[tone];
  return (
    <div className="group relative min-h-[140px] overflow-hidden rounded-[22px] border border-[#E4E8ED] bg-white p-5 shadow-[0_3px_12px_rgba(30,40,55,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(30,40,55,0.10)]">
      <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${t.soft} opacity-80 transition-transform duration-500 group-hover:scale-[1.45]`} />
      <div className={`pointer-events-none absolute -bottom-14 -left-14 h-24 w-24 rounded-full ${t.soft} opacity-40`} />
      <div className="relative z-20 flex items-start justify-between">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${t.icon} text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-2`}>
          <Icon size={20} color="#fff" />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F8FA] text-[#A0A7B1] transition-all duration-300 group-hover:bg-[#20242B] group-hover:text-white">
          <FiArrowUpRight size={14} />
        </div>
      </div>
      <div className="relative z-20 mt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8B94A0]">{title}</p>
        <div className="mt-2 flex items-end justify-between gap-2">
          <h3 className="text-[24px] font-extrabold leading-none tracking-tight text-[#22272F]">{value}</h3>
          <span className="text-right text-[10px] font-medium text-[#A2A9B3]">{desc}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-5 right-5 z-20 h-[3px] overflow-hidden rounded-full bg-[#F0F2F5]">
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
      .then((res) => { if (res) { const d = DecryptData(res); setTechnicians(d?.data?.technicians || []); setTotalPages(d?.data?.totalPages || 0); } })
      .catch(console.error);
  };

  useEffect(() => { getTechniciansData(activePage, limit); }, []);

  const metrics = [
    { title: "Total",        value: technicians.length,                                                           desc: "All technicians",   tone: "slate",   Icon: FaUsers },
    { title: "Eligible",     value: technicians.filter((t) => t?.isPracticingEligible === "eligible").length,     desc: "Approved to work",  tone: "emerald", Icon: FaCheckCircle },
    { title: "Pending",      value: technicians.filter((t) => t?.isPracticingEligible === "pending").length,      desc: "Awaiting approval", tone: "amber",   Icon: FaClock },
    { title: "Not Eligible", value: technicians.filter((t) => t?.isPracticingEligible === "not-eligible").length, desc: "Not approved",      tone: "rose",    Icon: FaTimesCircle },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#F4F6F8] pb-10">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#20242B] shadow-[0_0_0_5px_rgba(0,0,0,0.06)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#89919D]">User Management</span>
            </div>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">Technicians</h1>
            <p className="mt-2 text-sm leading-6 text-[#7C8592]">Manage and monitor all repair technicians</p>
          </div>
          <span className="rounded-full bg-[#F4F6F8] border border-[#E4E8ED] px-3 py-1.5 text-[10px] font-bold text-[#68717F]">{technicians.length} technicians</span>
        </div>

        <section className="mb-7">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metrics.map((m) => <KpiCard key={m.title} {...m} />)}
          </div>
        </section>

        <section>
          <div className="overflow-hidden rounded-[22px] border border-[#E4E8ED] bg-white shadow-[0_3px_12px_rgba(30,40,55,0.035)]">
            <div className="flex items-center justify-between border-b border-[#F0F2F5] px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-[#282D35]">Technician List</h2>
                <p className="mt-0.5 text-xs text-[#929AA5]">Technician information, status and eligibility</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full">
                <thead>
                  <tr className="bg-[#20242B]">
                    {["Technician", "Mobile No.", "Email", "Role", "Status", "Eligibility", "Action"].map((h) => (
                      <th key={h} className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9AA2AC] ${h === "Action" ? "text-center" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {technicians.length > 0 ? technicians.map((data, i) => (
                    <tr key={data?._id || i} onClick={() => history.push(`/users/technician/details?userId=${data?._id}`)}
                      className="group cursor-pointer border-b border-[#F4F6F8] transition-colors hover:bg-[#F9FAFB]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F6F8] border border-[#E4E8ED] text-[#20242B] font-bold text-sm transition-all group-hover:bg-[#20242B] group-hover:text-white">
                            {data?.userName?.[0]?.toUpperCase() || "T"}
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-[170px] truncate text-[12px] font-bold text-[#343B45]">{data?.userName || "--"}</p>
                            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#A0A7B0]">Technician</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className="text-[11px] font-semibold text-[#59626E]">{data?.phoneNumber || "--"}</span></td>
                      <td className="px-5 py-4"><span className="block max-w-[220px] truncate text-[11px] text-[#69727E]" title={data?.email}>{data?.email || "--"}</span></td>
                      <td className="px-5 py-4"><span className="inline-flex rounded-full border border-[#E4E8ED] bg-[#F4F6F8] px-2.5 py-1 text-[9px] font-bold capitalize text-[#59626E]">{data?.role || "--"}</span></td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold capitalize ${data?.userStatus === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${data?.userStatus === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {data?.userStatus === "inactive" ? "Blocked" : data?.userStatus || "--"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold capitalize ${getEligibilityClass(data?.isPracticingEligible)}`}>
                          {data?.isPracticingEligible || "--"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          <button type="button" onClick={(e) => { e.stopPropagation(); setId(data?._id); toggleDrawer(); }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] text-[#59626E] transition-all hover:bg-[#20242B] hover:text-white hover:border-[#20242B]">
                            <FaExternalLinkAlt size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={7}>
                      <div className="flex min-h-[280px] flex-col items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F6F8]"><BsBox size={24} className="text-[#A0A7B0]" /></div>
                        <p className="mt-4 text-sm font-bold text-[#69727E]">No Technicians Found</p>
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[#F0F2F5] px-5 py-3">
              <Pagination totalPages={totalPages} activePage={activePage} limit={limit}
                setPageValue={(p) => { setActivePage(p); getTechniciansData(p, limit); }}
                setLimit={(l) => { setLimit(l); setActivePage(1); getTechniciansData(1, l); }} />
            </div>
          </div>
        </section>
      </div>

      <MainDrawer windowDimensionHighWidth="400px">
        <StaffDrawer defaultStatus={technicians.find((t) => t?._id === id)?.isPracticingEligible}
          id={id} toggleDrawer={toggleDrawer} handleCallBack={() => getTechniciansData(activePage, limit)} />
      </MainDrawer>
    </AnimatedContent>
  );
};

export default Technician;

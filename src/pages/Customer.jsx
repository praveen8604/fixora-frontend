import React, { useContext, useEffect, useMemo, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import { FaExternalLinkAlt, FaUserCircle, FaUserCheck, FaUserSlash } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { BsBox } from "react-icons/bs";
import { FiSearch, FiPhone, FiMail, FiChevronRight, FiArrowUpRight } from "react-icons/fi";
import AnimatedContent from "@/components/common/AnimatedContent";
import { statusTheme } from "@/utils/getStatusTheme";
import Pagination from "@/components/common/Pagination";

const Customer = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const history = useHistory();
  const [customers, setCustomers] = useState([]);
  const [id, setId] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const getCustomers = (page, lim) => {
    DashboardServices.getCustomers(page, lim)
      .then((res) => {
        if (res) {
          const d = DecryptData(res);
          setTotalPages(d?.data?.totalPages || 0);
          setCustomers(d?.data?.customers || []);
        }
      })
      .catch(console.error);
  };

  useEffect(() => { getCustomers(activePage, limit); }, []);

  const filteredCustomers = useMemo(() => {
    const v = search.trim().toLowerCase();
    if (!v) return customers;
    return customers.filter((c) =>
      [c?.userName, c?.email, c?.phoneNumber?.toString(), c?.role, c?.userStatus]
        .some((f) => f?.toLowerCase()?.includes(v))
    );
  }, [customers, search]);

  const activeCount  = customers.filter((c) => c?.userStatus === "active").length;
  const blockedCount = customers.filter((c) => c?.userStatus === "inactive").length;

  const metrics = [
    { title: "Total Customers", value: customers.length, desc: "All customers",    tone: "blue",    Icon: FaUsers },
    { title: "Active",          value: activeCount,      desc: "Active accounts",  tone: "emerald", Icon: FaUserCheck },
    { title: "Blocked",         value: blockedCount,     desc: "Blocked accounts", tone: "rose",    Icon: FaUserSlash },
    { title: "Showing",         value: filteredCustomers.length, desc: search ? "Search results" : "Current page", tone: "amber", Icon: FaUserCircle },
  ];

  const toneClasses = {
    blue:    { icon: "bg-blue-500",    soft: "bg-blue-50",    line: "bg-blue-500" },
    emerald: { icon: "bg-emerald-500", soft: "bg-emerald-50", line: "bg-emerald-500" },
    rose:    { icon: "bg-rose-500",    soft: "bg-rose-50",    line: "bg-rose-500" },
    amber:   { icon: "bg-amber-500",   soft: "bg-amber-50",   line: "bg-amber-500" },
  };

  return (
    <>
      <AnimatedContent>
        <div className="min-h-screen bg-[#F4F6F8] pb-10">

          {/* PAGE HEADER */}
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--primary-color)] shadow-[0_0_0_5px_rgba(0,0,0,0.04)]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#89919D]">User Management</span>
              </div>
              <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">Customers</h1>
              <p className="mt-2 text-sm leading-6 text-[#7C8592]">Manage and view all registered customers</p>
            </div>
            <div className="flex h-[42px] w-full items-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-3 shadow-sm transition-all duration-200 sm:w-[300px] focus-within:border-[#20242B] focus-within:ring-2 focus-within:ring-[#20242B]/10">
              <FiSearch size={18} className="shrink-0 text-[#9AA2AC]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[12px] font-semibold text-[#343B45] outline-none placeholder:text-[#A6ADB6] focus:ring-0" />
              {search && (
                <button type="button" onClick={() => setSearch("")}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-[#9AA2AC] transition hover:bg-[#EEF0F3] hover:text-[#343B45]">×</button>
              )}
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
                  <h2 className="text-base font-bold text-[#282D35]">Customer List</h2>
                  <p className="mt-0.5 text-xs text-[#929AA5]">
                    {search ? `${filteredCustomers.length} results for "${search}"` : "Customer information and account status"}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full">
                  <thead>
                    <tr className="bg-[#20242B]">
                      {["Customer", "Mobile No.", "Email", "Role", "Status", "Action"].map((h) => (
                        <th key={h} className={`px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white ${h === "Action" ? "text-center" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length > 0 ? filteredCustomers.map((data, i) => (
                      <tr key={data?._id || i}
                        onClick={() => history.push(`/users/customer/details?userId=${data?._id}`)}
                        className="group cursor-pointer border-b border-[#EEF0F3] bg-white transition-all duration-200 hover:bg-[#FAFBFC]">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F3F5F8] ring-1 ring-[#E7EAF0] transition-all duration-200 group-hover:ring-[#20242B]">
                              <FaUserCircle size={22} className="text-[#A1A8B2]" />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-[12px] font-bold text-[#343B45] transition-colors group-hover:text-[#20242B]">{data?.userName || "N/A"}</p>
                              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#A0A7B0]">Customer</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <FiPhone size={13} className="shrink-0 text-[#A0A7B0]" />
                            <span className="text-[11px] font-semibold text-[#59626E]">{data?.phoneNumber || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex max-w-[230px] items-center gap-2">
                            <FiMail size={13} className="shrink-0 text-[#A0A7B0]" />
                            <span className="truncate text-[11px] font-semibold text-[#59626E]" title={data?.email}>{data?.email || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.05em] bg-[#F4F6F8] text-[#20242B]">{data?.role || "customer"}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold capitalize" style={statusTheme(data?.userStatus)}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {data?.userStatus === "inactive" ? "Blocked" : data?.userStatus || "Unknown"}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={(e) => { e.stopPropagation(); setId(data?._id); toggleDrawer(); }} type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E3E7EC] bg-[#F8F9FB] text-[#69727E] shadow-sm transition-all duration-200 hover:bg-[#20242B] hover:text-white">
                              <FaExternalLinkAlt size={12} />
                            </button>
                            <FiChevronRight size={14} className="text-[#C1C6CD] transition-transform duration-200 group-hover:translate-x-0.5" />
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6}>
                        <div className="flex min-h-[330px] flex-col items-center justify-center px-5">
                          <div className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-[#F4F6F8] text-[#A0A7B0]"><BsBox className="h-9 w-9" /></div>
                          <p className="mt-5 text-sm font-bold text-[#4A525D]">{search ? "No customers found" : "No customer records"}</p>
                          {search && (
                            <button type="button" onClick={() => setSearch("")}
                              className="mt-4 rounded-lg bg-[#20242B] px-4 py-2 text-[10px] font-bold text-white transition hover:opacity-90">
                              Clear Search
                            </button>
                          )}
                        </div>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-[#EEF0F3] px-4 py-3 sm:px-5">
                <Pagination totalPages={totalPages} activePage={activePage} limit={limit}
                  setPageValue={(p) => { setActivePage(p); getCustomers(p, limit); }}
                  setLimit={(l) => { setLimit(l); setActivePage(1); getCustomers(1, l); }} />
              </div>
            </div>
          </section>

        </div>
      </AnimatedContent>

      <MainDrawer>
        <StaffDrawer id={id} toggleDrawer={toggleDrawer}
          handleCallBack={() => getCustomers(activePage, limit)} />
      </MainDrawer>
    </>
  );
};

export default Customer;

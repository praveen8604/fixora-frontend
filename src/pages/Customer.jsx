import React, { useContext, useEffect, useMemo, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import { FaUsers, FaUserCheck, FaUserSlash, FaUserCircle, FaExternalLinkAlt } from "react-icons/fa";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";
import { BsBox } from "react-icons/bs";
import AnimatedContent from "@/components/common/AnimatedContent";
import Pagination from "@/components/common/Pagination";

const tones = {
  slate:   { icon: "bg-slate-600",   soft: "bg-slate-50",   line: "bg-slate-600" },
  emerald: { icon: "bg-emerald-500", soft: "bg-emerald-50", line: "bg-emerald-500" },
  rose:    { icon: "bg-rose-500",    soft: "bg-rose-50",    line: "bg-rose-500" },
  amber:   { icon: "bg-amber-500",   soft: "bg-amber-50",   line: "bg-amber-500" },
};

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
      .then((res) => { if (res) { const d = DecryptData(res); setTotalPages(d?.data?.totalPages || 0); setCustomers(d?.data?.customers || []); } })
      .catch(console.error);
  };

  useEffect(() => { getCustomers(activePage, limit); }, []);

  const filteredCustomers = useMemo(() => {
    const v = search.trim().toLowerCase();
    if (!v) return customers;
    return customers.filter((c) => [c?.userName, c?.email, c?.phoneNumber?.toString(), c?.role, c?.userStatus].some((f) => f?.toLowerCase()?.includes(v)));
  }, [customers, search]);

  const metrics = [
    { title: "Total Customers", value: customers.length,                                             desc: "All customers",    tone: "slate",   Icon: FaUsers },
    { title: "Active",          value: customers.filter((c) => c?.userStatus === "active").length,   desc: "Active accounts",  tone: "emerald", Icon: FaUserCheck },
    { title: "Blocked",         value: customers.filter((c) => c?.userStatus === "inactive").length, desc: "Blocked accounts", tone: "rose",    Icon: FaUserSlash },
    { title: "Showing",         value: filteredCustomers.length, desc: search ? "Search results" : "Current page", tone: "amber", Icon: FaUserCircle },
  ];

  return (
    <>
      <AnimatedContent>
        <div className="min-h-screen bg-[#F4F6F8] pb-10">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#20242B] shadow-[0_0_0_5px_rgba(0,0,0,0.06)]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#89919D]">User Management</span>
              </div>
              <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">Customers</h1>
              <p className="mt-2 text-sm leading-6 text-[#7C8592]">Manage and view all registered customers</p>
            </div>
            <div className="flex h-[42px] w-full items-center gap-2 rounded-xl border border-[#E4E8ED] bg-white px-3 shadow-sm sm:w-[280px] focus-within:border-[#20242B] focus-within:ring-2 focus-within:ring-[#20242B]/8">
              <FiSearch size={16} className="shrink-0 text-[#9AA2AC]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..."
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[12px] font-semibold text-[#343B45] outline-none placeholder:text-[#B0B8C2] focus:ring-0" />
              {search && <button type="button" onClick={() => setSearch("")} className="text-[#9AA2AC] hover:text-[#343B45] text-sm font-bold">×</button>}
            </div>
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
                  <h2 className="text-base font-bold text-[#282D35]">Customer List</h2>
                  <p className="mt-0.5 text-xs text-[#929AA5]">{search ? `${filteredCustomers.length} results for "${search}"` : "Customer information and account status"}</p>
                </div>
                <span className="rounded-full bg-[#F4F6F8] border border-[#E4E8ED] px-3 py-1 text-[10px] font-bold text-[#68717F]">{customers.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full">
                  <thead>
                    <tr className="bg-[#20242B]">
                      {["Customer", "Mobile No.", "Email", "Role", "Status", "Action"].map((h) => (
                        <th key={h} className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9AA2AC] ${h === "Action" ? "text-center" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length > 0 ? filteredCustomers.map((data, i) => (
                      <tr key={data?._id || i} onClick={() => history.push(`/users/customer/details?userId=${data?._id}`)}
                        className="group cursor-pointer border-b border-[#F4F6F8] transition-colors hover:bg-[#F9FAFB]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F6F8] border border-[#E4E8ED] text-[#20242B] font-bold text-sm transition-all group-hover:bg-[#20242B] group-hover:text-white">
                              {data?.userName?.[0]?.toUpperCase() || "C"}
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-[12px] font-bold text-[#343B45]">{data?.userName || "N/A"}</p>
                              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#A0A7B0]">Customer</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4"><span className="text-[11px] font-semibold text-[#59626E]">{data?.phoneNumber || "N/A"}</span></td>
                        <td className="px-5 py-4"><span className="block max-w-[230px] truncate text-[11px] text-[#59626E]" title={data?.email}>{data?.email || "N/A"}</span></td>
                        <td className="px-5 py-4"><span className="inline-flex rounded-full border border-[#E4E8ED] bg-[#F4F6F8] px-2.5 py-1 text-[9px] font-bold capitalize text-[#59626E]">{data?.role || "customer"}</span></td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold capitalize ${data?.userStatus === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${data?.userStatus === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                            {data?.userStatus === "inactive" ? "Blocked" : data?.userStatus || "Unknown"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-center">
                            <button onClick={(e) => { e.stopPropagation(); setId(data?._id); toggleDrawer(); }} type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] text-[#59626E] transition-all hover:bg-[#20242B] hover:text-white hover:border-[#20242B]">
                              <FaExternalLinkAlt size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6}>
                        <div className="flex min-h-[280px] flex-col items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F6F8]"><BsBox size={24} className="text-[#A0A7B0]" /></div>
                          <p className="mt-4 text-sm font-bold text-[#69727E]">{search ? "No customers found" : "No customer records"}</p>
                          {search && <button type="button" onClick={() => setSearch("")} className="mt-3 rounded-xl bg-[#20242B] px-4 py-2 text-[10px] font-bold text-white transition hover:opacity-80">Clear Search</button>}
                        </div>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-[#F0F2F5] px-4 py-3">
                <Pagination totalPages={totalPages} activePage={activePage} limit={limit}
                  setPageValue={(p) => { setActivePage(p); getCustomers(p, limit); }}
                  setLimit={(l) => { setLimit(l); setActivePage(1); getCustomers(1, l); }} />
              </div>
            </div>
          </section>
        </div>
      </AnimatedContent>

      <MainDrawer>
        <StaffDrawer id={id} toggleDrawer={toggleDrawer} handleCallBack={() => getCustomers(activePage, limit)} />
      </MainDrawer>
    </>
  );
};

export default Customer;

import React, { useContext, useEffect, useMemo, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import { FaUsers, FaUserCheck, FaUserSlash, FaUserCircle, FaExternalLinkAlt } from "react-icons/fa";
import { FiArrowUpRight, FiSearch, FiPhone, FiMail } from "react-icons/fi";
import { BsBox } from "react-icons/bs";
import AnimatedContent from "@/components/common/AnimatedContent";
import Pagination from "@/components/common/Pagination";

const toneClasses = {
  emerald: { icon: "bg-emerald-500", soft: "bg-emerald-50", line: "bg-emerald-500" },
  teal:    { icon: "bg-teal-500",    soft: "bg-teal-50",    line: "bg-teal-500" },
  rose:    { icon: "bg-rose-500",    soft: "bg-rose-50",    line: "bg-rose-500" },
  amber:   { icon: "bg-amber-500",   soft: "bg-amber-50",   line: "bg-amber-500" },
};

const KpiCard = ({ title, value, desc, tone, Icon }) => {
  const t = toneClasses[tone];
  return (
    <div className="group relative min-h-[140px] overflow-hidden rounded-[22px] border border-emerald-100 bg-white p-5 shadow-[0_3px_12px_rgba(16,185,129,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(16,185,129,0.13)]">
      <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${t.soft} opacity-80 transition-transform duration-500 group-hover:scale-[1.45]`} />
      <div className={`pointer-events-none absolute -bottom-14 -left-14 h-24 w-24 rounded-full ${t.soft} opacity-40`} />
      <div className="relative z-20 flex items-start justify-between">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${t.icon} text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-2`}>
          <Icon size={20} color="#fff" />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-300 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white">
          <FiArrowUpRight size={14} />
        </div>
      </div>
      <div className="relative z-20 mt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-500">{title}</p>
        <div className="mt-2 flex items-end justify-between gap-2">
          <h3 className="text-[24px] font-extrabold leading-none tracking-tight text-[#22272F]">{value}</h3>
          <span className="text-right text-[10px] font-medium text-emerald-300">{desc}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-5 right-5 z-20 h-[3px] overflow-hidden rounded-full bg-emerald-50">
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

  const metrics = [
    { title: "Total Customers", value: customers.length,                                             desc: "All customers",    tone: "emerald", Icon: FaUsers },
    { title: "Active",          value: customers.filter((c) => c?.userStatus === "active").length,   desc: "Active accounts",  tone: "teal",    Icon: FaUserCheck },
    { title: "Blocked",         value: customers.filter((c) => c?.userStatus === "inactive").length, desc: "Blocked accounts", tone: "rose",    Icon: FaUserSlash },
    { title: "Showing",         value: filteredCustomers.length, desc: search ? "Search results" : "Current page", tone: "amber", Icon: FaUserCircle },
  ];

  return (
    <>
      <AnimatedContent>
        <div className="min-h-screen bg-[#F2FBF6] pb-10">

          {/* HEADER */}
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.15)]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-500">User Management</span>
              </div>
              <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">Customers</h1>
              <p className="mt-2 text-sm leading-6 text-[#7C8592]">Manage and view all registered customers</p>
            </div>
            <div className="flex h-[42px] w-full items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3 shadow-sm transition-all sm:w-[300px] focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
              <FiSearch size={18} className="shrink-0 text-emerald-300" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[12px] font-semibold text-[#343B45] outline-none placeholder:text-emerald-200 focus:ring-0" />
              {search && (
                <button type="button" onClick={() => setSearch("")}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-emerald-300 transition hover:bg-emerald-50 hover:text-emerald-600">×</button>
              )}
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
            <div className="overflow-hidden rounded-[22px] border border-emerald-100 bg-white shadow-[0_3px_12px_rgba(16,185,129,0.07)]">
              <div className="flex items-center justify-between border-b border-emerald-50 px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-[#282D35]">Customer List</h2>
                  <p className="mt-0.5 text-xs text-emerald-500">
                    {search ? `${filteredCustomers.length} results for "${search}"` : "Customer information and account status"}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-1.5">
                  <FaUsers size={13} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-600">{customers.length} customers</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full">
                  <thead>
                    <tr style={{ backgroundColor: "#ECFDF5", borderBottom: "1px solid #A7F3D0" }}>
                      {["Customer", "Mobile No.", "Email", "Role", "Status", "Action"].map((h) => (
                        <th key={h} className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-600 ${h === "Action" ? "text-center" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length > 0 ? filteredCustomers.map((data, i) => (
                      <tr key={data?._id || i}
                        onClick={() => history.push(`/users/customer/details?userId=${data?._id}`)}
                        className="group cursor-pointer border-b border-emerald-50 transition-all duration-200 hover:bg-[#F2FBF6]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 font-bold text-sm transition-all group-hover:bg-emerald-500 group-hover:text-white">
                              {data?.userName?.[0]?.toUpperCase() || "C"}
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-[12px] font-bold text-[#343B45]">{data?.userName || "N/A"}</p>
                              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-emerald-300">Customer</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <FiPhone size={12} className="shrink-0 text-emerald-300" />
                            <span className="text-[11px] font-semibold text-[#59626E]">{data?.phoneNumber || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex max-w-[230px] items-center gap-2">
                            <FiMail size={12} className="shrink-0 text-emerald-300" />
                            <span className="truncate text-[11px] font-semibold text-[#59626E]" title={data?.email}>{data?.email || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold capitalize text-emerald-700">{data?.role || "customer"}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold capitalize ${data?.userStatus === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${data?.userStatus === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                            {data?.userStatus === "inactive" ? "Blocked" : data?.userStatus || "Unknown"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-center">
                            <button onClick={(e) => { e.stopPropagation(); setId(data?._id); toggleDrawer(); }} type="button"
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white">
                              <FaExternalLinkAlt size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6}>
                        <div className="flex min-h-[300px] flex-col items-center justify-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50"><BsBox size={28} className="text-emerald-400" /></div>
                          <p className="mt-4 text-sm font-bold text-[#59626E]">{search ? "No customers found" : "No customer records"}</p>
                          {search && (
                            <button type="button" onClick={() => setSearch("")}
                              className="mt-3 rounded-xl bg-emerald-500 px-4 py-2 text-[10px] font-bold text-white transition hover:bg-emerald-600">
                              Clear Search
                            </button>
                          )}
                        </div>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-emerald-50 px-4 py-3">
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

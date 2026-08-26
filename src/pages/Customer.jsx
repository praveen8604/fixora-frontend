import React, { useContext, useEffect, useMemo, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaUserCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";
import { BsBox } from "react-icons/bs";
import AnimatedContent from "@/components/common/AnimatedContent";
import Pagination from "@/components/common/Pagination";

const tones = {
  slate: {
    icon: "from-[#5E63D9] to-[#35C7F3]",
    soft: "from-[#EEF0FF] to-[#F4FDFF]",
    line: "from-[#5E63D9] to-[#35C7F3]",
  },
  emerald: {
    icon: "from-[#10B981] to-[#67E8C4]",
    soft: "from-[#ECFDF5] to-[#F0FDFA]",
    line: "from-[#10B981] to-[#59D6BF]",
  },
  rose: {
    icon: "from-[#F43F5E] to-[#FB7185]",
    soft: "from-[#FFF1F3] to-[#FFF5F7]",
    line: "from-[#F43F5E] to-[#FB7185]",
  },
  amber: {
    icon: "from-[#8B5CF6] to-[#6366F1]",
    soft: "from-[#F4F0FF] to-[#F5F3FF]",
    line: "from-[#8B5CF6] to-[#4CC9F0]",
  },
};

const KpiCard = ({ title, value, desc, tone, Icon }) => {
  const t = tones[tone];
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-[#E5EAF1] bg-white p-5 shadow-[0_6px_25px_rgba(15,23,42,0.035)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#C9D7EF] hover:shadow-[0_22px_45px_rgba(15,23,42,0.09)]">
      <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${t.soft} opacity-70 transition-all duration-500 group-hover:scale-[1.7]`} />
      <div className="relative z-10 flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br ${t.soft} text-[#2563EB] transition-all duration-300 group-hover:scale-110`}>
          <Icon size={18} />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F6FA] text-[#98A2B3] transition-all duration-300 group-hover:bg-[#111827] group-hover:text-white">
          <FiArrowUpRight size={14} />
        </div>
      </div>
      <div className="relative z-10 mt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8B95A7]">{title}</p>
        <div className="mt-2.5 flex items-end justify-between gap-2">
          <h3 className="text-[30px] font-extrabold leading-none tracking-[-0.05em] text-[#111827]">{value}</h3>
          <span className="mb-0.5 max-w-[105px] text-right text-[9px] font-medium leading-4 text-[#A0A8B8]">{desc}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-5 right-5 h-[2px] overflow-hidden rounded-full bg-[#EDF0F5]">
        <div className={`h-full w-0 rounded-full bg-gradient-to-r ${t.line} transition-all duration-500 group-hover:w-full`} />
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

  useEffect(() => {
    getCustomers(activePage, limit);
  }, []);

  const filteredCustomers = useMemo(() => {
    const v = search.trim().toLowerCase();
    if (!v) return customers;
    return customers.filter((c) =>
      [c?.userName, c?.email, c?.phoneNumber?.toString(), c?.role, c?.userStatus].some((f) =>
        f?.toLowerCase()?.includes(v)
      )
    );
  }, [customers, search]);

  const activeCustomers = customers.filter((c) => c?.userStatus === "active").length;
  const blockedCustomers = customers.filter((c) => c?.userStatus === "inactive").length;

  const metrics = [
    { title: "Total Customers", value: customers.length, desc: "All customers", tone: "slate", Icon: FaUsers },
    { title: "Active", value: activeCustomers, desc: "Active accounts", tone: "emerald", Icon: FaUserCheck },
    { title: "Blocked", value: blockedCustomers, desc: "Blocked accounts", tone: "rose", Icon: FaUserSlash },
    { title: "Showing", value: filteredCustomers.length, desc: search ? "Search results" : "Current page", tone: "amber", Icon: FaUserCircle },
  ];

  return (
    <>
      <AnimatedContent>
        <div className="min-h-screen bg-[#F4F7FB] pb-10">
          <section className="mb-8">
            <div className="relative overflow-hidden rounded-[30px] bg-[#0B1220] px-6 py-7 shadow-[0_20px_55px_rgba(15,23,42,0.15)] sm:px-8 sm:py-9">
              <div className="pointer-events-none absolute -right-24 -top-28 h-[340px] w-[340px] rounded-full bg-[#2563EB]/20 blur-[2px]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:34px_34px]" />
              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8]/50" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#38BDF8]" /></span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">User Management</span>
                  </div>
                  <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-[34px]">Customers</h1>
                  <p className="mt-2 max-w-[520px] text-[13px] leading-6 text-white/50">Manage customer accounts, activity status and search results from one place.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-[44px] items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.055] px-3 backdrop-blur-xl">
                    <FiSearch size={14} className="text-white/40" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="w-[180px] border-0 bg-transparent text-[12px] font-medium text-white outline-none placeholder:text-white/30 focus:ring-0" />
                    {search && <button type="button" onClick={() => setSearch("")} className="text-white/40 hover:text-white/80 text-sm">×</button>}
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 backdrop-blur-xl">
                    <FaUsers size={13} className="text-[#60A5FA]" />
                    <span className="text-[12px] font-bold text-white/85">{customers.length} Customers</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#2563EB]/50 to-transparent" />
            </div>
          </section>

          <section className="mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((m) => (
                <KpiCard key={m.title} {...m} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0FF] text-[#2563EB]">
                  <FaUserCircle size={15} />
                </div>
                <div>
                  <h2 className="text-[16px] font-extrabold tracking-[-0.025em] text-[#111827]">Customer Collection</h2>
                  <p className="mt-0.5 text-[11px] text-[#8993A5]">Manage and monitor every customer account</p>
                </div>
              </div>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-[#A0A8B8] sm:block">
                {search ? `${filteredCustomers.length} Matching` : `${customers.length} Records`}
              </span>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-[#E8ECF5] bg-white/92 shadow-[0_18px_42px_rgba(84,98,130,0.10)] backdrop-blur-sm">
              <div className="border-b border-[#F0F2F7] bg-[linear-gradient(180deg,rgba(247,248,255,0.95),rgba(255,255,255,0.9))] px-6 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#282F3D]">Customer List</h3>
                    <p className="mt-1 text-xs text-[#98A1B0]">
                      {search ? `${filteredCustomers.length} results for "${search}"` : "Customer information and account status"}
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center rounded-full bg-[#F5F7FC] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7F8897]">
                    Live Data
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full">
                  <thead>
                    <tr className="bg-[#F8FAFD]">
                      {["Customer", "Mobile No.", "Email", "Role", "Status", "Action"].map((h) => (
                        <th key={h} className={`px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#99A3B3] ${h === "Action" ? "text-center" : "text-left"}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((data, i) => (
                        <tr
                          key={data?._id || i}
                          onClick={() => history.push(`/users/customer/details?userId=${data?._id}`)}
                          className="group cursor-pointer border-b border-[#F2F4F8] bg-white transition-colors hover:bg-[#FAFBFF]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E5E9F3] bg-gradient-to-br from-[#F4F6FF] to-[#F6FCFF] text-sm font-bold text-[#3A4457] transition-all group-hover:from-[#6E52F5] group-hover:to-[#37B5EC] group-hover:text-white">
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
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold capitalize ${data?.userStatus === "active" ? "bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]" : "bg-[#FFF1F3] text-[#E11D48] border-[#FFE0E7]"}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${data?.userStatus === "active" ? "bg-[#10B981]" : "bg-[#F43F5E]"}`} />
                              {data?.userStatus === "inactive" ? "Blocked" : data?.userStatus || "Unknown"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setId(data?._id);
                                  toggleDrawer();
                                }}
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] text-[#59626E] transition-all hover:bg-[#20242B] hover:text-white hover:border-[#20242B]"
                              >
                                <FaExternalLinkAlt size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>
                          <div className="flex min-h-[280px] flex-col items-center justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#F4F7FD] text-[#A0A9B8]">
                              <BsBox size={24} />
                            </div>
                            <p className="mt-4 text-sm font-bold text-[#69727E]">{search ? "No customers found" : "No customer records"}</p>
                            {search && (
                              <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="mt-3 rounded-xl bg-[#20242B] px-4 py-2 text-[10px] font-bold text-white transition hover:opacity-80"
                              >
                                Clear Search
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-[#F0F2F7] px-4 py-3">
                <Pagination
                  totalPages={totalPages}
                  activePage={activePage}
                  limit={limit}
                  setPageValue={(p) => {
                    setActivePage(p);
                    getCustomers(p, limit);
                  }}
                  setLimit={(l) => {
                    setLimit(l);
                    setActivePage(1);
                    getCustomers(1, l);
                  }}
                />
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

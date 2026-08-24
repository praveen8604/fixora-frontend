import React, { useEffect, useMemo, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useHistory } from "react-router-dom";
import Pagination from "@/components/common/Pagination";
import { FaUsers, FaUserCheck, FaUserSlash, FaUserCog } from "react-icons/fa";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";

const toneClasses = {
  blue:    { icon: "bg-blue-500",    soft: "bg-blue-50",    line: "bg-blue-500" },
  emerald: { icon: "bg-emerald-500", soft: "bg-emerald-50", line: "bg-emerald-500" },
  rose:    { icon: "bg-rose-500",    soft: "bg-rose-50",    line: "bg-rose-500" },
  amber:   { icon: "bg-amber-500",   soft: "bg-amber-50",   line: "bg-amber-500" },
};

const getRoleClass = (role) => {
  const map = {
    admin:      "bg-rose-50 text-rose-700 border-rose-200",
    technician: "bg-amber-50 text-amber-700 border-amber-200",
    rider:      "bg-purple-50 text-purple-700 border-purple-200",
    customer:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return map[role] || "bg-blue-50 text-blue-700 border-blue-200";
};

const KpiCard = ({ title, value, desc, tone, Icon }) => {
  const t = toneClasses[tone];
  return (
    <div className="group relative min-h-[140px] overflow-hidden rounded-[22px] border border-blue-100 bg-white p-5 shadow-[0_3px_12px_rgba(59,130,246,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(59,130,246,0.13)]">
      <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${t.soft} opacity-80 transition-transform duration-500 group-hover:scale-[1.45]`} />
      <div className={`pointer-events-none absolute -bottom-14 -left-14 h-24 w-24 rounded-full ${t.soft} opacity-40`} />
      <div className="relative z-20 flex items-start justify-between">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${t.icon} text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-2`}>
          <Icon size={20} color="#fff" />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-300 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white">
          <FiArrowUpRight size={14} />
        </div>
      </div>
      <div className="relative z-20 mt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-400">{title}</p>
        <div className="mt-2 flex items-end justify-between gap-2">
          <h3 className="text-[24px] font-extrabold leading-none tracking-tight text-[#22272F]">{value}</h3>
          <span className="text-right text-[10px] font-medium text-blue-300">{desc}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-5 right-5 z-20 h-[3px] overflow-hidden rounded-full bg-blue-50">
        <div className={`h-full w-0 ${t.line} rounded-full transition-all duration-500 group-hover:w-full`} />
      </div>
    </div>
  );
};

const AllUsers = () => {
  const history = useHistory();
  const [userData, setUserData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const getAllUsers = (page, lim) => {
    DashboardServices.getAllUsers(page, lim)
      .then((res) => {
        if (res) {
          const d = DecryptData(res);
          setTotalPages(d.data?.totalPages);
          setUserData(d.data?.users || []);
        }
      })
      .catch(console.error);
  };

  useEffect(() => { getAllUsers(activePage, limit); }, []);

  const filteredUsers = useMemo(() => {
    const v = search.trim().toLowerCase();
    if (!v) return userData;
    return userData.filter((u) =>
      [u?.userName, u?.email, u?.phoneNumber, u?.role, u?.userStatus]
        .some((f) => f?.toLowerCase()?.includes(v))
    );
  }, [userData, search]);

  const metrics = [
    { title: "Total Users", value: userData.length,                                             desc: "All registered",    tone: "blue",    Icon: FaUsers },
    { title: "Active",      value: userData.filter((u) => u?.userStatus === "active").length,   desc: "Active accounts",   tone: "emerald", Icon: FaUserCheck },
    { title: "Blocked",     value: userData.filter((u) => u?.userStatus === "inactive").length, desc: "Inactive accounts", tone: "rose",    Icon: FaUserSlash },
    { title: "Admins",      value: userData.filter((u) => u?.role === "admin").length,          desc: "Admin users",       tone: "amber",   Icon: FaUserCog },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#F4F8FF] pb-10">

        {/* HEADER */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_5px_rgba(59,130,246,0.15)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-400">User Management</span>
            </div>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">All Users</h1>
            <p className="mt-2 text-sm leading-6 text-[#7C8592]">Manage and view all registered users</p>
          </div>
          <div className="flex h-[42px] w-full items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 shadow-sm transition-all sm:w-[300px] focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
            <FiSearch size={18} className="shrink-0 text-blue-300" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[12px] font-semibold text-[#343B45] outline-none placeholder:text-blue-200 focus:ring-0" />
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
          <div className="overflow-hidden rounded-[22px] border border-blue-100 bg-white shadow-[0_3px_12px_rgba(59,130,246,0.07)]">
            <div className="flex items-center justify-between border-b border-blue-50 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-[#282D35]">User List</h2>
                <p className="mt-0.5 text-xs text-blue-400">
                  {search ? `${filteredUsers.length} matching users` : "All registered users and their account information"}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-3 py-1.5">
                <FaUsers size={13} className="text-blue-500" />
                <span className="text-[10px] font-bold text-blue-600">{userData.length} users</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[850px] w-full">
                <thead>
                  <tr style={{ backgroundColor: "#EBF3FF", borderBottom: "1px solid #BFDBFE" }}>
                    {["User", "Mobile No.", "Email", "Role", "Status"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-blue-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? filteredUsers.map((data, i) => (
                    <tr key={data?._id || i} onClick={() => history.push(`/user?userId=${data?._id}`)}
                      className="group cursor-pointer border-b border-blue-50 transition-all duration-200 hover:bg-[#F4F8FF]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-500 font-bold text-sm transition-all group-hover:bg-blue-500 group-hover:text-white">
                            {data?.userName?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-[180px] truncate text-[12px] font-bold text-[#343B45]">{data?.userName || "--"}</p>
                            <p className="mt-0.5 text-[9px] font-semibold text-blue-300">{data?._id ? `${data._id.slice(0, 8)}...` : "--"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className="text-[11px] font-semibold text-[#59626E]">{data?.phoneNumber || "--"}</span></td>
                      <td className="px-5 py-4"><span className="block max-w-[230px] truncate text-[11px] font-semibold text-[#59626E]" title={data?.email}>{data?.email || "--"}</span></td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold capitalize ${getRoleClass(data?.role)}`}>{data?.role || "--"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold capitalize ${data?.userStatus === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${data?.userStatus === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {data?.userStatus === "inactive" ? "Blocked" : data?.userStatus || "--"}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50"><FaUsers size={24} className="text-blue-400" /></div>
                        <p className="mt-3 text-[12px] font-bold text-[#59626E]">No users found</p>
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-blue-50 px-4 py-3">
              <Pagination totalPages={totalPages} activePage={activePage} limit={limit}
                setPageValue={(p) => { setActivePage(p); getAllUsers(p, limit); }}
                setLimit={(l) => { setLimit(l); setActivePage(1); getAllUsers(1, l); }} />
            </div>
          </div>
        </section>

      </div>
    </AnimatedContent>
  );
};

export default AllUsers;

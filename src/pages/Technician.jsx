import React, { useContext, useEffect, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserCog,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
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
  amber: {
    icon: "from-[#8B5CF6] to-[#6366F1]",
    soft: "from-[#F4F0FF] to-[#F5F3FF]",
    line: "from-[#8B5CF6] to-[#4CC9F0]",
  },
  rose: {
    icon: "from-[#F43F5E] to-[#FB7185]",
    soft: "from-[#FFF1F3] to-[#FFF5F7]",
    line: "from-[#F43F5E] to-[#FB7185]",
  },
};

const getEligibilityClass = (s) =>
  ({
    eligible: "bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]",
    pending: "bg-[#FFF7ED] text-[#D97706] border-[#FDE7C7]",
    "not-eligible": "bg-[#FFF1F3] text-[#E11D48] border-[#FFE0E7]",
  }[s] || "bg-[#F4F6FA] text-[#667085] border-[#E7EBF1]");

const KpiCard = ({ title, value, desc, tone, Icon }) => {
  const t = tones[tone];
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/70 bg-white/88 p-6 shadow-[0_12px_36px_rgba(84,98,130,0.12)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(84,98,130,0.18)]">
      <div className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${t.soft} opacity-95 blur-sm transition-transform duration-500 group-hover:scale-125`} />
      <div className="pointer-events-none absolute bottom-3 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br ${t.icon} text-white shadow-[0_16px_30px_rgba(99,102,241,0.28)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}>
          <Icon size={20} />
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEF0F6] bg-white/85 text-[#9AA2B1] transition-all duration-300 group-hover:border-[#DADDF3] group-hover:text-[#5E63D9]">
          <FiArrowUpRight size={14} />
        </div>
      </div>
      <div className="relative z-10 mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#98A1B2]">{title}</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <h3 className="text-[30px] font-extrabold leading-none tracking-[-0.04em] text-[#1F2430]">{value}</h3>
          <span className="max-w-[110px] text-right text-[10px] font-semibold text-[#A1A9B8]">{desc}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-6 right-6 h-1 overflow-hidden rounded-full bg-[#EEF2F8]">
        <div className={`h-full w-0 rounded-full bg-gradient-to-r ${t.line} transition-all duration-500 group-hover:w-full`} />
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

  useEffect(() => {
    getTechniciansData(activePage, limit);
  }, []);

  const eligibleCount = technicians.filter(
    (t) => t?.isPracticingEligible === "eligible"
  ).length;

  const metrics = [
    { title: "Total", value: technicians.length, desc: "All technicians", tone: "slate", Icon: FaUsers },
    { title: "Eligible", value: eligibleCount, desc: "Approved to work", tone: "emerald", Icon: FaCheckCircle },
    { title: "Pending", value: technicians.filter((t) => t?.isPracticingEligible === "pending").length, desc: "Awaiting approval", tone: "amber", Icon: FaClock },
    { title: "Not Eligible", value: technicians.filter((t) => t?.isPracticingEligible === "not-eligible").length, desc: "Not approved", tone: "rose", Icon: FaTimesCircle },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#F5F7FF] pb-10">
        <section className="relative mb-8 overflow-hidden rounded-[36px] border border-[#E9ECF7] bg-[radial-gradient(circle_at_top_right,_rgba(222,244,255,0.9),_rgba(255,255,255,0.96)_30%,_rgba(246,242,255,0.92)_65%,_rgba(255,255,255,0.98)_100%)] px-6 py-8 shadow-[0_20px_50px_rgba(91,107,138,0.12)] lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(#DBE1F0_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
          <div className="pointer-events-none absolute right-16 top-20 h-40 w-40 rounded-full border border-[#DCEEFF] opacity-80" />
          <div className="pointer-events-none absolute right-8 top-28 h-52 w-52 rounded-full border border-[#E8DFFF] opacity-70" />
          <div className="pointer-events-none absolute -bottom-12 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-[#CFF4FF] opacity-35 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-[720px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E8EAFE] bg-white/80 px-4 py-2 shadow-[0_8px_18px_rgba(95,99,221,0.08)] backdrop-blur-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5E63D9] text-white">
                  <FaUserCog size={12} />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5E63D9]">User Management</span>
              </div>

              <h1 className="mt-6 max-w-[760px] text-[38px] font-extrabold leading-[1.03] tracking-[-0.05em] text-[#1B2230] lg:text-[56px]">
                Everything you need to
                <span className="bg-gradient-to-r from-[#6A4FF6] via-[#5A67F2] to-[#2EA8E6] bg-clip-text text-transparent">
                  {" "}manage your technicians.
                </span>
              </h1>

              <p className="mt-5 max-w-[620px] text-[15px] leading-8 text-[#6F7B8F]">
                Keep technician profiles, approval status, and eligibility visible in one beautifully designed workspace built for service operations.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="inline-flex items-center gap-3 rounded-[18px] bg-gradient-to-r from-[#5F5CF1] to-[#7E42F5] px-5 py-4 text-white shadow-[0_16px_32px_rgba(101,86,243,0.28)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/16">
                    <FaUsers size={16} />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/75">Collection</p>
                    <p className="text-[20px] font-extrabold leading-none">{technicians.length} Technicians</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-[18px] border border-[#E5E9F4] bg-white/92 px-4 py-3 shadow-[0_10px_22px_rgba(60,78,110,0.06)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECF2FF] text-[#5E63D9]">
                    <FaCheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A0A8B6]">Eligible</p>
                    <p className="text-[22px] font-extrabold leading-none text-[#222938]">{eligibleCount} Ready</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex min-h-[250px] items-center justify-center lg:min-w-[320px]">
              <div className="absolute right-0 top-2 rounded-full border border-[#D9F5E9] bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#16A36B] shadow-[0_8px_22px_rgba(22,163,107,0.12)]">
                Verified
              </div>
              <div className="absolute right-4 bottom-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E0EDFF] bg-white text-[#3BAEDC] shadow-[0_14px_28px_rgba(69,146,201,0.14)]">
                <FaCheckCircle size={16} />
              </div>
              <div className="relative rounded-[30px] bg-white/72 p-5 shadow-[0_20px_40px_rgba(102,109,176,0.18)] backdrop-blur-sm">
                <div className="absolute -left-6 top-5 rounded-[22px] border border-[#EEF0FF] bg-white px-5 py-3 shadow-[0_12px_26px_rgba(92,102,160,0.12)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A0A9BA]">Approved</p>
                  <p className="mt-1 text-[30px] font-extrabold leading-none text-[#202737]">{eligibleCount}</p>
                </div>
                <div className="flex h-[180px] w-[180px] items-center justify-center rounded-[34px] bg-gradient-to-br from-[#6E52F5] via-[#6458F6] to-[#2FA8E7] shadow-[inset_0_2px_0_rgba(255,255,255,0.35)]">
                  <div className="rounded-[28px] border border-white/25 bg-white/10 p-5 text-white backdrop-blur-sm">
                    <FaUserCog size={54} />
                  </div>
                </div>
              </div>
            </div>
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
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#6E52F5] to-[#4A89F3] text-white shadow-[0_16px_30px_rgba(100,93,242,0.28)]">
                <FaUserCog size={22} />
              </div>
              <div>
                <h2 className="text-[34px] font-extrabold tracking-[-0.05em] text-[#1F2430]">Technician Collection</h2>
                <p className="text-sm text-[#7B8697]">Manage and monitor every technician profile</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-[#E5E8F2] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#707B8D] shadow-sm">
              {technicians.length} Records
            </span>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-[#E8ECF5] bg-white/92 shadow-[0_18px_42px_rgba(84,98,130,0.10)] backdrop-blur-sm">
            <div className="border-b border-[#F0F2F7] bg-[linear-gradient(180deg,rgba(247,248,255,0.95),rgba(255,255,255,0.9))] px-6 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#282F3D]">Technician List</h3>
                  <p className="mt-1 text-xs text-[#98A1B0]">Technician information, status and eligibility</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-[#F5F7FC] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7F8897]">
                  Live Data
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full">
                <thead>
                  <tr className="bg-[#F8FAFD]">
                    {["Technician", "Mobile No.", "Email", "Role", "Status", "Eligibility", "Action"].map((h) => (
                      <th key={h} className={`px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#99A3B3] ${h === "Action" ? "text-center" : "text-left"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {technicians.length > 0 ? (
                    technicians.map((data, i) => (
                      <tr
                        key={data?._id || i}
                        onClick={() => history.push(`/users/technician/details?userId=${data?._id}`)}
                        className="group cursor-pointer border-b border-[#F2F4F8] bg-white transition-colors hover:bg-[#FAFBFF]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#E5E9F3] bg-gradient-to-br from-[#F4F6FF] to-[#F6FCFF] text-sm font-bold text-[#3A4457] transition-all group-hover:from-[#6E52F5] group-hover:to-[#37B5EC] group-hover:text-white">
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
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold capitalize ${data?.userStatus === "active" ? "bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]" : "bg-[#FFF1F3] text-[#E11D48] border-[#FFE0E7]"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${data?.userStatus === "active" ? "bg-[#10B981]" : "bg-[#F43F5E]"}`} />
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
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setId(data?._id);
                                toggleDrawer();
                              }}
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
                      <td colSpan={7}>
                        <div className="flex min-h-[280px] flex-col items-center justify-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#F4F7FD] text-[#A0A9B8]">
                            <BsBox size={24} />
                          </div>
                          <p className="mt-4 text-sm font-bold text-[#69727E]">No Technicians Found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[#F0F2F7] px-5 py-3">
              <Pagination
                totalPages={totalPages}
                activePage={activePage}
                limit={limit}
                setPageValue={(p) => {
                  setActivePage(p);
                  getTechniciansData(p, limit);
                }}
                setLimit={(l) => {
                  setLimit(l);
                  setActivePage(1);
                  getTechniciansData(1, l);
                }}
              />
            </div>
          </div>
        </section>
      </div>

      <MainDrawer windowDimensionHighWidth="400px">
        <StaffDrawer
          defaultStatus={technicians.find((t) => t?._id === id)?.isPracticingEligible}
          id={id}
          toggleDrawer={toggleDrawer}
          handleCallBack={() => getTechniciansData(activePage, limit)}
        />
      </MainDrawer>
    </AnimatedContent>
  );
};

export default Technician;

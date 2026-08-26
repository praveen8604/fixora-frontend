import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import DataTable from "react-data-table-component";

import AnimatedContent from "@/components/common/AnimatedContent";
import Pagination from "@/components/common/Pagination";

import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { statusTheme } from "@/utils/getStatusTheme";

import { SidebarContext } from "@/context/SidebarContext";

import {
  FaWallet,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExternalLinkAlt,
  FaRegCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";

import { MdPayment, MdOutlinePayments } from "react-icons/md";

import {
  FiActivity,
  FiCalendar,
  FiHash,
  FiArrowUpRight,
} from "react-icons/fi";

const tones = {
  slate: {
    soft: "from-[#EEF0FF] to-[#F4FDFF]",
    line: "from-[#5E63D9] to-[#35C7F3]",
  },
  emerald: {
    soft: "from-[#ECFDF5] to-[#F0FDFA]",
    line: "from-[#10B981] to-[#59D6BF]",
  },
  amber: {
    soft: "from-[#F4F0FF] to-[#F5F3FF]",
    line: "from-[#8B5CF6] to-[#4CC9F0]",
  },
  rose: {
    soft: "from-[#FFF1F3] to-[#FFF5F7]",
    line: "from-[#F43F5E] to-[#FB7185]",
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

const PaymentLogs = () => {
  const [payments, setPayments] = useState([]);
  const { isSidebarOpen } = useContext(SidebarContext);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const getPaymentLogs = (page, lim) => {
    setLoading(true);
    DashboardServices.getPaymentLogs(page, lim)
      .then((res) => {
        if (res) {
          const d = DecryptData(res);
          setTotalPages(d?.data?.totalPages || 0);
          setPayments(d?.data?.payments || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getPaymentLogs(activePage, limit);
  }, []);

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p?.total || 0), 0);

  const paid = payments.filter((p) =>
    ["paid", "payment_success", "completed", "success"].includes(
      p?.paymentInfo?.paymentStatus?.toLowerCase()
    )
  ).length;

  const pending = payments.filter((p) =>
    ["pending", "payment_pending", "payment_initiate_pending", "processing"].includes(
      p?.paymentInfo?.paymentStatus?.toLowerCase()
    )
  ).length;

  const failed = payments.filter((p) =>
    ["failed", "payment_declined", "timed_out", "cancelled", "canceled"].includes(
      p?.paymentInfo?.paymentStatus?.toLowerCase()
    )
  ).length;

  const metrics = [
    { title: "Total Revenue", value: currencyFormatter(totalRevenue), desc: "All transactions", tone: "slate", Icon: FaWallet },
    { title: "Paid", value: paid, desc: "Successful payments", tone: "emerald", Icon: FaCheckCircle },
    { title: "Pending", value: pending, desc: "Awaiting payment", tone: "amber", Icon: FaClock },
    { title: "Failed", value: failed, desc: "Failed transactions", tone: "rose", Icon: FaTimesCircle },
  ];

  const StatusBadge = ({ value }) => {
    if (!value) return <span className="text-xs text-[#98A2B3]">--</span>;
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-bold capitalize ${statusTheme(value, true)}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {value}
      </span>
    );
  };

  const columns = [
    {
      name: <div className="flex items-center gap-2"><FiHash /> Quotation ID</div>,
      cell: (row) => <span className="text-[11px] font-bold text-[#344054]">#{row?._id?.slice(-8) || "--"}</span>,
      width: "145px",
    },
    {
      name: <div className="flex items-center gap-2"><FiHash /> SR ID</div>,
      cell: (row) => <span className="font-mono text-[11px] text-[#68717F]">#{row?.serviceRequest?._id?.slice(-8) || "--"}</span>,
      width: "140px",
    },
    {
      name: "Customer",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E9F3] bg-gradient-to-br from-[#F4F6FF] to-[#F6FCFF] text-xs font-bold text-[#3A4457]">
            {row?.serviceRequest?.customer?.userName?.[0]?.toUpperCase() || "?"}
          </div>
          <p className="max-w-[100px] truncate text-[11px] font-bold text-[#20242B]">
            {row?.serviceRequest?.customer?.userName || "--"}
          </p>
          {row?.serviceRequest?.customer?.userName && (
            <div onClick={(e) => e.stopPropagation()}>
              <Link to={`/users/customer/details?userId=${row?.serviceRequest?.customer?._id}`}>
                <FaExternalLinkAlt className="text-[#9AA2AC] transition-colors hover:text-[#4F46E5]" size={10} />
              </Link>
            </div>
          )}
        </div>
      ),
      width: "210px",
    },
    {
      name: "Payment Status",
      cell: (row) => <StatusBadge value={row?.paymentInfo?.paymentStatus} />,
      width: "170px",
    },
    {
      name: "Service Mode",
      cell: (row) => (
        <span className="inline-flex items-center rounded-full px-3 py-1.5 text-[10.5px] font-bold capitalize" style={statusTheme(row?.serviceRequest?.serviceMode)}>
          {row?.serviceRequest?.serviceMode || "--"}
        </span>
      ),
      width: "140px",
    },
    {
      name: "Ticket Status",
      cell: (row) => <StatusBadge value={row?.serviceRequest?.ticketStatus} />,
      width: "170px",
    },
    {
      name: <div className="flex items-center gap-2"><FaRegCreditCard /> Payment Method</div>,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F7FF] text-[#4F46E5]">
            <FaRegCreditCard size={13} />
          </div>
          <span className="text-[11px] font-bold text-[#475467]">{row?.paymentInfo?.paymentMethod || "--"}</span>
        </div>
      ),
      width: "190px",
    },
    {
      name: "Items Qty",
      cell: (row) => {
        const qty = row?.changeParts?.map((i) => Number(i?.qty)).reduce((a, b) => a + b, 0) || 0;
        return <span className="inline-flex min-w-[34px] justify-center rounded-lg bg-[#F2F4F7] px-2 py-1 text-xs font-bold text-[#344054]">{qty || "--"}</span>;
      },
      width: "110px",
    },
    {
      name: "Items Price",
      cell: (row) => <span className="text-[11px] font-semibold text-[#59626E]">{currencyFormatter(Number(row?.subTotal) - Number(row?.serviceFee))}</span>,
      width: "140px",
    },
    {
      name: "Service Fee",
      cell: (row) => <span className="text-[11px] font-semibold text-[#59626E]">{currencyFormatter(Number(row?.serviceFee))}</span>,
      width: "120px",
    },
    {
      name: "Tax",
      cell: (row) => <span className="text-[11px] font-semibold text-[#59626E]">{currencyFormatter(Number(row?.tax))}</span>,
      width: "100px",
    },
    {
      name: <div className="flex items-center gap-2 text-[#3730A3]"><FaMoneyBillWave /> Total Price</div>,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
            <MdOutlinePayments size={17} />
          </div>
          <span className="text-xs font-extrabold text-[#3730A3]">{currencyFormatter(Number(row?.total))}</span>
        </div>
      ),
      width: "170px",
    },
    {
      name: <div className="flex items-center gap-2"><FiCalendar /> Created On</div>,
      cell: (row) => <div className="text-[10.5px] font-semibold text-[#667085]">{row?.createdAt ? moment(row.createdAt).format("DD-MMM-YYYY hh:mm A") : "--"}</div>,
      width: "190px",
    },
    {
      name: <div className="flex items-center gap-2"><FiActivity /> Updated On</div>,
      cell: (row) => <div className="text-[10.5px] font-semibold text-[#667085]">{row?.updatedAt ? moment(row.updatedAt).format("DD-MMM-YYYY hh:mm A") : "--"}</div>,
      width: "190px",
    },
  ];

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
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">Finance</span>
                </div>
                <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-[34px]">Payments</h1>
                <p className="mt-2 max-w-[520px] text-[13px] leading-6 text-white/50">Monitor revenue, payment status and quotation activity from one place.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 backdrop-blur-xl">
                  <FaWallet size={13} className="text-[#60A5FA]" />
                  <span className="text-[12px] font-bold text-white/85">{loading ? "--" : currencyFormatter(totalRevenue)} Revenue</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 backdrop-blur-xl">
                  <FaCheckCircle size={13} className="text-emerald-400" />
                  <span className="text-[12px] font-bold text-white/85">{paid} Paid</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#2563EB]/50 to-transparent" />
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((m) => <KpiCard key={m.title} {...m} />)}
          </div>
        </section>

        {/* TABLE SECTION */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0FF] text-[#2563EB]">
                <MdPayment size={15} />
              </div>
              <div>
                <h2 className="text-[16px] font-extrabold tracking-[-0.025em] text-[#111827]">Payment Collection</h2>
                <p className="mt-0.5 text-[11px] text-[#8993A5]">Review and monitor every payment transaction</p>
              </div>
            </div>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-[#A0A8B8] sm:block">{payments.length} Records</span>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-[#E8ECF5] bg-white/92 shadow-[0_18px_42px_rgba(84,98,130,0.10)] backdrop-blur-sm">
            <div className="border-b border-[#F0F2F7] bg-[linear-gradient(180deg,rgba(247,248,255,0.95),rgba(255,255,255,0.9))] px-6 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#282F3D]">Payment Logs</h3>
                  <p className="mt-1 text-xs text-[#98A1B0]">All payment transactions and quotation records</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-[#F5F7FC] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7F8897]">
                  {loading ? "Syncing" : `${currencyFormatter(totalRevenue)} Total`}
                </span>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={payments}
              progressPending={loading}
              noDataComponent={
                <div className="flex min-h-[280px] flex-col items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#F4F7FD] text-[#A0A9B8]">
                    <FaWallet size={24} />
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#69727E]">No payment records found</p>
                  <p className="mt-1 text-xs text-[#9AA2AC]">Transactions will appear here once payments are made</p>
                </div>
              }
              fixedHeader
              fixedHeaderScrollHeight="55vh"
              className={`data_table_comp ${isSidebarOpen ? "data_table_comp_sidebar_opened" : "data_table_comp_sidebar_closed"}`}
              customStyles={{
                table: { style: { backgroundColor: "transparent" } },
                headRow: { style: { backgroundColor: "#F8FAFD", minHeight: "56px", borderBottom: "1px solid #EEF2F7" } },
                headCells: { style: { fontWeight: "700", fontSize: "10px", color: "#99A3B3", textTransform: "uppercase", letterSpacing: "0.16em" } },
                rows: {
                  style: { minHeight: "68px", borderBottom: "1px solid #F2F4F8", backgroundColor: "#FFFFFF", transition: "background-color 0.15s ease" },
                  highlightOnHoverStyle: { backgroundColor: "#FAFBFF", borderBottomColor: "#EEF2F7", outlineStyle: "none", cursor: "pointer" },
                },
                cells: { style: { fontSize: "11.5px", paddingLeft: "16px", paddingRight: "16px" } },
                progress: { style: { backgroundColor: "#FFFFFF", color: "#6B7280", padding: "24px 0" } },
              }}
            />

            <div className="border-t border-[#F0F2F7] px-4 py-3">
              <Pagination
                totalPages={totalPages}
                activePage={activePage}
                limit={limit}
                setPageValue={(p) => { setActivePage(p); getPaymentLogs(p, limit); }}
                setLimit={(l) => { setLimit(l); setActivePage(1); getPaymentLogs(1, l); }}
              />
            </div>
          </div>
        </section>
      </div>
    </AnimatedContent>
  );
};

export default PaymentLogs;

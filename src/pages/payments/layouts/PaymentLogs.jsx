import Pagination from "@/components/common/Pagination";
import AnimatedContent from "@/components/common/AnimatedContent";
import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useEffect, useState } from "react";
import { FaWallet, FaCheckCircle, FaClock, FaTimesCircle, FaExternalLinkAlt } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { statusTheme } from "@/utils/getStatusTheme";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import { currencyFormatter } from "@/utils/currencyFormatter";

const tones = {
  slate:   { icon: "bg-slate-600",   soft: "bg-slate-50",   line: "bg-slate-600" },
  emerald: { icon: "bg-emerald-500", soft: "bg-emerald-50", line: "bg-emerald-500" },
  amber:   { icon: "bg-amber-500",   soft: "bg-amber-50",   line: "bg-amber-500" },
  rose:    { icon: "bg-rose-500",    soft: "bg-rose-50",    line: "bg-rose-500" },
};

const KpiCard = ({ title, value, desc, tone, Icon, loading }) => {
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
          <h3 className="text-[24px] font-extrabold leading-none tracking-tight text-[#22272F]">{loading ? "—" : value}</h3>
          <span className="text-right text-[10px] font-medium text-[#A2A9B3]">{desc}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-5 right-5 z-20 h-[3px] overflow-hidden rounded-full bg-[#F0F2F5]">
        <div className={`h-full w-0 ${t.line} rounded-full transition-all duration-500 group-hover:w-full`} />
      </div>
    </div>
  );
};

const PaymentLogs = () => {
  const [payments, setPayments] = useState([]);
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
          setTotalPages(d?.data?.totalPages);
          setPayments(d?.data?.payments || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { getPaymentLogs(activePage, limit); }, []);

  const totalRevenue = payments.reduce((s, p) => s + Number(p?.total || 0), 0);
  const paid    = payments.filter((p) => ["paid", "payment_success", "completed"].includes(p?.paymentInfo?.paymentStatus?.toLowerCase())).length;
  const pending = payments.filter((p) => ["pending", "payment_pending", "payment_initiate_pending"].includes(p?.paymentInfo?.paymentStatus?.toLowerCase())).length;
  const failed  = payments.filter((p) => ["failed", "payment_declined", "timed_out"].includes(p?.paymentInfo?.paymentStatus?.toLowerCase())).length;

  const metrics = [
    { title: "Total Revenue", value: currencyFormatter(totalRevenue), desc: "All transactions",    tone: "slate",   Icon: FaWallet },
    { title: "Paid",          value: paid,                            desc: "Successful payments", tone: "emerald", Icon: FaCheckCircle },
    { title: "Pending",       value: pending,                         desc: "Awaiting payment",    tone: "amber",   Icon: FaClock },
    { title: "Failed",        value: failed,                          desc: "Failed transactions", tone: "rose",    Icon: FaTimesCircle },
  ];

  const columns = [
    {
      name: "Quotation ID",
      cell: (row) => <span className="font-bold text-[#20242B] text-xs">#{row?._id?.slice(-8) || "--"}</span>,
      width: "130px",
    },
    {
      name: "SR ID",
      cell: (row) => <span className="text-[11px] text-[#68717F] font-mono">#{row?.serviceRequest?._id?.slice(-8) || "--"}</span>,
      width: "120px",
    },
    {
      name: "Customer",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4F6F8] border border-[#E4E8ED] text-[#20242B] font-bold text-xs">
            {row?.serviceRequest?.customer?.userName?.[0]?.toUpperCase() || "?"}
          </div>
          <p className="text-[11px] font-bold text-[#20242B] truncate max-w-[100px]">{row?.serviceRequest?.customer?.userName || "--"}</p>
          {row?.serviceRequest?.customer?.userName && (
            <div onClick={(e) => e.stopPropagation()}>
              <Link to={`/users/customer/details?userId=${row?.serviceRequest?.customer?._id}`}>
                <FaExternalLinkAlt className="text-[#9AA2AC] hover:text-[#20242B]" size={10} />
              </Link>
            </div>
          )}
        </div>
      ),
      width: "190px",
    },
    {
      name: "Payment Status",
      cell: (row) => (
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${row?.paymentInfo?.paymentStatus ? statusTheme(row?.paymentInfo?.paymentStatus, true) : ""}`}>
          {row?.paymentInfo?.paymentStatus || "--"}
        </span>
      ),
      width: "160px",
    },
    {
      name: "Service Mode",
      cell: (row) => (
        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold capitalize"
          style={row?.serviceRequest?.serviceMode ? statusTheme(row?.serviceRequest?.serviceMode) : {}}>
          {row?.serviceRequest?.serviceMode || "--"}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Ticket Status",
      cell: (row) => (
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${row?.serviceRequest?.ticketStatus ? statusTheme(row?.serviceRequest?.ticketStatus, true) : ""}`}>
          {row?.serviceRequest?.ticketStatus || "--"}
        </span>
      ),
      width: "150px",
    },
    {
      name: "Method",
      cell: (row) => (
        <span className="inline-flex rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] px-2.5 py-1 text-[10px] font-bold text-[#59626E] capitalize">
          {row?.paymentInfo?.paymentMethod || "--"}
        </span>
      ),
      width: "110px",
    },
    {
      name: "Items",
      cell: (row) => <span className="text-[11px] font-semibold text-[#59626E]">{currencyFormatter(Number(row?.subTotal) - Number(row?.serviceFee))}</span>,
      width: "100px",
    },
    {
      name: "Service Fee",
      cell: (row) => <span className="text-[11px] font-semibold text-[#59626E]">{currencyFormatter(Number(row?.serviceFee))}</span>,
      width: "110px",
    },
    {
      name: "Tax",
      cell: (row) => <span className="text-[11px] font-semibold text-[#59626E]">{currencyFormatter(Number(row?.tax))}</span>,
      width: "90px",
    },
    {
      name: "Total",
      cell: (row) => <span className="text-[12px] font-extrabold text-[#20242B]">{currencyFormatter(Number(row?.total))}</span>,
      width: "110px",
    },
    {
      name: "Date",
      cell: (row) => <span className="text-[11px] text-[#9AA2AC]">{moment(row?.createdAt).format("DD MMM YYYY")}</span>,
      width: "110px",
    },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#F4F6F8] pb-10">

        {/* HEADER */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#20242B] shadow-[0_0_0_5px_rgba(0,0,0,0.06)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#89919D]">Finance</span>
            </div>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">Payments</h1>
            <p className="mt-2 text-sm leading-6 text-[#7C8592]">Track all payment transactions and revenue</p>
          </div>
          <span className="rounded-full bg-[#F4F6F8] border border-[#E4E8ED] px-3 py-1.5 text-[10px] font-bold text-[#68717F]">{payments.length} records</span>
        </div>

        {/* KPI CARDS */}
        <section className="mb-7">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metrics.map((m) => <KpiCard key={m.title} {...m} loading={loading} />)}
          </div>
        </section>

        {/* TABLE */}
        <section>
          <div className="overflow-hidden rounded-[22px] border border-[#E4E8ED] bg-white shadow-[0_3px_12px_rgba(30,40,55,0.035)]">
            <div className="flex items-center justify-between border-b border-[#F0F2F5] px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-[#282D35]">Payment Logs</h2>
                <p className="mt-0.5 text-xs text-[#929AA5]">All payment transactions and quotation records</p>
              </div>
              <span className="rounded-full bg-[#F4F6F8] border border-[#E4E8ED] px-3 py-1 text-[10px] font-bold text-[#68717F]">{currencyFormatter(totalRevenue)} total</span>
            </div>
            <DataTable
              columns={columns}
              data={payments}
              progressPending={loading}
              noDataComponent={
                <div className="w-full py-16 flex flex-col items-center justify-center">
                  <div className="h-14 w-14 rounded-2xl bg-[#F4F6F8] flex items-center justify-center mb-3">
                    <FaWallet size={22} className="text-[#A0A7B0]" />
                  </div>
                  <p className="font-bold text-sm text-[#59626E]">No payment records found</p>
                  <p className="text-xs text-[#9AA2AC] mt-1">Transactions will appear here once payments are made</p>
                </div>
              }
              fixedHeader
              fixedHeaderScrollHeight="55vh"
              className="data_table_comp"
              customStyles={{
                headRow: { style: { backgroundColor: "#20242B" } },
                headCells: { style: { fontWeight: "700", fontSize: "10px", color: "#9AA2AC", textTransform: "uppercase", letterSpacing: "0.08em" } },
                rows: { style: { minHeight: "64px", borderBottom: "1px solid #F4F6F8", transition: "background-color 0.15s ease" }, highlightOnHoverStyle: { backgroundColor: "#F9FAFB", borderBottomColor: "#F0F2F5", outlineStyle: "none" } },
                cells: { style: { fontSize: "11.5px", paddingLeft: "16px", paddingRight: "16px" } },
              }}
            />
            <div className="border-t border-[#F0F2F5] px-4 py-3">
              <Pagination totalPages={totalPages} activePage={activePage} limit={limit}
                setPageValue={(p) => { setActivePage(p); getPaymentLogs(p, limit); }}
                setLimit={(l) => { setLimit(l); setActivePage(1); getPaymentLogs(1, l); }} />
            </div>
          </div>
        </section>

      </div>
    </AnimatedContent>
  );
};

export default PaymentLogs;

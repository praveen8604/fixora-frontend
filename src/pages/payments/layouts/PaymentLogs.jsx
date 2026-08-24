import Pagination from "@/components/common/Pagination";
import AnimatedContent from "@/components/common/AnimatedContent";
import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useContext, useEffect, useState } from "react";
import { FaExternalLinkAlt, FaWallet, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { statusTheme } from "@/utils/getStatusTheme";
import { SidebarContext } from "@/context/SidebarContext";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import { currencyFormatter } from "@/utils/currencyFormatter";

const PaymentLogs = () => {
  const [payments, setPayments] = useState([]);
  const { isSidebarOpen } = useContext(SidebarContext);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const getPaymentLogs = (selectedPage, dataLimit) => {
    setLoading(true);
    DashboardServices.getPaymentLogs(selectedPage, dataLimit)
      .then((res) => {
        if (res) {
          const decodedata = DecryptData(res);
          setTotalPages(decodedata?.data?.totalPages);
          setPayments(decodedata?.data?.payments || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { getPaymentLogs(activePage, limit); }, []);

  const totalRevenue = payments.reduce((s, p) => s + Number(p?.total || 0), 0);
  const paid    = payments.filter((p) => p?.paymentInfo?.paymentStatus?.toLowerCase() === "paid").length;
  const pending = payments.filter((p) => p?.paymentInfo?.paymentStatus?.toLowerCase() === "pending").length;
  const failed  = payments.filter((p) => p?.paymentInfo?.paymentStatus?.toLowerCase() === "failed").length;

  const metrics = [
    { title: "Total Revenue", value: currencyFormatter(totalRevenue), desc: "All transactions",   tone: "blue",    Icon: FaWallet },
    { title: "Paid",          value: paid,                            desc: "Successful payments", tone: "emerald", Icon: FaCheckCircle },
    { title: "Pending",       value: pending,                         desc: "Awaiting payment",    tone: "amber",   Icon: FaClock },
    { title: "Failed",        value: failed,                          desc: "Failed transactions", tone: "rose",    Icon: FaTimesCircle },
  ];

  const toneClasses = {
    blue:    { icon: "bg-blue-500",    soft: "bg-blue-50",    line: "bg-blue-500" },
    emerald: { icon: "bg-emerald-500", soft: "bg-emerald-50", line: "bg-emerald-500" },
    amber:   { icon: "bg-amber-500",   soft: "bg-amber-50",   line: "bg-amber-500" },
    rose:    { icon: "bg-rose-500",    soft: "bg-rose-50",    line: "bg-rose-500" },
  };

  const columns = [
    {
      name: "Quotation Id",
      cell: (row) => <span className="text-xs font-medium text-[#20242B]">{row?._id}</span>,
      width: "150px",
    },
    {
      name: "SR Id",
      cell: (row) => <span className="text-xs text-[#68717F]">{row?.serviceRequest?._id || "--"}</span>,
      width: "150px",
    },
    {
      name: "Customer",
      cell: (row) => (
        <div className="flex items-center gap-2 text-xs font-medium text-[#20242B]">
          {row?.serviceRequest?.customer?.userName || "--"}
          {row?.serviceRequest?.customer?.userName && (
            <div onClick={(e) => e.stopPropagation()}>
              <Link to={`/users/customer/details?userId=${row?.serviceRequest?.customer?._id}`}>
                <FaExternalLinkAlt className="text-[#68717F] hover:text-[#20242B]" size={11} />
              </Link>
            </div>
          )}
        </div>
      ),
      width: "180px",
    },
    {
      name: "Payment Status",
      cell: (row) => (
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${row?.paymentInfo?.paymentStatus && statusTheme(row?.paymentInfo?.paymentStatus, true)}`}>
          {row?.paymentInfo?.paymentStatus || "--"}
        </span>
      ),
      width: "150px",
    },
    {
      name: "Service Mode",
      cell: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize ${row?.serviceRequest?.serviceMode ? "text-[var(--primary-color)]" : ""}`}
          style={row?.serviceRequest?.serviceMode ? statusTheme(row?.serviceRequest?.serviceMode) : {}}
        >
          {row?.serviceRequest?.serviceMode || "--"}
        </span>
      ),
      width: "130px",
    },
    {
      name: "Ticket Status",
      cell: (row) => (
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${row?.serviceRequest?.ticketStatus && statusTheme(row?.serviceRequest?.ticketStatus, true)}`}>
          {row?.serviceRequest?.ticketStatus || "--"}
        </span>
      ),
      width: "140px",
    },
    {
      name: "Method",
      cell: (row) => <span className="text-xs text-[#68717F]">{row?.paymentInfo?.paymentMethod || "--"}</span>,
      width: "120px",
    },
    {
      name: "Items Price",
      cell: (row) => <span className="text-xs font-semibold text-[#20242B]">{currencyFormatter(Number(row?.subTotal) - Number(row?.serviceFee))}</span>,
      width: "120px",
    },
    {
      name: "Service Fee",
      cell: (row) => <span className="text-xs font-semibold text-[#20242B]">{currencyFormatter(Number(row?.serviceFee))}</span>,
      width: "110px",
    },
    {
      name: "Tax",
      cell: (row) => <span className="text-xs font-semibold text-[#20242B]">{currencyFormatter(Number(row?.tax))}</span>,
      width: "90px",
    },
    {
      name: "Total",
      cell: (row) => <span className="text-xs font-bold text-emerald-600">{currencyFormatter(Number(row?.total))}</span>,
      width: "110px",
    },
    {
      name: "Created On",
      cell: (row) => <span className="text-xs text-[#68717F]">{moment(row?.createdAt).format("DD MMM YYYY")}</span>,
      width: "120px",
    },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#F4F6F8] pb-10">

        {/* PAGE HEADER */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--primary-color)] shadow-[0_0_0_5px_rgba(0,0,0,0.04)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#89919D]">Finance</span>
            </div>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">Payments</h1>
            <p className="mt-2 text-sm leading-6 text-[#7C8592]">Track all payment transactions and revenue</p>
          </div>
          <div className="flex items-center rounded-2xl border border-[#E4E8ED] bg-white px-4 py-3 shadow-[0_3px_12px_rgba(30,40,55,0.04)]">
            <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF]">
              <MdPayment className="text-[17px] text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA1AC]">Total Records</p>
              <p className="mt-0.5 text-xs font-bold text-[#414853]">{payments.length} payments loaded</p>
            </div>
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
                      <h3 className="text-[24px] font-extrabold leading-none tracking-tight text-[#22272F]">{loading ? "—" : item.value}</h3>
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
                <h2 className="text-base font-bold text-[#282D35]">Payment Logs</h2>
                <p className="mt-0.5 text-xs text-[#929AA5]">All payment transactions</p>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={payments}
              progressPending={loading}
              noDataComponent={
                <div className="flex h-24 items-center justify-center text-sm font-semibold text-[#8B94A0]">
                  No payment records found
                </div>
              }
              fixedHeader
              fixedHeaderScrollHeight="55vh"
              className="data_table_comp"
              customStyles={{
                headRow: { style: { backgroundColor: "#20242B" } },
                headCells: { style: { fontWeight: "700", fontSize: "11px", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" } },
                cells: { style: { fontSize: "12px", height: "60px", borderBottom: "1px solid #F4F6F8" } },
              }}
            />
            <div className="border-t border-[#F0F2F5] px-4 py-3">
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

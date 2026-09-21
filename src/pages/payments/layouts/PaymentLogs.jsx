// import React, { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import moment from "moment";
// import DataTable from "react-data-table-component";

// import AnimatedContent from "@/components/common/AnimatedContent";
// import Pagination from "@/components/common/Pagination";

// import DashboardServices from "@/services/DashboardServices";
// import { DecryptData } from "@/utils/DecryptData";
// import { currencyFormatter } from "@/utils/currencyFormatter";
// import { statusTheme } from "@/utils/getStatusTheme";

// import { SidebarContext } from "@/context/SidebarContext";

// import {
//   FaWallet,
//   FaCheckCircle,
//   FaClock,
//   FaTimesCircle,
//   FaExternalLinkAlt,
//   FaRegCreditCard,
//   FaMoneyBillWave,
// } from "react-icons/fa";

// import { MdPayment, MdOutlinePayments } from "react-icons/md";

// import {
//   FiActivity,
//   FiCalendar,
//   FiHash,
//   FiArrowUpRight,
// } from "react-icons/fi";

// const tones = {
//   slate: {
//     soft: "from-[#F8FAFC] to-[#F1F5F9]",
//     line: "from-[#475569] to-[#94A3B8]",
//   },
//   emerald: {
//     soft: "from-[#ECFDF5] to-[#F0FDFA]",
//     line: "from-[#10B981] to-[#59D6BF]",
//   },
//   amber: {
//     soft: "from-[#F8FAFC] to-[#F1F5F9]",
//     line: "from-[#94A3B8] to-[#E2E8F0]",
//   },
//   rose: {
//     soft: "from-[#FFF1F3] to-[#FFF5F7]",
//     line: "from-[#F43F5E] to-[#FB7185]",
//   },
// };

// const KpiCard = ({ title, value, desc, tone, Icon }) => {
//   const t = tones[tone];
//   return (
//     <div className="group relative overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0_6px_25px_rgba(173,139,115,0.08)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#94A3B8] hover:shadow-[0_22px_45px_rgba(173,139,115,0.15)]">
//       <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${t.soft} opacity-70 transition-all duration-500 group-hover:scale-[1.7]`} />
//       <div className="relative z-10 flex items-start justify-between">
//         <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br ${t.soft} text-[#475569] transition-all duration-300 group-hover:scale-110`}>
//           <Icon size={18} />
//         </div>
//         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8FAFC] text-[#94A3B8] transition-all duration-300 group-hover:bg-[#475569] group-hover:text-white">
//           <FiArrowUpRight size={14} />
//         </div>
//       </div>
//       <div className="relative z-10 mt-5">
//         <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#475569]">{title}</p>
//         <div className="mt-2.5 flex items-end justify-between gap-2">
//           <h3 className="text-[30px] font-extrabold leading-none tracking-[-0.05em] text-[#0F172A]">{value}</h3>
//           <span className="mb-0.5 max-w-[105px] text-right text-[9px] font-medium leading-4 text-[#94A3B8]">{desc}</span>
//         </div>
//       </div>
//       <div className="absolute bottom-0 left-5 right-5 h-[2px] overflow-hidden rounded-full bg-[#E2E8F0]">
//         <div className={`h-full w-0 rounded-full bg-gradient-to-r ${t.line} transition-all duration-500 group-hover:w-full`} />
//       </div>
//     </div>
//   );
// };

// const PaymentLogs = () => {
//   const [payments, setPayments] = useState([]);
//   const { isSidebarOpen } = useContext(SidebarContext);
//   const [activePage, setActivePage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const getPaymentLogs = (page, lim) => {
//     setLoading(true);
//     DashboardServices.getPaymentLogs(page, lim)
//       .then((res) => {
//         if (res) {
//           const d = DecryptData(res);
//           setTotalPages(d?.data?.totalPages || 0);
//           setPayments(d?.data?.payments || []);
//         }
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     getPaymentLogs(activePage, limit);
//   }, []);

//   const totalRevenue = payments.reduce((sum, p) => sum + Number(p?.total || 0), 0);

//   const paid = payments.filter((p) =>
//     ["paid", "payment_success", "completed", "success"].includes(
//       p?.paymentInfo?.paymentStatus?.toLowerCase()
//     )
//   ).length;

//   const pending = payments.filter((p) =>
//     ["pending", "payment_pending", "payment_initiate_pending", "processing"].includes(
//       p?.paymentInfo?.paymentStatus?.toLowerCase()
//     )
//   ).length;

//   const failed = payments.filter((p) =>
//     ["failed", "payment_declined", "timed_out", "cancelled", "canceled"].includes(
//       p?.paymentInfo?.paymentStatus?.toLowerCase()
//     )
//   ).length;

//   const metrics = [
//     { title: "Total Revenue", value: currencyFormatter(totalRevenue), desc: "All transactions", tone: "slate", Icon: FaWallet },
//     { title: "Paid", value: paid, desc: "Successful payments", tone: "emerald", Icon: FaCheckCircle },
//     { title: "Pending", value: pending, desc: "Awaiting payment", tone: "amber", Icon: FaClock },
//     { title: "Failed", value: failed, desc: "Failed transactions", tone: "rose", Icon: FaTimesCircle },
//   ];

//   const StatusBadge = ({ value }) => {
//     if (!value) return <span className="text-xs text-[#94A3B8]">--</span>;
//     return (
//       <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-bold capitalize ${statusTheme(value, true)}`}>
//         <span className="h-1.5 w-1.5 rounded-full bg-current" />
//         {value}
//       </span>
//     );
//   };

//   const columns = [
//     {
//       name: <div className="flex items-center gap-2"><FiHash /> Quotation ID</div>,
//       cell: (row) => <span className="text-[11px] font-bold text-[#0F172A]">#{row?._id?.slice(-8) || "--"}</span>,
//       width: "145px",
//     },
//     {
//       name: <div className="flex items-center gap-2"><FiHash /> SR ID</div>,
//       cell: (row) => <span className="font-mono text-[11px] text-[#334155]">#{row?.serviceRequest?._id?.slice(-8) || "--"}</span>,
//       width: "140px",
//     },
//     {
//       name: "Customer",
//       cell: (row) => (
//         <div className="flex items-center gap-2">
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] text-xs font-bold text-[#475569]">
//             {row?.serviceRequest?.customer?.userName?.[0]?.toUpperCase() || "?"}
//           </div>
//           <p className="max-w-[100px] truncate text-[11px] font-bold text-[#0F172A]">
//             {row?.serviceRequest?.customer?.userName || "--"}
//           </p>
//           {row?.serviceRequest?.customer?.userName && (
//             <div onClick={(e) => e.stopPropagation()}>
//               <Link to={`/users/customer/details?userId=${row?.serviceRequest?.customer?._id}`}>
//                 <FaExternalLinkAlt className="text-[#94A3B8] transition-colors hover:text-[#475569]" size={10} />
//               </Link>
//             </div>
//           )}
//         </div>
//       ),
//       width: "210px",
//     },
//     {
//       name: "Payment Status",
//       cell: (row) => <StatusBadge value={row?.paymentInfo?.paymentStatus} />,
//       width: "170px",
//     },
//     {
//       name: "Service Mode",
//       cell: (row) => (
//         <span className="inline-flex items-center rounded-full px-3 py-1.5 text-[10.5px] font-bold capitalize" style={statusTheme(row?.serviceRequest?.serviceMode)}>
//           {row?.serviceRequest?.serviceMode || "--"}
//         </span>
//       ),
//       width: "140px",
//     },
//     {
//       name: "Ticket Status",
//       cell: (row) => <StatusBadge value={row?.serviceRequest?.ticketStatus} />,
//       width: "170px",
//     },
//     {
//       name: <div className="flex items-center gap-2"><FaRegCreditCard /> Payment Method</div>,
//       cell: (row) => (
//         <div className="flex items-center gap-2">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#475569]">
//             <FaRegCreditCard size={13} />
//           </div>
//           <span className="text-[11px] font-bold text-[#334155]">{row?.paymentInfo?.paymentMethod || "--"}</span>
//         </div>
//       ),
//       width: "190px",
//     },
//     {
//       name: "Items Qty",
//       cell: (row) => {
//         const qty = row?.changeParts?.map((i) => Number(i?.qty)).reduce((a, b) => a + b, 0) || 0;
//         return <span className="inline-flex min-w-[34px] justify-center rounded-lg bg-[#F8FAFC] px-2 py-1 text-xs font-bold text-[#475569]">{qty || "--"}</span>;
//       },
//       width: "110px",
//     },
//     {
//       name: "Items Price",
//       cell: (row) => <span className="text-[11px] font-semibold text-[#334155]">{currencyFormatter(Number(row?.subTotal) - Number(row?.serviceFee))}</span>,
//       width: "140px",
//     },
//     {
//       name: "Service Fee",
//       cell: (row) => <span className="text-[11px] font-semibold text-[#334155]">{currencyFormatter(Number(row?.serviceFee))}</span>,
//       width: "120px",
//     },
//     {
//       name: "Tax",
//       cell: (row) => <span className="text-[11px] font-semibold text-[#334155]">{currencyFormatter(Number(row?.tax))}</span>,
//       width: "100px",
//     },
//     {
//       name: <div className="flex items-center gap-2 text-[#475569]"><FaMoneyBillWave /> Total Price</div>,
//       cell: (row) => (
//         <div className="flex items-center gap-2">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#475569]">
//             <MdOutlinePayments size={17} />
//           </div>
//           <span className="text-xs font-extrabold text-[#475569]">{currencyFormatter(Number(row?.total))}</span>
//         </div>
//       ),
//       width: "170px",
//     },
//     {
//       name: <div className="flex items-center gap-2"><FiCalendar /> Created On</div>,
//       cell: (row) => <div className="text-[10.5px] font-semibold text-[#334155]">{row?.createdAt ? moment(row.createdAt).format("DD-MMM-YYYY hh:mm A") : "--"}</div>,
//       width: "190px",
//     },
//     {
//       name: <div className="flex items-center gap-2"><FiActivity /> Updated On</div>,
//       cell: (row) => <div className="text-[10.5px] font-semibold text-[#334155]">{row?.updatedAt ? moment(row.updatedAt).format("DD-MMM-YYYY hh:mm A") : "--"}</div>,
//       width: "190px",
//     },
//   ];

//   return (
//     <AnimatedContent>
//       <div className="min-h-screen bg-[#F8FAFC] pb-10">

//         {/* HERO BANNER */}
//         <section className="mb-8">
//           <div className="relative overflow-hidden rounded-[30px] bg-[#0F172A] px-6 py-7 shadow-[0_20px_55px_rgba(61,44,30,0.25)] sm:px-8 sm:py-9">
//             <div className="pointer-events-none absolute -right-24 -top-28 h-[340px] w-[340px] rounded-full bg-[#475569]/25 blur-[2px]" />
//             <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:34px_34px]" />
//             <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//               <div>
//                 <div className="mb-3 flex items-center gap-2.5">
//                   <span className="relative flex h-2.5 w-2.5">
//                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E2E8F0]/60" />
//                     <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
//                   </span>
//                   <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">Finance</span>
//                 </div>
//                 <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-[34px]">Payments</h1>
//                 <p className="mt-2 max-w-[520px] text-[13px] leading-6 text-white/50">Monitor revenue, payment status and quotation activity from one place.</p>
//               </div>
//               <div className="flex flex-wrap items-center gap-3">
//                 <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 backdrop-blur-xl">
//                   <FaWallet size={13} className="text-[#E2E8F0]" />
//                   <span className="text-[12px] font-bold text-white/85">{loading ? "--" : currencyFormatter(totalRevenue)} Revenue</span>
//                 </div>
//                 <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 backdrop-blur-xl">
//                   <FaCheckCircle size={13} className="text-emerald-400" />
//                   <span className="text-[12px] font-bold text-white/85">{paid} Paid</span>
//                 </div>
//               </div>
//             </div>
//             <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#475569]/60 to-transparent" />
//           </div>
//         </section>

//         {/* KPI CARDS */}
//         <section className="mb-8">
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             {metrics.map((m) => <KpiCard key={m.title} {...m} />)}
//           </div>
//         </section>

//         {/* TABLE SECTION */}
//         <section>
//           <div className="mb-5 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#475569]">
//                 <MdPayment size={15} />
//               </div>
//               <div>
//                 <h2 className="text-[16px] font-extrabold tracking-[-0.025em] text-[#0F172A]">Payment Collection</h2>
//                 <p className="mt-0.5 text-[11px] text-[#475569]">Review and monitor every payment transaction</p>
//               </div>
//             </div>
//             <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-[#94A3B8] sm:block">{payments.length} Records</span>
//           </div>

//           <div className="overflow-hidden rounded-[30px] border border-[#E2E8F0] bg-white/95 shadow-[0_18px_42px_rgba(173,139,115,0.12)] backdrop-blur-sm">
//             <div className="border-b border-[#E2E8F0] bg-[linear-gradient(180deg,rgba(255,251,233,0.95),rgba(255,255,255,0.9))] px-6 py-5">
//               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <h3 className="text-base font-bold text-[#0F172A]">Payment Logs</h3>
//                   <p className="mt-1 text-xs text-[#94A3B8]">All payment transactions and quotation records</p>
//                 </div>
//                 <span className="inline-flex w-fit items-center rounded-full bg-[#F8FAFC] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#475569]">
//                   {loading ? "Syncing" : `${currencyFormatter(totalRevenue)} Total`}
//                 </span>
//               </div>
//             </div>

//             <DataTable
//               columns={columns}
//               data={payments}
//               progressPending={loading}
//               noDataComponent={
//                 <div className="flex min-h-[280px] flex-col items-center justify-center">
//                   <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#F8FAFC] text-[#94A3B8]">
//                     <FaWallet size={24} />
//                   </div>
//                   <p className="mt-4 text-sm font-bold text-[#475569]">No payment records found</p>
//                   <p className="mt-1 text-xs text-[#94A3B8]">Transactions will appear here once payments are made</p>
//                 </div>
//               }
//               fixedHeader
//               fixedHeaderScrollHeight="55vh"
//               className={`data_table_comp ${isSidebarOpen ? "data_table_comp_sidebar_opened" : "data_table_comp_sidebar_closed"}`}
//               customStyles={{
//                 table: { style: { backgroundColor: "transparent" } },
//                 headRow: { style: { backgroundColor: "#F8FAFC", minHeight: "56px", borderBottom: "1px solid #E2E8F0" } },
//                 headCells: { style: { fontWeight: "700", fontSize: "10px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.16em" } },
//                 rows: {
//                   style: { minHeight: "68px", borderBottom: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", transition: "background-color 0.15s ease" },
//                   highlightOnHoverStyle: { backgroundColor: "#F8FAFC", borderBottomColor: "#E2E8F0", outlineStyle: "none", cursor: "pointer" },
//                 },
//                 cells: { style: { fontSize: "11.5px", paddingLeft: "16px", paddingRight: "16px" } },
//                 progress: { style: { backgroundColor: "#FFFFFF", color: "#475569", padding: "24px 0" } },
//               }}
//             />

//             <div className="border-t border-[#E2E8F0]/50 px-4 py-3">
//               <Pagination
//                 totalPages={totalPages}
//                 activePage={activePage}
//                 limit={limit}
//                 setPageValue={(p) => { setActivePage(p); getPaymentLogs(p, limit); }}
//                 setLimit={(l) => { setLimit(l); setActivePage(1); getPaymentLogs(1, l); }}
//               />
//             </div>
//           </div>
//         </section>
//       </div>
//     </AnimatedContent>
//   );
// };

// export default PaymentLogs;
























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

/* ============================================================
   KPI CARD
============================================================ */

const KpiCard = ({ title, value, desc, tone, Icon }) => {
  const toneClasses = {
    slate: {
      soft: "bg-background",
      icon: "text-primary",
      line: "bg-primary",
    },

    emerald: {
      soft: "bg-accent",
      icon: "text-primary",
      line: "bg-secondary",
    },

    amber: {
      soft: "bg-background",
      icon: "text-secondary",
      line: "bg-accent",
    },

    rose: {
      soft: "bg-background",
      icon: "text-primary",
      line: "bg-secondary",
    },
  };

  const t = toneClasses[tone] || toneClasses.slate;

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-accent
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1.5
        hover:border-secondary
        hover:shadow-md
      "
    >
      {/* DECORATIVE BACKGROUND */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-32
          w-32
          rounded-full
          ${t.soft}
          opacity-70
          transition-all
          duration-500
          group-hover:scale-[1.7]
        `}
      />

      {/* TOP */}

      <div className="relative z-10 flex items-start justify-between">
        {/* ICON */}

        <div
          className={`
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-[14px]
            ${t.soft}
            ${t.icon}
            transition-all
            duration-300
            group-hover:scale-110
          `}
        >
          <Icon size={18} />
        </div>

        {/* ARROW */}

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-background
            text-secondary
            transition-all
            duration-300
            group-hover:bg-primary
            group-hover:text-white
          "
        >
          <FiArrowUpRight size={14} />
        </div>
      </div>

      {/* CONTENT */}

      <div className="relative z-10 mt-5">
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-primary
          "
        >
          {title}
        </p>

        <div className="mt-2.5 flex items-end justify-between gap-2">
          <h3
            className="
              text-[30px]
              font-extrabold
              leading-none
              tracking-[-0.05em]
              text-primary
            "
          >
            {value}
          </h3>

          <span
            className="
              mb-0.5
              max-w-[105px]
              text-right
              text-[9px]
              font-medium
              leading-4
              text-secondary
            "
          >
            {desc}
          </span>
        </div>
      </div>

      {/* BOTTOM ACCENT */}

      <div
        className="
          absolute
          bottom-0
          left-5
          right-5
          h-[2px]
          overflow-hidden
          rounded-full
          bg-accent
        "
      >
        <div
          className={`
            h-full
            w-0
            rounded-full
            ${t.line}
            transition-all
            duration-500
            group-hover:w-full
          `}
        />
      </div>
    </div>
  );
};

/* ============================================================
   PAYMENT LOGS
============================================================ */

const PaymentLogs = () => {
  const [payments, setPayments] = useState([]);

  const { isSidebarOpen } = useContext(SidebarContext);

  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     GET PAYMENT LOGS
  ========================================================= */

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

  /* =========================================================
     INITIAL FETCH
  ========================================================= */

  useEffect(() => {
    getPaymentLogs(activePage, limit);
  }, []);

  /* =========================================================
     PAYMENT METRICS
  ========================================================= */

  const totalRevenue = payments.reduce(
    (sum, p) => sum + Number(p?.total || 0),
    0
  );

  const paid = payments.filter((p) =>
    [
      "paid",
      "payment_success",
      "completed",
      "success",
    ].includes(
      p?.paymentInfo?.paymentStatus?.toLowerCase()
    )
  ).length;

  const pending = payments.filter((p) =>
    [
      "pending",
      "payment_pending",
      "payment_initiate_pending",
      "processing",
    ].includes(
      p?.paymentInfo?.paymentStatus?.toLowerCase()
    )
  ).length;

  const failed = payments.filter((p) =>
    [
      "failed",
      "payment_declined",
      "timed_out",
      "cancelled",
      "canceled",
    ].includes(
      p?.paymentInfo?.paymentStatus?.toLowerCase()
    )
  ).length;

  /* =========================================================
     METRICS
  ========================================================= */

  const metrics = [
    {
      title: "Total Revenue",
      value: currencyFormatter(totalRevenue),
      desc: "All transactions",
      tone: "slate",
      Icon: FaWallet,
    },
    {
      title: "Paid",
      value: paid,
      desc: "Successful payments",
      tone: "emerald",
      Icon: FaCheckCircle,
    },
    {
      title: "Pending",
      value: pending,
      desc: "Awaiting payment",
      tone: "amber",
      Icon: FaClock,
    },
    {
      title: "Failed",
      value: failed,
      desc: "Failed transactions",
      tone: "rose",
      Icon: FaTimesCircle,
    },
  ];

  /* =========================================================
     STATUS BADGE
  ========================================================= */

  const StatusBadge = ({ value }) => {
    if (!value) {
      return (
        <span className="text-xs text-secondary">
          --
        </span>
      );
    }

    return (
      <span
        className={`
          inline-flex
          items-center
          gap-1.5
          rounded-full
          px-3
          py-1.5
          text-[10.5px]
          font-bold
          capitalize
          ${statusTheme(value, true)}
        `}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />

        {value}
      </span>
    );
  };

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

  const columns = [
    {
      name: (
        <div className="flex items-center gap-2">
          <FiHash />
          Quotation ID
        </div>
      ),

      cell: (row) => (
        <span className="text-[11px] font-bold text-primary">
          #{row?._id?.slice(-8) || "--"}
        </span>
      ),

      width: "145px",
    },

    {
      name: (
        <div className="flex items-center gap-2">
          <FiHash />
          SR ID
        </div>
      ),

      cell: (row) => (
        <span
          className="
            font-mono
            text-[11px]
            text-secondary
          "
        >
          #{row?.serviceRequest?._id?.slice(-8) || "--"}
        </span>
      ),

      width: "140px",
    },

    {
      name: "Customer",

      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* CUSTOMER AVATAR */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-accent
              bg-background
              text-xs
              font-bold
              text-primary
            "
          >
            {row?.serviceRequest?.customer?.userName?.[0]?.toUpperCase() ||
              "?"}
          </div>

          {/* CUSTOMER NAME */}

          <p
            className="
              max-w-[100px]
              truncate
              text-[11px]
              font-bold
              text-primary
            "
          >
            {row?.serviceRequest?.customer?.userName ||
              "--"}
          </p>

          {/* DETAILS LINK */}

          {row?.serviceRequest?.customer?.userName && (
            <div
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                to={`/users/customer/details?userId=${row?.serviceRequest?.customer?._id}`}
              >
                <FaExternalLinkAlt
                  className="
                    text-secondary
                    transition-colors
                    hover:text-primary
                  "
                  size={10}
                />
              </Link>
            </div>
          )}
        </div>
      ),

      width: "210px",
    },

    {
      name: "Payment Status",

      cell: (row) => (
        <StatusBadge
          value={row?.paymentInfo?.paymentStatus}
        />
      ),

      width: "170px",
    },

    {
      name: "Service Mode",

      cell: (row) => (
        <span
          className="
            inline-flex
            items-center
            rounded-full
            px-3
            py-1.5
            text-[10.5px]
            font-bold
            capitalize
          "
          style={{
            ...statusTheme(
              row?.serviceRequest?.serviceMode
            ),
          }}
        >
          {row?.serviceRequest?.serviceMode || "--"}
        </span>
      ),

      width: "140px",
    },

    {
      name: "Ticket Status",

      cell: (row) => (
        <StatusBadge
          value={row?.serviceRequest?.ticketStatus}
        />
      ),

      width: "170px",
    },

    {
      name: (
        <div className="flex items-center gap-2">
          <FaRegCreditCard />
          Payment Method
        </div>
      ),

      cell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-background
              text-primary
            "
          >
            <FaRegCreditCard size={13} />
          </div>

          <span
            className="
              text-[11px]
              font-bold
              text-secondary
            "
          >
            {row?.paymentInfo?.paymentMethod || "--"}
          </span>
        </div>
      ),

      width: "190px",
    },

    {
      name: "Items Qty",

      cell: (row) => {
        const qty =
          row?.changeParts
            ?.map((i) => Number(i?.qty))
            .reduce((a, b) => a + b, 0) || 0;

        return (
          <span
            className="
              inline-flex
              min-w-[34px]
              justify-center
              rounded-lg
              bg-background
              px-2
              py-1
              text-xs
              font-bold
              text-primary
            "
          >
            {qty || "--"}
          </span>
        );
      },

      width: "110px",
    },

    {
      name: "Items Price",

      cell: (row) => (
        <span
          className="
            text-[11px]
            font-semibold
            text-secondary
          "
        >
          {currencyFormatter(
            Number(row?.subTotal) -
              Number(row?.serviceFee)
          )}
        </span>
      ),

      width: "140px",
    },

    {
      name: "Service Fee",

      cell: (row) => (
        <span
          className="
            text-[11px]
            font-semibold
            text-secondary
          "
        >
          {currencyFormatter(
            Number(row?.serviceFee)
          )}
        </span>
      ),

      width: "120px",
    },

    {
      name: "Tax",

      cell: (row) => (
        <span
          className="
            text-[11px]
            font-semibold
            text-secondary
          "
        >
          {currencyFormatter(Number(row?.tax))}
        </span>
      ),

      width: "100px",
    },

    {
      name: (
        <div className="flex items-center gap-2 text-primary">
          <FaMoneyBillWave />
          Total Price
        </div>
      ),

      cell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-background
              text-primary
            "
          >
            <MdOutlinePayments size={17} />
          </div>

          <span
            className="
              text-xs
              font-extrabold
              text-primary
            "
          >
            {currencyFormatter(Number(row?.total))}
          </span>
        </div>
      ),

      width: "170px",
    },

    {
      name: (
        <div className="flex items-center gap-2">
          <FiCalendar />
          Created On
        </div>
      ),

      cell: (row) => (
        <div
          className="
            text-[10.5px]
            font-semibold
            text-secondary
          "
        >
          {row?.createdAt
            ? moment(row.createdAt).format(
                "DD-MMM-YYYY hh:mm A"
              )
            : "--"}
        </div>
      ),

      width: "190px",
    },

    {
      name: (
        <div className="flex items-center gap-2">
          <FiActivity />
          Updated On
        </div>
      ),

      cell: (row) => (
        <div
          className="
            text-[10.5px]
            font-semibold
            text-secondary
          "
        >
          {row?.updatedAt
            ? moment(row.updatedAt).format(
                "DD-MMM-YYYY hh:mm A"
              )
            : "--"}
        </div>
      ),

      width: "190px",
    },
  ];

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <AnimatedContent>
      <div
        className="
          min-h-screen
          bg-background
          pb-10
        "
      >
        {/* =================================================
            HERO BANNER
        ================================================== */}

        <section className="mb-8">
          <div
            className="
              relative
              overflow-hidden
              rounded-[30px]
              bg-primary
              px-6
              py-7
              shadow-lg
              sm:px-8
              sm:py-9
            "
          >
            {/* DECORATIVE CIRCLE */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-28
                h-[340px]
                w-[340px]
                rounded-full
                bg-secondary/25
                blur-[2px]
              "
            />

            {/* GRID */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.04]
                [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
                [background-size:34px_34px]
              "
            />

            <div
              className="
                relative
                z-10
                flex
                flex-col
                gap-6
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* HERO CONTENT */}

              <div>

                <h1
                  className="
                    text-[28px]
                    font-extrabold
                    leading-tight
                    tracking-[-0.04em]
                    text-white
                    sm:text-[34px]
                  "
                >
                  Payments
                </h1>

                <p
                  className="
                    mt-2
                    max-w-[520px]
                    text-[13px]
                    leading-6
                    text-white/50
                  "
                >
                  Monitor revenue, payment status and
                  quotation activity from one place.
                </p>
              </div>

              {/* HERO STATS */}

              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.055]
                    px-4
                    py-2.5
                    backdrop-blur-xl
                  "
                >
                  <FaWallet
                    size={13}
                    className="text-accent"
                  />

                  <span
                    className="
                      text-[12px]
                      font-bold
                      text-white/85
                    "
                  >
                    {loading
                      ? "--"
                      : currencyFormatter(totalRevenue)}{" "}
                    Revenue
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.055]
                    px-4
                    py-2.5
                    backdrop-blur-xl
                  "
                >
                  <FaCheckCircle
                    size={13}
                    className="text-accent"
                  />

                  <span
                    className="
                      text-[12px]
                      font-bold
                      text-white/85
                    "
                  >
                    {paid} Paid
                  </span>
                </div>
              </div>
            </div>

            {/* HERO BOTTOM LINE */}

            <div
              className="
                absolute
                bottom-0
                left-8
                right-8
                h-px
                bg-gradient-to-r
                from-transparent
                via-secondary/60
                to-transparent
              "
            />
          </div>
        </section>

        {/* =================================================
            KPI CARDS
        ================================================== */}

        <section className="mb-8">
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {metrics.map((m) => (
              <KpiCard
                key={m.title}
                {...m}
              />
            ))}
          </div>
        </section>

        {/* =================================================
            TABLE SECTION
        ================================================== */}

        <section>
          {/* SECTION HEADER */}

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-background
                  text-primary
                "
              >
                <MdPayment size={15} />
              </div>

              <div>
                <h2
                  className="
                    text-[16px]
                    font-extrabold
                    tracking-[-0.025em]
                    text-primary
                  "
                >
                  Payment Collection
                </h2>

                <p
                  className="
                    mt-0.5
                    text-[11px]
                    text-secondary
                  "
                >
                  Review and monitor every payment
                  transaction
                </p>
              </div>
            </div>

            <span
              className="
                hidden
                text-[10px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-secondary
                sm:block
              "
            >
              {payments.length} Records
            </span>
          </div>

          {/* TABLE CARD */}

          <div
            className="
              overflow-hidden
              rounded-[30px]
              border
              border-accent
              bg-white
              shadow-md
            "
          >
            {/* TABLE HEADER */}

            <div
              className="
                border-b
                border-accent
                bg-background
                px-6
                py-5
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <h3
                    className="
                      text-base
                      font-bold
                      text-primary
                    "
                  >
                    Payment Logs
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-secondary
                    "
                  >
                    All payment transactions and
                    quotation records
                  </p>
                </div>

                <span
                  className="
                    inline-flex
                    w-fit
                    items-center
                    rounded-full
                    bg-white
                    px-3
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-primary
                    ring-1
                    ring-accent
                  "
                >
                  {loading
                    ? "Syncing"
                    : `${currencyFormatter(
                        totalRevenue
                      )} Total`}
                </span>
              </div>
            </div>

            {/* DATA TABLE */}

            <DataTable
              columns={columns}
              data={payments}
              progressPending={loading}
              noDataComponent={
                <div
                  className="
                    flex
                    min-h-[280px]
                    flex-col
                    items-center
                    justify-center
                  "
                >
                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-[22px]
                      bg-background
                      text-secondary
                    "
                  >
                    <FaWallet size={24} />
                  </div>

                  <p
                    className="
                      mt-4
                      text-sm
                      font-bold
                      text-primary
                    "
                  >
                    No payment records found
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-secondary
                    "
                  >
                    Transactions will appear here once
                    payments are made
                  </p>
                </div>
              }
              fixedHeader
              fixedHeaderScrollHeight="55vh"
              className={`
                data_table_comp
                ${
                  isSidebarOpen
                    ? "data_table_comp_sidebar_opened"
                    : "data_table_comp_sidebar_closed"
                }
              `}
              customStyles={{
                table: {
                  style: {
                    backgroundColor: "transparent",
                  },
                },

                headRow: {
                  style: {
                    backgroundColor: "var(--payment-bg)",
                    minHeight: "56px",
                    borderBottom:
                      "1px solid var(--payment-accent)",
                  },
                },

                headCells: {
                  style: {
                    fontWeight: "700",
                    fontSize: "10px",
                    color: "var(--payment-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                  },
                },

                rows: {
                  style: {
                    minHeight: "68px",
                    borderBottom:
                      "1px solid var(--payment-accent)",
                    backgroundColor: "#FFFFFF",
                    transition:
                      "background-color 0.15s ease",
                  },

                  highlightOnHoverStyle: {
                    backgroundColor:
                      "var(--payment-bg)",
                    borderBottomColor:
                      "var(--payment-accent)",
                    outlineStyle: "none",
                    cursor: "pointer",
                  },
                },

                cells: {
                  style: {
                    fontSize: "11.5px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                  },
                },

                progress: {
                  style: {
                    backgroundColor: "#FFFFFF",
                    color: "var(--payment-primary)",
                    padding: "24px 0",
                  },
                },
              }}
            />

            {/* PAGINATION */}

            <div
              className="
                border-t
                border-accent/50
                px-4
                py-3
              "
            >
              <Pagination
                totalPages={totalPages}
                activePage={activePage}
                limit={limit}
                setPageValue={(p) => {
                  setActivePage(p);
                  getPaymentLogs(p, limit);
                }}
                setLimit={(l) => {
                  setLimit(l);
                  setActivePage(1);
                  getPaymentLogs(1, l);
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </AnimatedContent>
  );
};

export default PaymentLogs;
// import { getServiceRequests } from "@/reduxStore/action/serviceRequestAction";

// import moment from "moment";
// import DataTable from "react-data-table-component";
// import React, { useEffect, useMemo, useState } from "react";

// import { useDispatch, useSelector } from "react-redux";
// import { useHistory, Link } from "react-router-dom";

// import {
//   FaTicketAlt,
//   FaUserCog,
//   FaPaperclip,
//   FaPlus,
//   FaExternalLinkAlt,
//   FaClock,
//   FaSortAmountUpAlt,
//   FaSortAmountDownAlt,
// } from "react-icons/fa";

// import {
//   FiActivity,
//   FiArrowUpRight,
//   FiCalendar,
//   FiList,
//   FiRefreshCw,
//   FiChevronRight,
// } from "react-icons/fi";

// import { HiSortDescending } from "react-icons/hi";
// import { MdOutlineTune } from "react-icons/md";

// import TableHeader from "@/components/common/TableHeader";
// import Pagination from "@/components/common/Pagination";
// import AnimatedContent from "@/components/common/AnimatedContent";
// import Dropdown from "@/components/common/DropDown";
// import MuiDrawer from "@/components/drawer/MuiDrawer";

// import {
//   SERVICE_REQUEST_TYPE,
//   TICKET_STATUS,
// } from "@/utils/appConstatnts";

// import { Popover } from "react-tiny-popover";

// /* ============================================================
//    THEME
// ============================================================ */

// const THEME = {
//   primary: "#AD8B73",
//   primaryDark: "#8B6B57",
//   primarySoft: "#FFFBE9",
//   primarySoft2: "#FFF5D6",
//   primaryBorder: "#E3CAA5",

//   text: "#3D2C1E",
//   textSoft: "#6B5344",
//   textMuted: "#AD8B73",
//   textLight: "#CEAB93",

//   white: "#ffffff",
//   surface: "#FFFBE9",
//   surface2: "#FFF5D6",

//   border: "#E3CAA5",
//   borderSoft: "#F5E8D0",

//   success: "#16a34a",
//   successSoft: "#f0fdf4",
//   successBorder: "#dcfce7",

//   warning: "#d97706",
//   warningSoft: "#fffbeb",
//   warningBorder: "#fef3c7",

//   danger: "#dc2626",
//   dangerSoft: "#fef2f2",
//   dangerBorder: "#fee2e2",
// };

// /* ============================================================
//    STATUS / BADGE THEME
// ============================================================ */

// const getBadgeTheme = (value) => {
//   const normalized = String(value || "")
//     .toLowerCase()
//     .trim();

//   if (
//     normalized.includes("open") ||
//     normalized.includes("new") ||
//     normalized.includes("created")
//   ) {
//     return {
//       color: THEME.primary,
//       backgroundColor: THEME.primarySoft,
//       border: `1px solid ${THEME.primaryBorder}`,
//     };
//   }

//   if (
//     normalized.includes("pending") ||
//     normalized.includes("progress") ||
//     normalized.includes("assign")
//   ) {
//     return {
//       color: THEME.warning,
//       backgroundColor: THEME.warningSoft,
//       border: `1px solid ${THEME.warningBorder}`,
//     };
//   }

//   if (
//     normalized.includes("complete") ||
//     normalized.includes("resolve") ||
//     normalized.includes("close")
//   ) {
//     return {
//       color: THEME.success,
//       backgroundColor: THEME.successSoft,
//       border: `1px solid ${THEME.successBorder}`,
//     };
//   }

//   if (
//     normalized.includes("cancel") ||
//     normalized.includes("reject")
//   ) {
//     return {
//       color: THEME.danger,
//       backgroundColor: THEME.dangerSoft,
//       border: `1px solid ${THEME.dangerBorder}`,
//     };
//   }

//   return {
//     color: THEME.textSoft,
//     backgroundColor: THEME.surface,
//     border: `1px solid ${THEME.border}`,
//   };
// };

// /* ============================================================
//    ICON BOX
// ============================================================ */

// const IconBox = ({
//   children,
//   size = "h-10 w-10",
//   radius = "rounded-[12px]",
// }) => (
//   <div
//     className={`
//       ${size}
//       ${radius}
//       flex
//       shrink-0
//       items-center
//       justify-center
//     `}
//     style={{
//       color: THEME.primary,
//       backgroundColor: THEME.primarySoft,
//       border: `1px solid ${THEME.primaryBorder}`,
//     }}
//   >
//     {children}
//   </div>
// );

// /* ============================================================
//    PAGE
// ============================================================ */

// const TicketManagement = () => {
//   const history = useHistory();
//   const dispatch = useDispatch();

//   const {
//     serviceRequests,
//     totalPages,
//     userList: rawUserList,
//   } = useSelector((state) => state.serviceRequestState);

//   const userList = Array.isArray(rawUserList)
//     ? rawUserList
//     : [];

//   /* ==========================================================
//      STATES
//   ========================================================== */

//   const [filterValues, setFilterValues] = useState({});

//   const [activePage, setActivePage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   const [filterDragger, setFilterDragger] =
//     useState(false);

//   const [sortablePopover, setSortablePopover] =
//     useState(false);

//   const [sortBy, setSortBy] = useState(-1);

//   const [filterCount, setFilterCount] = useState(0);

//   const [
//     ticketStatusSelectedOption,
//     setTicketStatusSelectedOption,
//   ] = useState("");

//   const [
//     ticketTypeSelectedOption,
//     setTicketTypeSelectedOption,
//   ] = useState("");

//   const [
//     customerSelectedOption,
//     setCustomerSelectedOption,
//   ] = useState("");

//   const [
//     customerSelectedId,
//     setCustomerSelectedId,
//   ] = useState("");

//   const [
//     technicianSelectedOption,
//     setTechnicianSelectedOption,
//   ] = useState("");

//   const [
//     technicianSelectedId,
//     setTechnicianSelectedId,
//   ] = useState("");

//   const [
//     riderSelectedOption,
//     setRiderSelectedOption,
//   ] = useState("");

//   const [
//     riderSelectedId,
//     setRiderSelectedId,
//   ] = useState("");

//   /* ==========================================================
//      FETCH
//   ========================================================== */

//   const fetchData = (params) => {
//     dispatch(getServiceRequests(params));
//   };

//   useEffect(() => {
//     fetchData({
//       ticketStatusSelectedOption: "",
//       ticketTypeSelectedOption: "",
//       customerSelectedId: "",
//       technicianSelectedId: "",
//       riderSelectedId: "",
//       sortBy: -1,
//       page: 1,
//       limit,
//     });
//   }, [dispatch]);

//   /* ==========================================================
//      PAGINATION
//   ========================================================== */

//   const handlePagination = (currentPage) => {
//     setActivePage(currentPage);

//     fetchData({
//       ...filterValues,
//       page: currentPage,
//       limit,
//     });
//   };

//   const handlePageLimit = (currentLimit) => {
//     setLimit(currentLimit);
//     setActivePage(1);

//     fetchData({
//       ...filterValues,
//       page: 1,
//       limit: currentLimit,
//     });
//   };

//   /* ==========================================================
//      TABLE HEADER
//   ========================================================== */

//   const handleFilterValues = (values) => {
//     setFilterValues(values);
//   };

//   /* ==========================================================
//      FILTER
//   ========================================================== */

//   const handleFilter = () => {
//     const params = {
//       ticketStatusSelectedOption,
//       ticketTypeSelectedOption,
//       customerSelectedId,
//       technicianSelectedId,
//       riderSelectedId,
//       sortBy,
//       page: 1,
//       limit,
//     };

//     setActivePage(1);
//     setFilterValues(params);

//     fetchData(params);

//     const count = [
//       ticketStatusSelectedOption,
//       ticketTypeSelectedOption,
//       customerSelectedId,
//       technicianSelectedId,
//       riderSelectedId,
//     ].filter(Boolean).length;

//     setFilterCount(count);
//     setFilterDragger(false);
//   };

//   /* ==========================================================
//      CLEAR FILTER
//   ========================================================== */

//   const handleClearFilter = () => {
//     setTicketStatusSelectedOption("");
//     setTicketTypeSelectedOption("");

//     setCustomerSelectedOption("");
//     setCustomerSelectedId("");

//     setTechnicianSelectedOption("");
//     setTechnicianSelectedId("");

//     setRiderSelectedOption("");
//     setRiderSelectedId("");

//     setFilterCount(0);
//     setActivePage(1);

//     const params = {
//       ticketStatusSelectedOption: "",
//       ticketTypeSelectedOption: "",
//       customerSelectedId: "",
//       technicianSelectedId: "",
//       riderSelectedId: "",
//       sortBy: -1,
//       page: 1,
//       limit,
//     };

//     setFilterValues(params);

//     fetchData(params);

//     setFilterDragger(false);
//   };

//   /* ==========================================================
//      SORT
//   ========================================================== */

//   const handleSortBy = (value) => {
//     setSortBy(value);

//     const params = {
//       ...filterValues,
//       sortBy: value,
//       page: activePage,
//       limit,
//     };

//     setFilterValues(params);

//     fetchData(params);

//     setSortablePopover(false);
//   };

//   /* ==========================================================
//      OPEN REQUEST
//   ========================================================== */

//   const openRequest = (id) => {
//     if (!id) return;

//     history.push(
//       `/services/servicerequests/request?sr_id=${id}`
//     );
//   };

//   /* ==========================================================
//      KPI
//   ========================================================== */

//   const requestStats = useMemo(() => {
//     const requests = Array.isArray(serviceRequests)
//       ? serviceRequests
//       : [];

//     const normalize = (value) =>
//       String(value || "")
//         .toLowerCase()
//         .trim();

//     const open = requests.filter((item) => {
//       const status = normalize(item?.ticketStatus);

//       return (
//         status.includes("open") ||
//         status.includes("new") ||
//         status.includes("created")
//       );
//     }).length;

//     const assigned = requests.filter(
//       (item) => item?.technician?.userName
//     ).length;

//     const pending = requests.filter((item) => {
//       const status = normalize(item?.ticketStatus);

//       return (
//         status.includes("pending") ||
//         status.includes("progress")
//       );
//     }).length;

//     return {
//       total: requests.length,
//       open,
//       assigned,
//       pending,
//     };
//   }, [serviceRequests]);

//   /* ==========================================================
//      TABLE COLUMNS
//   ========================================================== */

//   const columns = [
//     {
//       name: "TICKET",
//       cell: (row) => (
//         <div
//           onClick={() => openRequest(row?._id)}
//           className="
//             flex
//             cursor-pointer
//             items-center
//             gap-3
//             py-2
//           "
//         >
//           <IconBox
//             size="h-10 w-10"
//             radius="rounded-[11px]"
//           >
//             <FaTicketAlt size={14} />
//           </IconBox>

//           <div className="min-w-0">
//             <div
//               className="
//                 text-[11px]
//                 font-extrabold
//                 transition-colors
//                 hover:underline
//               "
//               style={{
//                 color: THEME.text,
//               }}
//             >
//               #{row?._id?.slice(-8) || "--"}
//             </div>

//             <div
//               className="
//                 mt-1
//                 flex
//                 items-center
//                 gap-1.5
//                 text-[9px]
//                 font-medium
//               "
//               style={{
//                 color: THEME.textMuted,
//               }}
//             >
//               <FaClock size={8} />

//               {row?.createdAt
//                 ? moment(row.createdAt).fromNow()
//                 : "--"}
//             </div>
//           </div>

//           <FiChevronRight
//             className="ml-auto opacity-30"
//             size={13}
//           />
//         </div>
//       ),
//       width: "205px",
//     },

//     {
//       name: "CUSTOMER",
//       cell: (row) => (
//         <div
//           onClick={() => openRequest(row?._id)}
//           className="
//             flex
//             min-w-0
//             cursor-pointer
//             items-center
//             gap-2.5
//             py-2
//           "
//         >
//           <div
//             className="
//               flex
//               h-9
//               w-9
//               shrink-0
//               items-center
//               justify-center
//               rounded-full
//               text-[11px]
//               font-extrabold
//             "
//             style={{
//               color: THEME.primary,
//               backgroundColor: THEME.primarySoft,
//               border: `1px solid ${THEME.primaryBorder}`,
//             }}
//           >
//             {row?.customer?.userName?.[0]?.toUpperCase() ||
//               "—"}
//           </div>

//           <div className="min-w-0">
//             <div className="flex items-center gap-2">
//               <div
//                 className="
//                   max-w-[125px]
//                   truncate
//                   text-[11px]
//                   font-bold
//                 "
//                 style={{
//                   color: THEME.text,
//                 }}
//               >
//                 {row?.customer?.userName || "--"}
//               </div>

//               {row?.customer?.userName && (
//                 <Link
//                   to={`/users/customer/details?userId=${row?.customer?._id}`}
//                   onClick={(e) => e.stopPropagation()}
//                   className="
//                     opacity-40
//                     transition-all
//                     hover:opacity-100
//                   "
//                   style={{
//                     color: THEME.primary,
//                   }}
//                 >
//                   <FaExternalLinkAlt size={8} />
//                 </Link>
//               )}
//             </div>

//             {row?.customer?.email && (
//               <div
//                 className="
//                   mt-0.5
//                   max-w-[150px]
//                   truncate
//                   text-[9px]
//                 "
//                 style={{
//                   color: THEME.textMuted,
//                 }}
//               >
//                 {row.customer.email}
//               </div>
//             )}
//           </div>
//         </div>
//       ),
//       width: "235px",
//     },

//     {
//       name: "PROBLEM",
//       cell: (row) => (
//         <div
//           onClick={() => openRequest(row?._id)}
//           className="
//             max-w-[250px]
//             cursor-pointer
//             py-2
//           "
//           title={row?.problemDescription}
//         >
//           <div
//             className="
//               line-clamp-2
//               text-[11px]
//               font-semibold
//               leading-5
//             "
//             style={{
//               color: THEME.text,
//             }}
//           >
//             {row?.problemDescription || "--"}
//           </div>

//           <div
//             className="
//               mt-1
//               flex
//               items-center
//               gap-1
//               text-[9px]
//               font-medium
//             "
//             style={{
//               color: THEME.primary,
//             }}
//           >
//             <FiArrowUpRight size={9} />

//             View request details
//           </div>
//         </div>
//       ),
//       width: "280px",
//     },

//     {
//       name: "TYPE",
//       cell: (row) => (
//         <div
//           onClick={() => openRequest(row?._id)}
//           className="cursor-pointer"
//         >
//           <span
//             className="
//               inline-flex
//               items-center
//               rounded-full
//               px-3
//               py-1.5
//               text-[9px]
//               font-extrabold
//               capitalize
//             "
//             style={getBadgeTheme(
//               row?.serviceRequestType
//             )}
//           >
//             {row?.serviceRequestType || "--"}
//           </span>
//         </div>
//       ),
//       width: "155px",
//     },

//     {
//       name: "MODE",
//       cell: (row) => (
//         <div
//           onClick={() => openRequest(row?._id)}
//           className="cursor-pointer"
//         >
//           <span
//             className="
//               inline-flex
//               items-center
//               rounded-full
//               px-3
//               py-1.5
//               text-[9px]
//               font-extrabold
//               capitalize
//             "
//             style={getBadgeTheme(row?.serviceMode)}
//           >
//             {row?.serviceMode || "--"}
//           </span>
//         </div>
//       ),
//       width: "135px",
//     },

//     {
//       name: "STATUS",
//       cell: (row) => (
//         <div
//           onClick={() => openRequest(row?._id)}
//           className="cursor-pointer"
//         >
//           <span
//             className="
//               inline-flex
//               min-w-[78px]
//               items-center
//               justify-center
//               rounded-full
//               px-3
//               py-1.5
//               text-[9px]
//               font-extrabold
//               capitalize
//             "
//             style={getBadgeTheme(row?.ticketStatus)}
//           >
//             {row?.ticketStatus || "--"}
//           </span>
//         </div>
//       ),
//       width: "145px",
//     },

//     {
//       name: "ATTACHMENTS",
//       cell: (row) => (
//         <div
//           onClick={() => openRequest(row?._id)}
//           className="cursor-pointer py-2"
//         >
//           {row?.attachments?.length > 0 ? (
//             <div className="relative flex h-11 items-center">
//               <div
//                 className="
//                   relative
//                   h-11
//                   w-11
//                   overflow-hidden
//                   rounded-[11px]
//                   bg-slate-50
//                 "
//                 style={{
//                   border: `1px solid ${THEME.border}`,
//                 }}
//               >
//                 <img
//                   src={row.attachments[0]}
//                   alt="Attachment"
//                   className="
//                     h-full
//                     w-full
//                     object-cover
//                     transition-transform
//                     duration-300
//                     hover:scale-105
//                   "
//                 />
//               </div>

//               {row.attachments.length > 1 && (
//                 <span
//                   className="
//                     absolute
//                     -right-2
//                     -top-2
//                     flex
//                     h-5
//                     min-w-5
//                     items-center
//                     justify-center
//                     rounded-full
//                     px-1
//                     text-[8px]
//                     font-extrabold
//                     text-white
//                   "
//                   style={{
//                     backgroundColor: THEME.primary,
//                   }}
//                 >
//                   +{row.attachments.length - 1}
//                 </span>
//               )}
//             </div>
//           ) : (
//             <div
//               className="
//                 flex
//                 items-center
//                 gap-2
//                 text-[9px]
//                 font-semibold
//               "
//               style={{
//                 color: THEME.textMuted,
//               }}
//             >
//               <FaPaperclip size={10} />

//               <span>No files</span>
//             </div>
//           )}
//         </div>
//       ),
//       width: "140px",
//     },

//     {
//       name: "TECHNICIAN",
//       cell: (row) => (
//         <div
//           onClick={() => openRequest(row?._id)}
//           className="
//             flex
//             cursor-pointer
//             items-center
//             gap-2.5
//             py-2
//           "
//         >
//           <div
//             className="
//               flex
//               h-8
//               w-8
//               shrink-0
//               items-center
//               justify-center
//               rounded-full
//             "
//             style={{
//               color: THEME.primary,
//               backgroundColor: THEME.primarySoft,
//               border: `1px solid ${THEME.primaryBorder}`,
//             }}
//           >
//             <FaUserCog size={12} />
//           </div>

//           <div className="min-w-0">
//             <div className="flex items-center gap-2">
//               <div
//                 className="
//                   max-w-[110px]
//                   truncate
//                   text-[10px]
//                   font-bold
//                 "
//                 style={{
//                   color: THEME.text,
//                 }}
//               >
//                 {row?.technician?.userName ||
//                   "Unassigned"}
//               </div>

//               {row?.technician?.userName && (
//                 <Link
//                   to={`/users/technician/details?userId=${row?.technician?._id}`}
//                   onClick={(e) =>
//                     e.stopPropagation()
//                   }
//                   className="
//                     opacity-60
//                     transition-all
//                     hover:opacity-100
//                   "
//                   style={{
//                     color: THEME.primary,
//                   }}
//                 >
//                   <FaExternalLinkAlt size={8} />
//                 </Link>
//               )}
//             </div>

//             <div
//               className="
//                 mt-0.5
//                 text-[8px]
//                 uppercase
//                 tracking-wide
//               "
//               style={{
//                 color: THEME.textMuted,
//               }}
//             >
//               {row?.technician?.userName
//                 ? "Assigned"
//                 : "Waiting for assignment"}
//             </div>
//           </div>
//         </div>
//       ),
//       width: "205px",
//     },

//     {
//       name: "RAISED ON",
//       cell: (row) => (
//         <div
//           onClick={() => openRequest(row?._id)}
//           className="
//             flex
//             cursor-pointer
//             items-center
//             gap-2
//           "
//         >
//           <IconBox
//             size="h-8 w-8"
//             radius="rounded-[9px]"
//           >
//             <FiCalendar size={12} />
//           </IconBox>

//           <div>
//             <div
//               className="
//                 text-[10px]
//                 font-bold
//               "
//               style={{
//                 color: THEME.text,
//               }}
//             >
//               {row?.createdAt
//                 ? moment(row.createdAt).format(
//                     "DD MMM YYYY"
//                   )
//                 : "--"}
//             </div>

//             <div
//               className="
//                 mt-0.5
//                 text-[9px]
//               "
//               style={{
//                 color: THEME.textMuted,
//               }}
//             >
//               {row?.createdAt
//                 ? moment(row.createdAt).format(
//                     "hh:mm A"
//                   )
//                 : "--"}
//             </div>
//           </div>
//         </div>
//       ),
//       width: "170px",
//     },
//   ];

//   /* ==========================================================
//      RETURN
//   ========================================================== */

//   return (
//     <AnimatedContent>
//       <div className="min-h-screen bg-[#FFFBE9] pb-8">

//         {/* ====================================================
//             PAGE HEADER
//         ==================================================== */}

//         <section className="mb-8">
//           <div className="relative overflow-hidden rounded-[30px] bg-[#3D2C1E] px-6 py-7 shadow-[0_20px_55px_rgba(61,44,30,0.25)] sm:px-8 sm:py-9">

//             <div className="pointer-events-none absolute -right-24 -top-28 h-[340px] w-[340px] rounded-full bg-[#AD8B73]/25 blur-[2px]" />

//             <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:34px_34px]" />

//             <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

//               <div>
//                 <div className="mb-3 flex items-center gap-2.5">

//                   <span className="relative flex h-2.5 w-2.5">
//                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E3CAA5]/60" />
//                     <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#E3CAA5]" />
//                   </span>

//                   <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">
//                     Services
//                   </span>
//                 </div>

//                 <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-[34px]">
//                   Service Requests
//                 </h1>

//                 <p className="mt-2 max-w-[520px] text-[13px] leading-6 text-white/50">
//                   Manage, monitor and track customer
//                   service requests, technicians, status
//                   and attachments from one place.
//                 </p>
//               </div>

//               <div className="flex flex-wrap items-center gap-3">

//                 {/* SORT */}

//                 <Popover
//                   isOpen={sortablePopover}
//                   positions={["bottom", "left"]}
//                   containerClassName="z-50"
//                   onClickOutside={() =>
//                     setSortablePopover(false)
//                   }
//                   content={
//                     <div className="mt-2 min-w-[175px] rounded-xl border border-[#E3CAA5] bg-white p-2 shadow-xl">
//                       {[
//                         {
//                           label: "Newest First",
//                           val: -1,
//                           Icon: FaSortAmountUpAlt,
//                         },
//                         {
//                           label: "Oldest First",
//                           val: 1,
//                           Icon: FaSortAmountDownAlt,
//                         },
//                       ].map(
//                         ({
//                           label,
//                           val,
//                           Icon,
//                         }) => (
//                           <div
//                             key={val}
//                             onClick={() =>
//                               handleSortBy(val)
//                             }
//                             className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
//                               sortBy === val
//                                 ? "bg-[#FFFBE9] text-[#AD8B73]"
//                                 : "hover:bg-[#FFFBE9]"
//                             }`}
//                           >
//                             <Icon size={13} />
//                             {label}
//                           </div>
//                         )
//                       )}
//                     </div>
//                   }
//                 >
//                   <button
//                     onClick={() =>
//                       setSortablePopover(
//                         !sortablePopover
//                       )
//                     }
//                     className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 text-[12px] font-semibold text-white/85 backdrop-blur-xl transition hover:bg-white/[0.10]"
//                   >
//                     <HiSortDescending size={15} />
//                     Sort
//                   </button>
//                 </Popover>

//                 {/* FILTER */}

//                 <button
//                   onClick={() =>
//                     setFilterDragger(true)
//                   }
//                   className="relative flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 text-[12px] font-semibold text-white/85 backdrop-blur-xl transition hover:bg-white/[0.10]"
//                 >
//                   <MdOutlineTune size={15} />

//                   Filter

//                   {filterCount > 0 && (
//                     <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E3CAA5] text-[9px] font-bold text-[#3D2C1E]">
//                       {filterCount}
//                     </span>
//                   )}
//                 </button>

//                 {/* CREATE REQUEST */}

//                 <button
//                   onClick={() =>
//                     history.push(
//                       "/services/servicerequests/request"
//                     )
//                   }
//                   className="flex items-center gap-2 rounded-xl bg-[#AD8B73] px-4 py-2.5 text-[12px] font-extrabold text-white shadow-[0_8px_20px_rgba(173,139,115,0.35)] transition hover:-translate-y-0.5 hover:opacity-90"
//                 >
//                   <FaPlus size={9} />

//                   Create Request
//                 </button>
//               </div>
//             </div>

//             <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#AD8B73]/60 to-transparent" />
//           </div>
//         </section>

//         {/* ====================================================
//             KPI CARDS
//         ==================================================== */}

//         <section className="mb-8">
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

//             {[
//               {
//                 title: "Total Requests",
//                 value: requestStats.total,
//                 desc: "Requests on this page",
//                 Icon: FaTicketAlt,
//                 soft: "from-[#FFFBE9] to-[#FFF5D6]",
//                 line: "from-[#AD8B73] to-[#CEAB93]",
//               },
//               {
//                 title: "Open Requests",
//                 value: requestStats.open,
//                 desc: "Awaiting resolution",
//                 Icon: FiActivity,
//                 soft: "from-[#ECFDF5] to-[#F0FDFA]",
//                 line: "from-[#10B981] to-[#59D6BF]",
//               },
//               {
//                 title: "Assigned",
//                 value: requestStats.assigned,
//                 desc: "With technician",
//                 Icon: FaUserCog,
//                 soft: "from-[#FFFBE9] to-[#FFF5D6]",
//                 line: "from-[#CEAB93] to-[#E3CAA5]",
//               },
//               {
//                 title: "Pending",
//                 value: requestStats.pending,
//                 desc: "In progress",
//                 Icon: FaClock,
//                 soft: "from-[#FFF1F3] to-[#FFF5F7]",
//                 line: "from-[#F43F5E] to-[#FB7185]",
//               },
//             ].map((item) => {
//               const Icon = item.Icon;

//               return (
//                 <div
//                   key={item.title}
//                   className="group relative overflow-hidden rounded-[24px] border border-[#E3CAA5] bg-white p-5 shadow-[0_6px_25px_rgba(173,139,115,0.08)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#CEAB93] hover:shadow-[0_22px_45px_rgba(173,139,115,0.15)]"
//                 >
//                   <div
//                     className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${item.soft} opacity-70 transition-all duration-500 group-hover:scale-[1.7]`}
//                   />

//                   <div className="relative z-10 flex items-start justify-between">

//                     <div
//                       className={`flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br ${item.soft} text-[#AD8B73] transition-all duration-300 group-hover:scale-110`}
//                     >
//                       <Icon size={18} />
//                     </div>

//                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFFBE9] text-[#CEAB93] transition-all duration-300 group-hover:bg-[#AD8B73] group-hover:text-white">
//                       <FiArrowUpRight size={14} />
//                     </div>
//                   </div>

//                   <div className="relative z-10 mt-5">

//                     <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#AD8B73]">
//                       {item.title}
//                     </p>

//                     <div className="mt-2.5 flex items-end justify-between gap-2">

//                       <h3 className="text-[30px] font-extrabold leading-none tracking-[-0.05em] text-[#3D2C1E]">
//                         {item.value}
//                       </h3>

//                       <span className="mb-0.5 max-w-[105px] text-right text-[9px] font-medium leading-4 text-[#CEAB93]">
//                         {item.desc}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="absolute bottom-0 left-5 right-5 h-[2px] overflow-hidden rounded-full bg-[#E3CAA5]">
//                     <div
//                       className={`h-full w-0 rounded-full bg-gradient-to-r ${item.line} transition-all duration-500 group-hover:w-full`}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* ====================================================
//             FILTER HEADER
//         ==================================================== */}

//         <div className="mb-4 overflow-hidden rounded-[20px] border border-[#E3CAA5] bg-white shadow-[0_5px_20px_rgba(173,139,115,0.06)]">

//           <div className="flex items-center gap-3 border-b border-[#E3CAA5] px-4 py-3">

//             <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#FFFBE9] text-[#AD8B73]">
//               <FiList size={15} />
//             </div>

//             <div>
//               <h2 className="text-[12px] font-extrabold text-[#3D2C1E]">
//                 Request Filters
//               </h2>

//               <p className="text-[9px] text-[#AD8B73]">
//                 Search and filter service requests
//               </p>
//             </div>
//           </div>

//           <div className="p-3">
//             <TableHeader
//               title="Service Requests"
//               data={userList}
//               filterValues={handleFilterValues}
//               activePage={activePage}
//               limit={limit}
//             />
//           </div>
//         </div>

//         {/* ====================================================
//             REQUEST TABLE
//         ==================================================== */}

//         <div className="overflow-hidden rounded-[22px] border border-[#E3CAA5] bg-white shadow-[0_18px_42px_rgba(173,139,115,0.10)]">

//           <div className="flex flex-col gap-3 border-b border-[#E3CAA5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

//             <div className="flex items-center gap-3">

//               <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#FFFBE9] text-[#AD8B73]">
//                 <FaTicketAlt size={14} />
//               </div>

//               <div>
//                 <h2 className="text-[13px] font-extrabold text-[#3D2C1E]">
//                   Recent Service Requests
//                 </h2>

//                 <p className="mt-0.5 text-[9px] font-medium text-[#AD8B73]">
//                   Customer requests and service activity
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">

//               <div className="flex w-fit items-center gap-2 rounded-full border border-[#E3CAA5] bg-[#FFFBE9] px-3 py-1.5">

//                 <span className="h-1.5 w-1.5 rounded-full bg-[#AD8B73]" />

//                 <span className="text-[9px] font-extrabold uppercase tracking-wide text-[#AD8B73]">
//                   {serviceRequests?.length || 0} Showing
//                 </span>
//               </div>

//               <button
//                 onClick={() =>
//                   fetchData({
//                     ...filterValues,
//                     page: activePage,
//                     limit,
//                   })
//                 }
//                 className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#FFFBE9] border border-[#E3CAA5] text-[#AD8B73] transition-all duration-200 hover:bg-[#AD8B73] hover:text-white"
//                 title="Refresh"
//               >
//                 <FiRefreshCw size={12} />
//               </button>
//             </div>
//           </div>

//           {/* DATA TABLE */}

//           <DataTable
//             columns={columns}
//             data={serviceRequests || []}
//             onRowClicked={(row) =>
//               openRequest(row?._id)
//             }
//             pointerOnHover
//             noDataComponent={
//               <div className="flex min-h-[330px] w-full flex-col items-center justify-center px-5 text-center">

//                 <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#FFFBE9] text-[#AD8B73]">
//                   <FaTicketAlt size={24} />
//                 </div>

//                 <div className="text-[14px] font-extrabold text-[#3D2C1E]">
//                   No Service Requests Found
//                 </div>

//                 <div className="mt-1 max-w-[330px] text-[10px] leading-5 text-[#CEAB93]">
//                   There are no service requests matching
//                   the current filters.
//                 </div>

//                 <button
//                   onClick={() =>
//                     history.push(
//                       "/services/servicerequests/request"
//                     )
//                   }
//                   className="mt-5 flex items-center gap-2 rounded-[10px] bg-[#AD8B73] px-4 py-2 text-[10px] font-extrabold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
//                 >
//                   <FaPlus size={8} />

//                   Create Request
//                 </button>
//               </div>
//             }
//             fixedHeader
//             fixedHeaderScrollHeight="62vh"
//             className="data_table_comp"
//             customStyles={{
//               table: {
//                 style: {
//                   backgroundColor: "transparent",
//                 },
//               },

//               headRow: {
//                 style: {
//                   minHeight: "50px",
//                   backgroundColor: "#FFFBE9",
//                   borderBottom:
//                     "1px solid #E3CAA5",
//                 },
//               },

//               headCells: {
//                 style: {
//                   fontSize: "9.5px",
//                   fontWeight: "800",
//                   color: "#AD8B73",
//                   overflow: "hidden",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.8px",
//                   paddingLeft: "18px",
//                   paddingRight: "18px",
//                 },
//               },

//               rows: {
//                 style: {
//                   minHeight: "78px",
//                   backgroundColor: "#ffffff",
//                   borderBottom:
//                     "1px solid #E3CAA5",
//                   cursor: "pointer",
//                   transition: "all 0.2s ease",
//                 },

//                 highlightOnHoverStyle: {
//                   backgroundColor: "#FFFBE9",
//                   borderBottomColor: "#E3CAA5",
//                   outline: "none",
//                   boxShadow:
//                     `inset 3px 0 0 ${THEME.primary}`,
//                 },
//               },

//               cells: {
//                 style: {
//                   fontWeight: "600",
//                   fontSize: "11px",
//                   paddingLeft: "18px",
//                   paddingRight: "18px",
//                 },
//               },

//               pagination: {
//                 style: {
//                   minHeight: "58px",
//                   borderTop:
//                     "1px solid #F0F2F7",
//                   backgroundColor: "#ffffff",
//                 },
//               },
//             }}
//           />

//           {/* PAGINATION */}

//           <div className="overflow-hidden border-t border-[#F0F2F7] px-3">
//             <Pagination
//               totalPages={totalPages}
//               activePage={activePage}
//               limit={limit}
//               setPageValue={handlePagination}
//               setLimit={handlePageLimit}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ====================================================
//           FILTER DRAWER
//       ==================================================== */}

//       <MuiDrawer
//         open={filterDragger}
//         onClose={() =>
//           setFilterDragger(false)
//         }
//         drawerWidth="400px"
//       >
//         <div className="flex h-full flex-col bg-white p-5">

//           {/* DRAWER HEADER */}

//           <div className="flex items-center gap-3 border-b border-[#F0F2F7] pb-4">

//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white">
//               <MdOutlineTune size={18} />
//             </div>

//             <div>
//               <p className="font-bold text-[#111827]">
//                 Filter Requests
//               </p>

//               <p className="text-[10px] text-[#8993A5]">
//                 Narrow down service requests
//               </p>
//             </div>
//           </div>

//           {/* FILTER FIELDS */}

//           <div className="mt-5 flex-1 space-y-4 overflow-auto">

//             {[
//               {
//                 label: "Ticket Status",
//                 value:
//                   ticketStatusSelectedOption,
//                 onSelect:
//                   setTicketStatusSelectedOption,
//                 options:
//                   Object.values(TICKET_STATUS),
//               },

//               {
//                 label: "Ticket Type",
//                 value:
//                   ticketTypeSelectedOption,
//                 onSelect:
//                   setTicketTypeSelectedOption,
//                 options:
//                   Object.values(
//                     SERVICE_REQUEST_TYPE
//                   ),
//               },

//               {
//                 label: "Customer",
//                 value:
//                   customerSelectedOption,

//                 onSelect: (value, id) => {
//                   setCustomerSelectedOption(value);
//                   setCustomerSelectedId(id);
//                 },

//                 options: userList
//                   .filter(
//                     (user) =>
//                       user.role === "customer"
//                   )
//                   .map(
//                     (user) => user.userName
//                   ),

//                 optionsObject: userList.filter(
//                   (user) =>
//                     user.role === "customer"
//                 ),
//               },

//               {
//                 label: "Rider",
//                 value:
//                   riderSelectedOption,

//                 onSelect: (value, id) => {
//                   setRiderSelectedOption(value);
//                   setRiderSelectedId(id);
//                 },

//                 options: userList
//                   .filter(
//                     (user) =>
//                       user.role === "rider"
//                   )
//                   .map(
//                     (user) => user.userName
//                   ),

//                 optionsObject: userList.filter(
//                   (user) =>
//                     user.role === "rider"
//                 ),
//               },

//               {
//                 label: "Technician",
//                 value:
//                   technicianSelectedOption,

//                 onSelect: (value, id) => {
//                   setTechnicianSelectedOption(value);
//                   setTechnicianSelectedId(id);
//                 },

//                 options: userList
//                   .filter(
//                     (user) =>
//                       user.role === "technician"
//                   )
//                   .map(
//                     (user) => user.userName
//                   ),

//                 optionsObject: userList.filter(
//                   (user) =>
//                     user.role === "technician"
//                 ),
//               },
//             ].map(
//               ({
//                 label,
//                 value,
//                 onSelect,
//                 options,
//                 optionsObject,
//               }) => (
//                 <div
//                   key={label}
//                   className="flex flex-col gap-1.5"
//                 >
//                   <label
//                     className="text-[10px] font-bold uppercase tracking-wide"
//                     style={{
//                       color: THEME.textMuted,
//                     }}
//                   >
//                     {label}
//                   </label>

//                   <Dropdown
//                     value={value}
//                     placeholder={`Select ${label}`}
//                     onSelect={onSelect}
//                     options={options || []}
//                     optionsObject={optionsObject}
//                     disabled={false}
//                     containerClassname="w-full"
//                     className="cursor-pointer capitalize"
//                   />
//                 </div>
//               )
//             )}
//           </div>

//           {/* DRAWER ACTIONS */}

//           <div className="flex items-center gap-3 border-t border-[#F0F2F7] pt-4">

//             <button
//               onClick={handleClearFilter}
//               className="h-11 flex-1 rounded-xl border border-[#E5EAF1] bg-white text-[11px] font-bold text-[#111827] transition hover:bg-[#F4F7FB]"
//             >
//               Clear
//             </button>

//             <button
//               onClick={handleFilter}
//               className="h-11 flex-1 rounded-xl bg-[#2563EB] text-[11px] font-bold text-white transition hover:opacity-90"
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       </MuiDrawer>
//     </AnimatedContent>
//   );
// };

// export default TicketManagement;
































import { getServiceRequests } from "@/reduxStore/action/serviceRequestAction";

import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";

import {
  FaTicketAlt,
  FaUserCog,
  FaPaperclip,
  FaPlus,
  FaExternalLinkAlt,
  FaClock,
  FaSortAmountUpAlt,
  FaSortAmountDownAlt,
} from "react-icons/fa";

import {
  FiActivity,
  FiArrowUpRight,
  FiCalendar,
  FiList,
  FiRefreshCw,
  FiChevronRight,
} from "react-icons/fi";

import { HiSortDescending } from "react-icons/hi";
import { MdOutlineTune } from "react-icons/md";

import TableHeader from "@/components/common/TableHeader";
import Pagination from "@/components/common/Pagination";
import AnimatedContent from "@/components/common/AnimatedContent";
import Dropdown from "@/components/common/DropDown";
import MuiDrawer from "@/components/drawer/MuiDrawer";

import {
  SERVICE_REQUEST_TYPE,
  TICKET_STATUS,
} from "@/utils/appConstatnts";

import { Popover } from "react-tiny-popover";

import COLORS from "@/components/theme/colors";

/* ============================================================
   SEMANTIC COLORS
   Core UI colors come from centralized COLORS.
============================================================ */

const SEMANTIC = {
  success: "#16a34a",
  successSoft: "#f0fdf4",
  successBorder: "#dcfce7",

  warning: "#d97706",
  warningSoft: "#fffbeb",
  warningBorder: "#fef3c7",

  danger: "#dc2626",
  dangerSoft: "#fef2f2",
  dangerBorder: "#fee2e2",
};

/* ============================================================
   STATUS / BADGE THEME
============================================================ */

const getBadgeTheme = (value) => {
  const normalized = String(value || "")
    .toLowerCase()
    .trim();

  if (
    normalized.includes("open") ||
    normalized.includes("new") ||
    normalized.includes("created")
  ) {
    return {
      color: COLORS.primary,
      backgroundColor: COLORS.accent,
      border: `1px solid ${COLORS.secondary}`,
    };
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("progress") ||
    normalized.includes("assign")
  ) {
    return {
      color: SEMANTIC.warning,
      backgroundColor: SEMANTIC.warningSoft,
      border: `1px solid ${SEMANTIC.warningBorder}`,
    };
  }

  if (
    normalized.includes("complete") ||
    normalized.includes("resolve") ||
    normalized.includes("close")
  ) {
    return {
      color: SEMANTIC.success,
      backgroundColor: SEMANTIC.successSoft,
      border: `1px solid ${SEMANTIC.successBorder}`,
    };
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("reject")
  ) {
    return {
      color: SEMANTIC.danger,
      backgroundColor: SEMANTIC.dangerSoft,
      border: `1px solid ${SEMANTIC.dangerBorder}`,
    };
  }

  return {
    color: COLORS.secondary,
    backgroundColor: COLORS.background,
    border: `1px solid ${COLORS.accent}`,
  };
};

/* ============================================================
   ICON BOX
============================================================ */

const IconBox = ({
  children,
  size = "h-10 w-10",
  radius = "rounded-[12px]",
}) => (
  <div
    className={`
      ${size}
      ${radius}
      flex
      shrink-0
      items-center
      justify-center
    `}
    style={{
      color: COLORS.primary,
      backgroundColor: COLORS.accent,
      border: `1px solid ${COLORS.secondary}`,
    }}
  >
    {children}
  </div>
);

/* ============================================================
   PAGE
============================================================ */

const TicketManagement = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    serviceRequests,
    totalPages,
    userList: rawUserList,
  } = useSelector((state) => state.serviceRequestState);

  const userList = Array.isArray(rawUserList)
    ? rawUserList
    : [];

  /* ==========================================================
     STATES
  ========================================================== */

  const [filterValues, setFilterValues] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [filterDragger, setFilterDragger] =
    useState(false);

  const [sortablePopover, setSortablePopover] =
    useState(false);

  const [sortBy, setSortBy] = useState(-1);
  const [filterCount, setFilterCount] = useState(0);

  const [
    ticketStatusSelectedOption,
    setTicketStatusSelectedOption,
  ] = useState("");

  const [
    ticketTypeSelectedOption,
    setTicketTypeSelectedOption,
  ] = useState("");

  const [
    customerSelectedOption,
    setCustomerSelectedOption,
  ] = useState("");

  const [
    customerSelectedId,
    setCustomerSelectedId,
  ] = useState("");

  const [
    technicianSelectedOption,
    setTechnicianSelectedOption,
  ] = useState("");

  const [
    technicianSelectedId,
    setTechnicianSelectedId,
  ] = useState("");

  const [
    riderSelectedOption,
    setRiderSelectedOption,
  ] = useState("");

  const [
    riderSelectedId,
    setRiderSelectedId,
  ] = useState("");

  /* ==========================================================
     FETCH
  ========================================================== */

  const fetchData = (params) => {
    dispatch(getServiceRequests(params));
  };

  useEffect(() => {
    fetchData({
      ticketStatusSelectedOption: "",
      ticketTypeSelectedOption: "",
      customerSelectedId: "",
      technicianSelectedId: "",
      riderSelectedId: "",
      sortBy: -1,
      page: 1,
      limit,
    });
  }, [dispatch]);

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const handlePagination = (currentPage) => {
    setActivePage(currentPage);

    fetchData({
      ...filterValues,
      page: currentPage,
      limit,
    });
  };

  const handlePageLimit = (currentLimit) => {
    setLimit(currentLimit);
    setActivePage(1);

    fetchData({
      ...filterValues,
      page: 1,
      limit: currentLimit,
    });
  };

  /* ==========================================================
     TABLE HEADER
  ========================================================== */

  const handleFilterValues = (values) => {
    setFilterValues(values);
  };

  /* ==========================================================
     FILTER
  ========================================================== */

  const handleFilter = () => {
    const params = {
      ticketStatusSelectedOption,
      ticketTypeSelectedOption,
      customerSelectedId,
      technicianSelectedId,
      riderSelectedId,
      sortBy,
      page: 1,
      limit,
    };

    setActivePage(1);
    setFilterValues(params);

    fetchData(params);

    const count = [
      ticketStatusSelectedOption,
      ticketTypeSelectedOption,
      customerSelectedId,
      technicianSelectedId,
      riderSelectedId,
    ].filter(Boolean).length;

    setFilterCount(count);
    setFilterDragger(false);
  };

  /* ==========================================================
     CLEAR FILTER
  ========================================================== */

  const handleClearFilter = () => {
    setTicketStatusSelectedOption("");
    setTicketTypeSelectedOption("");

    setCustomerSelectedOption("");
    setCustomerSelectedId("");

    setTechnicianSelectedOption("");
    setTechnicianSelectedId("");

    setRiderSelectedOption("");
    setRiderSelectedId("");

    setFilterCount(0);
    setActivePage(1);

    const params = {
      ticketStatusSelectedOption: "",
      ticketTypeSelectedOption: "",
      customerSelectedId: "",
      technicianSelectedId: "",
      riderSelectedId: "",
      sortBy: -1,
      page: 1,
      limit,
    };

    setFilterValues(params);

    fetchData(params);

    setFilterDragger(false);
  };

  /* ==========================================================
     SORT
  ========================================================== */

  const handleSortBy = (value) => {
    setSortBy(value);

    const params = {
      ...filterValues,
      sortBy: value,
      page: activePage,
      limit,
    };

    setFilterValues(params);

    fetchData(params);

    setSortablePopover(false);
  };

  /* ==========================================================
     OPEN REQUEST
  ========================================================== */

  const openRequest = (id) => {
    if (!id) return;

    history.push(
      `/services/servicerequests/request?sr_id=${id}`
    );
  };

  /* ==========================================================
     KPI
  ========================================================== */

  const requestStats = useMemo(() => {
    const requests = Array.isArray(serviceRequests)
      ? serviceRequests
      : [];

    const normalize = (value) =>
      String(value || "")
        .toLowerCase()
        .trim();

    const open = requests.filter((item) => {
      const status = normalize(item?.ticketStatus);

      return (
        status.includes("open") ||
        status.includes("new") ||
        status.includes("created")
      );
    }).length;

    const assigned = requests.filter(
      (item) => item?.technician?.userName
    ).length;

    const pending = requests.filter((item) => {
      const status = normalize(item?.ticketStatus);

      return (
        status.includes("pending") ||
        status.includes("progress")
      );
    }).length;

    return {
      total: requests.length,
      open,
      assigned,
      pending,
    };
  }, [serviceRequests]);

  /* ==========================================================
     TABLE COLUMNS
  ========================================================== */

  const columns = [
    {
      name: "TICKET",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="flex cursor-pointer items-center gap-3 py-2"
        >
          <IconBox
            size="h-10 w-10"
            radius="rounded-[11px]"
          >
            <FaTicketAlt size={14} />
          </IconBox>

          <div className="min-w-0">
            <div
              className="text-[11px] font-extrabold transition-colors hover:underline"
              style={{
                color: COLORS.primary,
              }}
            >
              #{row?._id?.slice(-8) || "--"}
            </div>

            <div
              className="mt-1 flex items-center gap-1.5 text-[9px] font-medium"
              style={{
                color: COLORS.secondary,
              }}
            >
              <FaClock size={8} />

              {row?.createdAt
                ? moment(row.createdAt).fromNow()
                : "--"}
            </div>
          </div>

          <FiChevronRight
            className="ml-auto opacity-30"
            size={13}
            style={{
              color: COLORS.secondary,
            }}
          />
        </div>
      ),
      width: "205px",
    },

    {
      name: "CUSTOMER",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="flex min-w-0 cursor-pointer items-center gap-2.5 py-2"
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold"
            style={{
              color: COLORS.primary,
              backgroundColor: COLORS.accent,
              border: `1px solid ${COLORS.secondary}`,
            }}
          >
            {row?.customer?.userName?.[0]?.toUpperCase() ||
              "—"}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="max-w-[125px] truncate text-[11px] font-bold"
                style={{
                  color: COLORS.primary,
                }}
              >
                {row?.customer?.userName || "--"}
              </div>

              {row?.customer?.userName && (
                <Link
                  to={`/users/customer/details?userId=${row?.customer?._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-40 transition-all hover:opacity-100"
                  style={{
                    color: COLORS.secondary,
                  }}
                >
                  <FaExternalLinkAlt size={8} />
                </Link>
              )}
            </div>

            {row?.customer?.email && (
              <div
                className="mt-0.5 max-w-[150px] truncate text-[9px]"
                style={{
                  color: COLORS.secondary,
                }}
              >
                {row.customer.email}
              </div>
            )}
          </div>
        </div>
      ),
      width: "235px",
    },

    {
      name: "PROBLEM",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="max-w-[250px] cursor-pointer py-2"
          title={row?.problemDescription}
        >
          <div
            className="line-clamp-2 text-[11px] font-semibold leading-5"
            style={{
              color: COLORS.primary,
            }}
          >
            {row?.problemDescription || "--"}
          </div>

          <div
            className="mt-1 flex items-center gap-1 text-[9px] font-medium"
            style={{
              color: COLORS.secondary,
            }}
          >
            <FiArrowUpRight size={9} />
            View request details
          </div>
        </div>
      ),
      width: "280px",
    },

    {
      name: "TYPE",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="cursor-pointer"
        >
          <span
            className="inline-flex items-center rounded-full px-3 py-1.5 text-[9px] font-extrabold capitalize"
            style={getBadgeTheme(
              row?.serviceRequestType
            )}
          >
            {row?.serviceRequestType || "--"}
          </span>
        </div>
      ),
      width: "155px",
    },

    {
      name: "MODE",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="cursor-pointer"
        >
          <span
            className="inline-flex items-center rounded-full px-3 py-1.5 text-[9px] font-extrabold capitalize"
            style={getBadgeTheme(row?.serviceMode)}
          >
            {row?.serviceMode || "--"}
          </span>
        </div>
      ),
      width: "135px",
    },

    {
      name: "STATUS",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="cursor-pointer"
        >
          <span
            className="inline-flex min-w-[78px] items-center justify-center rounded-full px-3 py-1.5 text-[9px] font-extrabold capitalize"
            style={getBadgeTheme(row?.ticketStatus)}
          >
            {row?.ticketStatus || "--"}
          </span>
        </div>
      ),
      width: "145px",
    },

    {
      name: "ATTACHMENTS",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="cursor-pointer py-2"
        >
          {row?.attachments?.length > 0 ? (
            <div className="relative flex h-11 items-center">
              <div
                className="relative h-11 w-11 overflow-hidden rounded-[11px] bg-background"
                style={{
                  border: `1px solid ${COLORS.accent}`,
                }}
              >
                <img
                  src={row.attachments[0]}
                  alt="Attachment"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {row.attachments.length > 1 && (
                <span
                  className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[8px] font-extrabold text-white"
                  style={{
                    backgroundColor: COLORS.primary,
                  }}
                >
                  +{row.attachments.length - 1}
                </span>
              )}
            </div>
          ) : (
            <div
              className="flex items-center gap-2 text-[9px] font-semibold"
              style={{
                color: COLORS.secondary,
              }}
            >
              <FaPaperclip size={10} />
              <span>No files</span>
            </div>
          )}
        </div>
      ),
      width: "140px",
    },

    {
      name: "TECHNICIAN",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="flex cursor-pointer items-center gap-2.5 py-2"
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{
              color: COLORS.primary,
              backgroundColor: COLORS.accent,
              border: `1px solid ${COLORS.secondary}`,
            }}
          >
            <FaUserCog size={12} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="max-w-[110px] truncate text-[10px] font-bold"
                style={{
                  color: COLORS.primary,
                }}
              >
                {row?.technician?.userName ||
                  "Unassigned"}
              </div>

              {row?.technician?.userName && (
                <Link
                  to={`/users/technician/details?userId=${row?.technician?._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-60 transition-all hover:opacity-100"
                  style={{
                    color: COLORS.secondary,
                  }}
                >
                  <FaExternalLinkAlt size={8} />
                </Link>
              )}
            </div>

            <div
              className="mt-0.5 text-[8px] uppercase tracking-wide"
              style={{
                color: COLORS.secondary,
              }}
            >
              {row?.technician?.userName
                ? "Assigned"
                : "Waiting for assignment"}
            </div>
          </div>
        </div>
      ),
      width: "205px",
    },

    {
      name: "RAISED ON",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="flex cursor-pointer items-center gap-2"
        >
          <IconBox
            size="h-8 w-8"
            radius="rounded-[9px]"
          >
            <FiCalendar size={12} />
          </IconBox>

          <div>
            <div
              className="text-[10px] font-bold"
              style={{
                color: COLORS.primary,
              }}
            >
              {row?.createdAt
                ? moment(row.createdAt).format(
                    "DD MMM YYYY"
                  )
                : "--"}
            </div>

            <div
              className="mt-0.5 text-[9px]"
              style={{
                color: COLORS.secondary,
              }}
            >
              {row?.createdAt
                ? moment(row.createdAt).format(
                    "hh:mm A"
                  )
                : "--"}
            </div>
          </div>
        </div>
      ),
      width: "170px",
    },
  ];

  /* ==========================================================
     RETURN
  ========================================================== */

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-background pb-8">

        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <section className="mb-8">
          <div
            className="relative overflow-hidden rounded-[30px] px-6 py-7 shadow-[0_20px_55px_rgba(10,48,36,0.25)] sm:px-8 sm:py-9"
            style={{
              backgroundColor: COLORS.primary,
            }}
          >
            <div
              className="pointer-events-none absolute -right-24 -top-28 h-[340px] w-[340px] rounded-full blur-[2px]"
              style={{
                backgroundColor: COLORS.secondary,
                opacity: 0.35,
              }}
            />

            <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2.5">

                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                    Services
                  </span>
                </div>

                <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-[34px]">
                  Service Requests
                </h1>

                <p className="mt-2 max-w-[520px] text-[13px] leading-6 text-white/65">
                  Manage, monitor and track customer
                  service requests, technicians, status
                  and attachments from one place.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">

                {/* SORT */}

                <Popover
                  isOpen={sortablePopover}
                  positions={["bottom", "left"]}
                  containerClassName="z-50"
                  onClickOutside={() =>
                    setSortablePopover(false)
                  }
                  content={
                    <div
                      className="mt-2 min-w-[175px] rounded-xl bg-white p-2 shadow-xl"
                      style={{
                        border: `1px solid ${COLORS.accent}`,
                      }}
                    >
                      {[
                        {
                          label: "Newest First",
                          val: -1,
                          Icon: FaSortAmountUpAlt,
                        },
                        {
                          label: "Oldest First",
                          val: 1,
                          Icon: FaSortAmountDownAlt,
                        },
                      ].map(
                        ({
                          label,
                          val,
                          Icon,
                        }) => (
                          <div
                            key={val}
                            onClick={() =>
                              handleSortBy(val)
                            }
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[11px] font-semibold transition"
                            style={{
                              color:
                                sortBy === val
                                  ? COLORS.primary
                                  : COLORS.secondary,
                              backgroundColor:
                                sortBy === val
                                  ? COLORS.accent
                                  : "transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (sortBy !== val) {
                                e.currentTarget.style.backgroundColor =
                                  COLORS.background;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (sortBy !== val) {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                              }
                            }}
                          >
                            <Icon size={13} />
                            {label}
                          </div>
                        )
                      )}
                    </div>
                  }
                >
                  <button
                    onClick={() =>
                      setSortablePopover(
                        !sortablePopover
                      )
                    }
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-[12px] font-semibold text-white/90 transition hover:bg-white/[0.14]"
                  >
                    <HiSortDescending size={15} />
                    Sort
                  </button>
                </Popover>

                {/* FILTER */}

                <button
                  onClick={() =>
                    setFilterDragger(true)
                  }
                  className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-[12px] font-semibold text-white/90 transition hover:bg-white/[0.14]"
                >
                  <MdOutlineTune size={15} />

                  Filter

                  {filterCount > 0 && (
                    <span
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
                      style={{
                        backgroundColor: COLORS.accent,
                        color: COLORS.primary,
                      }}
                    >
                      {filterCount}
                    </span>
                  )}
                </button>

                {/* CREATE REQUEST */}

                <button
                  onClick={() =>
                    history.push(
                      "/services/servicerequests/request"
                    )
                  }
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-extrabold text-white shadow-[0_8px_20px_rgba(10,48,36,0.30)] transition hover:-translate-y-0.5 hover:opacity-90"
                  style={{
                    backgroundColor: COLORS.secondary,
                  }}
                >
                  <FaPlus size={9} />
                  Create Request
                </button>
              </div>
            </div>

            <div
              className="absolute bottom-0 left-8 right-8 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${COLORS.accent}, transparent)`,
                opacity: 0.7,
              }}
            />
          </div>
        </section>

        {/* ====================================================
            KPI CARDS
        ==================================================== */}

        <section className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {[
              {
                title: "Total Requests",
                value: requestStats.total,
                desc: "Requests on this page",
                Icon: FaTicketAlt,
              },
              {
                title: "Open Requests",
                value: requestStats.open,
                desc: "Awaiting resolution",
                Icon: FiActivity,
              },
              {
                title: "Assigned",
                value: requestStats.assigned,
                desc: "With technician",
                Icon: FaUserCog,
              },
              {
                title: "Pending",
                value: requestStats.pending,
                desc: "In progress",
                Icon: FaClock,
              },
            ].map((item) => {
              const Icon = item.Icon;

              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-[0_6px_25px_rgba(10,48,36,0.08)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_22px_45px_rgba(10,48,36,0.15)]"
                  style={{
                    borderColor: COLORS.accent,
                  }}
                >
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-60 transition-all duration-500 group-hover:scale-[1.7]"
                    style={{
                      backgroundColor: COLORS.accent,
                    }}
                  />

                  <div className="relative z-10 flex items-start justify-between">

                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-[14px] transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: COLORS.accent,
                        color: COLORS.primary,
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: COLORS.background,
                        color: COLORS.secondary,
                      }}
                    >
                      <FiArrowUpRight size={14} />
                    </div>
                  </div>

                  <div className="relative z-10 mt-5">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{
                        color: COLORS.secondary,
                      }}
                    >
                      {item.title}
                    </p>

                    <div className="mt-2.5 flex items-end justify-between gap-2">
                      <h3
                        className="text-[30px] font-extrabold leading-none tracking-[-0.05em]"
                        style={{
                          color: COLORS.primary,
                        }}
                      >
                        {item.value}
                      </h3>

                      <span
                        className="mb-0.5 max-w-[105px] text-right text-[9px] font-medium leading-4"
                        style={{
                          color: COLORS.secondary,
                        }}
                      >
                        {item.desc}
                      </span>
                    </div>
                  </div>

                  <div
                    className="absolute bottom-0 left-5 right-5 h-[2px] overflow-hidden rounded-full"
                    style={{
                      backgroundColor: COLORS.accent,
                    }}
                  >
                    <div
                      className="h-full w-0 rounded-full transition-all duration-500 group-hover:w-full"
                      style={{
                        background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            FILTER HEADER
        ==================================================== */}

        <div
          className="mb-4 overflow-hidden rounded-[20px] border bg-white shadow-[0_5px_20px_rgba(10,48,36,0.06)]"
          style={{
            borderColor: COLORS.accent,
          }}
        >
          <div
            className="flex items-center gap-3 border-b px-4 py-3"
            style={{
              borderColor: COLORS.accent,
            }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[9px]"
              style={{
                backgroundColor: COLORS.accent,
                color: COLORS.primary,
              }}
            >
              <FiList size={15} />
            </div>

            <div>
              <h2
                className="text-[12px] font-extrabold"
                style={{
                  color: COLORS.primary,
                }}
              >
                Request Filters
              </h2>

              <p
                className="text-[9px]"
                style={{
                  color: COLORS.secondary,
                }}
              >
                Search and filter service requests
              </p>
            </div>
          </div>

          <div className="p-3">
            <TableHeader
              title="Service Requests"
              data={userList}
              filterValues={handleFilterValues}
              activePage={activePage}
              limit={limit}
            />
          </div>
        </div>

        {/* ====================================================
            REQUEST TABLE
        ==================================================== */}

        <div
          className="overflow-hidden rounded-[22px] border bg-white shadow-[0_18px_42px_rgba(10,48,36,0.10)]"
          style={{
            borderColor: COLORS.accent,
          }}
        >
          <div
            className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            style={{
              borderColor: COLORS.accent,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-[11px]"
                style={{
                  backgroundColor: COLORS.accent,
                  color: COLORS.primary,
                }}
              >
                <FaTicketAlt size={14} />
              </div>

              <div>
                <h2
                  className="text-[13px] font-extrabold"
                  style={{
                    color: COLORS.primary,
                  }}
                >
                  Recent Service Requests
                </h2>

                <p
                  className="mt-0.5 text-[9px] font-medium"
                  style={{
                    color: COLORS.secondary,
                  }}
                >
                  Customer requests and service activity
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex w-fit items-center gap-2 rounded-full border px-3 py-1.5"
                style={{
                  borderColor: COLORS.accent,
                  backgroundColor: COLORS.background,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: COLORS.primary,
                  }}
                />

                <span
                  className="text-[9px] font-extrabold uppercase tracking-wide"
                  style={{
                    color: COLORS.secondary,
                  }}
                >
                  {serviceRequests?.length || 0} Showing
                </span>
              </div>

              <button
                onClick={() =>
                  fetchData({
                    ...filterValues,
                    page: activePage,
                    limit,
                  })
                }
                className="flex h-8 w-8 items-center justify-center rounded-[9px] border transition-all duration-200"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.accent,
                  color: COLORS.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    COLORS.primary;
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    COLORS.background;
                  e.currentTarget.style.color =
                    COLORS.primary;
                }}
                title="Refresh"
              >
                <FiRefreshCw size={12} />
              </button>
            </div>
          </div>

          {/* DATA TABLE */}

          <DataTable
            columns={columns}
            data={serviceRequests || []}
            onRowClicked={(row) =>
              openRequest(row?._id)
            }
            pointerOnHover
            noDataComponent={
              <div className="flex min-h-[330px] w-full flex-col items-center justify-center px-5 text-center">
                <div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-[18px]"
                  style={{
                    backgroundColor: COLORS.accent,
                    color: COLORS.primary,
                  }}
                >
                  <FaTicketAlt size={24} />
                </div>

                <div
                  className="text-[14px] font-extrabold"
                  style={{
                    color: COLORS.primary,
                  }}
                >
                  No Service Requests Found
                </div>

                <div
                  className="mt-1 max-w-[330px] text-[10px] leading-5"
                  style={{
                    color: COLORS.secondary,
                  }}
                >
                  There are no service requests matching
                  the current filters.
                </div>

                <button
                  onClick={() =>
                    history.push(
                      "/services/servicerequests/request"
                    )
                  }
                  className="mt-5 flex items-center gap-2 rounded-[10px] px-4 py-2 text-[10px] font-extrabold text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
                  style={{
                    backgroundColor: COLORS.primary,
                  }}
                >
                  <FaPlus size={8} />
                  Create Request
                </button>
              </div>
            }
            fixedHeader
            fixedHeaderScrollHeight="62vh"
            className="data_table_comp"
            customStyles={{
              table: {
                style: {
                  backgroundColor: "transparent",
                },
              },

              headRow: {
                style: {
                  minHeight: "50px",
                  backgroundColor: COLORS.background,
                  borderBottom: `1px solid ${COLORS.accent}`,
                },
              },

              headCells: {
                style: {
                  fontSize: "9.5px",
                  fontWeight: "800",
                  color: COLORS.primary,
                  overflow: "hidden",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                },
              },

              rows: {
                style: {
                  minHeight: "78px",
                  backgroundColor: "#ffffff",
                  borderBottom: `1px solid ${COLORS.accent}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                },

                highlightOnHoverStyle: {
                  backgroundColor: COLORS.background,
                  borderBottomColor: COLORS.accent,
                  outline: "none",
                  boxShadow: `inset 3px 0 0 ${COLORS.primary}`,
                },
              },

              cells: {
                style: {
                  fontWeight: "600",
                  fontSize: "11px",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                },
              },

              pagination: {
                style: {
                  minHeight: "58px",
                  borderTop: `1px solid ${COLORS.accent}`,
                  backgroundColor: "#ffffff",
                },
              },
            }}
          />

          {/* PAGINATION */}

          <div
            className="overflow-hidden border-t px-3"
            style={{
              borderColor: COLORS.accent,
            }}
          >
            <Pagination
              totalPages={totalPages}
              activePage={activePage}
              limit={limit}
              setPageValue={handlePagination}
              setLimit={handlePageLimit}
            />
          </div>
        </div>
      </div>

      {/* ====================================================
          FILTER DRAWER
      ==================================================== */}

      <MuiDrawer
        open={filterDragger}
        onClose={() =>
          setFilterDragger(false)
        }
        drawerWidth="400px"
      >
        <div className="flex h-full flex-col bg-white p-5">

          {/* DRAWER HEADER */}

          <div
            className="flex items-center gap-3 border-b pb-4"
            style={{
              borderColor: COLORS.accent,
            }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{
                backgroundColor: COLORS.primary,
              }}
            >
              <MdOutlineTune size={18} />
            </div>

            <div>
              <p
                className="font-bold"
                style={{
                  color: COLORS.primary,
                }}
              >
                Filter Requests
              </p>

              <p
                className="text-[10px]"
                style={{
                  color: COLORS.secondary,
                }}
              >
                Narrow down service requests
              </p>
            </div>
          </div>

          {/* FILTER FIELDS */}

          <div className="mt-5 flex-1 space-y-4 overflow-auto">
            {[
              {
                label: "Ticket Status",
                value:
                  ticketStatusSelectedOption,
                onSelect:
                  setTicketStatusSelectedOption,
                options:
                  Object.values(TICKET_STATUS),
              },

              {
                label: "Ticket Type",
                value:
                  ticketTypeSelectedOption,
                onSelect:
                  setTicketTypeSelectedOption,
                options:
                  Object.values(
                    SERVICE_REQUEST_TYPE
                  ),
              },

              {
                label: "Customer",
                value:
                  customerSelectedOption,

                onSelect: (value, id) => {
                  setCustomerSelectedOption(value);
                  setCustomerSelectedId(id);
                },

                options: userList
                  .filter(
                    (user) =>
                      user.role === "customer"
                  )
                  .map(
                    (user) => user.userName
                  ),

                optionsObject: userList.filter(
                  (user) =>
                    user.role === "customer"
                ),
              },

              {
                label: "Rider",
                value:
                  riderSelectedOption,

                onSelect: (value, id) => {
                  setRiderSelectedOption(value);
                  setRiderSelectedId(id);
                },

                options: userList
                  .filter(
                    (user) =>
                      user.role === "rider"
                  )
                  .map(
                    (user) => user.userName
                  ),

                optionsObject: userList.filter(
                  (user) =>
                    user.role === "rider"
                ),
              },

              {
                label: "Technician",
                value:
                  technicianSelectedOption,

                onSelect: (value, id) => {
                  setTechnicianSelectedOption(value);
                  setTechnicianSelectedId(id);
                },

                options: userList
                  .filter(
                    (user) =>
                      user.role === "technician"
                  )
                  .map(
                    (user) => user.userName
                  ),

                optionsObject: userList.filter(
                  (user) =>
                    user.role === "technician"
                ),
              },
            ].map(
              ({
                label,
                value,
                onSelect,
                options,
                optionsObject,
              }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1.5"
                >
                  <label
                    className="text-[10px] font-bold uppercase tracking-wide"
                    style={{
                      color: COLORS.secondary,
                    }}
                  >
                    {label}
                  </label>

                  <Dropdown
                    value={value}
                    placeholder={`Select ${label}`}
                    onSelect={onSelect}
                    options={options || []}
                    optionsObject={optionsObject}
                    disabled={false}
                    containerClassname="w-full"
                    className="cursor-pointer capitalize"
                  />
                </div>
              )
            )}
          </div>

          {/* DRAWER ACTIONS */}

          <div
            className="flex items-center gap-3 border-t pt-4"
            style={{
              borderColor: COLORS.accent,
            }}
          >
            <button
              onClick={handleClearFilter}
              className="h-11 flex-1 rounded-xl border bg-white text-[11px] font-bold transition hover:bg-background"
              style={{
                borderColor: COLORS.secondary,
                color: COLORS.primary,
              }}
            >
              Clear
            </button>

            <button
              onClick={handleFilter}
              className="h-11 flex-1 rounded-xl text-[11px] font-bold text-white transition hover:opacity-90"
              style={{
                backgroundColor: COLORS.primary,
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </MuiDrawer>
    </AnimatedContent>
  );
};

export default TicketManagement;
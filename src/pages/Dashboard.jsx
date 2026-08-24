// import { WindmillContext } from "@windmill/react-ui";
// import dayjs from "dayjs";
// import isBetween from "dayjs/plugin/isBetween";
// import isToday from "dayjs/plugin/isToday";
// import isYesterday from "dayjs/plugin/isYesterday";
// import { useContext, useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import { MdCancelPresentation } from "react-icons/md";

// import {
//   FaUser,
//   FaTools,
//   FaMotorcycle,
//   FaCheckCircle,
//   FaWallet,
//   FaRegChartBar,
// } from "react-icons/fa";

// import { FiArrowUpRight, FiActivity } from "react-icons/fi";

// import useAsync from "@/hooks/useAsync";

// import LineChart from "@/components/chart/LineChart/LineChart";
// import ChartCard from "@/components/chart/ChartCard";
// import ChartCard2 from "@/components/chart/ChartCard2";
// import AnimatedContent from "@/components/common/AnimatedContent";
// import SrChart from "@/components/chart/SrChart";

// import OrderServices from "@/services/OrderServices";
// import DashboardServices from "@/services/DashboardServices";
// import { DecryptData } from "@/utils/DecryptData";

// import { Link } from "react-router-dom";

// dayjs.extend(isBetween);
// dayjs.extend(isToday);
// dayjs.extend(isYesterday);

// const Dashboard = () => {
//   const { t } = useTranslation();
//   const { mode } = useContext(WindmillContext);

//   const [dashData, setDashData] = useState("");

//   /* =========================================================
//       API DATA
//   ========================================================= */

//   const { loading: loadingBestSellerProduct } = useAsync(
//     OrderServices.getBestSellerProductChart,
//   );

//   const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
//     OrderServices.getDashboardCount,
//   );

//   const { data: dashboardOrderAmount, loading: loadingOrderAmount } = useAsync(
//     OrderServices.getDashboardAmount,
//   );

//   useEffect(() => {
//     DashboardServices.getDashboardData()
//       .then((res) => {
//         if (res) {
//           const decodedData = DecryptData(res);
//           setDashData(decodedData?.data || "");
//         }
//       })
//       .catch((err) => {
//         console.log("Dashboard Error:", err);
//       });
//   }, [dashboardOrderAmount]);

//   /* =========================================================
//       COUNTS
//   ========================================================= */

//   const userCount = dashData?.dashBoardCount?.userCount || [];

//   const serviceCount = dashData?.dashBoardCount?.serviceRequestCount || [];

//   const getUserCount = (id) =>
//     userCount.find((item) => item?._id === id)?.count || 0;

//   const getServiceCount = (id) =>
//     serviceCount.find((item) => item?._id === id)?.count || 0;

//   const totalUsers = getUserCount("all_users");

//   const totalCustomers = getUserCount("customer");

//   const totalTechnicians = getUserCount("technician") + getUserCount("admin");

//   const totalRiders = getUserCount("rider");

//   const totalServices = getServiceCount("all_servicerequests");

//   const completedServices = getServiceCount("completed");

//   const pendingServices =
//     getServiceCount("in-progress") + getServiceCount("received");

//   const cancelledServices = getServiceCount("canceled");

//   const closedServices = getServiceCount("closed");

//   /* =========================================================
//     METRIC CARDS
// ========================================================= */

//   const metrics = [
//     {
//       title: "Total Users",
//       value: totalUsers,
//       description: "Registered users",
//       link: "/users",
//       tone: "purple",
//       Icon: FaUser,
//     },
//     {
//       title: "Total Customers",
//       value: totalCustomers,
//       description: "Active customers",
//       link: "/users/customer",
//       tone: "blue",
//       Icon: FaUser,
//     },
//     {
//       title: "Total Technician",
//       value: totalTechnicians,
//       description: "Service technicians",
//       link: "/users/technician",
//       tone: "orange",
//       Icon: FaTools,
//     },
//     {
//       title: "Total Rider",
//       value: totalRiders,
//       description: "Active riders",
//       link: "/users/rider",
//       tone: "green",
//       Icon: FaMotorcycle,
//     },
//     {
//       title: "Total Services",
//       value: totalServices,
//       description: "Service requests",
//       link: "/services/servicerequests",
//       tone: "indigo",
//       Icon: FaRegChartBar,
//     },
//     {
//       title: "Completed Services",
//       value: completedServices,
//       description: "Successfully completed",
//       link: "/services/servicerequests",
//       tone: "emerald",
//       Icon: FaCheckCircle,
//     },
//     {
//       title: "Pending Services",
//       value: pendingServices,
//       description: "Awaiting completion",
//       link: "/services/servicerequests",
//       tone: "amber",
//       Icon: AiOutlineExclamationCircle,
//     },
//     {
//       title: "Cancelled Services",
//       value: cancelledServices,
//       description: "Cancelled requests",
//       link: "/services/servicerequests",
//       tone: "rose",
//       Icon: MdCancelPresentation,
//     },
//   ];

//   /* =========================================================
//     CARD THEMES
// ========================================================= */

//   const toneClasses = {
//     purple: {
//       icon: "bg-purple-500",
//       soft: "bg-purple-50",
//       line: "bg-purple-500",
//     },

//     blue: {
//       icon: "bg-blue-500",
//       soft: "bg-blue-50",
//       line: "bg-blue-500",
//     },

//     orange: {
//       icon: "bg-orange-500",
//       soft: "bg-orange-50",
//       line: "bg-orange-500",
//     },

//     green: {
//       icon: "bg-green-500",
//       soft: "bg-green-50",
//       line: "bg-green-500",
//     },

//     indigo: {
//       icon: "bg-indigo-500",
//       soft: "bg-indigo-50",
//       line: "bg-indigo-500",
//     },

//     emerald: {
//       icon: "bg-emerald-500",
//       soft: "bg-emerald-50",
//       line: "bg-emerald-500",
//     },

//     amber: {
//       icon: "bg-amber-500",
//       soft: "bg-amber-50",
//       line: "bg-amber-500",
//     },

//     rose: {
//       icon: "bg-rose-500",
//       soft: "bg-rose-50",
//       line: "bg-rose-500",
//     },
//   };

//   /* =========================================================
//       RENDER
//   ========================================================= */

//   return (
//     <AnimatedContent>
//       <div className="min-h-screen bg-[#F4F6F8] pb-10">
//         {/* =====================================================
//             DASHBOARD HEADER
//         ====================================================== */}

//         <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//           <div>
//             <div className="mb-3 flex items-center gap-2">
//               <span
//                 className="
//                   h-2
//                   w-2
//                   rounded-full
//                   bg-[var(--primary-color)]
//                   shadow-[0_0_0_5px_rgba(0,0,0,0.04)]
//                 "
//               />

//               <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#89919D]">
//                 Admin Dashboard
//               </span>
//             </div>

//             <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">
//               {t("Dashboard")}
//             </h1>

//             <p className="mt-2 max-w-xl text-sm leading-6 text-[#7C8592]">
//               {t("Here’s an overview of your service activity")}
//             </p>
//           </div>

//           {/* SYSTEM STATUS */}

//           <div
//             className="
//               flex
//               items-center
//               self-start
//               rounded-2xl
//               border
//               border-[#E4E8ED]
//               bg-white
//               px-4
//               py-3
//               shadow-[0_3px_12px_rgba(30,40,55,0.04)]
//               lg:self-auto
//             "
//           >
//             <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F8F4]">
//               <FiActivity className="text-[17px] text-emerald-500" />
//             </div>

//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA1AC]">
//                 System Status
//               </p>

//               <div className="mt-0.5 flex items-center gap-2">
//                 <span className="h-2 w-2 rounded-full bg-emerald-500" />

//                 <span className="text-xs font-bold text-[#414853]">
//                   All systems operational
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* =====================================================
//             OVERVIEW
//         ====================================================== */}

//         <section className="mb-7">
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {metrics.map((item) => {
//               const tone = toneClasses[item.tone];
//               const Icon = item.Icon;

//               return (
//                 <Link key={item.title} to={item.link} className="group block">
//                   <div
//                     className="
//             relative
//             min-h-[158px]
//             overflow-hidden
//             rounded-[22px]
//             border
//             border-[#E4E8ED]
//             bg-white
//             p-5
//             shadow-[0_3px_12px_rgba(30,40,55,0.035)]
//             transition-all
//             duration-300
//             hover:-translate-y-1
//             hover:shadow-[0_18px_38px_rgba(30,40,55,0.10)]
//           "
//                   >
//                     {/* Background */}
//                     <div
//                       className={`
//               pointer-events-none
//               absolute
//               -right-12
//               -top-12
//               h-32
//               w-32
//               rounded-full
//               ${tone.soft}
//               opacity-80
//               transition-transform
//               duration-500
//               group-hover:scale-[1.45]
//             `}
//                     />

//                     <div
//                       className={`
//               pointer-events-none
//               absolute
//               -bottom-14
//               -left-14
//               h-24
//               w-24
//               rounded-full
//               ${tone.soft}
//               opacity-40
//             `}
//                     />

//                     {/* Top */}
//                     <div className="relative z-20 flex items-start justify-between">
//                       {/* ICON */}
//                       <div
//                         className={`
//                 relative
//                 z-30
//                 flex
//                 h-12
//                 w-12
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-[15px]
//                 ${tone.icon}
//                 text-white
//                 shadow-[0_8px_18px_rgba(0,0,0,0.12)]
//                 transition-all
//                 duration-300
//                 group-hover:scale-110
//                 group-hover:rotate-2
//               `}
//                       >
//                         <Icon
//                           size={21}
//                           color="#ffffff"
//                           style={{
//                             display: "block",
//                             minWidth: "21px",
//                             minHeight: "21px",
//                             color: "#ffffff",
//                             fill: "currentColor",
//                           }}
//                         />
//                       </div>

//                       {/* Arrow */}
//                       <div
//                         className="
//                 relative
//                 z-30
//                 flex
//                 h-8
//                 w-8
//                 items-center
//                 justify-center
//                 rounded-full
//                 bg-[#F7F8FA]
//                 text-[#A0A7B1]
//                 transition-all
//                 duration-300
//                 group-hover:bg-[#20242B]
//                 group-hover:text-white
//               "
//                       >
//                         <FiArrowUpRight size={14} />
//                       </div>
//                     </div>

//                     {/* Content */}
//                     <div className="relative z-20 mt-6">
//                       <div className="flex items-center justify-between">
//                         <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8B94A0]">
//                           {item.title}
//                         </p>

//                         <span
//                           className={`
//                   h-1.5
//                   w-1.5
//                   rounded-full
//                   ${tone.line}
//                 `}
//                         />
//                       </div>

//                       <div className="mt-2 flex items-end justify-between gap-2">
//                         <h3 className="text-[28px] font-extrabold leading-none tracking-tight text-[#22272F]">
//                           {loadingOrderCount ? "—" : item.value}
//                         </h3>

//                         <span className="text-right text-[10px] font-medium text-[#A2A9B3]">
//                           {item.description}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Bottom Accent */}
//                     <div className="absolute bottom-0 left-5 right-5 z-20 h-[3px] overflow-hidden rounded-full bg-[#F0F2F5]">
//                       <div
//                         className={`
//                 h-full
//                 w-0
//                 ${tone.line}
//                 rounded-full
//                 transition-all
//                 duration-500
//                 group-hover:w-full
//               `}
//                       />
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </section>

//         {/* =====================================================
//             FEATURED STATS
//         ====================================================== */}

//         <section className="mb-7">
//           <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//             {/* CLOSED SERVICE REQUEST */}

//             <div
//               className="
//                 group
//                 relative
//                 overflow-hidden
//                 rounded-[22px]
//                 border
//                 border-[#E4E8ED]
//                 bg-white
//                 p-6
//                 shadow-[0_3px_12px_rgba(30,40,55,0.035)]
//                 transition-all
//                 duration-300
//                 hover:-translate-y-1
//                 hover:shadow-[0_18px_38px_rgba(30,40,55,0.09)]
//               "
//             >
//               <div
//                 className="
//                   pointer-events-none
//                   absolute
//                   -right-10
//                   -top-10
//                   h-32
//                   w-32
//                   rounded-full
//                   bg-emerald-50
//                   transition-transform
//                   duration-500
//                   group-hover:scale-[1.5]
//                 "
//               />

//               <div className="relative z-10 flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div
//                     className="
//                       flex
//                       h-14
//                       w-14
//                       shrink-0
//                       items-center
//                       justify-center
//                       rounded-[17px]
//                       bg-emerald-500
//                       text-white
//                       shadow-lg
//                       shadow-emerald-100
//                     "
//                   >
//                     <FaCheckCircle
//                       style={{
//                         display: "block",
//                         width: "21px",
//                         height: "21px",
//                         color: "#ffffff",
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9199A4]">
//                       Service Performance
//                     </p>

//                     <h3 className="mt-1 text-base font-bold text-[#282D35]">
//                       Closed Service Request
//                     </h3>
//                   </div>
//                 </div>

//                 <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
//                   CLOSED
//                 </span>
//               </div>

//               <div className="relative z-10 mt-7 flex items-end justify-between">
//                 <div>
//                   <p className="text-[34px] font-extrabold leading-none text-[#22272F]">
//                     {loadingOrderCount ? "—" : closedServices}
//                   </p>

//                   <p className="mt-2 text-xs text-[#9AA2AC]">
//                     Successfully completed service workflow
//                   </p>
//                 </div>

//                 <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#EEF1F3]">
//                   <div className="h-full w-[72%] rounded-full bg-emerald-500" />
//                 </div>
//               </div>
//             </div>

//             {/* TOTAL REVENUE */}

//             <div
//               className="
//                 group
//                 relative
//                 overflow-hidden
//                 rounded-[22px]
//                 border
//                 border-[#E4E8ED]
//                 bg-white
//                 p-6
//                 shadow-[0_3px_12px_rgba(30,40,55,0.035)]
//                 transition-all
//                 duration-300
//                 hover:-translate-y-1
//                 hover:shadow-[0_18px_38px_rgba(30,40,55,0.09)]
//               "
//             >
//               <div
//                 className="
//                   pointer-events-none
//                   absolute
//                   -right-10
//                   -top-10
//                   h-32
//                   w-32
//                   rounded-full
//                   bg-blue-50
//                   transition-transform
//                   duration-500
//                   group-hover:scale-[1.5]
//                 "
//               />

//               <div className="relative z-10 flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div
//                     className="
//                       flex
//                       h-14
//                       w-14
//                       shrink-0
//                       items-center
//                       justify-center
//                       rounded-[17px]
//                       bg-blue-500
//                       text-white
//                       shadow-lg
//                       shadow-blue-100
//                     "
//                   >
//                     <FaWallet
//                       style={{
//                         display: "block",
//                         width: "20px",
//                         height: "20px",
//                         color: "#ffffff",
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9199A4]">
//                       Financial Overview
//                     </p>

//                     <h3 className="mt-1 text-base font-bold text-[#282D35]">
//                       Total Revenue
//                     </h3>
//                   </div>
//                 </div>

//                 <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600">
//                   REVENUE
//                 </span>
//               </div>

//               <div className="relative z-10 mt-7 flex items-end justify-between">
//                 <div>
//                   <p className="text-[34px] font-extrabold leading-none text-[#22272F]">
//                     {loadingOrderCount
//                       ? "—"
//                       : dashboardOrderCount?.totalDeliveredOrder || 0}
//                   </p>

//                   <p className="mt-2 text-xs text-[#9AA2AC]">
//                     Based on delivered orders
//                   </p>
//                 </div>

//                 <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#EEF1F3]">
//                   <div className="h-full w-[64%] rounded-full bg-blue-500" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* =====================================================
//             ANALYTICS
//         ====================================================== */}

//         <section>
//           <div className="mb-4">
//             <h2 className="text-base font-bold text-[#282D35]">Analytics</h2>

//             <p className="mt-1 text-xs text-[#929AA5]">
//               Monitor your service activity and recent requests
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.08fr_0.92fr]">
//             {/* SERVICE REQUEST CHART */}

//             <ChartCard
//               mode={mode}
//               loading={loadingOrderAmount}
//               title={t("Service Requests")}
//             >
//               <div className="w-full overflow-x-auto">
//                 <LineChart salesReport={dashData?.formattedReport} />
//               </div>
//             </ChartCard>

//             {/* RECENT SERVICE REQUESTS */}

//             <ChartCard2
//               mode={mode}
//               loading={loadingBestSellerProduct}
//               title={t("Recent Service Requests")}
//               data={dashData?.recentServiceRequests || []}
//             >
//               <SrChart recentSr={dashData?.recentServiceRequests || []} />
//             </ChartCard2>
//           </div>
//         </section>
//       </div>
//     </AnimatedContent>
//   );
// };

// export default Dashboard;

import { WindmillContext } from "@windmill/react-ui";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  FaUser,
  FaTools,
  FaMotorcycle,
  FaCheckCircle,
  FaWallet,
  FaRegChartBar,
} from "react-icons/fa";

import {
  FiArrowUpRight,
  FiActivity,
  FiUsers,
  FiTool,
  FiClock,
  FiXCircle,
  FiCheck,
  FiTrendingUp,
  FiCommand,
  FiCalendar,
  FiChevronRight,
} from "react-icons/fi";

import { AiOutlineExclamationCircle } from "react-icons/ai";
import { MdCancelPresentation } from "react-icons/md";

import useAsync from "@/hooks/useAsync";

import LineChart from "@/components/chart/LineChart/LineChart";
import ChartCard from "@/components/chart/ChartCard";
import ChartCard2 from "@/components/chart/ChartCard2";
import AnimatedContent from "@/components/common/AnimatedContent";
import SrChart from "@/components/chart/SrChart";

import OrderServices from "@/services/OrderServices";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";

import { Link } from "react-router-dom";

dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const Dashboard = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);

  const [dashData, setDashData] = useState("");

  /* =========================================================
      API DATA
  ========================================================= */

  const { loading: loadingBestSellerProduct } = useAsync(
    OrderServices.getBestSellerProductChart,
  );

  const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
    OrderServices.getDashboardCount,
  );

  const { data: dashboardOrderAmount, loading: loadingOrderAmount } = useAsync(
    OrderServices.getDashboardAmount,
  );

  useEffect(() => {
    DashboardServices.getDashboardData()
      .then((res) => {
        if (res) {
          const decodedData = DecryptData(res);
          setDashData(decodedData?.data || "");
        }
      })
      .catch((err) => {
        console.log("Dashboard Error:", err);
      });
  }, [dashboardOrderAmount]);

  /* =========================================================
      COUNTS
  ========================================================= */

  const userCount = dashData?.dashBoardCount?.userCount || [];
  const serviceCount = dashData?.dashBoardCount?.serviceRequestCount || [];

  const getUserCount = (id) =>
    userCount.find((item) => item?._id === id)?.count || 0;

  const getServiceCount = (id) =>
    serviceCount.find((item) => item?._id === id)?.count || 0;

  const totalUsers = getUserCount("all_users");
  const totalCustomers = getUserCount("customer");

  const totalTechnicians = getUserCount("technician") + getUserCount("admin");

  const totalRiders = getUserCount("rider");

  const totalServices = getServiceCount("all_servicerequests");
  const completedServices = getServiceCount("completed");

  const pendingServices =
    getServiceCount("in-progress") + getServiceCount("received");

  const cancelledServices = getServiceCount("canceled");
  const closedServices = getServiceCount("closed");

  /* =========================================================
      METRICS
  ========================================================= */

  const metrics = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "Registered users",
      link: "/users",
      Icon: FaUser,
      SmallIcon: FiUsers,
      accent: "bg-[#2563EB]",
      accentText: "text-[#2563EB]",
      soft: "bg-[#EFF6FF]",
    },
    {
      title: "Customers",
      value: totalCustomers,
      description: "Active customers",
      link: "/users/customer",
      Icon: FaUser,
      SmallIcon: FiUsers,
      accent: "bg-[#0EA5E9]",
      accentText: "text-[#0284C7]",
      soft: "bg-[#F0F9FF]",
    },
    {
      title: "Technicians",
      value: totalTechnicians,
      description: "Service technicians",
      link: "/users/technician",
      Icon: FaTools,
      SmallIcon: FiTool,
      accent: "bg-[#4F46E5]",
      accentText: "text-[#4F46E5]",
      soft: "bg-[#EEF2FF]",
    },
    {
      title: "Riders",
      value: totalRiders,
      description: "Active riders",
      link: "/users/rider",
      Icon: FaMotorcycle,
      SmallIcon: FiActivity,
      accent: "bg-[#0891B2]",
      accentText: "text-[#0E7490]",
      soft: "bg-[#ECFEFF]",
    },
    {
      title: "Total Services",
      value: totalServices,
      description: "Service requests",
      link: "/services/servicerequests",
      Icon: FaRegChartBar,
      SmallIcon: FiActivity,
      accent: "bg-[#1D4ED8]",
      accentText: "text-[#1D4ED8]",
      soft: "bg-[#EFF6FF]",
    },
    {
      title: "Completed",
      value: completedServices,
      description: "Successfully completed",
      link: "/services/servicerequests",
      Icon: FaCheckCircle,
      SmallIcon: FiCheck,
      accent: "bg-[#059669]",
      accentText: "text-[#047857]",
      soft: "bg-[#ECFDF5]",
    },
    {
      title: "Pending",
      value: pendingServices,
      description: "Awaiting completion",
      link: "/services/servicerequests",
      Icon: AiOutlineExclamationCircle,
      SmallIcon: FiClock,
      accent: "bg-[#D97706]",
      accentText: "text-[#B45309]",
      soft: "bg-[#FFFBEB]",
    },
    {
      title: "Cancelled",
      value: cancelledServices,
      description: "Cancelled requests",
      link: "/services/servicerequests",
      Icon: MdCancelPresentation,
      SmallIcon: FiXCircle,
      accent: "bg-[#E11D48]",
      accentText: "text-[#BE123C]",
      soft: "bg-[#FFF1F2]",
    },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#F4F7FB] pb-12">
        {/* =====================================================
            PREMIUM HEADER
        ====================================================== */}

        <section className="mb-8">
          <div
            className="
              relative
              overflow-hidden
              rounded-[30px]
              bg-[#0B1220]
              px-6
              py-7
              shadow-[0_20px_55px_rgba(15,23,42,0.15)]
              sm:px-8
              sm:py-9
            "
          >
            {/* Blue glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-28
                h-[340px]
                w-[340px]
                rounded-full
                bg-[#2563EB]/20
                blur-[2px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-32
                right-[24%]
                h-[240px]
                w-[240px]
                rounded-full
                bg-[#0EA5E9]/10
                blur-2xl
              "
            />

            {/* Grid pattern */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.035]
                [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
                [background-size:34px_34px]
              "
            />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}

              <div>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8]/50" />

                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#38BDF8]" />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">
                    Fixora Admin
                  </span>
                </div>

                <h1
                  className="
                    text-[31px]
                    font-extrabold
                    leading-[1.05]
                    tracking-[-0.045em]
                    text-white
                    sm:text-[40px]
                  "
                >
                  {t("Dashboard")}
                </h1>

                <p className="mt-3 max-w-[570px] text-[13px] leading-6 text-white/50">
                  Your operational command center for users, services,
                  technicians and platform activity.
                </p>
              </div>

              {/* Right */}

              <div className="flex flex-wrap items-center gap-3">
                {/* System status */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-white/[0.055]
                    px-4
                    py-3
                    backdrop-blur-xl
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#2563EB]
                      text-white
                      shadow-[0_8px_20px_rgba(37,99,235,0.35)]
                    "
                  >
                    <FiActivity size={16} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                      System status
                    </p>

                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                      <span className="text-xs font-bold text-white/85">
                        Operational
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date */}

                <div
                  className="
                    hidden
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-white/[0.055]
                    px-4
                    py-3
                    backdrop-blur-xl
                    sm:flex
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/[0.08]
                      text-[#60A5FA]
                    "
                  >
                    <FiCalendar size={16} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Today
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-white/85">
                      {dayjs().format("DD MMM YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom accent */}

            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#2563EB]/50 to-transparent" />
          </div>
        </section>

        {/* =====================================================
            OVERVIEW HEADER
        ====================================================== */}

        <section className="mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#E8F0FF]
                  text-[#2563EB]
                "
              >
                <FiCommand size={16} />
              </div>

              <div>
                <h2 className="text-[16px] font-extrabold tracking-[-0.025em] text-[#111827]">
                  Overview
                </h2>

                <p className="mt-0.5 text-[11px] text-[#8993A5]">
                  Your platform at a glance
                </p>
              </div>
            </div>

            <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-[#A0A8B8] sm:block">
              08 Metrics
            </span>
          </div>
        </section>

        {/* =====================================================
            METRIC CARDS
        ====================================================== */}

        <section className="mb-9">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item) => {
              const Icon = item.Icon;
              const SmallIcon = item.SmallIcon;

              return (
                <Link key={item.title} to={item.link} className="group block">
                  <div
                    className="
                      relative
                      min-h-[170px]
                      overflow-hidden
                      rounded-[24px]
                      border
                      border-[#E5EAF1]
                      bg-white
                      p-5
                      shadow-[0_6px_25px_rgba(15,23,42,0.035)]
                      transition-all
                      duration-300
                      ease-out
                      hover:-translate-y-1.5
                      hover:border-[#C9D7EF]
                      hover:shadow-[0_22px_45px_rgba(15,23,42,0.09)]
                    "
                  >
                    {/* Background glow */}

                    <div
                      className={`
                        pointer-events-none
                        absolute
                        -right-12
                        -top-12
                        h-32
                        w-32
                        rounded-full
                        ${item.soft}
                        opacity-70
                        transition-all
                        duration-500
                        group-hover:scale-[1.7]
                      `}
                    />

                    {/* Top */}

                    <div className="relative z-10 flex items-start justify-between">
                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-[14px]
                          ${item.soft}
                          ${item.accentText}
                          transition-all
                          duration-300
                          group-hover:scale-110
                          group-hover:shadow-lg
                        `}
                      >
                        <Icon size={18} />
                      </div>

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-[#F4F6FA]
                          text-[#98A2B3]
                          transition-all
                          duration-300
                          group-hover:bg-[#111827]
                          group-hover:text-white
                        "
                      >
                        <FiArrowUpRight size={14} />
                      </div>
                    </div>

                    {/* Content */}

                    <div className="relative z-10 mt-5">
                      <div className="flex items-center justify-between">
                        <p
                          className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-[#8B95A7]
                          "
                        >
                          {item.title}
                        </p>

                        <SmallIcon
                          size={13}
                          className={`
                            ${item.accentText}
                            opacity-40
                            transition-all
                            duration-300
                            group-hover:opacity-100
                          `}
                        />
                      </div>

                      <div className="mt-2.5 flex items-end justify-between gap-2">
                        <h3
                          className="
                            text-[30px]
                            font-extrabold
                            leading-none
                            tracking-[-0.05em]
                            text-[#111827]
                          "
                        >
                          {loadingOrderCount ? "—" : item.value}
                        </h3>

                        <span
                          className="
                            mb-0.5
                            max-w-[105px]
                            text-right
                            text-[9px]
                            font-medium
                            leading-4
                            text-[#A0A8B8]
                          "
                        >
                          {item.description}
                        </span>
                      </div>
                    </div>

                    {/* Bottom progress */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-5
                        right-5
                        h-[2px]
                        overflow-hidden
                        rounded-full
                        bg-[#EDF0F5]
                      "
                    >
                      <div
                        className={`
                          h-full
                          w-0
                          rounded-full
                          ${item.accent}
                          transition-all
                          duration-500
                          group-hover:w-full
                        `}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            PERFORMANCE
        ====================================================== */}

        <section className="mb-9">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#EEF2FF]
                  text-[#4F46E5]
                "
              >
                <FiTrendingUp size={16} />
              </div>

              <div>
                <h2 className="text-[16px] font-extrabold tracking-[-0.025em] text-[#111827]">
                  Performance
                </h2>

                <p className="mt-0.5 text-[11px] text-[#8993A5]">
                  Key operational indicators
                </p>
              </div>
            </div>

            <div
              className="
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-[#DDE6F4]
                bg-white
                px-3
                py-1.5
                sm:flex
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[9px] font-bold uppercase tracking-wider text-[#788397]">
                Live Overview
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* CLOSED SERVICES */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[26px]
                bg-[#0F172A]
                p-6
                shadow-[0_15px_40px_rgba(15,23,42,0.12)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_25px_55px_rgba(15,23,42,0.18)]
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-24
                  h-60
                  w-60
                  rounded-full
                  border
                  border-[#60A5FA]/10
                  transition-transform
                  duration-700
                  group-hover:scale-125
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-20
                  left-[30%]
                  h-44
                  w-44
                  rounded-full
                  bg-[#2563EB]/10
                  blur-2xl
                "
              />

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-[15px]
                      bg-[#2563EB]
                      text-white
                      shadow-[0_10px_25px_rgba(37,99,235,0.28)]
                    "
                  >
                    <FaCheckCircle size={19} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                      Service performance
                    </p>

                    <h3 className="mt-1 text-base font-bold text-white">
                      Closed Service Requests
                    </h3>
                  </div>
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-white/[0.08]
                    bg-white/[0.05]
                    px-3
                    py-1
                    text-[9px]
                    font-bold
                    tracking-wider
                    text-white/55
                  "
                >
                  CLOSED
                </span>
              </div>

              <div className="relative z-10 mt-8 flex items-end justify-between gap-5">
                <div>
                  <p
                    className="
                      text-[40px]
                      font-extrabold
                      leading-none
                      tracking-[-0.05em]
                      text-white
                    "
                  >
                    {loadingOrderCount ? "—" : closedServices}
                  </p>

                  <p className="mt-2 max-w-[250px] text-[11px] leading-5 text-white/35">
                    Successfully completed service workflow
                  </p>
                </div>

                <div className="w-28">
                  <div className="mb-2 flex items-center justify-between text-[9px] font-bold text-white/35">
                    <span>Progress</span>
                    <span>72%</span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                    <div className="h-full w-[72%] rounded-full bg-[#60A5FA]" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-5 flex items-center gap-1.5 text-[9px] font-semibold text-white/25">
                <span>Service workflow</span>
                <FiChevronRight size={11} />
              </div>
            </div>

            {/* REVENUE */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-[#E3E8F0]
                bg-white
                p-6
                shadow-[0_8px_30px_rgba(15,23,42,0.045)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#CBD8ED]
                hover:shadow-[0_22px_50px_rgba(15,23,42,0.09)]
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-48
                  w-48
                  rounded-full
                  bg-[#EFF6FF]
                  transition-transform
                  duration-700
                  group-hover:scale-125
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-20
                  left-[35%]
                  h-40
                  w-40
                  rounded-full
                  bg-[#F0F9FF]
                "
              />

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-[15px]
                      bg-[#E8F0FF]
                      text-[#2563EB]
                      transition-all
                      duration-300
                      group-hover:scale-105
                      group-hover:bg-[#2563EB]
                      group-hover:text-white
                    "
                  >
                    <FaWallet size={18} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A0A8B8]">
                      Financial overview
                    </p>

                    <h3 className="mt-1 text-base font-bold text-[#111827]">
                      Total Revenue
                    </h3>
                  </div>
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-[#DCE7FA]
                    bg-[#F1F6FF]
                    px-3
                    py-1
                    text-[9px]
                    font-bold
                    tracking-wider
                    text-[#2563EB]
                  "
                >
                  REVENUE
                </span>
              </div>

              <div className="relative z-10 mt-8 flex items-end justify-between gap-5">
                <div>
                  <p
                    className="
                      text-[40px]
                      font-extrabold
                      leading-none
                      tracking-[-0.05em]
                      text-[#111827]
                    "
                  >
                    {loadingOrderCount
                      ? "—"
                      : dashboardOrderCount?.totalDeliveredOrder || 0}
                  </p>

                  <p className="mt-2 max-w-[250px] text-[11px] leading-5 text-[#9AA3B2]">
                    Based on delivered orders
                  </p>
                </div>

                <div className="w-28">
                  <div className="mb-2 flex items-center justify-between text-[9px] font-bold text-[#A0A8B8]">
                    <span>Activity</span>
                    <span>64%</span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-[#EDF1F7]">
                    <div className="h-full w-[64%] rounded-full bg-[#2563EB]" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-5 flex items-center gap-1.5 text-[9px] font-semibold text-[#A0A8B8]">
                <span>Delivered order activity</span>
                <FiChevronRight size={11} />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ANALYTICS
        ====================================================== */}

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#E8F7FF]
                  text-[#0284C7]
                "
              >
                <FaRegChartBar size={14} />
              </div>

              <div>
                <h2 className="text-[16px] font-extrabold tracking-[-0.025em] text-[#111827]">
                  Analytics
                </h2>

                <p className="mt-0.5 text-[11px] text-[#8993A5]">
                  Monitor service activity and recent requests
                </p>
              </div>
            </div>

            <div
              className="
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-[#E1E7F0]
                bg-white
                px-3
                py-1.5
                shadow-sm
                sm:flex
              "
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />

                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-wider text-[#7E899B]">
                Live data
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.08fr_0.92fr]">
            {/* SERVICE REQUEST CHART */}

            <div className="min-w-0">
              <ChartCard
                mode={mode}
                loading={loadingOrderAmount}
                title={t("Service Requests")}
              >
                <div className="w-full overflow-x-auto">
                  <LineChart salesReport={dashData?.formattedReport} />
                </div>
              </ChartCard>
            </div>

            {/* RECENT REQUESTS */}

            <div className="min-w-0">
              <ChartCard2
                mode={mode}
                loading={loadingBestSellerProduct}
                title={t("Recent Service Requests")}
                data={dashData?.recentServiceRequests || []}
              >
                <SrChart recentSr={dashData?.recentServiceRequests || []} />
              </ChartCard2>
            </div>
          </div>
        </section>
      </div>
    </AnimatedContent>
  );
};

export default Dashboard;

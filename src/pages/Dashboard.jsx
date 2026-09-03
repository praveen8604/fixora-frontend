
// import { WindmillContext } from "@windmill/react-ui";
// import dayjs from "dayjs";
// import isBetween from "dayjs/plugin/isBetween";
// import isToday from "dayjs/plugin/isToday";
// import isYesterday from "dayjs/plugin/isYesterday";
// import { useContext, useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// import {
//   FaUser,
//   FaTools,
//   FaMotorcycle,
//   FaCheckCircle,
//   FaWallet,
//   FaRegChartBar,
// } from "react-icons/fa";

// import {
//   FiArrowUpRight,
//   FiActivity,
//   FiUsers,
//   FiTool,
//   FiClock,
//   FiXCircle,
//   FiCheck,
//   FiTrendingUp,
//   FiCommand,
//   FiCalendar,
//   FiChevronRight,
// } from "react-icons/fi";

// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import { MdCancelPresentation } from "react-icons/md";

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
//     OrderServices.getBestSellerProductChart
//   );

//   const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
//     OrderServices.getDashboardCount
//   );

//   const { data: dashboardOrderAmount, loading: loadingOrderAmount } = useAsync(
//     OrderServices.getDashboardAmount
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

//   const totalTechnicians =
//     getUserCount("technician") + getUserCount("admin");

//   const totalRiders = getUserCount("rider");

//   const totalServices = getServiceCount("all_servicerequests");
//   const completedServices = getServiceCount("completed");

//   const pendingServices =
//     getServiceCount("in-progress") + getServiceCount("received");

//   const cancelledServices = getServiceCount("canceled");
//   const closedServices = getServiceCount("closed");

//   /* =========================================================
//       METRICS
//   ========================================================= */

//   const metrics = [
//     {
//       title: "Total Users",
//       value: totalUsers,
//       description: "Registered users",
//       link: "/users",
//       Icon: FaUser,
//       SmallIcon: FiUsers,
//     },
//     {
//       title: "Customers",
//       value: totalCustomers,
//       description: "Active customers",
//       link: "/users/customer",
//       Icon: FaUser,
//       SmallIcon: FiUsers,
//     },
//     {
//       title: "Technicians",
//       value: totalTechnicians,
//       description: "Service technicians",
//       link: "/users/technician",
//       Icon: FaTools,
//       SmallIcon: FiTool,
//     },
//     {
//       title: "Riders",
//       value: totalRiders,
//       description: "Active riders",
//       link: "/users/rider",
//       Icon: FaMotorcycle,
//       SmallIcon: FiActivity,
//     },
//     {
//       title: "Total Services",
//       value: totalServices,
//       description: "Service requests",
//       link: "/services/servicerequests",
//       Icon: FaRegChartBar,
//       SmallIcon: FiActivity,
//     },
//     {
//       title: "Completed",
//       value: completedServices,
//       description: "Completed requests",
//       link: "/services/servicerequests",
//       Icon: FaCheckCircle,
//       SmallIcon: FiCheck,
//     },
//     {
//       title: "Pending",
//       value: pendingServices,
//       description: "Awaiting completion",
//       link: "/services/servicerequests",
//       Icon: AiOutlineExclamationCircle,
//       SmallIcon: FiClock,
//     },
//     {
//       title: "Cancelled",
//       value: cancelledServices,
//       description: "Cancelled requests",
//       link: "/services/servicerequests",
//       Icon: MdCancelPresentation,
//       SmallIcon: FiXCircle,
//     },
//   ];

//   return (
//     <AnimatedContent>
//       <div className="min-h-screen bg-[#FFFBE9] pb-10">

//         {/* =====================================================
//             DASHBOARD HEADER
//         ====================================================== */}

//         <section className="mb-7">
//   <div
//     className="
//       relative
//       overflow-hidden
//       rounded-[24px]
//       border
//       border-[#AD8B73]
//       bg-[#59483D]
//       px-6
//       py-7
//       shadow-[0_12px_35px_rgba(89,72,61,0.16)]
//       sm:px-8
//       sm:py-8
//     "
//   >
//     <div
//       className="
//         relative
//         z-10
//         flex
//         flex-col
//         gap-6
//         sm:flex-row
//         sm:items-center
//         sm:justify-between
//       "
//     >
//       {/* LEFT */}
//       <div>
//         <h1
//           className="
//             text-[30px]
//             font-extrabold
//             leading-tight
//             tracking-[-0.04em]
//             text-white
//             sm:text-[38px]
//           "
//         >
//           {t("Dashboard")}
//         </h1>

//         <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#E3CAA5]">
//           Manage users, services and daily activities from one place.
//         </p>
//       </div>

//       {/* RIGHT - TODAY */}
//       <div
//         className="
//           flex
//           w-fit
//           items-center
//           gap-3
//           rounded-2xl
//           border
//           border-[#CEAB93]
//           bg-[#59483D]
//           px-4
//           py-3
//         "
//       >
//         <div
//           className="
//             flex
//             h-9
//             w-9
//             items-center
//             justify-center
//             rounded-xl
//             bg-[#E3CAA5]
//             text-[#59483D]
//           "
//         >
//           <FiCalendar size={16} />
//         </div>

//         <div>
//           <p className="text-[10px] font-medium text-[#CEAB93]">
//             Today
//           </p>

//           <p className="mt-0.5 text-sm font-bold text-white">
//             {dayjs().format("DD MMM YYYY")}
//           </p>
//         </div>
//       </div>
//     </div>

//     {/* Bottom Accent */}
//     <div
//       className="
//         absolute
//         bottom-0
//         left-8
//         right-8
//         h-px
//         bg-[#CEAB93]
//       "
//     />
//   </div>
// </section>

//         {/* =====================================================
//             OVERVIEW
//         ====================================================== */}

//         <section className="mb-5">
//           <div className="flex items-center gap-3">

//             <div
//               className="
//                 flex
//                 h-9
//                 w-9
//                 items-center
//                 justify-center
//                 rounded-[10px]
//                 border
//                 border-[#E3CAA5]
//                 bg-white
//                 text-[#AD8B73]
//               "
//             >
//               <FiCommand size={16} />
//             </div>

//             <div>
//               <h2 className="text-[17px] font-extrabold text-[#59483D]">
//                 Overview
//               </h2>

//               <p className="mt-0.5 text-[11px] text-[#75665C]">
//                 A quick look at your platform
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* =====================================================
//             METRIC CARDS
//         ====================================================== */}

//         <section className="mb-9">
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

//             {metrics.map((item) => {
//               const Icon = item.Icon;
//               const SmallIcon = item.SmallIcon;

//               return (
//                 <Link
//                   key={item.title}
//                   to={item.link}
//                   className="group block"
//                 >
//                   <div
//                     className="
//                       relative
//                       min-h-[168px]
//                       overflow-hidden
//                       rounded-[22px]
//                       border
//                       border-[#E3CAA5]
//                       bg-white
//                       p-5
//                       shadow-[0_5px_20px_rgba(92,70,54,0.045)]
//                       transition-all
//                       duration-300
//                       hover:-translate-y-1
//                       hover:border-[#CEAB93]
//                       hover:shadow-[0_16px_35px_rgba(92,70,54,0.12)]
//                     "
//                   >
//                     <div className="flex items-start justify-between">

//                       <div
//                         className="
//                           flex
//                           h-11
//                           w-11
//                           items-center
//                           justify-center
//                           rounded-[13px]
//                           border
//                           border-[#E3CAA5]
//                           bg-[#FFFBE9]
//                           text-[#AD8B73]
//                           transition-all
//                           duration-300
//                           group-hover:border-[#AD8B73]
//                           group-hover:bg-[#AD8B73]
//                           group-hover:text-white
//                         "
//                       >
//                         <Icon size={18} />
//                       </div>

//                       <div
//                         className="
//                           flex
//                           h-8
//                           w-8
//                           items-center
//                           justify-center
//                           rounded-full
//                           border
//                           border-[#E3CAA5]
//                           bg-[#FFFBE9]
//                           text-[#AD8B73]
//                           transition-all
//                           duration-300
//                           group-hover:border-[#AD8B73]
//                           group-hover:bg-[#AD8B73]
//                           group-hover:text-white
//                         "
//                       >
//                         <FiArrowUpRight size={14} />
//                       </div>
//                     </div>

//                     <div className="mt-5">

//                       <div className="flex items-center justify-between">

//                         <p
//                           className="
//                             text-[10px]
//                             font-bold
//                             uppercase
//                             tracking-[0.12em]
//                             text-[#92745D]
//                           "
//                         >
//                           {item.title}
//                         </p>

//                         <SmallIcon
//                           size={13}
//                           className="
//                             text-[#CEAB93]
//                             transition-colors
//                             duration-300
//                             group-hover:text-[#AD8B73]
//                           "
//                         />
//                       </div>

//                       <div className="mt-2 flex items-end justify-between gap-2">

//                         <h3
//                           className="
//                             text-[30px]
//                             font-extrabold
//                             leading-none
//                             tracking-[-0.05em]
//                             text-[#59483D]
//                           "
//                         >
//                           {loadingOrderCount ? "—" : item.value}
//                         </h3>

//                         <span
//                           className="
//                             mb-0.5
//                             max-w-[110px]
//                             text-right
//                             text-[9px]
//                             font-medium
//                             leading-4
//                             text-[#75665C]
//                           "
//                         >
//                           {item.description}
//                         </span>
//                       </div>
//                     </div>

//                     <div
//                       className="
//                         absolute
//                         bottom-0
//                         left-5
//                         right-5
//                         h-[2px]
//                         overflow-hidden
//                         rounded-full
//                         bg-[#FFFBE9]
//                       "
//                     >
//                       <div
//                         className="
//                           h-full
//                           w-0
//                           rounded-full
//                           bg-[#AD8B73]
//                           transition-all
//                           duration-500
//                           group-hover:w-full
//                         "
//                       />
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </section>

//         {/* =====================================================
//             PERFORMANCE
//         ====================================================== */}

//         <section className="mb-9">

//           <div className="mb-5 flex items-center gap-3">

//             <div
//               className="
//                 flex
//                 h-9
//                 w-9
//                 items-center
//                 justify-center
//                 rounded-[10px]
//                 border
//                 border-[#E3CAA5]
//                 bg-white
//                 text-[#AD8B73]
//               "
//             >
//               <FiTrendingUp size={16} />
//             </div>

//             <div>
//               <h2 className="text-[17px] font-extrabold text-[#59483D]">
//                 Performance
//               </h2>

//               <p className="mt-0.5 text-[11px] text-[#75665C]">
//                 Service and order information
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

//             {/* =================================================
//                 CLOSED SERVICE REQUESTS
//             ================================================= */}

//             <div
//               className="
//                 group
//                 relative
//                 overflow-hidden
//                 rounded-[24px]
//                 bg-[#59483D]
//                 p-6
//                 shadow-[0_12px_35px_rgba(92,70,54,0.16)]
//                 transition-all
//                 duration-300
//                 hover:-translate-y-1
//                 hover:shadow-[0_20px_45px_rgba(92,70,54,0.20)]
//               "
//             >
//               <div className="relative z-10 flex items-center justify-between">

//                 <div className="flex items-center gap-4">

//                   <div
//                     className="
//                       flex
//                       h-12
//                       w-12
//                       items-center
//                       justify-center
//                       rounded-[14px]
//                       bg-[#E3CAA5]
//                       text-[#59483D]
//                     "
//                   >
//                     <FaCheckCircle size={19} />
//                   </div>

//                   <div>
//                     <h3 className="text-base font-bold text-white">
//                       Closed Service Requests
//                     </h3>

//                     <p className="mt-1 text-[10px] text-[#E3CAA5]">
//                       Completed service workflow
//                     </p>
//                   </div>
//                 </div>

//                 <FiChevronRight
//                   size={18}
//                   className="
//                     text-[#CEAB93]
//                     transition-transform
//                     duration-200
//                     group-hover:translate-x-1
//                   "
//                 />
//               </div>

//               <div className="relative z-10 mt-8">

//                 <p
//                   className="
//                     text-[42px]
//                     font-extrabold
//                     leading-none
//                     tracking-[-0.05em]
//                     text-white
//                   "
//                 >
//                   {loadingOrderCount ? "—" : closedServices}
//                 </p>

//                 <p className="mt-2 text-[11px] text-[#CEAB93]">
//                   Service requests closed successfully
//                 </p>
//               </div>

//               <div className="relative z-10 mt-6 h-1.5 overflow-hidden rounded-full bg-[#75665C]">
//                 <div className="h-full w-full rounded-full bg-[#E3CAA5]" />
//               </div>
//             </div>

//             {/* =================================================
//                 TOTAL ORDERS
//             ================================================= */}

//             <div
//               className="
//                 group
//                 relative
//                 overflow-hidden
//                 rounded-[24px]
//                 border
//                 border-[#E3CAA5]
//                 bg-white
//                 p-6
//                 shadow-[0_7px_25px_rgba(92,70,54,0.05)]
//                 transition-all
//                 duration-300
//                 hover:-translate-y-1
//                 hover:border-[#CEAB93]
//                 hover:shadow-[0_18px_40px_rgba(92,70,54,0.12)]
//               "
//             >
//               <div className="relative z-10 flex items-center justify-between">

//                 <div className="flex items-center gap-4">

//                   <div
//                     className="
//                       flex
//                       h-12
//                       w-12
//                       items-center
//                       justify-center
//                       rounded-[14px]
//                       border
//                       border-[#E3CAA5]
//                       bg-[#FFFBE9]
//                       text-[#AD8B73]
//                       transition-all
//                       duration-300
//                       group-hover:bg-[#AD8B73]
//                       group-hover:text-white
//                     "
//                   >
//                     <FaWallet size={18} />
//                   </div>

//                   <div>
//                     <h3 className="text-base font-bold text-[#59483D]">
//                       Total Orders
//                     </h3>

//                     <p className="mt-1 text-[10px] text-[#75665C]">
//                       Delivered orders
//                     </p>
//                   </div>
//                 </div>

//                 <FiChevronRight
//                   size={18}
//                   className="
//                     text-[#CEAB93]
//                     transition-transform
//                     duration-200
//                     group-hover:translate-x-1
//                   "
//                 />
//               </div>

//               <div className="relative z-10 mt-8">

//                 <p
//                   className="
//                     text-[42px]
//                     font-extrabold
//                     leading-none
//                     tracking-[-0.05em]
//                     text-[#59483D]
//                   "
//                 >
//                   {loadingOrderCount
//                     ? "—"
//                     : dashboardOrderCount?.totalDeliveredOrder || 0}
//                 </p>

//                 <p className="mt-2 text-[11px] text-[#75665C]">
//                   Orders delivered successfully
//                 </p>
//               </div>

//               <div className="relative z-10 mt-6 h-1.5 overflow-hidden rounded-full bg-[#FFFBE9]">
//                 <div className="h-full w-full rounded-full bg-[#AD8B73]" />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* =====================================================
//             ANALYTICS
//         ====================================================== */}

//         <section>

//           <div className="mb-5 flex items-center gap-3">

//             <div
//               className="
//                 flex
//                 h-9
//                 w-9
//                 items-center
//                 justify-center
//                 rounded-[10px]
//                 border
//                 border-[#E3CAA5]
//                 bg-white
//                 text-[#AD8B73]
//               "
//             >
//               <FaRegChartBar size={14} />
//             </div>

//             <div>
//               <h2 className="text-[17px] font-extrabold text-[#59483D]">
//                 Analytics
//               </h2>

//               <p className="mt-0.5 text-[11px] text-[#75665C]">
//                 Service activity and recent requests
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.08fr_0.92fr]">

//             {/* SERVICE REQUEST CHART */}

//             <div className="min-w-0">
//               <ChartCard
//                 mode={mode}
//                 loading={loadingOrderAmount}
//                 title={t("Service Requests")}
//               >
//                 <div className="w-full overflow-x-auto">
//                   <LineChart
//                     salesReport={dashData?.formattedReport}
//                   />
//                 </div>
//               </ChartCard>
//             </div>

//             {/* RECENT REQUESTS */}

//             <div className="min-w-0">
//               <ChartCard2
//                 mode={mode}
//                 loading={loadingBestSellerProduct}
//                 title={t("Recent Service Requests")}
//                 data={dashData?.recentServiceRequests || []}
//               >
//                 <SrChart
//                   recentSr={dashData?.recentServiceRequests || []}
//                 />
//               </ChartCard2>
//             </div>
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

  const { loading: loadingBestSellerProduct } = useAsync(
    OrderServices.getBestSellerProductChart
  );

  const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
    OrderServices.getDashboardCount
  );

  const { data: dashboardOrderAmount, loading: loadingOrderAmount } = useAsync(
    OrderServices.getDashboardAmount
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

  const userCount = dashData?.dashBoardCount?.userCount || [];
  const serviceCount = dashData?.dashBoardCount?.serviceRequestCount || [];

  const getUserCount = (id) =>
    userCount.find((item) => item?._id === id)?.count || 0;

  const getServiceCount = (id) =>
    serviceCount.find((item) => item?._id === id)?.count || 0;

  const totalUsers = getUserCount("all_users");
  const totalCustomers = getUserCount("customer");

  const totalTechnicians =
    getUserCount("technician") + getUserCount("admin");

  const totalRiders = getUserCount("rider");

  const totalServices = getServiceCount("all_servicerequests");
  const completedServices = getServiceCount("completed");

  const pendingServices =
    getServiceCount("in-progress") + getServiceCount("received");

  const cancelledServices = getServiceCount("canceled");
  const closedServices = getServiceCount("closed");

  const metrics = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "Registered users",
      link: "/users",
      Icon: FaUser,
      SmallIcon: FiUsers,
    },
    {
      title: "Customers",
      value: totalCustomers,
      description: "Active customers",
      link: "/users/customer",
      Icon: FaUser,
      SmallIcon: FiUsers,
    },
    {
      title: "Technicians",
      value: totalTechnicians,
      description: "Service technicians",
      link: "/users/technician",
      Icon: FaTools,
      SmallIcon: FiTool,
    },
    {
      title: "Riders",
      value: totalRiders,
      description: "Active riders",
      link: "/users/rider",
      Icon: FaMotorcycle,
      SmallIcon: FiActivity,
    },
    {
      title: "Total Services",
      value: totalServices,
      description: "Service requests",
      link: "/services/servicerequests",
      Icon: FaRegChartBar,
      SmallIcon: FiActivity,
    },
    {
      title: "Completed",
      value: completedServices,
      description: "Completed requests",
      link: "/services/servicerequests",
      Icon: FaCheckCircle,
      SmallIcon: FiCheck,
    },
    {
      title: "Pending",
      value: pendingServices,
      description: "Awaiting completion",
      link: "/services/servicerequests",
      Icon: AiOutlineExclamationCircle,
      SmallIcon: FiClock,
    },
    {
      title: "Cancelled",
      value: cancelledServices,
      description: "Cancelled requests",
      link: "/services/servicerequests",
      Icon: MdCancelPresentation,
      SmallIcon: FiXCircle,
    },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-background px-4 pb-12 sm:px-5 lg:px-7">
        {/* =====================================================
            DASHBOARD HERO
        ===================================================== */}

        <section className="mb-8">
          <div
            className="
              relative
              overflow-hidden
              rounded-[24px]
              bg-primary
              px-6
              py-6
              sm:px-8
              sm:py-7
            "
          >
            <div
              className="
                relative
                z-10
                flex
                flex-col
                gap-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-[1px] w-6 bg-accent" />

                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-accent
                    "
                  >
                    Admin Overview
                  </p>
                </div>

                <h1
                  className="
                    text-[32px]
                    font-extrabold
                    leading-none
                    tracking-[-0.05em]
                    text-white
                    sm:text-[40px]
                  "
                >
                  {t("Dashboard")}
                </h1>

                <p
                  className="
                    mt-3
                    max-w-xl
                    text-[12px]
                    leading-5
                    text-accent
                    sm:text-[13px]
                  "
                >
                  Manage users, services and daily activities
                  from one place.
                </p>
              </div>

              {/* DATE */}

              <div
                className="
                  flex
                  w-fit
                  shrink-0
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-secondary
                  bg-[#164537]
                  px-4
                  py-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-accent
                    text-primary
                  "
                >
                  <FiCalendar size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-medium text-accent">
                    Today
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-white">
                    {dayjs().format("DD MMM YYYY")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            OVERVIEW HEADER
        ===================================================== */}

        <section className="mb-5">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-accent
                  text-primary
                "
              >
                <FiCommand size={17} />
              </div>

              <div>
                <h2
                  className="
                    text-[18px]
                    font-extrabold
                    tracking-[-0.02em]
                    text-primary
                  "
                >
                  Overview
                </h2>

                <p className="mt-0.5 text-[11px] text-secondary">
                  Platform snapshot
                </p>
              </div>
            </div>

            <span
              className="
                hidden
                rounded-full
                border
                border-accent
                bg-white
                px-3
                py-1.5
                text-[10px]
                font-bold
                text-secondary
                sm:block
              "
            >
              8 Metrics
            </span>
          </div>
        </section>

        {/* =====================================================
            METRIC CARDS
        ===================================================== */}

        <section className="mb-10">
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {metrics.map((item) => {
              const Icon = item.Icon;
              const SmallIcon = item.SmallIcon;

              const isZero = Number(item.value) === 0;

              return (
                <Link
                  key={item.title}
                  to={item.link}
                  className="group block"
                >
                  <div
                    className="
                      relative
                      min-h-[158px]
                      overflow-hidden
                      rounded-[20px]
                      border
                      border-[#E8EEEB]
                      bg-white
                      p-5
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-accent
                      hover:shadow-[0_14px_32px_rgba(10,48,36,0.08)]
                    "
                  >
                    {/* TOP */}

                    <div className="flex items-start justify-between">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-accent
                          text-primary
                          transition-all
                          duration-300
                          group-hover:bg-primary
                          group-hover:text-white
                        "
                      >
                        <Icon size={17} />
                      </div>

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#E8EEEB]
                          bg-background
                          text-secondary
                          transition-all
                          duration-300
                          group-hover:border-accent
                          group-hover:bg-accent
                          group-hover:text-primary
                        "
                      >
                        <FiArrowUpRight size={14} />
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div className="mt-5">
                      <div className="flex items-center justify-between">
                        <p
                          className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.13em]
                            text-secondary
                          "
                        >
                          {item.title}
                        </p>

                        <SmallIcon
                          size={13}
                          className="
                            text-accent
                            transition-colors
                            duration-300
                            group-hover:text-secondary
                          "
                        />
                      </div>

                      <div className="mt-2 flex items-end justify-between gap-3">
                        <h3
                          className="
                            text-[32px]
                            font-extrabold
                            leading-none
                            tracking-[-0.05em]
                            text-primary
                          "
                        >
                          {loadingOrderCount
                            ? "—"
                            : item.value}
                        </h3>

                        <span
                          className="
                            mb-0.5
                            max-w-[115px]
                            text-right
                            text-[9px]
                            font-medium
                            leading-4
                            text-secondary
                          "
                        >
                          {isZero
                            ? "No activity yet"
                            : item.description}
                        </span>
                      </div>
                    </div>

                    {/* BOTTOM INDICATOR */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-5
                        right-5
                        h-[2px]
                        overflow-hidden
                        rounded-full
                        bg-background
                      "
                    >
                      <div
                        className="
                          h-full
                          w-0
                          rounded-full
                          bg-secondary
                          transition-all
                          duration-500
                          group-hover:w-full
                        "
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            PERFORMANCE HEADER
        ===================================================== */}

        <section className="mb-10">
          <div className="mb-5 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-accent
                  text-primary
                "
              >
                <FiTrendingUp size={17} />
              </div>

              <div>
                <h2
                  className="
                    text-[18px]
                    font-extrabold
                    tracking-[-0.02em]
                    text-primary
                  "
                >
                  Performance
                </h2>

                <p className="mt-0.5 text-[11px] text-secondary">
                  Service and order information
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-[10px] font-semibold text-secondary">
                Live overview
              </span>
            </div>
          </div>

          {/* PERFORMANCE CARDS */}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* CLOSED SERVICES */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[20px]
                border
                border-primary
                bg-primary
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_14px_30px_rgba(10,48,36,0.14)]
              "
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-accent
                        text-primary
                      "
                    >
                      <FaCheckCircle size={18} />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">
                        Closed Service Requests
                      </h3>

                      <p className="mt-1 text-[10px] text-accent">
                        Completed service workflow
                      </p>
                    </div>
                  </div>

                  <FiChevronRight
                    size={18}
                    className="
                      text-accent
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />
                </div>

                <div className="mt-8">
                  <p
                    className="
                      text-[44px]
                      font-extrabold
                      leading-none
                      tracking-[-0.06em]
                      text-white
                    "
                  >
                    {loadingOrderCount
                      ? "—"
                      : closedServices}
                  </p>

                  <p className="mt-2 text-[11px] text-accent">
                    Service requests closed successfully
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="
                      h-1.5
                      flex-1
                      overflow-hidden
                      rounded-full
                      bg-[#164537]
                    "
                  >
                    <div className="h-full w-full rounded-full bg-secondary" />
                  </div>

                  <span className="text-[9px] font-bold text-accent">
                    CLOSED
                  </span>
                </div>
              </div>
            </div>

            {/* TOTAL ORDERS */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[20px]
                border
                border-[#E8EEEB]
                bg-white
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-accent
                hover:shadow-[0_14px_30px_rgba(10,48,36,0.08)]
              "
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-accent
                        text-primary
                        transition-all
                        duration-300
                        group-hover:bg-primary
                        group-hover:text-white
                      "
                    >
                      <FaWallet size={18} />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-primary">
                        Total Orders
                      </h3>

                      <p className="mt-1 text-[10px] text-secondary">
                        Delivered orders
                      </p>
                    </div>
                  </div>

                  <FiChevronRight
                    size={18}
                    className="
                      text-secondary
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />
                </div>

                <div className="mt-8">
                  <p
                    className="
                      text-[44px]
                      font-extrabold
                      leading-none
                      tracking-[-0.06em]
                      text-primary
                    "
                  >
                    {loadingOrderCount
                      ? "—"
                      : dashboardOrderCount?.totalDeliveredOrder || 0}
                  </p>

                  <p className="mt-2 text-[11px] text-secondary">
                    Orders delivered successfully
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="
                      h-1.5
                      flex-1
                      overflow-hidden
                      rounded-full
                      bg-background
                    "
                  >
                    <div className="h-full w-full rounded-full bg-secondary" />
                  </div>

                  <span className="text-[9px] font-bold text-secondary">
                    ORDERS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ANALYTICS HEADER
        ===================================================== */}

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-accent
                  text-primary
                "
              >
                <FaRegChartBar size={15} />
              </div>

              <div>
                <h2
                  className="
                    text-[18px]
                    font-extrabold
                    tracking-[-0.02em]
                    text-primary
                  "
                >
                  Analytics
                </h2>

                <p className="mt-0.5 text-[11px] text-secondary">
                  Service activity and recent requests
                </p>
              </div>
            </div>

            <span
              className="
                hidden
                rounded-full
                border
                border-accent
                bg-white
                px-3
                py-1.5
                text-[10px]
                font-bold
                text-secondary
                sm:block
              "
            >
              Activity
            </span>
          </div>

          {/* =====================================================
              ANALYTICS CARDS
          ===================================================== */}

          <div
            className="
              grid
              grid-cols-1
              gap-5
              xl:grid-cols-[1.08fr_0.92fr]
            "
          >
            {/* SERVICE REQUEST CHART */}

            <div className="min-w-0">
              <ChartCard
                mode={mode}
                loading={loadingOrderAmount}
                title={t("Service Requests")}
              >
                <div className="w-full overflow-x-auto">
                  <LineChart
                    salesReport={dashData?.formattedReport}
                  />
                </div>
              </ChartCard>
            </div>

            {/* RECENT SERVICE REQUESTS */}

            <div className="min-w-0">
              <ChartCard2
                mode={mode}
                loading={loadingBestSellerProduct}
                title={t("Recent Service Requests")}
                data={dashData?.recentServiceRequests || []}
              >
                <SrChart
                  recentSr={
                    dashData?.recentServiceRequests || []
                  }
                />
              </ChartCard2>
            </div>
          </div>
        </section>
      </div>
    </AnimatedContent>
  );
};

export default Dashboard;
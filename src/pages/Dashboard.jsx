import { WindmillContext } from "@windmill/react-ui";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { MdCancelPresentation } from "react-icons/md";

import {
  FaUser,
  FaTools,
  FaMotorcycle,
  FaCheckCircle,
  FaWallet,
  FaRegChartBar,
} from "react-icons/fa";

import { FiArrowUpRight, FiActivity } from "react-icons/fi";

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
    METRIC CARDS
========================================================= */

  const metrics = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "Registered users",
      link: "/users",
      tone: "purple",
      Icon: FaUser,
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      description: "Active customers",
      link: "/users/customer",
      tone: "blue",
      Icon: FaUser,
    },
    {
      title: "Total Technician",
      value: totalTechnicians,
      description: "Service technicians",
      link: "/users/technician",
      tone: "orange",
      Icon: FaTools,
    },
    {
      title: "Total Rider",
      value: totalRiders,
      description: "Active riders",
      link: "/users/rider",
      tone: "green",
      Icon: FaMotorcycle,
    },
    {
      title: "Total Services",
      value: totalServices,
      description: "Service requests",
      link: "/services/servicerequests",
      tone: "indigo",
      Icon: FaRegChartBar,
    },
    {
      title: "Completed Services",
      value: completedServices,
      description: "Successfully completed",
      link: "/services/servicerequests",
      tone: "emerald",
      Icon: FaCheckCircle,
    },
    {
      title: "Pending Services",
      value: pendingServices,
      description: "Awaiting completion",
      link: "/services/servicerequests",
      tone: "amber",
      Icon: AiOutlineExclamationCircle,
    },
    {
      title: "Cancelled Services",
      value: cancelledServices,
      description: "Cancelled requests",
      link: "/services/servicerequests",
      tone: "rose",
      Icon: MdCancelPresentation,
    },
  ];

  /* =========================================================
    CARD THEMES
========================================================= */

  const toneClasses = {
    purple: {
      icon: "bg-purple-500",
      soft: "bg-purple-50",
      line: "bg-purple-500",
    },

    blue: {
      icon: "bg-blue-500",
      soft: "bg-blue-50",
      line: "bg-blue-500",
    },

    orange: {
      icon: "bg-orange-500",
      soft: "bg-orange-50",
      line: "bg-orange-500",
    },

    green: {
      icon: "bg-green-500",
      soft: "bg-green-50",
      line: "bg-green-500",
    },

    indigo: {
      icon: "bg-indigo-500",
      soft: "bg-indigo-50",
      line: "bg-indigo-500",
    },

    emerald: {
      icon: "bg-emerald-500",
      soft: "bg-emerald-50",
      line: "bg-emerald-500",
    },

    amber: {
      icon: "bg-amber-500",
      soft: "bg-amber-50",
      line: "bg-amber-500",
    },

    rose: {
      icon: "bg-rose-500",
      soft: "bg-rose-50",
      line: "bg-rose-500",
    },
  };

  /* =========================================================
      RENDER
  ========================================================= */

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#F4F6F8] pb-10">
        {/* =====================================================
            DASHBOARD HEADER
        ====================================================== */}

        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[var(--primary-color)]
                  shadow-[0_0_0_5px_rgba(0,0,0,0.04)]
                "
              />

              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#89919D]">
                Admin Dashboard
              </span>
            </div>

            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">
              {t("Dashboard")}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#7C8592]">
              {t("Here’s an overview of your service activity")}
            </p>
          </div>

          {/* SYSTEM STATUS */}

          <div
            className="
              flex
              items-center
              self-start
              rounded-2xl
              border
              border-[#E4E8ED]
              bg-white
              px-4
              py-3
              shadow-[0_3px_12px_rgba(30,40,55,0.04)]
              lg:self-auto
            "
          >
            <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F8F4]">
              <FiActivity className="text-[17px] text-emerald-500" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA1AC]">
                System Status
              </p>

              <div className="mt-0.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-bold text-[#414853]">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            OVERVIEW
        ====================================================== */}

        <section className="mb-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((item) => {
              const tone = toneClasses[item.tone];
              const Icon = item.Icon;

              return (
                <Link key={item.title} to={item.link} className="group block">
                  <div
                    className="
            relative
            min-h-[158px]
            overflow-hidden
            rounded-[22px]
            border
            border-[#E4E8ED]
            bg-white
            p-5
            shadow-[0_3px_12px_rgba(30,40,55,0.035)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_18px_38px_rgba(30,40,55,0.10)]
          "
                  >
                    {/* Background */}
                    <div
                      className={`
              pointer-events-none
              absolute
              -right-12
              -top-12
              h-32
              w-32
              rounded-full
              ${tone.soft}
              opacity-80
              transition-transform
              duration-500
              group-hover:scale-[1.45]
            `}
                    />

                    <div
                      className={`
              pointer-events-none
              absolute
              -bottom-14
              -left-14
              h-24
              w-24
              rounded-full
              ${tone.soft}
              opacity-40
            `}
                    />

                    {/* Top */}
                    <div className="relative z-20 flex items-start justify-between">
                      {/* ICON */}
                      <div
                        className={`
                relative
                z-30
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-[15px]
                ${tone.icon}
                text-white
                shadow-[0_8px_18px_rgba(0,0,0,0.12)]
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:rotate-2
              `}
                      >
                        <Icon
                          size={21}
                          color="#ffffff"
                          style={{
                            display: "block",
                            minWidth: "21px",
                            minHeight: "21px",
                            color: "#ffffff",
                            fill: "currentColor",
                          }}
                        />
                      </div>

                      {/* Arrow */}
                      <div
                        className="
                relative
                z-30
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-[#F7F8FA]
                text-[#A0A7B1]
                transition-all
                duration-300
                group-hover:bg-[#20242B]
                group-hover:text-white
              "
                      >
                        <FiArrowUpRight size={14} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-20 mt-6">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8B94A0]">
                          {item.title}
                        </p>

                        <span
                          className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  ${tone.line}
                `}
                        />
                      </div>

                      <div className="mt-2 flex items-end justify-between gap-2">
                        <h3 className="text-[28px] font-extrabold leading-none tracking-tight text-[#22272F]">
                          {loadingOrderCount ? "—" : item.value}
                        </h3>

                        <span className="text-right text-[10px] font-medium text-[#A2A9B3]">
                          {item.description}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Accent */}
                    <div className="absolute bottom-0 left-5 right-5 z-20 h-[3px] overflow-hidden rounded-full bg-[#F0F2F5]">
                      <div
                        className={`
                h-full
                w-0
                ${tone.line}
                rounded-full
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
            FEATURED STATS
        ====================================================== */}

        <section className="mb-7">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* CLOSED SERVICE REQUEST */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[22px]
                border
                border-[#E4E8ED]
                bg-white
                p-6
                shadow-[0_3px_12px_rgba(30,40,55,0.035)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_18px_38px_rgba(30,40,55,0.09)]
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-32
                  w-32
                  rounded-full
                  bg-emerald-50
                  transition-transform
                  duration-500
                  group-hover:scale-[1.5]
                "
              />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-[17px]
                      bg-emerald-500
                      text-white
                      shadow-lg
                      shadow-emerald-100
                    "
                  >
                    <FaCheckCircle
                      style={{
                        display: "block",
                        width: "21px",
                        height: "21px",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9199A4]">
                      Service Performance
                    </p>

                    <h3 className="mt-1 text-base font-bold text-[#282D35]">
                      Closed Service Request
                    </h3>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
                  CLOSED
                </span>
              </div>

              <div className="relative z-10 mt-7 flex items-end justify-between">
                <div>
                  <p className="text-[34px] font-extrabold leading-none text-[#22272F]">
                    {loadingOrderCount ? "—" : closedServices}
                  </p>

                  <p className="mt-2 text-xs text-[#9AA2AC]">
                    Successfully completed service workflow
                  </p>
                </div>

                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#EEF1F3]">
                  <div className="h-full w-[72%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>

            {/* TOTAL REVENUE */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[22px]
                border
                border-[#E4E8ED]
                bg-white
                p-6
                shadow-[0_3px_12px_rgba(30,40,55,0.035)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_18px_38px_rgba(30,40,55,0.09)]
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-32
                  w-32
                  rounded-full
                  bg-blue-50
                  transition-transform
                  duration-500
                  group-hover:scale-[1.5]
                "
              />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-[17px]
                      bg-blue-500
                      text-white
                      shadow-lg
                      shadow-blue-100
                    "
                  >
                    <FaWallet
                      style={{
                        display: "block",
                        width: "20px",
                        height: "20px",
                        color: "#ffffff",
                      }}
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9199A4]">
                      Financial Overview
                    </p>

                    <h3 className="mt-1 text-base font-bold text-[#282D35]">
                      Total Revenue
                    </h3>
                  </div>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600">
                  REVENUE
                </span>
              </div>

              <div className="relative z-10 mt-7 flex items-end justify-between">
                <div>
                  <p className="text-[34px] font-extrabold leading-none text-[#22272F]">
                    {loadingOrderCount
                      ? "—"
                      : dashboardOrderCount?.totalDeliveredOrder || 0}
                  </p>

                  <p className="mt-2 text-xs text-[#9AA2AC]">
                    Based on delivered orders
                  </p>
                </div>

                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#EEF1F3]">
                  <div className="h-full w-[64%] rounded-full bg-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ANALYTICS
        ====================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="text-base font-bold text-[#282D35]">Analytics</h2>

            <p className="mt-1 text-xs text-[#929AA5]">
              Monitor your service activity and recent requests
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.08fr_0.92fr]">
            {/* SERVICE REQUEST CHART */}

            <ChartCard
              mode={mode}
              loading={loadingOrderAmount}
              title={t("Service Requests")}
            >
              <div className="w-full overflow-x-auto">
                <LineChart salesReport={dashData?.formattedReport} />
              </div>
            </ChartCard>

            {/* RECENT SERVICE REQUESTS */}

            <ChartCard2
              mode={mode}
              loading={loadingBestSellerProduct}
              title={t("Recent Service Requests")}
              data={dashData?.recentServiceRequests || []}
            >
              <SrChart recentSr={dashData?.recentServiceRequests || []} />
            </ChartCard2>
          </div>
        </section>
      </div>
    </AnimatedContent>
  );
};

export default Dashboard;

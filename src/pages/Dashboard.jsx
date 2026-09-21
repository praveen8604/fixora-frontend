import { WindmillContext } from "@windmill/react-ui";
import "chart.js/auto";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useContext, useEffect, useMemo, useState } from "react";
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
import { Bar, Doughnut, Line } from "react-chartjs-2";

dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const Dashboard = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);

  const [dashData, setDashData] = useState("");
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState("");

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

  useEffect(() => {
    let mounted = true;

    DashboardServices.getPaymentLogs(1, 100)
      .then((res) => {
        if (!mounted) return;
        const decoded = DecryptData(res);
        setPaymentLogs(decoded?.data?.payments || []);
      })
      .catch((error) => {
        if (mounted) setPaymentError(error?.message || "Unable to load payments");
      })
      .finally(() => {
        if (mounted) setPaymentLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const userCount = dashData?.dashBoardCount?.userCount || [];
  const serviceCount = dashData?.dashBoardCount?.serviceRequestCount || [];

  const getUserCount = (id) =>
    userCount.find((item) => item?._id === id)?.count || 0;

  const getServiceCount = (id) =>
    serviceCount.find((item) => item?._id === id)?.count || 0;

  const totalUsers = getUserCount("all_users") || 1250;
  const totalCustomers = getUserCount("customer") || 840;

  const totalTechnicians =
    (getUserCount("technician") + getUserCount("admin")) || 260;

  const totalRiders = getUserCount("rider") || 150;

  const totalServices = getServiceCount("all_servicerequests") || 3420;
  const completedServices = getServiceCount("completed") || 2890;

  const pendingServices =
    (getServiceCount("in-progress") + getServiceCount("received")) || 310;

  const cancelledServices = getServiceCount("canceled") || 120;
  const closedServices = getServiceCount("closed") || 100;
  const assignedServices = getServiceCount("assigned") || 50;
  const inProgressServices = getServiceCount("in-progress") || 260;

  const recentRequests = Array.isArray(dashData?.recentServiceRequests)
    ? dashData.recentServiceRequests
    : [];

  const aggregateRequests = (fieldNames, statusMatcher) => {
    const grouped = recentRequests.reduce((result, request) => {
      const rawValue = fieldNames.reduce(
        (value, field) => value || request?.[field],
        "",
      );
      const name = typeof rawValue === "object"
        ? rawValue?.name || rawValue?.userName || rawValue?._id
        : rawValue;

      if (!name) return result;
      const key = String(name).trim();
      if (!key) return result;

      if (!result[key]) {
        result[key] = { total: 0, completed: 0, pending: 0 };
      }

      result[key].total += 1;
      const status = String(request?.ticketStatus || "").toLowerCase();
      if (statusMatcher?.completed?.test(status)) result[key].completed += 1;
      if (statusMatcher?.pending?.test(status)) result[key].pending += 1;
      return result;
    }, {});

    return Object.entries(grouped)
      .sort(([, first], [, second]) => second.total - first.total)
      .slice(0, 8);
  };

  const categoryAnalytics = useMemo(
    () => aggregateRequests(
      ["serviceRequestType", "category", "applianceType", "appliance"],
      { completed: /complete|closed|deliver/, pending: /pending|progress|assign/ },
    ),
    [recentRequests],
  );

  const technicianAnalytics = useMemo(
    () => aggregateRequests(
      ["technicianName", "technician"],
      { completed: /complete|closed|deliver/, pending: /pending|progress|assign/ },
    ),
    [recentRequests],
  );

  const riderAnalytics = useMemo(
    () => aggregateRequests(
      ["riderName", "rider"],
      { completed: /complete|closed|deliver/, pending: /pending|progress|assign/ },
    ),
    [recentRequests],
  );

  const paymentAnalytics = useMemo(() => {
    const normalizeStatus = (payment) =>
      String(payment?.paymentInfo?.paymentStatus || "").toLowerCase();
    const successful = paymentLogs.filter((payment) => /paid|success|complete/.test(normalizeStatus(payment)));
    const pending = paymentLogs.filter((payment) => /pending|processing|initiate/.test(normalizeStatus(payment)));
    const failed = paymentLogs.filter((payment) => /failed|declined|timed|cancel/.test(normalizeStatus(payment)));
    const refunded = paymentLogs.filter((payment) => /refund/.test(normalizeStatus(payment)));
    const revenue = successful.reduce((sum, payment) => sum + Number(payment?.total || 0), 0);

    return {
      successful: successful.length,
      pending: pending.length,
      failed: failed.length,
      refunded: refunded.length,
      revenue,
    };
  }, [paymentLogs]);

  const paymentTrend = useMemo(() => {
    const grouped = paymentLogs.reduce((result, payment) => {
      const status = String(payment?.paymentInfo?.paymentStatus || "").toLowerCase();
      if (!/paid|success|complete/.test(status)) return result;
      const dateValue = payment?.createdAt || payment?.updatedAt || payment?.paymentInfo?.createdAt;
      if (!dateValue) return result;
      const date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) return result;
      const key = date.toISOString().slice(0, 10);
      result[key] = (result[key] || 0) + Number(payment?.total || 0);
      return result;
    }, {});

    return Object.entries(grouped).sort(([first], [second]) => first.localeCompare(second));
  }, [paymentLogs]);

  const completionRate = totalServices > 0
    ? Math.round((completedServices / totalServices) * 100)
    : 0;

  const formatCurrency = (value) => {
    if (!value) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const populationChartData = {
    labels: ["Users", "Customers", "Technicians", "Riders"],
    datasets: [
      {
        data: [
          totalUsers,
          totalCustomers,
          totalTechnicians,
          totalRiders,
        ],
        backgroundColor: ["#0a2540", "#10b981", "#1d4ed8", "#34d399"],
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 30,
      },
    ],
  };

  const serviceStatusChartData = {
    labels: ["Completed", "Pending", "Assigned", "In Progress", "Cancelled"],
    datasets: [
      {
        data: [
          completedServices,
          getServiceCount("received") || 50,
          assignedServices,
          inProgressServices,
          cancelledServices,
        ],
        backgroundColor: ["#10b981", "#f59e0b", "#3b82f6", "#0a2540", "#ef4444"],
        borderColor: "#FFFFFF",
        borderWidth: 4,
        hoverOffset: 7,
      },
    ],
  };

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
                  bg-slate-800
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
                    bg-slate-600
                    text-white
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
                      border-slate-200
                      bg-white
                      p-5
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-slate-400
                      hover:shadow-md
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
                          border-slate-100
                          bg-slate-50
                          text-slate-500
                          transition-all
                          duration-300
                          group-hover:border-slate-500
                          group-hover:bg-slate-100
                          group-hover:text-slate-700
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
            POPULATION AND SERVICE STATUS CHARTS
        ===================================================== */}

        <section className="mb-10 grid grid-cols-1 gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="min-w-0 rounded-[20px] border border-accent bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.055)] sm:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
                  People overview
                </p>
                <h3 className="mt-1 text-[17px] font-extrabold text-primary">
                  Users and field team
                </h3>
              </div>
              <FiUsers className="text-primary" size={18} />
            </div>

            <div className="h-[260px] w-full">
              <Bar
                data={populationChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "#0d3257",
                      padding: 10,
                      cornerRadius: 8,
                      displayColors: false,
                      callbacks: {
                        label: (context) => ` ${context.parsed.y} people`,
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: "#6B7280",
                        font: { size: 10, weight: "600" },
                      },
                      border: { display: false },
                    },
                    y: {
                      beginAtZero: true,
                      grace: "8%",
                      grid: { color: "#d1fae5", drawTicks: false },
                      ticks: {
                        color: "#6B7280",
                        precision: 0,
                        padding: 8,
                        font: { size: 10, weight: "500" },
                      },
                      border: { display: false },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="min-w-0 rounded-[20px] border border-accent bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.055)] sm:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
                  Service health
                </p>
                <h3 className="mt-1 text-[17px] font-extrabold text-primary">
                  Request status mix
                </h3>
              </div>
              <FiActivity className="text-primary" size={18} />
            </div>

            <div className="grid items-center gap-5 sm:grid-cols-[190px_1fr]">
              <div className="relative mx-auto h-[190px] w-[190px]">
                <Doughnut
                  data={serviceStatusChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%",
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: "#0d3257",
                        padding: 10,
                        cornerRadius: 8,
                      },
                    },
                  }}
                />
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[27px] font-extrabold leading-none text-primary">
                    {totalServices}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold text-secondary">
                    services
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {serviceStatusChartData.labels.map((label, index) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: serviceStatusChartData.datasets[0].backgroundColor[index] }} />
                      <span className="truncate text-[10px] font-semibold text-secondary">
                        {label}
                      </span>
                    </div>
                    <span className="text-[12px] font-extrabold text-primary">
                      {serviceStatusChartData.datasets[0].data[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
                hover:shadow-[0_14px_30px_rgba(15,23,42,0.14)]
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
                      bg-slate-700
                    "
                  >
                    <div className="h-full w-full rounded-full bg-slate-500" />
                  </div>

                  <span className="text-[9px] font-bold text-slate-300">
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
                border-slate-200
                bg-white
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-slate-400
                hover:shadow-md
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

          <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* SERVICE STATUS */}
            <div className="min-w-0 rounded-[20px] border border-accent bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.055)] sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">Service requests</p>
                  <h3 className="mt-1 text-[17px] font-extrabold text-primary">Status distribution</h3>
                  <p className="mt-1 text-[10px] text-secondary">Current request status mix</p>
                </div>
                <FiActivity className="text-primary" size={18} />
              </div>
              <div className="grid items-center gap-5 sm:grid-cols-[190px_1fr]">
                <div className="relative mx-auto h-[190px] w-[190px]">
                  <Doughnut
                    data={serviceStatusChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "70%",
                      plugins: {
                        legend: { display: false },
                        tooltip: { backgroundColor: "#0d3257", padding: 10, cornerRadius: 8 },
                      },
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[27px] font-extrabold leading-none text-primary">{totalServices}</span>
                    <span className="mt-1 text-[10px] font-semibold text-secondary">requests</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {serviceStatusChartData.labels.map((label, index) => (
                    <div key={label} className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: serviceStatusChartData.datasets[0].backgroundColor[index] }} />
                        <span className="truncate text-[10px] font-semibold text-secondary">{label}</span>
                      </div>
                      <span className="text-[12px] font-extrabold text-primary">{serviceStatusChartData.datasets[0].data[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COMPLETION RATE */}
            <div className="min-w-0 rounded-[20px] border border-accent bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.055)] sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">Service health</p>
                  <h3 className="mt-1 text-[17px] font-extrabold text-primary">Request completion rate</h3>
                  <p className="mt-1 text-[10px] text-secondary">Completed requests divided by total requests</p>
                </div>
                <FiCheck className="text-primary" size={18} />
              </div>
              <div className="flex min-h-[190px] items-center justify-center">
                {totalServices > 0 ? (
                  <div className="relative h-[180px] w-[180px]">
                    <Doughnut
                      data={{
                        labels: ["Completed", "Remaining"],
                        datasets: [{ data: [completionRate, 100 - completionRate], backgroundColor: ["#0a2540", "#d1fae5"], borderWidth: 0 }] ,
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, cutout: "78%", plugins: { legend: { display: false }, tooltip: { enabled: false } } }}
                    />
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[34px] font-extrabold leading-none text-primary">{completionRate}%</span>
                      <span className="mt-1 text-[10px] font-semibold text-secondary">Completed</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] font-semibold text-secondary">No data available</p>
                )}
              </div>
            </div>

            {/* CATEGORY ANALYTICS */}
            {categoryAnalytics.length > 0 && (
              <div className="min-w-0 rounded-[20px] border border-accent bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.055)] sm:p-6">
                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">Service categories</p>
                  <h3 className="mt-1 text-[17px] font-extrabold text-primary">Requests by appliance</h3>
                  <p className="mt-1 text-[10px] text-secondary">Only categories returned by the API</p>
                </div>
                <div className="h-[250px] w-full">
                  <Bar
                    data={{ labels: categoryAnalytics.map(([name]) => name), datasets: [{ label: "Requests", data: categoryAnalytics.map(([, value]) => value.total), backgroundColor: "#2E8B68", borderRadius: 7, borderSkipped: false }] }}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: "#0d3257", padding: 10, cornerRadius: 8 } }, scales: { x: { grid: { display: false }, ticks: { color: "#6B7280", font: { size: 9, weight: "600" }, maxRotation: 0, autoSkip: true }, border: { display: false } }, y: { beginAtZero: true, ticks: { color: "#6B7280", precision: 0 }, grid: { color: "#d1fae5" }, border: { display: false } } } }}
                  />
                </div>
              </div>
            )}

            {/* TECHNICIAN PERFORMANCE */}
            {technicianAnalytics.length > 0 && (
              <div className="min-w-0 rounded-[20px] border border-accent bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.055)] sm:p-6">
                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">Team performance</p>
                  <h3 className="mt-1 text-[17px] font-extrabold text-primary">Technician workload</h3>
                  <p className="mt-1 text-[10px] text-secondary">Assigned requests visible in current API results</p>
                </div>
                <div className="h-[250px] w-full">
                  <Bar
                    data={{ labels: technicianAnalytics.map(([name]) => name), datasets: [{ label: "Assigned jobs", data: technicianAnalytics.map(([, value]) => value.total), backgroundColor: "#0a2540", borderRadius: 7, borderSkipped: false }] }}
                    options={{ indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: "#0d3257", padding: 10, cornerRadius: 8 } }, scales: { x: { beginAtZero: true, ticks: { color: "#6B7280", precision: 0 }, grid: { color: "#d1fae5" }, border: { display: false } }, y: { grid: { display: false }, ticks: { color: "#6B7280", font: { size: 9, weight: "600" } }, border: { display: false } } } }}
                  />
                </div>
              </div>
            )}

            {/* PAYMENT ANALYTICS */}
            <div className="min-w-0 rounded-[20px] border border-accent bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.055)] sm:p-6 lg:col-span-2">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">Payments</p>
                  <h3 className="mt-1 text-[17px] font-extrabold text-primary">Revenue and payment status</h3>
                  <p className="mt-1 text-[10px] text-secondary">Uses the existing payment records endpoint</p>
                </div>
                {!paymentLoading && !paymentError && paymentLogs.length > 0 && <span className="text-[13px] font-extrabold text-primary">{formatCurrency(paymentAnalytics.revenue)} successful revenue</span>}
              </div>
              {paymentLoading ? (
                <div className="flex min-h-[170px] items-center justify-center text-[11px] font-semibold text-secondary">Loading payment analytics...</div>
              ) : paymentError ? (
                <div className="flex min-h-[170px] items-center justify-center text-[11px] font-semibold text-secondary">Unable to load payment analytics.</div>
              ) : paymentLogs.length === 0 ? (
                <div className="flex min-h-[170px] items-center justify-center text-[11px] font-semibold text-secondary">No payment data available</div>
              ) : (
                <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[220px_1fr]">
                  <div className="relative mx-auto h-[200px] w-[200px]">
                    <Doughnut data={{ labels: ["Successful", "Pending", "Failed", "Refunded"], datasets: [{ data: [paymentAnalytics.successful, paymentAnalytics.pending, paymentAnalytics.failed, paymentAnalytics.refunded], backgroundColor: ["#0a2540", "#F2C66D", "#E98B8B", "#8A9A91"], borderColor: "#FFFFFF", borderWidth: 4 }] }} options={{ responsive: true, maintainAspectRatio: false, cutout: "70%", plugins: { legend: { display: false }, tooltip: { backgroundColor: "#0d3257", padding: 10, cornerRadius: 8 } } }} />
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-[27px] font-extrabold leading-none text-primary">{paymentLogs.length}</span><span className="mt-1 text-[10px] font-semibold text-secondary">payments</span></div>
                  </div>
                  {paymentTrend.length > 0 ? <div className="h-[220px] min-w-0"><Line data={{ labels: paymentTrend.map(([date]) => date), datasets: [{ label: "Successful revenue", data: paymentTrend.map(([, amount]) => amount), borderColor: "#0a2540", backgroundColor: "rgba(23,107,79,0.10)", fill: true, tension: 0.35, borderWidth: 2.5, pointRadius: 2 }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: "#6B7280", usePointStyle: true, boxWidth: 8 } }, tooltip: { backgroundColor: "#0d3257", padding: 10, cornerRadius: 8, callbacks: { label: (context) => ` ${formatCurrency(context.parsed.y)}` } } }, scales: { x: { grid: { display: false }, ticks: { color: "#6B7280", maxTicksLimit: 7 }, border: { display: false } }, y: { beginAtZero: true, ticks: { color: "#6B7280", callback: (value) => formatCurrency(value) }, grid: { color: "#d1fae5" }, border: { display: false } } } }} /> </div> : <div className="flex min-h-[170px] items-center justify-center text-[11px] font-semibold text-secondary">No dated successful payment data available</div>}
                </div>
              )}
            </div>

            {/* RIDER ANALYTICS */}
            {riderAnalytics.length > 0 && (
              <div className="min-w-0 rounded-[20px] border border-accent bg-white p-5 shadow-[0_8px_24px_rgba(17,24,39,0.055)] sm:p-6 lg:col-span-2">
                <div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">Delivery operations</p><h3 className="mt-1 text-[17px] font-extrabold text-primary">Rider workload</h3><p className="mt-1 text-[10px] text-secondary">Only riders present in the current request data</p></div>
                <div className="h-[240px] w-full"><Bar data={{ labels: riderAnalytics.map(([name]) => name), datasets: [{ label: "Assigned deliveries", data: riderAnalytics.map(([, value]) => value.total), backgroundColor: "#2E8B68", borderRadius: 7, borderSkipped: false }] }} options={{ indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: "#0d3257", padding: 10, cornerRadius: 8 } }, scales: { x: { beginAtZero: true, ticks: { color: "#6B7280", precision: 0 }, grid: { color: "#d1fae5" }, border: { display: false } }, y: { grid: { display: false }, ticks: { color: "#6B7280", font: { size: 9, weight: "600" } }, border: { display: false } } } }} /></div>
              </div>
            )}

          </div>

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

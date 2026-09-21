import { getServiceRequests } from "@/reduxStore/action/serviceRequestAction";

import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useEffect, useMemo, useState } from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

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

  const statusChart = useMemo(() => {
    const counts = (serviceRequests || []).reduce((result, request) => {
      const status = String(request?.ticketStatus || "Unknown").trim();
      const key = status || "Unknown";
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {});

    const sortedStatuses = Object.entries(counts).sort(
      ([, firstCount], [, secondCount]) => secondCount - firstCount,
    );
    const visibleStatuses = sortedStatuses.slice(0, 5);
    const remainingCount = sortedStatuses
      .slice(5)
      .reduce((total, [, count]) => total + count, 0);

    if (remainingCount > 0) {
      visibleStatuses.push(["Other", remainingCount]);
    }

    const chartColors = [
      "#0a2540",
      "#2E8B68",
      "#6FB894",
      "#A9D8BB",
      "#0d3257",
      "#DDEFE4",
    ];

    return {
      labels: visibleStatuses.map(([status]) => status),
      values: visibleStatuses.map(([, count]) => count),
      colors: chartColors.slice(0, visibleStatuses.length),
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
            className="relative overflow-hidden rounded-[30px] px-6 py-7 shadow-[0_20px_55px_rgba(15,23,42,0.25)] sm:px-8 sm:py-9"
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
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-extrabold text-white shadow-[0_8px_20px_rgba(15,23,42,0.30)] transition hover:-translate-y-0.5 hover:opacity-90"
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
                  className="group relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-[0_6px_25px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_22px_45px_rgba(15,23,42,0.15)]"
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
            STATUS CHART
        ==================================================== */}

        <section className="mb-8 rounded-[22px] border bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.06)] sm:p-6" style={{ borderColor: COLORS.accent }}>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.secondary }}>
                Request analytics
              </p>
              <h2 className="mt-1 text-[17px] font-extrabold" style={{ color: COLORS.primary }}>
                Requests by status
              </h2>
            </div>
            <span className="text-[10px] font-semibold" style={{ color: COLORS.secondary }}>
              Based on the current request results
            </span>
          </div>

          {statusChart.values.length > 0 ? (
            <div className="grid items-center gap-6 lg:grid-cols-[minmax(220px,300px)_1fr]">
              <div className="relative mx-auto h-[240px] w-full max-w-[300px]">
                <Doughnut
                  data={{
                    labels: statusChart.labels,
                    datasets: [
                      {
                        data: statusChart.values,
                        backgroundColor: statusChart.colors,
                        borderColor: "#FFFFFF",
                        borderWidth: 4,
                        hoverOffset: 6,
                      },
                    ],
                  }}
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
                        callbacks: {
                          label: (context) =>
                            ` ${context.label}: ${context.parsed}`,
                        },
                      },
                    },
                  }}
                />
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[28px] font-extrabold leading-none" style={{ color: COLORS.primary }}>
                    {requestStats.total}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold" style={{ color: COLORS.secondary }}>
                    requests
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {statusChart.labels.map((status, index) => (
                  <div key={status} className="flex items-center justify-between rounded-xl border px-3 py-3" style={{ borderColor: COLORS.accent, backgroundColor: COLORS.background }}>
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: statusChart.colors[index] }} />
                      <span className="truncate text-[11px] font-bold capitalize" style={{ color: COLORS.primary }}>
                        {status}
                      </span>
                    </div>
                    <span className="ml-3 text-[13px] font-extrabold" style={{ color: COLORS.primary }}>
                      {statusChart.values[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[180px] items-center justify-center rounded-xl border text-center" style={{ borderColor: COLORS.accent, backgroundColor: COLORS.background }}>
              <p className="text-[11px] font-semibold" style={{ color: COLORS.secondary }}>
                No request data available for this chart.
              </p>
            </div>
          )}
        </section>

        {/* ====================================================
            FILTER HEADER
        ==================================================== */}

        <div
          className="mb-4 overflow-hidden rounded-[20px] border bg-white shadow-[0_5px_20px_rgba(15,23,42,0.06)]"
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
          className="overflow-hidden rounded-[22px] border bg-white shadow-[0_18px_42px_rgba(15,23,42,0.10)]"
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

import { getServiceRequests } from "@/reduxStore/action/serviceRequestAction";

import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";

import {
  FaTicketAlt,
  FaUser,
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

/* ============================================================
   THEME
   ============================================================ */

const THEME = {
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  primarySoft: "#eff6ff",
  primarySoft2: "#f5f8ff",
  primaryBorder: "#dbeafe",

  text: "#111827",
  textSoft: "#475569",
  textMuted: "#64748b",
  textLight: "#94a3b8",

  white: "#ffffff",
  surface: "#f8fafc",
  surface2: "#f1f5f9",

  border: "#e2e8f0",
  borderSoft: "#edf2f7",

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
      color: THEME.primary,
      backgroundColor: THEME.primarySoft,
      border: `1px solid ${THEME.primaryBorder}`,
    };
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("progress") ||
    normalized.includes("assign")
  ) {
    return {
      color: THEME.warning,
      backgroundColor: THEME.warningSoft,
      border: `1px solid ${THEME.warningBorder}`,
    };
  }

  if (
    normalized.includes("complete") ||
    normalized.includes("resolve") ||
    normalized.includes("close")
  ) {
    return {
      color: THEME.success,
      backgroundColor: THEME.successSoft,
      border: `1px solid ${THEME.successBorder}`,
    };
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("reject")
  ) {
    return {
      color: THEME.danger,
      backgroundColor: THEME.dangerSoft,
      border: `1px solid ${THEME.dangerBorder}`,
    };
  }

  return {
    color: THEME.textSoft,
    backgroundColor: THEME.surface,
    border: `1px solid ${THEME.border}`,
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
      color: THEME.primary,
      backgroundColor: THEME.primarySoft,
      border: `1px solid ${THEME.primaryBorder}`,
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
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            py-2
          "
        >
          <IconBox
            size="h-10 w-10"
            radius="rounded-[11px]"
          >
            <FaTicketAlt size={14} />
          </IconBox>

          <div className="min-w-0">
            <div
              className="
                text-[11px]
                font-extrabold
                transition-colors
                hover:underline
              "
              style={{
                color: THEME.text,
              }}
            >
              #{row?._id?.slice(-8) || "--"}
            </div>

            <div
              className="
                mt-1
                flex
                items-center
                gap-1.5
                text-[9px]
                font-medium
              "
              style={{
                color: THEME.textMuted,
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
          className="
            flex
            min-w-0
            cursor-pointer
            items-center
            gap-2.5
            py-2
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[11px]
              font-extrabold
            "
            style={{
              color: THEME.primary,
              backgroundColor: THEME.primarySoft,
              border: `1px solid ${THEME.primaryBorder}`,
            }}
          >
            {row?.customer?.userName?.[0]?.toUpperCase() ||
              "—"}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="
                  max-w-[125px]
                  truncate
                  text-[11px]
                  font-bold
                "
                style={{
                  color: THEME.text,
                }}
              >
                {row?.customer?.userName || "--"}
              </div>

              {row?.customer?.userName && (
                <Link
                  to={`/users/customer/details?userId=${row?.customer?._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="
                    opacity-40
                    transition-all
                    hover:opacity-100
                  "
                  style={{
                    color: THEME.primary,
                  }}
                >
                  <FaExternalLinkAlt size={8} />
                </Link>
              )}
            </div>

            {row?.customer?.email && (
              <div
                className="
                  mt-0.5
                  max-w-[150px]
                  truncate
                  text-[9px]
                "
                style={{
                  color: THEME.textMuted,
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
          className="
            max-w-[250px]
            cursor-pointer
            py-2
          "
          title={row?.problemDescription}
        >
          <div
            className="
              line-clamp-2
              text-[11px]
              font-semibold
              leading-5
            "
            style={{
              color: THEME.text,
            }}
          >
            {row?.problemDescription || "--"}
          </div>

          <div
            className="
              mt-1
              flex
              items-center
              gap-1
              text-[9px]
              font-medium
            "
            style={{
              color: THEME.primary,
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
            className="
              inline-flex
              items-center
              rounded-full
              px-3
              py-1.5
              text-[9px]
              font-extrabold
              capitalize
            "
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
            className="
              inline-flex
              items-center
              rounded-full
              px-3
              py-1.5
              text-[9px]
              font-extrabold
              capitalize
            "
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
            className="
              inline-flex
              min-w-[78px]
              items-center
              justify-center
              rounded-full
              px-3
              py-1.5
              text-[9px]
              font-extrabold
              capitalize
            "
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
                className="
                  relative
                  h-11
                  w-11
                  overflow-hidden
                  rounded-[11px]
                  bg-slate-50
                "
                style={{
                  border: `1px solid ${THEME.border}`,
                }}
              >
                <img
                  src={row.attachments[0]}
                  alt="Attachment"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-300
                    hover:scale-105
                  "
                />
              </div>

              {row.attachments.length > 1 && (
                <span
                  className="
                    absolute
                    -right-2
                    -top-2
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    px-1
                    text-[8px]
                    font-extrabold
                    text-white
                  "
                  style={{
                    backgroundColor: THEME.primary,
                  }}
                >
                  +{row.attachments.length - 1}
                </span>
              )}
            </div>
          ) : (
            <div
              className="
                flex
                items-center
                gap-2
                text-[9px]
                font-semibold
              "
              style={{
                color: THEME.textMuted,
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
          className="
            flex
            cursor-pointer
            items-center
            gap-2.5
            py-2
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
            "
            style={{
              color: THEME.primary,
              backgroundColor: THEME.primarySoft,
              border: `1px solid ${THEME.primaryBorder}`,
            }}
          >
            <FaUser size={11} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="
                  max-w-[110px]
                  truncate
                  text-[10px]
                  font-bold
                "
                style={{
                  color: THEME.text,
                }}
              >
                {row?.technician?.userName ||
                  "Unassigned"}
              </div>

              {row?.technician?.userName && (
                <Link
                  to={`/users/technician/details?userId=${row?.technician?._id}`}
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                  className="
                    opacity-40
                    transition-all
                    hover:opacity-100
                  "
                  style={{
                    color: THEME.primary,
                  }}
                >
                  <FaExternalLinkAlt size={8} />
                </Link>
              )}
            </div>

            <div
              className="
                mt-0.5
                text-[8px]
                uppercase
                tracking-wide
              "
              style={{
                color: THEME.textMuted,
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
          className="
            flex
            cursor-pointer
            items-center
            gap-2
          "
        >
          <IconBox
            size="h-8 w-8"
            radius="rounded-[9px]"
          >
            <FiCalendar size={12} />
          </IconBox>

          <div>
            <div
              className="
                text-[10px]
                font-bold
              "
              style={{
                color: THEME.text,
              }}
            >
              {row?.createdAt
                ? moment(row.createdAt).format(
                    "DD MMM YYYY"
                  )
                : "--"}
            </div>

            <div
              className="
                mt-0.5
                text-[9px]
              "
              style={{
                color: THEME.textMuted,
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
      <div
        className="
          min-h-screen
          bg-[#f8fafc]
          px-0
          pb-8
          text-[#111827]
        "
      >
        {/* ====================================================
            PAGE HEADER
        ===================================================== */}

        <div
          className="
            relative
            mb-5
            overflow-hidden
            rounded-[20px]
            bg-white
            px-5
            py-5
            shadow-[0_4px_18px_rgba(37,99,235,0.06)]
            sm:px-6
          "
          style={{
            border: `1px solid ${THEME.borderSoft}`,
          }}
        >
          {/* BLUE DECORATION */}

          <div
            className="
              pointer-events-none
              absolute
              -right-12
              -top-14
              h-36
              w-36
              rounded-full
              opacity-[0.07]
            "
            style={{
              backgroundColor: THEME.primary,
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-16
              -left-10
              h-32
              w-32
              rounded-full
              opacity-[0.045]
            "
            style={{
              backgroundColor: THEME.primary,
            }}
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* HEADER LEFT */}

            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-[16px]
                "
                style={{
                  color: THEME.primary,
                  backgroundColor: THEME.primarySoft,
                  border: `1px solid ${THEME.primaryBorder}`,
                }}
              >
                <FaTicketAlt size={22} />
              </div>

              <div>
                <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                  <h1
                    className="
                      text-[20px]
                      font-extrabold
                      tracking-[-0.025em]
                    "
                    style={{
                      color: THEME.text,
                    }}
                  >
                    Service Requests
                  </h1>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      px-2.5
                      py-1
                      text-[8px]
                      font-extrabold
                      uppercase
                      tracking-[0.1em]
                    "
                    style={{
                      color: THEME.primary,
                      backgroundColor:
                        THEME.primarySoft,
                      border: `1px solid ${THEME.primaryBorder}`,
                    }}
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                      "
                      style={{
                        backgroundColor: THEME.primary,
                      }}
                    />

                    Live
                  </span>
                </div>

                <p
                  className="
                    max-w-[600px]
                    text-[11px]
                    leading-5
                  "
                  style={{
                    color: THEME.textMuted,
                  }}
                >
                  Manage, monitor and track customer
                  service requests, technicians, status
                  and attachments from one place.
                </p>
              </div>
            </div>

            {/* HEADER ACTIONS */}

            <div className="flex items-center gap-2">
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
                    className="
                      mt-2
                      min-w-[190px]
                      rounded-[14px]
                      bg-white
                      p-2
                      shadow-[0_15px_40px_rgba(15,23,42,0.12)]
                    "
                    style={{
                      border: `1px solid ${THEME.border}`,
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
                          className="
                            flex
                            cursor-pointer
                            items-center
                            gap-3
                            rounded-[10px]
                            px-3
                            py-2.5
                            text-[11px]
                            font-semibold
                            transition-all
                          "
                          style={{
                            color:
                              sortBy === val
                                ? THEME.primary
                                : THEME.text,
                            backgroundColor:
                              sortBy === val
                                ? THEME.primarySoft
                                : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (sortBy !== val) {
                              e.currentTarget.style.backgroundColor =
                                THEME.surface;
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
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-[11px]
                    bg-white
                    px-3.5
                    py-2.5
                    text-[10px]
                    font-bold
                    transition-all
                    hover:-translate-y-0.5
                  "
                  style={{
                    color: THEME.text,
                    border: `1px solid ${THEME.border}`,
                  }}
                >
                  <HiSortDescending
                    size={14}
                    style={{
                      color: THEME.primary,
                    }}
                  />

                  Sort
                </button>
              </Popover>

              {/* FILTER */}

              <button
                onClick={() =>
                  setFilterDragger(true)
                }
                className="
                  relative
                  flex
                  items-center
                  gap-2
                  rounded-[11px]
                  bg-white
                  px-3.5
                  py-2.5
                  text-[10px]
                  font-bold
                  transition-all
                  hover:-translate-y-0.5
                "
                style={{
                  color: THEME.text,
                  border: `1px solid ${THEME.border}`,
                }}
              >
                <MdOutlineTune
                  size={14}
                  style={{
                    color: THEME.primary,
                  }}
                />

                Filter

                {filterCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-1.5
                      -top-1.5
                      flex
                      h-4
                      w-4
                      items-center
                      justify-center
                      rounded-full
                      text-[8px]
                      font-bold
                      text-white
                    "
                    style={{
                      backgroundColor: THEME.primary,
                    }}
                  >
                    {filterCount}
                  </span>
                )}
              </button>

              {/* CREATE */}

              <button
                onClick={() =>
                  history.push(
                    "/services/servicerequests/request"
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  rounded-[11px]
                  px-4
                  py-2.5
                  text-[10px]
                  font-extrabold
                  text-white
                  shadow-[0_7px_18px_rgba(37,99,235,0.18)]
                  transition-all
                  hover:-translate-y-0.5
                "
                style={{
                  backgroundColor: THEME.primary,
                }}
              >
                <FaPlus size={8} />

                Create Request
              </button>
            </div>
          </div>
        </div>

        {/* ====================================================
            KPI CARDS
        ===================================================== */}

        <div
          className="
            mb-5
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
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
              Icon: FaUser,
            },
            {
              title: "Pending",
              value: requestStats.pending,
              desc: "In progress",
              Icon: FaClock,
            },
          ].map((item, index) => {
            const Icon = item.Icon;

            return (
              <div
                key={item.title}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[17px]
                  bg-white
                  p-4
                  shadow-[0_4px_18px_rgba(15,23,42,0.035)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_12px_30px_rgba(37,99,235,0.08)]
                "
                style={{
                  border: `1px solid ${THEME.borderSoft}`,
                }}
              >
                <div
                  className="
                    absolute
                    left-0
                    top-0
                    h-[3px]
                    w-full
                  "
                  style={{
                    backgroundColor: THEME.primary,
                  }}
                />

                <div
                  className="
                    absolute
                    -right-10
                    -top-10
                    h-24
                    w-24
                    rounded-full
                    opacity-[0.055]
                  "
                  style={{
                    backgroundColor: THEME.primary,
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p
                      className="
                        text-[8px]
                        font-extrabold
                        uppercase
                        tracking-[0.14em]
                      "
                      style={{
                        color: THEME.textMuted,
                      }}
                    >
                      {item.title}
                    </p>

                    <p
                      className="
                        mt-2
                        text-[25px]
                        font-extrabold
                        leading-none
                      "
                      style={{
                        color: THEME.text,
                      }}
                    >
                      {item.value}
                    </p>

                    <p
                      className="
                        mt-2
                        text-[9px]
                        font-medium
                      "
                      style={{
                        color: THEME.textLight,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>

                  <IconBox
                    size="h-11 w-11"
                    radius="rounded-[12px]"
                  >
                    <Icon size={17} />
                  </IconBox>
                </div>
              </div>
            );
          })}
        </div>

        {/* ====================================================
            FILTER HEADER
        ===================================================== */}

        <div
          className="
            mb-4
            overflow-hidden
            rounded-[17px]
            bg-white
            shadow-[0_4px_18px_rgba(15,23,42,0.035)]
          "
          style={{
            border: `1px solid ${THEME.borderSoft}`,
          }}
        >
          <div
            className="
              flex
              items-center
              gap-3
              border-b
              px-4
              py-3
            "
            style={{
              borderColor: THEME.borderSoft,
            }}
          >
            <IconBox
              size="h-8 w-8"
              radius="rounded-[9px]"
            >
              <FiList size={14} />
            </IconBox>

            <div>
              <h2
                className="
                  text-[12px]
                  font-extrabold
                "
                style={{
                  color: THEME.text,
                }}
              >
                Request Filters
              </h2>

              <p
                className="text-[9px]"
                style={{
                  color: THEME.textMuted,
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
        ===================================================== */}

        <div
          className="
            overflow-hidden
            rounded-[19px]
            bg-white
            shadow-[0_5px_22px_rgba(15,23,42,0.04)]
          "
          style={{
            border: `1px solid ${THEME.borderSoft}`,
          }}
        >
          {/* TABLE HEADER */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
            style={{
              borderColor: THEME.borderSoft,
            }}
          >
            <div className="flex items-center gap-3">
              <IconBox
                size="h-9 w-9"
                radius="rounded-[10px]"
              >
                <FaTicketAlt size={13} />
              </IconBox>

              <div>
                <h2
                  className="
                    text-[13px]
                    font-extrabold
                  "
                  style={{
                    color: THEME.text,
                  }}
                >
                  Recent Service Requests
                </h2>

                <p
                  className="
                    mt-0.5
                    text-[9px]
                    font-medium
                  "
                  style={{
                    color: THEME.textMuted,
                  }}
                >
                  Customer requests and service activity
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  px-3
                  py-1.5
                "
                style={{
                  backgroundColor: THEME.primarySoft,
                  border: `1px solid ${THEME.primaryBorder}`,
                }}
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                  "
                  style={{
                    backgroundColor: THEME.primary,
                  }}
                />

                <span
                  className="
                    text-[8px]
                    font-extrabold
                    uppercase
                    tracking-wide
                  "
                  style={{
                    color: THEME.primary,
                  }}
                >
                  {serviceRequests?.length || 0}{" "}
                  Showing
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
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-[9px]
                  transition-all
                  hover:-translate-y-0.5
                "
                style={{
                  color: THEME.primary,
                  backgroundColor: THEME.surface,
                  border: `1px solid ${THEME.border}`,
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
              <div
                className="
                  flex
                  min-h-[330px]
                  w-full
                  flex-col
                  items-center
                  justify-center
                  px-5
                  text-center
                "
              >
                <IconBox
                  size="h-16 w-16"
                  radius="rounded-[18px]"
                >
                  <FaTicketAlt size={23} />
                </IconBox>

                <div
                  className="
                    mt-4
                    text-[14px]
                    font-extrabold
                  "
                  style={{
                    color: THEME.text,
                  }}
                >
                  No Service Requests Found
                </div>

                <div
                  className="
                    mt-1
                    max-w-[330px]
                    text-[10px]
                    leading-5
                  "
                  style={{
                    color: THEME.textMuted,
                  }}
                >
                  There are no service requests
                  matching the current filters. Try
                  changing the filters or create a new
                  request.
                </div>

                <button
                  onClick={() =>
                    history.push(
                      "/services/servicerequests/request"
                    )
                  }
                  className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    rounded-[10px]
                    px-4
                    py-2
                    text-[10px]
                    font-extrabold
                    text-white
                    transition-all
                    hover:-translate-y-0.5
                  "
                  style={{
                    backgroundColor: THEME.primary,
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
                  backgroundColor: THEME.white,
                },
              },

              headRow: {
                style: {
                  minHeight: "48px",
                  backgroundColor: THEME.surface,
                  borderBottom: `1px solid ${THEME.border}`,
                },
              },

              headCells: {
                style: {
                  fontSize: "9px",
                  fontWeight: "800",
                  color: THEME.textSoft,
                  overflow: "hidden",
                  textTransform: "uppercase",
                  letterSpacing: "0.75px",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                },
              },

              rows: {
                style: {
                  minHeight: "76px",
                  backgroundColor: THEME.white,
                  borderBottom: `1px solid ${THEME.borderSoft}`,
                  cursor: "pointer",
                  transition:
                    "background-color 0.2s ease, box-shadow 0.2s ease",
                },

                highlightOnHoverStyle: {
                  backgroundColor: THEME.primarySoft2,
                  borderBottomColor:
                    THEME.primaryBorder,
                  outline: "none",
                  boxShadow:
                    `inset 3px 0 0 ${THEME.primary}`,
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
                  borderTop: `1px solid ${THEME.border}`,
                  backgroundColor: THEME.white,
                },
              },
            }}
          />

          {/* PAGINATION */}

          <div
            className="
              mt-0
              overflow-hidden
              border-t
              px-3
            "
            style={{
              borderColor: THEME.border,
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
      ===================================================== */}

      <MuiDrawer
        open={filterDragger}
        onClose={() => setFilterDragger(false)}
        drawerWidth="400px"
      >
        <div
          className="
            flex
            h-full
            flex-col
            bg-white
            p-5
          "
        >
          {/* DRAWER HEADER */}

          <div
            className="
              flex
              items-center
              gap-3
              border-b
              pb-4
            "
            style={{
              borderColor: THEME.border,
            }}
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-[12px]
              "
              style={{
                color: THEME.primary,
                backgroundColor: THEME.primarySoft,
                border: `1px solid ${THEME.primaryBorder}`,
              }}
            >
              <MdOutlineTune size={18} />
            </div>

            <div>
              <p
                className="font-extrabold"
                style={{
                  color: THEME.text,
                }}
              >
                Filter Requests
              </p>

              <p
                className="text-[10px]"
                style={{
                  color: THEME.textMuted,
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
                  className="
                    flex
                    flex-col
                    gap-1.5
                  "
                >
                  <label
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                    "
                    style={{
                      color: THEME.textMuted,
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
            className="
              flex
              items-center
              gap-3
              border-t
              pt-4
            "
            style={{
              borderColor: THEME.border,
            }}
          >
            <button
              onClick={handleClearFilter}
              className="
                h-11
                flex-1
                rounded-xl
                text-[11px]
                font-bold
                transition-all
                hover:bg-slate-50
              "
              style={{
                color: THEME.text,
                border: `1px solid ${THEME.border}`,
                backgroundColor: THEME.white,
              }}
            >
              Clear
            </button>

            <button
              onClick={handleFilter}
              className="
                h-11
                flex-1
                rounded-xl
                text-[11px]
                font-bold
                text-white
                shadow-[0_6px_16px_rgba(37,99,235,0.16)]
                transition-all
                hover:-translate-y-0.5
              "
              style={{
                backgroundColor: THEME.primary,
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
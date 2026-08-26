import { getServiceRequests } from "@/reduxStore/action/serviceRequestAction";

import moment from "moment";
import DataTable from "react-data-table-component";
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";

import {
  FaTicketAlt,
  FaUserCog,
  FaPaperclip,
  FaPlus,
  FaExternalLinkAlt,
  FaTools,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

import {
  FiActivity,
  FiArrowUpRight,
  FiCalendar,
  FiList,
  FiRefreshCw,
  FiTool,
} from "react-icons/fi";

import { HiSortDescending } from "react-icons/hi";
import {
  FaSortAmountUpAlt,
  FaSortAmountDownAlt,
} from "react-icons/fa";

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

import { statusTheme } from "@/utils/getStatusTheme";
import { Popover } from "react-tiny-popover";

/*
  IMPORTANT:
  Agar SidebarContext tumhare project mein kisi specific file se
  import hota hai, to uska existing import yahan add kar dena.

  Example:
  import { SidebarContext } from "@/context/SidebarContext";
*/

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

  /*
  ============================================================
  FETCH DATA
  ============================================================
  */

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

  /*
  ============================================================
  PAGINATION
  ============================================================
  */

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

  /*
  ============================================================
  TABLE HEADER FILTER
  ============================================================
  */

  const handleFilterValues = (values) => {
    setFilterValues(values);
  };

  /*
  ============================================================
  FILTER
  ============================================================
  */

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

  /*
  ============================================================
  CLEAR FILTER
  ============================================================
  */

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

  /*
  ============================================================
  SORT
  ============================================================
  */

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

  /*
  ============================================================
  OPEN REQUEST
  ============================================================
  */

  const openRequest = (id) => {
    if (!id) return;

    history.push(
      `/services/servicerequests/request?sr_id=${id}`
    );
  };

  /*
  ============================================================
  KPI DATA
  ============================================================
  */

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

  /*
  ============================================================
  TABLE COLUMNS
  ============================================================
  */

  const columns = [
    {
      name: "TICKET",

      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="flex cursor-pointer items-center gap-3 py-2"
        >
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-[12px]
              bg-[var(--secondary-light-2-color)]
              text-[var(--primary-elite-color)]
            "
          >
            <FaTicketAlt size={15} />
          </div>

          <div className="min-w-0">
            <div
              className="
                text-[11px]
                font-extrabold
                text-[var(--primary-elite-color)]
                transition-all
                hover:underline
              "
            >
              #{row?._id?.slice(-8) || "--"}
            </div>

            <div className="mt-1 flex items-center gap-1 text-[9px] opacity-40">
              <FaClock size={9} />

              {row?.createdAt
                ? moment(row.createdAt).fromNow()
                : "--"}
            </div>
          </div>
        </div>
      ),

      width: "190px",
    },

    /*
    ============================================================
    CUSTOMER
    ============================================================
    */

    {
      name: "CUSTOMER",

      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="
            flex min-w-0
            cursor-pointer
            items-center
            gap-2.5
            py-2
          "
        >
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-full
              bg-[var(--secondary-light-2-color)]
              text-[var(--primary-elite-color)]
              text-[11px]
              font-extrabold
            "
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
                  text-[var(--secondary-color)]
                "
              >
                {row?.customer?.userName || "--"}
              </div>

              {row?.customer?.userName && (
                <Link
                  to={`/users/customer/details?userId=${row?.customer?._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="
                    text-[var(--secondary-color)]
                    opacity-40
                    transition-all
                    hover:text-[var(--primary-elite-color)]
                    hover:opacity-100
                  "
                >
                  <FaExternalLinkAlt size={9} />
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
                  opacity-45
                "
              >
                {row.customer.email}
              </div>
            )}
          </div>
        </div>
      ),

      width: "235px",
    },

    /*
    ============================================================
    PROBLEM
    ============================================================
    */

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
              text-[var(--secondary-color)]
            "
          >
            {row?.problemDescription || "--"}
          </div>

          <div className="mt-1 flex items-center gap-1 text-[9px] opacity-40">
            <FiArrowUpRight size={9} />
            View request details
          </div>
        </div>
      ),

      width: "280px",
    },

    /*
    ============================================================
    TYPE
    ============================================================
    */

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
            style={statusTheme(row?.serviceRequestType)}
          >
            {row?.serviceRequestType || "--"}
          </span>
        </div>
      ),

      width: "155px",
    },

    /*
    ============================================================
    MODE
    ============================================================
    */

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
            style={statusTheme(row?.serviceMode)}
          >
            {row?.serviceMode || "--"}
          </span>
        </div>
      ),

      width: "135px",
    },

    /*
    ============================================================
    STATUS
    ============================================================
    */

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
              min-w-[75px]
              items-center
              justify-center
              rounded-full
              px-3
              py-1.5
              text-[9px]
              font-extrabold
              capitalize
            "
            style={statusTheme(row?.ticketStatus)}
          >
            {row?.ticketStatus || "--"}
          </span>
        </div>
      ),

      width: "145px",
    },

    /*
    ============================================================
    ATTACHMENTS
    ============================================================
    */

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
                  rounded-[10px]
                  border
                  border-[var(--secondary-light-2-color)]
                  bg-[var(--secondary-light-2-color)]
                "
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
                    text-[var(--primary-color)]
                  "
                  style={{
                    backgroundColor:
                      "var(--primary-elite-color)",
                  }}
                >
                  +{row.attachments.length - 1}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 opacity-35">
              <FaPaperclip size={11} />

              <span className="text-[9px] font-semibold">
                No files
              </span>
            </div>
          )}
        </div>
      ),

      width: "140px",
    },

    /*
    ============================================================
    TECHNICIAN
    ============================================================
    */

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
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-full
              bg-[var(--secondary-light-2-color)]
              text-[var(--primary-elite-color)]
            "
          >
            <FaUserCog size={12} />
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
                    hover:text-[var(--primary-elite-color)]
                    hover:opacity-100
                  "
                >
                  <FaExternalLinkAlt size={8} />
                </Link>
              )}
            </div>

            <div className="mt-0.5 text-[8px] uppercase tracking-wide opacity-40">
              {row?.technician?.userName
                ? "Assigned"
                : "Waiting for assignment"}
            </div>
          </div>
        </div>
      ),

      width: "205px",
    },

    /*
    ============================================================
    RAISED ON
    ============================================================
    */

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
          <div
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-[9px]
              bg-[var(--secondary-light-2-color)]
              text-[var(--primary-elite-color)]
            "
          >
            <FiCalendar size={13} />
          </div>

          <div>
            <div className="text-[10px] font-bold">
              {row?.createdAt
                ? moment(row.createdAt).format(
                    "DD MMM YYYY"
                  )
                : "--"}
            </div>

            <div className="mt-0.5 text-[9px] opacity-40">
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

  /*
  ============================================================
  RETURN
  ============================================================
  */

  return (
    <AnimatedContent>
      <div className="pb-8 text-[var(--secondary-color)]">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div
          className="
            relative
            mb-6
            overflow-hidden
            rounded-[24px]
            border
            border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            px-5
            py-5
            shadow-[0_8px_30px_rgba(15,23,42,0.04)]
            sm:px-6
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-12
              -top-16
              h-40
              w-40
              rounded-full
              opacity-[0.07]
            "
            style={{
              backgroundColor:
                "var(--primary-elite-color)",
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
                  text-[var(--primary-color)]
                  shadow-[0_10px_24px_rgba(0,0,0,0.10)]
                "
                style={{
                  backgroundColor:
                    "var(--primary-elite-color)",
                }}
              >
                <FaTicketAlt size={23} />
              </div>

              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h1 className="text-[20px] font-extrabold tracking-[-0.02em]">
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
                      text-[9px]
                      font-extrabold
                      uppercase
                      tracking-[0.08em]
                    "
                    style={{
                      color:
                        "var(--primary-elite-color)",
                      backgroundColor:
                        "var(--secondary-light-2-color)",
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          "var(--primary-elite-color)",
                      }}
                    />

                    Live
                  </span>
                </div>

                <p className="max-w-[580px] text-[11px] leading-5 opacity-55">
                  Manage, monitor and track customer
                  service requests, technicians, status
                  and attachments from one place.
                </p>
              </div>
            </div>

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
                      min-w-[175px]
                      rounded-xl
                      border
                      border-[var(--secondary-light-2-color)]
                      bg-[var(--primary-color)]
                      p-2
                      shadow-xl
                    "
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
                          className={`
                            flex
                            cursor-pointer
                            items-center
                            gap-3
                            rounded-lg
                            px-3
                            py-2
                            text-[11px]
                            font-semibold
                            transition
                            ${
                              sortBy === val
                                ? "bg-[var(--secondary-light-2-color)] text-[var(--primary-elite-color)]"
                                : "hover:bg-[var(--secondary-light-2-color)]"
                            }
                          `}
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
                    rounded-xl
                    border
                    border-[var(--secondary-light-2-color)]
                    bg-[var(--primary-color)]
                    px-4
                    py-2.5
                    text-[11px]
                    font-semibold
                    shadow-sm
                    transition
                    hover:border-[var(--primary-elite-color)]
                  "
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
                className="
                  relative
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[var(--secondary-light-2-color)]
                  bg-[var(--primary-color)]
                  px-4
                  py-2.5
                  text-[11px]
                  font-semibold
                  shadow-sm
                  transition
                  hover:border-[var(--primary-elite-color)]
                "
              >
                <MdOutlineTune size={15} />

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
                      text-[9px]
                      font-bold
                      text-[var(--primary-color)]
                    "
                    style={{
                      backgroundColor:
                        "var(--primary-elite-color)",
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
                  rounded-xl
                  px-4
                  py-2.5
                  text-[11px]
                  font-extrabold
                  text-[var(--primary-color)]
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:opacity-90
                "
                style={{
                  backgroundColor:
                    "var(--primary-elite-color)",
                }}
              >
                <FaPlus size={9} />
                Create Request
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            KPI CARDS
        ====================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[20px]
                  border
                  border-[var(--secondary-light-2-color)]
                  bg-[var(--primary-color)]
                  p-4
                  shadow-[0_5px_20px_rgba(15,23,42,0.035)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)]
                "
              >
                <div
                  className="
                    absolute
                    -right-8
                    -top-8
                    h-24
                    w-24
                    rounded-full
                    opacity-[0.06]
                  "
                  style={{
                    backgroundColor:
                      "var(--primary-elite-color)",
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] opacity-45">
                      {item.title}
                    </p>

                    <p className="mt-1.5 text-[24px] font-extrabold leading-none">
                      {item.value}
                    </p>

                    <p className="mt-2 text-[9px] font-semibold opacity-40">
                      {item.desc}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[13px]
                    "
                    style={{
                      color:
                        "var(--primary-elite-color)",
                      backgroundColor:
                        "var(--secondary-light-2-color)",
                    }}
                  >
                    <Icon size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            FILTER HEADER
        ====================================================== */}

        <div
          className="
            mb-4
            overflow-hidden
            rounded-[20px]
            border
            border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            shadow-[0_5px_20px_rgba(15,23,42,0.035)]
          "
        >
          <div className="flex items-center gap-3 border-b border-[var(--secondary-light-2-color)] px-4 py-3">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-[9px]
              "
              style={{
                color:
                  "var(--primary-elite-color)",
                backgroundColor:
                  "var(--secondary-light-2-color)",
              }}
            >
              <FiList size={15} />
            </div>

            <div>
              <h2 className="text-[12px] font-extrabold">
                Request Filters
              </h2>

              <p className="text-[9px] opacity-40">
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

        {/* =====================================================
            REQUEST TABLE
        ====================================================== */}

        <div
          className="
            overflow-hidden
            rounded-[22px]
            border
            border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            shadow-[0_8px_30px_rgba(15,23,42,0.045)]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              border-[var(--secondary-light-2-color)]
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
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
                  rounded-[11px]
                "
                style={{
                  color:
                    "var(--primary-elite-color)",
                  backgroundColor:
                    "var(--secondary-light-2-color)",
                }}
              >
                <FaTicketAlt size={14} />
              </div>

              <div>
                <h2 className="text-[13px] font-extrabold">
                  Recent Service Requests
                </h2>

                <p className="mt-0.5 text-[9px] font-medium opacity-45">
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
                  backgroundColor:
                    "var(--secondary-light-2-color)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      "var(--primary-elite-color)",
                  }}
                />

                <span className="text-[9px] font-extrabold uppercase tracking-wide opacity-60">
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
                  bg-[var(--secondary-light-2-color)]
                  opacity-60
                  transition-all
                  duration-200
                  hover:opacity-100
                "
                title="Refresh"
              >
                <FiRefreshCw size={13} />
              </button>
            </div>
          </div>

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
                <div
                  className="
                    mb-4
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-[18px]
                  "
                  style={{
                    color:
                      "var(--primary-elite-color)",
                    backgroundColor:
                      "var(--secondary-light-2-color)",
                  }}
                >
                  <FaTicketAlt size={24} />
                </div>

                <div className="text-[14px] font-extrabold">
                  No Service Requests Found
                </div>

                <div className="mt-1 max-w-[330px] text-[10px] leading-5 opacity-45">
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
                    text-[var(--primary-color)]
                    transition-all
                    hover:opacity-90
                  "
                  style={{
                    backgroundColor:
                      "var(--primary-elite-color)",
                  }}
                >
                  <FaPlus size={9} />
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
                  backgroundColor:
                    "var(--primary-color)",
                },
              },

              headRow: {
                style: {
                  minHeight: "50px",
                  backgroundColor:
                    "var(--secondary-light-2-color)",
                  borderBottom:
                    "1px solid var(--secondary-light-2-color)",
                },
              },

              headCells: {
                style: {
                  fontSize: "9.5px",
                  fontWeight: "800",
                  color:
                    "var(--secondary-color)",
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
                  backgroundColor:
                    "var(--primary-color)",
                  borderBottom:
                    "1px solid var(--secondary-light-2-color)",
                  cursor: "pointer",
                  transition:
                    "all 0.2s ease",
                },

                highlightOnHoverStyle: {
                  backgroundColor:
                    "var(--secondary-light-2-color)",
                  borderBottomColor:
                    "var(--secondary-light-2-color)",
                  outline: "none",
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
                  borderTop:
                    "1px solid var(--secondary-light-2-color)",
                  backgroundColor:
                    "var(--primary-color)",
                },
              },
            }}
          />

          {/* =================================================
              PAGINATION
          ================================================== */}

          <div
            className="
              mt-0
              overflow-hidden
              border-t
              border-[var(--secondary-light-2-color)]
              px-3
            "
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

      {/* =====================================================
          FILTER DRAWER
      ====================================================== */}

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
            bg-[var(--primary-color)]
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
              border-[var(--secondary-light-2-color)]
              pb-4
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
              "
              style={{
                backgroundColor:
                  "var(--primary-elite-color)",
                color:
                  "var(--primary-color)",
              }}
            >
              <MdOutlineTune size={18} />
            </div>

            <div>
              <p className="font-bold">
                Filter Requests
              </p>

              <p className="text-[10px] opacity-50">
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
                  setCustomerSelectedOption(
                    value
                  );
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
                  setRiderSelectedOption(
                    value
                  );
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
                  setTechnicianSelectedOption(
                    value
                  );
                  setTechnicianSelectedId(id);
                },

                options: userList
                  .filter(
                    (user) =>
                      user.role ===
                      "technician"
                  )
                  .map(
                    (user) => user.userName
                  ),

                optionsObject: userList.filter(
                  (user) =>
                    user.role ===
                    "technician"
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
                  className="flex flex-col gap-1"
                >
                  <label
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      opacity-60
                    "
                  >
                    {label}
                  </label>

                  <Dropdown
                    value={value}
                    placeholder={`Select ${label}`}
                    onSelect={onSelect}
                    options={options || []}
                    optionsObject={
                      optionsObject
                    }
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
              border-[var(--secondary-light-2-color)]
              pt-4
            "
          >
            <button
              onClick={handleClearFilter}
              className="
                flex-1
                h-11
                rounded-xl
                border
                border-[var(--secondary-light-2-color)]
                text-[11px]
                font-bold
                transition
                hover:bg-[var(--secondary-light-2-color)]
              "
            >
              Clear
            </button>

            <button
              onClick={handleFilter}
              className="
                flex-1
                h-11
                rounded-xl
                text-[11px]
                font-bold
                text-[var(--primary-color)]
                transition
                hover:opacity-90
              "
              style={{
                backgroundColor:
                  "var(--primary-elite-color)",
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

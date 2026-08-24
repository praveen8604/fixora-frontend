import { getServiceRequests } from "@/reduxStore/action/serviceRequestAction";
import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  FaTicket,
  FaUser,
  FaUserGear,
  FaPaperclip,
  FaPlus,
} from "react-icons/fa6";
import {
  FiActivity,
  FiArrowUpRight,
  FiCalendar,
  FiClock,
  FiList,
  FiMapPin,
  FiRefreshCw,
} from "react-icons/fi";

import TableHeader from "@/components/common/TableHeader";
import { statusTheme } from "@/utils/getStatusTheme";
import Pagination from "@/components/common/Pagination";
import { SidebarContext } from "@/context/SidebarContext";

const TicketManagement = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { serviceRequests, userList, totalPages } = useSelector(
    (state) => state.serviceRequestState
  );

  const { isSidebarOpen } = useContext(SidebarContext);

  const [filterValues, setFilterValues] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(
      getServiceRequests({
        ticketStatusSelectedOption: "",
        ticketTypeSelectedOption: "",
        customerSelectedId: "",
        technicianSelectedId: "",
        riderSelectedId: "",
        sortBy: -1,
        page: activePage,
        limit,
      })
    );
  }, [dispatch, activePage, limit]);

  const handlePagination = (currentPage) => {
    setActivePage(currentPage);

    dispatch(
      getServiceRequests({
        ...filterValues,
        page: currentPage,
        limit,
      })
    );
  };

  const handlePageLimit = (currentLimit) => {
    setLimit(currentLimit);
    setActivePage(1);

    dispatch(
      getServiceRequests({
        ...filterValues,
        page: 1,
        limit: currentLimit,
      })
    );
  };

  const handleFilterValues = (values) => {
    setFilterValues(values);
  };

  const openRequest = (id) => {
    if (!id) return;

    history.push(
      `/services/servicerequests/request?sr_id=${id}`
    );
  };

  /* ============================================================
     SUMMARY DATA
  ============================================================ */

  const requestStats = useMemo(() => {
    const requests = Array.isArray(serviceRequests)
      ? serviceRequests
      : [];

    const normalize = (value) =>
      String(value || "").toLowerCase().trim();

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

  /* ============================================================
     TABLE COLUMNS
  ============================================================ */

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
            <FaTicket size={15} />
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
              <FiClock size={9} />
              {row?.createdAt
                ? moment(row.createdAt).fromNow()
                : "--"}
            </div>
          </div>
        </div>
      ),
      width: "190px",
    },

    {
      name: "CUSTOMER",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="flex min-w-0 cursor-pointer items-center gap-2.5 py-2"
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
            {row?.customer?.userName?.[0]?.toUpperCase() || "—"}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="max-w-[125px] truncate text-[11px] font-bold text-[var(--secondary-color)]">
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
              <div className="mt-0.5 max-w-[150px] truncate text-[9px] opacity-45">
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
              px-3 py-1.5
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
              px-3 py-1.5
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
      width: "125px",
    },

    {
      name: "STATUS",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="cursor-pointer"
        >
          <span
            className={`
              inline-flex
              min-w-[75px]
              items-center
              justify-center
              rounded-full
              px-3 py-1.5
              text-[9px]
              font-extrabold
              capitalize
            `}
            style={statusTheme(row?.ticketStatus)}
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
              <div className="relative h-11 w-11 overflow-hidden rounded-[10px] border border-[var(--secondary-light-2-color)] bg-[var(--secondary-light-2-color)]">
                <img
                  src={row.attachments[0]}
                  alt="Attachment"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
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

    {
      name: "TECHNICIAN",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="flex cursor-pointer items-center gap-2.5 py-2"
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
            <FaUserGear size={12} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="max-w-[110px] truncate text-[10px] font-bold">
                {row?.technician?.userName || "Unassigned"}
              </div>

              {row?.technician?.userName && (
                <Link
                  to={`/users/technician/details?userId=${row?.technician?._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-40 transition-all hover:text-[var(--primary-elite-color)] hover:opacity-100"
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

    {
      name: "RAISED ON",
      cell: (row) => (
        <div
          onClick={() => openRequest(row?._id)}
          className="flex cursor-pointer items-center gap-2"
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
                ? moment(row.createdAt).format("DD MMM YYYY")
                : "--"}
            </div>

            <div className="mt-0.5 text-[9px] opacity-40">
              {row?.createdAt
                ? moment(row.createdAt).format("hh:mm A")
                : "--"}
            </div>
          </div>
        </div>
      ),
      width: "170px",
    },
  ];

  return (
    <div className="pb-8 text-[var(--secondary-color)]">
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}

      <div
        className="
          relative mb-6 overflow-hidden
          rounded-[24px]
          border border-[var(--secondary-light-2-color)]
          bg-[var(--primary-color)]
          px-5 py-5
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

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="
                flex h-14 w-14 shrink-0
                items-center justify-center
                rounded-[17px]
                text-[var(--primary-color)]
                shadow-[0_10px_24px_rgba(0,0,0,0.10)]
              "
              style={{
                backgroundColor:
                  "var(--primary-elite-color)",
              }}
            >
              <FaTicket size={23} />
            </div>

            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="text-[20px] font-extrabold tracking-[-0.02em]">
                  Service Requests
                </h1>

                <span
                  className="
                    inline-flex items-center gap-1.5
                    rounded-full
                    px-2.5 py-1
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
                Manage, monitor and track customer service requests,
                technicians, status and attachments from one place.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              history.push("/services/servicerequests/request")
            }
            className="
              group
              flex min-h-[42px]
              w-full sm:w-auto
              items-center justify-center
              gap-2
              rounded-[12px]
              px-5 py-2.5
              text-[11px]
              font-extrabold
              text-[var(--primary-color)]
              shadow-[0_8px_20px_rgba(0,0,0,0.10)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:opacity-90
            "
            style={{
              backgroundColor:
                "var(--primary-elite-color)",
            }}
          >
            <FaPlus size={10} />
            <span>Create Request</span>

            <FiArrowUpRight
              size={15}
              className="
                transition-transform
                duration-200
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
            />
          </button>
        </div>
      </div>

      {/* =========================================================
          SUMMARY CARDS
      ========================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div
          className="
            group relative overflow-hidden
            rounded-[20px]
            border border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            p-4
            shadow-[0_5px_20px_rgba(15,23,42,0.035)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)]
          "
        >
          <div
            className="
              absolute -right-8 -top-8
              h-24 w-24 rounded-full
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
                Total Requests
              </p>

              <p className="mt-1.5 text-[24px] font-extrabold leading-none">
                {requestStats.total}
              </p>

              <p className="mt-2 text-[9px] font-semibold opacity-40">
                Requests on this page
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-[13px]
              "
              style={{
                color:
                  "var(--primary-elite-color)",
                backgroundColor:
                  "var(--secondary-light-2-color)",
              }}
            >
              <FaTicket size={18} />
            </div>
          </div>
        </div>

        {/* Open */}
        <div
          className="
            group relative overflow-hidden
            rounded-[20px]
            border border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            p-4
            shadow-[0_5px_20px_rgba(15,23,42,0.035)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)]
          "
        >
          <div
            className="
              absolute -right-8 -top-8
              h-24 w-24 rounded-full
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
                Open Requests
              </p>

              <p className="mt-1.5 text-[24px] font-extrabold leading-none">
                {requestStats.open}
              </p>

              <p className="mt-2 text-[9px] font-semibold opacity-40">
                Awaiting resolution
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-[13px]
              "
              style={{
                color:
                  "var(--primary-elite-color)",
                backgroundColor:
                  "var(--secondary-light-2-color)",
              }}
            >
              <FiActivity size={19} />
            </div>
          </div>
        </div>

        {/* Assigned */}
        <div
          className="
            group relative overflow-hidden
            rounded-[20px]
            border border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            p-4
            shadow-[0_5px_20px_rgba(15,23,42,0.035)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)]
          "
        >
          <div
            className="
              absolute -right-8 -top-8
              h-24 w-24 rounded-full
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
                Assigned
              </p>

              <p className="mt-1.5 text-[24px] font-extrabold leading-none">
                {requestStats.assigned}
              </p>

              <p className="mt-2 text-[9px] font-semibold opacity-40">
                With technician
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-[13px]
              "
              style={{
                color:
                  "var(--primary-elite-color)",
                backgroundColor:
                  "var(--secondary-light-2-color)",
              }}
            >
              <FaUserGear size={18} />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div
          className="
            group relative overflow-hidden
            rounded-[20px]
            border border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            p-4
            shadow-[0_5px_20px_rgba(15,23,42,0.035)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)]
          "
        >
          <div
            className="
              absolute -right-8 -top-8
              h-24 w-24 rounded-full
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
                Pending
              </p>

              <p className="mt-1.5 text-[24px] font-extrabold leading-none">
                {requestStats.pending}
              </p>

              <p className="mt-2 text-[9px] font-semibold opacity-40">
                In progress
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-[13px]
              "
              style={{
                color:
                  "var(--primary-elite-color)",
                backgroundColor:
                  "var(--secondary-light-2-color)",
              }}
            >
              <FiClock size={19} />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FILTERS
      ========================================================== */}

      <div
        className="
          mb-4 overflow-hidden
          rounded-[20px]
          border border-[var(--secondary-light-2-color)]
          bg-[var(--primary-color)]
          shadow-[0_5px_20px_rgba(15,23,42,0.035)]
        "
      >
        <div className="flex items-center gap-3 border-b border-[var(--secondary-light-2-color)] px-4 py-3">
          <div
            className="
              flex h-8 w-8 items-center justify-center
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
            title={"Service Requests"}
            data={userList}
            filterValues={handleFilterValues}
            activePage={activePage}
            limit={limit}
          />
        </div>
      </div>

      {/* =========================================================
          REQUEST TABLE
      ========================================================== */}

      <div
        className="
          overflow-hidden
          rounded-[22px]
          border border-[var(--secondary-light-2-color)]
          bg-[var(--primary-color)]
          shadow-[0_8px_30px_rgba(15,23,42,0.045)]
        "
      >
        {/* Table Top Bar */}
        <div
          className="
            flex flex-col gap-3
            border-b border-[var(--secondary-light-2-color)]
            px-5 py-4
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-[11px]
              "
              style={{
                color:
                  "var(--primary-elite-color)",
                backgroundColor:
                  "var(--secondary-light-2-color)",
              }}
            >
              <FaTicket size={14} />
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
                flex items-center gap-1.5
                rounded-full
                bg-[var(--secondary-light-2-color)]
                px-3 py-1.5
              "
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    "var(--primary-elite-color)",
                }}
              />

              <span className="text-[9px] font-extrabold uppercase tracking-wide opacity-60">
                {serviceRequests?.length || 0} Showing
              </span>
            </div>

            <button
              onClick={() => {
                dispatch(
                  getServiceRequests({
                    ...filterValues,
                    page: activePage,
                    limit,
                  })
                );
              }}
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-[9px]
                bg-[var(--secondary-light-2-color)]
                opacity-60
                transition-all duration-200
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
          onRowClicked={(row) => openRequest(row?._id)}
          pointerOnHover
          noDataComponent={
            <div className="flex min-h-[330px] w-full flex-col items-center justify-center px-5 text-center">
              <div
                className="
                  mb-4 flex h-16 w-16
                  items-center justify-center
                  rounded-[18px]
                "
                style={{
                  color:
                    "var(--primary-elite-color)",
                  backgroundColor:
                    "var(--secondary-light-2-color)",
                }}
              >
                <FaTicket size={24} />
              </div>

              <div className="text-[14px] font-extrabold">
                No Service Requests Found
              </div>

              <div className="mt-1 max-w-[330px] text-[10px] leading-5 opacity-45">
                There are no service requests matching the current
                filters. Try changing the filters or create a new
                request.
              </div>

              <button
                onClick={() =>
                  history.push(
                    "/services/servicerequests/request"
                  )
                }
                className="
                  mt-5 flex items-center gap-2
                  rounded-[10px]
                  px-4 py-2
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
          className={`data_table_comp ${
            isSidebarOpen
              ? "data_table_comp_sidebar_opened"
              : "data_table_comp_sidebar_closed"
          } text-[var(--secondary-color)]`}
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
                transition:
                  "all 0.2s ease",
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
      </div>

      {/* =========================================================
          PAGINATION
      ========================================================== */}

      <div
        className="
          mt-4 overflow-hidden
          rounded-[18px]
          border border-[var(--secondary-light-2-color)]
          bg-[var(--primary-color)]
          px-3
          shadow-[0_5px_20px_rgba(15,23,42,0.035)]
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
  );
};

export default TicketManagement;
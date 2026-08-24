import Pagination from "@/components/common/Pagination";
import TableHeaderPayments from "./TableHeaderPayments";
import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaExternalLinkAlt,
  FaMoneyBillWave,
  FaRegCreditCard,
} from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { FiActivity, FiCalendar, FiHash } from "react-icons/fi";

import { SidebarContext } from "@/context/SidebarContext";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import { currencyFormatter } from "@/utils/currencyFormatter";

const PaymentLogs = () => {
  const [payments, setPayments] = useState([]);
  const { isSidebarOpen } = useContext(SidebarContext);

  const [filterValues, setFilterValues] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const handlePagination = (currentPage) => {
    setActivePage(currentPage);
    getPaymentLogs(currentPage, limit);
  };

  const handlePageLimit = (currentLimit) => {
    setLimit(currentLimit);
    setActivePage(1);
    getPaymentLogs(1, currentLimit);
  };

  const getPaymentLogs = (selectedPage, dataLimit) => {
    DashboardServices.getPaymentLogs(selectedPage, dataLimit)
      .then((res) => {
        if (res) {
          const decodedata = DecryptData(res);

          setTotalPages(decodedata?.data?.totalPages);
          setPayments(decodedata?.data?.payments || []);
        }
      })
      .catch((err) => {
        console.error("Error fetching payments:", err);
      });
  };

  const handleFilterValues = (e) => {
    setFilterValues(e);
  };

  useEffect(() => {
    getPaymentLogs(activePage, limit);
  }, []);

  /* -------------------------------------------------------
     STATUS BADGE
  ------------------------------------------------------- */

  const StatusBadge = ({ value }) => {
    if (!value) {
      return (
        <span className="px-3 py-1.5 rounded-full bg-[#F2F4F7] text-[#667085] text-[11px] font-bold">
          --
        </span>
      );
    }

    const status = value.toLowerCase();

    let style =
      "bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]";

    if (
      status.includes("success") ||
      status.includes("paid") ||
      status.includes("complete") ||
      status.includes("approved")
    ) {
      style =
        "bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]";
    }

    if (
      status.includes("pending") ||
      status.includes("process")
    ) {
      style =
        "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]";
    }

    if (
      status.includes("fail") ||
      status.includes("cancel") ||
      status.includes("reject")
    ) {
      style =
        "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]";
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10.5px] font-bold capitalize ${style}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {value}
      </span>
    );
  };

  /* -------------------------------------------------------
     SERVICE MODE
  ------------------------------------------------------- */

  const ServiceMode = ({ value }) => {
    if (!value) {
      return (
        <span className="text-[#98A2B3] text-xs">
          --
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#F4F7FF] text-[#4F46E5] text-[11px] font-bold capitalize border border-[#E0E7FF]">
        {value}
      </span>
    );
  };

  /* -------------------------------------------------------
     COLUMNS
  ------------------------------------------------------- */

  const columns = [
    {
      name: (
        <div className="flex items-center gap-2">
          <FiHash />
          Quotation ID
        </div>
      ),
      cell: (row) => (
        <div className="font-bold text-[#344054] text-[11px]">
          {row?._id || "--"}
        </div>
      ),
      width: "170px",
    },

    {
      name: (
        <div className="flex items-center gap-2">
          <FiHash />
          SR ID
        </div>
      ),
      cell: (row) => (
        <div className="font-semibold text-[#667085] text-[11px]">
          {row?.serviceRequest?._id || "--"}
        </div>
      ),
      width: "170px",
    },

    {
      name: "Customer",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] font-bold text-xs">
            {row?.serviceRequest?.customer?.userName
              ?.charAt(0)
              ?.toUpperCase() || "?"}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-[#344054] text-[11px]">
              {row?.serviceRequest?.customer?.userName || "--"}
            </span>

            {row?.serviceRequest?.customer?.userName && (
              <Link
                to={`/users/customer/details?userId=${row?.serviceRequest?.customer?._id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt
                  size={10}
                  className="text-[#98A2B3] hover:text-[#4F46E5] transition-colors"
                />
              </Link>
            )}
          </div>
        </div>
      ),
      width: "230px",
    },

    {
      name: "Payment Status",
      cell: (row) => (
        <StatusBadge value={row?.paymentInfo?.paymentStatus} />
      ),
      width: "180px",
    },

    {
      name: "Service Mode",
      cell: (row) => (
        <ServiceMode value={row?.serviceRequest?.serviceMode} />
      ),
      width: "150px",
    },

    {
      name: "Ticket Status",
      cell: (row) => (
        <StatusBadge value={row?.serviceRequest?.ticketStatus} />
      ),
      width: "180px",
    },

    {
      name: (
        <div className="flex items-center gap-2">
          <FaRegCreditCard />
          Payment Method
        </div>
      ),
      cell: (row) => (
        <div className="flex items-center gap-2 text-[#475467]">
          <div className="w-8 h-8 rounded-lg bg-[#F4F7FF] flex items-center justify-center text-[#4F46E5]">
            <FaRegCreditCard size={13} />
          </div>

          <span className="font-bold text-[11px]">
            {row?.paymentInfo?.paymentMethod || "--"}
          </span>
        </div>
      ),
      width: "190px",
    },

    {
      name: "Items Qty",
      cell: (row) => {
        const quantity =
          row?.changeParts
            ?.map((e) => Number(e.qty))
            ?.reduce((acc, curr) => acc + curr, 0) || 0;

        return (
          <span className="inline-flex min-w-[34px] justify-center px-2 py-1 rounded-lg bg-[#F2F4F7] text-[#344054] font-bold text-xs">
            {quantity || "--"}
          </span>
        );
      },
      width: "130px",
    },

    {
      name: "Items Price",
      cell: (row) => (
        <div className="font-semibold text-[#475467] text-[11px]">
          {currencyFormatter(
            Number(row?.subTotal) - Number(row?.serviceFee)
          )}
        </div>
      ),
      width: "150px",
    },

    {
      name: "Service Fee",
      cell: (row) => (
        <div className="font-semibold text-[#475467] text-[11px]">
          {currencyFormatter(Number(row?.serviceFee))}
        </div>
      ),
      width: "140px",
    },

    {
      name: "Tax",
      cell: (row) => (
        <div className="font-semibold text-[#475467] text-[11px]">
          {currencyFormatter(Number(row?.tax))}
        </div>
      ),
      width: "130px",
    },

    {
      name: (
        <div className="flex items-center gap-2 text-[#3730A3]">
          <FaMoneyBillWave />
          Total Price
        </div>
      ),
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
            <MdOutlinePayments size={17} />
          </div>

          <span className="font-extrabold text-[#3730A3] text-xs">
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
        <div className="text-[#667085] text-[10.5px] font-semibold">
          {moment(row?.createdAt).format("DD-MMM-YYYY hh:mm A")}
        </div>
      ),
      width: "200px",
    },

    {
      name: (
        <div className="flex items-center gap-2">
          <FiActivity />
          Updated On
        </div>
      ),
      cell: (row) => (
        <div className="text-[#667085] text-[10.5px] font-semibold">
          {moment(row?.updatedAt).format("DD-MMM-YYYY hh:mm A")}
        </div>
      ),
      width: "200px",
    },
  ];

  return (
    <div className="min-h-full bg-[#F7F9FC] p-4 md:p-5">

      {/* ---------------------------------------------------
          PAGE INTRO
      --------------------------------------------------- */}

      <div className="mb-5 rounded-2xl border border-[#E4E7EC] bg-white overflow-hidden shadow-[0_4px_20px_rgba(79,70,229,0.06)]">

        <div className="px-5 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] shadow-sm">
              <MdOutlinePayments size={25} />
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-[#344054]">
                Payment Logs
              </h1>

              <p className="mt-1 text-xs text-[#667085]">
                Track transactions, payment status and service billing
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4F7FF] border border-[#E0E7FF]">
            <FiActivity className="text-[#4F46E5]" size={16} />

            <span className="text-xs font-bold text-[#475467]">
              Payment Activity
            </span>
          </div>

        </div>

        {/* Accent Line */}
        <div className="h-[3px] bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#818CF8]" />

      </div>

      {/* ---------------------------------------------------
          FILTER HEADER
      --------------------------------------------------- */}

      <div className="mb-4">
        <TableHeaderPayments
          title="Payment Transactions"
          filterValues={handleFilterValues}
          activePage={activePage}
          limit={limit}
        />
      </div>

      {/* ---------------------------------------------------
          TABLE
      --------------------------------------------------- */}

      <div className="rounded-2xl overflow-hidden border border-[#E4E7EC] bg-white shadow-[0_4px_18px_rgba(16,24,40,0.05)]">

        <DataTable
          columns={columns}
          data={payments}
          noDataComponent={
            <div className="flex flex-col items-center justify-center h-36 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5] mb-3">
                <MdOutlinePayments size={23} />
              </div>

              <p className="font-bold text-sm text-[#475467]">
                No payment records
              </p>

              <p className="text-xs text-[#98A2B3] mt-1">
                There are no payment transactions to display.
              </p>
            </div>
          }
          fixedHeader
          fixedHeaderScrollHeight="65vh"
          className={`data_table_comp ${
            isSidebarOpen
              ? "data_table_comp_sidebar_opened"
              : "data_table_comp_sidebar_closed"
          }`}
          customStyles={{
            table: {
              style: {
                backgroundColor: "#FFFFFF",
              },
            },

            headRow: {
              style: {
                backgroundColor: "#F4F7FF",
                borderBottom: "1px solid #E4E7EC",
                minHeight: "58px",
              },
            },

            headCells: {
              style: {
                fontWeight: "800",
                fontSize: "11px",
                color: "#344054",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                overflow: "hidden",
              },
            },

            rows: {
              style: {
                minHeight: "70px",
                borderBottom: "1px solid #F0F2F5",
                backgroundColor: "#FFFFFF",
                transition: "all 0.2s ease",
              },

              highlightOnHoverStyle: {
                backgroundColor: "#F8F9FF",
                borderBottomColor: "#E0E7FF",
                transform: "translateY(-1px)",
                transitionDuration: "0.2s",
                cursor: "pointer",
              },
            },

            cells: {
              style: {
                fontSize: "11.5px",
                fontWeight: "600",
                color: "#475467",
              },
            },
          }}
        />

      </div>

      {/* ---------------------------------------------------
          PAGINATION
      --------------------------------------------------- */}

      <div className="mt-4 rounded-2xl border border-[#E4E7EC] bg-white px-3 py-1 shadow-[0_3px_12px_rgba(16,24,40,0.04)]">
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

export default PaymentLogs;
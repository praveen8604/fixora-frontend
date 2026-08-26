import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import DataTable from "react-data-table-component";

import AnimatedContent from "@/components/common/AnimatedContent";
import Pagination from "@/components/common/Pagination";

import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { statusTheme } from "@/utils/getStatusTheme";

import { SidebarContext } from "@/context/SidebarContext";

import {
  FaWallet,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExternalLinkAlt,
  FaRegCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";

import { MdPayment, MdOutlinePayments } from "react-icons/md";

import {
  FiActivity,
  FiCalendar,
  FiHash,
  FiArrowUpRight,
} from "react-icons/fi";

/* =========================================================
   COLOR TONES
========================================================= */

const tones = {
  slate: {
    icon: "from-[#5E63D9] to-[#35C7F3]",
    soft: "from-[#EEF0FF] to-[#F4FDFF]",
    line: "from-[#5E63D9] to-[#35C7F3]",
  },

  emerald: {
    icon: "from-[#10B981] to-[#67E8C4]",
    soft: "from-[#ECFDF5] to-[#F0FDFA]",
    line: "from-[#10B981] to-[#59D6BF]",
  },

  amber: {
    icon: "from-[#8B5CF6] to-[#6366F1]",
    soft: "from-[#F4F0FF] to-[#F5F3FF]",
    line: "from-[#8B5CF6] to-[#4CC9F0]",
  },

  rose: {
    icon: "from-[#F43F5E] to-[#FB7185]",
    soft: "from-[#FFF1F3] to-[#FFF5F7]",
    line: "from-[#F43F5E] to-[#FB7185]",
  },
};

/* =========================================================
   KPI CARD
========================================================= */

const KpiCard = ({
  title,
  value,
  desc,
  tone,
  Icon,
  loading,
}) => {
  const t = tones[tone];

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/70
        bg-white/90
        p-6
        shadow-[0_12px_36px_rgba(84,98,130,0.12)]
        backdrop-blur-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_44px_rgba(84,98,130,0.18)]
      "
    >
      {/* Decorative Glow */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-28
          w-28
          rounded-full
          bg-gradient-to-br
          ${t.soft}
          opacity-95
          blur-sm
          transition-transform
          duration-500
          group-hover:scale-125
        `}
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-3
          left-6
          right-6
          h-px
          bg-gradient-to-r
          from-transparent
          via-white
          to-transparent
          opacity-80
        "
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div
          className={`
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-[18px]
            bg-gradient-to-br
            ${t.icon}
            text-white
            shadow-[0_16px_30px_rgba(99,102,241,0.28)]
            transition-transform
            duration-300
            group-hover:scale-105
            group-hover:rotate-3
          `}
        >
          <Icon size={20} />
        </div>

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-[#EEF0F6]
            bg-white/85
            text-[#9AA2B1]
            transition-all
            duration-300
            group-hover:border-[#DADDF3]
            group-hover:text-[#5E63D9]
          "
        >
          <FiArrowUpRight size={14} />
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <p
          className="
            text-[11px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[#98A1B2]
          "
        >
          {title}
        </p>

        <div className="mt-3 flex items-end justify-between gap-3">
          <h3
            className="
              text-[30px]
              font-extrabold
              leading-none
              tracking-[-0.04em]
              text-[#1F2430]
            "
          >
            {loading ? "--" : value}
          </h3>

          <span
            className="
              max-w-[110px]
              text-right
              text-[10px]
              font-semibold
              text-[#A1A9B8]
            "
          >
            {desc}
          </span>
        </div>
      </div>

      <div
        className="
          absolute
          bottom-0
          left-6
          right-6
          h-1
          overflow-hidden
          rounded-full
          bg-[#EEF2F8]
        "
      >
        <div
          className={`
            h-full
            w-0
            rounded-full
            bg-gradient-to-r
            ${t.line}
            transition-all
            duration-500
            group-hover:w-full
          `}
        />
      </div>
    </div>
  );
};

/* =========================================================
   PAYMENT LOGS
========================================================= */

const PaymentLogs = () => {
  const [payments, setPayments] = useState([]);

  const { isSidebarOpen } = useContext(SidebarContext);

  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     GET PAYMENT LOGS
  ======================================================= */

  const getPaymentLogs = (page, lim) => {
    setLoading(true);

    DashboardServices.getPaymentLogs(page, lim)
      .then((res) => {
        if (res) {
          const decodedData = DecryptData(res);

          setTotalPages(decodedData?.data?.totalPages || 0);

          setPayments(
            decodedData?.data?.payments || []
          );
        }
      })
      .catch((err) => {
        console.error(
          "Error fetching payments:",
          err
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    getPaymentLogs(activePage, limit);
  }, []);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const handlePagination = (currentPage) => {
    setActivePage(currentPage);

    getPaymentLogs(
      currentPage,
      limit
    );
  };

  const handlePageLimit = (currentLimit) => {
    setLimit(currentLimit);
    setActivePage(1);

    getPaymentLogs(
      1,
      currentLimit
    );
  };

  /* =======================================================
     STATUS BADGE
  ======================================================= */

  const StatusBadge = ({ value }) => {
    if (!value) {
      return (
        <span
          className="
            inline-flex
            items-center
            rounded-full
            bg-[#F2F4F7]
            px-3
            py-1.5
            text-[10.5px]
            font-bold
            text-[#667085]
          "
        >
          --
        </span>
      );
    }

    return (
      <span
        className={`
          inline-flex
          items-center
          gap-1.5
          rounded-full
          px-3
          py-1.5
          text-[10.5px]
          font-bold
          capitalize
          ${statusTheme(value, true)}
        `}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />

        {value}
      </span>
    );
  };

  /* =======================================================
     SERVICE MODE
  ======================================================= */

  const ServiceMode = ({ value }) => {
    if (!value) {
      return (
        <span className="text-xs text-[#98A2B3]">
          --
        </span>
      );
    }

    return (
      <span
        className="
          inline-flex
          items-center
          rounded-full
          px-3
          py-1.5
          text-[10.5px]
          font-bold
          capitalize
        "
        style={statusTheme(value)}
      >
        {value}
      </span>
    );
  };

  /* =======================================================
     KPI CALCULATIONS
  ======================================================= */

  const totalRevenue = payments.reduce(
    (sum, payment) =>
      sum + Number(payment?.total || 0),
    0
  );

  const paid = payments.filter((payment) =>
    [
      "paid",
      "payment_success",
      "completed",
      "success",
    ].includes(
      payment?.paymentInfo?.paymentStatus?.toLowerCase()
    )
  ).length;

  const pending = payments.filter((payment) =>
    [
      "pending",
      "payment_pending",
      "payment_initiate_pending",
      "processing",
    ].includes(
      payment?.paymentInfo?.paymentStatus?.toLowerCase()
    )
  ).length;

  const failed = payments.filter((payment) =>
    [
      "failed",
      "payment_declined",
      "timed_out",
      "cancelled",
      "canceled",
    ].includes(
      payment?.paymentInfo?.paymentStatus?.toLowerCase()
    )
  ).length;

  const metrics = [
    {
      title: "Total Revenue",
      value: currencyFormatter(totalRevenue),
      desc: "All transactions",
      tone: "slate",
      Icon: FaWallet,
    },

    {
      title: "Paid",
      value: paid,
      desc: "Successful payments",
      tone: "emerald",
      Icon: FaCheckCircle,
    },

    {
      title: "Pending",
      value: pending,
      desc: "Awaiting payment",
      tone: "amber",
      Icon: FaClock,
    },

    {
      title: "Failed",
      value: failed,
      desc: "Failed transactions",
      tone: "rose",
      Icon: FaTimesCircle,
    },
  ];

  /* =======================================================
     TABLE COLUMNS
  ======================================================= */

  const columns = [
    /* -------------------------------------------------------
       QUOTATION ID
    ------------------------------------------------------- */

    {
      name: (
        <div className="flex items-center gap-2">
          <FiHash />
          Quotation ID
        </div>
      ),

      cell: (row) => (
        <span className="text-[11px] font-bold text-[#344054]">
          #{row?._id?.slice(-8) || "--"}
        </span>
      ),

      width: "145px",
    },

    /* -------------------------------------------------------
       SERVICE REQUEST ID
    ------------------------------------------------------- */

    {
      name: (
        <div className="flex items-center gap-2">
          <FiHash />
          SR ID
        </div>
      ),

      cell: (row) => (
        <span className="font-mono text-[11px] text-[#68717F]">
          #{row?.serviceRequest?._id?.slice(-8) || "--"}
        </span>
      ),

      width: "140px",
    },

    /* -------------------------------------------------------
       CUSTOMER
    ------------------------------------------------------- */

    {
      name: "Customer",

      cell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-[#E5E9F3]
              bg-gradient-to-br
              from-[#F4F6FF]
              to-[#F6FCFF]
              text-xs
              font-bold
              text-[#3A4457]
            "
          >
            {row
              ?.serviceRequest
              ?.customer
              ?.userName?.[0]
              ?.toUpperCase() || "?"}
          </div>

          <p
            className="
              max-w-[100px]
              truncate
              text-[11px]
              font-bold
              text-[#20242B]
            "
          >
            {row
              ?.serviceRequest
              ?.customer
              ?.userName || "--"}
          </p>

          {row
            ?.serviceRequest
            ?.customer
            ?.userName && (
            <div
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <Link
                to={`/users/customer/details?userId=${row?.serviceRequest?.customer?._id}`}
              >
                <FaExternalLinkAlt
                  className="
                    text-[#9AA2AC]
                    transition-colors
                    hover:text-[#4F46E5]
                  "
                  size={10}
                />
              </Link>
            </div>
          )}
        </div>
      ),

      width: "210px",
    },

    /* -------------------------------------------------------
       PAYMENT STATUS
    ------------------------------------------------------- */

    {
      name: "Payment Status",

      cell: (row) => (
        <StatusBadge
          value={
            row?.paymentInfo
              ?.paymentStatus
          }
        />
      ),

      width: "170px",
    },

    /* -------------------------------------------------------
       SERVICE MODE
    ------------------------------------------------------- */

    {
      name: "Service Mode",

      cell: (row) => (
        <ServiceMode
          value={
            row
              ?.serviceRequest
              ?.serviceMode
          }
        />
      ),

      width: "140px",
    },

    /* -------------------------------------------------------
       TICKET STATUS
    ------------------------------------------------------- */

    {
      name: "Ticket Status",

      cell: (row) => (
        <StatusBadge
          value={
            row
              ?.serviceRequest
              ?.ticketStatus
          }
        />
      ),

      width: "170px",
    },

    /* -------------------------------------------------------
       PAYMENT METHOD
    ------------------------------------------------------- */

    {
      name: (
        <div className="flex items-center gap-2">
          <FaRegCreditCard />
          Payment Method
        </div>
      ),

      cell: (row) => (
        <div className="flex items-center gap-2 text-[#475467]">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-[#F4F7FF]
              text-[#4F46E5]
            "
          >
            <FaRegCreditCard size={13} />
          </div>

          <span className="text-[11px] font-bold">
            {row
              ?.paymentInfo
              ?.paymentMethod || "--"}
          </span>
        </div>
      ),

      width: "190px",
    },

    /* -------------------------------------------------------
       ITEMS QUANTITY
    ------------------------------------------------------- */

    {
      name: "Items Qty",

      cell: (row) => {
        const quantity =
          row?.changeParts
            ?.map((item) =>
              Number(item?.qty)
            )
            ?.reduce(
              (acc, current) =>
                acc + current,
              0
            ) || 0;

        return (
          <span
            className="
              inline-flex
              min-w-[34px]
              justify-center
              rounded-lg
              bg-[#F2F4F7]
              px-2
              py-1
              text-xs
              font-bold
              text-[#344054]
            "
          >
            {quantity || "--"}
          </span>
        );
      },

      width: "110px",
    },

    /* -------------------------------------------------------
       ITEMS PRICE
    ------------------------------------------------------- */

    {
      name: "Items Price",

      cell: (row) => (
        <span className="text-[11px] font-semibold text-[#59626E]">
          {currencyFormatter(
            Number(row?.subTotal) -
              Number(row?.serviceFee)
          )}
        </span>
      ),

      width: "140px",
    },

    /* -------------------------------------------------------
       SERVICE FEE
    ------------------------------------------------------- */

    {
      name: "Service Fee",

      cell: (row) => (
        <span className="text-[11px] font-semibold text-[#59626E]">
          {currencyFormatter(
            Number(row?.serviceFee)
          )}
        </span>
      ),

      width: "120px",
    },

    /* -------------------------------------------------------
       TAX
    ------------------------------------------------------- */

    {
      name: "Tax",

      cell: (row) => (
        <span className="text-[11px] font-semibold text-[#59626E]">
          {currencyFormatter(
            Number(row?.tax)
          )}
        </span>
      ),

      width: "100px",
    },

    /* -------------------------------------------------------
       TOTAL PRICE
    ------------------------------------------------------- */

    {
      name: (
        <div className="flex items-center gap-2 text-[#3730A3]">
          <FaMoneyBillWave />
          Total Price
        </div>
      ),

      cell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-[#EEF2FF]
              text-[#4F46E5]
            "
          >
            <MdOutlinePayments size={17} />
          </div>

          <span className="text-xs font-extrabold text-[#3730A3]">
            {currencyFormatter(
              Number(row?.total)
            )}
          </span>
        </div>
      ),

      width: "170px",
    },

    /* -------------------------------------------------------
       CREATED ON
    ------------------------------------------------------- */

    {
      name: (
        <div className="flex items-center gap-2">
          <FiCalendar />
          Created On
        </div>
      ),

      cell: (row) => (
        <div className="text-[10.5px] font-semibold text-[#667085]">
          {row?.createdAt
            ? moment(
                row.createdAt
              ).format(
                "DD-MMM-YYYY hh:mm A"
              )
            : "--"}
        </div>
      ),

      width: "190px",
    },

    /* -------------------------------------------------------
       UPDATED ON
    ------------------------------------------------------- */

    {
      name: (
        <div className="flex items-center gap-2">
          <FiActivity />
          Updated On
        </div>
      ),

      cell: (row) => (
        <div className="text-[10.5px] font-semibold text-[#667085]">
          {row?.updatedAt
            ? moment(
                row.updatedAt
              ).format(
                "DD-MMM-YYYY hh:mm A"
              )
            : "--"}
        </div>
      ),

      width: "190px",
    },
  ];

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#F5F7FF] pb-10">

        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            relative
            mb-8
            overflow-hidden
            rounded-[36px]
            border
            border-[#E9ECF7]
            bg-[radial-gradient(circle_at_top_right,_rgba(222,244,255,0.9),_rgba(255,255,255,0.96)_30%,_rgba(246,242,255,0.92)_65%,_rgba(255,255,255,0.98)_100%)]
            px-6
            py-8
            shadow-[0_20px_50px_rgba(91,107,138,0.12)]
            lg:px-10
            lg:py-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-50
              [background-image:radial-gradient(#DBE1F0_0.8px,transparent_0.8px)]
              [background-size:18px_18px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              right-16
              top-20
              h-40
              w-40
              rounded-full
              border
              border-[#DCEEFF]
              opacity-80
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              right-8
              top-28
              h-52
              w-52
              rounded-full
              border
              border-[#E8DFFF]
              opacity-70
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-12
              left-1/2
              h-40
              w-80
              -translate-x-1/2
              rounded-full
              bg-[#CFF4FF]
              opacity-35
              blur-3xl
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-start
              lg:justify-between
            "
          >
            {/* HERO CONTENT */}

            <div className="max-w-[720px]">

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#E8EAFE]
                  bg-white/80
                  px-4
                  py-2
                  shadow-[0_8px_18px_rgba(95,99,221,0.08)]
                  backdrop-blur-sm
                "
              >
                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-[#5E63D9]
                    text-white
                  "
                >
                  <MdPayment size={14} />
                </span>

                <span
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[#5E63D9]
                  "
                >
                  Finance
                </span>
              </div>

              <h1
                className="
                  mt-6
                  max-w-[760px]
                  text-[38px]
                  font-extrabold
                  leading-[1.03]
                  tracking-[-0.05em]
                  text-[#1B2230]
                  lg:text-[56px]
                "
              >
                Everything you need to

                <span
                  className="
                    bg-gradient-to-r
                    from-[#6A4FF6]
                    via-[#5A67F2]
                    to-[#2EA8E6]
                    bg-clip-text
                    text-transparent
                  "
                >
                  {" "}
                  track your payments.
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-[620px]
                  text-[15px]
                  leading-8
                  text-[#6F7B8F]
                "
              >
                Monitor revenue, payment status,
                and quotation activity in one
                beautifully designed finance
                workspace with quick visibility
                into every transaction.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                {/* TOTAL REVENUE */}

                <div
                  className="
                    inline-flex
                    items-center
                    gap-3
                    rounded-[18px]
                    bg-gradient-to-r
                    from-[#5F5CF1]
                    to-[#7E42F5]
                    px-5
                    py-4
                    text-white
                    shadow-[0_16px_32px_rgba(101,86,243,0.28)]
                  "
                >
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/10
                    "
                  >
                    <FaWallet size={16} />
                  </span>

                  <div>
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-white/75
                      "
                    >
                      Total Revenue
                    </p>

                    <p className="text-[20px] font-extrabold leading-none">
                      {loading
                        ? "--"
                        : currencyFormatter(
                            totalRevenue
                          )}
                    </p>
                  </div>
                </div>

                {/* RECORDS */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-[18px]
                    border
                    border-[#E5E9F4]
                    bg-white/92
                    px-4
                    py-3
                    shadow-[0_10px_22px_rgba(60,78,110,0.06)]
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#ECF2FF]
                      text-[#5E63D9]
                    "
                  >
                    <MdPayment size={18} />
                  </div>

                  <div>
                    <p
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-[#A0A8B6]
                      "
                    >
                      Collection
                    </p>

                    <p
                      className="
                        text-[22px]
                        font-extrabold
                        leading-none
                        text-[#222938]
                      "
                    >
                      {payments.length} Records
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* HERO VISUAL */}

            <div
              className="
                relative
                flex
                min-h-[250px]
                items-center
                justify-center
                lg:min-w-[320px]
              "
            >
              <div
                className="
                  absolute
                  right-0
                  top-2
                  rounded-full
                  border
                  border-[#D9F5E9]
                  bg-white
                  px-5
                  py-2
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#16A36B]
                  shadow-[0_8px_22px_rgba(22,163,107,0.12)]
                "
              >
                Paid
              </div>

              <div
                className="
                  absolute
                  bottom-8
                  right-4
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#E0EDFF]
                  bg-white
                  text-[#3BAEDC]
                  shadow-[0_14px_28px_rgba(69,146,201,0.14)]
                "
              >
                <FaCheckCircle size={16} />
              </div>

              <div
                className="
                  relative
                  rounded-[30px]
                  bg-white/72
                  p-5
                  shadow-[0_20px_40px_rgba(102,109,176,0.18)]
                  backdrop-blur-sm
                "
              >
                <div
                  className="
                    absolute
                    -left-6
                    top-5
                    rounded-[22px]
                    border
                    border-[#EEF0FF]
                    bg-white
                    px-5
                    py-3
                    shadow-[0_12px_26px_rgba(92,102,160,0.12)]
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-[#A0A9BA]
                    "
                  >
                    Successful
                  </p>

                  <p
                    className="
                      mt-1
                      text-[30px]
                      font-extrabold
                      leading-none
                      text-[#202737]
                    "
                  >
                    {paid}
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-[180px]
                    w-[180px]
                    items-center
                    justify-center
                    rounded-[34px]
                    bg-gradient-to-br
                    from-[#6E52F5]
                    via-[#6458F6]
                    to-[#2FA8E7]
                    shadow-[inset_0_2px_0_rgba(255,255,255,0.35)]
                  "
                >
                  <div
                    className="
                      rounded-[28px]
                      border
                      border-white/25
                      bg-white/10
                      p-5
                      text-white
                      backdrop-blur-sm
                    "
                  >
                    <MdPayment size={54} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <section className="mb-8">
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {metrics.map((metric) => (
              <KpiCard
                key={metric.title}
                {...metric}
                loading={loading}
              />
            ))}
          </div>
        </section>

        {/* =================================================
            PAYMENT COLLECTION
        ================================================= */}

        <section>

          <div
            className="
              mb-5
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-[20px]
                  bg-gradient-to-br
                  from-[#6E52F5]
                  to-[#4A89F3]
                  text-white
                  shadow-[0_16px_30px_rgba(100,93,242,0.28)]
                "
              >
                <MdPayment size={24} />
              </div>

              <div>
                <h2
                  className="
                    text-[34px]
                    font-extrabold
                    tracking-[-0.05em]
                    text-[#1F2430]
                  "
                >
                  Payment Collection
                </h2>

                <p className="text-sm text-[#7B8697]">
                  Review and monitor every
                  payment transaction
                </p>
              </div>
            </div>

            <span
              className="
                inline-flex
                w-fit
                items-center
                rounded-full
                border
                border-[#E5E8F2]
                bg-white
                px-4
                py-2
                text-[11px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#707B8D]
                shadow-sm
              "
            >
              {payments.length} Records
            </span>
          </div>

          {/* =================================================
              TABLE CARD
          ================================================= */}

          <div
            className="
              overflow-hidden
              rounded-[30px]
              border
              border-[#E8ECF5]
              bg-white/92
              shadow-[0_18px_42px_rgba(84,98,130,0.10)]
              backdrop-blur-sm
            "
          >

            {/* TABLE HEADER */}

            <div
              className="
                border-b
                border-[#F0F2F7]
                bg-[linear-gradient(180deg,rgba(247,248,255,0.95),rgba(255,255,255,0.9))]
                px-6
                py-5
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <h3
                    className="
                      text-base
                      font-bold
                      text-[#282F3D]
                    "
                  >
                    Payment Logs
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-[#98A1B0]
                    "
                  >
                    All payment transactions
                    and quotation records
                  </p>
                </div>

                <span
                  className="
                    inline-flex
                    w-fit
                    items-center
                    rounded-full
                    bg-[#F5F7FC]
                    px-3
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#7F8897]
                  "
                >
                  {loading
                    ? "Syncing"
                    : `${currencyFormatter(
                        totalRevenue
                      )} Total`}
                </span>
              </div>
            </div>

            {/* =================================================
                DATA TABLE
            ================================================= */}

            <DataTable
              columns={columns}
              data={payments}
              progressPending={loading}
              noDataComponent={
                <div
                  className="
                    flex
                    w-full
                    flex-col
                    items-center
                    justify-center
                    py-20
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
                      rounded-[22px]
                      bg-[#F4F7FD]
                      text-[#A0A9B8]
                    "
                  >
                    <FaWallet size={24} />
                  </div>

                  <p
                    className="
                      text-sm
                      font-bold
                      text-[#59626E]
                    "
                  >
                    No payment records found
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-[#9AA2AC]
                    "
                  >
                    Transactions will appear
                    here once payments are made
                  </p>
                </div>
              }
              fixedHeader
              fixedHeaderScrollHeight="55vh"
              className={`data_table_comp ${
                isSidebarOpen
                  ? "data_table_comp_sidebar_opened"
                  : "data_table_comp_sidebar_closed"
              }`}
              customStyles={{
                table: {
                  style: {
                    backgroundColor:
                      "transparent",
                  },
                },

                headRow: {
                  style: {
                    backgroundColor:
                      "#F8FAFD",
                    minHeight: "56px",
                    borderBottom:
                      "1px solid #EEF2F7",
                  },
                },

                headCells: {
                  style: {
                    fontWeight: "700",
                    fontSize: "10px",
                    color: "#99A3B3",
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      "0.16em",
                  },
                },

                rows: {
                  style: {
                    minHeight: "68px",
                    borderBottom:
                      "1px solid #F2F4F8",
                    backgroundColor:
                      "#FFFFFF",
                    transition:
                      "background-color 0.15s ease",
                  },

                  highlightOnHoverStyle: {
                    backgroundColor:
                      "#FAFBFF",
                    borderBottomColor:
                      "#EEF2F7",
                    outlineStyle:
                      "none",
                    cursor: "pointer",
                  },
                },

                cells: {
                  style: {
                    fontSize: "11.5px",
                    paddingLeft:
                      "16px",
                    paddingRight:
                      "16px",
                  },
                },

                progress: {
                  style: {
                    backgroundColor:
                      "#FFFFFF",
                    color: "#6B7280",
                    padding:
                      "24px 0",
                  },
                },
              }}
            />

            {/* =================================================
                PAGINATION
            ================================================= */}

            <div
              className="
                border-t
                border-[#F0F2F7]
                px-4
                py-3
              "
            >
              <Pagination
                totalPages={totalPages}
                activePage={activePage}
                limit={limit}
                setPageValue={
                  handlePagination
                }
                setLimit={
                  handlePageLimit
                }
              />
            </div>
          </div>
        </section>
      </div>
    </AnimatedContent>
  );
};

export default PaymentLogs;
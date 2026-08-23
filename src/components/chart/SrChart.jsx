import { statusTheme } from "@/utils/getStatusTheme";
import moment from "moment";
import React from "react";
import DataTable from "react-data-table-component";
import { useHistory } from "react-router-dom";
import {
  FiArrowUpRight,
  FiCalendar,
  FiFileText,
  FiInbox,
} from "react-icons/fi";

const SrChart = ({ recentSr = [] }) => {
  const history = useHistory();

  const goToRequest = (id) => {
    if (!id) return;

    history.push(`/services/servicerequests/request?sr_id=${id}`);
  };

  const serviceRequestsColumns = [
    {
      name: "SR ID",
      selector: (row) => row?._id,
      cell: (row) => (
        <div
          onClick={() => goToRequest(row?._id)}
          className="
            group/id
            flex
            cursor-pointer
            items-center
            gap-2
            font-bold
            text-[#59616D]
            transition-colors
            duration-200
            hover:text-[var(--primary-color)]
          "
        >
          <span
            className="
              flex
              h-7
              min-w-7
              items-center
              justify-center
              rounded-lg
              bg-[var(--primary-color)]/[0.08]
              px-1.5
              text-[10px]
              font-extrabold
              text-[var(--primary-color)]
              transition-all
              duration-200
              group-hover/id:bg-[var(--primary-color)]
              group-hover/id:text-white
            "
          >
            #
          </span>

          <span className="max-w-[70px] truncate text-[11px]">{row?._id}</span>
        </div>
      ),
      width: "120px",
    },

    {
      name: "PROBLEM DESCRIPTION",
      selector: (row) => row?.problemDescription,
      cell: (row) => (
        <div
          onClick={() => goToRequest(row?._id)}
          className="
            flex
            min-w-0
            cursor-pointer
            items-center
            gap-2
            text-[#4D5662]
            transition-colors
            duration-200
            hover:text-[#22272F]
          "
        >
          <FiFileText className="shrink-0 text-[14px] text-[#A3AAB4]" />

          <span
            className="
              block
              max-w-[190px]
              truncate
              text-[11px]
              font-semibold
            "
            title={row?.problemDescription}
          >
            {row?.problemDescription || "No description"}
          </span>
        </div>
      ),
      width: "235px",
    },

    {
      name: "STATUS",
      selector: (row) => row?.ticketStatus,
      cell: (row) => {
        const theme = statusTheme(row?.ticketStatus, true);

        return (
          <div
            onClick={() => goToRequest(row?._id)}
            className={`
              cursor-pointer
              rounded-full
              px-3
              py-1.5
              text-[10px]
              font-bold
              capitalize
              transition-transform
              duration-200
              hover:scale-105
              ${theme}
            `}
          >
            {row?.ticketStatus || "Unknown"}
          </div>
        );
      },
      width: "135px",
    },

    {
      name: "RAISED ON",
      selector: (row) => row?.createdAt,
      cell: (row) => (
        <div
          onClick={() => goToRequest(row?._id)}
          className="
            flex
            cursor-pointer
            items-center
            gap-2
            text-[#858D98]
          "
        >
          <FiCalendar className="text-[13px]" />

          <div>
            <p className="text-[10px] font-semibold text-[#59616D]">
              {row?.createdAt
                ? moment(row.createdAt).format("DD MMM YYYY")
                : "-"}
            </p>

            <p className="mt-0.5 text-[9px] text-[#A2A9B2]">
              {row?.createdAt ? moment(row.createdAt).format("hh:mm A") : "-"}
            </p>
          </div>
        </div>
      ),
      width: "150px",
    },

    {
      name: "",
      cell: (row) => (
        <button
          type="button"
          onClick={() => goToRequest(row?._id)}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            border
            border-[#E8EBEF]
            bg-white
            text-[#929AA5]
            transition-all
            duration-200
            hover:border-[var(--primary-color)]
            hover:bg-[var(--primary-color)]
            hover:text-white
          "
          title="Open request"
        >
          <FiArrowUpRight className="text-[13px]" />
        </button>
      ),
      width: "55px",
      right: true,
    },
  ];

  const customStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },

    headRow: {
      style: {
        minHeight: "42px",
        borderBottom: "1px solid #EEF1F4",
        backgroundColor: "#FAFBFC",
        borderRadius: "12px",
      },
    },

    headCells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        color: "#9AA2AC",
        fontSize: "9px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      },
    },

    rows: {
      style: {
        minHeight: "66px",
        borderBottom: "1px solid #F1F3F5",
        backgroundColor: "#FFFFFF",
        transition: "all 0.2s ease",
      },

      highlightOnHoverStyle: {
        backgroundColor: "#FAFBFC",
        borderBottomColor: "#E9EDF1",
        cursor: "pointer",
        transform: "translateY(-1px)",
      },
    },

    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        fontSize: "11px",
      },
    },

    noData: {
      style: {
        minHeight: "260px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },

    pagination: {
      style: {
        borderTop: "1px solid #EEF1F4",
        minHeight: "45px",
      },
    },
  };

  return (
    <div className="w-full">
      {/* TOP LABEL */}

      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              bg-[var(--primary-color)]/[0.08]
              text-[var(--primary-color)]
            "
          >
            <FiInbox className="text-[13px]" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#969EA8]">
            Latest Requests
          </span>
        </div>

        <span className="rounded-full bg-[#F6F7F9] px-2.5 py-1 text-[9px] font-bold text-[#8E96A1]">
          {recentSr?.length || 0} shown
        </span>
      </div>

      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-[16px]
          border
          border-[#EDF0F3]
          bg-white
        "
      >
        <DataTable
          columns={serviceRequestsColumns}
          data={recentSr || []}
          onRowClicked={(row) => goToRequest(row?._id)}
          fixedHeader
          fixedHeaderScrollHeight="290px"
          customStyles={customStyles}
          className="dashboard-service-table"
          highlightOnHover
          responsive
          persistTableHead
          noDataComponent={
            <div
              className="
                flex
                min-h-[260px]
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
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#F5F7F9]
                  text-[#A3AAB3]
                "
              >
                <FiInbox className="text-[22px]" />
              </div>

              <h4 className="text-sm font-bold text-[#555E69]">
                No recent requests
              </h4>

              <p className="mt-1 max-w-[220px] text-[10px] leading-5 text-[#9AA2AC]">
                There are no service requests available to display right now.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default SrChart;

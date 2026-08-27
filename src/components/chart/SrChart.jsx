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

const THEME = {
  primary: "#AD8B73",
  secondary: "#CEAB93",
  accent: "#E3CAA5",
  light: "#FFFBE9",
  text: "#5F5147",
  muted: "#8C7B6D",
  border: "#E9DED1",
};

const SrChart = ({ recentSr = [] }) => {
  const history = useHistory();

  const goToRequest = (id) => {
    if (!id) return;

    history.push(`/services/servicerequests/request?sr_id=${id}`);
  };

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value.includes("complete") ||
      value.includes("closed") ||
      value.includes("deliver")
    ) {
      return {
        backgroundColor: "#E3CAA5",
        color: "#6F5B4B",
      };
    }

    if (
      value.includes("pending") ||
      value.includes("progress") ||
      value.includes("assign")
    ) {
      return {
        backgroundColor: "#FFFBE9",
        color: "#8A705D",
        border: `1px solid ${THEME.accent}`,
      };
    }

    if (
      value.includes("cancel") ||
      value.includes("reject")
    ) {
      return {
        backgroundColor: "#F1E4D8",
        color: "#80604D",
      };
    }

    return {
      backgroundColor: "#F5EFE8",
      color: "#766457",
    };
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
            font-semibold
            text-[#75665C]
            transition-colors
            duration-200
            hover:text-[#AD8B73]
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
              bg-[#FFFBE9]
              px-1.5
              text-[10px]
              font-bold
              text-[#AD8B73]
              transition-all
              duration-200
              group-hover/id:bg-[#AD8B73]
              group-hover/id:text-white
            "
          >
            #
          </span>

          <span className="max-w-[70px] truncate text-[11px]">
            {row?._id}
          </span>
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
            text-[#65584F]
            transition-colors
            duration-200
            hover:text-[#4F433B]
          "
        >
          <FiFileText
            className="shrink-0 text-[14px] text-[#CEAB93]"
          />

          <span
            className="
              block
              max-w-[190px]
              truncate
              text-[11px]
              font-medium
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
        const statusStyle = getStatusStyle(row?.ticketStatus);

        return (
          <div
            onClick={() => goToRequest(row?._id)}
            className="
              cursor-pointer
              rounded-full
              px-3
              py-1.5
              text-[10px]
              font-semibold
              capitalize
              transition-transform
              duration-200
              hover:scale-105
            "
            style={statusStyle}
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
            text-[#8C7B6D]
          "
        >
          <FiCalendar className="text-[13px] text-[#CEAB93]" />

          <div>
            <p className="text-[10px] font-semibold text-[#65584F]">
              {row?.createdAt
                ? moment(row.createdAt).format("DD MMM YYYY")
                : "-"}
            </p>

            <p className="mt-0.5 text-[9px] text-[#A08F82]">
              {row?.createdAt
                ? moment(row.createdAt).format("hh:mm A")
                : "-"}
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
            border-[#E9DED1]
            bg-[#FFFBE9]
            text-[#9A8575]
            transition-all
            duration-200
            hover:border-[#AD8B73]
            hover:bg-[#AD8B73]
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
        borderBottom: `1px solid ${THEME.border}`,
        backgroundColor: THEME.light,
        borderRadius: "12px",
      },
    },

    headCells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        color: "#927F70",
        fontSize: "9px",
        fontWeight: "700",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
      },
    },

    rows: {
      style: {
        minHeight: "66px",
        borderBottom: "1px solid #F1E9E1",
        backgroundColor: "#FFFFFF",
        transition: "all 0.2s ease",
      },

      highlightOnHoverStyle: {
        backgroundColor: "#FFFBE9",
        borderBottomColor: "#E3CAA5",
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
        borderTop: `1px solid ${THEME.border}`,
        minHeight: "45px",
      },
    },
  };

  return (
    <div className="w-full">
      {/* TABLE */}

      <div
        className="
          overflow-hidden
          rounded-[16px]
          border
          border-[#E9DED1]
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
                  bg-[#FFFBE9]
                  text-[#AD8B73]
                "
              >
                <FiInbox className="text-[22px]" />
              </div>

              <h4 className="text-sm font-bold text-[#65584F]">
                No recent requests
              </h4>

              <p className="mt-1 max-w-[220px] text-[10px] leading-5 text-[#9A897B]">
                No service requests are available right now.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default SrChart;
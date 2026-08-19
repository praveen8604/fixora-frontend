import { statusTheme } from "@/utils/getStatusTheme";
import moment from "moment";
import React from "react";
import DataTable from "react-data-table-component";
import { useHistory } from "react-router-dom";

const SrChart = ({ recentSr }) => {
  const history = useHistory();
  const goToRequest = (id) =>
    history.push(`/services/servicerequests/request?sr_id=${id}`);

  const serviceRequestsColumns = [
    {
      name: "Request",
      cell: (row) => (
        <div className="text-[#211e27] font-medium" onClick={() => goToRequest(row._id)}>
          #{String(row?._id || "").slice(-8).toUpperCase()}
        </div>
      ),
      width: "110px",
    },
    {
      name: "Description",
      cell: (row) => (
        <div
          className="text-[#50589C] clamp-text"
          onClick={() => goToRequest(row._id)}
        >
          {row?.problemDescription || "—"}
        </div>
      ),
      grow: 2,
    },
    {
      name: "Status",
      cell: (row) => (
        <div
          className={`text-[11px] font-medium px-2 py-0.5 rounded ${statusTheme(
            row?.ticketStatus,
            true
          )}`}
          onClick={() => goToRequest(row._id)}
        >
          {row?.ticketStatus || "—"}
        </div>
      ),
      width: "160px",
    },
    {
      name: "Raised",
      cell: (row) => (
        <div className="text-[#A3AED0]" onClick={() => goToRequest(row._id)}>
          {row?.createdAt ? moment(row.createdAt).format("DD MMM YYYY, HH:mm") : "—"}
        </div>
      ),
      width: "150px",
    },
  ];

  if (!recentSr?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] text-center">
        <p className="text-sm font-medium text-[#1B2559]">No recent requests</p>
        <p className="text-[13px] text-[#64748B] mt-1">
          New service requests will show up here.
        </p>
      </div>
    );
  }

  return (
    <DataTable
      columns={serviceRequestsColumns}
      data={recentSr}
      onRowClicked={(e) => goToRequest(e._id)}
      fixedHeader
      fixedHeaderScrollHeight="320px"
      customStyles={{
        table: { style: { backgroundColor: "transparent" } },
        headRow: {
          style: {
            backgroundColor: "#F8F9FC",
            borderRadius: "6px",
            minHeight: "40px",
            borderBottom: "none",
          },
        },
        headCells: {
          style: {
            fontWeight: 500,
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#64748B",
            paddingLeft: "8px",
            paddingRight: "8px",
          },
        },
        rows: {
          style: {
            minHeight: "48px",
            borderBottom: "1px solid #F0F0F0",
          },
        },
        cells: {
          style: {
            fontWeight: 400,
            fontSize: "12.5px",
            paddingLeft: "8px",
            paddingRight: "8px",
            cursor: "pointer",
          },
        },
      }}
      className="data-table-user-details"
    />
  );
};

export default SrChart;

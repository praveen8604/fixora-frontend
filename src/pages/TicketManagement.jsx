import { getServiceRequests } from "@/reduxStore/action/serviceRequestAction";
import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import TableHeader from "@/components/common/TableHeader";
import { statusTheme } from "@/utils/getStatusTheme";
import Pagination from "@/components/common/Pagination";
import { SidebarContext } from "@/context/SidebarContext";

const TicketManagement = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { serviceRequests, userList, totalPages } = useSelector(
    (state) => state.serviceRequestState,
  );
  const { isSidebarOpen } = useContext(SidebarContext);
  console.log("totalPages: ", totalPages);

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
      }),
    );
  }, []);

  const handlePagination = (currentPage) => {
    setActivePage(currentPage);
    dispatch(getServiceRequests({ ...filterValues, page: currentPage, limit }));
  };
  const handlePageLimit = (currentLimit) => {
    setLimit(currentLimit);
    setActivePage(1);
    dispatch(
      getServiceRequests({
        ...filterValues,
        page: 1,
        limit: currentLimit,
      }),
    );
  };

  const handleFilterValues = (e) => {
    setFilterValues(e);
  };

  const columns = [
    {
      name: "Ticket ID",
      cell: (row) => (
        <div
          onClick={() =>
            history.push(`/services/servicerequests/request?sr_id=${row._id}`)
          }
          className="font-bold text-[var(--primary-elite-color)] cursor-pointer hover:underline"
        >
          #{row?._id?.slice(-8) || "--"}
        </div>
      ),
      width: "150px",
    },
    {
      name: "Customer",
      cell: (row) => (
        <div
          onClick={() =>
            history.push(`/services/servicerequests/request?sr_id=${row._id}`)
          }
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="h-8 w-8 rounded-full bg-[var(--secondary-light-2-color)] flex items-center justify-center font-bold text-[var(--primary-elite-color)]">
            {row?.customer?.userName?.[0]?.toUpperCase() || "—"}
          </div>

          <div>
            <div className="font-semibold text-[var(--secondary-color)]">
              {row?.customer?.userName || "--"}
            </div>

            {row?.customer?.email && (
              <div className="text-[10px] opacity-50">{row.customer.email}</div>
            )}
          </div>

          {row?.customer?.userName && (
            <Link
              to={`/users/customer/details?userId=${row?.customer?._id}`}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto"
            >
              <FaExternalLinkAlt className="text-[10px] cursor-pointer hover:text-[var(--primary-elite-color)]" />
            </Link>
          )}
        </div>
      ),
      width: "240px",
    },
    {
      name: "Problem",
      cell: (row) => (
        <div
          onClick={() =>
            history.push(`/services/servicerequests/request?sr_id=${row._id}`)
          }
          className="max-w-[220px] cursor-pointer"
          title={row?.problemDescription}
        >
          <div className="font-medium text-[var(--secondary-color)] clamp-text">
            {row?.problemDescription || "--"}
          </div>
        </div>
      ),
      width: "240px",
    },
    {
      name: "Request Type",
      cell: (row) => (
        <div
          onClick={() =>
            history.push(`/services/servicerequests/request?sr_id=${row._id}`)
          }
          className="px-3 py-1 rounded-full text-[10px] font-bold capitalize"
          style={statusTheme(row?.serviceRequestType)}
        >
          {row?.serviceRequestType || "--"}
        </div>
      ),
      width: "170px",
    },
    {
      name: "Mode",
      cell: (row) => (
        <div
          onClick={() =>
            history.push(`/services/servicerequests/request?sr_id=${row._id}`)
          }
          className="px-3 py-1 rounded-full text-[10px] font-bold capitalize"
          style={statusTheme(row?.serviceMode)}
        >
          {row?.serviceMode || "--"}
        </div>
      ),
      width: "130px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div
          onClick={() =>
            history.push(`/services/servicerequests/request?sr_id=${row._id}`)
          }
          className={`px-3 py-1 rounded-full text-[10px] font-bold capitalize text-center ${statusTheme(
            row?.ticketStatus,
            true,
          )}`}
        >
          {row?.ticketStatus || "--"}
        </div>
      ),
      width: "170px",
    },
    {
      name: "Attachments",
      cell: (row) => (
        <div
          onClick={() =>
            history.push(`/services/servicerequests/request?sr_id=${row._id}`)
          }
          className="relative cursor-pointer"
        >
          {row?.attachments?.length > 0 ? (
            <div className="relative h-12 w-12">
              <img
                src={row.attachments[0]}
                alt="Attachment"
                className="h-12 w-12 rounded-lg object-cover border"
              />

              {row.attachments.length > 1 && (
                <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-[var(--primary-elite-color)] text-[var(--primary-color)] text-[9px] font-bold flex items-center justify-center">
                  +{row.attachments.length - 1}
                </span>
              )}
            </div>
          ) : (
            <span className="opacity-40">--</span>
          )}
        </div>
      ),
      width: "110px",
    },
    {
      name: "Assigned Technician",
      cell: (row) => {
        return (
          <div
            onClick={() =>
              history.push(`/services/servicerequests/request?sr_id=${row._id}`)
            }
            className="text-[var(--secondary-color)] flex items-center gap-2"
          >
            <div>{row?.technician?.userName || "--"}</div>
            <div onClick={(e) => e.stopPropagation()}>
              {row?.technician?.userName && (
                <Link
                  to={`/users/technician/details?userId=${row?.technician?._id}`}
                >
                  <FaExternalLinkAlt
                    className={
                      "cursor-pointer hover:text-[var(--primary-elite-color)]"
                    }
                  />
                </Link>
              )}
            </div>
          </div>
        );
      },
      width: "200px",
    },
    {
      name: "Ticket Raised On",
      cell: (row) => {
        return (
          <div
            onClick={() =>
              history.push(`/services/servicerequests/request?sr_id=${row._id}`)
            }
            className="text-[var(--secondary-color)]"
          >
            {moment(row?.createdAt).format("DD-MM-YYYY hh:mm A")}
          </div>
        );
      },
      width: "200px",
    },
    {
      name: "Attachments",
      cell: (row) => {
        return (
          <div
            onClick={() =>
              history.push(`/services/servicerequests/request?sr_id=${row._id}`)
            }
            className="text-[var(--secondary-color)]"
          >
            {row?.attachments?.length > 0 ? (
              <>
                <img
                  src={row?.attachments[0]}
                  height={60}
                  width={60}
                  alt={row?.attachments[0]}
                  className="object-cover h-16 w-16"
                />
                {row?.attachments?.length > 1 && (
                  <div className="absolute text-[var(--primary-color)] bg-[var(--primary-elite-color)] h-6 w-6 right-0 flex items-center justify-center rounded-full text-[10px] mt-[-25px]">
                    +{row?.attachments?.length - 1}
                  </div>
                )}
              </>
            ) : (
              "--"
            )}
          </div>
        );
      },
      width: "110px",
    },
  ];

  console.log("serviceRequests: ", serviceRequests);

  return (
    <div className="text-[var(--secondary-color)] pb-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-bold text-[var(--secondary-color)]">
            Service Requests
          </h1>

          <p className="text-xs mt-1 opacity-60">
            Manage and monitor all customer service requests
          </p>
        </div>
      </div>

      {/* Filters / Table Header */}
      <div className="bg-[var(--primary-color)] rounded-xl shadow-sm border border-gray-100 p-3 mb-4">
        <TableHeader
          title={"Service Requests"}
          data={userList}
          filterValues={handleFilterValues}
          activePage={activePage}
          limit={limit}
        />
      </div>

      {/* Table Card */}
      <div className="bg-[var(--primary-color)] rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={serviceRequests}
          onRowClicked={(e) =>
            history.push(`/services/servicerequests/request?sr_id=${e._id}`)
          }
          noDataComponent={
            <div className="w-full py-16 flex flex-col items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-[var(--secondary-light-2-color)] flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-[var(--primary-elite-color)]">
                  —
                </span>
              </div>

              <div className="font-bold text-sm">
                There are no records to display
              </div>

              <div className="text-xs opacity-50 mt-1">
                Service requests will appear here
              </div>
            </div>
          }
          fixedHeader={true}
          fixedHeaderScrollHeight="65vh"
          className={`data_table_comp ${
            isSidebarOpen
              ? "data_table_comp_sidebar_opened"
              : "data_table_comp_sidebar_closed"
          } text-[var(--secondary-color)]`}
          customStyles={{
            table: {
              style: {
                backgroundColor: "var(--primary-color)",
              },
            },

            headRow: {
              style: {
                backgroundColor: "var(--secondary-light-2-color)",
                minHeight: "52px",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              },
            },

            headCells: {
              style: {
                fontWeight: "700",
                fontSize: "12px",
                color: "var(--secondary-color)",
                overflow: "hidden",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              },
            },

            rows: {
              style: {
                minHeight: "72px",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              },

              highlightOnHoverStyle: {
                backgroundColor: "var(--secondary-light-2-color)",
                transitionDuration: "0.2s",
                transitionProperty: "background-color",
                borderBottomColor: "rgba(0,0,0,0.05)",
                outlineStyle: "none",
              },
            },

            cells: {
              style: {
                fontWeight: "600",
                fontSize: "11.5px",
                paddingLeft: "16px",
                paddingRight: "16px",
              },
            },

            pagination: {
              style: {
                borderTop: "1px solid rgba(0,0,0,0.05)",
              },
            },
          }}
        />
      </div>

      {/* Pagination */}
      <div className="mt-4 bg-[var(--primary-color)] rounded-xl shadow-sm border border-gray-100 px-3">
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

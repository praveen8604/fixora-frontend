import { getServiceRequests } from "@/reduxStore/action/serviceRequestAction";
import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FaExternalLinkAlt, FaTools, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { FiArrowUpRight, FiTool } from "react-icons/fi";
import { MdOutlineTune } from "react-icons/md";
import { HiSortDescending } from "react-icons/hi";
import { FaSortAmountUpAlt, FaSortAmountDownAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { statusTheme } from "@/utils/getStatusTheme";
import Pagination from "@/components/common/Pagination";
import AnimatedContent from "@/components/common/AnimatedContent";
import Dropdown from "@/components/common/DropDown";
import MuiDrawer from "@/components/drawer/MuiDrawer";
import { SERVICE_REQUEST_TYPE, TICKET_STATUS } from "@/utils/appConstatnts";
import { Popover } from "react-tiny-popover";

const TicketManagement = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { serviceRequests, totalPages, userList: rawUserList } = useSelector((state) => state.serviceRequestState);
  const userList = Array.isArray(rawUserList) ? rawUserList : [];

  const [filterValues, setFilterValues] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterDragger, setFilterDragger] = useState(false);
  const [sortablePopover, setSortablePopover] = useState(false);
  const [sortBy, setSortBy] = useState(-1);
  const [filterCount, setFilterCount] = useState(0);

  const [ticketStatusSelectedOption, setTicketStatusSelectedOption] = useState("");
  const [ticketTypeSelectedOption, setTicketTypeSelectedOption] = useState("");
  const [customerSelectedOption, setCustomerSelectedOption] = useState("");
  const [customerSelectedId, setCustomerSelectedId] = useState("");
  const [technicianSelectedOption, setTechnicianSelectedOption] = useState("");
  const [technicianSelectedId, setTechnicianSelectedId] = useState("");
  const [riderSelectedOption, setRiderSelectedOption] = useState("");
  const [riderSelectedId, setRiderSelectedId] = useState("");

  const fetchData = (params) => dispatch(getServiceRequests(params));

  useEffect(() => {
    fetchData({ ticketStatusSelectedOption: "", ticketTypeSelectedOption: "", customerSelectedId: "", technicianSelectedId: "", riderSelectedId: "", sortBy: -1, page: activePage, limit });
  }, []);

  const handlePagination = (p) => { setActivePage(p); fetchData({ ...filterValues, page: p, limit }); };
  const handlePageLimit = (l) => { setLimit(l); setActivePage(1); fetchData({ ...filterValues, page: 1, limit: l }); };

  const handleFilter = () => {
    const params = { ticketStatusSelectedOption, ticketTypeSelectedOption, customerSelectedId, technicianSelectedId, riderSelectedId, sortBy, page: activePage, limit };
    fetchData(params);
    setFilterValues(params);
    setFilterCount(Object.values({ ticketStatusSelectedOption, ticketTypeSelectedOption, customerSelectedId, technicianSelectedId, riderSelectedId }).filter(Boolean).length);
    setFilterDragger(false);
  };

  const handleClearFilter = () => {
    setTicketStatusSelectedOption(""); setTicketTypeSelectedOption("");
    setCustomerSelectedOption(""); setCustomerSelectedId("");
    setTechnicianSelectedOption(""); setTechnicianSelectedId("");
    setRiderSelectedOption(""); setRiderSelectedId("");
    setFilterCount(0);
    fetchData({ ticketStatusSelectedOption: "", ticketTypeSelectedOption: "", customerSelectedId: "", technicianSelectedId: "", riderSelectedId: "", sortBy: -1, page: activePage, limit });
    setFilterDragger(false);
  };

  const handleSortBy = (val) => {
    setSortBy(val);
    fetchData({ ...filterValues, sortBy: val, page: activePage, limit });
    setSortablePopover(false);
  };

  /* KPI */
  const total     = serviceRequests?.length || 0;
  const completed = serviceRequests?.filter((r) => ["completed", "closed", "service request closed"].includes(r?.ticketStatus?.toLowerCase())).length || 0;
  const inProgress = serviceRequests?.filter((r) => ["in-progress", "work started", "technician assigned"].includes(r?.ticketStatus?.toLowerCase())).length || 0;
  const cancelled = serviceRequests?.filter((r) => ["canceled", "cancelled", "service request canceled"].includes(r?.ticketStatus?.toLowerCase())).length || 0;

  const metrics = [
    { title: "Total Requests", value: total,      desc: "All service requests", tone: "orange",  Icon: FaTools },
    { title: "Completed",      value: completed,  desc: "Resolved tickets",     tone: "emerald", Icon: FaCheckCircle },
    { title: "In Progress",    value: inProgress, desc: "Active tickets",       tone: "amber",   Icon: FaClock },
    { title: "Cancelled",      value: cancelled,  desc: "Cancelled tickets",    tone: "rose",    Icon: FaTimesCircle },
  ];

  const toneClasses = {
    orange:  { icon: "bg-orange-500",  soft: "bg-orange-50",  line: "bg-orange-500" },
    emerald: { icon: "bg-emerald-500", soft: "bg-emerald-50", line: "bg-emerald-500" },
    amber:   { icon: "bg-amber-500",   soft: "bg-amber-50",   line: "bg-amber-500" },
    rose:    { icon: "bg-rose-500",    soft: "bg-rose-50",    line: "bg-rose-500" },
  };

  const goToRequest = (id) => history.push(`/services/servicerequests/request?sr_id=${id}`);

  const columns = [
    {
      name: "Ticket ID",
      cell: (row) => (
        <span onClick={() => goToRequest(row._id)} className="font-bold text-orange-600 cursor-pointer hover:underline text-xs">
          #{row?._id?.slice(-8) || "--"}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Customer",
      cell: (row) => (
        <div onClick={() => goToRequest(row._id)} className="flex items-center gap-2 cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-orange-600 text-xs shrink-0">
            {row?.customer?.userName?.[0]?.toUpperCase() || "—"}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-[#20242B] truncate max-w-[130px]">{row?.customer?.userName || "--"}</p>
            {row?.customer?.email && <p className="text-[9px] text-[#9AA2AC] truncate max-w-[130px]">{row.customer.email}</p>}
          </div>
          {row?.customer?.userName && (
            <Link to={`/users/customer/details?userId=${row?.customer?._id}`} onClick={(e) => e.stopPropagation()}>
              <FaExternalLinkAlt className="text-[10px] text-[#9AA2AC] hover:text-orange-500" />
            </Link>
          )}
        </div>
      ),
      width: "220px",
    },
    {
      name: "Problem",
      cell: (row) => (
        <div onClick={() => goToRequest(row._id)} className="cursor-pointer max-w-[200px]">
          <p className="text-[11px] font-medium text-[#59626E] clamp-text">{row?.problemDescription || "--"}</p>
        </div>
      ),
      width: "220px",
    },
    {
      name: "Type",
      cell: (row) => (
        <span onClick={() => goToRequest(row._id)} className="cursor-pointer px-2.5 py-1 rounded-full text-[10px] font-bold capitalize" style={statusTheme(row?.serviceRequestType)}>
          {row?.serviceRequestType || "--"}
        </span>
      ),
      width: "130px",
    },
    {
      name: "Mode",
      cell: (row) => (
        <span onClick={() => goToRequest(row._id)} className="cursor-pointer px-2.5 py-1 rounded-full text-[10px] font-bold capitalize" style={statusTheme(row?.serviceMode)}>
          {row?.serviceMode || "--"}
        </span>
      ),
      width: "110px",
    },
    {
      name: "Status",
      cell: (row) => (
        <span onClick={() => goToRequest(row._id)} className={`cursor-pointer px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${statusTheme(row?.ticketStatus, true)}`}>
          {row?.ticketStatus || "--"}
        </span>
      ),
      width: "180px",
    },
    {
      name: "Technician",
      cell: (row) => (
        <div onClick={() => goToRequest(row._id)} className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-[#59626E]">
          {row?.technician?.userName || "--"}
          {row?.technician?.userName && (
            <Link to={`/users/technician/details?userId=${row?.technician?._id}`} onClick={(e) => e.stopPropagation()}>
              <FaExternalLinkAlt className="text-[10px] text-[#9AA2AC] hover:text-orange-500" />
            </Link>
          )}
        </div>
      ),
      width: "180px",
    },
    {
      name: "Raised On",
      cell: (row) => (
        <span onClick={() => goToRequest(row._id)} className="cursor-pointer text-[11px] text-[#9AA2AC]">
          {moment(row?.createdAt).format("DD MMM YYYY")}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Photo",
      cell: (row) => (
        <div onClick={() => goToRequest(row._id)} className="cursor-pointer">
          {row?.attachments?.length > 0 ? (
            <div className="relative h-10 w-10">
              <img src={row.attachments[0]} alt="attachment" className="h-10 w-10 rounded-lg object-cover border border-[#E4E8ED]" />
              {row.attachments.length > 1 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-orange-500 text-white text-[8px] font-bold flex items-center justify-center">
                  +{row.attachments.length - 1}
                </span>
              )}
            </div>
          ) : <span className="text-[#C1C6CD] text-xs">--</span>}
        </div>
      ),
      width: "90px",
    },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#FDF8F4] pb-10">

        {/* PAGE HEADER */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_0_5px_rgba(249,115,22,0.12)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B07040]">Services</span>
            </div>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">Service Requests</h1>
            <p className="mt-2 text-sm leading-6 text-[#7C8592]">Manage and monitor all customer repair requests</p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <Popover
              isOpen={sortablePopover}
              positions={["bottom", "left"]}
              containerClassName="z-50"
              onClickOutside={() => setSortablePopover(false)}
              content={
                <div className="bg-white mt-2 shadow-xl rounded-xl border border-[#F0E8E0] p-2 min-w-[170px]">
                  {[{ label: "Newest First", val: -1, Icon: FaSortAmountUpAlt }, { label: "Oldest First", val: 1, Icon: FaSortAmountDownAlt }].map(({ label, val, Icon }) => (
                    <div key={val} onClick={() => handleSortBy(val)}
                      className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg text-sm font-semibold transition ${sortBy === val ? "bg-orange-50 text-orange-600" : "text-[#59626E] hover:bg-[#FDF8F4]"}`}>
                      <Icon size={14} />{label}
                    </div>
                  ))}
                </div>
              }
            >
              <button onClick={() => setSortablePopover(!sortablePopover)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E4E8ED] bg-white text-sm font-semibold text-[#59626E] shadow-sm hover:border-orange-300 hover:text-orange-600 transition">
                <HiSortDescending size={16} /> Sort
              </button>
            </Popover>

            <button onClick={() => setFilterDragger(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E4E8ED] bg-white text-sm font-semibold text-[#59626E] shadow-sm hover:border-orange-300 hover:text-orange-600 transition">
              <MdOutlineTune size={16} /> Filter
              {filterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">{filterCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <section className="mb-7">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metrics.map((item) => {
              const tone = toneClasses[item.tone];
              const Icon = item.Icon;
              return (
                <div key={item.title} className="group relative min-h-[140px] overflow-hidden rounded-[22px] border border-[#F0E8E0] bg-white p-5 shadow-[0_3px_12px_rgba(180,80,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(180,80,0,0.10)]">
                  <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${tone.soft} opacity-80 transition-transform duration-500 group-hover:scale-[1.45]`} />
                  <div className={`pointer-events-none absolute -bottom-14 -left-14 h-24 w-24 rounded-full ${tone.soft} opacity-40`} />
                  <div className="relative z-20 flex items-start justify-between">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] ${tone.icon} text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-2`}>
                      <Icon size={20} color="#fff" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDF8F4] text-[#C4A882] transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                      <FiArrowUpRight size={14} />
                    </div>
                  </div>
                  <div className="relative z-20 mt-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#B07040]">{item.title}</p>
                    <div className="mt-2 flex items-end justify-between gap-2">
                      <h3 className="text-[24px] font-extrabold leading-none tracking-tight text-[#22272F]">{item.value}</h3>
                      <span className="text-right text-[10px] font-medium text-[#C4A882]">{item.desc}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-5 right-5 z-20 h-[3px] overflow-hidden rounded-full bg-[#F5EDE4]">
                    <div className={`h-full w-0 ${tone.line} rounded-full transition-all duration-500 group-hover:w-full`} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TABLE */}
        <section>
          <div className="overflow-hidden rounded-[22px] border border-[#F0E8E0] bg-white shadow-[0_3px_12px_rgba(180,80,0,0.06)]">
            <div className="flex items-center justify-between border-b border-[#F5EDE4] px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-[#282D35]">All Requests</h2>
                <p className="mt-0.5 text-xs text-[#B07040]">Click any row to view full request details</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-100 px-3 py-1.5">
                <FiTool size={13} className="text-orange-500" />
                <span className="text-[10px] font-bold text-orange-600">{serviceRequests?.length || 0} requests</span>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={serviceRequests}
              onRowClicked={(row) => goToRequest(row._id)}
              noDataComponent={
                <div className="w-full py-16 flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-3">
                    <FaTools size={24} className="text-orange-400" />
                  </div>
                  <p className="font-bold text-sm text-[#59626E]">No service requests found</p>
                  <p className="text-xs text-[#9AA2AC] mt-1">Requests will appear here once submitted</p>
                </div>
              }
              fixedHeader
              fixedHeaderScrollHeight="55vh"
              className="data_table_comp"
              customStyles={{
                headRow: { style: { backgroundColor: "#FDF0E6", borderBottom: "1px solid #F0E8E0" } },
                headCells: { style: { fontWeight: "700", fontSize: "10px", color: "#B07040", textTransform: "uppercase", letterSpacing: "0.08em" } },
                rows: { style: { minHeight: "68px", borderBottom: "1px solid #FDF0E6", cursor: "pointer", transition: "background-color 0.15s ease" }, highlightOnHoverStyle: { backgroundColor: "#FDF8F4", borderBottomColor: "#F0E8E0", outlineStyle: "none" } },
                cells: { style: { fontSize: "11.5px", paddingLeft: "16px", paddingRight: "16px" } },
              }}
            />
            <div className="border-t border-[#F5EDE4] px-4 py-3">
              <Pagination totalPages={totalPages} activePage={activePage} limit={limit}
                setPageValue={handlePagination} setLimit={handlePageLimit} />
            </div>
          </div>
        </section>

      </div>

      {/* FILTER DRAWER */}
      <MuiDrawer open={filterDragger} onClose={() => setFilterDragger(false)} drawerWidth="400px">
        <div className="p-5 bg-[#FDF8F4] h-full flex flex-col">
          <div className="flex items-center gap-3 pb-4 border-b border-orange-100">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
              <MdOutlineTune size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-[#20242B]">Filter Requests</p>
              <p className="text-[10px] text-[#B07040]">Narrow down service requests</p>
            </div>
          </div>

          <div className="flex-1 overflow-auto mt-5 space-y-4">
            {[
              { label: "Ticket Status", value: ticketStatusSelectedOption, onSelect: setTicketStatusSelectedOption, options: Object.values(TICKET_STATUS) },
              { label: "Ticket Type", value: ticketTypeSelectedOption, onSelect: setTicketTypeSelectedOption, options: Object.values(SERVICE_REQUEST_TYPE) },
              { label: "Customer", value: customerSelectedOption, onSelect: (e, id) => { setCustomerSelectedOption(e); setCustomerSelectedId(id); }, options: userList?.filter((u) => u.role === "customer").map((u) => u.userName), optionsObject: userList?.filter((u) => u.role === "customer") },
              { label: "Rider", value: riderSelectedOption, onSelect: (e, id) => { setRiderSelectedOption(e); setRiderSelectedId(id); }, options: userList?.filter((u) => u.role === "rider").map((u) => u.userName), optionsObject: userList?.filter((u) => u.role === "rider") },
              { label: "Technician", value: technicianSelectedOption, onSelect: (e, id) => { setTechnicianSelectedOption(e); setTechnicianSelectedId(id); }, options: userList?.filter((u) => u.role === "technician").map((u) => u.userName), optionsObject: userList?.filter((u) => u.role === "technician") },
            ].map(({ label, value, onSelect, options, optionsObject }) => (
              <div key={label} className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#59626E] uppercase tracking-wide">{label}</label>
                <Dropdown value={value} placeholder={`Select ${label}`} onSelect={onSelect}
                  options={options || []} optionsObject={optionsObject} disabled={false}
                  containerClassname="w-full" className="cursor-pointer capitalize" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-orange-100">
            <button onClick={handleClearFilter}
              className="flex-1 h-11 rounded-xl border-2 border-orange-300 text-orange-600 text-sm font-bold transition hover:bg-orange-50">
              Clear
            </button>
            <button onClick={handleFilter}
              className="flex-1 h-11 rounded-xl bg-orange-500 text-white text-sm font-bold transition hover:bg-orange-600">
              Apply
            </button>
          </div>
        </div>
      </MuiDrawer>
    </AnimatedContent>
  );
};

export default TicketManagement;

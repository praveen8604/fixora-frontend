import React, { useEffect, useState } from "react";
import { HiSortDescending } from "react-icons/hi";
import { MdOutlineTune } from "react-icons/md";
import { Popover } from "react-tiny-popover";
import { FaSortAmountUpAlt, FaSortAmountDownAlt } from "react-icons/fa";
import Dropdown from "./DropDown";
import MuiDrawer from "@/components/drawer/MuiDrawer";
import { SERVICE_REQUEST_TYPE, TICKET_STATUS } from "@/utils/appConstatnts";
import { getServiceRequests } from "@/reduxStore/action/serviceRequestAction";
import { useDispatch } from "react-redux";

const TableHeader = ({ title, data, filterValues, activePage, limit }) => {
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState(-1);
  const [sortablePopover, setSortablePopover] = useState(false);
  const [filterDragger, setFilterDragger] = useState(false);
  const [ticketStatusSelectedOption, setTicketStatusSelectedOption] =
    useState("");
  const [ticketTypeSelectedOption, setTicketTypeSelectedOption] = useState("");
  const [customerSelectedOption, setCustomerSelectedOption] = useState("");
  const [riderSelectedOption, setRiderSelectedOption] = useState("");
  const [technicianSelectedOption, setTechnicianSelectedOption] = useState("");
  const [customerSelectedId, setCustomerSelectedId] = useState("");
  const [riderSelectedId, setRiderSelectedId] = useState("");
  const [technicianSelectedId, setTechnicianSelectedId] = useState("");
  const [filterCount, setFilterCount] = useState(0);
  const handleTicketStatusSelect = (e) => {
    setTicketStatusSelectedOption(e);
  };
  const handleTicketTypeSelect = (e) => {
    setTicketTypeSelectedOption(e);
  };
  const handleCustomerSelect = (e, _id) => {
    setCustomerSelectedOption(e);
    setCustomerSelectedId(_id);
  };
  const handleRiderSelect = (e, _id) => {
    setRiderSelectedOption(e);
    setRiderSelectedId(_id);
  };
  const handleTechnicianSelect = (e, _id) => {
    setTechnicianSelectedOption(e);
    setTechnicianSelectedId(_id);
  };
  const handleFilter = () => {
    dispatch(
      getServiceRequests({
        ticketStatusSelectedOption,
        customerSelectedId,
        technicianSelectedId,
        riderSelectedId,
        sortBy,
        page: activePage,
        limit,
        ticketTypeSelectedOption,
      })
    );
    filterValues({
      ticketStatusSelectedOption,
      customerSelectedId,
      technicianSelectedId,
      riderSelectedId,
      sortBy,
      ticketTypeSelectedOption,
    });
    const filterObjects = {
      ticketStatusSelectedOption,
      ticketTypeSelectedOption,
      customerSelectedId,
      technicianSelectedId,
      riderSelectedId,
    };
    const filtercount = Object.values(filterObjects)
      .map((e) => e !== "")
      .filter((e) => e !== false)?.length;
    setFilterCount(filtercount);
    setFilterDragger(false);
  };
  const handleClearFilter = () => {
    setTicketStatusSelectedOption("");
    setCustomerSelectedId("");
    setCustomerSelectedOption("");
    setTechnicianSelectedId("");
    setTechnicianSelectedOption("");
    setRiderSelectedId("");
    setRiderSelectedOption("");
    setTicketTypeSelectedOption("")
    dispatch(
      getServiceRequests({
        ticketStatusSelectedOption: "",
        customerSelectedId: "",
        technicianSelectedId: "",
        riderSelectedId: "",
        sortBy: -1,
        page: activePage,
        limit,
        ticketTypeSelectedOption: "",
      })
    );
    setFilterDragger(false);
    setFilterCount(0);
    filterValues({
      ticketStatusSelectedOption: "",
      customerSelectedId: "",
      technicianSelectedId: "",
      riderSelectedId: "",
      sortBy: -1,
      ticketTypeSelectedOption: ""
    });
  };
  const handleSortBy = (sortByValue) => {
    setSortBy(sortByValue);
    dispatch(
      getServiceRequests({
        ticketStatusSelectedOption,
        customerSelectedId,
        technicianSelectedId,
        riderSelectedId,
        sortBy: sortByValue,
        page: activePage,
        limit,
        ticketTypeSelectedOption,
      })
    );
    filterValues({
      ticketStatusSelectedOption,
      customerSelectedId,
      technicianSelectedId,
      riderSelectedId,
      ticketTypeSelectedOption,
      sortBy: sortByValue,
    });
    setSortablePopover(false);
  };
  useEffect(() => {
    filterValues({
      ticketStatusSelectedOption,
      customerSelectedId,
      technicianSelectedId,
      riderSelectedId,
      ticketTypeSelectedOption,
      sortBy,
    });
  }, []);
  return (
    <div className="flex justify-between">
      <div className="font-bold my-5">{title}</div>
      <div className="flex items-center gap-3">
        <Popover
          isOpen={sortablePopover}
          positions={["bottom", "left"]}
          containerClassName="z-10"
          onClickOutside={() => setSortablePopover(false)}
          content={
            <div className="bg-white p-2 mt-2 shadow-xl rounded-md border-2 border-[#E3CAA5]">
              <div
                className={`flex items-center gap-3 cursor-pointer border-2 ${
                  sortBy === -1 ? "bg-[#FFFBE9]" : "bg-transparent"
                } ${
                  sortBy === -1 ? "border-[#E3CAA5]" : "border-transparent"
                } p-2 rounded-md`}
                onClick={() => {
                  handleSortBy(-1);
                }}
              >
                <FaSortAmountUpAlt className="text-[#AD8B73]" />
                <div className="text-sm text-[#3D2C1E]">Sort by Newest</div>
              </div>
              <div className="mt-2 mb-2 h-[1.5px] w-full bg-[#E3CAA5]"></div>
              <div
                className={`flex items-center gap-3 cursor-pointer border-2 ${
                  sortBy === 1 ? "bg-[#FFFBE9]" : "bg-transparent"
                } ${
                  sortBy === 1 ? "border-[#E3CAA5]" : "border-transparent"
                } p-2 rounded-md`}
                onClick={() => {
                  handleSortBy(1);
                }}
              >
                <FaSortAmountDownAlt className="text-[#AD8B73]" />
                <div className="text-sm text-[#3D2C1E]">Sort by Oldest</div>
              </div>
            </div>
          }
        >
          <div
            onClick={() => setSortablePopover(!sortablePopover)}
            className="flex items-center px-4 p-3 py-2 text-sm gap-2 rounded-md border-2 border-[#AD8B73] bg-[#AD8B73] text-white cursor-pointer transition-colors hover:bg-[#8B6B57]"
          >
            <HiSortDescending size={20} />
            <div>Sort</div>
          </div>
        </Popover>
        <div>
          <div
            className="flex items-center px-4 p-3 py-2 text-sm gap-2 rounded-md border-2 border-[#E3CAA5] bg-[#FFFBE9] text-[#AD8B73] cursor-pointer transition-colors hover:bg-[#FFF5D6]"
            onClick={() => setFilterDragger(true)}
          >
            <MdOutlineTune size={20} />
            <div>Filter</div>
          </div>
          {filterCount > 0 && (
            <div className="h-0 flex justify-end">
              <div className="relative bottom-[45px] left-[5px] h-4 w-4 rounded-full flex items-center justify-center text-[10px] bg-[#E3CAA5] text-[#3D2C1E] font-bold">
                {filterCount}
              </div>
            </div>
          )}
        </div>
      </div>
      <MuiDrawer
        open={filterDragger}
        onClose={() => setFilterDragger(false)}
        drawerWidth="400px"
      >
        <div className="p-4 bg-[#FFFBE9] h-[var(--doc-height)]">
          <div className="font-bold text-md flex items-center gap-2 text-[#AD8B73]">
            <MdOutlineTune size={22} /> Filter
          </div>
          <div className="flex flex-col text-sm mt-8 text-[#3D2C1E]">
            <label className="font-bold">Ticket Status</label>
            {data?.length > 0 && (
              <Dropdown
                value={ticketStatusSelectedOption}
                placeholder="Select a Ticket Status!"
                onSelect={handleTicketStatusSelect}
                options={Object.values(TICKET_STATUS)}
                disabled={false}
              />
            )}
          </div>
          <div className="flex flex-col text-sm mt-2 text-[#3D2C1E]">
            <label className="font-bold">Ticket Type</label>
            {data?.length > 0 && (
              <Dropdown
                value={ticketTypeSelectedOption}
                placeholder="Select a Ticket Type!"
                onSelect={handleTicketTypeSelect}
                options={Object.values(SERVICE_REQUEST_TYPE)}
                disabled={false}
              />
            )}
          </div>
          <div className="flex flex-col text-sm mt-2 text-[#3D2C1E]">
            <label className="font-bold">Customers</label>
            {data?.length > 0 && (
              <Dropdown
                value={customerSelectedOption}
                placeholder="Select a Customer!"
                onSelect={handleCustomerSelect}
                options={data
                  ?.filter((e) => e.role === "customer")
                  .map((e) => e.userName)}
                disabled={false}
                optionsObject={data?.filter((e) => e.role === "customer")}
              />
            )}
          </div>
          <div className="flex flex-col text-sm mt-2 text-[#3D2C1E]">
            <label className="font-bold">Rider</label>
            {data?.length > 0 && (
              <Dropdown
                value={riderSelectedOption}
                placeholder="Select a Rider!"
                onSelect={handleRiderSelect}
                options={data
                  ?.filter((e) => e.role === "rider")
                  .map((e) => e?.userName)}
                disabled={false}
                optionsObject={data?.filter((e) => e.role === "rider")}
              />
            )}
          </div>
          <div className="flex flex-col text-sm mt-2 text-[#3D2C1E]">
            <label className="font-bold">Technician</label>
            {data?.length > 0 && (
              <Dropdown
                value={technicianSelectedOption}
                placeholder="Select a Technician!"
                onSelect={handleTechnicianSelect}
                options={data
                  ?.filter((e) => e.role === "technician")
                  .map((e) => e?.userName)}
                disabled={false}
                optionsObject={data?.filter((e) => e.role === "technician")}
              />
            )}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              className="mt-2 w-full border-2 border-[#AD8B73] h-10 text-[#AD8B73] rounded-md text-[13.5px] font-bold transition-colors hover:bg-[#FFFBE9]"
              onClick={() => handleClearFilter()}
            >
              Clear
            </button>
            <button
              className="mt-2 w-full bg-[#AD8B73] h-10 text-white rounded-md text-sm font-bold transition-colors hover:bg-[#8B6B57]"
              onClick={() => handleFilter()}
            >
              Apply
            </button>
          </div>
        </div>
      </MuiDrawer>
    </div>
  );
};

export default TableHeader;

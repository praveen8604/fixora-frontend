import React, { useContext, useEffect, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import { FaExternalLinkAlt, FaUserCog } from "react-icons/fa";
import { BsBox } from "react-icons/bs";
import AnimatedContent from "@/components/common/AnimatedContent";
import { statusTheme } from "@/utils/getStatusTheme";
import Pagination from "@/components/common/Pagination";

const Technician = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const history = useHistory();

  const [technicians, setTechnicians] = useState([]);
  const [id, setId] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);

  const handlePagination = (currentPage) => {
    setActivePage(currentPage);
    getTechniciansData(currentPage, limit);
  };

  const handlePageLimit = (currentLimit) => {
    setLimit(currentLimit);
    setActivePage(1);
    getTechniciansData(1, currentLimit);
  };

  const getTechniciansData = (selectedPage, dataLimit) => {
    DashboardServices.getTechnicians(selectedPage, dataLimit)
      .then((res) => {
        if (res) {
          const decodedata = DecryptData(res);

          setTechnicians(decodedata?.data?.technicians || []);
          setTotalPages(decodedata?.data?.totalPages || 0);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  };

  const handleCallBack = () => {
    getTechniciansData(activePage, limit);
  };

  useEffect(() => {
    getTechniciansData(activePage, limit);
  }, []);

  const getEligibilityStyle = (status) => {
    switch (status) {
      case "eligible":
        return "bg-green-100 text-green-700 border border-green-200";

      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";

      case "not-eligible":
        return "bg-red-100 text-red-700 border border-red-200";

      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  return (
    <AnimatedContent>
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl font-bold text-[var(--secondary-color)]">
              Technicians
            </h1>

            <p className="text-xs opacity-50 mt-1">
              Manage and monitor all technicians
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary-color)] border border-[var(--secondary-light-2-color)]">
            <FaUserCog
              size={17}
              className="text-[var(--primary-elite-color)]"
            />

            <div>
              <p className="text-[11px] opacity-50 leading-none">
                Total Technicians
              </p>

              <p className="text-sm font-bold text-[var(--secondary-color)] mt-1">
                {technicians.length}
              </p>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-[var(--primary-color)] rounded-xl border border-[var(--secondary-light-2-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full">
              <thead>
                <tr className="bg-[var(--secondary-light-2-color)]">
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[var(--secondary-color)]">
                    Technician
                  </th>

                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[var(--secondary-color)]">
                    Mobile No.
                  </th>

                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[var(--secondary-color)]">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[var(--secondary-color)]">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[var(--secondary-color)]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[var(--secondary-color)]">
                    Eligibility
                  </th>

                  <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-[var(--secondary-color)]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {technicians.length > 0 ? (
                  technicians.map((data, i) => (
                    <tr
                      key={data?._id || i}
                      onClick={() =>
                        history.push(
                          `/users/technician/details?userId=${data?._id}`,
                        )
                      }
                      className="
                        cursor-pointer
                        border-b border-[var(--secondary-light-2-color)]
                        hover:bg-[var(--secondary-light-2-color)]
                        transition-colors duration-200
                      "
                    >
                      {/* Technician */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              w-10 h-10 rounded-full
                              flex items-center justify-center
                              bg-[var(--secondary-light-2-color)]
                              text-[var(--primary-elite-color)]
                              flex-shrink-0
                            "
                          >
                            <FaUserCog size={17} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--secondary-color)] truncate">
                              {data?.userName || "--"}
                            </p>

                            <p className="text-[10px] opacity-40 mt-0.5">
                              Technician
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-[var(--secondary-color)] whitespace-nowrap">
                          {data?.phoneNumber || "--"}
                        </p>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-[var(--secondary-color)] max-w-[220px] truncate">
                          {data?.email || "--"}
                        </p>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-[var(--secondary-color)] capitalize">
                          {data?.role || "--"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className="
                            inline-flex items-center
                            px-3 py-1
                            rounded-full
                            text-[10px]
                            font-bold
                            capitalize
                          "
                          style={statusTheme(data?.userStatus)}
                        >
                          {data?.userStatus === "inactive"
                            ? "Blocked"
                            : data?.userStatus || "--"}
                        </span>
                      </td>

                      {/* Eligibility */}
                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex items-center
                            px-3 py-1
                            rounded-full
                            text-[10px]
                            font-bold
                            capitalize
                            ${getEligibilityStyle(data?.isPracticingEligible)}
                          `}
                        >
                          {data?.isPracticingEligible || "--"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setId(data?._id);
                            toggleDrawer();
                          }}
                          className="
                            w-9 h-9
                            inline-flex items-center justify-center
                            rounded-lg
                            text-[var(--secondary-color)]
                            bg-[var(--secondary-light-2-color)]
                            hover:bg-[var(--primary-elite-color)]
                            hover:text-[var(--primary-color)]
                            transition-all duration-200
                          "
                          title="Manage Technician"
                        >
                          <FaExternalLinkAlt size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="min-h-[250px] flex flex-col items-center justify-center text-center">
                        <div
                          className="
                            w-14 h-14 rounded-full
                            flex items-center justify-center
                            bg-[var(--secondary-light-2-color)]
                            text-[var(--primary-elite-color)]
                          "
                        >
                          <BsBox size={25} />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-[var(--secondary-color)]">
                          No Technicians Found
                        </p>

                        <p className="text-xs opacity-50 mt-1">
                          Technician records will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            totalPages={totalPages}
            activePage={activePage}
            limit={limit}
            setPageValue={handlePagination}
            setLimit={handlePageLimit}
          />
        </div>

        {/* Drawer */}
        <MainDrawer windowDimensionHighWidth="400px">
          <StaffDrawer
            defaultStatus={
              technicians.find((item) => item?._id === id)?.isPracticingEligible
            }
            id={id}
            toggleDrawer={toggleDrawer}
            handleCallBack={handleCallBack}
          />
        </MainDrawer>
      </div>
    </AnimatedContent>
  );
};

export default Technician;

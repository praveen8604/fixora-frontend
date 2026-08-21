import React, { useContext, useEffect, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import {
  FaExternalLinkAlt,
  FaUserCog,
  FaUsers,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
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
        return `
          bg-emerald-50
          text-emerald-700
          border
          border-emerald-200
        `;

      case "pending":
        return `
          bg-amber-50
          text-amber-700
          border
          border-amber-200
        `;

      case "not-eligible":
        return `
          bg-red-50
          text-red-700
          border
          border-red-200
        `;

      default:
        return `
          bg-gray-50
          text-gray-600
          border
          border-gray-200
        `;
    }
  };

  const totalTechnicians = technicians.length;

  const eligibleCount = technicians.filter(
    (item) => item?.isPracticingEligible === "eligible",
  ).length;

  const pendingCount = technicians.filter(
    (item) => item?.isPracticingEligible === "pending",
  ).length;

  return (
    <AnimatedContent>
      <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div
          className="
            relative
            mb-5
            overflow-hidden
            rounded-[22px]
            border
            border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            px-5
            py-5
            shadow-[0_5px_25px_rgba(30,40,55,0.05)]
          "
        >
          {/* Decorative circles */}

          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-20
              h-44
              w-44
              rounded-full
              bg-[var(--primary-elite-color)]
              opacity-[0.07]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              left-1/3
              h-36
              w-36
              rounded-full
              bg-[var(--primary-elite-color)]
              opacity-[0.035]
            "
          />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* TITLE */}

            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-[15px]
                  bg-[var(--secondary-light-2-color)]
                  text-[var(--primary-elite-color)]
                  shadow-sm
                "
              >
                <FaUserCog size={21} />
              </div>

              <div>
                <h1
                  className="
                    text-[21px]
                    font-extrabold
                    tracking-[-0.025em]
                    text-[var(--secondary-color)]
                  "
                >
                  Technicians
                </h1>

                <p className="mt-1 text-[11px] font-medium text-gray-400">
                  Manage and monitor all technicians
                </p>
              </div>
            </div>

            {/* QUICK STATS */}

            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
              {/* TOTAL */}

              <div
                className="
                  flex
                  min-w-[105px]
                  items-center
                  gap-2.5
                  rounded-xl
                  border
                  border-[var(--secondary-light-2-color)]
                  bg-white
                  px-3
                  py-2.5
                  shadow-sm
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[var(--secondary-light-2-color)]
                    text-[var(--primary-elite-color)]
                  "
                >
                  <FaUsers size={13} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                    Total
                  </p>

                  <p className="mt-0.5 text-sm font-extrabold text-[var(--secondary-color)]">
                    {totalTechnicians}
                  </p>
                </div>
              </div>

              {/* ELIGIBLE */}

              <div
                className="
                  flex
                  min-w-[105px]
                  items-center
                  gap-2.5
                  rounded-xl
                  border
                  border-emerald-100
                  bg-emerald-50/60
                  px-3
                  py-2.5
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-emerald-100
                    text-emerald-600
                  "
                >
                  <FaCheckCircle size={13} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-500">
                    Eligible
                  </p>

                  <p className="mt-0.5 text-sm font-extrabold text-emerald-700">
                    {eligibleCount}
                  </p>
                </div>
              </div>

              {/* PENDING */}

              <div
                className="
                  flex
                  min-w-[105px]
                  items-center
                  gap-2.5
                  rounded-xl
                  border
                  border-amber-100
                  bg-amber-50/60
                  px-3
                  py-2.5
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-amber-100
                    text-amber-600
                  "
                >
                  <FaClock size={13} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-amber-500">
                    Pending
                  </p>

                  <p className="mt-0.5 text-sm font-extrabold text-amber-700">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            TABLE CARD
        ====================================================== */}

        <div
          className="
            overflow-hidden
            rounded-[22px]
            border
            border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            shadow-[0_5px_25px_rgba(30,40,55,0.045)]
          "
        >
          {/* TABLE HEADER */}

          <div
            className="
              flex
              flex-col
              gap-2
              border-b
              border-[var(--secondary-light-2-color)]
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h2 className="text-[15px] font-extrabold text-[var(--secondary-color)]">
                Technician List
              </h2>

              <p className="mt-0.5 text-[10px] font-medium text-gray-400">
                Technician information, status and eligibility
              </p>
            </div>

            <div
              className="
                flex
                w-fit
                items-center
                gap-1.5
                rounded-full
                border
                border-[var(--secondary-light-2-color)]
                bg-[var(--secondary-light-2-color)]
                px-3
                py-1.5
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[var(--primary-elite-color)]
                "
              />

              <span className="text-[9px] font-bold uppercase tracking-wide text-[var(--secondary-color)]">
                {totalTechnicians} technicians
              </span>
            </div>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full">
              <thead>
                <tr className="bg-[var(--secondary-light-2-color)]">
                  <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.06em] text-[var(--secondary-color)]">
                    Technician
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.06em] text-[var(--secondary-color)]">
                    Mobile No.
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.06em] text-[var(--secondary-color)]">
                    Email
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.06em] text-[var(--secondary-color)]">
                    Role
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.06em] text-[var(--secondary-color)]">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.06em] text-[var(--secondary-color)]">
                    Eligibility
                  </th>

                  <th className="px-5 py-3.5 text-center text-[10px] font-extrabold uppercase tracking-[0.06em] text-[var(--secondary-color)]">
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
                        group
                        cursor-pointer
                        border-b
                        border-[var(--secondary-light-2-color)]
                        transition-all
                        duration-200
                        hover:bg-[var(--secondary-light-2-color)]
                      "
                    >
                      {/* TECHNICIAN */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              relative
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-[13px]
                              bg-[var(--secondary-light-2-color)]
                              text-[var(--primary-elite-color)]
                              ring-1
                              ring-transparent
                              transition-all
                              duration-200
                              group-hover:ring-[var(--primary-elite-color)]
                            "
                          >
                            <FaUserCog size={17} />

                            <span
                              className="
                                absolute
                                bottom-0
                                right-0
                                h-2.5
                                w-2.5
                                rounded-full
                                border-2
                                border-white
                                bg-emerald-500
                              "
                            />
                          </div>

                          <div className="min-w-0">
                            <p
                              className="
                                max-w-[170px]
                                truncate
                                text-[12px]
                                font-extrabold
                                text-[var(--secondary-color)]
                              "
                            >
                              {data?.userName || "--"}
                            </p>

                            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                              Technician
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* MOBILE */}

                      <td className="px-5 py-4">
                        <p className="text-[11px] font-semibold text-[var(--secondary-color)]">
                          {data?.phoneNumber || "--"}
                        </p>
                      </td>

                      {/* EMAIL */}

                      <td className="px-5 py-4">
                        <p
                          className="
                            max-w-[220px]
                            truncate
                            text-[11px]
                            font-medium
                            text-gray-500
                          "
                          title={data?.email}
                        >
                          {data?.email || "--"}
                        </p>
                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-4">
                        <span
                          className="
                            inline-flex
                            rounded-lg
                            border
                            border-[var(--secondary-light-2-color)]
                            bg-[var(--secondary-light-2-color)]
                            px-2.5
                            py-1
                            text-[9px]
                            font-extrabold
                            capitalize
                            text-[var(--secondary-color)]
                          "
                        >
                          {data?.role || "--"}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            px-3
                            py-1.5
                            text-[9px]
                            font-extrabold
                            capitalize
                          "
                          style={statusTheme(data?.userStatus)}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />

                          {data?.userStatus === "inactive"
                            ? "Blocked"
                            : data?.userStatus || "--"}
                        </span>
                      </td>

                      {/* ELIGIBILITY */}

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex
                            items-center
                            rounded-full
                            px-3
                            py-1.5
                            text-[9px]
                            font-extrabold
                            capitalize
                            ${getEligibilityStyle(data?.isPracticingEligible)}
                          `}
                        >
                          {data?.isPracticingEligible || "--"}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setId(data?._id);
                              toggleDrawer();
                            }}
                            title="Manage Technician"
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-[var(--secondary-light-2-color)]
                              bg-[var(--secondary-light-2-color)]
                              text-[var(--secondary-color)]
                              shadow-sm
                              transition-all
                              duration-200
                              hover:scale-105
                              hover:bg-[var(--primary-elite-color)]
                              hover:text-[var(--primary-color)]
                              hover:shadow-md
                              focus:outline-none
                            "
                          >
                            <FaExternalLinkAlt size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
                        <div
                          className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-[18px]
                            bg-[var(--secondary-light-2-color)]
                            text-[var(--primary-elite-color)]
                          "
                        >
                          <BsBox size={28} />
                        </div>

                        <p className="mt-4 text-sm font-extrabold text-[var(--secondary-color)]">
                          No Technicians Found
                        </p>

                        <p className="mt-1 max-w-[280px] text-[10px] font-medium text-gray-400">
                          Technician records will appear here once they are
                          available.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div className="border-t border-[var(--secondary-light-2-color)] px-5 py-3">
            <Pagination
              totalPages={totalPages}
              activePage={activePage}
              limit={limit}
              setPageValue={handlePagination}
              setLimit={handlePageLimit}
            />
          </div>
        </div>

        {/* DRAWER */}

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

import React, { useContext, useEffect, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import { FaExternalLinkAlt, FaMotorcycle } from "react-icons/fa";
import { BsBox } from "react-icons/bs";
import AnimatedContent from "@/components/common/AnimatedContent";
import { statusTheme } from "@/utils/getStatusTheme";
import Pagination from "@/components/common/Pagination";

const Rider = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const history = useHistory();

  const [riders, setRiders] = useState([]);
  const [id, setId] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);

  const handlePagination = (currentPage) => {
    setActivePage(currentPage);
    getRiders(currentPage, limit);
  };

  const handlePageLimit = (currentLimit) => {
    setLimit(currentLimit);
    setActivePage(1);
    getRiders(1, currentLimit);
  };

  const getRiders = (selectedPage, dataLimit) => {
    DashboardServices.getRiders(selectedPage, dataLimit)
      .then((res) => {
        if (!res) {
          setRiders([]);
          setTotalPages(0);
          return;
        }

        const decodedata = DecryptData(res);

        if (!decodedata?.data) {
          setRiders([]);
          setTotalPages(0);
          return;
        }

        setTotalPages(decodedata.data.totalPages || 0);
        setRiders(decodedata.data.riders || []);
      })
      .catch((err) => {
        console.error("Error fetching riders:", err);
        setRiders([]);
        setTotalPages(0);
      });
  };

  const handleCallBack = () => {
    getRiders(activePage, limit);
  };

  useEffect(() => {
    getRiders(activePage, limit);
  }, []);

  const getEligibilityStyle = (status) => {
    switch (status) {
      case "eligible":
        return {
          backgroundColor: "#EAF8F0",
          color: "#17864B",
          borderColor: "#CBEBD8",
        };

      case "pending":
        return {
          backgroundColor: "#FFF7E5",
          color: "#A86B00",
          borderColor: "#F5DEAE",
        };

      case "not-eligible":
        return {
          backgroundColor: "#FFF0F0",
          color: "#D14343",
          borderColor: "#F2CCCC",
        };

      default:
        return {
          backgroundColor: "#F3F5F7",
          color: "#737B86",
          borderColor: "#E2E6EB",
        };
    }
  };

  return (
    <>
      <AnimatedContent>
        <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
          {/* =====================================================
              PAGE HEADER
          ====================================================== */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    bg-[var(--secondary-light-2-color)]
                    text-[var(--primary-elite-color)]
                  "
                >
                  <FaMotorcycle size={18} />
                </div>

                <div>
                  <h1 className="text-[21px] font-extrabold tracking-[-0.02em] text-[var(--secondary-color)]">
                    Riders
                  </h1>

                  <p className="mt-0.5 text-[11px] font-medium text-[#8B939E]">
                    Manage and monitor all registered riders
                  </p>
                </div>
              </div>
            </div>

            {/* Total Riders */}

            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-3
                rounded-xl
                border
                px-4
                py-2.5
                shadow-[0_4px_15px_rgba(30,40,55,0.04)]
              "
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--secondary-light-2-color)",
              }}
            >
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg
                "
                style={{
                  backgroundColor: "var(--secondary-light-2-color)",
                  color: "var(--primary-elite-color)",
                }}
              >
                <FaMotorcycle size={16} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9AA2AC]">
                  Total Riders
                </p>

                <p className="mt-0.5 text-[15px] font-extrabold text-[var(--secondary-color)]">
                  {riders.length}
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              TABLE CARD
          ====================================================== */}

          <div
            className="
              overflow-hidden
              rounded-[20px]
              border
              bg-[var(--primary-color)]
              shadow-[0_5px_25px_rgba(30,40,55,0.045)]
            "
            style={{
              borderColor: "var(--secondary-light-2-color)",
            }}
          >
            {/* Table Top */}

            <div
              className="
                flex flex-col gap-1
                border-b
                px-5 py-4
                sm:flex-row sm:items-center sm:justify-between
              "
              style={{
                borderColor: "var(--secondary-light-2-color)",
              }}
            >
              <div>
                <h2 className="text-[14px] font-extrabold text-[var(--secondary-color)]">
                  Rider List
                </h2>

                <p className="mt-0.5 text-[10px] font-medium text-[#9AA2AC]">
                  Rider information, status and eligibility
                </p>
              </div>

              <div className="text-[10px] font-semibold text-[#9AA2AC]">
                {riders.length} records
              </div>
            </div>

            {/* Table */}

            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full">
                <thead>
                  <tr
                    className="text-[var(--secondary-color)]"
                    style={{
                      backgroundColor: "var(--secondary-light-2-color)",
                    }}
                  >
                    <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.08em]">
                      Rider
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.08em]">
                      Mobile No.
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.08em]">
                      Email
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.08em]">
                      Role
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.08em]">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-[0.08em]">
                      Eligibility
                    </th>

                    <th className="px-5 py-3.5 text-center text-[10px] font-extrabold uppercase tracking-[0.08em]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {riders?.length > 0 ? (
                    riders.map((data, i) => (
                      <tr
                        key={data?._id || i}
                        onClick={() =>
                          history.push(
                            `/users/rider/details?userId=${data?._id}`,
                          )
                        }
                        className="
                          group
                          cursor-pointer
                          border-b
                          transition-all
                          duration-200
                          hover:bg-[#FAFBFC]
                        "
                        style={{
                          borderColor: "var(--secondary-light-2-color)",
                        }}
                      >
                        {/* Rider */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                flex h-10 w-10 shrink-0
                                items-center justify-center
                                rounded-xl
                                transition-transform
                                duration-200
                                group-hover:scale-105
                              "
                              style={{
                                backgroundColor:
                                  "var(--secondary-light-2-color)",
                                color: "var(--primary-elite-color)",
                              }}
                            >
                              <FaMotorcycle size={17} />
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[170px] truncate text-[12px] font-extrabold text-[var(--secondary-color)]">
                                {data?.userName || "--"}
                              </p>

                              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#A0A7B0]">
                                Rider
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Mobile */}

                        <td className="px-5 py-4">
                          <span className="text-[11px] font-semibold text-[#59626E] whitespace-nowrap">
                            {data?.phoneNumber || "--"}
                          </span>
                        </td>

                        {/* Email */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              block
                              max-w-[230px]
                              truncate
                              text-[11px]
                              font-medium
                              text-[#69727E]
                            "
                            title={data?.email}
                          >
                            {data?.email || "--"}
                          </span>
                        </td>

                        {/* Role */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              inline-flex
                              rounded-full
                              px-3 py-1
                              text-[9px]
                              font-extrabold
                              capitalize
                            "
                            style={{
                              backgroundColor: "var(--secondary-light-2-color)",
                              color: "var(--primary-elite-color)",
                            }}
                          >
                            {data?.role || "--"}
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              px-3 py-1
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

                        {/* Eligibility */}

                        <td className="px-5 py-4">
                          <span
                            className="
                              inline-flex
                              items-center
                              rounded-full
                              border
                              px-3 py-1
                              text-[9px]
                              font-extrabold
                              capitalize
                            "
                            style={getEligibilityStyle(
                              data?.isPracticingEligible,
                            )}
                          >
                            {data?.isPracticingEligible || "--"}
                          </span>
                        </td>

                        {/* Action */}

                        <td className="px-5 py-4">
                          <div className="flex justify-center">
                            <button
                              type="button"
                              title="Manage Rider"
                              onClick={(e) => {
                                e.stopPropagation();
                                setId(data?._id);
                                toggleDrawer();
                              }}
                              className="
                                flex h-9 w-9
                                items-center justify-center
                                rounded-lg
                                border
                                transition-all
                                duration-200
                                hover:scale-105
                                hover:shadow-sm
                              "
                              style={{
                                backgroundColor:
                                  "var(--secondary-light-2-color)",
                                color: "var(--primary-elite-color)",
                                borderColor: "var(--secondary-light-2-color)",
                              }}
                            >
                              <FaExternalLinkAlt size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>
                        <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
                          <div
                            className="
                              flex h-16 w-16
                              items-center justify-center
                              rounded-2xl
                            "
                            style={{
                              backgroundColor: "var(--secondary-light-2-color)",
                              color: "var(--primary-elite-color)",
                            }}
                          >
                            <BsBox size={28} />
                          </div>

                          <p className="mt-4 text-[13px] font-extrabold text-[var(--secondary-color)]">
                            No Riders Found
                          </p>

                          <p className="mt-1 text-[10px] font-medium text-[#9AA2AC]">
                            Rider records will appear here
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
        </div>
      </AnimatedContent>

      {/* =====================================================
          DRAWER
      ====================================================== */}

      <MainDrawer windowDimensionHighWidth="400px">
        <StaffDrawer
          id={id}
          toggleDrawer={toggleDrawer}
          handleCallBack={handleCallBack}
          defaultStatus={
            riders.find((item) => item?._id === id)?.isPracticingEligible
          }
        />
      </MainDrawer>
    </>
  );
};

export default Rider;

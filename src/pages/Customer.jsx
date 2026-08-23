import React, { useContext, useEffect, useMemo, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import { FaExternalLinkAlt, FaUserCircle, FaUsers } from "react-icons/fa";
import { BsBox } from "react-icons/bs";
import { FiSearch, FiPhone, FiMail, FiChevronRight } from "react-icons/fi";
import AnimatedContent from "@/components/common/AnimatedContent";
import { statusTheme } from "@/utils/getStatusTheme";
import Pagination from "@/components/common/Pagination";

const Customer = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const history = useHistory();

  const [customers, setCustomers] = useState([]);
  const [id, setId] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const handlePagination = (currentPage) => {
    setActivePage(currentPage);
    getCustomers(currentPage, limit);
  };

  const handlePageLimit = (currentLimit) => {
    setLimit(currentLimit);
    setActivePage(1);
    getCustomers(1, currentLimit);
  };

  const getCustomers = (selectedPage, dataLimit) => {
    DashboardServices.getCustomers(selectedPage, dataLimit)
      .then((res) => {
        if (res) {
          const decodedata = DecryptData(res);

          setTotalPages(decodedata?.data?.totalPages || 0);
          setCustomers(decodedata?.data?.customers || []);
        }
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
        setCustomers([]);
      });
  };

  useEffect(() => {
    getCustomers(activePage, limit);
  }, []);

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return customers;

    return customers.filter((customer) => {
      return (
        customer?.userName?.toLowerCase().includes(value) ||
        customer?.email?.toLowerCase().includes(value) ||
        customer?.phoneNumber?.toString().includes(value) ||
        customer?.role?.toLowerCase().includes(value) ||
        customer?.userStatus?.toLowerCase().includes(value)
      );
    });
  }, [customers, search]);

  return (
    <>
      <AnimatedContent>
        <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
          {/* =====================================================
              PAGE HEADER
          ====================================================== */}

          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-[var(--secondary-elite-color)]
                    text-[var(--primary-elite-color)]
                  "
                >
                  <FaUsers size={15} />
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9AA2AC]">
                  User Management
                </span>
              </div>

              <h1 className="text-[24px] font-extrabold tracking-[-0.025em] text-[#252A32]">
                Customers
              </h1>

              <p className="mt-1 text-[11px] font-semibold text-[#929AA5]">
                Manage and view all registered customers
              </p>
            </div>

            {/* Customer Count */}

            <div
              className="
                flex
                w-fit
                items-center
                gap-3
                rounded-xl
                border
                border-[#E7EAF0]
                bg-white
                px-4
                py-2.5
                shadow-[0_4px_18px_rgba(30,40,55,0.04)]
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-[var(--secondary-elite-color)]
                  text-[var(--primary-elite-color)]
                "
              >
                <FaUserCircle size={16} />
              </div>

              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#A0A7B0]">
                  Customers
                </p>

                <p className="text-sm font-extrabold text-[#303640]">
                  {customers?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              MAIN CARD
          ====================================================== */}

          <div
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-[#E5E8ED]
              bg-white
              shadow-[0_5px_24px_rgba(30,40,55,0.05)]
            "
          >
            {/* =================================================
                CARD TOOLBAR
            ================================================== */}

            <div
              className="
                flex
                flex-col
                gap-4
                border-b
                border-[#EEF0F3]
                p-4
                sm:p-5
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              <div>
                <h2 className="text-[15px] font-extrabold text-[#282D35]">
                  Customer List
                </h2>

                <p className="mt-1 text-[10px] font-semibold text-[#9AA2AC]">
                  Customer information and account status
                </p>
              </div>

              {/* SEARCH */}

              <div
                className="
                  flex
                  h-[42px]
                  w-full
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#E4E7EC]
                  bg-[#F9FAFB]
                  px-3
                  transition-all
                  duration-200
                  sm:w-[300px]
                  lg:w-[330px]
                  focus-within:border-[var(--primary-elite-color)]
                  focus-within:bg-white
                  focus-within:ring-2
                  focus-within:ring-[var(--primary-color)]
                "
              >
                <FiSearch size={18} className="shrink-0 text-[#9AA2AC]" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customers..."
                  className="
                    min-w-0
                    flex-1
                    border-0
                    bg-transparent
                    p-0
                    text-[11px]
                    font-semibold
                    text-[#343B45]
                    outline-none
                    focus:border-0
                    focus:outline-none
                    focus:ring-0
                    placeholder:text-[#A6ADB6]
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-md
                      text-[11px]
                      font-bold
                      text-[#9AA2AC]
                      transition
                      hover:bg-[#EEF0F3]
                      hover:text-[#343B45]
                    "
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* =================================================
                TABLE
            ================================================== */}

            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead>
                  <tr
                    className="
                      border-b
                      border-[#E7EAF0]
                      bg-[var(--primary-elite-color)]
                    "
                  >
                    <th className="px-5 py-3.5 text-left text-[9px] font-extrabold uppercase tracking-[0.1em] text-white">
                      Customer
                    </th>

                    <th className="px-5 py-3.5 text-left text-[9px] font-extrabold uppercase tracking-[0.1em] text-white">
                      Mobile No.
                    </th>

                    <th className="px-5 py-3.5 text-left text-[9px] font-extrabold uppercase tracking-[0.1em] text-white">
                      Email
                    </th>

                    <th className="px-5 py-3.5 text-left text-[9px] font-extrabold uppercase tracking-[0.1em] text-white">
                      Role
                    </th>

                    <th className="px-5 py-3.5 text-left text-[9px] font-extrabold uppercase tracking-[0.1em] text-white">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-center text-[9px] font-extrabold uppercase tracking-[0.1em] text-white">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers?.length > 0 ? (
                    filteredCustomers.map((data, i) => (
                      <tr
                        key={data?._id || i}
                        onClick={() =>
                          history.push(
                            `/users/customer/details?userId=${data?._id}`,
                          )
                        }
                        className="
                          group
                          cursor-pointer
                          border-b
                          border-[#EEF0F3]
                          bg-white
                          transition-all
                          duration-200
                          hover:bg-[#FAFBFC]
                        "
                      >
                        {/* CUSTOMER */}

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-xl
                                bg-[#F3F5F8]
                                ring-1
                                ring-[#E7EAF0]
                                transition-all
                                duration-200
                                group-hover:ring-[var(--primary-color)]
                              "
                            >
                              <FaUserCircle
                                size={22}
                                className="text-[#A1A8B2]"
                              />
                            </div>

                            <div className="min-w-0">
                              <p
                                className="
                                  max-w-[180px]
                                  truncate
                                  text-[12px]
                                  font-extrabold
                                  text-[#343B45]
                                  transition-colors
                                  group-hover:text-[var(--primary-elite-color)]
                                "
                              >
                                {data?.userName || "N/A"}
                              </p>

                              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#A0A7B0]">
                                Customer
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* PHONE */}

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <FiPhone
                              size={13}
                              className="shrink-0 text-[#A0A7B0]"
                            />

                            <span className="text-[11px] font-semibold text-[#59626E]">
                              {data?.phoneNumber || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* EMAIL */}

                        <td className="px-5 py-3.5">
                          <div className="flex max-w-[230px] items-center gap-2">
                            <FiMail
                              size={13}
                              className="shrink-0 text-[#A0A7B0]"
                            />

                            <span
                              className="truncate text-[11px] font-semibold text-[#59626E]"
                              title={data?.email || "N/A"}
                            >
                              {data?.email || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* ROLE */}

                        <td className="px-5 py-3.5">
                          <span
                            className="
                              inline-flex
                              rounded-full
                              px-2.5
                              py-1
                              text-[9px]
                              font-extrabold
                              uppercase
                              tracking-[0.05em]
                            "
                            style={{
                              backgroundColor: "var(--secondary-elite-color)",
                              color: "var(--primary-elite-color)",
                            }}
                          >
                            {data?.role || "customer"}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-3.5">
                          <div
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              px-2.5
                              py-1
                              text-[9px]
                              font-extrabold
                              capitalize
                            "
                            style={statusTheme(data?.userStatus)}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            {data?.userStatus === "inactive"
                              ? "Blocked"
                              : data?.userStatus || "Unknown"}
                          </div>
                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setId(data?._id);
                                toggleDrawer();
                              }}
                              type="button"
                              title="View Details"
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-[#E3E7EC]
                                bg-[#F8F9FB]
                                text-[#69727E]
                                shadow-sm
                                transition-all
                                duration-200
                                hover:border-[var(--primary-color)]
                                hover:bg-[var(--primary-color)]
                                hover:text-white
                              "
                            >
                              <FaExternalLinkAlt size={12} />
                            </button>

                            <FiChevronRight
                              size={14}
                              className="
                                text-[#C1C6CD]
                                transition-transform
                                duration-200
                                group-hover:translate-x-0.5
                              "
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <div className="flex min-h-[330px] flex-col items-center justify-center px-5">
                          <div
                            className="
                              flex
                              h-20
                              w-20
                              items-center
                              justify-center
                              rounded-[22px]
                              bg-[var(--secondary-elite-color)]
                              text-[var(--primary-elite-color)]
                            "
                          >
                            <BsBox className="h-9 w-9" />
                          </div>

                          <p className="mt-5 text-sm font-extrabold text-[#4A525D]">
                            {search
                              ? "No customers found"
                              : "No customer records"}
                          </p>

                          <p className="mt-1 text-[11px] font-semibold text-[#A0A7B0]">
                            {search
                              ? `No results for "${search}"`
                              : "There are no customer records available."}
                          </p>

                          {search && (
                            <button
                              type="button"
                              onClick={() => setSearch("")}
                              className="
                                mt-4
                                rounded-lg
                                bg-[var(--primary-elite-color)]
                                px-4
                                py-2
                                text-[10px]
                                font-bold
                                text-white
                                transition
                                hover:opacity-90
                              "
                            >
                              Clear Search
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* =================================================
                FOOTER / PAGINATION
            ================================================== */}

            <div className="border-t border-[#EEF0F3] px-4 py-3 sm:px-5">
              <Pagination
                totalPages={totalPages}
                activePage={activePage}
                limit={limit}
                setPageValue={handlePagination}
                setLimit={handlePageLimit}
              />
            </div>
          </div>
        </div>
      </AnimatedContent>

      {/* =====================================================
          DRAWER
      ====================================================== */}

      <MainDrawer>
        <StaffDrawer
          id={id}
          toggleDrawer={toggleDrawer}
          handleCallBack={() => getCustomers(activePage, limit)}
        />
      </MainDrawer>
    </>
  );
};

export default Customer;

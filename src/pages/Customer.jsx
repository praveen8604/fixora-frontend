import React, { useContext, useEffect, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import { FaExternalLinkAlt, FaUserCircle } from "react-icons/fa";
import { BsBox } from "react-icons/bs";
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

  return (
    <>
      <AnimatedContent>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-black">Customers</h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and view all registered customers
              </p>
            </div>

            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{
                backgroundColor: "var(--secondary-elite-color)",
                color: "var(--primary-elite-color)",
              }}
            >
              <FaUserCircle />
              <span>{customers?.length || 0} Customers</span>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Table Header */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Customer List
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Customer information and account status
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr
                    style={{
                      backgroundColor: "var(--primary-elite-color)",
                    }}
                    className="text-white"
                  >
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Mobile No.
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Email
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Role
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customers?.length > 0 ? (
                    customers.map((data, i) => (
                      <tr
                        key={data?._id || i}
                        onClick={() =>
                          history.push(
                            `/users/customer/details?userId=${data?._id}`,
                          )
                        }
                        className="cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: "var(--secondary-elite-color)",
                                color: "var(--primary-elite-color)",
                              }}
                            >
                              <FaUserCircle size={24} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                                {data?.userName || "N/A"}
                              </p>

                              <p className="text-xs text-gray-400 mt-1">
                                Customer
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            {data?.phoneNumber || "N/A"}
                          </span>
                        </td>

                        {/* Email */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {data?.email || "N/A"}
                          </span>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize"
                            style={{
                              backgroundColor: "var(--secondary-elite-color)",
                              color: "var(--primary-elite-color)",
                            }}
                          >
                            {data?.role || "Customer"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <div
                            className="inline-flex items-center font-semibold text-xs capitalize px-3 py-1.5 rounded-full"
                            style={statusTheme(data?.userStatus)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />

                            {data?.userStatus === "inactive"
                              ? "Blocked"
                              : data?.userStatus || "Unknown"}
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setId(data?._id);
                                toggleDrawer();
                              }}
                              type="button"
                              title="View Details"
                              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                              style={{
                                backgroundColor: "var(--secondary-elite-color)",
                                color: "var(--primary-elite-color)",
                              }}
                            >
                              <FaExternalLinkAlt size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <div className="flex flex-col items-center justify-center py-16">
                          <div
                            className="w-20 h-20 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: "var(--secondary-elite-color)",
                              color: "var(--primary-elite-color)",
                            }}
                          >
                            <BsBox className="w-10 h-10" />
                          </div>

                          <p className="mt-5 text-base font-semibold text-gray-600 dark:text-gray-300">
                            No customers found
                          </p>

                          <p className="mt-1 text-sm text-gray-400">
                            There are no customer records available.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {customers?.length > 0 && (
              <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700">
                <Pagination
                  totalPages={totalPages}
                  activePage={activePage}
                  limit={limit}
                  setPageValue={handlePagination}
                  setLimit={handlePageLimit}
                />
              </div>
            )}
          </div>
        </div>
      </AnimatedContent>

      {/* Drawer */}
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

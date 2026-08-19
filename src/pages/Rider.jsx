import React, { useContext, useEffect, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import { useHistory } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
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

  return (
    <>
      <AnimatedContent>
        {/* Product Table */}
        <div className="overflow-x-auto">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="py-8">
              <div className="font-bold">Riders</div>
              <div className="-mx-4  pt-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow-md rounded-lg max-h-[65vh] overflow-auto">
                  <table className="min-w-full leading-normal">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-[var(--primary-elite-color)] text-white">
                        <th className="px-5 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold  uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold  uppercase tracking-wider">
                          Mobile No.
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold  uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold  uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold  uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold  uppercase tracking-wider">
                          Is Eligible
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold  uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {riders?.length > 0 ? (
                        riders.map((data, i) => (
                          <tr
                            key={i}
                            onClick={() =>
                              history.push(
                                `/users/rider/details?userId=${data?._id}`,
                              )
                            }
                            className="cursor-pointer"
                          >
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <div className="flex">
                                <div className="flex-shrink-0 w-10 h-10">
                                  <img
                                    className="w-full h-full rounded-full"
                                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                    alt=""
                                  />
                                </div>
                                <div className="ml-3 mt-3">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {data?.userName}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {data?.phoneNumber}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {data?.email}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap capitalize">
                                {data?.role}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <div
                                className="font-bold w-fit capitalize px-3 py-1 rounded-full"
                                style={statusTheme(data?.userStatus)}
                              >
                                {data?.userStatus === "inactive"
                                  ? "Blocked"
                                  : data?.userStatus}
                              </div>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <span className="relative capitalize inline-block px-3 py-1 font-semibold text-blue-950 leading-tight">
                                <span
                                  aria-hidden
                                  className={`absolute inset-0 ${
                                    data?.isPracticingEligible === "pending" &&
                                    "bg-yellow-400"
                                  } ${
                                    data?.isPracticingEligible ===
                                      "not-eligible" && "bg-red-500"
                                  } ${
                                    data?.isPracticingEligible === "eligible" &&
                                    "bg-green-400"
                                  } opacity-50 rounded-full`}
                                ></span>

                                <span className="relative">
                                  {data?.isPracticingEligible}
                                </span>
                              </span>
                            </td>

                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setId(data?._id); // Set the id
                                  toggleDrawer(); // Open the drawer
                                }}
                                type="button"
                                className="inline-block text-gray-500 hover:"
                              >
                                <FaExternalLinkAlt size={18} />
                              </button>
                              <MainDrawer windowDimensionHighWidth="400px">
                                <StaffDrawer
                                  id={id}
                                  toggleDrawer={toggleDrawer}
                                  handleCallBack={handleCallBack}
                                  defaultStatus={data?.isPracticingEligible}
                                />
                              </MainDrawer>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-5 text-gray-400"
                          >
                            <div className="flex flex-col items-center">
                              <BsBox className="w-20 h-20" />
                              <p className="mt-4 text-lg">No data available</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
        </div>
      </AnimatedContent>
    </>
  );
};

export default Rider;

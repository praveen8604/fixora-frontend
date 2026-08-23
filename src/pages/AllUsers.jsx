import React, { useEffect, useMemo, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useHistory } from "react-router-dom";
import Pagination from "@/components/common/Pagination";
import { FaUsers, FaUserCheck, FaUserSlash } from "react-icons/fa6";
import { MdAdminPanelSettings, MdSearch } from "react-icons/md";

const AllUsers = () => {
  const history = useHistory();

  const [userData, setUserData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const handlePagination = (currentPage) => {
    setActivePage(currentPage);
    getAllUsers(currentPage, limit);
  };

  const handlePageLimit = (currentLimit) => {
    setLimit(currentLimit);
    setActivePage(1);
    getAllUsers(1, currentLimit);
  };

  const getAllUsers = (selectedPage, dataLimit) => {
    DashboardServices.getAllUsers(selectedPage, dataLimit)
      .then((res) => {
        if (res) {
          const decodedata = DecryptData(res);

          setTotalPages(decodedata.data?.totalPages);
          setUserData(decodedata.data?.users || []);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    getAllUsers(activePage, limit);
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return userData;

    return userData.filter((user) => {
      return (
        user?.userName?.toLowerCase()?.includes(value) ||
        user?.email?.toLowerCase()?.includes(value) ||
        user?.phoneNumber?.toLowerCase()?.includes(value) ||
        user?.role?.toLowerCase()?.includes(value) ||
        user?.userStatus?.toLowerCase()?.includes(value)
      );
    });
  }, [userData, search]);

  /* =========================================================
     COUNTS
  ========================================================= */

  const activeUsers = userData.filter(
    (user) => user?.userStatus === "active",
  ).length;

  const blockedUsers = userData.filter(
    (user) => user?.userStatus === "inactive",
  ).length;

  const getRoleClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-[#FFF1F1] text-[#E04444] border-[#FFD9D9]";

      case "technician":
        return "bg-[#FFF7E8] text-[#D88A00] border-[#FFE5B2]";

      case "rider":
        return "bg-[#F3EEFF] text-[#7651D6] border-[#DED2FF]";

      case "customer":
        return "bg-[#EAFBF3] text-[#159765] border-[#C8F0DD]";

      default:
        return "bg-[#F4F5F7] text-[#68707C] border-[#E2E5E9]";
    }
  };

  const getStatusClass = (status) => {
    if (status === "active") {
      return "bg-[#EAFBF3] text-[#159765] border-[#C8F0DD]";
    }

    return "bg-[#FFF1F1] text-[#E04444] border-[#FFD9D9]";
  };

  return (
    <AnimatedContent>
      <div className="w-full px-2 pb-6 sm:px-3 lg:px-4">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div
          className="
            relative
            mt-4
            overflow-hidden
            rounded-[24px]
            border
            border-[#E5E8ED]
            bg-white
            p-5
            shadow-[0_5px_24px_rgba(30,40,55,0.05)]
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-20
              h-44
              w-44
              rounded-full
              bg-[var(--primary-color)]
              opacity-[0.06]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              left-1/3
              h-32
              w-32
              rounded-full
              bg-[var(--primary-elite-color)]
              opacity-[0.035]
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
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
                  bg-[var(--primary-color)]
                  text-[var(--primary-elite-color)]
                "
              >
                <FaUsers size={21} />
              </div>

              <div>
                <h1
                  className="
                    text-[21px]
                    font-extrabold
                    tracking-[-0.02em]
                    text-[#252A32]
                  "
                >
                  Users
                </h1>

                <p
                  className="
                    mt-0.5
                    text-[11px]
                    font-semibold
                    text-[#929AA5]
                  "
                >
                  Manage and view all registered users
                </p>
              </div>
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
              <MdSearch size={19} className="shrink-0 text-[#9AA2AC]" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
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
            </div>
          </div>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* TOTAL */}

          <div
            className="
              flex
              items-center
              justify-between
              rounded-[18px]
              border
              border-[#E5E8ED]
              bg-white
              p-4
              shadow-[0_4px_16px_rgba(30,40,55,0.035)]
              transition-all
              duration-200
              hover:-translate-y-[1px]
              hover:shadow-[0_7px_20px_rgba(30,40,55,0.07)]
            "
          >
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#A0A7B0]">
                Total Users
              </p>

              <p className="mt-1 text-[22px] font-extrabold text-[#252A32]">
                {userData.length}
              </p>
            </div>

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[var(--primary-color)]
                text-[var(--primary-elite-color)]
              "
            >
              <FaUsers size={17} />
            </div>
          </div>

          {/* ACTIVE */}

          <div
            className="
              flex
              items-center
              justify-between
              rounded-[18px]
              border
              border-[#E5E8ED]
              bg-white
              p-4
              shadow-[0_4px_16px_rgba(30,40,55,0.035)]
              transition-all
              duration-200
              hover:-translate-y-[1px]
              hover:shadow-[0_7px_20px_rgba(30,40,55,0.07)]
            "
          >
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#A0A7B0]">
                Active Users
              </p>

              <p className="mt-1 text-[22px] font-extrabold text-[#159765]">
                {activeUsers}
              </p>
            </div>

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#EAFBF3]
                text-[#159765]
              "
            >
              <FaUserCheck size={17} />
            </div>
          </div>

          {/* BLOCKED */}

          <div
            className="
              flex
              items-center
              justify-between
              rounded-[18px]
              border
              border-[#E5E8ED]
              bg-white
              p-4
              shadow-[0_4px_16px_rgba(30,40,55,0.035)]
              transition-all
              duration-200
              hover:-translate-y-[1px]
              hover:shadow-[0_7px_20px_rgba(30,40,55,0.07)]
            "
          >
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#A0A7B0]">
                Blocked Users
              </p>

              <p className="mt-1 text-[22px] font-extrabold text-[#E04444]">
                {blockedUsers}
              </p>
            </div>

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#FFF1F1]
                text-[#E04444]
              "
            >
              <FaUserSlash size={17} />
            </div>
          </div>
        </div>

        {/* =====================================================
            USERS TABLE
        ====================================================== */}

        <div
          className="
            mt-4
            overflow-hidden
            rounded-[22px]
            border
            border-[#E5E8ED]
            bg-white
            shadow-[0_5px_24px_rgba(30,40,55,0.045)]
          "
        >
          {/* TABLE HEADER */}

          <div
            className="
              flex
              flex-col
              gap-2
              border-b
              border-[#EEF0F3]
              px-5
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h2 className="text-[14px] font-extrabold text-[#282D35]">
                All Users
              </h2>

              <p className="mt-0.5 text-[10px] font-semibold text-[#9AA2AC]">
                {search
                  ? `${filteredUsers.length} matching users`
                  : "Registered users and their account information"}
              </p>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-[#F7F8FA]
                px-3
                py-1.5
              "
            >
              <MdAdminPanelSettings
                size={15}
                className="text-[var(--primary-elite-color)]"
              />

              <span className="text-[10px] font-bold text-[#69727E]">
                User Management
              </span>
            </div>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="min-w-[850px] w-full">
              <thead>
                <tr
                  className="
                    border-b
                    border-[#E8EBF0]
                    bg-[#F8F9FB]
                  "
                >
                  <th className="px-5 py-3.5 text-left text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#929AA5]">
                    User
                  </th>

                  <th className="px-5 py-3.5 text-left text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#929AA5]">
                    Mobile No.
                  </th>

                  <th className="px-5 py-3.5 text-left text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#929AA5]">
                    Email
                  </th>

                  <th className="px-5 py-3.5 text-left text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#929AA5]">
                    Role
                  </th>

                  <th className="px-5 py-3.5 text-left text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#929AA5]">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((data, i) => (
                    <tr
                      key={data?._id || i}
                      onClick={() => history.push(`/user?userId=${data?._id}`)}
                      className="
                        group
                        cursor-pointer
                        border-b
                        border-[#F0F1F3]
                        transition-all
                        duration-200
                        hover:bg-[#FAFBFC]
                      "
                    >
                      {/* USER */}

                      <td className="px-5 py-4">
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
                              border
                              border-[#E6E9EE]
                              bg-[#F4F6F8]
                              transition-all
                              duration-200
                              group-hover:border-[var(--primary-elite-color)]
                              group-hover:bg-[var(--primary-color)]
                            "
                          >
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                              alt="User"
                              className="
                                h-7
                                w-7
                                object-contain
                                opacity-80
                              "
                            />
                          </div>

                          <div className="min-w-0">
                            <p
                              className="
                                max-w-[180px]
                                truncate
                                text-[11.5px]
                                font-extrabold
                                text-[#343B45]
                                transition-colors
                                group-hover:text-[var(--primary-elite-color)]
                              "
                            >
                              {data?.userName || "--"}
                            </p>

                            <p className="mt-0.5 text-[9px] font-semibold text-[#A0A7B0]">
                              User ID:{" "}
                              {data?._id ? `${data._id.slice(0, 8)}...` : "--"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* PHONE */}

                      <td className="px-5 py-4">
                        <span className="text-[11px] font-semibold text-[#59626E]">
                          {data?.phoneNumber || "--"}
                        </span>
                      </td>

                      {/* EMAIL */}

                      <td className="px-5 py-4">
                        <span
                          className="
                            block
                            max-w-[230px]
                            truncate
                            text-[11px]
                            font-semibold
                            text-[#59626E]
                          "
                          title={data?.email}
                        >
                          {data?.email || "--"}
                        </span>
                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex
                            items-center
                            rounded-full
                            border
                            px-2.5
                            py-1
                            text-[9px]
                            font-extrabold
                            capitalize
                            ${getRoleClass(data?.role)}
                          `}
                        >
                          {data?.role || "--"}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            px-2.5
                            py-1
                            text-[9px]
                            font-extrabold
                            capitalize
                            ${getStatusClass(data?.userStatus)}
                          `}
                        >
                          <span
                            className={`
                              h-1.5
                              w-1.5
                              rounded-full
                              ${
                                data?.userStatus === "active"
                                  ? "bg-[#159765]"
                                  : "bg-[#E04444]"
                              }
                            `}
                          />

                          {data?.userStatus === "inactive"
                            ? "Blocked"
                            : data?.userStatus || "--"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-14">
                      <div className="flex flex-col items-center justify-center">
                        <div
                          className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[#F5F6F8]
                            text-[#A0A7B0]
                          "
                        >
                          <FaUsers size={22} />
                        </div>

                        <p className="mt-3 text-[12px] font-extrabold text-[#69727E]">
                          No users found
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-[#A0A7B0]">
                          Try changing your search keyword.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div className="border-t border-[#EEF0F3] px-4 py-3">
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
  );
};

export default AllUsers;

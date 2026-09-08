import React, { useEffect, useMemo, useState } from "react";
import DashboardServices from "@/services/DashboardServices";
import { DecryptData } from "@/utils/DecryptData";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useHistory } from "react-router-dom";
import Pagination from "@/components/common/Pagination";

import {
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaUserCog,
} from "react-icons/fa";

import { FiArrowUpRight, FiSearch } from "react-icons/fi";

/* =========================================================
   KPI CARD
========================================================= */

const KpiCard = ({ title, value, desc, Icon }) => {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-accent
        bg-white
        p-5
        shadow-[0_6px_25px_rgba(0,0,0,0.06)]
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1.5
        hover:border-secondary
        hover:shadow-[0_22px_45px_rgba(0,0,0,0.10)]
      "
    >
      {/* Decorative background */}

      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          h-32
          w-32
          rounded-full
          bg-accent/30
          opacity-70
          transition-all
          duration-500
          group-hover:scale-[1.7]
        "
      />

      <div
        className="
          relative
          z-10
          flex
          items-start
          justify-between
        "
      >
        {/* Icon */}

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-[14px]
            border
            border-secondary
            bg-background
            text-primary
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:bg-accent
            group-hover:shadow-lg
          "
        >
          <Icon size={18} />
        </div>

        {/* Arrow */}

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-accent
            bg-background
            text-secondary
            transition-all
            duration-300
            group-hover:bg-primary
            group-hover:text-white
          "
        >
          <FiArrowUpRight size={14} />
        </div>
      </div>

      {/* Content */}

      <div className="relative z-10 mt-5">
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-secondary
          "
        >
          {title}
        </p>

        <div
          className="
            mt-2.5
            flex
            items-end
            justify-between
            gap-2
          "
        >
          <h3
            className="
              text-[30px]
              font-extrabold
              leading-none
              tracking-[-0.05em]
              text-primary
            "
          >
            {value}
          </h3>

          <span
            className="
              mb-0.5
              max-w-[105px]
              text-right
              text-[9px]
              font-medium
              leading-4
              text-secondary
            "
          >
            {desc}
          </span>
        </div>
      </div>

      {/* Bottom line */}

      <div
        className="
          absolute
          bottom-0
          left-5
          right-5
          h-[2px]
          overflow-hidden
          rounded-full
          bg-accent
        "
      >
        <div
          className="
            h-full
            w-0
            rounded-full
            bg-primary
            transition-all
            duration-500
            group-hover:w-full
          "
        />
      </div>
    </div>
  );
};

/* =========================================================
   ROLE CLASS
========================================================= */

const getRoleClass = (role) => {
  switch (role) {
    case "admin":
      return `
        bg-primary/10
        text-primary
        border-primary/30
      `;

    case "technician":
      return `
        bg-secondary/15
        text-secondary
        border-secondary/30
      `;

    case "rider":
      return `
        bg-accent/40
        text-primary
        border-accent
      `;

    case "customer":
      return `
        bg-secondary/10
        text-secondary
        border-secondary/25
      `;

    default:
      return `
        bg-background
        text-primary
        border-accent
      `;
  }
};

/* =========================================================
   STATUS CLASS
========================================================= */

const getStatusClass = (status) => {
  if (status === "active") {
    return `
      bg-accent/40
      text-primary
      border-accent
    `;
  }

  return `
    bg-secondary/15
    text-secondary
    border-secondary/30
  `;
};

/* =========================================================
   ALL USERS
========================================================= */

const AllUsers = () => {
  const history = useHistory();

  const [userData, setUserData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  /* =========================================================
     GET ALL USERS
  ========================================================= */

  const getAllUsers = (page, lim) => {
    DashboardServices.getAllUsers(page, lim)
      .then((res) => {
        if (res) {
          const d = DecryptData(res);

          setTotalPages(d.data?.totalPages);
          setUserData(d.data?.users || []);
        }
      })
      .catch(console.error);
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    getAllUsers(activePage, limit);
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredUsers = useMemo(() => {
    const v = search.trim().toLowerCase();

    if (!v) return userData;

    return userData.filter((u) =>
      [
        u?.userName,
        u?.email,
        u?.phoneNumber,
        u?.role,
        u?.userStatus,
      ].some((f) =>
        f?.toLowerCase()?.includes(v)
      )
    );
  }, [userData, search]);

  /* =========================================================
     METRICS
  ========================================================= */

  const totalUsers = userData.length;

  const activeUsers = userData.filter(
    (u) => u?.userStatus === "active"
  ).length;

  const blockedUsers = userData.filter(
    (u) => u?.userStatus === "inactive"
  ).length;

  const adminUsers = userData.filter(
    (u) => u?.role === "admin"
  ).length;

  const metrics = [
    {
      title: "Total Users",
      value: totalUsers,
      desc: "All registered",
      Icon: FaUsers,
    },
    {
      title: "Active",
      value: activeUsers,
      desc: "Ready accounts",
      Icon: FaUserCheck,
    },
    {
      title: "Blocked",
      value: blockedUsers,
      desc: "Restricted access",
      Icon: FaUserSlash,
    },
    {
      title: "Admins",
      value: adminUsers,
      desc: "Admin users",
      Icon: FaUserCog,
    },
  ];

  return (
    <AnimatedContent>
      <div
        className="
          min-h-screen
          bg-background
          pb-10
        "
      >
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="mb-8">
          <div
            className="
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-secondary
              bg-primary
              px-6
              py-7
              shadow-[0_20px_55px_rgba(0,0,0,0.18)]
              sm:px-8
              sm:py-9
            "
          >
            {/* Decorative circle */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-28
                h-[340px]
                w-[340px]
                rounded-full
                bg-secondary/25
              "
            />

            {/* Grid */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-[0.04]
                [background-image:linear-gradient(#F8F8FA_1px,transparent_1px),linear-gradient(90deg,#F8F8FA_1px,transparent_1px)]
                [background-size:34px_34px]
              "
            />

            <div
              className="
                relative
                z-10
                flex
                flex-col
                gap-6
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* Hero Content */}

              <div>
                <h1
                  className="
                    text-[28px]
                    font-extrabold
                    leading-tight
                    tracking-[-0.04em]
                    text-white
                    sm:text-[34px]
                  "
                >
                  All Users
                </h1>

                <p
                  className="
                    mt-2
                    max-w-[520px]
                    text-[13px]
                    leading-6
                    text-white/70
                  "
                >
                  Manage admins, technicians, riders
                  and customers from one place.
                </p>
              </div>

              {/* Hero Actions */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                {/* Search */}

                <div
                  className="
                    flex
                    h-[44px]
                    items-center
                    gap-2.5
                    rounded-xl
                    border
                    border-secondary/70
                    bg-secondary/20
                    px-3
                  "
                >
                  <FiSearch
                    size={14}
                    className="text-accent"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search users..."
                    className="
                      w-[180px]
                      border-0
                      bg-transparent
                      text-[12px]
                      font-medium
                      text-white
                      outline-none
                      placeholder:text-white/50
                      focus:ring-0
                    "
                  />
                </div>

                {/* Users Count */}

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                    rounded-xl
                    border
                    border-secondary/70
                    bg-secondary/20
                    px-4
                    py-2.5
                  "
                >
                  <FaUsers
                    size={13}
                    className="text-accent"
                  />

                  <span
                    className="
                      text-[12px]
                      font-bold
                      text-white
                    "
                  >
                    {totalUsers} Users
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom line */}

            <div
              className="
                absolute
                bottom-0
                left-8
                right-8
                h-px
                bg-secondary
              "
            />
          </div>
        </section>

        {/* =====================================================
            KPI CARDS
        ====================================================== */}

        <section className="mb-8">
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {metrics.map((m) => (
              <KpiCard
                key={m.title}
                {...m}
              />
            ))}
          </div>
        </section>

        {/* =====================================================
            USER COLLECTION
        ====================================================== */}

        <section>
          {/* Collection Header */}

          <div
            className="
              mb-5
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-[20px]
                  border
                  border-secondary
                  bg-primary
                  text-white
                  shadow-[0_16px_30px_rgba(0,0,0,0.18)]
                "
              >
                <FaUsers size={22} />
              </div>

              <div>
                <h2
                  className="
                    text-[34px]
                    font-extrabold
                    tracking-[-0.05em]
                    text-primary
                  "
                >
                  User Collection
                </h2>

                <p
                  className="
                    text-sm
                    text-secondary
                  "
                >
                  Manage and monitor every registered
                  account
                </p>
              </div>
            </div>

            {/* Records */}

            <span
              className="
                inline-flex
                w-fit
                items-center
                rounded-full
                border
                border-secondary
                bg-background
                px-4
                py-2
                text-[11px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-primary
                shadow-sm
              "
            >
              {search
                ? `${filteredUsers.length} Matching`
                : `${totalUsers} Records`}
            </span>
          </div>

          {/* =====================================================
              TABLE
          ====================================================== */}

          <div
            className="
              overflow-hidden
              rounded-[30px]
              border
              border-accent
              bg-white
              shadow-[0_18px_42px_rgba(0,0,0,0.08)]
            "
          >
            {/* Table Header */}

            <div
              className="
                border-b
                border-accent
                bg-background
                px-6
                py-5
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <h3
                    className="
                      text-base
                      font-bold
                      text-primary
                    "
                  >
                    All Users
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-secondary
                    "
                  >
                    {search
                      ? `${filteredUsers.length} matching users in view`
                      : "All registered users in the system"}
                  </p>
                </div>

                <span
                  className="
                    inline-flex
                    w-fit
                    items-center
                    rounded-full
                    border
                    border-secondary
                    bg-white
                    px-3
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-primary
                  "
                >
                  Live Data
                </span>
              </div>
            </div>

            {/* Table */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="bg-background">
                    {[
                      "User",
                      "Mobile No.",
                      "Email",
                      "Role",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="
                          px-5
                          py-4
                          text-left
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.16em]
                          text-secondary
                        "
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(
                      (data, i) => (
                        <tr
                          key={
                            data?._id || i
                          }
                          onClick={() =>
                            history.push(
                              `/user?userId=${data?._id}`
                            )
                          }
                          className="
                            group
                            cursor-pointer
                            border-b
                            border-accent/40
                            bg-white
                            transition-colors
                            hover:bg-background
                          "
                        >
                          {/* User */}

                          <td className="px-5 py-4">
                            <div
                              className="
                                flex
                                items-center
                                gap-3
                              "
                            >
                              <div
                                className="
                                  flex
                                  h-11
                                  w-11
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-2xl
                                  border
                                  border-secondary
                                  bg-background
                                  text-sm
                                  font-bold
                                  text-primary
                                  transition-all
                                  group-hover:bg-primary
                                  group-hover:text-white
                                "
                              >
                                {data?.userName?.[0]?.toUpperCase() ||
                                  "?"}
                              </div>

                              <div className="min-w-0">
                                <p
                                  className="
                                    max-w-[220px]
                                    truncate
                                    text-[12px]
                                    font-bold
                                    text-primary
                                  "
                                >
                                  {data?.userName ||
                                    "--"}
                                </p>

                                <p
                                  className="
                                    mt-0.5
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.08em]
                                    text-secondary
                                  "
                                >
                                  {data?._id?.slice(
                                    0,
                                    10
                                  )}
                                  ...
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Mobile */}

                          <td className="px-5 py-4">
                            <span
                              className="
                                text-[11px]
                                font-semibold
                                text-secondary
                              "
                            >
                              {data?.phoneNumber ||
                                "--"}
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
                                text-secondary
                              "
                              title={data?.email}
                            >
                              {data?.email ||
                                "--"}
                            </span>
                          </td>

                          {/* Role */}

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
                                font-bold
                                capitalize
                                ${getRoleClass(
                                  data?.role
                                )}
                              `}
                            >
                              {data?.role ||
                                "--"}
                            </span>
                          </td>

                          {/* Status */}

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
                                font-bold
                                capitalize
                                ${getStatusClass(
                                  data?.userStatus
                                )}
                              `}
                            >
                              <span
                                className="
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  bg-primary
                                "
                              />

                              {data?.userStatus ===
                              "inactive"
                                ? "Blocked"
                                : data?.userStatus ||
                                  "--"}
                            </span>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    /* =================================================
                       EMPTY STATE
                    ================================================== */

                    <tr>
                      <td
                        colSpan={5}
                        className="
                          py-20
                          text-center
                        "
                      >
                        <div
                          className="
                            flex
                            flex-col
                            items-center
                          "
                        >
                          <div
                            className="
                              flex
                              h-16
                              w-16
                              items-center
                              justify-center
                              rounded-[22px]
                              border
                              border-secondary
                              bg-background
                              text-primary
                            "
                          >
                            <FaUsers size={24} />
                          </div>

                          <p
                            className="
                              mt-4
                              text-[13px]
                              font-bold
                              text-primary
                            "
                          >
                            No users found
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* =====================================================
                PAGINATION
            ====================================================== */}

            <div
              className="
                border-t
                border-accent/50
                px-4
                py-3
              "
            >
              <Pagination
                totalPages={totalPages}
                activePage={activePage}
                limit={limit}
                setPageValue={(p) => {
                  setActivePage(p);
                  getAllUsers(p, limit);
                }}
                setLimit={(l) => {
                  setLimit(l);
                  setActivePage(1);
                  getAllUsers(1, l);
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </AnimatedContent>
  );
};

export default AllUsers;
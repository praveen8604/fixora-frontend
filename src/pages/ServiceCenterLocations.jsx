import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { SidebarContext } from "@/context/SidebarContext";

import {
  FaMapLocationDot,
  FaLocationDot,
  FaUser,
  FaPlus,
  FaCalendarDays,
} from "react-icons/fa6";

import {
  FiMapPin,
  FiGlobe,
  FiClock,
  FiActivity,
  FiArrowUpRight,
} from "react-icons/fi";

import AdminServices from "@/services/AdminServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import { DecryptData } from "@/utils/DecryptData";
import MuiDrawer from "@/components/drawer/MuiDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";

const ServiceCenterLocation = () => {
  const [zoneDragger, setZoneDragger] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [zoneAddress, setZoneAddress] = useState("");
  const [zones, setZones] = useState([]);

  const { isSidebarOpen } = useContext(SidebarContext);

  const getZoneAddress = () => {
    AdminServices.getZones()
      .then((res) => {
        if (res) {
          const decryptedData = DecryptData(res);
          setZones(decryptedData?.data?.addresses || []);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch service centers:", err);
      });
  };

  useEffect(() => {
    getZoneAddress();
  }, []);

  const handleZoneSubmit = (e) => {
    e.preventDefault();

    const payload = {
      addressName: zoneName,
      addressInput: zoneAddress,
      isServiceCenterLocation: true,
    };

    AdminServices.createZone(payload)
      .then((res) => {
        if (res) {
          notifySuccess("Zone created successfully!");

          getZoneAddress();

          setZoneDragger(false);
          setZoneName("");
          setZoneAddress("");
        }
      })
      .catch((err) => {
        const decryptedData = DecryptData(err?.response?.data);

        notifyError(
          decryptedData?.error?.message ||
            "Failed to create service center."
        );
      });
  };

  const totalCenters = zones?.length || 0;

  const recentCenters = useMemo(() => {
    if (!Array.isArray(zones)) return 0;

    const sevenDaysAgo = moment().subtract(7, "days");

    return zones.filter((zone) =>
      moment(zone?.createdAt).isAfter(sevenDaysAgo)
    ).length;
  }, [zones]);

  const coordinateCenters = useMemo(() => {
    if (!Array.isArray(zones)) return 0;

    return zones.filter(
      (zone) =>
        zone?.latitude !== undefined &&
        zone?.latitude !== null &&
        zone?.latitude !== "" &&
        zone?.longitude !== undefined &&
        zone?.longitude !== null &&
        zone?.longitude !== ""
    ).length;
  }, [zones]);

  const columns = [
    {
      name: "SERVICE CENTER",
      cell: (row) => (
        <div className="flex items-center gap-3 py-2.5">
          <div
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-[12px]
              bg-indigo-50
              text-indigo-600
              transition-all duration-200
              group-hover:bg-indigo-100
            "
          >
            <FiMapPin size={18} strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <div className="truncate text-[12px] font-extrabold text-slate-800">
              {row?.addressName || "--"}
            </div>

            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500">
              <FaLocationDot size={8} />
              Service Center
            </div>
          </div>
        </div>
      ),
      width: "230px",
    },

    {
      name: "ADDRESS",
      cell: (row) => (
        <div className="flex items-start gap-2 py-2">
          <FiMapPin
            size={14}
            className="mt-0.5 shrink-0 text-indigo-500"
          />

          <div
            className="
              max-w-[280px]
              text-[11px]
              font-medium
              leading-5
              text-slate-600
            "
            title={row?.addressLine}
          >
            {row?.addressLine || "--"}
          </div>
        </div>
      ),
      width: "320px",
    },

    {
      name: "COORDINATES",
      cell: (row) => (
        <div className="flex flex-col gap-1.5">
          <div
            className="
              inline-flex w-fit items-center gap-1.5
              rounded-full
              bg-indigo-50
              px-2.5 py-1
            "
          >
            <span className="text-[9px] font-extrabold uppercase text-indigo-600">
              LAT
            </span>

            <span className="text-[10px] font-semibold text-slate-600">
              {row?.latitude ?? "--"}
            </span>
          </div>

          <div
            className="
              inline-flex w-fit items-center gap-1.5
              rounded-full
              bg-cyan-50
              px-2.5 py-1
            "
          >
            <span className="text-[9px] font-extrabold uppercase text-cyan-600">
              LNG
            </span>

            <span className="text-[10px] font-semibold text-slate-600">
              {row?.longitude ?? "--"}
            </span>
          </div>
        </div>
      ),
      width: "190px",
    },

    {
      name: "CREATED BY",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div
            className="
              flex h-8 w-8 shrink-0 items-center justify-center
              rounded-full
              bg-indigo-50
              text-indigo-600
            "
          >
            <FaUser size={12} />
          </div>

          <div className="min-w-0">
            <div className="truncate text-[11px] font-bold text-slate-700">
              {row?.user?.userName || "--"}
            </div>

            <div className="text-[9px] uppercase tracking-wide text-slate-400">
              Admin
            </div>
          </div>
        </div>
      ),
      width: "180px",
    },

    {
      name: "CREATED ON",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="
              flex h-7 w-7 items-center justify-center
              rounded-lg
              bg-indigo-50
              text-indigo-600
            "
          >
            <FiClock size={13} />
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-700">
              {row?.createdAt
                ? moment(row.createdAt).format("DD MMM YYYY")
                : "--"}
            </div>

            <div className="mt-0.5 text-[9px] text-slate-400">
              {row?.createdAt
                ? moment(row.createdAt).format("hh:mm A")
                : "--"}
            </div>
          </div>
        </div>
      ),
      width: "165px",
    },

    {
      name: "UPDATED ON",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="
              flex h-7 w-7 items-center justify-center
              rounded-lg
              bg-cyan-50
              text-cyan-600
            "
          >
            <FiActivity size={13} />
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-700">
              {row?.updatedAt
                ? moment(row.updatedAt).format("DD MMM YYYY")
                : "--"}
            </div>

            <div className="mt-0.5 text-[9px] text-slate-400">
              {row?.updatedAt
                ? moment(row.updatedAt).format("hh:mm A")
                : "--"}
            </div>
          </div>
        </div>
      ),
      width: "165px",
    },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-full bg-slate-50 pb-8 text-slate-800">

        {/* =========================================================
            PAGE HEADER
        ========================================================== */}

        <div
          className="
            relative mb-6 overflow-hidden
            rounded-[24px]
            border border-slate-200
            bg-white
            px-5 py-5
            shadow-[0_8px_30px_rgba(15,23,42,0.06)]
            sm:px-6
          "
        >
          {/* Background decorations */}

          <div
            className="
              pointer-events-none absolute
              -right-20 -top-24
              h-56 w-56
              rounded-full
              bg-indigo-500/[0.08]
              blur-2xl
            "
          />

          <div
            className="
              pointer-events-none absolute
              -bottom-24 right-32
              h-44 w-44
              rounded-full
              bg-cyan-500/[0.06]
              blur-2xl
            "
          />

          <div
            className="
              pointer-events-none absolute
              right-[30%] top-[-40px]
              h-20 w-20
              rounded-full
              bg-violet-500/[0.04]
              blur-xl
            "
          />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}

            <div className="flex items-center gap-4">
              <div
                className="
                  flex h-14 w-14 shrink-0
                  items-center justify-center
                  rounded-[17px]
                  text-white
                  shadow-[0_10px_24px_rgba(79,70,229,0.25)]
                "
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                }}
              >
                <FaMapLocationDot size={24} />
              </div>

              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h1 className="text-[20px] font-extrabold tracking-[-0.02em] text-slate-900">
                    Service Centers
                  </h1>

                  <span
                    className="
                      rounded-full
                      bg-indigo-50
                      px-2.5 py-1
                      text-[9px]
                      font-extrabold
                      uppercase
                      tracking-[0.08em]
                      text-indigo-600
                    "
                  >
                    Locations
                  </span>
                </div>

                <p className="max-w-[560px] text-[11px] leading-5 text-slate-500">
                  Manage service center locations, addresses and
                  geographical coordinates from one place.
                </p>
              </div>
            </div>

            {/* Create */}

            <button
              type="button"
              onClick={() => setZoneDragger(true)}
              className="
                group flex min-h-[42px] w-full
                items-center justify-center gap-2
                rounded-[12px]
                px-5 py-2.5
                text-[12px]
                font-extrabold
                text-white
                shadow-[0_8px_20px_rgba(79,70,229,0.20)]
                transition-all duration-200
                hover:-translate-y-0.5
                hover:shadow-[0_12px_25px_rgba(79,70,229,0.25)]
                sm:w-auto
              "
              style={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              }}
            >
              <FaPlus size={12} />

              <span>Create Service Center</span>

              <FiArrowUpRight
                size={15}
                className="
                  transition-transform duration-200
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </button>
          </div>
        </div>

        {/* =========================================================
            SUMMARY CARDS
        ========================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {/* TOTAL */}

          <div
            className="
              group relative overflow-hidden
              rounded-[20px]
              border border-slate-200
              bg-white
              p-4
              shadow-[0_5px_20px_rgba(15,23,42,0.04)]
              transition-all duration-300
              hover:-translate-y-1
              hover:border-indigo-100
              hover:shadow-[0_15px_35px_rgba(15,23,42,0.08)]
            "
          >
            <div
              className="
                absolute -right-10 -top-10
                h-28 w-28 rounded-full
                bg-indigo-500/[0.06]
                transition-transform duration-500
                group-hover:scale-125
              "
            />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Total Centers
                </p>

                <p className="mt-1.5 text-[25px] font-extrabold leading-none text-slate-900">
                  {totalCenters}
                </p>

                <p className="mt-2 text-[9px] font-semibold text-slate-400">
                  All registered locations
                </p>
              </div>

              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-[13px]
                  bg-indigo-50
                  text-indigo-600
                "
              >
                <FaMapLocationDot size={19} />
              </div>
            </div>
          </div>

          {/* MAPPED */}

          <div
            className="
              group relative overflow-hidden
              rounded-[20px]
              border border-slate-200
              bg-white
              p-4
              shadow-[0_5px_20px_rgba(15,23,42,0.04)]
              transition-all duration-300
              hover:-translate-y-1
              hover:border-cyan-100
              hover:shadow-[0_15px_35px_rgba(15,23,42,0.08)]
            "
          >
            <div
              className="
                absolute -right-10 -top-10
                h-28 w-28 rounded-full
                bg-cyan-500/[0.06]
                transition-transform duration-500
                group-hover:scale-125
              "
            />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Mapped Centers
                </p>

                <p className="mt-1.5 text-[25px] font-extrabold leading-none text-slate-900">
                  {coordinateCenters}
                </p>

                <p className="mt-2 text-[9px] font-semibold text-slate-400">
                  Locations with coordinates
                </p>
              </div>

              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-[13px]
                  bg-cyan-50
                  text-cyan-600
                "
              >
                <FiGlobe size={20} />
              </div>
            </div>
          </div>

          {/* RECENT */}

          <div
            className="
              group relative overflow-hidden
              rounded-[20px]
              border border-slate-200
              bg-white
              p-4
              shadow-[0_5px_20px_rgba(15,23,42,0.04)]
              transition-all duration-300
              hover:-translate-y-1
              hover:border-violet-100
              hover:shadow-[0_15px_35px_rgba(15,23,42,0.08)]
            "
          >
            <div
              className="
                absolute -right-10 -top-10
                h-28 w-28 rounded-full
                bg-violet-500/[0.06]
                transition-transform duration-500
                group-hover:scale-125
              "
            />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Recently Added
                </p>

                <p className="mt-1.5 text-[25px] font-extrabold leading-none text-slate-900">
                  {recentCenters}
                </p>

                <p className="mt-2 text-[9px] font-semibold text-slate-400">
                  Added in the last 7 days
                </p>
              </div>

              <div
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-[13px]
                  bg-violet-50
                  text-violet-600
                "
              >
                <FaCalendarDays size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            TABLE
        ========================================================== */}

        <div
          className="
            overflow-hidden
            rounded-[22px]
            border border-slate-200
            bg-white
            shadow-[0_8px_30px_rgba(15,23,42,0.05)]
          "
        >
          {/* Table Header */}

          <div
            className="
              flex flex-col gap-3
              border-b border-slate-200
              bg-white
              px-5 py-4
              sm:flex-row sm:items-center sm:justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-[11px]
                  bg-indigo-50
                  text-indigo-600
                "
              >
                <FiMapPin size={17} />
              </div>

              <div>
                <h2 className="text-[13px] font-extrabold text-slate-800">
                  Service Center Locations
                </h2>

                <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                  Complete list of registered service centers
                </p>
              </div>
            </div>

            <div
              className="
                flex w-fit items-center gap-2
                rounded-full
                bg-indigo-50
                px-3 py-1.5
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

              <span className="text-[9px] font-extrabold uppercase tracking-wide text-indigo-600">
                {totalCenters} Centers
              </span>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={zones}
            noDataComponent={
              <div className="flex min-h-[300px] w-full flex-col items-center justify-center px-5 text-center">
                <div
                  className="
                    mb-4 flex h-16 w-16
                    items-center justify-center
                    rounded-[18px]
                    bg-indigo-50
                    text-indigo-600
                  "
                >
                  <FaMapLocationDot size={25} />
                </div>

                <div className="text-[14px] font-extrabold text-slate-800">
                  No Service Centers Found
                </div>

                <div className="mt-1 max-w-[300px] text-[10px] leading-5 text-slate-400">
                  Create your first service center location to
                  start managing your service network.
                </div>

                <button
                  type="button"
                  onClick={() => setZoneDragger(true)}
                  className="
                    mt-5 inline-flex items-center gap-2
                    rounded-[10px]
                    px-4 py-2
                    text-[10px]
                    font-extrabold
                    text-white
                    shadow-[0_6px_15px_rgba(79,70,229,0.18)]
                    transition-all duration-200
                    hover:-translate-y-0.5
                  "
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  }}
                >
                  <FaPlus size={9} />
                  Create Service Center
                </button>
              </div>
            }
            fixedHeader
            fixedHeaderScrollHeight="65vh"
            highlightOnHover
            className={`data_table_comp ${
              isSidebarOpen
                ? "data_table_comp_sidebar_opened"
                : "data_table_comp_sidebar_closed"
            }`}
            customStyles={{
              table: {
                style: {
                  backgroundColor: "#ffffff",
                },
              },

              headRow: {
                style: {
                  minHeight: "52px",
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                },
              },

              headCells: {
                style: {
                  fontSize: "9.5px",
                  fontWeight: "800",
                  color: "#475569",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  paddingLeft: "18px",
                  paddingRight: "18px",
                },
              },

              rows: {
                style: {
                  minHeight: "78px",
                  backgroundColor: "#ffffff",
                  borderBottom: "1px solid #f1f5f9",
                  transition: "all 0.2s ease",
                },

                highlightOnHoverStyle: {
                  backgroundColor: "#f8faff",
                  borderBottomColor: "#e2e8f0",
                  outline: "none",
                },
              },

              cells: {
                style: {
                  paddingLeft: "18px",
                  paddingRight: "18px",
                  fontSize: "11px",
                  fontWeight: "600",
                },
              },

              progress: {
                style: {
                  backgroundColor: "#ffffff",
                },
              },
            }}
          />
        </div>

        {/* =========================================================
            CREATE SERVICE CENTER DRAWER
        ========================================================== */}

        <MuiDrawer
          open={zoneDragger}
          onClose={() => setZoneDragger(false)}
          drawerWidth="420px"
        >
          <div className="h-[var(--doc-height)] bg-white">

            {/* Drawer Header */}

            <div
              className="
                relative overflow-hidden
                border-b border-slate-200
                px-5 py-5
              "
            >
              <div
                className="
                  pointer-events-none absolute
                  -right-10 -top-12
                  h-32 w-32
                  rounded-full
                  bg-indigo-500/[0.08]
                  blur-xl
                "
              />

              <div className="relative z-10 flex items-center gap-3">
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-[13px]
                    text-white
                    shadow-[0_8px_18px_rgba(79,70,229,0.20)]
                  "
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  }}
                >
                  <FaMapLocationDot size={19} />
                </div>

                <div>
                  <h2 className="text-[15px] font-extrabold text-slate-800">
                    Create Service Center
                  </h2>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Add a new location to your service network
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}

            <form onSubmit={handleZoneSubmit}>
              <div
                className="overflow-auto px-5"
                style={{
                  height: "calc(var(--doc-height) - 135px)",
                }}
              >

                {/* Info */}

                <div
                  className="
                    mt-5 flex gap-3
                    rounded-[14px]
                    border border-indigo-100
                    bg-indigo-50/70
                    p-3
                  "
                >
                  <div className="mt-0.5 shrink-0 text-indigo-600">
                    <FiMapPin size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-slate-800">
                      Location details
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-slate-500">
                      Enter a clear center name and complete
                      address so the location can be identified
                      easily.
                    </p>
                  </div>
                </div>

                {/* Name */}

                <div className="mt-6">
                  <label className="mb-2 block text-[11px] font-extrabold text-slate-700">
                    Service Center Name
                  </label>

                  <input
                    required
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                    className="
                      default-input
                      !h-11
                      !rounded-[10px]
                      !border-slate-200
                      !text-[12px]
                      focus:!border-indigo-400
                      focus:!ring-1
                      focus:!ring-indigo-100
                    "
                    placeholder="e.g. Fixora Ranchi Center"
                  />
                </div>

                {/* Address */}

                <div className="mt-5">
                  <label className="mb-2 block text-[11px] font-extrabold text-slate-700">
                    Service Center Address
                  </label>

                  <textarea
                    required
                    value={zoneAddress}
                    onChange={(e) => setZoneAddress(e.target.value)}
                    className="
                      default-textarea
                      !rounded-[10px]
                      !border-slate-200
                      !text-[12px]
                      !leading-5
                      focus:!border-indigo-400
                      focus:!ring-1
                      focus:!ring-indigo-100
                    "
                    placeholder="Enter the complete service center address"
                    rows={5}
                  />
                </div>

                {/* Preview */}

                {(zoneName || zoneAddress) && (
                  <div className="mt-5">
                    <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                      Preview
                    </p>

                    <div
                      className="
                        rounded-[14px]
                        border border-slate-200
                        bg-slate-50/70
                        p-3
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-[10px]
                            bg-indigo-50
                            text-indigo-600
                          "
                        >
                          <FiMapPin size={16} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-extrabold text-slate-800">
                            {zoneName || "Service Center Name"}
                          </p>

                          <p className="mt-0.5 line-clamp-2 text-[9px] leading-4 text-slate-400">
                            {zoneAddress || "Service center address"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}

              <div
                className="
                  flex items-center gap-2
                  border-t border-slate-200
                  bg-white
                  px-5 py-3
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    setZoneDragger(false);
                    setZoneName("");
                    setZoneAddress("");
                  }}
                  className="
                    h-10 w-full
                    rounded-[10px]
                    border border-indigo-200
                    bg-white
                    text-[11px]
                    font-extrabold
                    text-indigo-600
                    transition-all duration-200
                    hover:bg-indigo-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    flex h-10 w-full
                    items-center justify-center gap-2
                    rounded-[10px]
                    text-[11px]
                    font-extrabold
                    text-white
                    shadow-[0_6px_16px_rgba(79,70,229,0.20)]
                    transition-all duration-200
                    hover:-translate-y-0.5
                  "
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  }}
                >
                  <FaPlus size={10} />
                  Create Center
                </button>
              </div>
            </form>
          </div>
        </MuiDrawer>
      </div>
    </AnimatedContent>
  );
};

export default ServiceCenterLocation;
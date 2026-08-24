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
        console.log("Error: ", err);
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
        notifyError(decryptedData?.error?.message);
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
        zone?.longitude !== undefined &&
        zone?.longitude !== null
    ).length;
  }, [zones]);

  const columns = [
    {
      name: "SERVICE CENTER",
      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          <div
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-[12px]
              bg-[var(--secondary-light-2-color)]
              text-[var(--primary-elite-color)]
            "
          >
            <FiMapPin size={18} strokeWidth={2.4} />
          </div>

          <div className="min-w-0">
            <div className="truncate text-[12px] font-extrabold text-[var(--secondary-color)]">
              {row?.addressName || "--"}
            </div>

            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--secondary-color)] opacity-50">
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
            className="mt-0.5 shrink-0 text-[var(--primary-elite-color)]"
          />

          <div
            className="
              max-w-[280px]
              text-[11px]
              font-medium
              leading-5
              text-[var(--secondary-color)]
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
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--secondary-light-2-color)] px-2.5 py-1">
            <span className="text-[9px] font-extrabold uppercase text-[var(--primary-elite-color)]">
              LAT
            </span>

            <span className="text-[10px] font-semibold text-[var(--secondary-color)]">
              {row?.latitude || "--"}
            </span>
          </div>

          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--secondary-light-2-color)] px-2.5 py-1">
            <span className="text-[9px] font-extrabold uppercase text-[var(--primary-elite-color)]">
              LNG
            </span>

            <span className="text-[10px] font-semibold text-[var(--secondary-color)]">
              {row?.longitude || "--"}
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
              bg-[var(--secondary-light-2-color)]
              text-[var(--primary-elite-color)]
            "
          >
            <FaUser size={12} />
          </div>

          <div className="min-w-0">
            <div className="truncate text-[11px] font-bold text-[var(--secondary-color)]">
              {row?.user?.userName || "--"}
            </div>

            <div className="text-[9px] uppercase tracking-wide opacity-40">
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
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--secondary-light-2-color)] text-[var(--primary-elite-color)]">
            <FiClock size={13} />
          </div>

          <div>
            <div className="text-[10px] font-bold text-[var(--secondary-color)]">
              {row?.createdAt
                ? moment(row.createdAt).format("DD MMM YYYY")
                : "--"}
            </div>

            <div className="mt-0.5 text-[9px] opacity-45">
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
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--secondary-light-2-color)] text-[var(--primary-elite-color)]">
            <FiActivity size={13} />
          </div>

          <div>
            <div className="text-[10px] font-bold text-[var(--secondary-color)]">
              {row?.updatedAt
                ? moment(row.updatedAt).format("DD MMM YYYY")
                : "--"}
            </div>

            <div className="mt-0.5 text-[9px] opacity-45">
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
    <div className="pb-8 text-[var(--secondary-color)]">
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}
      <div
        className="
          relative mb-6 overflow-hidden
          rounded-[24px]
          border border-[var(--secondary-light-2-color)]
          bg-[var(--primary-color)]
          px-5 py-5
          shadow-[0_8px_30px_rgba(15,23,42,0.04)]
          sm:px-6
        "
      >
        {/* Decorative circles */}
        <div
          className="
            pointer-events-none absolute
            -right-10 -top-16
            h-40 w-40
            rounded-full
            opacity-[0.07]
          "
          style={{
            backgroundColor: "var(--primary-elite-color)",
          }}
        />

        <div
          className="
            pointer-events-none absolute
            right-24 -bottom-16
            h-28 w-28
            rounded-full
            opacity-[0.04]
          "
          style={{
            backgroundColor: "var(--primary-elite-color)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <div
              className="
                flex h-14 w-14 shrink-0
                items-center justify-center
                rounded-[17px]
                text-[var(--primary-color)]
                shadow-[0_10px_24px_rgba(0,0,0,0.10)]
              "
              style={{
                backgroundColor: "var(--primary-elite-color)",
              }}
            >
              <FaMapLocationDot size={24} />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <h1 className="text-[20px] font-extrabold tracking-[-0.02em]">
                  Service Centers
                </h1>

                <span
                  className="
                    rounded-full px-2.5 py-1
                    text-[9px] font-extrabold
                    uppercase tracking-[0.08em]
                  "
                  style={{
                    color: "var(--primary-elite-color)",
                    backgroundColor: "var(--secondary-light-2-color)",
                  }}
                >
                  Locations
                </span>
              </div>

              <p className="max-w-[560px] text-[11px] leading-5 opacity-55">
                Manage service center locations, addresses and geographical
                coordinates from one place.
              </p>
            </div>
          </div>

          {/* Create button */}
          <button
            onClick={() => setZoneDragger(true)}
            className="
              group flex min-h-[42px] w-full
              items-center justify-center gap-2
              rounded-[12px]
              px-5 py-2.5
              text-[12px] font-extrabold
              text-[var(--primary-color)]
              shadow-[0_8px_20px_rgba(0,0,0,0.10)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:opacity-90
              sm:w-auto
            "
            style={{
              backgroundColor: "var(--primary-elite-color)",
            }}
          >
            <FaPlus size={12} />

            <span>Create Service Center</span>

            <FiArrowUpRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>

      {/* =========================================================
          SUMMARY CARDS
      ========================================================== */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Total */}
        <div
          className="
            group relative overflow-hidden
            rounded-[20px]
            border border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            p-4
            shadow-[0_5px_20px_rgba(15,23,42,0.035)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)]
          "
        >
          <div
            className="
              absolute -right-8 -top-8
              h-24 w-24 rounded-full
              opacity-[0.06]
            "
            style={{
              backgroundColor: "var(--primary-elite-color)",
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] opacity-45">
                Total Centers
              </p>

              <p className="mt-1.5 text-[24px] font-extrabold leading-none">
                {totalCenters}
              </p>

              <p className="mt-2 text-[9px] font-semibold opacity-40">
                All registered locations
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-[13px]
              "
              style={{
                color: "var(--primary-elite-color)",
                backgroundColor: "var(--secondary-light-2-color)",
              }}
            >
              <FaMapLocationDot size={19} />
            </div>
          </div>
        </div>

        {/* Coordinates */}
        <div
          className="
            group relative overflow-hidden
            rounded-[20px]
            border border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            p-4
            shadow-[0_5px_20px_rgba(15,23,42,0.035)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)]
          "
        >
          <div
            className="
              absolute -right-8 -top-8
              h-24 w-24 rounded-full
              opacity-[0.06]
            "
            style={{
              backgroundColor: "var(--primary-elite-color)",
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] opacity-45">
                Mapped Centers
              </p>

              <p className="mt-1.5 text-[24px] font-extrabold leading-none">
                {coordinateCenters}
              </p>

              <p className="mt-2 text-[9px] font-semibold opacity-40">
                Locations with coordinates
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-[13px]
              "
              style={{
                color: "var(--primary-elite-color)",
                backgroundColor: "var(--secondary-light-2-color)",
              }}
            >
              <FiGlobe size={20} />
            </div>
          </div>
        </div>

        {/* Recent */}
        <div
          className="
            group relative overflow-hidden
            rounded-[20px]
            border border-[var(--secondary-light-2-color)]
            bg-[var(--primary-color)]
            p-4
            shadow-[0_5px_20px_rgba(15,23,42,0.035)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)]
          "
        >
          <div
            className="
              absolute -right-8 -top-8
              h-24 w-24 rounded-full
              opacity-[0.06]
            "
            style={{
              backgroundColor: "var(--primary-elite-color)",
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] opacity-45">
                Recently Added
              </p>

              <p className="mt-1.5 text-[24px] font-extrabold leading-none">
                {recentCenters}
              </p>

              <p className="mt-2 text-[9px] font-semibold opacity-40">
                Added in the last 7 days
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-[13px]
              "
              style={{
                color: "var(--primary-elite-color)",
                backgroundColor: "var(--secondary-light-2-color)",
              }}
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
          border border-[var(--secondary-light-2-color)]
          bg-[var(--primary-color)]
          shadow-[0_8px_30px_rgba(15,23,42,0.045)]
        "
      >
        {/* Table Header */}
        <div
          className="
            flex flex-col gap-3
            border-b border-[var(--secondary-light-2-color)]
            px-5 py-4
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-[11px]
              "
              style={{
                color: "var(--primary-elite-color)",
                backgroundColor: "var(--secondary-light-2-color)",
              }}
            >
              <FiMapPin size={17} />
            </div>

            <div>
              <h2 className="text-[13px] font-extrabold">
                Service Center Locations
              </h2>

              <p className="mt-0.5 text-[9px] font-medium opacity-45">
                Complete list of registered service centers
              </p>
            </div>
          </div>

          <div
            className="
              flex w-fit items-center gap-2
              rounded-full
              bg-[var(--secondary-light-2-color)]
              px-3 py-1.5
            "
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: "var(--primary-elite-color)",
              }}
            />

            <span className="text-[9px] font-extrabold uppercase tracking-wide opacity-60">
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
                "
                style={{
                  color: "var(--primary-elite-color)",
                  backgroundColor: "var(--secondary-light-2-color)",
                }}
              >
                <FaMapLocationDot size={25} />
              </div>

              <div className="text-[14px] font-extrabold">
                No Service Centers Found
              </div>

              <div className="mt-1 max-w-[300px] text-[10px] leading-5 opacity-45">
                Create your first service center location to start managing
                your service network.
              </div>

              <button
                onClick={() => setZoneDragger(true)}
                className="
                  mt-5 inline-flex items-center gap-2
                  rounded-[10px]
                  px-4 py-2
                  text-[10px] font-extrabold
                  text-[var(--primary-color)]
                  transition-all duration-200
                  hover:opacity-90
                "
                style={{
                  backgroundColor: "var(--primary-elite-color)",
                }}
              >
                <FaPlus size={9} />
                Create Service Center
              </button>
            </div>
          }
          fixedHeader
          fixedHeaderScrollHeight="65vh"
          className={`data_table_comp ${
            isSidebarOpen
              ? "data_table_comp_sidebar_opened"
              : "data_table_comp_sidebar_closed"
          } text-[var(--secondary-color)]`}
          customStyles={{
            table: {
              style: {
                backgroundColor: "var(--primary-color)",
              },
            },

            headRow: {
              style: {
                minHeight: "50px",
                backgroundColor: "var(--secondary-light-2-color)",
                borderBottom:
                  "1px solid var(--secondary-light-2-color)",
              },
            },

            headCells: {
              style: {
                fontSize: "9.5px",
                fontWeight: "800",
                color: "var(--secondary-color)",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                paddingLeft: "18px",
                paddingRight: "18px",
              },
            },

            rows: {
              style: {
                minHeight: "78px",
                backgroundColor: "var(--primary-color)",
                borderBottom:
                  "1px solid var(--secondary-light-2-color)",
                transition: "all 0.2s ease",
              },

              highlightOnHoverStyle: {
                backgroundColor: "var(--secondary-light-2-color)",
                borderBottomColor:
                  "var(--secondary-light-2-color)",
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
                backgroundColor: "var(--primary-color)",
              },
            },
          }}
        />
      </div>

      {/* =========================================================
          CREATE ZONE DRAWER
      ========================================================== */}
      <MuiDrawer
        open={zoneDragger}
        onClose={() => setZoneDragger(false)}
        drawerWidth="420px"
      >
        <div className="h-[var(--doc-height)] bg-[var(--primary-color)]">
          {/* Drawer Header */}
          <div
            className="
              relative overflow-hidden
              border-b border-[var(--secondary-light-2-color)]
              px-5 py-5
            "
          >
            <div
              className="
                pointer-events-none absolute
                -right-8 -top-10
                h-28 w-28
                rounded-full
                opacity-[0.07]
              "
              style={{
                backgroundColor: "var(--primary-elite-color)",
              }}
            />

            <div className="relative z-10 flex items-center gap-3">
              <div
                className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-[13px]
                  text-[var(--primary-color)]
                "
                style={{
                  backgroundColor: "var(--primary-elite-color)",
                }}
              >
                <FaMapLocationDot size={19} />
              </div>

              <div>
                <h2 className="text-[15px] font-extrabold">
                  Create Service Center
                </h2>

                <p className="mt-0.5 text-[10px] opacity-45">
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
              {/* Info Card */}
              <div
                className="
                  mt-5 flex gap-3
                  rounded-[14px]
                  border border-[var(--secondary-light-2-color)]
                  bg-[var(--secondary-light-2-color)]
                  p-3
                "
              >
                <div
                  className="mt-0.5 shrink-0"
                  style={{
                    color: "var(--primary-elite-color)",
                  }}
                >
                  <FiMapPin size={16} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold">
                    Location details
                  </p>

                  <p className="mt-1 text-[9px] leading-4 opacity-50">
                    Enter a clear center name and complete address so the
                    location can be identified easily.
                  </p>
                </div>
              </div>

              {/* Zone Name */}
              <div className="mt-6">
                <label className="mb-2 block text-[11px] font-extrabold">
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
                    !border-[var(--secondary-light-2-color)]
                    !text-[12px]
                  "
                  placeholder="e.g. Fixora Ranchi Center"
                />
              </div>

              {/* Address */}
              <div className="mt-5">
                <label className="mb-2 block text-[11px] font-extrabold">
                  Service Center Address
                </label>

                <textarea
                  required
                  value={zoneAddress}
                  onChange={(e) => setZoneAddress(e.target.value)}
                  className="
                    default-teaxtarea
                    !rounded-[10px]
                    !border-[var(--secondary-light-2-color)]
                    !text-[12px]
                    !leading-5
                  "
                  placeholder="Enter the complete service center address"
                  rows={5}
                />
              </div>

              {/* Preview */}
              {(zoneName || zoneAddress) && (
                <div className="mt-5">
                  <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.12em] opacity-45">
                    Preview
                  </p>

                  <div
                    className="
                      rounded-[14px]
                      border border-[var(--secondary-light-2-color)]
                      p-3
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-[10px]
                        "
                        style={{
                          color: "var(--primary-elite-color)",
                          backgroundColor:
                            "var(--secondary-light-2-color)",
                        }}
                      >
                        <FiMapPin size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-extrabold">
                          {zoneName || "Service Center Name"}
                        </p>

                        <p className="mt-0.5 line-clamp-2 text-[9px] leading-4 opacity-45">
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
                border-t border-[var(--secondary-light-2-color)]
                bg-[var(--primary-color)]
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
                  border-2
                  border-[var(--primary-elite-color)]
                  text-[11px]
                  font-extrabold
                  text-[var(--primary-elite-color)]
                  transition-all duration-200
                  hover:bg-[var(--secondary-light-2-color)]
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
                  text-[var(--primary-color)]
                  shadow-[0_6px_16px_rgba(0,0,0,0.10)]
                  transition-all duration-200
                  hover:opacity-90
                "
                style={{
                  backgroundColor: "var(--primary-elite-color)",
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
  );
};

export default ServiceCenterLocation;
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
          decryptedData?.error?.message || "Failed to create service center."
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
        <div className="flex items-center gap-3 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#E8F0FF] text-[#2563EB]">
            <FiMapPin size={18} strokeWidth={2.4} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-[12px] font-extrabold text-[#111827]">
              {row?.addressName || "--"}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#8993A5]">
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
          <FiMapPin size={14} className="mt-0.5 shrink-0 text-[#2563EB]" />
          <div className="max-w-[280px] text-[11px] font-medium leading-5 text-[#59626E]" title={row?.addressLine}>
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
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EFF6FF] px-2.5 py-1">
            <span className="text-[9px] font-extrabold uppercase text-[#2563EB]">LAT</span>
            <span className="text-[10px] font-semibold text-[#111827]">{row?.latitude ?? "--"}</span>
          </div>
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EFF6FF] px-2.5 py-1">
            <span className="text-[9px] font-extrabold uppercase text-[#2563EB]">LNG</span>
            <span className="text-[10px] font-semibold text-[#111827]">{row?.longitude ?? "--"}</span>
          </div>
        </div>
      ),
      width: "190px",
    },

    {
      name: "CREATED BY",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F0FF] text-[#2563EB]">
            <FaUser size={12} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-[11px] font-bold text-[#111827]">{row?.user?.userName || "--"}</div>
            <div className="text-[9px] uppercase tracking-wide text-[#8993A5]">Admin</div>
          </div>
        </div>
      ),
      width: "180px",
    },

    {
      name: "CREATED ON",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8F0FF] text-[#2563EB]">
            <FiClock size={13} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#111827]">
              {row?.createdAt ? moment(row.createdAt).format("DD MMM YYYY") : "--"}
            </div>
            <div className="mt-0.5 text-[9px] text-[#8993A5]">
              {row?.createdAt ? moment(row.createdAt).format("hh:mm A") : "--"}
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
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8F0FF] text-[#2563EB]">
            <FiActivity size={13} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#111827]">
              {row?.updatedAt ? moment(row.updatedAt).format("DD MMM YYYY") : "--"}
            </div>
            <div className="mt-0.5 text-[9px] text-[#8993A5]">
              {row?.updatedAt ? moment(row.updatedAt).format("hh:mm A") : "--"}
            </div>
          </div>
        </div>
      ),
      width: "165px",
    },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#F4F7FB] pb-8">
        {/* =========================================================
            PAGE HEADER
        ========================================================== */}

        <section className="mb-8">
          <div className="relative overflow-hidden rounded-[30px] bg-[#0B1220] px-6 py-7 shadow-[0_20px_55px_rgba(15,23,42,0.15)] sm:px-8 sm:py-9">
            <div className="pointer-events-none absolute -right-24 -top-28 h-[340px] w-[340px] rounded-full bg-[#2563EB]/20 blur-[2px]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8]/50" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#38BDF8]" /></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">Services</span>
                </div>
                <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.04em] text-white sm:text-[34px]">Service Centers</h1>
                <p className="mt-2 max-w-[520px] text-[13px] leading-6 text-white/50">Manage service center locations, addresses and geographical coordinates from one place.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 backdrop-blur-xl">
                  <FaMapLocationDot size={13} className="text-[#60A5FA]" />
                  <span className="text-[12px] font-bold text-white/85">{totalCenters} Centers</span>
                </div>
                <button
                  type="button"
                  onClick={() => setZoneDragger(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-[12px] font-extrabold text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  <FaPlus size={12} />
                  <span>Create Service Center</span>
                  <FiArrowUpRight size={15} />
                </button>
              </div>
            </div>
            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#2563EB]/50 to-transparent" />
          </div>
        </section>

        {/* =========================================================
            SUMMARY CARDS
        ========================================================== */}

        <section className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Total Centers", value: totalCenters, desc: "All registered locations", Icon: FaMapLocationDot, soft: "from-[#EEF0FF] to-[#F4FDFF]", line: "from-[#5E63D9] to-[#35C7F3]" },
              { label: "Mapped Centers", value: coordinateCenters, desc: "Locations with coordinates", Icon: FiGlobe, soft: "from-[#ECFDF5] to-[#F0FDFA]", line: "from-[#10B981] to-[#59D6BF]" },
              { label: "Recently Added", value: recentCenters, desc: "Added in the last 7 days", Icon: FaCalendarDays, soft: "from-[#F4F0FF] to-[#F5F3FF]", line: "from-[#8B5CF6] to-[#4CC9F0]" },
            ].map((item) => (
              <div key={item.label} className="group relative overflow-hidden rounded-[24px] border border-[#E5EAF1] bg-white p-5 shadow-[0_6px_25px_rgba(15,23,42,0.035)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#C9D7EF] hover:shadow-[0_22px_45px_rgba(15,23,42,0.09)]">
                <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${item.soft} opacity-70 transition-all duration-500 group-hover:scale-[1.7]`} />
                <div className="relative z-10 flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br ${item.soft} text-[#2563EB] transition-all duration-300 group-hover:scale-110`}>
                    <item.Icon size={18} />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F6FA] text-[#98A2B3] transition-all duration-300 group-hover:bg-[#111827] group-hover:text-white">
                    <FiArrowUpRight size={14} />
                  </div>
                </div>
                <div className="relative z-10 mt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8B95A7]">{item.label}</p>
                  <div className="mt-2.5 flex items-end justify-between gap-2">
                    <h3 className="text-[30px] font-extrabold leading-none tracking-[-0.05em] text-[#111827]">{item.value}</h3>
                    <span className="mb-0.5 max-w-[105px] text-right text-[9px] font-medium leading-4 text-[#A0A8B8]">{item.desc}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-5 right-5 h-[2px] overflow-hidden rounded-full bg-[#EDF0F5]">
                  <div className={`h-full w-0 rounded-full bg-gradient-to-r ${item.line} transition-all duration-500 group-hover:w-full`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            TABLE
        ========================================================== */}

        <div className="overflow-hidden rounded-[22px] border border-[#E8ECF5] bg-white shadow-[0_18px_42px_rgba(84,98,130,0.10)]">
          {/* Table Header */}

          <div className="flex flex-col gap-3 border-b border-[#F0F2F7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#E8F0FF] text-[#2563EB]">
                <FiMapPin size={17} />
              </div>
              <div>
                <h2 className="text-[13px] font-extrabold text-[#111827]">Service Center Locations</h2>
                <p className="mt-0.5 text-[9px] font-medium text-[#8993A5]">Complete list of registered service centers</p>
              </div>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full bg-[#F5F7FC] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
              <span className="text-[9px] font-extrabold uppercase tracking-wide text-[#7F8897]">{totalCenters} Centers</span>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={zones}
            noDataComponent={
              <div className="flex min-h-[300px] w-full flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#E8F0FF] text-[#2563EB]">
                  <FaMapLocationDot size={25} />
                </div>
                <div className="text-[14px] font-extrabold text-[#111827]">No Service Centers Found</div>
                <div className="mt-1 max-w-[300px] text-[10px] leading-5 text-[#8993A5]">
                  Create your first service center location to start managing your service network.
                </div>
                <button
                  type="button"
                  onClick={() => setZoneDragger(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-[#2563EB] px-4 py-2 text-[10px] font-extrabold text-white transition-all hover:opacity-90"
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
              table: { style: { backgroundColor: "#ffffff" } },
              headRow: {
                style: {
                  minHeight: "50px",
                  backgroundColor: "#F8FAFD",
                  borderBottom: "1px solid #F0F2F7",
                },
              },
              headCells: {
                style: {
                  fontSize: "9.5px",
                  fontWeight: "800",
                  color: "#99A3B3",
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
                  borderBottom: "1px solid #F2F4F8",
                  transition: "all 0.2s ease",
                },
                highlightOnHoverStyle: {
                  backgroundColor: "#FAFBFF",
                  borderBottomColor: "#F2F4F8",
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
              progress: { style: { backgroundColor: "#ffffff" } },
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

            <div className="relative overflow-hidden border-b border-[#F0F2F7] px-5 py-5">
              <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#2563EB] opacity-[0.07]" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#2563EB] text-white">
                  <FaMapLocationDot size={19} />
                </div>
                <div>
                  <h2 className="text-[15px] font-extrabold text-[#111827]">Create Service Center</h2>
                  <p className="mt-0.5 text-[10px] text-[#8993A5]">Add a new location to your service network</p>
                </div>
              </div>
            </div>

            {/* Form */}

            <form onSubmit={handleZoneSubmit}>
              <div
                className="overflow-auto px-5"
                style={{ height: "calc(var(--doc-height) - 135px)" }}
              >
                {/* Info Card */}

                <div className="mt-5 flex gap-3 rounded-[14px] border border-[#E8F0FF] bg-[#EFF6FF] p-3">
                  <div className="mt-0.5 shrink-0 text-[#2563EB]">
                    <FiMapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-[#111827]">Location details</p>
                    <p className="mt-1 text-[9px] leading-4 text-[#8993A5]">Enter a clear center name and complete address so the location can be identified easily.</p>
                  </div>
                </div>

                {/* Service Center Name */}

                <div className="mt-6">
                  <label className="mb-2 block text-[11px] font-extrabold text-[#111827]">Service Center Name</label>
                  <input
                    required
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                    className="default-input !h-11 !rounded-[10px] !border-[#E5EAF1] !text-[12px]"
                    placeholder="e.g. Fixora Ranchi Center"
                  />
                </div>

                {/* Address */}

                <div className="mt-5">
                  <label className="mb-2 block text-[11px] font-extrabold text-[#111827]">Service Center Address</label>
                  <textarea
                    required
                    value={zoneAddress}
                    onChange={(e) => setZoneAddress(e.target.value)}
                    className="default-textarea !rounded-[10px] !border-[#E5EAF1] !text-[12px] !leading-5"
                    placeholder="Enter the complete service center address"
                    rows={5}
                  />
                </div>

                {/* Preview */}

                {(zoneName || zoneAddress) && (
                  <div className="mt-5">
                    <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#8993A5]">Preview</p>
                    <div className="rounded-[14px] border border-[#E5EAF1] p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E8F0FF] text-[#2563EB]">
                          <FiMapPin size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-extrabold text-[#111827]">{zoneName || "Service Center Name"}</p>
                          <p className="mt-0.5 line-clamp-2 text-[9px] leading-4 text-[#8993A5]">{zoneAddress || "Service center address"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}

              <div className="flex items-center gap-2 border-t border-[#F0F2F7] bg-white px-5 py-3">
                <button
                  type="button"
                  onClick={() => { setZoneDragger(false); setZoneName(""); setZoneAddress(""); }}
                  className="h-10 w-full rounded-[10px] border-2 border-[#2563EB] text-[11px] font-extrabold text-[#2563EB] transition-all duration-200 hover:bg-[#EFF6FF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[#2563EB] text-[11px] font-extrabold text-white shadow-[0_6px_16px_rgba(37,99,235,0.25)] transition-all duration-200 hover:opacity-90"
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
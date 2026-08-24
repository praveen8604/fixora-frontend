import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/context/SidebarContext";
import { FaMapLocationDot, FaLocationDot } from "react-icons/fa6";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
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

  const getZoneAddress = () => {
    AdminServices.getZones()
      .then((res) => {
        if (res) {
          const d = DecryptData(res);
          setZones(d?.data?.addresses || []);
        }
      })
      .catch(console.error);
  };

  useEffect(() => { getZoneAddress(); }, []);

  const handleZoneSubmit = (e) => {
    e.preventDefault();
    AdminServices.createZone({ addressName: zoneName, addressInput: zoneAddress, isServiceCenterLocation: true })
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
        const d = DecryptData(err?.response?.data);
        notifyError(d?.error?.message);
      });
  };

  const metrics = [
    { title: "Total Centers", value: zones.length,  desc: "All locations",    Icon: FaMapLocationDot },
    { title: "Active Zones",  value: zones.length,  desc: "Operational",      Icon: FiMapPin },
  ];

  const columns = [
    {
      name: "Zone Name",
      cell: (row) => <span className="text-[12px] font-bold text-[#20242B]">{row?.addressName || "--"}</span>,
      width: "200px",
    },
    {
      name: "Address Line",
      cell: (row) => <span className="text-[11px] text-[#59626E] clamp-text">{row?.addressLine || "--"}</span>,
      width: "260px",
    },
    {
      name: "Latitude",
      cell: (row) => <span className="text-[11px] font-mono text-[#59626E]">{row?.latitude || "--"}</span>,
      width: "140px",
    },
    {
      name: "Longitude",
      cell: (row) => <span className="text-[11px] font-mono text-[#59626E]">{row?.longitude || "--"}</span>,
      width: "140px",
    },
    {
      name: "Created By",
      cell: (row) => <span className="text-[11px] font-semibold text-[#59626E]">{row?.user?.userName || "--"}</span>,
      width: "150px",
    },
    {
      name: "Created On",
      cell: (row) => <span className="text-[11px] text-[#9AA2AC]">{moment(row?.createdAt).format("DD MMM YYYY")}</span>,
      width: "130px",
    },
  ];

  return (
    <AnimatedContent>
      <div className="min-h-screen bg-[#FDF8F4] pb-10">

        {/* PAGE HEADER */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_0_5px_rgba(249,115,22,0.12)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B07040]">Services</span>
            </div>
            <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">Service Centers</h1>
            <p className="mt-2 text-sm leading-6 text-[#7C8592]">Manage and monitor all service center locations</p>
          </div>
          <button onClick={() => setZoneDragger(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-[0_4px_14px_rgba(249,115,22,0.35)] transition hover:bg-orange-600 active:scale-95">
            <FaMapLocationDot size={16} />
            Create Zone
          </button>
        </div>

        {/* KPI CARDS */}
        <section className="mb-7">
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.title} className="group relative min-h-[120px] overflow-hidden rounded-[22px] border border-[#F0E8E0] bg-white p-5 shadow-[0_3px_12px_rgba(180,80,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(180,80,0,0.10)]">
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-50 opacity-80 transition-transform duration-500 group-hover:scale-[1.45]" />
                  <div className="pointer-events-none absolute -bottom-14 -left-14 h-24 w-24 rounded-full bg-orange-50 opacity-40" />
                  <div className="relative z-20 flex items-start justify-between">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-orange-500 text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-2">
                      <Icon size={20} color="#fff" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDF8F4] text-[#C4A882] transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                      <FiArrowUpRight size={14} />
                    </div>
                  </div>
                  <div className="relative z-20 mt-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#B07040]">{item.title}</p>
                    <div className="mt-2 flex items-end justify-between gap-2">
                      <h3 className="text-[24px] font-extrabold leading-none tracking-tight text-[#22272F]">{item.value}</h3>
                      <span className="text-right text-[10px] font-medium text-[#C4A882]">{item.desc}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-5 right-5 z-20 h-[3px] overflow-hidden rounded-full bg-[#F5EDE4]">
                    <div className="h-full w-0 bg-orange-500 rounded-full transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TABLE */}
        <section>
          <div className="overflow-hidden rounded-[22px] border border-[#F0E8E0] bg-white shadow-[0_3px_12px_rgba(180,80,0,0.06)]">
            <div className="flex items-center justify-between border-b border-[#F5EDE4] px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-[#282D35]">Zone List</h2>
                <p className="mt-0.5 text-xs text-[#B07040]">All registered service center locations</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-100 px-3 py-1.5">
                <FiMapPin size={13} className="text-orange-500" />
                <span className="text-[10px] font-bold text-orange-600">{zones.length} zones</span>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={zones}
              noDataComponent={
                <div className="w-full min-h-[220px] flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-3">
                    <FaMapLocationDot size={24} className="text-orange-400" />
                  </div>
                  <p className="font-bold text-sm text-[#59626E]">No Service Centers Found</p>
                  <p className="text-xs text-[#9AA2AC] mt-1">Create a zone to get started</p>
                </div>
              }
              fixedHeader
              fixedHeaderScrollHeight="55vh"
              className="data_table_comp"
              customStyles={{
                headRow: { style: { backgroundColor: "#FDF0E6", borderBottom: "1px solid #F0E8E0" } },
                headCells: { style: { fontWeight: "700", fontSize: "10px", color: "#B07040", textTransform: "uppercase", letterSpacing: "0.08em" } },
                rows: { style: { minHeight: "65px", borderBottom: "1px solid #FDF0E6", transition: "background-color 0.15s ease" }, highlightOnHoverStyle: { backgroundColor: "#FDF8F4", borderBottomColor: "#F0E8E0", outlineStyle: "none" } },
                cells: { style: { fontSize: "11.5px", paddingLeft: "16px", paddingRight: "16px" } },
              }}
            />
          </div>
        </section>

      </div>

      {/* CREATE ZONE DRAWER */}
      <MuiDrawer open={zoneDragger} onClose={() => setZoneDragger(false)} drawerWidth="400px">
        <div className="p-5 bg-[#FDF8F4] h-full flex flex-col">
          <div className="flex items-center gap-3 pb-4 border-b border-orange-100">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
              <FaMapLocationDot size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-[#20242B]">Create Zone</p>
              <p className="text-[10px] text-[#B07040]">Add a new service center location</p>
            </div>
          </div>

          <form onSubmit={handleZoneSubmit} className="flex flex-col flex-1 mt-5">
            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#59626E] uppercase tracking-wide">Zone Name</label>
                <input value={zoneName} onChange={(e) => setZoneName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#E4E8ED] bg-white px-3 text-sm font-semibold text-[#20242B] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 placeholder:text-[#C4A882]"
                  placeholder="Enter zone name" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#59626E] uppercase tracking-wide">Zone Address</label>
                <textarea value={zoneAddress} onChange={(e) => setZoneAddress(e.target.value)} rows={4}
                  className="w-full rounded-xl border border-[#E4E8ED] bg-white px-3 py-2.5 text-sm font-semibold text-[#20242B] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 placeholder:text-[#C4A882] resize-none"
                  placeholder="Enter full address" />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-orange-100 mt-4">
              <button type="button" onClick={() => setZoneDragger(false)}
                className="flex-1 h-11 rounded-xl border-2 border-orange-300 text-orange-600 text-sm font-bold transition hover:bg-orange-50">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 h-11 rounded-xl bg-orange-500 text-white text-sm font-bold transition hover:bg-orange-600">
                Create Zone
              </button>
            </div>
          </form>
        </div>
      </MuiDrawer>
    </AnimatedContent>
  );
};

export default ServiceCenterLocation;

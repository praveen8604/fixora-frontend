import moment from "moment";
import DataTable from "react-data-table-component";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SidebarContext } from "@/context/SidebarContext";
import { FaMapLocationDot } from "react-icons/fa6";
import AdminServices from "@/services/AdminServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import { DecryptData } from "@/utils/DecryptData";
import MuiDrawer from "@/components/drawer/MuiDrawer";

const ServiceCenterLocation = () => {
  const history = useHistory();
  const [zoneDragger, setZoneDragger] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [zoneAddress, setZoneAddress] = useState("");
  const [zones, setZones] = useState([]);
  const { isSidebarOpen } = useContext(SidebarContext);

  const getZoneAddress = () => {
    AdminServices.getZones()
      .then((res) => {
        if (res) {
          const decryptedData = DecryptData(res);
          console.log("LOGG", decryptedData?.data?.addresses);
          setZones(decryptedData?.data?.addresses);
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
  const columns = [
    {
      name: "Zone Name",
      cell: (row) => {
        return (
          <div className="text-[var(--secondary-color)] flex items-center gap-2">
            <div>{row?.addressName || "--"}</div>
            {/* <div onClick={(e) => e.stopPropagation()}>
              {row?.customer?.userName && (
                <Link
                  to={`/users/customer/details?userId=${row?.customer?._id}`}
                >
                  <FaExternalLinkAlt
                    className={
                      "cursor-pointer hover:text-[var(--primary-elite-color)]"
                    }
                  />
                </Link>
              )}
            </div> */}
          </div>
        );
      },
      width: "200px",
    },
    {
      name: "Address Line",
      cell: (row) => {
        return (
          <div className="text-[var(--secondary-color)] clamp-text">
            {row?.addressLine}
          </div>
        );
      },
      width: "250px",
    },
    {
      name: "Latitude",
      cell: (row) => {
        return (
          <div className="text-[var(--secondary-color)] flex items-center gap-2">
            <div>{row?.latitude || "--"}</div>
          </div>
        );
      },
      width: "150px",
    },
    {
      name: "Longitude",
      cell: (row) => {
        return (
          <div className="text-[var(--secondary-color)] flex items-center gap-2">
            <div>{row?.longitude || "--"}</div>
          </div>
        );
      },
      width: "150px",
    },
    {
      name: "Created By",
      cell: (row) => {
        return (
          <div className="text-[var(--secondary-color)] flex items-center gap-2">
            <div>{row?.user?.userName || "--"}</div>
          </div>
        );
      },
      width: "150px",
    },
    {
      name: "Created On",
      cell: (row) => {
        return (
          <div className="text-[var(--secondary-color)]">
            {moment(row?.createdAt).format("DD-MM-YYYY hh:mm A")}
          </div>
        );
      },
      width: "200px",
    },
    {
      name: "Updated On",
      cell: (row) => {
        return (
          <div className="text-[var(--secondary-color)]">
            {moment(row?.updatedAt).format("DD-MM-YYYY hh:mm A")}
          </div>
        );
      },
      width: "200px",
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-[var(--secondary-color)]">
            Service Centers
          </h1>

          <p className="text-xs opacity-50 mt-1">
            Manage and monitor all service center locations
          </p>
        </div>

        <button
          onClick={() => setZoneDragger(true)}
          className="
      flex items-center justify-center gap-2
      w-full sm:w-auto
      min-h-[40px]
      px-4 py-2
      rounded-lg
      bg-[var(--primary-elite-color)]
      text-[var(--primary-color)]
      text-sm font-semibold
      transition-all duration-200
      hover:opacity-90
    "
        >
          <FaMapLocationDot size={18} />
          <span>Create Zone</span>
        </button>
      </div>
      <div className="bg-[var(--primary-color)] rounded-xl border border-[var(--secondary-light-2-color)] overflow-hidden">
        <DataTable
          columns={columns}
          data={zones}
          onRowClicked={(e) =>
            history.push(`/services/servicerequests/request?sr_id=${e._id}`)
          }
          noDataComponent={
            <div className="w-full min-h-[220px] flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[var(--secondary-light-2-color)] flex items-center justify-center mb-3">
                <FaMapLocationDot
                  size={20}
                  className="text-[var(--primary-elite-color)]"
                />
              </div>

              <div className="font-semibold text-sm text-[var(--secondary-color)]">
                No Service Centers Found
              </div>

              <div className="text-xs opacity-50 mt-1">
                Service center locations will appear here
              </div>
            </div>
          }
          fixedHeader
          fixedHeaderScrollHeight="70vh"
          className={`data_table_comp ${
            isSidebarOpen
              ? "data_table_comp_sidebar_opened"
              : "data_table_comp_sidebar_closed"
          } text-[var(--secondary-color)]`}
          customStyles={{
            headCells: {
              style: {
                fontWeight: "700",
                fontSize: "12px",
                color: "var(--secondary-color)",
                backgroundColor: "var(--secondary-light-2-color)",
                overflow: "hidden",
              },
            },
            cells: {
              style: {
                fontWeight: "600",
                fontSize: "11.5px",
                minHeight: "65px",
                paddingTop: "10px",
                paddingBottom: "10px",
              },
            },
            rows: {
              style: {
                backgroundColor: "var(--primary-color)",
                borderBottom: "1px solid var(--secondary-light-2-color)",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              },
              highlightOnHoverStyle: {
                backgroundColor: "var(--secondary-light-2-color)",
                borderBottomColor: "var(--secondary-light-2-color)",
              },
            },
          }}
        />
      </div>
      <MuiDrawer
        open={zoneDragger}
        onClose={() => setZoneDragger(false)}
        drawerWidth="400px"
      >
        <div className="p-5 bg-[var(--secondary-light-2-color)] h-[var(--doc-height)]">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--secondary-color)]/10">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary-elite-color)] flex items-center justify-center">
              <FaMapLocationDot
                size={18}
                className="text-[var(--primary-color)]"
              />
            </div>

            <div>
              <div className="font-bold text-base text-[var(--secondary-color)]">
                Create Zone
              </div>

              <div className="text-xs opacity-50 mt-0.5">
                Add a new service center location
              </div>
            </div>
          </div>
          <form onSubmit={handleZoneSubmit}>
            <div
              className="overflow-auto pe-2"
              style={{
                height: "calc(var(--doc-height) - 110px)",
              }}
            >
              <div className="flex flex-col text-sm mt-8">
                <label className="font-bold">Zone Name</label>
                <input
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="default-input"
                  placeholder="Enter a Zone Name!"
                />
              </div>
              <div className="flex flex-col text-sm mt-2">
                <label className="font-bold">Zone Address</label>
                <textarea
                  value={zoneAddress}
                  onChange={(e) => setZoneAddress(e.target.value)}
                  className="default-teaxtarea py-2"
                  placeholder="Enter a Zone Address!"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                className="mt-2 w-full border-2 border-[var(--primary-elite-color)] h-10 text-[var(--primary-elite-color)] rounded-md text-[13.5px] font-bold"
                onClick={() => setZoneDragger(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="mt-2 w-full bg-[var(--primary-elite-color)] h-10 text-[var(--primary-color)] rounded-md text-sm"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </MuiDrawer>
    </div>
  );
};

export default ServiceCenterLocation;

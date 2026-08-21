import { statusTheme } from "@/utils/getStatusTheme";
import moment from "moment";
import React, { useContext } from "react";
import {
  FaUserLargeSlash,
  FaUser,
  FaTrashCan,
  FaRegCalendarCheck,
  FaRegChartBar,
  FaDownload,
} from "react-icons/fa6";
import {
  MdCancelPresentation,
  MdWork,
  MdOutlinePendingActions,
} from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import DataTable from "react-data-table-component";

import AdminServices from "@/services/AdminServices";
import { notifySuccess } from "@/utils/toast";

import MainDrawer from "../drawer/MainDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import UserChatDrawer from "../drawer/UserChatDrawer";
import AlertDialog from "./AlterDialogBox";

import { useHistory, useLocation } from "react-router-dom";

import noFile from "../../assets/img/No data-rafiki.png";
import GoogleMapComponent from "./GoogleMapComponent";
import { AdminContext } from "@/context/AdminContext";
import Tiles from "./Tiles";

const UserDetailsContainer = ({ userData, getUserData }) => {
  const history = useHistory();
  const { dimentions } = useContext(AdminContext);
  const { pathname } = useLocation();

  const { toggleDrawer, isSidebarOpen } = useContext(SidebarContext);

  /* =========================================================
     USER STATUS
  ========================================================= */

  const updateUserStatus = () => {
    AdminServices.updateUserStatus({
      userId: userData?._id,
      userStatus:
        userData?.userStatus === "active"
          ? "inactive"
          : userData?.userStatus === "inactive"
            ? "active"
            : "inactive",
    })
      .then((res) => {
        if (res) {
          getUserData();
          notifySuccess("User status updated successfully!");
        }
      })
      .catch((err) => console.log(err));
  };

  /* =========================================================
     SERVICE REQUEST NAVIGATION
  ========================================================= */

  const openServiceRequest = (id) => {
    if (!id) return;

    history.push(`/services/servicerequests/request?sr_id=${id}`);
  };

  const openAppliance = (id) => {
    if (!id) return;

    history.push(`/appliance/overview?applianceId=${id}`);
  };

  /* =========================================================
     COMMON TABLE STYLES
  ========================================================= */

  const tableStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },

    headRow: {
      style: {
        minHeight: "42px",
        backgroundColor: "#F7F8FA",
        borderBottom: "1px solid #E8EBF0",
        borderRadius: "10px 10px 0 0",
      },
    },

    headCells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        fontSize: "10px",
        fontWeight: "800",
        color: "#8A929D",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      },
    },

    rows: {
      style: {
        minHeight: "52px",
        borderBottom: "1px solid #F0F2F5",
        fontSize: "11.5px",
        fontWeight: "600",
        color: "#3B424D",
        backgroundColor: "#FFFFFF",
        transition: "background-color 0.2s ease",
      },

      highlightOnHoverStyle: {
        backgroundColor: "#F8F9FB",
        cursor: "pointer",
        borderBottomColor: "#E5E8ED",
      },
    },

    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
        fontSize: "11.5px",
      },
    },

    pagination: {
      style: {
        borderTop: "1px solid #EEF0F3",
        minHeight: "48px",
        fontSize: "11px",
      },
    },
  };

  /* =========================================================
     SERVICE REQUEST COLUMNS
  ========================================================= */

  const serviceRequestsColumns = [
    {
      name: "SR ID",
      selector: (row) => row?._id,
      cell: (row) => (
        <button
          type="button"
          onClick={() => openServiceRequest(row?._id)}
          className="
            max-w-[100px]
            truncate
            border-0
            bg-transparent
            p-0
            font-bold
            text-[var(--secondary-color)]
            transition-colors
            duration-200
            hover:text-[var(--primary-elite-color)]
            hover:underline
          "
        >
          {row?._id || "--"}
        </button>
      ),
      width: "120px",
    },

    {
      name: "Problem Description",
      selector: (row) => row?.problemDescription,
      cell: (row) => (
        <button
          type="button"
          onClick={() => openServiceRequest(row?._id)}
          className="
            max-w-[230px]
            truncate
            border-0
            bg-transparent
            p-0
            text-left
            font-semibold
            text-[#4B535F]
            transition-colors
            duration-200
            hover:text-[var(--secondary-color)]
          "
          title={row?.problemDescription}
        >
          {row?.problemDescription || "--"}
        </button>
      ),
      width: "250px",
    },

    {
      name: "Status",
      selector: (row) => row?.ticketStatus,
      cell: (row) => (
        <button
          type="button"
          onClick={() => openServiceRequest(row?._id)}
          className="
            cursor-pointer
            rounded-full
            border-0
            px-3
            py-1
            text-[10px]
            font-bold
            capitalize
          "
          style={statusTheme(row?.ticketStatus)}
        >
          {row?.ticketStatus || "--"}
        </button>
      ),
      width: "150px",
    },

    {
      name: "Raised On",
      selector: (row) => row?.createdAt,
      cell: (row) => (
        <button
          type="button"
          onClick={() => openServiceRequest(row?._id)}
          className="
            border-0
            bg-transparent
            p-0
            text-[11px]
            font-semibold
            text-[#69727E]
            hover:text-[var(--secondary-color)]
          "
        >
          {row?.createdAt
            ? moment(row.createdAt).format("DD-MMM-YYYY hh:mm A")
            : "--"}
        </button>
      ),
      width: "190px",
    },
  ];

  /* =========================================================
     SERVICE APPROVAL COLUMNS
  ========================================================= */

  const serviceRequestsApprovalColumns = [
    {
      name: "SR ID",
      selector: (row) => row?.serviceRequest,
      cell: (row) => (
        <button
          type="button"
          onClick={() => openServiceRequest(row?.serviceRequest)}
          className="
            max-w-[110px]
            truncate
            border-0
            bg-transparent
            p-0
            font-bold
            text-[var(--secondary-color)]
            hover:underline
          "
        >
          {row?.serviceRequest || "--"}
        </button>
      ),
      width: "120px",
    },

    {
      name: "Approval Status",
      selector: (row) => row?.approvalStatus,
      cell: (row) => (
        <button
          type="button"
          onClick={() => openServiceRequest(row?.serviceRequest)}
          className="
            rounded-full
            border-0
            px-3
            py-1
            text-[10px]
            font-bold
            capitalize
          "
          style={statusTheme(row?.approvalStatus)}
        >
          {row?.approvalStatus || "--"}
        </button>
      ),
      width: "160px",
    },

    {
      name: "Work Status",
      selector: (row) => row?.workCompletionStatus,
      cell: (row) => (
        <button
          type="button"
          onClick={() => openServiceRequest(row?.serviceRequest)}
          className="
            rounded-full
            border-0
            px-3
            py-1
            text-[10px]
            font-bold
            capitalize
          "
          style={statusTheme(row?.workCompletionStatus)}
        >
          {row?.workCompletionStatus || "--"}
        </button>
      ),
      width: "160px",
    },

    {
      name: "Assigned On",
      selector: (row) => row?.createdAt,
      cell: (row) => (
        <span className="text-[11px] font-semibold text-[#69727E]">
          {row?.createdAt
            ? moment(row.createdAt).format("DD-MMM-YYYY hh:mm A")
            : "--"}
        </span>
      ),
      width: "190px",
    },

    {
      name: "Updated On",
      selector: (row) => row?.updatedAt,
      cell: (row) => (
        <span className="text-[11px] font-semibold text-[#69727E]">
          {row?.updatedAt
            ? moment(row.updatedAt).format("DD-MMM-YYYY hh:mm A")
            : "--"}
        </span>
      ),
      width: "190px",
    },
  ];

  /* =========================================================
     ADDRESS COLUMNS
  ========================================================= */

  const addressColumns = [
    {
      name: "Address Name",
      selector: (row) => row?.addressName,
      cell: (row) => (
        <span className="font-semibold text-[#414853]">
          {row?.addressName || "--"}
        </span>
      ),
      width: "150px",
    },

    {
      name: "Address Line",
      selector: (row) => row?.addressLine,
      cell: (row) => (
        <span
          className="block max-w-[190px] truncate text-[#59626E]"
          title={row?.addressLine}
        >
          {row?.addressLine || "--"}
        </span>
      ),
      width: "220px",
    },

    {
      name: "Latitude",
      selector: (row) => row?.latitude,
      cell: (row) => (
        <span className="text-[#69727E]">{row?.latitude || "--"}</span>
      ),
      width: "140px",
    },

    {
      name: "Longitude",
      selector: (row) => row?.longitude,
      cell: (row) => (
        <span className="text-[#69727E]">{row?.longitude || "--"}</span>
      ),
      width: "140px",
    },

    {
      name: "Created On",
      selector: (row) => row?.createdAt,
      cell: (row) => (
        <span className="text-[#69727E]">
          {row?.createdAt
            ? moment(row.createdAt).format("DD-MMM-YYYY hh:mm A")
            : "--"}
        </span>
      ),
      width: "190px",
    },
  ];

  /* =========================================================
     APPLIANCE COLUMNS
  ========================================================= */

  const applianceColumns = [
    {
      name: "Appliance ID",
      selector: (row) => row?._id,
      cell: (row) => (
        <button
          type="button"
          onClick={() => openAppliance(row?._id)}
          className="
            max-w-[120px]
            truncate
            border-0
            bg-transparent
            p-0
            font-bold
            text-[var(--secondary-color)]
            hover:underline
          "
        >
          {row?._id || "--"}
        </button>
      ),
      width: "150px",
    },

    {
      name: "Appliance Name",
      selector: (row) => row?.deviceDetails?.deviceName,
      cell: (row) => (
        <button
          type="button"
          onClick={() => openAppliance(row?._id)}
          className="
            max-w-[130px]
            truncate
            border-0
            bg-transparent
            p-0
            text-left
            font-semibold
            text-[#414853]
            hover:text-[var(--secondary-color)]
          "
        >
          {row?.deviceDetails?.deviceName || "--"}
        </button>
      ),
      width: "170px",
    },

    {
      name: "Description",
      selector: (row) => row?.description,
      cell: (row) => (
        <button
          type="button"
          onClick={() => openAppliance(row?._id)}
          className="
            max-w-[190px]
            truncate
            border-0
            bg-transparent
            p-0
            text-left
            text-[#59626E]
          "
          title={row?.description}
        >
          {row?.description || "--"}
        </button>
      ),
      width: "220px",
    },

    {
      name: "Created On",
      selector: (row) => row?.createdAt,
      cell: (row) => (
        <span className="text-[#69727E]">
          {row?.createdAt
            ? moment(row.createdAt).format("DD-MMM-YYYY hh:mm A")
            : "--"}
        </span>
      ),
      width: "190px",
    },
  ];

  /* =========================================================
     EMPTY TABLE COMPONENT
  ========================================================= */

  const EmptyTable = ({ text = "No data available" }) => (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <img
        src={noFile}
        alt="No data"
        className="h-[120px] w-[120px] object-contain opacity-70"
      />

      <p className="mt-2 text-xs font-semibold text-[#929AA5]">{text}</p>
    </div>
  );

  /* =========================================================
     SECTION TITLE
  ========================================================= */

  const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-[15px] font-extrabold tracking-[-0.01em] text-[#282D35]">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9AA2AC]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  /* =========================================================
     USER NOT AVAILABLE
  ========================================================= */

  if (!userData) {
    return (
      <div className="mb-4 mt-6 rounded-[22px] border border-[#E6E9EE] bg-white p-10 shadow-[0_5px_25px_rgba(30,40,55,0.04)]">
        <div className="flex flex-col items-center justify-center">
          <img
            src={noFile}
            alt="No user data"
            className="h-[160px] w-[160px] object-contain"
          />

          <p className="mt-3 text-sm font-bold text-[#7D8590]">
            User details not available
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     AGGREGATED COUNTS
  ========================================================= */

  const getServiceCount = (id) =>
    userData?.serviceRequestAggregated?.find((item) => item?._id === id)
      ?.count || 0;

  const totalSRs = getServiceCount("totalSRs");
  const completedSRs = getServiceCount("completed");

  const inProgressSRs =
    getServiceCount("received") + getServiceCount("in-progress");

  const cancelledSRs = getServiceCount("canceled");
  const approvalPendingSRs = getServiceCount("pending");

  const isAdmin = userData?.role === "admin";
  const isCustomer = userData?.role === "customer";
  const isActive = userData?.userStatus === "active";

  return (
    <div className="mb-6 w-full">
      {/* =====================================================
          PROFILE HEADER
      ====================================================== */}

      <div
        className="
          relative
          mt-5
          overflow-hidden
          rounded-[24px]
          border
          border-[#E5E8ED]
          bg-white
          p-5
          shadow-[0_5px_24px_rgba(30,40,55,0.05)]
        "
      >
        {/* Decorative circle */}

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
            opacity-[0.055]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-16
            h-40
            w-40
            rounded-full
            bg-[var(--primary-color)]
            opacity-[0.025]
          "
        />

        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          {/* USER */}

          <div className="flex min-w-0 items-center gap-4">
            <div
              className="
                flex
                h-[68px]
                w-[68px]
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-[20px]
                bg-[#F3F5F8]
                ring-1
                ring-[#E5E8ED]
              "
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/9706/9706583.png"
                alt={userData?._id || "User"}
                className="h-12 w-12 object-contain"
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-[20px] font-extrabold tracking-[-0.02em] text-[#252A32]">
                  {userData?.userName || "Unknown User"}
                </h1>

                <span
                  className="rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.05em]"
                  style={statusTheme(userData?.userStatus)}
                >
                  {userData?.userStatus || "Unknown"}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#8B939E]">
                <span className="capitalize">{userData?.role || "--"}</span>

                <span className="h-1 w-1 rounded-full bg-[#C9CED5]" />

                <span>
                  Last updated{" "}
                  {userData?.updatedAt
                    ? moment(userData.updatedAt).format("DD-MMM-YYYY hh:mm A")
                    : "--"}
                </span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          {!isAdmin && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* CHAT */}

              <button
                type="button"
                onClick={toggleDrawer}
                title="Open chat"
                className="
                  inline-flex
                  h-[42px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#E2E6EC]
                  bg-[#F8F9FB]
                  px-3
                  text-[11px]
                  font-bold
                  text-[#4C5561]
                  shadow-sm
                  transition-all
                  duration-200
                  hover:border-[#D5DAE1]
                  hover:bg-[#F0F2F5]
                  hover:text-[#252A32]
                  focus:outline-none
                "
              >
                <IoChatbubbleEllipsesOutline size={18} />

                <span className="hidden sm:block">Chat</span>
              </button>

              {/* DELETE */}

              <AlertDialog
                onAgree={() =>
                  AdminServices.deleteUser(userData?._id).then((res) => {
                    if (res) {
                      history.push(
                        `/${
                          pathname?.split("/")[1] === "user"
                            ? "users"
                            : pathname?.split("/")[1]
                        }`,
                      );
                    }
                  })
                }
                dialogTitle={"Delete User?"}
                dialogDetails={
                  "Are you sure you want to delete this user? This action is permanent and cannot be undone."
                }
                AgreeButtonValue="Yes, Delete!"
                CancelButton="Cancel"
                triggerButton={(onClickFunc) => (
                  <button
                    type="button"
                    onClick={onClickFunc}
                    className="
                      inline-flex
                      h-[42px]
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-[#F1D8D8]
                      bg-[#FFF7F7]
                      px-3
                      text-[11px]
                      font-bold
                      text-[#E04444]
                      transition-all
                      duration-200
                      hover:border-[#E04444]
                      hover:bg-[#E04444]
                      hover:text-white
                      focus:outline-none
                    "
                  >
                    <FaTrashCan size={15} />

                    <span className="hidden sm:block">Delete User</span>
                  </button>
                )}
              />

              {/* BLOCK / UNBLOCK */}

              <AlertDialog
                onAgree={() => updateUserStatus()}
                dialogTitle={isActive ? "Block User?" : "Un-Block User?"}
                dialogDetails={`Are you sure you want to ${
                  isActive ? "block" : "unblock"
                } this user? This action is reversible.`}
                AgreeButtonValue={`Yes, ${isActive ? "Block" : "UnBlock"}!`}
                CancelButton="Cancel"
                triggerButton={(onClickFunc) => (
                  <button
                    type="button"
                    onClick={onClickFunc}
                    className="
                      inline-flex
                      h-[42px]
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#252A32]
                      px-3.5
                      text-[11px]
                      font-bold
                      text-white
                      shadow-[0_5px_15px_rgba(30,35,45,0.12)]
                      transition-all
                      duration-200
                      hover:bg-[#111318]
                      focus:outline-none
                    "
                  >
                    {isActive ? (
                      <FaUserLargeSlash size={16} />
                    ) : (
                      <FaUser size={16} />
                    )}

                    <span className="hidden sm:block">
                      {isActive ? "Block User" : "Un-Block User"}
                    </span>
                  </button>
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <Tiles
          icon={<FaRegCalendarCheck />}
          title="Joined On"
          value={
            userData?.createdAt
              ? moment(userData.createdAt).format("DD-MMM-YYYY")
              : "--"
          }
        />

        <Tiles icon={<FaRegChartBar />} title="Total SRs" value={totalSRs} />

        <Tiles
          icon={<IoMdDoneAll />}
          title="Completed SRs"
          value={completedSRs}
        />

        <Tiles
          icon={<AiOutlineExclamationCircle />}
          title="In Progress SRs"
          value={inProgressSRs}
        />

        <Tiles
          icon={
            isCustomer ? <MdCancelPresentation /> : <MdOutlinePendingActions />
          }
          title={isCustomer ? "Cancelled SRs" : "Approval Pending SRs"}
          value={isCustomer ? cancelledSRs : approvalPendingSRs}
        />

        <Tiles
          icon={
            userData?.userStatus === "inactive" ? (
              <FaUserLargeSlash />
            ) : (
              <FaUser />
            )
          }
          title="User Status"
          value={
            <div
              className="rounded-full px-2.5 py-1 text-center text-[10px] font-bold capitalize"
              style={statusTheme(userData?.userStatus)}
            >
              {userData?.userStatus || "--"}
            </div>
          }
        />

        <Tiles
          icon={<MdWork />}
          title="Is Practicing Eligible"
          value={
            <div
              className="rounded-full px-2.5 py-1 text-center text-[10px] font-bold capitalize"
              style={statusTheme(userData?.isPracticingEligible)}
            >
              {userData?.isPracticingEligible || "--"}
            </div>
          }
        />
      </div>

      {/* =====================================================
          BASIC DETAILS
      ====================================================== */}

      <div
        className="
          mt-5
          rounded-[22px]
          border
          border-[#E5E8ED]
          bg-white
          p-5
          shadow-[0_4px_18px_rgba(30,40,55,0.035)]
        "
      >
        <SectionTitle
          title="Basic Details"
          subtitle="Personal & contact information"
        />

        <div className="grid grid-cols-1 gap-3 border-t border-[#EEF0F3] pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <DetailItem
            label="First Name"
            value={userData?.userName?.split(" ")[0]}
          />

          <DetailItem
            label="Last Name"
            value={userData?.userName?.split(" ").slice(1).join(" ")}
          />

          <DetailItem
            label="Phone"
            value={
              userData?.phoneNumber
                ? `${userData?.countryCode || ""}-${userData.phoneNumber}`
                : "--"
            }
          />

          <DetailItem label="Email" value={userData?.email} breakWord />

          <DetailItem
            label="Default Address Name"
            value={userData?.defaultAddress?.addressName}
          />

          <DetailItem
            label="Default Address"
            value={userData?.defaultAddress?.addressLine}
            breakWord
          />
        </div>
      </div>

      {/* =====================================================
          DOCUMENTS
      ====================================================== */}

      {userData?.documents?.length > 0 && (
        <div
          className="
            mt-5
            rounded-[22px]
            border
            border-[#E5E8ED]
            bg-white
            p-5
            shadow-[0_4px_18px_rgba(30,40,55,0.035)]
          "
        >
          <SectionTitle
            title="User Documents"
            subtitle={`${userData.documents.length} document${
              userData.documents.length > 1 ? "s" : ""
            } available`}
          />

          <div className="grid grid-cols-1 gap-3 border-t border-[#EEF0F3] pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {userData.documents.map((data, index) => (
              <div
                key={data?._id || index}
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  rounded-xl
                  border
                  border-[#E7EAF0]
                  bg-[#FAFBFC]
                  p-3
                  transition-all
                  duration-200
                  hover:border-[#DDE1E7]
                  hover:bg-[#F5F6F8]
                "
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-[#343B45]">
                    {data?.documentName || "Document"}
                  </p>

                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#A0A7B0]">
                    Document file
                  </p>
                </div>

                <a
                  href={data?.documentUrl}
                  download={`${data?.documentName || "document"}.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-[#E1E5EA]
                    bg-white
                    text-[var(--primary-color)]
                    no-underline
                    shadow-sm
                    transition-all
                    duration-200
                    hover:border-[var(--primary-color)]
                    hover:bg-[var(--primary-color)]
                    hover:text-white
                  "
                  title="Download document"
                >
                  <FaDownload size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================
          LOCATION + ADDRESSES
      ====================================================== */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* LOCATION */}

        <div
          className="
            min-w-0
            overflow-hidden
            rounded-[22px]
            border
            border-[#E5E8ED]
            bg-white
            p-5
            shadow-[0_4px_18px_rgba(30,40,55,0.035)]
          "
        >
          <SectionTitle
            title="User Location"
            subtitle="Default address location"
          />

          <div className="overflow-hidden rounded-[16px] border border-[#E8EBF0] bg-[#F8F9FB]">
            {userData?.defaultAddress ? (
              <GoogleMapComponent
                width="100%"
                center={{
                  lat: Number(userData?.defaultAddress?.latitude),
                  lng: Number(userData?.defaultAddress?.longitude),
                }}
              />
            ) : (
              <EmptyTable text="Location not available" />
            )}
          </div>
        </div>

        {/* ADDRESSES */}

        <div
          className="
            min-w-0
            overflow-hidden
            rounded-[22px]
            border
            border-[#E5E8ED]
            bg-white
            p-5
            shadow-[0_4px_18px_rgba(30,40,55,0.035)]
          "
        >
          <SectionTitle title="Addresses" subtitle="Saved user addresses" />

          <div className="overflow-hidden rounded-[14px] border border-[#E8EBF0]">
            <DataTable
              columns={addressColumns}
              data={userData?.address || []}
              noDataComponent={<EmptyTable text="No addresses found" />}
              fixedHeader
              fixedHeaderScrollHeight="250px"
              customStyles={tableStyles}
              highlightOnHover
              responsive
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          SERVICE REQUESTS + APPLIANCES
      ====================================================== */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* SERVICE REQUESTS */}

        <div
          className="
            min-w-0
            overflow-hidden
            rounded-[22px]
            border
            border-[#E5E8ED]
            bg-white
            p-5
            shadow-[0_4px_18px_rgba(30,40,55,0.035)]
          "
        >
          <SectionTitle
            title="Service Requests"
            subtitle={`${userData?.serviceRequests?.length || 0} requests`}
          />

          <div className="overflow-hidden rounded-[14px] border border-[#E8EBF0]">
            <DataTable
              columns={
                isCustomer
                  ? serviceRequestsColumns
                  : serviceRequestsApprovalColumns
              }
              data={userData?.serviceRequests || []}
              onRowClicked={(row) =>
                openServiceRequest(isCustomer ? row?._id : row?.serviceRequest)
              }
              noDataComponent={<EmptyTable text="No service requests found" />}
              fixedHeader
              fixedHeaderScrollHeight="250px"
              customStyles={tableStyles}
              highlightOnHover
              pointerOnHover
              responsive
            />
          </div>
        </div>

        {/* APPLIANCES */}

        <div
          className="
            min-w-0
            overflow-hidden
            rounded-[22px]
            border
            border-[#E5E8ED]
            bg-white
            p-5
            shadow-[0_4px_18px_rgba(30,40,55,0.035)]
          "
        >
          <SectionTitle
            title="Appliances"
            subtitle={`${userData?.appliances?.length || 0} appliances`}
          />

          <div className="overflow-hidden rounded-[14px] border border-[#E8EBF0]">
            <DataTable
              columns={applianceColumns}
              data={userData?.appliances || []}
              onRowClicked={(row) => openAppliance(row?._id)}
              noDataComponent={<EmptyTable text="No appliances found" />}
              fixedHeader
              fixedHeaderScrollHeight="250px"
              customStyles={tableStyles}
              highlightOnHover
              pointerOnHover
              responsive
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          CHAT DRAWER
      ====================================================== */}

      <MainDrawer noFlex={true} windowDimensionHighWidth="575px">
        <UserChatDrawer toggleDrawer={toggleDrawer} userData={userData} />
      </MainDrawer>
    </div>
  );
};

/* =============================================================
   DETAIL ITEM
============================================================= */

const DetailItem = ({ label, value, breakWord = false }) => {
  return (
    <div
      className="
        min-w-0
        rounded-xl
        border
        border-[#EEF0F3]
        bg-[#FAFBFC]
        px-3
        py-3
      "
    >
      <p className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#A0A7B0]">
        {label}
      </p>

      <p
        className={`
          mt-1.5
          min-h-[18px]
          text-[11px]
          font-bold
          text-[#343B45]
          ${breakWord ? "break-all" : "truncate"}
        `}
        title={value || "--"}
      >
        {value || "--"}
      </p>
    </div>
  );
};

export default UserDetailsContainer;

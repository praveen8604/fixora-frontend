// import { getServiceRequest } from "@/reduxStore/action/serviceRequestAction";
// import {
//   getRidersList,
//   getTechniciansList,
// } from "@/reduxStore/action/userAction";
// import AdminServices from "@/services/AdminServices";
// import { getQueryParam } from "@/utils/getQueryParam";
// import { notifyError, notifySuccess } from "@/utils/toast";
// import moment from "moment";
// import React, { useContext, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import MainDrawer from "@/components/drawer/MainDrawer";
// import { SidebarContext } from "@/context/SidebarContext";
// import CommentsDrawer from "@/components/drawer/CommentsDrawer";
// import { DecryptData, encode } from "@/utils/DecryptData";
// import LayoutCard from "@/components/common/LayoutCard";
// import { MdAssignmentTurnedIn, MdAssignment } from "react-icons/md";
// import { IoChatboxEllipsesOutline } from "react-icons/io5";
// import { FaExternalLinkAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import MuiDrawer from "@/components/drawer/MuiDrawer";
// import { TICKET_STATUS } from "@/utils/appConstatnts";
// import QuotationDrawer from "@/components/drawer/QuotationDrawer";
// import GoogleMapComponent from "@/components/common/GoogleMapComponent";
// import { statusTheme } from "@/utils/getStatusTheme";
// import ServiceRequestServices from "@/services/ServiceRequestServices";

// const TicketOverview = () => {
//   const { toggleDrawer } = useContext(SidebarContext);
//   const serviceRequestId = getQueryParam("sr_id");
//   const dispatch = useDispatch();
//   const { serviceRequest, loading } = useSelector(
//     (state) => state.serviceRequestState,
//   );
//   const { riders, technicians } = useSelector((state) => state.userState);
//   const [assignRiderModal, setAssignRiderModal] = useState(false);
//   const [assignTechnicianModal, setAssignTechnicianModal] = useState(false);
//   const [quotationModal, setQuotationModal] = useState(false);
//   const [quotationData, setQuotationData] = useState({});
//   const [serviceCenterAddresses, setServiceCenterAddresses] = useState([]);
//   const [riderValues, setRiderValues] = useState({
//     riderId: "",
//     addressId: "",
//   });
//   const [technicianValues, setTechnicianValues] = useState({
//     technicianId: "",
//   });
//   // Image preview modal state
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   console.log("serviceRequest: ", serviceRequest);
//   const handleAssignRider = () => {
//     AdminServices.assignServiceAddress({
//       addressId: riderValues?.addressId,
//       serviceRequestId,
//     })
//       .then((res) => {
//         if (res) {
//           AdminServices.assignRider({
//             riderId: riderValues.riderId,
//             serviceRequestId,
//           })
//             .then((res) => {
//               if (res) {
//                 notifySuccess("Rider assigned successfully!");
//                 setAssignRiderModal(false);
//                 dispatch(getServiceRequest(serviceRequestId));
//               }
//             })
//             .catch((err) => {
//               const decryptedData = DecryptData(err?.response?.data);
//               notifyError(decryptedData?.error?.message);
//             });
//         }
//       })
//       .catch((err) => {
//         const decryptedData = DecryptData(err?.response?.data);
//         notifyError(decryptedData?.error?.message);
//       });
//   };
//   const handleAssignTechnician = () => {
//     AdminServices.assignTechnician({ ...technicianValues, serviceRequestId })
//       .then((res) => {
//         if (res) {
//           notifySuccess("Technician assigned successfully!");
//           setAssignTechnicianModal(false);
//           dispatch(getServiceRequest(serviceRequestId));
//         }
//       })
//       .catch((err) => {
//         const decryptedData = DecryptData(err?.response?.data);
//         notifyError(decryptedData?.error?.message);
//       });
//   };
//   const getQuotation = () => {
//     ServiceRequestServices.getQuotation(serviceRequestId)
//       .then((res) => {
//         if (res) {
//           const decodedata = DecryptData(res);
//           console.log("Decrypted Data:", decodedata);
//           setQuotationData(decodedata?.data?.quotation);
//         }
//       })
//       .catch((err) => {
//         console.log("Error:", err);
//       });
//   };
//   const getServiceCenterAddress = () => {
//     ServiceRequestServices.getServiceCenterAddress()
//       .then((res) => {
//         if (res) {
//           const decodedata = DecryptData(res);
//           console.log("Decrypted Address Data: ", decodedata?.data?.addresses);
//           setServiceCenterAddresses(decodedata?.data?.addresses);
//         }
//       })
//       .catch((err) => {
//         console.log("Error:", err);
//       });
//   };

//   useEffect(() => {
//     dispatch(getServiceRequest(serviceRequestId));
//     getQuotation();
//     getServiceCenterAddress();
//   }, [serviceRequestId]);

//   // Function to open image preview modal
//   const openImagePreview = (imageUrl) => {
//     setPreviewImage(imageUrl);
//     setIsPreviewOpen(true);
//   };

//   // Function to close image preview modal
//   const closeImagePreview = () => {
//     setIsPreviewOpen(false);
//     setPreviewImage("");
//   };
//   const encodedAppData = encode({
//     ...serviceRequest?.model,
//     model: serviceRequest?.model,
//   });
//   console.log("SAS: ", {
//     ...serviceRequest?.model,
//     model: serviceRequest?.model,
//   });

//   return (
//     <div className="text-[var(--secondary-color)] my-5">
//       <div className="mb-5">
//         <h1 className="text-xl font-bold text-[var(--secondary-color)]">
//           Service Request Details
//         </h1>
//         <p className="text-xs opacity-50 mt-1">
//           View and manage complete service request information
//         </p>
//       </div>
//       <LayoutCard
//         heading={"Service Request"}
//         gridColCount={1}
//         gridColCountxl={6}
//         gridColCountmd={2}
//       >
//         <div className="font-bold text-xs bg-[var(--secondary-light-2-color)] rounded-lg p-3">
//           <div className="mb-1 opacity-50 text-[10px] uppercase tracking-wide">
//             Service Request ID
//           </div>

//           <div className="text-[var(--primary-elite-color)] break-all">
//             {serviceRequest?._id || "--"}
//           </div>
//         </div>
//         <div className="font-bold text-xs bg-[var(--secondary-light-2-color)] rounded-lg p-3">
//           <div className="mb-1 opacity-50 text-[10px] uppercase tracking-wide">
//             Appliance Name
//           </div>

//           <div className="flex items-center gap-2">
//             <div>{serviceRequest?.model?.modelName ?? "--"}</div>

//             <Link
//               to={`/appliance/overview?appData=${encodeURIComponent(encodedAppData)}`}
//             >
//               <FaExternalLinkAlt className="text-[10px] cursor-pointer hover:text-[var(--primary-elite-color)]" />
//             </Link>
//           </div>
//         </div>
//         <div className="font-bold text-xs bg-[var(--secondary-light-2-color)] rounded-lg p-3">
//           <div className="mb-1 opacity-50 text-[10px] uppercase tracking-wide">
//             Service Mode
//           </div>

//           <div
//             className="px-3 py-1.5 rounded-full capitalize font-bold text-[10px] w-fit"
//             style={statusTheme(serviceRequest?.serviceMode)}
//           >
//             {serviceRequest?.serviceMode || "--"}
//           </div>
//         </div>
//         <div className="font-bold text-xs bg-[var(--secondary-light-2-color)] rounded-lg p-3">
//           <div className="mb-1 opacity-50 text-[10px] uppercase tracking-wide">
//             Status
//           </div>

//           <div
//             className={`px-3 py-1.5 text-[10px] text-[var(--primary-color)] rounded-full capitalize font-bold w-fit ${statusTheme(
//               serviceRequest?.ticketStatus,
//               true,
//             )}`}
//           >
//             {serviceRequest?.ticketStatus || "--"}
//           </div>
//         </div>
//         <div className="font-bold text-xs bg-[var(--secondary-light-2-color)] rounded-lg p-3">
//           <div className="mb-1 opacity-50 text-[10px] uppercase tracking-wide">
//             Raised On
//           </div>

//           <div>
//             {serviceRequest?.createdAt
//               ? moment(serviceRequest.createdAt).format("DD-MMM-YYYY hh:mm A")
//               : "--"}
//           </div>
//         </div>
//         <div className="font-bold text-xs bg-[var(--secondary-light-2-color)] rounded-lg p-3">
//           <div className="mb-1 opacity-50 text-[10px] uppercase tracking-wide">
//             Last Updated On
//           </div>

//           <div>
//             {serviceRequest?.updatedAt
//               ? moment(serviceRequest.updatedAt).format("DD-MMM-YYYY hh:mm A")
//               : "--"}
//           </div>
//         </div>
//       </LayoutCard>
//       <LayoutCard heading={"Problem Details"} gridColCount={1}>
//         <div className="font-bold text-xs bg-[var(--secondary-light-2-color)] rounded-lg p-4">
//           <div className="mb-2 opacity-50 text-[10px] uppercase tracking-wide">
//             Problem Description
//           </div>

//           <div className="text-sm font-medium leading-6 break-words">
//             {serviceRequest?.problemDescription || "--"}
//           </div>
//         </div>
//         {serviceRequest?.attachments?.length > 0 && (
//           <div className="mt-2">
//             <div className="mb-3 opacity-50 text-[10px] uppercase tracking-wide">
//               Attachments
//             </div>

//             <div className="flex flex-wrap items-center gap-4">
//               {serviceRequest?.attachments?.map((attachment, index) => (
//                 <div
//                   key={attachment || index}
//                   className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden border border-gray-200 bg-[var(--secondary-light-2-color)] cursor-pointer group"
//                   onClick={() => openImagePreview(attachment)}
//                 >
//                   <img
//                     src={attachment}
//                     alt={`Attachment ${index + 1}`}
//                     className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         {serviceRequest?.ticketStatus !==
//           TICKET_STATUS.SERVICE_REQUEST_CANCELED &&
//           serviceRequest?.ticketStatus !==
//             TICKET_STATUS.SERVICE_REQUEST_CLOSED && (
//             <div className="flex items-center gap-3">
//               {serviceRequest?.isAssignRiderEnabled === true && (
//                 <button
//                   disabled={serviceRequest?.rider?._id || loading}
//                   className="flex items-center gap-2 py-2 px-3 text-[13px] bg-[#e4137c] text-[var(--primary-color)] mt-4 rounded-md disabled:opacity-40"
//                   onClick={() => {
//                     dispatch(getRidersList());
//                     setAssignRiderModal(true);
//                   }}
//                 >
//                   <MdAssignmentTurnedIn size={18} />
//                   <div>
//                     {loading || serviceRequest?.rider?._id
//                       ? "Rider Assigned"
//                       : "Assign Rider"}
//                   </div>
//                 </button>
//               )}
//               {serviceRequest?.isAssignTechnicianEnabled === true && (
//                 <button
//                   disabled={serviceRequest?.technician?._id || loading}
//                   className="flex items-center gap-2 py-2 px-3 text-[13px] bg-[#e4137c] text-[var(--primary-color)] mt-4 rounded-md disabled:opacity-40"
//                   onClick={() => {
//                     dispatch(getTechniciansList());
//                     setAssignTechnicianModal(true);
//                   }}
//                 >
//                   <MdAssignmentTurnedIn size={18} />
//                   <div>
//                     {loading || serviceRequest?.technician?._id
//                       ? "Technician Assigned"
//                       : "Assign Technician"}
//                   </div>
//                 </button>
//               )}
//               {serviceRequest?.isQuotationEnabled && (
//                 <button
//                   disabled={loading}
//                   className="flex items-center gap-2 text-[13px] py-2 px-3 bg-[#2b318c]  text-[var(--primary-color)] mt-4 rounded-md disabled:opacity-40"
//                   onClick={() => {
//                     setQuotationModal(true);
//                   }}
//                 >
//                   <MdAssignment size={18} />
//                   <div>Quotation</div>
//                 </button>
//               )}
//               {/* {serviceRequest?.isQuotationEnabled && ( */}
//               <button
//                 disabled={loading}
//                 className="flex items-center gap-2 py-2 px-3 text-[13px] border-2 border-[var(--secondary-elite-color)] text-[var(--secondary-elite-color)] mt-4 rounded-md disabled:opacity-40"
//                 onClick={toggleDrawer}
//               >
//                 <IoChatboxEllipsesOutline size={17} className="scale-125" />
//               </button>
//               {/* )} */}
//             </div>
//           )}
//       </LayoutCard>
//       <LayoutCard
//         heading={"Customer Details"}
//         gridColCount={1}
//         gridColCountxl={6}
//         gridColCountmd={2}
//         useFlex={false}
//       >
//         <div className="font-bold text-xs bg-[var(--secondary-light-2-color)] rounded-lg p-3 min-w-0">
//           <div className="mb-1 opacity-50 text-[10px] uppercase tracking-wide">
//             Customer Name
//           </div>

//           <div className="flex items-center gap-2 min-w-0">
//             <div className="truncate">
//               {serviceRequest?.customer?.userName || "--"}
//             </div>

//             {serviceRequest?.customer?._id && (
//               <Link
//                 to={`/users/customer/details?userId=${serviceRequest?.customer?._id}`}
//                 className="shrink-0"
//               >
//                 <FaExternalLinkAlt className="text-[10px] hover:text-[var(--primary-elite-color)]" />
//               </Link>
//             )}
//           </div>
//         </div>
//         <div className="font-bold text-xs bg-[var(--secondary-light-2-color)] rounded-lg p-3 min-w-0">
//           <div className="mb-1 opacity-50 text-[10px] uppercase tracking-wide">
//             Customer Phone Number
//           </div>

//           <div className="break-words">
//             {serviceRequest?.customer?.countryCode || "--"}{" "}
//             {serviceRequest?.customer?.phoneNumber || "--"}
//           </div>
//         </div>
//         <div className="font-bold text-xs bg-[var(--secondary-light-2-color)] rounded-lg p-3 min-w-0">
//           <div className="mb-1 opacity-50 text-[10px] uppercase tracking-wide">
//             Customer Email
//           </div>

//           <div className="break-all">
//             {serviceRequest?.customer?.email || "--"}
//           </div>
//         </div>
//         <div className="font-bold text-xs bg-[var(--secondary-light-2-color)] rounded-lg p-3 min-w-0">
//           <div className="mb-1 opacity-50 text-[10px] uppercase tracking-wide">
//             Joined On
//           </div>

//           <div>
//             {serviceRequest?.customer?.createdAt
//               ? moment(serviceRequest.customer.createdAt).format(
//                   "DD-MMM-YYYY hh:mm A",
//                 )
//               : "--"}
//           </div>
//         </div>
//       </LayoutCard>
//       {serviceRequest?.rider?.userName && (
//         <LayoutCard
//           heading={"Rider Details"}
//           gridColCount={1}
//           gridColCountxl={6}
//           gridColCountmd={2}
//           useFlex={false}
//         >
//           <div className="font-bold text-xs">
//             <div className="mb-1 opacity-50 text-[11.5px]">Rider Name</div>
//             <div className="flex items-center gap-2">
//               <div>{serviceRequest?.rider?.userName}</div>
//               <Link
//                 to={`/users/rider/details?userId=${serviceRequest?.rider?._id}`}
//               >
//                 <FaExternalLinkAlt
//                   className={
//                     "cursor-pointer hover:text-[var(--primary-elite-color)]"
//                   }
//                 />
//               </Link>
//             </div>
//           </div>
//           <div className="font-bold text-xs">
//             <div className="mb-1 opacity-50 text-[11.5px]">
//               Rider Phone Number
//             </div>
//             <div>
//               {serviceRequest?.rider?.countryCode}{" "}
//               {serviceRequest?.rider?.phoneNumber}
//             </div>
//           </div>
//           <div className="font-bold text-xs">
//             <div className="mb-1 opacity-50 text-[11.5px]">Rider Email</div>
//             <div>{serviceRequest?.rider?.email}</div>
//           </div>
//           <div className="font-bold text-xs">
//             <div className="mb-1 opacity-50 text-[11.5px]">Joined On</div>
//             <div>
//               {moment(serviceRequest?.rider?.createdAt).format(
//                 "DD-MMM-YYYY hh:mm A",
//               )}
//             </div>
//           </div>
//         </LayoutCard>
//       )}

//       {serviceRequest?.technician?.userName && (
//         <LayoutCard
//           heading={"Technician Details"}
//           gridColCount={6}
//           useFlex={false}
//         >
//           <div className="font-bold text-xs">
//             <div className="mb-1 opacity-50 text-[11.5px]">Technician Name</div>
//             <div className="flex items-center gap-2">
//               <div>{serviceRequest?.technician?.userName}</div>
//               <Link
//                 to={`/users/technician/details?userId=${serviceRequest?.technician?._id}`}
//               >
//                 <FaExternalLinkAlt
//                   className={
//                     "cursor-pointer hover:text-[var(--primary-elite-color)]"
//                   }
//                 />
//               </Link>
//             </div>
//           </div>
//           <div className="font-bold text-xs">
//             <div className="mb-1 opacity-50 text-[11.5px]">
//               Technician Phone Number
//             </div>
//             <div>
//               {serviceRequest?.technician?.countryCode}{" "}
//               {serviceRequest?.technician?.phoneNumber}
//             </div>
//           </div>
//           <div className="font-bold text-xs">
//             <div className="mb-1 opacity-50 text-[11.5px]">
//               Technician Email
//             </div>
//             <div>{serviceRequest?.technician?.email}</div>
//           </div>
//           <div className="font-bold text-xs">
//             <div className="mb-1 opacity-50 text-[11.5px]">Joined On</div>
//             <div>
//               {moment(serviceRequest?.technician?.createdAt).format(
//                 "DD-MMM-YYYY hh:mm A",
//               )}
//             </div>
//           </div>
//         </LayoutCard>
//       )}

//       <LayoutCard heading={"Customer Location"} gridColCount={1}>
//         <div className="flex flex-col md:flex-row gap-5">
//           <div className="w-full md:w-1/2">
//             {serviceRequest?.address && (
//               <GoogleMapComponent
//                 width="100%"
//                 center={{
//                   lat: Number(serviceRequest?.address?.latitude),
//                   lng: Number(serviceRequest?.address?.longitude),
//                 }}
//               />
//             )}
//           </div>
//           <div className="w-full md:w-1/2">
//             <div className="font-bold text-xs">
//               <div className="mb-1 opacity-50 text-[11.5px]">Address</div>
//               <div>{serviceRequest?.address?.addressLine}</div>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//               <div className="font-bold text-xs">
//                 <div className="mb-1 opacity-50 text-[11.5px]">Latitude</div>
//                 <div>{serviceRequest?.address?.latitude}</div>
//               </div>
//               <div className="font-bold text-xs">
//                 <div className="mb-1 opacity-50 text-[11.5px]">Longitude</div>
//                 <div>{serviceRequest?.address?.longitude}</div>
//               </div>
//               <div className="font-bold text-xs">
//                 <div className="mb-1 opacity-50 text-[11.5px]">Created On</div>
//                 <div>
//                   {moment(serviceRequest?.address?.createdAt).format(
//                     "DD-MMM-YYYY hh:mm A",
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </LayoutCard>
//       {serviceRequest?.serviceCenterAddress && (
//         <LayoutCard heading={"Service Center Location"} gridColCount={1}>
//           <div className="flex gap-5">
//             <div className="w-1/2">
//               {serviceRequest?.serviceCenterAddress && (
//                 <GoogleMapComponent
//                   width="100%"
//                   center={{
//                     lat: Number(serviceRequest?.serviceCenterAddress?.latitude),
//                     lng: Number(
//                       serviceRequest?.serviceCenterAddress?.longitude,
//                     ),
//                   }}
//                 />
//               )}
//             </div>
//             <div className="w-1/2">
//               <div className="font-bold text-xs">
//                 <div className="mb-1 opacity-50 text-[11.5px]">Address</div>
//                 <div>{serviceRequest?.serviceCenterAddress?.addressLine}</div>
//               </div>
//               <div className="grid md:grid-cols-2 grid-cols-2 gap-4 mt-4">
//                 <div className="font-bold text-xs">
//                   <div className="mb-1 opacity-50 text-[11.5px]">Latitude</div>
//                   <div>{serviceRequest?.serviceCenterAddress?.latitude}</div>
//                 </div>
//                 <div className="font-bold text-xs">
//                   <div className="mb-1 opacity-50 text-[11.5px]">Longitude</div>
//                   <div>{serviceRequest?.serviceCenterAddress?.longitude}</div>
//                 </div>
//                 <div className="font-bold text-xs">
//                   <div className="mb-1 opacity-50 text-[11.5px]">
//                     Created On
//                   </div>
//                   <div>
//                     {moment(serviceRequest?.address?.createdAt).format(
//                       "DD-MMM-YYYY hh:mm A",
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </LayoutCard>
//       )}
//       <MuiDrawer
//         open={quotationModal}
//         onClose={() => setQuotationModal(false)}
//         drawerWidth="575px"
//       >
//         <QuotationDrawer
//           toggleDrawer={toggleDrawer}
//           quotationData={quotationData}
//           getQuotation={getQuotation}
//         />
//       </MuiDrawer>
//       <MainDrawer noFlex={true} windowDimensionHighWidth="575px">
//         <CommentsDrawer
//           serviceRequest={serviceRequest}
//           toggleDrawer={toggleDrawer}
//           quotationData={quotationData}
//           getQuotation={getQuotation}
//         />
//       </MainDrawer>
//       <MuiDrawer
//         open={assignRiderModal}
//         onClose={() => setAssignRiderModal(false)}
//         drawerWidth="400px"
//       >
//         <div className="p-4 bg-[var(--secondary-light-2-color)] h-[var(--doc-height)]">
//           <div className="font-bold text-md flex items-center gap-2 text-[var(--primary-elite-color)]">
//             <MdAssignmentTurnedIn size={22} /> Assign Rider
//           </div>
//           <div className="flex flex-col text-sm mt-8">
//             <label className="font-bold">Select a Rider</label>
//             <select
//               className="w-full border mt-1  outline-none py-2 px-2 rounded-md"
//               onClick={(e) =>
//                 setRiderValues({
//                   riderId: e.target.value,
//                   addressId: riderValues.addressId,
//                 })
//               }
//             >
//               {riders?.map((data) => {
//                 return <option value={data?._id}>{data?.userName}</option>;
//               })}
//             </select>
//           </div>
//           <div className="flex flex-col text-sm mt-4">
//             <label className="font-bold">Select a Zone</label>
//             <select
//               className="w-full border mt-1  outline-none py-2 px-2 rounded-md"
//               onClick={(e) =>
//                 setRiderValues({
//                   riderId: riderValues.riderId,
//                   addressId: e.target.value,
//                 })
//               }
//             >
//               {serviceCenterAddresses?.map((data) => {
//                 return <option value={data?._id}>{data?.addressName}</option>;
//               })}
//             </select>
//           </div>
//           <button
//             className="mt-4 w-full bg-[#2b318c] h-10 text-[var(--primary-color)] rounded-md text-sm"
//             onClick={() => handleAssignRider()}
//           >
//             Assign
//           </button>
//         </div>
//       </MuiDrawer>
//       <MuiDrawer
//         open={assignTechnicianModal}
//         onClose={() => setAssignTechnicianModal(false)}
//         drawerWidth="400px"
//       >
//         <div className="p-4 bg-[var(--secondary-light-2-color)] h-[var(--doc-height)]">
//           <div className="font-bold text-md flex items-center gap-2 text-[var(--primary-elite-color)]">
//             <MdAssignmentTurnedIn size={22} /> Assign Technician
//           </div>
//           <div className="flex flex-col text-sm mt-8">
//             <label className="font-bold">Select a Technician</label>
//             <select
//               className="w-full border mt-1  outline-none py-2 px-2 rounded-md"
//               onChange={(e) => {
//                 setTechnicianValues({
//                   technicianId: e?.target?.value,
//                 });
//               }}
//             >
//               {[{ userName: "Select Technician", _id: 1 }, ...technicians]?.map(
//                 (data) => {
//                   return <option value={data?._id}>{data?.userName}</option>;
//                 },
//               )}
//             </select>
//           </div>
//           <button
//             className="mt-4 w-full bg-[#2b318c] h-10 text-[var(--primary-color)] rounded-md text-sm"
//             onClick={() => handleAssignTechnician()}
//           >
//             Assign
//           </button>
//         </div>
//       </MuiDrawer>

//       {isPreviewOpen && (
//         <div
//           className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
//           onClick={closeImagePreview}
//         >
//           <img
//             src={previewImage}
//             alt="Full Preview"
//             className="max-h-full max-w-full object-contain"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default TicketOverview;

import { getServiceRequest } from "@/reduxStore/action/serviceRequestAction";
import {
  getRidersList,
  getTechniciansList,
} from "@/reduxStore/action/userAction";
import AdminServices from "@/services/AdminServices";
import { getQueryParam } from "@/utils/getQueryParam";
import { notifyError, notifySuccess } from "@/utils/toast";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import MainDrawer from "@/components/drawer/MainDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import CommentsDrawer from "@/components/drawer/CommentsDrawer";
import { DecryptData, encode } from "@/utils/DecryptData";
import LayoutCard from "@/components/common/LayoutCard";

import { MdAssignmentTurnedIn, MdAssignment } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

import MuiDrawer from "@/components/drawer/MuiDrawer";
import { TICKET_STATUS } from "@/utils/appConstatnts";
import QuotationDrawer from "@/components/drawer/QuotationDrawer";
import GoogleMapComponent from "@/components/common/GoogleMapComponent";
import { statusTheme } from "@/utils/getStatusTheme";
import ServiceRequestServices from "@/services/ServiceRequestServices";

const TicketOverview = () => {
  const { toggleDrawer } = useContext(SidebarContext);

  const serviceRequestId = getQueryParam("sr_id");

  const dispatch = useDispatch();

  const { serviceRequest, loading } = useSelector(
    (state) => state.serviceRequestState,
  );

  const { riders, technicians } = useSelector((state) => state.userState);

  const [assignRiderModal, setAssignRiderModal] = useState(false);

  const [assignTechnicianModal, setAssignTechnicianModal] = useState(false);

  const [quotationModal, setQuotationModal] = useState(false);

  const [quotationData, setQuotationData] = useState({});

  const [serviceCenterAddresses, setServiceCenterAddresses] = useState([]);

  const [riderValues, setRiderValues] = useState({
    riderId: "",
    addressId: "",
  });

  const [technicianValues, setTechnicianValues] = useState({
    technicianId: "",
  });

  // Image preview modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [previewImage, setPreviewImage] = useState("");

  console.log("serviceRequest: ", serviceRequest);

  /* =========================================================
     ASSIGN RIDER
  ========================================================= */

  const handleAssignRider = () => {
    AdminServices.assignServiceAddress({
      addressId: riderValues?.addressId,
      serviceRequestId,
    })
      .then((res) => {
        if (res) {
          AdminServices.assignRider({
            riderId: riderValues.riderId,
            serviceRequestId,
          })
            .then((res) => {
              if (res) {
                notifySuccess("Rider assigned successfully!");

                setAssignRiderModal(false);

                dispatch(getServiceRequest(serviceRequestId));
              }
            })
            .catch((err) => {
              const decryptedData = DecryptData(err?.response?.data);

              notifyError(decryptedData?.error?.message);
            });
        }
      })
      .catch((err) => {
        const decryptedData = DecryptData(err?.response?.data);

        notifyError(decryptedData?.error?.message);
      });
  };

  /* =========================================================
     ASSIGN TECHNICIAN
  ========================================================= */

  const handleAssignTechnician = () => {
    AdminServices.assignTechnician({
      ...technicianValues,
      serviceRequestId,
    })
      .then((res) => {
        if (res) {
          notifySuccess("Technician assigned successfully!");

          setAssignTechnicianModal(false);

          dispatch(getServiceRequest(serviceRequestId));
        }
      })
      .catch((err) => {
        const decryptedData = DecryptData(err?.response?.data);

        notifyError(decryptedData?.error?.message);
      });
  };

  /* =========================================================
     GET QUOTATION
  ========================================================= */

  const getQuotation = () => {
    ServiceRequestServices.getQuotation(serviceRequestId)
      .then((res) => {
        if (res) {
          const decodedata = DecryptData(res);

          console.log("Decrypted Data:", decodedata);

          setQuotationData(decodedata?.data?.quotation);
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  /* =========================================================
     GET SERVICE CENTER ADDRESS
  ========================================================= */

  const getServiceCenterAddress = () => {
    ServiceRequestServices.getServiceCenterAddress()
      .then((res) => {
        if (res) {
          const decodedata = DecryptData(res);

          console.log("Decrypted Address Data: ", decodedata?.data?.addresses);

          setServiceCenterAddresses(decodedata?.data?.addresses);
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  /* =========================================================
     INITIAL DATA
  ========================================================= */

  useEffect(() => {
    dispatch(getServiceRequest(serviceRequestId));

    getQuotation();
    getServiceCenterAddress();
  }, [serviceRequestId]);

  /* =========================================================
     IMAGE PREVIEW
  ========================================================= */

  const openImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setIsPreviewOpen(true);
  };

  const closeImagePreview = () => {
    setIsPreviewOpen(false);
    setPreviewImage("");
  };

  /* =========================================================
     ENCODED APPLIANCE DATA
  ========================================================= */

  const encodedAppData = encode({
    ...serviceRequest?.model,
    model: serviceRequest?.model,
  });

  console.log("SAS: ", {
    ...serviceRequest?.model,
    model: serviceRequest?.model,
  });

  return (
    <div className="my-5 min-h-screen bg-background text-secondary">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-5">
        <h1 className="text-xl font-bold text-primary">
          Service Request Details
        </h1>

        <p className="mt-1 text-xs text-secondary/60">
          View and manage complete service request information
        </p>
      </div>

      {/* =====================================================
          SERVICE REQUEST
      ===================================================== */}

      <LayoutCard
        heading={"Service Request"}
        gridColCount={1}
        gridColCountxl={6}
        gridColCountmd={2}
      >
        {/* SERVICE REQUEST ID */}

        <div className="rounded-lg bg-background p-3 text-xs font-bold">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-secondary/50">
            Service Request ID
          </div>

          <div className="break-all text-primary">
            {serviceRequest?._id || "--"}
          </div>
        </div>

        {/* APPLIANCE NAME */}

        <div className="rounded-lg bg-background p-3 text-xs font-bold">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-secondary/50">
            Appliance Name
          </div>

          <div className="flex items-center gap-2 text-primary">
            <div>{serviceRequest?.model?.modelName ?? "--"}</div>

            <Link
              to={`/appliance/overview?appData=${encodeURIComponent(
                encodedAppData,
              )}`}
            >
              <FaExternalLinkAlt className="cursor-pointer text-[10px] text-secondary transition hover:text-primary" />
            </Link>
          </div>
        </div>

        {/* SERVICE MODE */}

        <div className="rounded-lg bg-background p-3 text-xs font-bold">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-secondary/50">
            Service Mode
          </div>

          <div
            className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-bold capitalize ${statusTheme(
              serviceRequest?.serviceMode,
            )}`}
          >
            {serviceRequest?.serviceMode || "--"}
          </div>
        </div>

        {/* STATUS */}

        <div className="rounded-lg bg-background p-3 text-xs font-bold">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-secondary/50">
            Status
          </div>

          <div
            className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-bold capitalize ${statusTheme(
              serviceRequest?.ticketStatus,
              true,
            )}`}
          >
            {serviceRequest?.ticketStatus || "--"}
          </div>
        </div>

        {/* RAISED ON */}

        <div className="rounded-lg bg-background p-3 text-xs font-bold">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-secondary/50">
            Raised On
          </div>

          <div className="text-primary">
            {serviceRequest?.createdAt
              ? moment(serviceRequest.createdAt).format("DD-MMM-YYYY hh:mm A")
              : "--"}
          </div>
        </div>

        {/* LAST UPDATED */}

        <div className="rounded-lg bg-background p-3 text-xs font-bold">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-secondary/50">
            Last Updated On
          </div>

          <div className="text-primary">
            {serviceRequest?.updatedAt
              ? moment(serviceRequest.updatedAt).format("DD-MMM-YYYY hh:mm A")
              : "--"}
          </div>
        </div>
      </LayoutCard>

      {/* =====================================================
          PROBLEM DETAILS
      ===================================================== */}

      <LayoutCard heading={"Problem Details"} gridColCount={1}>
        <div className="rounded-lg bg-background p-4 text-xs font-bold">
          <div className="mb-2 text-[10px] uppercase tracking-wide text-secondary/50">
            Problem Description
          </div>

          <div className="break-words text-sm font-medium leading-6 text-primary">
            {serviceRequest?.problemDescription || "--"}
          </div>
        </div>

        {/* ATTACHMENTS */}

        {serviceRequest?.attachments?.length > 0 && (
          <div className="mt-2">
            <div className="mb-3 text-[10px] uppercase tracking-wide text-secondary/50">
              Attachments
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {serviceRequest?.attachments?.map((attachment, index) => (
                <div
                  key={attachment || index}
                  className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-xl border border-accent bg-background sm:h-28 sm:w-28"
                  onClick={() => openImagePreview(attachment)}
                >
                  <img
                    src={attachment}
                    alt={`Attachment ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}

        {serviceRequest?.ticketStatus !==
          TICKET_STATUS.SERVICE_REQUEST_CANCELED &&
          serviceRequest?.ticketStatus !==
            TICKET_STATUS.SERVICE_REQUEST_CLOSED && (
            <div className="flex flex-wrap items-center gap-3">
              {/* ASSIGN RIDER */}

              {serviceRequest?.isAssignRiderEnabled === true && (
                <button
                  disabled={serviceRequest?.rider?._id || loading}
                  className="mt-4 flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-secondary disabled:opacity-40"
                  onClick={() => {
                    dispatch(getRidersList());

                    setAssignRiderModal(true);
                  }}
                >
                  <MdAssignmentTurnedIn size={18} />

                  <div>
                    {loading || serviceRequest?.rider?._id
                      ? "Rider Assigned"
                      : "Assign Rider"}
                  </div>
                </button>
              )}

              {/* ASSIGN TECHNICIAN */}

              {serviceRequest?.isAssignTechnicianEnabled === true && (
                <button
                  disabled={serviceRequest?.technician?._id || loading}
                  className="mt-4 flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-secondary disabled:opacity-40"
                  onClick={() => {
                    dispatch(getTechniciansList());

                    setAssignTechnicianModal(true);
                  }}
                >
                  <MdAssignmentTurnedIn size={18} />

                  <div>
                    {loading || serviceRequest?.technician?._id
                      ? "Technician Assigned"
                      : "Assign Technician"}
                  </div>
                </button>
              )}

              {/* QUOTATION */}

              {serviceRequest?.isQuotationEnabled && (
                <button
                  disabled={loading}
                  className="mt-4 flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-primary disabled:opacity-40"
                  onClick={() => {
                    setQuotationModal(true);
                  }}
                >
                  <MdAssignment size={18} />

                  <div>Quotation</div>
                </button>
              )}

              {/* COMMENTS */}

              <button
                disabled={loading}
                className="mt-4 flex items-center gap-2 rounded-md border-2 border-secondary px-3 py-2 text-[13px] text-secondary transition hover:bg-secondary hover:text-white disabled:opacity-40"
                onClick={toggleDrawer}
              >
                <IoChatboxEllipsesOutline size={17} className="scale-125" />
              </button>
            </div>
          )}
      </LayoutCard>

      {/* =====================================================
          CUSTOMER DETAILS
      ===================================================== */}

      <LayoutCard
        heading={"Customer Details"}
        gridColCount={1}
        gridColCountxl={6}
        gridColCountmd={2}
        useFlex={false}
      >
        {/* CUSTOMER NAME */}

        <div className="min-w-0 rounded-lg bg-background p-3 text-xs font-bold">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-secondary/50">
            Customer Name
          </div>

          <div className="flex min-w-0 items-center gap-2 text-primary">
            <div className="truncate">
              {serviceRequest?.customer?.userName || "--"}
            </div>

            {serviceRequest?.customer?._id && (
              <Link
                to={`/users/customer/details?userId=${serviceRequest?.customer?._id}`}
                className="shrink-0"
              >
                <FaExternalLinkAlt className="text-[10px] text-secondary transition hover:text-primary" />
              </Link>
            )}
          </div>
        </div>

        {/* CUSTOMER PHONE */}

        <div className="min-w-0 rounded-lg bg-background p-3 text-xs font-bold">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-secondary/50">
            Customer Phone Number
          </div>

          <div className="break-words text-primary">
            {serviceRequest?.customer?.countryCode || "--"}{" "}
            {serviceRequest?.customer?.phoneNumber || "--"}
          </div>
        </div>

        {/* CUSTOMER EMAIL */}

        <div className="min-w-0 rounded-lg bg-background p-3 text-xs font-bold">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-secondary/50">
            Customer Email
          </div>

          <div className="break-all text-primary">
            {serviceRequest?.customer?.email || "--"}
          </div>
        </div>

        {/* JOINED ON */}

        <div className="min-w-0 rounded-lg bg-background p-3 text-xs font-bold">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-secondary/50">
            Joined On
          </div>

          <div className="text-primary">
            {serviceRequest?.customer?.createdAt
              ? moment(serviceRequest.customer.createdAt).format(
                  "DD-MMM-YYYY hh:mm A",
                )
              : "--"}
          </div>
        </div>
      </LayoutCard>

      {/* =====================================================
          RIDER DETAILS
      ===================================================== */}

      {serviceRequest?.rider?.userName && (
        <LayoutCard
          heading={"Rider Details"}
          gridColCount={1}
          gridColCountxl={6}
          gridColCountmd={2}
          useFlex={false}
        >
          <div className="text-xs font-bold text-primary">
            <div className="mb-1 text-[11.5px] text-secondary/50">
              Rider Name
            </div>

            <div className="flex items-center gap-2">
              <div>{serviceRequest?.rider?.userName}</div>

              <Link
                to={`/users/rider/details?userId=${serviceRequest?.rider?._id}`}
              >
                <FaExternalLinkAlt className="cursor-pointer text-secondary transition hover:text-primary" />
              </Link>
            </div>
          </div>

          <div className="text-xs font-bold text-primary">
            <div className="mb-1 text-[11.5px] text-secondary/50">
              Rider Phone Number
            </div>

            <div>
              {serviceRequest?.rider?.countryCode}{" "}
              {serviceRequest?.rider?.phoneNumber}
            </div>
          </div>

          <div className="text-xs font-bold text-primary">
            <div className="mb-1 text-[11.5px] text-secondary/50">
              Rider Email
            </div>

            <div>{serviceRequest?.rider?.email}</div>
          </div>

          <div className="text-xs font-bold text-primary">
            <div className="mb-1 text-[11.5px] text-secondary/50">
              Joined On
            </div>

            <div>
              {moment(serviceRequest?.rider?.createdAt).format(
                "DD-MMM-YYYY hh:mm A",
              )}
            </div>
          </div>
        </LayoutCard>
      )}

      {/* =====================================================
          TECHNICIAN DETAILS
      ===================================================== */}

      {serviceRequest?.technician?.userName && (
        <LayoutCard
          heading={"Technician Details"}
          gridColCount={6}
          useFlex={false}
        >
          <div className="text-xs font-bold text-primary">
            <div className="mb-1 text-[11.5px] text-secondary/50">
              Technician Name
            </div>

            <div className="flex items-center gap-2">
              <div>{serviceRequest?.technician?.userName}</div>

              <Link
                to={`/users/technician/details?userId=${serviceRequest?.technician?._id}`}
              >
                <FaExternalLinkAlt className="cursor-pointer text-secondary transition hover:text-primary" />
              </Link>
            </div>
          </div>

          <div className="text-xs font-bold text-primary">
            <div className="mb-1 text-[11.5px] text-secondary/50">
              Technician Phone Number
            </div>

            <div>
              {serviceRequest?.technician?.countryCode}{" "}
              {serviceRequest?.technician?.phoneNumber}
            </div>
          </div>

          <div className="text-xs font-bold text-primary">
            <div className="mb-1 text-[11.5px] text-secondary/50">
              Technician Email
            </div>

            <div>{serviceRequest?.technician?.email}</div>
          </div>

          <div className="text-xs font-bold text-primary">
            <div className="mb-1 text-[11.5px] text-secondary/50">
              Joined On
            </div>

            <div>
              {moment(serviceRequest?.technician?.createdAt).format(
                "DD-MMM-YYYY hh:mm A",
              )}
            </div>
          </div>
        </LayoutCard>
      )}

      {/* =====================================================
          CUSTOMER LOCATION
      ===================================================== */}

      <LayoutCard heading={"Customer Location"} gridColCount={1}>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="w-full md:w-1/2">
            {serviceRequest?.address && (
              <GoogleMapComponent
                width="100%"
                center={{
                  lat: Number(serviceRequest?.address?.latitude),
                  lng: Number(serviceRequest?.address?.longitude),
                }}
              />
            )}
          </div>

          <div className="w-full md:w-1/2">
            <div className="text-xs font-bold text-primary">
              <div className="mb-1 text-[11.5px] text-secondary/50">
                Address
              </div>

              <div>{serviceRequest?.address?.addressLine}</div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="text-xs font-bold text-primary">
                <div className="mb-1 text-[11.5px] text-secondary/50">
                  Latitude
                </div>

                <div>{serviceRequest?.address?.latitude}</div>
              </div>

              <div className="text-xs font-bold text-primary">
                <div className="mb-1 text-[11.5px] text-secondary/50">
                  Longitude
                </div>

                <div>{serviceRequest?.address?.longitude}</div>
              </div>

              <div className="text-xs font-bold text-primary">
                <div className="mb-1 text-[11.5px] text-secondary/50">
                  Created On
                </div>

                <div>
                  {moment(serviceRequest?.address?.createdAt).format(
                    "DD-MMM-YYYY hh:mm A",
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutCard>

      {/* =====================================================
          SERVICE CENTER LOCATION
      ===================================================== */}

      {serviceRequest?.serviceCenterAddress && (
        <LayoutCard heading={"Service Center Location"} gridColCount={1}>
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="w-full md:w-1/2">
              {serviceRequest?.serviceCenterAddress && (
                <GoogleMapComponent
                  width="100%"
                  center={{
                    lat: Number(serviceRequest?.serviceCenterAddress?.latitude),
                    lng: Number(
                      serviceRequest?.serviceCenterAddress?.longitude,
                    ),
                  }}
                />
              )}
            </div>

            <div className="w-full md:w-1/2">
              <div className="text-xs font-bold text-primary">
                <div className="mb-1 text-[11.5px] text-secondary/50">
                  Address
                </div>

                <div>{serviceRequest?.serviceCenterAddress?.addressLine}</div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="text-xs font-bold text-primary">
                  <div className="mb-1 text-[11.5px] text-secondary/50">
                    Latitude
                  </div>

                  <div>{serviceRequest?.serviceCenterAddress?.latitude}</div>
                </div>

                <div className="text-xs font-bold text-primary">
                  <div className="mb-1 text-[11.5px] text-secondary/50">
                    Longitude
                  </div>

                  <div>{serviceRequest?.serviceCenterAddress?.longitude}</div>
                </div>

                <div className="text-xs font-bold text-primary">
                  <div className="mb-1 text-[11.5px] text-secondary/50">
                    Created On
                  </div>

                  <div>
                    {moment(serviceRequest?.address?.createdAt).format(
                      "DD-MMM-YYYY hh:mm A",
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LayoutCard>
      )}

      {/* =====================================================
          QUOTATION DRAWER
      ===================================================== */}

      <MuiDrawer
        open={quotationModal}
        onClose={() => setQuotationModal(false)}
        drawerWidth="575px"
      >
        <QuotationDrawer
          toggleDrawer={toggleDrawer}
          quotationData={quotationData}
          getQuotation={getQuotation}
        />
      </MuiDrawer>

      {/* =====================================================
          COMMENTS DRAWER
      ===================================================== */}

      <MainDrawer noFlex={true} windowDimensionHighWidth="575px">
        <CommentsDrawer
          serviceRequest={serviceRequest}
          toggleDrawer={toggleDrawer}
          quotationData={quotationData}
          getQuotation={getQuotation}
        />
      </MainDrawer>

      {/* =====================================================
          ASSIGN RIDER DRAWER
      ===================================================== */}

      <MuiDrawer
        open={assignRiderModal}
        onClose={() => setAssignRiderModal(false)}
        drawerWidth="400px"
      >
        <div className="h-[var(--doc-height)] bg-background p-4">
          <div className="flex items-center gap-2 text-md font-bold text-primary">
            <MdAssignmentTurnedIn size={22} />
            Assign Rider
          </div>

          <div className="mt-8 flex flex-col text-sm">
            <label className="font-bold text-primary">Select a Rider</label>

            <select
              className="mt-1 w-full rounded-md border border-accent bg-white px-2 py-2 text-primary outline-none transition focus:border-secondary"
              onChange={(e) =>
                setRiderValues({
                  riderId: e.target.value,
                  addressId: riderValues.addressId,
                })
              }
            >
              {riders?.map((data) => (
                <option key={data?._id} value={data?._id}>
                  {data?.userName}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-col text-sm">
            <label className="font-bold text-primary">Select a Zone</label>

            <select
              className="mt-1 w-full rounded-md border border-accent bg-white px-2 py-2 text-primary outline-none transition focus:border-secondary"
              onChange={(e) =>
                setRiderValues({
                  riderId: riderValues.riderId,
                  addressId: e.target.value,
                })
              }
            >
              {serviceCenterAddresses?.map((data) => (
                <option key={data?._id} value={data?._id}>
                  {data?.addressName}
                </option>
              ))}
            </select>
          </div>

          <button
            className="mt-4 h-10 w-full rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-secondary"
            onClick={() => handleAssignRider()}
          >
            Assign
          </button>
        </div>
      </MuiDrawer>

      {/* =====================================================
          ASSIGN TECHNICIAN DRAWER
      ===================================================== */}

      <MuiDrawer
        open={assignTechnicianModal}
        onClose={() => setAssignTechnicianModal(false)}
        drawerWidth="400px"
      >
        <div className="h-[var(--doc-height)] bg-background p-4">
          <div className="flex items-center gap-2 text-md font-bold text-primary">
            <MdAssignmentTurnedIn size={22} />
            Assign Technician
          </div>

          <div className="mt-8 flex flex-col text-sm">
            <label className="font-bold text-primary">
              Select a Technician
            </label>

            <select
              className="mt-1 w-full rounded-md border border-accent bg-white px-2 py-2 text-primary outline-none transition focus:border-secondary"
              onChange={(e) => {
                setTechnicianValues({
                  technicianId: e?.target?.value,
                });
              }}
            >
              {[
                {
                  userName: "Select Technician",
                  _id: 1,
                },
                ...technicians,
              ]?.map((data) => (
                <option key={data?._id} value={data?._id}>
                  {data?.userName}
                </option>
              ))}
            </select>
          </div>

          <button
            className="mt-4 h-10 w-full rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-secondary"
            onClick={() => handleAssignTechnician()}
          >
            Assign
          </button>
        </div>
      </MuiDrawer>

      {/* =====================================================
          IMAGE PREVIEW
      ===================================================== */}

      {isPreviewOpen && (
        <div
          className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-xl border border-accent bg-background sm:h-28 sm:w-28"
          onClick={() => openImagePreview(attachment)}
        >
          <img
            src={attachment}
            alt={`Attachment ${index + 1}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}
    </div>
  );
};

export default TicketOverview;

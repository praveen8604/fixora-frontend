// import DashboardServices from "@/services/DashboardServices";
// import { DecryptData, encode } from "@/utils/DecryptData";
// import { useHistory, Link } from "react-router-dom";
// import React, { useEffect, useMemo, useState } from "react";

// import {
//   FaBoxOpen,
//   FaExternalLinkAlt,
//   FaShieldAlt,
//   FaRegClock,
//   FaChevronRight,
//   FaPlus,
//   FaCalendarAlt,
//   FaCheckCircle,
// } from "react-icons/fa";

// import {
//   LuComputer,
//   LuPackageOpen,
// } from "react-icons/lu";

// import { MdAddPhotoAlternate } from "react-icons/md";
// import { HiOutlineCube } from "react-icons/hi2";
// import { TbBrandProducthunt } from "react-icons/tb";
// import { FiArrowUpRight } from "react-icons/fi";
// import { BsBox } from "react-icons/bs";

// import AnimatedContent from "@/components/common/AnimatedContent";
// import MuiDrawer from "@/components/drawer/MuiDrawer";
// import Dropdown from "@/components/common/DropDown";

// import { notifyError } from "@/utils/toast";
// import AdminServices from "@/services/AdminServices";
// import BackdropProgressLoader from "@/components/common/BackdropProgressLoader";

// import moment from "moment";
// import { deviceImages } from "@/data/deviceImages";
// import otherdevice from "../assets/img/gadgets/other-gadget.png";

// /* =========================================================
//    THEME
// ========================================================= */

// const THEME = {
//   primary: "#AD8B73",
//   secondary: "#CEAB93",
//   soft: "#E3CAA5",
//   background: "#FFFBE9",
//   text: "#59483D",
//   muted: "#8B7769",
//   lightText: "#A89282",
// };

// /* =========================================================
//    KPI CARD
// ========================================================= */

// const KpiCard = ({
//   title,
//   value,
//   desc,
//   Icon,
// }) => {
//   return (
//     <div
//       className="
//         group
//         relative
//         overflow-hidden
//         rounded-[22px]
//         border
//         border-[#CEAB93]
//         bg-white
//         p-5
//         shadow-[0_6px_22px_rgba(111,81,62,0.06)]
//         transition-all
//         duration-300
//         hover:-translate-y-1
//         hover:border-[#AD8B73]
//         hover:shadow-[0_14px_30px_rgba(111,81,62,0.11)]
//       "
//     >
//       {/* Top decorative shape */}
//       <div
//         className="
//           pointer-events-none
//           absolute
//           -right-10
//           -top-10
//           h-28
//           w-28
//           rounded-full
//           border
//           border-[#E3CAA5]
//           bg-[#FFFBE9]
//           transition-transform
//           duration-500
//           group-hover:scale-125
//         "
//       />

//       <div className="relative z-10 flex items-start justify-between">
//         <div
//           className="
//             flex
//             h-11
//             w-11
//             items-center
//             justify-center
//             rounded-[14px]
//             border
//             border-[#CEAB93]
//             bg-[#FFFBE9]
//             text-[#AD8B73]
//             transition-all
//             duration-300
//             group-hover:bg-[#E3CAA5]
//           "
//         >
//           <Icon size={18} />
//         </div>

//         <div
//           className="
//             flex
//             h-8
//             w-8
//             items-center
//             justify-center
//             rounded-full
//             border
//             border-[#E3CAA5]
//             bg-[#FFFBE9]
//             text-[#AD8B73]
//             transition-all
//             duration-300
//             group-hover:bg-[#AD8B73]
//             group-hover:text-white
//           "
//         >
//           <FiArrowUpRight size={14} />
//         </div>
//       </div>

//       <div className="relative z-10 mt-5">
//         <p
//           className="
//             text-[10px]
//             font-bold
//             uppercase
//             tracking-[0.14em]
//             text-[#8B7769]
//           "
//         >
//           {title}
//         </p>

//         <div className="mt-2.5 flex items-end justify-between gap-2">
//           <h3
//             className="
//               text-[30px]
//               font-extrabold
//               leading-none
//               tracking-[-0.04em]
//               text-[#59483D]
//             "
//           >
//             {value}
//           </h3>

//           <span
//             className="
//               mb-0.5
//               max-w-[110px]
//               text-right
//               text-[9px]
//               font-medium
//               leading-4
//               text-[#A89282]
//             "
//           >
//             {desc}
//           </span>
//         </div>
//       </div>

//       {/* Bottom hover line */}
//       <div
//         className="
//           absolute
//           bottom-0
//           left-5
//           right-5
//           h-[2px]
//           overflow-hidden
//           rounded-full
//           bg-[#E3CAA5]
//         "
//       >
//         <div
//           className="
//             h-full
//             w-0
//             rounded-full
//             bg-[#AD8B73]
//             transition-all
//             duration-500
//             group-hover:w-full
//           "
//         />
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    DEVICE IMAGE
// ========================================================= */

// export const getDeviceImage = (item) => {
//   return (
//     deviceImages?.find(
//       (e) =>
//         e?.deviceType?.toLowerCase() ===
//           item?.appliance?.applianceName?.toLowerCase() &&
//         (e?.brandName?.[0] !== "other"
//           ? e?.brandName?.includes(
//               item?.brand?.brandName?.toLowerCase()
//             )
//           : true)
//     )?.deviceImage || otherdevice
//   );
// };

// /* =========================================================
//    APPLIANCE COMPONENT
// ========================================================= */

// const Appliance = () => {
//   const [loadingPercentage, setLoadingPercentage] = useState(0);

//   const [appliance, setAppliance] = useState([]);
//   const [mappedAppliance, setMappedAppliance] = useState([]);

//   const history = useHistory();

//   const [applianceInput, setApplianceInput] =
//     useState(false);

//   const [brandInput, setBrandInput] =
//     useState(false);

//   const [brands, setBrands] = useState([]);
//   const [models, setModels] = useState([]);

//   const [createApplianceModal, setCreateApplianceModal] =
//     useState(false);

//   const [applianceId, setApplianceId] =
//     useState("");

//   const [brandId, setBrandId] =
//     useState("");

//   const [loadingStatus, setLoadingStatus] =
//     useState("");

//   const [
//     applianceSelectedOption,
//     setApplianceSelectedOption,
//   ] = useState("");

//   const [
//     brandSelectedOption,
//     setBrandSelectedOption,
//   ] = useState("");

//   const [modelValue, setModelValue] =
//     useState("");

//   const [applianceImage, setApplianceImage] =
//     useState({
//       fileName: "",
//       image: "",
//     });

//   /* =========================================================
//      IMAGE CHANGE
//   ========================================================= */

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];

//     if (!file) return;

//     const reader = new FileReader();

//     reader.readAsDataURL(file);

//     reader.onload = () => {
//       setApplianceImage({
//         fileName: `appliance-${new Date()
//           .toISOString()
//           .replace(/[:.]/g, "-")}`,
//         image: reader.result,
//       });
//     };
//   };

//   /* =========================================================
//      APPLIANCE SELECT
//   ========================================================= */

//   const handleApplianceSelect = (e, _id) => {
//     if (_id === 1) {
//       setApplianceInput(true);
//       setBrandInput(true);
//       setApplianceId("");
//       setBrandId("");
//       return;
//     }

//     setApplianceSelectedOption(e);
//     setApplianceInput(false);
//     setBrandInput(false);
//     setApplianceId(_id);

//     const foundAppliance =
//       mappedAppliance.find(
//         (e) => e?.appliances?._id === _id
//       );

//     setBrands([
//       ...(foundAppliance?.appliances?.brands || []),
//       {
//         _id: 1,
//         brandName: "Other",
//       },
//     ]);
//   };

//   /* =========================================================
//      BRAND SELECT
//   ========================================================= */

//   const handleBrandSelect = (e, _id) => {
//     if (_id === 1) {
//       setBrandInput(true);
//       setBrandId("");
//       return;
//     }

//     setBrandId(_id);
//     setBrandSelectedOption(e);
//     setBrandInput(false);

//     const foundBrand = brands.find(
//       (e) => e?._id === _id
//     );

//     setModels(foundBrand?.models || []);
//   };

//   /* =========================================================
//      GET MAPPED APPLIANCE
//   ========================================================= */

//   const getMappedAppliance = () => {
//     DashboardServices.getMappedAppliance()
//       .then((res) => {
//         if (!res) return;

//         const decodedata = DecryptData(res);

//         const formattedApplianceList =
//           decodedata?.data?.mappedAppliances?.flatMap(
//             (data) =>
//               data?.appliances?.brands?.flatMap(
//                 (brandData) =>
//                   brandData?.models?.map(
//                     (modelData) => ({
//                       appliance: {
//                         applianceName:
//                           data?.appliances
//                             ?.applianceName,

//                         applianceId:
//                           data?.appliances?._id,
//                       },

//                       brand: {
//                         brandName:
//                           brandData?.brandName,

//                         brandId:
//                           brandData?._id,
//                       },

//                       model: {
//                         modelName:
//                           modelData?.modelName,

//                         dateOfPurchase:
//                           modelData?.dateOfPurchase,

//                         extendUpto:
//                           modelData?.extendUpto,

//                         isWarrantyApproved:
//                           modelData
//                             ?.isWarrantyApproved,

//                         warrantyDocuments:
//                           modelData
//                             ?.warrantyDocuments,

//                         modelId:
//                           modelData?._id,

//                         attachment:
//                           modelData?.attachment,
//                       },

//                       createdBy:
//                         modelData?.createdBy,

//                       createdAt:
//                         modelData?.createdAt,

//                       updatedBy:
//                         modelData?.updatedBy,

//                       updatedAt:
//                         modelData?.updatedAt,
//                     })
//                   )
//               )
//           );

//         const appliancesList =
//           decodedata?.data?.mappedAppliances?.filter(
//             (e) =>
//               e?.appliances?.createdBy?.role ===
//               "admin"
//           );

//         setMappedAppliance([
//           ...(appliancesList || []),
//           {
//             appliances: {
//               _id: 1,
//               applianceName: "Other",
//             },
//           },
//         ]);

//         setAppliance(
//           formattedApplianceList || []
//         );
//       })
//       .catch((err) => {
//         const decryptedData = DecryptData(
//           err?.response?.data
//         );

//         notifyError(
//           decryptedData?.error?.message
//         );
//       });
//   };

//   /* =========================================================
//      CREATE APPLIANCE
//   ========================================================= */

//   const handleCreateAppliance = () => {
//     setLoadingPercentage(1);

//     AdminServices.createAppliance({
//       applianceName:
//         applianceSelectedOption,

//       applianceId,
//     }).then((applianceRes) => {
//       if (!applianceRes) return;

//       setLoadingStatus("Appliance created!");
//       setApplianceId("");

//       const applianceDecodedata =
//         DecryptData(applianceRes);

//       setLoadingPercentage(35);

//       AdminServices.createBrand({
//         brandName:
//           brandSelectedOption,

//         applianceId:
//           applianceDecodedata?.data
//             ?.commonAppliance?._id,

//         brandId,
//       }).then((brandRes) => {
//         setLoadingPercentage(70);

//         setLoadingStatus("Brand created!");
//         setBrandId("");

//         const brandDecodedata =
//           DecryptData(brandRes);

//         AdminServices.createModel({
//           applianceId:
//             applianceDecodedata?.data
//               ?.commonAppliance?._id,

//           brandId:
//             brandDecodedata?.data
//               ?.commonBrand?._id,

//           modelName: modelValue,

//           attachmentValue:
//             applianceImage.image,

//           fileName:
//             applianceImage.fileName,
//         }).then((modelRes) => {
//           if (!modelRes) return;

//           setLoadingStatus("Model created!");
//           setLoadingPercentage(99);

//           setTimeout(() => {
//             setLoadingPercentage(100);

//             getMappedAppliance();

//             setCreateApplianceModal(false);

//             setApplianceSelectedOption("");
//             setBrandSelectedOption("");
//             setModelValue("");

//             setApplianceImage({
//               fileName: "",
//               image: "",
//             });

//             setApplianceInput(false);
//             setBrandInput(false);

//             setBrands([]);
//             setModels([]);

//             setTimeout(() => {
//               setLoadingStatus("");
//               setLoadingPercentage(0);
//             }, 1000);
//           }, 1500);
//         });
//       });
//     });
//   };

//   /* =========================================================
//      INITIAL LOAD
//   ========================================================= */

//   useEffect(() => {
//     getMappedAppliance();
//   }, []);

//   /* =========================================================
//      METRICS
//   ========================================================= */

//   const totalAppliances =
//     appliance?.length || 0;

//   const totalBrands = useMemo(() => {
//     return new Set(
//       appliance
//         ?.map(
//           (item) =>
//             item?.brand?.brandName
//         )
//         ?.filter(Boolean)
//     ).size;
//   }, [appliance]);

//   const totalModels = useMemo(() => {
//     return new Set(
//       appliance
//         ?.map(
//           (item) =>
//             item?.model?.modelName
//         )
//         ?.filter(Boolean)
//     ).size;
//   }, [appliance]);

//   const approvedWarranty = useMemo(() => {
//     return appliance?.filter(
//       (item) =>
//         item?.model
//           ?.isWarrantyApproved ===
//         "approved"
//     ).length;
//   }, [appliance]);

//   /* =========================================================
//      OPEN APPLIANCE
//   ========================================================= */

//   const openAppliance = (item) => {
//     const encodedAppData = encode(item);

//     history.push(
//       `/appliance/overview?applianceId=${item?.appliance?.applianceId}&appData=${encodeURIComponent(
//         encodedAppData
//       )}`
//     );
//   };

//   /* =========================================================
//      WARRANTY STATUS
//   ========================================================= */

//   const getWarrantyStatus = (item) => {
//     const s =
//       item?.model?.isWarrantyApproved;

//     if (s === "approved") {
//       return {
//         label: "Approved",
//         icon: (
//           <FaCheckCircle size={9} />
//         ),
//         cls: `
//           border-[#CEAB93]
//           bg-[#FFFBE9]
//           text-[#80604B]
//         `,
//       };
//     }

//     if (s === "pending") {
//       return {
//         label: "Pending",
//         icon: (
//           <FaRegClock size={9} />
//         ),
//         cls: `
//           border-[#E3CAA5]
//           bg-[#FFFBE9]
//           text-[#9A755D]
//         `,
//       };
//     }

//     return {
//       label: "Not Approved",
//       icon: (
//         <FaShieldAlt size={9} />
//       ),
//       cls: `
//         border-[#E3CAA5]
//         bg-white
//         text-[#9A897D]
//       `,
//     };
//   };

//   /* =========================================================
//      METRICS DATA
//   ========================================================= */

//   const metrics = [
//     {
//       title: "Total Appliances",
//       value: totalAppliances,
//       desc: "All appliances",
//       Icon: LuPackageOpen,
//     },
//     {
//       title: "Total Brands",
//       value: totalBrands,
//       desc: "Unique brands",
//       Icon: TbBrandProducthunt,
//     },
//     {
//       title: "Total Models",
//       value: totalModels,
//       desc: "Unique models",
//       Icon: HiOutlineCube,
//     },
//     {
//       title: "Warranty Approved",
//       value: approvedWarranty,
//       desc: "Approved warranties",
//       Icon: FaShieldAlt,
//     },
//   ];

//   return (
//     <>
//       <AnimatedContent>
//         <div
//           className="
//             min-h-screen
//             bg-[#FFFBE9]
//             pb-10
//           "
//         >

//           {/* =====================================================
//     HERO
// ====================================================== */}

// <section className="mb-7">
//   <div
//     className="
//       relative
//       overflow-hidden
//       rounded-[26px]
//       border
//       border-[#CEAB93]
//       bg-[#604637]
//       px-6
//       py-7
//       shadow-[0_14px_34px_rgba(111,81,62,0.15)]
//       sm:px-8
//       sm:py-8
//     "
//   >
//     <div
//       className="
//         relative
//         z-10
//         flex
//         flex-col
//         gap-6
//         lg:flex-row
//         lg:items-center
//         lg:justify-between
//       "
//     >
//       {/* Hero Content */}

//       <div>
//         <h1
//           className="
//             text-[28px]
//             font-extrabold
//             leading-tight
//             tracking-[-0.04em]
//             text-[#FFFBE9]
//             sm:text-[34px]
//           "
//         >
//           Appliance Collection
//         </h1>

//         <p
//           className="
//             mt-2
//             max-w-[570px]
//             text-[13px]
//             leading-6
//             text-[#FFFBE9]/80
//           "
//         >
//           Manage appliances, brands, models
//           and warranty information from one
//           organized workspace.
//         </p>
//       </div>

//       {/* Hero Stats */}

//       <div
//         className="
//           flex
//           flex-wrap
//           items-center
//           gap-2.5
//         "
//       >
//         {/* Appliances */}

//         <div
//           className="
//             flex
//             items-center
//             gap-2.5
//             rounded-xl
//             border
//             border-[#CEAB93]/70
//             bg-[#AD8B73]/35
//             px-4
//             py-2.5
//           "
//         >
//           <FaBoxOpen
//             size={13}
//             className="text-[#FFFBE9]"
//           />

//           <span
//             className="
//               text-[11px]
//               font-bold
//               text-[#FFFBE9]
//             "
//           >
//             {totalAppliances} Appliances
//           </span>
//         </div>

//         {/* Warranty */}

//         <div
//           className="
//             flex
//             items-center
//             gap-2.5
//             rounded-xl
//             border
//             border-[#CEAB93]/70
//             bg-[#AD8B73]/35
//             px-4
//             py-2.5
//           "
//         >
//           <FaShieldAlt
//             size={13}
//             className="text-[#E3CAA5]"
//           />

//           <span
//             className="
//               text-[11px]
//               font-bold
//               text-[#FFFBE9]
//             "
//           >
//             {approvedWarranty} Approved
//           </span>
//         </div>
//       </div>
//     </div>

//     {/* Single clean accent line */}

//     <div
//       className="
//         absolute
//         bottom-0
//         left-8
//         right-8
//         h-[2px]
//         bg-[#CEAB93]
//       "
//     />
//   </div>
// </section>

//           {/* =====================================================
//               KPI CARDS
//           ====================================================== */}

//           <section className="mb-8">
//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-4
//                 sm:grid-cols-2
//                 xl:grid-cols-4
//               "
//             >
//               {metrics.map((m) => (
//                 <KpiCard
//                   key={m.title}
//                   {...m}
//                 />
//               ))}
//             </div>
//           </section>

//           {/* =====================================================
//               COLLECTION HEADER
//           ====================================================== */}

//           <section>

//             <div
//               className="
//                 mb-5
//                 flex
//                 flex-col
//                 gap-4
//                 sm:flex-row
//                 sm:items-center
//                 sm:justify-between
//               "
//             >

//               <div
//                 className="
//                   flex
//                   items-center
//                   gap-3
//                 "
//               >

//                 <div
//                   className="
//                     flex
//                     h-10
//                     w-10
//                     items-center
//                     justify-center
//                     rounded-xl
//                     border
//                     border-[#CEAB93]
//                     bg-white
//                     text-[#AD8B73]
//                   "
//                 >
//                   <LuPackageOpen size={16} />
//                 </div>

//                 <div>
//                   <h2
//                     className="
//                       text-[17px]
//                       font-extrabold
//                       tracking-[-0.025em]
//                       text-[#59483D]
//                     "
//                   >
//                     Appliance Collection
//                   </h2>

//                   <p
//                     className="
//                       mt-0.5
//                       text-[11px]
//                       text-[#9A897D]
//                     "
//                   >
//                     Registered appliances and warranty
//                     information
//                   </p>
//                 </div>

//               </div>

//               <div
//                 className="
//                   flex
//                   items-center
//                   gap-3
//                 "
//               >

//                 <span
//                   className="
//                     hidden
//                     text-[10px]
//                     font-bold
//                     uppercase
//                     tracking-[0.15em]
//                     text-[#9A897D]
//                     sm:block
//                   "
//                 >
//                   {totalAppliances} Records
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setCreateApplianceModal(true)
//                   }
//                   className="
//                     flex
//                     items-center
//                     gap-2
//                     rounded-xl
//                     bg-[#AD8B73]
//                     px-4
//                     py-2.5
//                     text-[11px]
//                     font-extrabold
//                     text-white
//                     shadow-[0_6px_15px_rgba(111,81,62,0.14)]
//                     transition-all
//                     duration-200
//                     hover:-translate-y-0.5
//                     hover:bg-[#80604B]
//                   "
//                 >
//                   <FaPlus size={9} />
//                   Create Appliance
//                 </button>

//               </div>
//             </div>

//             {/* =====================================================
//                 TABLE CARD
//             ====================================================== */}

//             <div
//               className="
//                 overflow-hidden
//                 rounded-[26px]
//                 border
//                 border-[#CEAB93]
//                 bg-white
//                 shadow-[0_12px_32px_rgba(111,81,62,0.07)]
//               "
//             >

//               {/* Table Header */}

//               <div
//                 className="
//                   border-b
//                   border-[#E3CAA5]
//                   bg-[#FFFBE9]
//                   px-6
//                   py-5
//                 "
//               >

//                 <div
//                   className="
//                     flex
//                     flex-col
//                     gap-3
//                     sm:flex-row
//                     sm:items-center
//                     sm:justify-between
//                   "
//                 >

//                   <div>
//                     <h3
//                       className="
//                         text-base
//                         font-bold
//                         text-[#59483D]
//                       "
//                     >
//                       Appliance List
//                     </h3>

//                     <p
//                       className="
//                         mt-1
//                         text-xs
//                         text-[#9A897D]
//                       "
//                     >
//                       Appliance, brand, model and warranty
//                       details
//                     </p>
//                   </div>

//                   <span
//                     className="
//                       inline-flex
//                       w-fit
//                       items-center
//                       gap-2
//                       rounded-full
//                       border
//                       border-[#CEAB93]
//                       bg-white
//                       px-3
//                       py-1.5
//                       text-[9px]
//                       font-bold
//                       uppercase
//                       tracking-[0.12em]
//                       text-[#8B6C58]
//                     "
//                   >
//                     <span
//                       className="
//                         h-1.5
//                         w-1.5
//                         rounded-full
//                         bg-[#AD8B73]
//                       "
//                     />
//                     Live Data
//                   </span>

//                 </div>
//               </div>

//               {/* Table */}

//               <div className="overflow-x-auto">

//                 <table className="w-full min-w-[1120px]">

//                   <thead>
//                     <tr
//                       className="
//                         border-b
//                         border-[#E3CAA5]
//                         bg-[#FFFBE9]
//                       "
//                     >
//                       {[
//                         "Appliance",
//                         "Created By",
//                         "Brand",
//                         "Model",
//                         "Warranty",
//                         "Purchase",
//                         "Expiry",
//                         "Created",
//                       ].map((h, i) => (
//                         <th
//                           key={h}
//                           className={`
//                             px-5
//                             py-4
//                             text-[10px]
//                             font-bold
//                             uppercase
//                             tracking-[0.14em]
//                             text-[#8B7769]
//                             ${
//                               i === 7
//                                 ? "text-right"
//                                 : "text-left"
//                             }
//                           `}
//                         >
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>

//                   <tbody>

//                     {appliance?.map(
//                       (item, index) => {
//                         const warranty =
//                           getWarrantyStatus(
//                             item
//                           );

//                         return (
//                           <tr
//                             key={
//                               item?._id ||
//                               index
//                             }
//                             onClick={() =>
//                               openAppliance(
//                                 item
//                               )
//                             }
//                             className="
//                               group
//                               cursor-pointer
//                               border-b
//                               border-[#F1E8DA]
//                               transition-colors
//                               duration-200
//                               last:border-b-0
//                               hover:bg-[#FFFBE9]
//                             "
//                           >

//                             {/* Appliance */}

//                             <td className="px-5 py-4">

//                               <div
//                                 className="
//                                   flex
//                                   items-center
//                                   gap-3
//                                 "
//                               >

//                                 <div
//                                   className="
//                                     relative
//                                     flex
//                                     h-[58px]
//                                     w-[58px]
//                                     shrink-0
//                                     items-center
//                                     justify-center
//                                     overflow-hidden
//                                     rounded-[16px]
//                                     border
//                                     border-[#CEAB93]
//                                     bg-[#FFFBE9]
//                                   "
//                                 >

//                                   <img
//                                     src={
//                                       item?.model
//                                         ?.attachment ||
//                                       getDeviceImage(
//                                         item
//                                       )
//                                     }
//                                     alt={
//                                       item?.model
//                                         ?.modelName ||
//                                       "Appliance"
//                                     }
//                                     className="
//                                       h-11
//                                       w-11
//                                       object-contain
//                                       transition-transform
//                                       duration-300
//                                       group-hover:scale-105
//                                     "
//                                   />

//                                   <div
//                                     className="
//                                       absolute
//                                       bottom-1
//                                       right-1
//                                       h-2
//                                       w-2
//                                       rounded-full
//                                       border
//                                       border-white
//                                       bg-[#AD8B73]
//                                     "
//                                   />

//                                 </div>

//                                 <div className="min-w-0">

//                                   <p
//                                     className="
//                                       max-w-[180px]
//                                       truncate
//                                       text-xs
//                                       font-extrabold
//                                       text-[#59483D]
//                                     "
//                                   >
//                                     {item
//                                       ?.appliance
//                                       ?.applianceName ||
//                                       item
//                                         ?.appliance
//                                         ?.deviceDetails
//                                         ?.deviceName ||
//                                       "--"}
//                                   </p>

//                                   <div
//                                     className="
//                                       mt-1
//                                       flex
//                                       items-center
//                                       gap-1.5
//                                     "
//                                   >

//                                     <FaBoxOpen
//                                       size={8}
//                                       className="text-[#AD8B73]"
//                                     />

//                                     <span
//                                       className="
//                                         text-[9px]
//                                         text-[#9A897D]
//                                       "
//                                     >
//                                       Appliance
//                                     </span>

//                                   </div>

//                                 </div>
//                               </div>
//                             </td>

//                             {/* Created By */}

//                             <td className="px-5 py-4">

//                               <div
//                                 className="
//                                   flex
//                                   items-center
//                                   gap-2
//                                 "
//                               >

//                                 <div
//                                   className="
//                                     flex
//                                     h-8
//                                     w-8
//                                     shrink-0
//                                     items-center
//                                     justify-center
//                                     rounded-full
//                                     border
//                                     border-[#CEAB93]
//                                     bg-[#E3CAA5]
//                                     text-[10px]
//                                     font-black
//                                     text-[#6F513E]
//                                   "
//                                 >
//                                   {item
//                                     ?.createdBy
//                                     ?.userName
//                                     ?.charAt(
//                                       0
//                                     )
//                                     ?.toUpperCase() ||
//                                     "U"}
//                                 </div>

//                                 <div>

//                                   <div
//                                     className="
//                                       flex
//                                       items-center
//                                       gap-2
//                                     "
//                                   >

//                                     <span
//                                       className="
//                                         max-w-[105px]
//                                         truncate
//                                         text-xs
//                                         font-bold
//                                         text-[#6B574A]
//                                       "
//                                     >
//                                       {item
//                                         ?.createdBy
//                                         ?.userName ||
//                                         "--"}
//                                     </span>

//                                     {item
//                                       ?.createdBy
//                                       ?._id && (
//                                       <div
//                                         onClick={(
//                                           e
//                                         ) =>
//                                           e.stopPropagation()
//                                         }
//                                       >
//                                         <Link
//                                           to={`/user?userId=${item?.createdBy?._id}`}
//                                           className="
//                                             text-[#CEAB93]
//                                             transition-colors
//                                             hover:text-[#AD8B73]
//                                           "
//                                         >
//                                           <FaExternalLinkAlt
//                                             size={8}
//                                           />
//                                         </Link>
//                                       </div>
//                                     )}

//                                   </div>

//                                   <span
//                                     className="
//                                       text-[9px]
//                                       text-[#A89282]
//                                     "
//                                   >
//                                     Owner
//                                   </span>

//                                 </div>
//                               </div>
//                             </td>

//                             {/* Brand */}

//                             <td className="px-5 py-4">

//                               <span
//                                 className="
//                                   inline-flex
//                                   items-center
//                                   rounded-lg
//                                   border
//                                   border-[#CEAB93]
//                                   bg-[#FFFBE9]
//                                   px-3
//                                   py-1.5
//                                   text-[10px]
//                                   font-extrabold
//                                   text-[#80604B]
//                                 "
//                               >
//                                 {item?.brand
//                                   ?.brandName ||
//                                   "--"}
//                               </span>

//                             </td>

//                             {/* Model */}

//                             <td className="px-5 py-4">

//                               <div
//                                 className="
//                                   flex
//                                   items-center
//                                   gap-2
//                                 "
//                               >

//                                 <div
//                                   className="
//                                     flex
//                                     h-7
//                                     w-7
//                                     items-center
//                                     justify-center
//                                     rounded-lg
//                                     border
//                                     border-[#E3CAA5]
//                                     bg-[#FFFBE9]
//                                     text-[#AD8B73]
//                                   "
//                                 >
//                                   <HiOutlineCube
//                                     size={13}
//                                   />
//                                 </div>

//                                 <span
//                                   className="
//                                     text-xs
//                                     font-bold
//                                     text-[#6B574A]
//                                   "
//                                 >
//                                   {item
//                                     ?.model
//                                     ?.modelName ||
//                                     "--"}
//                                 </span>

//                               </div>
//                             </td>

//                             {/* Warranty */}

//                             <td className="px-5 py-4">

//                               <span
//                                 className={`
//                                   inline-flex
//                                   items-center
//                                   gap-1.5
//                                   rounded-full
//                                   border
//                                   px-2.5
//                                   py-1.5
//                                   text-[9px]
//                                   font-extrabold
//                                   ${warranty.cls}
//                                 `}
//                               >
//                                 {warranty.icon}
//                                 {warranty.label}
//                               </span>

//                             </td>

//                             {/* Purchase */}

//                             <td className="px-5 py-4">

//                               <div
//                                 className="
//                                   flex
//                                   items-center
//                                   gap-2
//                                 "
//                               >

//                                 <div
//                                   className="
//                                     flex
//                                     h-7
//                                     w-7
//                                     items-center
//                                     justify-center
//                                     rounded-lg
//                                     border
//                                     border-[#E3CAA5]
//                                     bg-[#FFFBE9]
//                                     text-[#AD8B73]
//                                   "
//                                 >
//                                   <FaCalendarAlt
//                                     size={9}
//                                   />
//                                 </div>

//                                 <span
//                                   className="
//                                     text-[10px]
//                                     font-semibold
//                                     text-[#7F6C60]
//                                   "
//                                 >
//                                   {item?.model
//                                     ?.dateOfPurchase &&
//                                   item?.model
//                                     ?.isWarrantyApproved ===
//                                     "approved"
//                                     ? moment(
//                                         item.model
//                                           .dateOfPurchase
//                                       ).format(
//                                         "DD MMM YYYY"
//                                       )
//                                     : "--"}
//                                 </span>

//                               </div>
//                             </td>

//                             {/* Expiry */}

//                             <td className="px-5 py-4">

//                               <div
//                                 className="
//                                   flex
//                                   items-center
//                                   gap-2
//                                 "
//                               >

//                                 <div
//                                   className="
//                                     flex
//                                     h-7
//                                     w-7
//                                     items-center
//                                     justify-center
//                                     rounded-lg
//                                     border
//                                     border-[#E3CAA5]
//                                     bg-[#FFFBE9]
//                                     text-[#AD8B73]
//                                   "
//                                 >
//                                   <FaRegClock
//                                     size={9}
//                                   />
//                                 </div>

//                                 <span
//                                   className="
//                                     text-[10px]
//                                     font-semibold
//                                     text-[#7F6C60]
//                                   "
//                                 >
//                                   {item?.model
//                                     ?.extendUpto &&
//                                   item?.model
//                                     ?.isWarrantyApproved ===
//                                     "approved"
//                                     ? moment(
//                                         item.model
//                                           .extendUpto
//                                       ).format(
//                                         "DD MMM YYYY"
//                                       )
//                                     : "--"}
//                                 </span>

//                               </div>
//                             </td>

//                             {/* Created */}

//                             <td className="px-5 py-4">

//                               <div
//                                 className="
//                                   flex
//                                   items-center
//                                   justify-end
//                                   gap-3
//                                 "
//                               >

//                                 <span
//                                   className="
//                                     text-[10px]
//                                     font-semibold
//                                     text-[#A89282]
//                                   "
//                                 >
//                                   {item?.createdAt
//                                     ? moment(
//                                         item.createdAt
//                                       ).format(
//                                         "DD MMM YYYY"
//                                       )
//                                     : "--"}
//                                 </span>

//                                 <div
//                                   className="
//                                     flex
//                                     h-7
//                                     w-7
//                                     items-center
//                                     justify-center
//                                     rounded-full
//                                     border
//                                     border-[#E3CAA5]
//                                     bg-[#FFFBE9]
//                                     text-[#AD8B73]
//                                     transition-all
//                                     duration-200
//                                     group-hover:border-[#AD8B73]
//                                     group-hover:bg-[#AD8B73]
//                                     group-hover:text-white
//                                   "
//                                 >
//                                   <FaChevronRight
//                                     size={9}
//                                   />
//                                 </div>

//                               </div>
//                             </td>

//                           </tr>
//                         );
//                       }
//                     )}

//                   </tbody>
//                 </table>
//               </div>

//               {/* Empty */}

//               {appliance?.length === 0 && (
//                 <div
//                   className="
//                     flex
//                     min-h-[280px]
//                     flex-col
//                     items-center
//                     justify-center
//                     bg-white
//                   "
//                 >

//                   <div
//                     className="
//                       flex
//                       h-16
//                       w-16
//                       items-center
//                       justify-center
//                       rounded-[20px]
//                       border
//                       border-[#CEAB93]
//                       bg-[#FFFBE9]
//                       text-[#AD8B73]
//                     "
//                   >
//                     <BsBox size={24} />
//                   </div>

//                   <p
//                     className="
//                       mt-4
//                       text-[13px]
//                       font-bold
//                       text-[#59483D]
//                     "
//                   >
//                     No Appliances Found
//                   </p>

//                   <p
//                     className="
//                       mt-1
//                       text-[10px]
//                       text-[#A89282]
//                     "
//                   >
//                     Add an appliance to start your collection
//                   </p>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setCreateApplianceModal(true)
//                     }
//                     className="
//                       mt-4
//                       flex
//                       items-center
//                       gap-2
//                       rounded-xl
//                       border
//                       border-[#CEAB93]
//                       bg-[#FFFBE9]
//                       px-4
//                       py-2
//                       text-[10px]
//                       font-bold
//                       text-[#80604B]
//                       transition
//                       hover:bg-[#E3CAA5]
//                     "
//                   >
//                     <FaPlus size={9} />
//                     Add Appliance
//                   </button>

//                 </div>
//               )}

//             </div>
//           </section>
//         </div>

//         {/* =====================================================
//             CREATE APPLIANCE DRAWER
//         ====================================================== */}

//         <MuiDrawer
//           open={createApplianceModal}
//           onClose={() =>
//             setCreateApplianceModal(false)
//           }
//           drawerWidth="420px"
//         >

//           <div
//             className="
//               flex
//               h-[var(--doc-height)]
//               flex-col
//               bg-[#FFFBE9]
//             "
//           >

//             {/* Drawer Header */}

//             <div
//               className="
//                 relative
//                 overflow-hidden
//                 bg-[#604637]
//                 px-5
//                 py-6
//               "
//             >

//               {/* Header grid */}

//               <div
//                 className="
//                   pointer-events-none
//                   absolute
//                   inset-0
//                   opacity-[0.05]
//                   [background-image:linear-gradient(#FFFBE9_1px,transparent_1px),linear-gradient(90deg,#FFFBE9_1px,transparent_1px)]
//                   [background-size:24px_24px]
//                 "
//               />

//               <div
//                 className="
//                   pointer-events-none
//                   absolute
//                   -right-14
//                   -top-14
//                   h-40
//                   w-40
//                   rounded-full
//                   border
//                   border-[#E3CAA5]/30
//                 "
//               />

//               <div
//                 className="
//                   relative
//                   z-10
//                   flex
//                   items-start
//                   justify-between
//                 "
//               >

//                 <div
//                   className="
//                     flex
//                     items-center
//                     gap-3
//                   "
//                 >

//                   <div
//                     className="
//                       flex
//                       h-11
//                       w-11
//                       items-center
//                       justify-center
//                       rounded-[14px]
//                       border
//                       border-[#CEAB93]
//                       bg-[#AD8B73]
//                       text-[#FFFBE9]
//                     "
//                   >
//                     <LuComputer size={21} />
//                   </div>

//                   <div>

//                     <p
//                       className="
//                         text-[8px]
//                         font-bold
//                         uppercase
//                         tracking-[0.18em]
//                         text-[#E3CAA5]
//                       "
//                     >
//                       New Entry
//                     </p>

//                     <h2
//                       className="
//                         mt-1
//                         text-lg
//                         font-black
//                         text-[#FFFBE9]
//                       "
//                     >
//                       Create Appliance
//                     </h2>

//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setCreateApplianceModal(
//                       false
//                     )
//                   }
//                   className="
//                     flex
//                     h-8
//                     w-8
//                     items-center
//                     justify-center
//                     rounded-lg
//                     border
//                     border-[#CEAB93]/60
//                     bg-[#AD8B73]/50
//                     text-lg
//                     text-[#FFFBE9]
//                     transition
//                     hover:bg-[#AD8B73]
//                   "
//                 >
//                   ×
//                 </button>

//               </div>

//               <p
//                 className="
//                   relative
//                   z-10
//                   mt-4
//                   max-w-[300px]
//                   text-[10px]
//                   leading-5
//                   text-[#FFFBE9]/75
//                 "
//               >
//                 Add appliance details to keep your
//                 collection organized.
//               </p>

//             </div>

//             {/* Drawer Body */}

//             <div
//               className="
//                 flex-1
//                 overflow-y-auto
//                 px-5
//                 py-6
//               "
//             >

//               <div className="space-y-5">

//                 {/* Appliance */}

//                 {mappedAppliance?.length > 0 && (
//                   <div>

//                     <label
//                       className="
//                         mb-2
//                         block
//                         text-[9px]
//                         font-black
//                         uppercase
//                         tracking-[0.15em]
//                         text-[#806B5D]
//                       "
//                     >
//                       Appliance
//                     </label>

//                     {applianceInput ? (
//                       <input
//                         value={
//                           applianceSelectedOption
//                         }
//                         placeholder="Enter appliance name"
//                         className="
//                           default-input
//                           w-full
//                           rounded-xl
//                           border
//                           border-[#CEAB93]
//                           bg-white
//                           px-3.5
//                           py-3
//                           text-sm
//                           text-[#59483D]
//                           outline-none
//                           transition
//                           placeholder:text-[#B5A394]
//                           focus:border-[#AD8B73]
//                           focus:ring-4
//                           focus:ring-[#E3CAA5]/50
//                         "
//                         onChange={(e) =>
//                           setApplianceSelectedOption(
//                             e.target.value
//                           )
//                         }
//                       />
//                     ) : (
//                       <Dropdown
//                         value={
//                           applianceSelectedOption
//                         }
//                         placeholder="Select an appliance"
//                         onSelect={
//                           handleApplianceSelect
//                         }
//                         options={mappedAppliance.map(
//                           (e) =>
//                             e?.appliances
//                               ?.applianceName
//                         )}
//                         disabled={false}
//                         optionsObject={mappedAppliance.map(
//                           (e) =>
//                             e?.appliances
//                         )}
//                       />
//                     )}
//                   </div>
//                 )}

//                 {/* Brand */}

//                 {(brands?.length > 0 ||
//                   brandInput) && (
//                   <div>

//                     <label
//                       className="
//                         mb-2
//                         block
//                         text-[9px]
//                         font-black
//                         uppercase
//                         tracking-[0.15em]
//                         text-[#806B5D]
//                       "
//                     >
//                       Brand
//                     </label>

//                     {brandInput ? (
//                       <input
//                         value={
//                           brandSelectedOption
//                         }
//                         placeholder="Enter brand name"
//                         className="
//                           default-input
//                           w-full
//                           rounded-xl
//                           border
//                           border-[#CEAB93]
//                           bg-white
//                           px-3.5
//                           py-3
//                           text-sm
//                           text-[#59483D]
//                           outline-none
//                           transition
//                           placeholder:text-[#B5A394]
//                           focus:border-[#AD8B73]
//                           focus:ring-4
//                           focus:ring-[#E3CAA5]/50
//                         "
//                         onChange={(e) =>
//                           setBrandSelectedOption(
//                             e.target.value
//                           )
//                         }
//                       />
//                     ) : (
//                       <Dropdown
//                         value={
//                           brandSelectedOption
//                         }
//                         placeholder="Select a brand"
//                         onSelect={
//                           handleBrandSelect
//                         }
//                         options={brands?.map(
//                           (e) =>
//                             e?.brandName
//                         )}
//                         disabled={false}
//                         optionsObject={brands}
//                       />
//                     )}
//                   </div>
//                 )}

//                 {/* Model */}

//                 {(models?.length > 0 ||
//                   brandInput) && (
//                   <div>

//                     <label
//                       className="
//                         mb-2
//                         block
//                         text-[9px]
//                         font-black
//                         uppercase
//                         tracking-[0.15em]
//                         text-[#806B5D]
//                       "
//                     >
//                       Model
//                     </label>

//                     <input
//                       value={modelValue}
//                       placeholder="Enter model name"
//                       className="
//                         default-input
//                         w-full
//                         rounded-xl
//                         border
//                         border-[#CEAB93]
//                         bg-white
//                         px-3.5
//                         py-3
//                         text-sm
//                         text-[#59483D]
//                         outline-none
//                         transition
//                         placeholder:text-[#B5A394]
//                         focus:border-[#AD8B73]
//                         focus:ring-4
//                         focus:ring-[#E3CAA5]/50
//                       "
//                       onChange={(e) =>
//                         setModelValue(
//                           e.target.value
//                         )
//                       }
//                     />
//                   </div>
//                 )}

//                 {/* Image */}

//                 <div>

//                   <label
//                     className="
//                       mb-2
//                       block
//                       text-[9px]
//                       font-black
//                       uppercase
//                       tracking-[0.15em]
//                       text-[#806B5D]
//                     "
//                   >
//                     Appliance Image
//                   </label>

//                   <input
//                     className="hidden"
//                     id="appliance-img"
//                     type="file"
//                     accept="image/*"
//                     onChange={
//                       handleImageChange
//                     }
//                   />

//                   <label
//                     htmlFor="appliance-img"
//                     className="group block cursor-pointer"
//                   >

//                     <div
//                       className="
//                         relative
//                         flex
//                         min-h-[190px]
//                         items-center
//                         justify-center
//                         overflow-hidden
//                         rounded-[20px]
//                         border-2
//                         border-dashed
//                         border-[#CEAB93]
//                         bg-white
//                         transition-all
//                         duration-300
//                         group-hover:border-[#AD8B73]
//                         group-hover:bg-[#FFFBE9]
//                       "
//                     >

//                       {applianceImage.image ? (
//                         <>
//                           <img
//                             src={
//                               applianceImage.image
//                             }
//                             alt={
//                               applianceImage.fileName
//                             }
//                             className="
//                               max-h-[185px]
//                               w-full
//                               object-contain
//                               p-5
//                             "
//                           />

//                           <div
//                             className="
//                               absolute
//                               bottom-3
//                               rounded-full
//                               bg-[#604637]
//                               px-3
//                               py-1.5
//                               text-[9px]
//                               font-bold
//                               text-white
//                               opacity-0
//                               transition
//                               group-hover:opacity-100
//                             "
//                           >
//                             Change image
//                           </div>
//                         </>
//                       ) : (
//                         <div className="text-center">

//                           <div
//                             className="
//                               mx-auto
//                               flex
//                               h-16
//                               w-16
//                               items-center
//                               justify-center
//                               rounded-[20px]
//                               border
//                               border-[#CEAB93]
//                               bg-[#FFFBE9]
//                               text-[#AD8B73]
//                               transition-transform
//                               duration-300
//                               group-hover:scale-105
//                             "
//                           >
//                             <MdAddPhotoAlternate
//                               size={31}
//                             />
//                           </div>

//                           <p
//                             className="
//                               mt-3
//                               text-xs
//                               font-extrabold
//                               text-[#59483D]
//                             "
//                           >
//                             Upload appliance image
//                           </p>

//                           <p
//                             className="
//                               mt-1
//                               text-[10px]
//                               text-[#A89282]
//                             "
//                           >
//                             Click to browse your files
//                           </p>

//                         </div>
//                       )}

//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Drawer Footer */}

//             <div
//               className="
//                 border-t
//                 border-[#CEAB93]
//                 bg-white
//                 px-5
//                 py-4
//               "
//             >

//               <button
//                 type="button"
//                 disabled={
//                   !applianceSelectedOption ||
//                   !brandSelectedOption ||
//                   !modelValue
//                 }
//                 onClick={
//                   handleCreateAppliance
//                 }
//                 className="
//                   group
//                   flex
//                   h-11
//                   w-full
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-xl
//                   bg-[#AD8B73]
//                   text-xs
//                   font-extrabold
//                   text-white
//                   shadow-[0_8px_18px_rgba(111,81,62,0.16)]
//                   transition-all
//                   duration-300
//                   hover:-translate-y-0.5
//                   hover:bg-[#80604B]
//                   disabled:cursor-not-allowed
//                   disabled:opacity-40
//                   disabled:hover:translate-y-0
//                 "
//               >

//                 <FaPlus
//                   size={9}
//                   className="
//                     transition-transform
//                     duration-300
//                     group-hover:rotate-90
//                   "
//                 />

//                 Create Appliance

//               </button>

//               <p
//                 className="
//                   mt-2
//                   text-center
//                   text-[9px]
//                   text-[#A89282]
//                 "
//               >
//                 All appliance information will be added
//                 to your collection.
//               </p>

//             </div>
//           </div>
//         </MuiDrawer>
//       </AnimatedContent>

//       {/* =========================================================
//           LOADER
//       ========================================================= */}

//       <BackdropProgressLoader
//         value={loadingPercentage}
//         status={loadingStatus}
//       />
//     </>
//   );
// };

// export default Appliance;

import DashboardServices from "@/services/DashboardServices";
import { DecryptData, encode } from "@/utils/DecryptData";
import { useHistory, Link } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";

import {
  FaBoxOpen,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaRegClock,
  FaChevronRight,
  FaPlus,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

import { LuComputer, LuPackageOpen } from "react-icons/lu";

import { MdAddPhotoAlternate } from "react-icons/md";
import { HiOutlineCube } from "react-icons/hi2";
import { TbBrandProducthunt } from "react-icons/tb";
import { FiArrowUpRight } from "react-icons/fi";
import { BsBox } from "react-icons/bs";

import AnimatedContent from "@/components/common/AnimatedContent";
import MuiDrawer from "@/components/drawer/MuiDrawer";
import Dropdown from "@/components/common/DropDown";

import { notifyError } from "@/utils/toast";
import AdminServices from "@/services/AdminServices";
import BackdropProgressLoader from "@/components/common/BackdropProgressLoader";

import moment from "moment";
import { deviceImages } from "@/data/deviceImages";
import otherdevice from "../assets/img/gadgets/other-gadget.png";

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
        rounded-[22px]
        border
        border-secondary
        bg-white
        p-5
        shadow-[0_6px_22px_rgba(0,0,0,0.06)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary
        hover:shadow-[0_14px_30px_rgba(0,0,0,0.10)]
      "
    >
      {/* Top decorative shape */}

      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-28
          w-28
          rounded-full
          border
          border-accent
          bg-background
          transition-transform
          duration-500
          group-hover:scale-125
        "
      />

      <div className="relative z-10 flex items-start justify-between">
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
            group-hover:bg-accent
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
            text-primary
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

        <div className="mt-2.5 flex items-end justify-between gap-2">
          <h3
            className="
              text-[30px]
              font-extrabold
              leading-none
              tracking-[-0.04em]
              text-primary
            "
          >
            {value}
          </h3>

          <span
            className="
              mb-0.5
              max-w-[110px]
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

      {/* Bottom hover line */}

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
   DEVICE IMAGE
========================================================= */

export const getDeviceImage = (item) => {
  return (
    deviceImages?.find(
      (e) =>
        e?.deviceType?.toLowerCase() ===
          item?.appliance?.applianceName?.toLowerCase() &&
        (e?.brandName?.[0] !== "other"
          ? e?.brandName?.includes(item?.brand?.brandName?.toLowerCase())
          : true),
    )?.deviceImage || otherdevice
  );
};

/* =========================================================
   APPLIANCE COMPONENT
========================================================= */

const Appliance = () => {
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  const [appliance, setAppliance] = useState([]);
  const [mappedAppliance, setMappedAppliance] = useState([]);

  const history = useHistory();

  const [applianceInput, setApplianceInput] = useState(false);
  const [brandInput, setBrandInput] = useState(false);

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const [createApplianceModal, setCreateApplianceModal] = useState(false);

  const [applianceId, setApplianceId] = useState("");
  const [brandId, setBrandId] = useState("");

  const [loadingStatus, setLoadingStatus] = useState("");

  const [applianceSelectedOption, setApplianceSelectedOption] = useState("");

  const [brandSelectedOption, setBrandSelectedOption] = useState("");

  const [modelValue, setModelValue] = useState("");

  const [applianceImage, setApplianceImage] = useState({
    fileName: "",
    image: "",
  });

  /* =========================================================
     IMAGE CHANGE
  ========================================================= */

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      setApplianceImage({
        fileName: `appliance-${new Date().toISOString().replace(/[:.]/g, "-")}`,
        image: reader.result,
      });
    };
  };

  /* =========================================================
     APPLIANCE SELECT
  ========================================================= */

  const handleApplianceSelect = (e, _id) => {
    if (_id === 1) {
      setApplianceInput(true);
      setBrandInput(true);
      setApplianceId("");
      setBrandId("");
      return;
    }

    setApplianceSelectedOption(e);
    setApplianceInput(false);
    setBrandInput(false);
    setApplianceId(_id);

    const foundAppliance = mappedAppliance.find(
      (e) => e?.appliances?._id === _id,
    );

    setBrands([
      ...(foundAppliance?.appliances?.brands || []),
      {
        _id: 1,
        brandName: "Other",
      },
    ]);
  };

  /* =========================================================
     BRAND SELECT
  ========================================================= */

  const handleBrandSelect = (e, _id) => {
    if (_id === 1) {
      setBrandInput(true);
      setBrandId("");
      return;
    }

    setBrandId(_id);
    setBrandSelectedOption(e);
    setBrandInput(false);

    const foundBrand = brands.find((e) => e?._id === _id);

    setModels(foundBrand?.models || []);
  };

  /* =========================================================
     GET MAPPED APPLIANCE
  ========================================================= */

  const getMappedAppliance = () => {
    DashboardServices.getMappedAppliance()
      .then((res) => {
        if (!res) return;

        const decodedata = DecryptData(res);

        const formattedApplianceList =
          decodedata?.data?.mappedAppliances?.flatMap((data) =>
            data?.appliances?.brands?.flatMap((brandData) =>
              brandData?.models?.map((modelData) => ({
                appliance: {
                  applianceName: data?.appliances?.applianceName,

                  applianceId: data?.appliances?._id,
                },

                brand: {
                  brandName: brandData?.brandName,

                  brandId: brandData?._id,
                },

                model: {
                  modelName: modelData?.modelName,

                  dateOfPurchase: modelData?.dateOfPurchase,

                  extendUpto: modelData?.extendUpto,

                  isWarrantyApproved: modelData?.isWarrantyApproved,

                  warrantyDocuments: modelData?.warrantyDocuments,

                  modelId: modelData?._id,

                  attachment: modelData?.attachment,
                },

                createdBy: modelData?.createdBy,

                createdAt: modelData?.createdAt,

                updatedBy: modelData?.updatedBy,

                updatedAt: modelData?.updatedAt,
              })),
            ),
          );

        const appliancesList = decodedata?.data?.mappedAppliances?.filter(
          (e) => e?.appliances?.createdBy?.role === "admin",
        );

        setMappedAppliance([
          ...(appliancesList || []),
          {
            appliances: {
              _id: 1,
              applianceName: "Other",
            },
          },
        ]);

        setAppliance(formattedApplianceList || []);
      })
      .catch((err) => {
        const decryptedData = DecryptData(err?.response?.data);

        notifyError(decryptedData?.error?.message);
      });
  };

  /* =========================================================
     CREATE APPLIANCE
  ========================================================= */

  const handleCreateAppliance = () => {
    setLoadingPercentage(1);

    AdminServices.createAppliance({
      applianceName: applianceSelectedOption,

      applianceId,
    }).then((applianceRes) => {
      if (!applianceRes) return;

      setLoadingStatus("Appliance created!");
      setApplianceId("");

      const applianceDecodedata = DecryptData(applianceRes);

      setLoadingPercentage(35);

      AdminServices.createBrand({
        brandName: brandSelectedOption,

        applianceId: applianceDecodedata?.data?.commonAppliance?._id,

        brandId,
      }).then((brandRes) => {
        setLoadingPercentage(70);

        setLoadingStatus("Brand created!");
        setBrandId("");

        const brandDecodedata = DecryptData(brandRes);

        AdminServices.createModel({
          applianceId: applianceDecodedata?.data?.commonAppliance?._id,

          brandId: brandDecodedata?.data?.commonBrand?._id,

          modelName: modelValue,

          attachmentValue: applianceImage.image,

          fileName: applianceImage.fileName,
        }).then((modelRes) => {
          if (!modelRes) return;

          setLoadingStatus("Model created!");
          setLoadingPercentage(99);

          setTimeout(() => {
            setLoadingPercentage(100);

            getMappedAppliance();

            setCreateApplianceModal(false);

            setApplianceSelectedOption("");
            setBrandSelectedOption("");
            setModelValue("");

            setApplianceImage({
              fileName: "",
              image: "",
            });

            setApplianceInput(false);
            setBrandInput(false);

            setBrands([]);
            setModels([]);

            setTimeout(() => {
              setLoadingStatus("");
              setLoadingPercentage(0);
            }, 1000);
          }, 1500);
        });
      });
    });
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    getMappedAppliance();
  }, []);

  /* =========================================================
     METRICS
  ========================================================= */

  const totalAppliances = appliance?.length || 0;

  const totalBrands = useMemo(() => {
    return new Set(
      appliance?.map((item) => item?.brand?.brandName)?.filter(Boolean),
    ).size;
  }, [appliance]);

  const totalModels = useMemo(() => {
    return new Set(
      appliance?.map((item) => item?.model?.modelName)?.filter(Boolean),
    ).size;
  }, [appliance]);

  const approvedWarranty = useMemo(() => {
    return appliance?.filter(
      (item) => item?.model?.isWarrantyApproved === "approved",
    ).length;
  }, [appliance]);

  /* =========================================================
     OPEN APPLIANCE
  ========================================================= */

  const openAppliance = (item) => {
    const encodedAppData = encode(item);

    history.push(
      `/appliance/overview?applianceId=${item?.appliance?.applianceId}&appData=${encodeURIComponent(
        encodedAppData,
      )}`,
    );
  };

  /* =========================================================
     WARRANTY STATUS
  ========================================================= */

  const getWarrantyStatus = (item) => {
    const s = item?.model?.isWarrantyApproved;

    if (s === "approved") {
      return {
        label: "Approved",
        icon: <FaCheckCircle size={9} />,
        cls: `
          border-secondary
          bg-accent
          text-primary
        `,
      };
    }

    if (s === "pending") {
      return {
        label: "Pending",
        icon: <FaRegClock size={9} />,
        cls: `
          border-accent
          bg-background
          text-secondary
        `,
      };
    }

    return {
      label: "Not Approved",
      icon: <FaShieldAlt size={9} />,
      cls: `
        border-accent
        bg-white
        text-secondary
      `,
    };
  };

  /* =========================================================
     METRICS DATA
  ========================================================= */

  const metrics = [
    {
      title: "Total Appliances",
      value: totalAppliances,
      desc: "All appliances",
      Icon: LuPackageOpen,
    },
    {
      title: "Total Brands",
      value: totalBrands,
      desc: "Unique brands",
      Icon: TbBrandProducthunt,
    },
    {
      title: "Total Models",
      value: totalModels,
      desc: "Unique models",
      Icon: HiOutlineCube,
    },
    {
      title: "Warranty Approved",
      value: approvedWarranty,
      desc: "Approved warranties",
      Icon: FaShieldAlt,
    },
  ];

  return (
    <>
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

          <section className="mb-7">
            <div
              className="
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-secondary
                bg-primary
                px-6
                py-7
                shadow-[0_14px_34px_rgba(0,0,0,0.15)]
                sm:px-8
                sm:py-8
              "
            >
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
                    Appliance Collection
                  </h1>

                  <p
                    className="
                      mt-2
                      max-w-[570px]
                      text-[13px]
                      leading-6
                      text-white/80
                    "
                  >
                    Manage appliances, brands, models and warranty information
                    from one organized workspace.
                  </p>
                </div>

                {/* Hero Stats */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2.5
                  "
                >
                  {/* Appliances */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2.5
                      rounded-xl
                      border
                      border-secondary
                      bg-secondary/40
                      px-4
                      py-2.5
                    "
                  >
                    <FaBoxOpen size={13} className="text-white" />

                    <span
                      className="
                        text-[11px]
                        font-bold
                        text-white
                      "
                    >
                      {totalAppliances} Appliances
                    </span>
                  </div>

                  {/* Warranty */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2.5
                      rounded-xl
                      border
                      border-secondary
                      bg-secondary/40
                      px-4
                      py-2.5
                    "
                  >
                    <FaShieldAlt size={13} className="text-accent" />

                    <span
                      className="
                        text-[11px]
                        font-bold
                        text-white
                      "
                    >
                      {approvedWarranty} Approved
                    </span>
                  </div>
                </div>
              </div>

              {/* Accent line */}

              <div
                className="
                  absolute
                  bottom-0
                  left-8
                  right-8
                  h-[2px]
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
                <KpiCard key={m.title} {...m} />
              ))}
            </div>
          </section>

          {/* =====================================================
              COLLECTION HEADER
          ====================================================== */}

          <section>
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
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-secondary
                    bg-white
                    text-primary
                  "
                >
                  <LuPackageOpen size={16} />
                </div>

                <div>
                  <h2
                    className="
                      text-[17px]
                      font-extrabold
                      tracking-[-0.025em]
                      text-primary
                    "
                  >
                    Appliance Collection
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-[11px]
                      text-secondary
                    "
                  >
                    Registered appliances and warranty information
                  </p>
                </div>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    hidden
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-secondary
                    sm:block
                  "
                >
                  {totalAppliances} Records
                </span>

                <button
                  type="button"
                  onClick={() => setCreateApplianceModal(true)}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-primary
                    px-4
                    py-2.5
                    text-[11px]
                    font-extrabold
                    text-white
                    shadow-[0_6px_15px_rgba(0,0,0,0.14)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-secondary
                  "
                >
                  <FaPlus size={9} />
                  Create Appliance
                </button>
              </div>
            </div>

            {/* =====================================================
                TABLE CARD
            ====================================================== */}

            <div
              className="
                overflow-hidden
                rounded-[26px]
                border
                border-secondary
                bg-white
                shadow-[0_12px_32px_rgba(0,0,0,0.07)]
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
                      Appliance List
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-secondary
                      "
                    >
                      Appliance, brand, model and warranty details
                    </p>
                  </div>

                  <span
                    className="
                      inline-flex
                      w-fit
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-secondary
                      bg-white
                      px-3
                      py-1.5
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-secondary
                    "
                  >
 
                    Live Data
                  </span>
                </div>
              </div>

              {/* Table */}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px]">
                  <thead>
                    <tr
                      className="
                        border-b
                        border-accent
                        bg-background
                      "
                    >
                      {[
                        "Appliance",
                        "Created By",
                        "Brand",
                        "Model",
                        "Warranty",
                        "Purchase",
                        "Expiry",
                        "Created",
                      ].map((h, i) => (
                        <th
                          key={h}
                          className={`
                            px-5
                            py-4
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-secondary
                            ${i === 7 ? "text-right" : "text-left"}
                          `}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {appliance?.map((item, index) => {
                      const warranty = getWarrantyStatus(item);

                      return (
                        <tr
                          key={item?._id || index}
                          onClick={() => openAppliance(item)}
                          className="
                              group
                              cursor-pointer
                              border-b
                              border-accent/40
                              transition-colors
                              duration-200
                              last:border-b-0
                              hover:bg-background
                            "
                        >
                          {/* Appliance */}

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
                                    relative
                                    flex
                                    h-[58px]
                                    w-[58px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    rounded-[16px]
                                    border
                                    border-secondary
                                    bg-background
                                  "
                              >
                                <img
                                  src={
                                    item?.model?.attachment ||
                                    getDeviceImage(item)
                                  }
                                  alt={item?.model?.modelName || "Appliance"}
                                  className="
                                      h-11
                                      w-11
                                      object-contain
                                      transition-transform
                                      duration-300
                                      group-hover:scale-105
                                    "
                                />

                                <div
                                  className="
                                      absolute
                                      bottom-1
                                      right-1
                                      h-2
                                      w-2
                                      rounded-full
                                      border
                                      border-white
                                      bg-primary
                                    "
                                />
                              </div>

                              <div className="min-w-0">
                                <p
                                  className="
                                      max-w-[180px]
                                      truncate
                                      text-xs
                                      font-extrabold
                                      text-primary
                                    "
                                >
                                  {item?.appliance?.applianceName ||
                                    item?.appliance?.deviceDetails
                                      ?.deviceName ||
                                    "--"}
                                </p>

                                <div
                                  className="
                                      mt-1
                                      flex
                                      items-center
                                      gap-1.5
                                    "
                                >
                                  <FaBoxOpen
                                    size={8}
                                    className="text-primary"
                                  />

                                  <span
                                    className="
                                        text-[9px]
                                        text-secondary
                                      "
                                  >
                                    Appliance
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Created By */}

                          <td className="px-5 py-4">
                            <div
                              className="
                                  flex
                                  items-center
                                  gap-2
                                "
                            >
                              <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-secondary
                                    bg-accent
                                    text-[10px]
                                    font-black
                                    text-primary
                                  "
                              >
                                {item?.createdBy?.userName
                                  ?.charAt(0)
                                  ?.toUpperCase() || "U"}
                              </div>

                              <div>
                                <div
                                  className="
                                      flex
                                      items-center
                                      gap-2
                                    "
                                >
                                  <span
                                    className="
                                        max-w-[105px]
                                        truncate
                                        text-xs
                                        font-bold
                                        text-secondary
                                      "
                                  >
                                    {item?.createdBy?.userName || "--"}
                                  </span>

                                  {item?.createdBy?._id && (
                                    <div onClick={(e) => e.stopPropagation()}>
                                      <Link
                                        to={`/user?userId=${item?.createdBy?._id}`}
                                        className="
                                            text-secondary
                                            transition-colors
                                            hover:text-primary
                                          "
                                      >
                                        <FaExternalLinkAlt size={8} />
                                      </Link>
                                    </div>
                                  )}
                                </div>

                                <span
                                  className="
                                      text-[9px]
                                      text-secondary
                                    "
                                >
                                  Owner
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Brand */}

                          <td className="px-5 py-4">
                            <span
                              className="
                                  inline-flex
                                  items-center
                                  rounded-lg
                                  border
                                  border-secondary
                                  bg-background
                                  px-3
                                  py-1.5
                                  text-[10px]
                                  font-extrabold
                                  text-primary
                                "
                            >
                              {item?.brand?.brandName || "--"}
                            </span>
                          </td>

                          {/* Model */}

                          <td className="px-5 py-4">
                            <div
                              className="
                                  flex
                                  items-center
                                  gap-2
                                "
                            >
                              <div
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-accent
                                    bg-background
                                    text-primary
                                  "
                              >
                                <HiOutlineCube size={13} />
                              </div>

                              <span
                                className="
                                    text-xs
                                    font-bold
                                    text-secondary
                                  "
                              >
                                {item?.model?.modelName || "--"}
                              </span>
                            </div>
                          </td>

                          {/* Warranty */}

                          <td className="px-5 py-4">
                            <span
                              className={`
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-full
                                  border
                                  px-2.5
                                  py-1.5
                                  text-[9px]
                                  font-extrabold
                                  ${warranty.cls}
                                `}
                            >
                              {warranty.icon}
                              {warranty.label}
                            </span>
                          </td>

                          {/* Purchase */}

                          <td className="px-5 py-4">
                            <div
                              className="
                                  flex
                                  items-center
                                  gap-2
                                "
                            >
                              <div
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-accent
                                    bg-background
                                    text-primary
                                  "
                              >
                                <FaCalendarAlt size={9} />
                              </div>

                              <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    text-secondary
                                  "
                              >
                                {item?.model?.dateOfPurchase &&
                                item?.model?.isWarrantyApproved === "approved"
                                  ? moment(item.model.dateOfPurchase).format(
                                      "DD MMM YYYY",
                                    )
                                  : "--"}
                              </span>
                            </div>
                          </td>

                          {/* Expiry */}

                          <td className="px-5 py-4">
                            <div
                              className="
                                  flex
                                  items-center
                                  gap-2
                                "
                            >
                              <div
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-accent
                                    bg-background
                                    text-primary
                                  "
                              >
                                <FaRegClock size={9} />
                              </div>

                              <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    text-secondary
                                  "
                              >
                                {item?.model?.extendUpto &&
                                item?.model?.isWarrantyApproved === "approved"
                                  ? moment(item.model.extendUpto).format(
                                      "DD MMM YYYY",
                                    )
                                  : "--"}
                              </span>
                            </div>
                          </td>

                          {/* Created */}

                          <td className="px-5 py-4">
                            <div
                              className="
                                  flex
                                  items-center
                                  justify-end
                                  gap-3
                                "
                            >
                              <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    text-secondary
                                  "
                              >
                                {item?.createdAt
                                  ? moment(item.createdAt).format("DD MMM YYYY")
                                  : "--"}
                              </span>

                              <div
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-accent
                                    bg-background
                                    text-primary
                                    transition-all
                                    duration-200
                                    group-hover:border-primary
                                    group-hover:bg-primary
                                    group-hover:text-white
                                  "
                              >
                                <FaChevronRight size={9} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Empty */}

              {appliance?.length === 0 && (
                <div
                  className="
                    flex
                    min-h-[280px]
                    flex-col
                    items-center
                    justify-center
                    bg-white
                  "
                >
                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-[20px]
                      border
                      border-secondary
                      bg-background
                      text-primary
                    "
                  >
                    <BsBox size={24} />
                  </div>

                  <p
                    className="
                      mt-4
                      text-[13px]
                      font-bold
                      text-primary
                    "
                  >
                    No Appliances Found
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-secondary
                    "
                  >
                    Add an appliance to start your collection
                  </p>

                  <button
                    type="button"
                    onClick={() => setCreateApplianceModal(true)}
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-secondary
                      bg-background
                      px-4
                      py-2
                      text-[10px]
                      font-bold
                      text-primary
                      transition
                      hover:bg-accent
                    "
                  >
                    <FaPlus size={9} />
                    Add Appliance
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* =====================================================
            CREATE APPLIANCE DRAWER
        ====================================================== */}

        <MuiDrawer
          open={createApplianceModal}
          onClose={() => setCreateApplianceModal(false)}
          drawerWidth="420px"
        >
          <div
            className="
              flex
              h-[var(--doc-height)]
              flex-col
              bg-background
            "
          >
            {/* Drawer Header */}

            <div
              className="
                relative
                overflow-hidden
                bg-primary
                px-5
                py-6
              "
            >
              {/* Header grid */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  opacity-[0.05]
                  [background-image:linear-gradient(#F8F8FA_1px,transparent_1px),linear-gradient(90deg,#F8F8FA_1px,transparent_1px)]
                  [background-size:24px_24px]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-14
                  -top-14
                  h-40
                  w-40
                  rounded-full
                  border
                  border-accent/30
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
                      items-center
                      justify-center
                      rounded-[14px]
                      border
                      border-secondary
                      bg-secondary
                      text-white
                    "
                  >
                    <LuComputer size={21} />
                  </div>

                  <div>
                    <p
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-accent
                      "
                    >
                      New Entry
                    </p>

                    <h2
                      className="
                        mt-1
                        text-lg
                        font-black
                        text-white
                      "
                    >
                      Create Appliance
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCreateApplianceModal(false)}
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-secondary
                    bg-secondary/50
                    text-lg
                    text-white
                    transition
                    hover:bg-secondary
                  "
                >
                  ×
                </button>
              </div>

              <p
                className="
                  relative
                  z-10
                  mt-4
                  max-w-[300px]
                  text-[10px]
                  leading-5
                  text-white/75
                "
              >
                Add appliance details to keep your collection organized.
              </p>
            </div>

            {/* Drawer Body */}

            <div
              className="
                flex-1
                overflow-y-auto
                px-5
                py-6
              "
            >
              <div className="space-y-5">
                {/* Appliance */}

                {mappedAppliance?.length > 0 && (
                  <div>
                    <label
                      className="
                        mb-2
                        block
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-secondary
                      "
                    >
                      Appliance
                    </label>

                    {applianceInput ? (
                      <input
                        value={applianceSelectedOption}
                        placeholder="Enter appliance name"
                        className="
                          default-input
                          w-full
                          rounded-xl
                          border
                          border-secondary
                          bg-white
                          px-3.5
                          py-3
                          text-sm
                          text-primary
                          outline-none
                          transition
                          placeholder:text-secondary
                          focus:border-primary
                          focus:ring-4
                          focus:ring-accent/50
                        "
                        onChange={(e) =>
                          setApplianceSelectedOption(e.target.value)
                        }
                      />
                    ) : (
                      <Dropdown
                        value={applianceSelectedOption}
                        placeholder="Select an appliance"
                        onSelect={handleApplianceSelect}
                        options={mappedAppliance.map(
                          (e) => e?.appliances?.applianceName,
                        )}
                        disabled={false}
                        optionsObject={mappedAppliance.map(
                          (e) => e?.appliances,
                        )}
                      />
                    )}
                  </div>
                )}

                {/* Brand */}

                {(brands?.length > 0 || brandInput) && (
                  <div>
                    <label
                      className="
                        mb-2
                        block
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-secondary
                      "
                    >
                      Brand
                    </label>

                    {brandInput ? (
                      <input
                        value={brandSelectedOption}
                        placeholder="Enter brand name"
                        className="
                          default-input
                          w-full
                          rounded-xl
                          border
                          border-secondary
                          bg-white
                          px-3.5
                          py-3
                          text-sm
                          text-primary
                          outline-none
                          transition
                          placeholder:text-secondary
                          focus:border-primary
                          focus:ring-4
                          focus:ring-accent/50
                        "
                        onChange={(e) => setBrandSelectedOption(e.target.value)}
                      />
                    ) : (
                      <Dropdown
                        value={brandSelectedOption}
                        placeholder="Select a brand"
                        onSelect={handleBrandSelect}
                        options={brands?.map((e) => e?.brandName)}
                        disabled={false}
                        optionsObject={brands}
                      />
                    )}
                  </div>
                )}

                {/* Model */}

                {(models?.length > 0 || brandInput) && (
                  <div>
                    <label
                      className="
      mb-2
      block
      text-[9px]
      font-black
      uppercase
      tracking-[0.15em]
      text-secondary
    "
                    >
                      Model
                    </label>

                    <input
                      value={modelValue}
                      placeholder="Enter model name"
                      className="
      default-input
      w-full
      rounded-xl
      border
      border-secondary
      bg-white
      px-3.5
      py-3
      text-sm
      text-primary
      outline-none
      transition
      placeholder:text-secondary
      focus:border-primary
      focus:ring-4
      focus:ring-accent/50
    "
                      onChange={(e) => setModelValue(e.target.value)}
                    />
                  </div>
                )}

                {/* Image */}

                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.15em]
                      text-secondary
                    "
                  >
                    Appliance Image
                  </label>

                  <input
                    className="hidden"
                    id="appliance-img"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <label
                    htmlFor="appliance-img"
                    className="group block cursor-pointer"
                  >
                    <div
                      className="
                        relative
                        flex
                        min-h-[190px]
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-[20px]
                        border-2
                        border-dashed
                        border-secondary
                        bg-white
                        transition-all
                        duration-300
                        group-hover:border-primary
                        group-hover:bg-background
                      "
                    >
                      {applianceImage.image ? (
                        <>
                          <img
                            src={applianceImage.image}
                            alt={applianceImage.fileName}
                            className="
                              max-h-[185px]
                              w-full
                              object-contain
                              p-5
                            "
                          />

                          <div
                            className="
                              absolute
                              bottom-3
                              rounded-full
                              bg-primary
                              px-3
                              py-1.5
                              text-[9px]
                              font-bold
                              text-white
                              opacity-0
                              transition
                              group-hover:opacity-100
                            "
                          >
                            Change image
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <div
                            className="
                              mx-auto
                              flex
                              h-16
                              w-16
                              items-center
                              justify-center
                              rounded-[20px]
                              border
                              border-secondary
                              bg-background
                              text-primary
                              transition-transform
                              duration-300
                              group-hover:scale-105
                            "
                          >
                            <MdAddPhotoAlternate size={31} />
                          </div>

                          <p
                            className="
                              mt-3
                              text-xs
                              font-extrabold
                              text-primary
                            "
                          >
                            Upload appliance image
                          </p>

                          <p
                            className="
                              mt-1
                              text-[10px]
                              text-secondary
                            "
                          >
                            Click to browse your files
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}

            <div
              className="
                border-t
                border-secondary
                bg-white
                px-5
                py-4
              "
            >
              <button
                type="button"
                disabled={
                  !applianceSelectedOption ||
                  !brandSelectedOption ||
                  !modelValue
                }
                onClick={handleCreateAppliance}
                className="
                  group
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-primary
                  text-xs
                  font-extrabold
                  text-white
                  shadow-[0_8px_18px_rgba(0,0,0,0.16)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-secondary
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  disabled:hover:translate-y-0
                "
              >
                <FaPlus
                  size={9}
                  className="
                    transition-transform
                    duration-300
                    group-hover:rotate-90
                  "
                />
                Create Appliance
              </button>

              <p
                className="
                  mt-2
                  text-center
                  text-[9px]
                  text-secondary
                "
              >
                All appliance information will be added to your collection.
              </p>
            </div>
          </div>
        </MuiDrawer>
      </AnimatedContent>

      {/* =========================================================
          LOADER
      ========================================================= */}

      <BackdropProgressLoader
        value={loadingPercentage}
        status={loadingStatus}
      />
    </>
  );
};

export default Appliance;

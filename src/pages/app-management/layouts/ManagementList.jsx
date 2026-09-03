
// import AdminServices from "@/services/AdminServices";
// import { DecryptData } from "@/utils/DecryptData";
// import { notifyError, notifySuccess } from "@/utils/toast";
// import moment from "moment";
// import React, { useEffect, useState } from "react";

// import { MdAddchart, MdOutlineDelete } from "react-icons/md";
// import {
//   FaTag,
//   FaRegNewspaper,
//   FaPercent,
//   FaTicketAlt,
// } from "react-icons/fa";
// import { FiEdit2 } from "react-icons/fi";
// import { IoCalendarOutline } from "react-icons/io5";

// import AlertDialog from "@/components/common/AlterDialogBox";
// import AnimatedContent from "@/components/common/AnimatedContent";

// /* ============================================================
//    THEME
// ============================================================ */

// const THEME = {
//   primary: "#AD8B73",
//   secondary: "#CEAB93",
//   border: "#E3CAA5",
//   cream: "#FFFBE9",

//   text: "#59483D",
//   textDark: "#4F4037",
//   textMuted: "#75665C",

//   white: "#FFFFFF",
// };

// /* ============================================================
//    MANAGEMENT LIST
// ============================================================ */

// const ManagementList = ({
//   isDispatch,
//   setFilterDragger,
//   currentLink,
//   setEditValue,
//   filterDragger,
// }) => {
//   const [data, setData] = useState([]);

//   /* =========================================================
//      GET MANAGEMENT LIST
//   ========================================================= */

//   const getManagementList = () => {
//     if (currentLink === "Offers") {
//       AdminServices.getOffers()
//         .then((res) => {
//           const d = DecryptData(res);
//           setData(d?.data?.offers || []);
//         })
//         .catch((err) => {
//           const d = DecryptData(err?.response?.data);
//           notifyError(
//             d?.error?.message || "Unable to load offers"
//           );
//         });
//     }

//     if (currentLink === "Blogs") {
//       AdminServices.getBlogs()
//         .then((res) => {
//           const d = DecryptData(res);
//           setData(d?.data?.blogs || []);
//         })
//         .catch((err) => {
//           const d = DecryptData(err?.response?.data);
//           notifyError(
//             d?.error?.message || "Unable to load blogs"
//           );
//         });
//     }
//   };

//   /* =========================================================
//      DELETE
//   ========================================================= */

//   const handleDelete = (_id) => {
//     const isBlog = currentLink === "Blogs";

//     const deleteCall = isBlog
//       ? AdminServices.deleteBlog(_id)
//       : AdminServices.deleteOffer(_id);

//     const label = isBlog ? "Blog" : "Offer";

//     deleteCall
//       .then(() => {
//         notifySuccess(`${label} deleted successfully`);
//         getManagementList();
//       })
//       .catch((err) => {
//         const d = DecryptData(err?.response?.data);

//         notifyError(
//           d?.error?.message || `Unable to delete ${label.toLowerCase()}`
//         );
//       });
//   };

//   /* =========================================================
//      FETCH DATA
//   ========================================================= */

//   useEffect(() => {
//     getManagementList();
//   }, [isDispatch, currentLink]);

//   /* =========================================================
//      RESET EDIT VALUE WHEN DRAWER CLOSES
//   ========================================================= */

//   useEffect(() => {
//     if (!filterDragger) {
//       setEditValue({});
//     }
//   }, [filterDragger, setEditValue]);

//   const isOffer = currentLink === "Offers";

//   return (
//     <AnimatedContent>
//       <div
//         className="
//           mb-6
//           overflow-hidden
//           rounded-[24px]
//           bg-white
//           shadow-[0_8px_30px_rgba(89,72,61,0.07)]
//         "
//         style={{
//           border: `1px solid ${THEME.border}`,
//         }}
//       >
//         {/* =====================================================
//             HEADER
//         ====================================================== */}

//         <div
//           className="
//             flex
//             flex-col
//             gap-4
//             px-6
//             py-5
//             sm:flex-row
//             sm:items-center
//             sm:justify-between
//           "
//           style={{
//             borderBottom: `1px solid ${THEME.border}`,
//           }}
//         >
//           {/* LEFT */}

//           <div className="flex items-center gap-3">
//             {/* ICON */}

//             <div
//               className="
//                 flex
//                 h-11
//                 w-11
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-[14px]
//               "
//               style={{
//                 backgroundColor: THEME.cream,
//                 color: THEME.primary,
//                 border: `1px solid ${THEME.border}`,
//               }}
//             >
//               {isOffer ? (
//                 <FaTag size={17} />
//               ) : (
//                 <FaRegNewspaper size={17} />
//               )}
//             </div>

//             {/* TITLE */}

//             <div>
//               <h2
//                 className="
//                   text-[16px]
//                   font-extrabold
//                   tracking-[-0.01em]
//                 "
//                 style={{
//                   color: THEME.text,
//                 }}
//               >
//                 {isOffer ? "Offer List" : "Blog List"}
//               </h2>

//               <p
//                 className="
//                   mt-0.5
//                   text-[11px]
//                   font-medium
//                 "
//                 style={{
//                   color: THEME.textMuted,
//                 }}
//               >
//                 {data?.length || 0}{" "}
//                 {isOffer
//                   ? "active offers"
//                   : "published blogs"}
//               </p>
//             </div>
//           </div>

//           {/* CREATE BUTTON */}

//           <button
//             type="button"
//             onClick={() => {
//               setEditValue({});
//               setFilterDragger(true);
//             }}
//             className="
//               group
//               flex
//               h-10
//               items-center
//               justify-center
//               gap-2
//               rounded-xl
//               px-4
//               text-[12px]
//               font-extrabold
//               text-white
//               transition-all
//               duration-200
//               hover:-translate-y-[1px]
//               active:translate-y-0
//             "
//             style={{
//               backgroundColor: THEME.primary,
//               boxShadow:
//                 "0 6px 16px rgba(173,139,115,0.22)",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor =
//                 THEME.text;
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor =
//                 THEME.primary;
//             }}
//           >
//             <MdAddchart
//               size={16}
//               className="
//                 transition-transform
//                 duration-200
//                 group-hover:scale-110
//               "
//             />

//             Create {isOffer ? "Offer" : "Blog"}
//           </button>
//         </div>

//         {/* =====================================================
//             CONTENT
//         ====================================================== */}

//         <div className="p-5">
//           {/* EMPTY STATE */}

//           {!data || data.length === 0 ? (
//             <div
//               className="
//                 flex
//                 min-h-[320px]
//                 flex-col
//                 items-center
//                 justify-center
//                 rounded-[18px]
//               "
//               style={{
//                 border: `1px dashed ${THEME.border}`,
//                 backgroundColor: THEME.cream,
//               }}
//             >
//               {/* EMPTY ICON */}

//               <div
//                 className="
//                   flex
//                   h-16
//                   w-16
//                   items-center
//                   justify-center
//                   rounded-[18px]
//                 "
//                 style={{
//                   backgroundColor: THEME.white,
//                   color: THEME.primary,
//                   border: `1px solid ${THEME.border}`,
//                 }}
//               >
//                 {isOffer ? (
//                   <FaTag size={25} />
//                 ) : (
//                   <FaRegNewspaper size={25} />
//                 )}
//               </div>

//               <p
//                 className="
//                   mt-4
//                   text-[13px]
//                   font-extrabold
//                 "
//                 style={{
//                   color: THEME.text,
//                 }}
//               >
//                 No {isOffer ? "offers" : "blogs"} yet
//               </p>

//               <p
//                 className="
//                   mt-1
//                   text-[11px]
//                   font-medium
//                 "
//                 style={{
//                   color: THEME.secondary,
//                 }}
//               >
//                 Create your first{" "}
//                 {isOffer ? "offer" : "blog"} to get started
//               </p>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setEditValue({});
//                   setFilterDragger(true);
//                 }}
//                 className="
//                   mt-4
//                   flex
//                   items-center
//                   gap-2
//                   rounded-xl
//                   px-4
//                   py-2
//                   text-[11px]
//                   font-bold
//                   transition-all
//                   duration-200
//                   hover:-translate-y-[1px]
//                 "
//                 style={{
//                   backgroundColor: THEME.white,
//                   color: THEME.primary,
//                   border: `1px solid ${THEME.border}`,
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor =
//                     THEME.primary;
//                   e.currentTarget.style.color =
//                     THEME.white;
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor =
//                     THEME.white;
//                   e.currentTarget.style.color =
//                     THEME.primary;
//                 }}
//               >
//                 <MdAddchart size={14} />

//                 Create {isOffer ? "Offer" : "Blog"}
//               </button>
//             </div>
//           ) : (
//             /* =================================================
//                CARDS
//             ================================================= */

//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-5
//                 sm:grid-cols-2
//                 lg:grid-cols-3
//               "
//             >
//               {data.map((item) => {
//                 const title = isOffer
//                   ? item?.offerName
//                   : item?.blogTitle;

//                 const desc = isOffer
//                   ? item?.offerDescription
//                   : item?.blogDescription;

//                 const image = isOffer
//                   ? item?.offerImage
//                   : item?.blogImage;

//                 const dateLabel = isOffer
//                   ? `${moment(
//                       item?.offerStartDate
//                     ).format("DD MMM")} – ${moment(
//                       item?.offerEndDate
//                     ).format("DD MMM YYYY")}`
//                   : moment(item?.createdAt).format(
//                       "DD MMM YYYY"
//                     );

//                 return (
//                   <div
//                     key={item?._id}
//                     className="
//                       group
//                       relative
//                       overflow-hidden
//                       rounded-[20px]
//                       bg-white
//                       transition-all
//                       duration-300
//                       hover:-translate-y-1
//                     "
//                     style={{
//                       border: `1px solid ${THEME.border}`,
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.borderColor =
//                         THEME.secondary;
//                       e.currentTarget.style.boxShadow =
//                         "0 16px 35px rgba(89,72,61,0.10)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.borderColor =
//                         THEME.border;
//                       e.currentTarget.style.boxShadow =
//                         "none";
//                     }}
//                   >
//                     {/* =================================================
//                         IMAGE
//                     ================================================== */}

//                     <div
//                       className="
//                         relative
//                         h-[180px]
//                         w-full
//                         overflow-hidden
//                       "
//                       style={{
//                         backgroundColor: THEME.cream,
//                       }}
//                     >
//                       {image ? (
//                         <img
//                           src={image}
//                           alt={
//                             title || "Management"
//                           }
//                           className="
//                             h-full
//                             w-full
//                             object-cover
//                             transition-transform
//                             duration-500
//                             group-hover:scale-[1.05]
//                           "
//                         />
//                       ) : (
//                         <div
//                           className="
//                             flex
//                             h-full
//                             w-full
//                             items-center
//                             justify-center
//                           "
//                           style={{
//                             backgroundColor:
//                               THEME.cream,
//                           }}
//                         >
//                           <div
//                             className="
//                               flex
//                               h-14
//                               w-14
//                               items-center
//                               justify-center
//                               rounded-2xl
//                             "
//                             style={{
//                               backgroundColor:
//                                 THEME.white,
//                               color: THEME.primary,
//                               border: `1px solid ${THEME.border}`,
//                             }}
//                           >
//                             {isOffer ? (
//                               <FaTag size={24} />
//                             ) : (
//                               <FaRegNewspaper
//                                 size={24}
//                               />
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {/* IMAGE OVERLAY */}

//                       <div
//                         className="
//                           pointer-events-none
//                           absolute
//                           inset-x-0
//                           bottom-0
//                           h-20
//                           bg-gradient-to-t
//                           from-black/20
//                           to-transparent
//                           opacity-0
//                           transition-opacity
//                           duration-300
//                           group-hover:opacity-100
//                         "
//                       />

//                       {/* TYPE BADGE */}

//                       <div className="absolute left-3 top-3">
//                         <span
//                           className="
//                             inline-flex
//                             items-center
//                             gap-1.5
//                             rounded-full
//                             px-2.5
//                             py-1
//                             text-[9px]
//                             font-extrabold
//                             shadow-sm
//                             backdrop-blur-sm
//                           "
//                           style={{
//                             color: THEME.text,
//                             backgroundColor:
//                               "rgba(255,255,255,0.95)",
//                             border: `1px solid ${THEME.border}`,
//                           }}
//                         >
//                           {isOffer ? (
//                             <FaTag size={8} />
//                           ) : (
//                             <FaRegNewspaper size={8} />
//                           )}

//                           {isOffer
//                             ? "OFFER"
//                             : "BLOG"}
//                         </span>
//                       </div>
//                     </div>

//                     {/* =================================================
//                         CARD CONTENT
//                     ================================================== */}

//                     <div className="p-4">
//                       {/* TITLE */}

//                       <h3
//                         className="
//                           truncate
//                           text-[13px]
//                           font-extrabold
//                         "
//                         style={{
//                           color: THEME.text,
//                         }}
//                       >
//                         {title || "--"}
//                       </h3>

//                       {/* DESCRIPTION */}

//                       <p
//                         className="
//                           mt-1.5
//                           line-clamp-2
//                           min-h-[32px]
//                           text-[11px]
//                           font-medium
//                           leading-[1.55]
//                         "
//                         style={{
//                           color: THEME.textMuted,
//                         }}
//                       >
//                         {desc || "--"}
//                       </p>

//                       {/* =================================================
//                           OFFER META
//                       ================================================== */}

//                       {isOffer && (
//                         <div className="mt-3 flex min-h-[24px] flex-wrap gap-1.5">
//                           {/* COUPON */}

//                           {item?.couponCode && (
//                             <span
//                               className="
//                                 inline-flex
//                                 items-center
//                                 gap-1
//                                 rounded-lg
//                                 px-2
//                                 py-1
//                                 text-[9px]
//                                 font-bold
//                               "
//                               style={{
//                                 border: `1px solid ${THEME.border}`,
//                                 backgroundColor:
//                                   THEME.cream,
//                                 color: THEME.text,
//                               }}
//                             >
//                               <FaTicketAlt
//                                 size={8}
//                                 style={{
//                                   color: THEME.primary,
//                                 }}
//                               />

//                               {item.couponCode}
//                             </span>
//                           )}

//                           {/* PERCENTAGE */}

//                           {item?.offerBy?.percentage && (
//                             <span
//                               className="
//                                 inline-flex
//                                 items-center
//                                 gap-1
//                                 rounded-lg
//                                 px-2
//                                 py-1
//                                 text-[9px]
//                                 font-bold
//                               "
//                               style={{
//                                 border: `1px solid ${THEME.border}`,
//                                 backgroundColor:
//                                   THEME.cream,
//                                 color: THEME.primary,
//                               }}
//                             >
//                               <FaPercent size={8} />

//                               {item.offerBy.percentage}%
//                               {" "}off
//                             </span>
//                           )}

//                           {/* FLAT PRICE */}

//                           {item?.offerBy?.flatPrice && (
//                             <span
//                               className="
//                                 inline-flex
//                                 items-center
//                                 gap-1
//                                 rounded-lg
//                                 px-2
//                                 py-1
//                                 text-[9px]
//                                 font-bold
//                               "
//                               style={{
//                                 border: `1px solid ${THEME.border}`,
//                                 backgroundColor:
//                                   THEME.cream,
//                                 color: THEME.primary,
//                               }}
//                             >
//                               Flat{" "}
//                               {item.offerBy.flatPrice}{" "}
//                               off
//                             </span>
//                           )}

//                           {/* SERVICE MODE */}

//                           {item?.restrictedServiceMode &&
//                             item.restrictedServiceMode !==
//                               "none" && (
//                               <span
//                                 className="
//                                   inline-flex
//                                   items-center
//                                   gap-1
//                                   rounded-lg
//                                   px-2
//                                   py-1
//                                   text-[9px]
//                                   font-bold
//                                   capitalize
//                                 "
//                                 style={{
//                                   border: `1px solid ${THEME.border}`,
//                                   backgroundColor:
//                                     THEME.white,
//                                   color:
//                                     THEME.textMuted,
//                                 }}
//                               >
//                                 {
//                                   item.restrictedServiceMode
//                                 }
//                               </span>
//                             )}
//                         </div>
//                       )}

//                       {/* =================================================
//                           FOOTER
//                       ================================================== */}

//                       <div
//                         className="
//                           mt-4
//                           flex
//                           items-center
//                           justify-between
//                           pt-3
//                         "
//                         style={{
//                           borderTop: `1px solid ${THEME.border}`,
//                         }}
//                       >
//                         {/* DATE */}

//                         <div
//                           className="
//                             flex
//                             min-w-0
//                             items-center
//                             gap-1.5
//                             text-[9px]
//                             font-semibold
//                           "
//                           style={{
//                             color: THEME.secondary,
//                           }}
//                         >
//                           <IoCalendarOutline
//                             size={12}
//                             className="shrink-0"
//                           />

//                           <span className="truncate">
//                             {dateLabel}
//                           </span>
//                         </div>

//                         {/* ACTIONS */}

//                         <div className="flex shrink-0 items-center gap-1.5">
//                           {/* DELETE */}

//                           <AlertDialog
//                             onAgree={() =>
//                               handleDelete(item?._id)
//                             }
//                             dialogTitle={`Delete ${
//                               isOffer
//                                 ? "Offer"
//                                 : "Blog"
//                             }?`}
//                             dialogDetails={`Are you sure you want to delete this ${
//                               isOffer
//                                 ? "offer"
//                                 : "blog"
//                             }? This cannot be undone.`}
//                             AgreeButtonValue="Yes, Delete!"
//                             CancelButton="Cancel"
//                             triggerButton={(onClick) => (
//                               <button
//                                 type="button"
//                                 onClick={onClick}
//                                 className="
//                                   flex
//                                   h-8
//                                   w-8
//                                   items-center
//                                   justify-center
//                                   rounded-lg
//                                   bg-white
//                                   transition-all
//                                   duration-200
//                                 "
//                                 style={{
//                                   border: `1px solid ${THEME.border}`,
//                                   color: THEME.textMuted,
//                                 }}
//                                 onMouseEnter={(e) => {
//                                   e.currentTarget.style.backgroundColor =
//                                     THEME.cream;
//                                   e.currentTarget.style.borderColor =
//                                     THEME.secondary;
//                                   e.currentTarget.style.color =
//                                     THEME.primary;
//                                 }}
//                                 onMouseLeave={(e) => {
//                                   e.currentTarget.style.backgroundColor =
//                                     THEME.white;
//                                   e.currentTarget.style.borderColor =
//                                     THEME.border;
//                                   e.currentTarget.style.color =
//                                     THEME.textMuted;
//                                 }}
//                                 title="Delete"
//                               >
//                                 <MdOutlineDelete
//                                   size={15}
//                                 />
//                               </button>
//                             )}
//                           />

//                           {/* EDIT */}

//                           <button
//                             type="button"
//                             onClick={() => {
//                               setEditValue(item);
//                               setFilterDragger(true);
//                             }}
//                             className="
//                               flex
//                               h-8
//                               w-8
//                               items-center
//                               justify-center
//                               rounded-lg
//                               bg-white
//                               transition-all
//                               duration-200
//                             "
//                             style={{
//                               border: `1px solid ${THEME.border}`,
//                               color: THEME.textMuted,
//                             }}
//                             onMouseEnter={(e) => {
//                               e.currentTarget.style.backgroundColor =
//                                 THEME.cream;
//                               e.currentTarget.style.borderColor =
//                                 THEME.secondary;
//                               e.currentTarget.style.color =
//                                 THEME.primary;
//                             }}
//                             onMouseLeave={(e) => {
//                               e.currentTarget.style.backgroundColor =
//                                 THEME.white;
//                               e.currentTarget.style.borderColor =
//                                 THEME.border;
//                               e.currentTarget.style.color =
//                                 THEME.textMuted;
//                             }}
//                             title="Edit"
//                           >
//                             <FiEdit2 size={13} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* =================================================
//                         BOTTOM ACCENT
//                     ================================================== */}

//                     <div
//                       className="
//                         absolute
//                         bottom-0
//                         left-5
//                         right-5
//                         h-[2px]
//                         overflow-hidden
//                         rounded-full
//                       "
//                       style={{
//                         backgroundColor: THEME.cream,
//                       }}
//                     >
//                       <div
//                         className="
//                           h-full
//                           w-0
//                           rounded-full
//                           transition-all
//                           duration-500
//                           group-hover:w-full
//                         "
//                         style={{
//                           backgroundColor: THEME.primary,
//                         }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </AnimatedContent>
//   );
// };

// export default ManagementList;



























import AdminServices from "@/services/AdminServices";
import { DecryptData } from "@/utils/DecryptData";
import { notifyError, notifySuccess } from "@/utils/toast";
import moment from "moment";
import React, { useEffect, useState } from "react";

import { MdAddchart, MdOutlineDelete } from "react-icons/md";
import {
  FaTag,
  FaRegNewspaper,
  FaPercent,
  FaTicketAlt,
} from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";

import AlertDialog from "@/components/common/AlterDialogBox";
import AnimatedContent from "@/components/common/AnimatedContent";

/* ============================================================
   MANAGEMENT LIST
============================================================ */

const ManagementList = ({
  isDispatch,
  setFilterDragger,
  currentLink,
  setEditValue,
  filterDragger,
}) => {
  const [data, setData] = useState([]);

  /* =========================================================
     GET MANAGEMENT LIST
  ========================================================= */

  const getManagementList = () => {
    if (currentLink === "Offers") {
      AdminServices.getOffers()
        .then((res) => {
          const d = DecryptData(res);
          setData(d?.data?.offers || []);
        })
        .catch((err) => {
          const d = DecryptData(err?.response?.data);

          notifyError(
            d?.error?.message || "Unable to load offers"
          );
        });
    }

    if (currentLink === "Blogs") {
      AdminServices.getBlogs()
        .then((res) => {
          const d = DecryptData(res);
          setData(d?.data?.blogs || []);
        })
        .catch((err) => {
          const d = DecryptData(err?.response?.data);

          notifyError(
            d?.error?.message || "Unable to load blogs"
          );
        });
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = (_id) => {
    const isBlog = currentLink === "Blogs";

    const deleteCall = isBlog
      ? AdminServices.deleteBlog(_id)
      : AdminServices.deleteOffer(_id);

    const label = isBlog ? "Blog" : "Offer";

    deleteCall
      .then(() => {
        notifySuccess(`${label} deleted successfully`);
        getManagementList();
      })
      .catch((err) => {
        const d = DecryptData(err?.response?.data);

        notifyError(
          d?.error?.message ||
            `Unable to delete ${label.toLowerCase()}`
        );
      });
  };

  /* =========================================================
     FETCH DATA
  ========================================================= */

  useEffect(() => {
    getManagementList();
  }, [isDispatch, currentLink]);

  /* =========================================================
     RESET EDIT VALUE WHEN DRAWER CLOSES
  ========================================================= */

  useEffect(() => {
    if (!filterDragger) {
      setEditValue({});
    }
  }, [filterDragger, setEditValue]);

  const isOffer = currentLink === "Offers";

  return (
    <AnimatedContent>
      <div
        className="
          mb-6
          overflow-hidden
          rounded-[24px]
          border
          border-accent
          bg-white
          shadow-sm
        "
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-accent
            px-6
            py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="flex items-center gap-3">
            {/* ICON */}

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-[14px]
                border
                border-accent
                bg-background
                text-primary
              "
            >
              {isOffer ? (
                <FaTag size={17} />
              ) : (
                <FaRegNewspaper size={17} />
              )}
            </div>

            {/* TITLE */}

            <div>
              <h2
                className="
                  text-[16px]
                  font-extrabold
                  tracking-[-0.01em]
                  text-primary
                "
              >
                {isOffer ? "Offer List" : "Blog List"}
              </h2>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  font-medium
                  text-secondary
                "
              >
                {data?.length || 0}{" "}
                {isOffer
                  ? "active offers"
                  : "published blogs"}
              </p>
            </div>
          </div>

          {/* CREATE BUTTON */}

          <button
            type="button"
            onClick={() => {
              setEditValue({});
              setFilterDragger(true);
            }}
            className="
              group
              flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-primary
              px-4
              text-[12px]
              font-extrabold
              text-white
              transition-all
              duration-200
              hover:-translate-y-[1px]
              hover:bg-secondary
              active:translate-y-0
            "
          >
            <MdAddchart
              size={16}
              className="
                transition-transform
                duration-200
                group-hover:scale-110
              "
            />

            Create {isOffer ? "Offer" : "Blog"}
          </button>
        </div>

        {/* =================================================
            CONTENT
        ================================================== */}

        <div className="bg-white p-5">
          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {!data || data.length === 0 ? (
            <div
              className="
                flex
                min-h-[320px]
                flex-col
                items-center
                justify-center
                rounded-[18px]
                border
                border-dashed
                border-accent
                bg-background
              "
            >
              {/* EMPTY ICON */}

              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-[18px]
                  border
                  border-accent
                  bg-white
                  text-primary
                "
              >
                {isOffer ? (
                  <FaTag size={25} />
                ) : (
                  <FaRegNewspaper size={25} />
                )}
              </div>

              {/* EMPTY TITLE */}

              <p
                className="
                  mt-4
                  text-[13px]
                  font-extrabold
                  text-primary
                "
              >
                No {isOffer ? "offers" : "blogs"} yet
              </p>

              {/* EMPTY DESCRIPTION */}

              <p
                className="
                  mt-1
                  text-[11px]
                  font-medium
                  text-secondary
                "
              >
                Create your first{" "}
                {isOffer ? "offer" : "blog"} to get started
              </p>

              {/* CREATE BUTTON */}

              <button
                type="button"
                onClick={() => {
                  setEditValue({});
                  setFilterDragger(true);
                }}
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-accent
                  bg-white
                  px-4
                  py-2
                  text-[11px]
                  font-bold
                  text-primary
                  transition-all
                  duration-200
                  hover:-translate-y-[1px]
                  hover:bg-primary
                  hover:text-white
                "
              >
                <MdAddchart size={14} />

                Create {isOffer ? "Offer" : "Blog"}
              </button>
            </div>
          ) : (
            /* =================================================
               CARDS
            ================================================= */

            <div
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {data.map((item) => {
                const title = isOffer
                  ? item?.offerName
                  : item?.blogTitle;

                const desc = isOffer
                  ? item?.offerDescription
                  : item?.blogDescription;

                const image = isOffer
                  ? item?.offerImage
                  : item?.blogImage;

                const dateLabel = isOffer
                  ? `${moment(
                      item?.offerStartDate
                    ).format("DD MMM")} – ${moment(
                      item?.offerEndDate
                    ).format("DD MMM YYYY")}`
                  : moment(item?.createdAt).format(
                      "DD MMM YYYY"
                    );

                return (
                  <div
                    key={item?._id}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-[20px]
                      border
                      border-accent
                      bg-white
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-secondary
                      hover:shadow-md
                    "
                  >
                    {/* =================================================
                        IMAGE
                    ================================================== */}

                    <div
                      className="
                        relative
                        h-[180px]
                        w-full
                        overflow-hidden
                        bg-background
                      "
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={title || "Management"}
                          className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-[1.05]
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            bg-background
                          "
                        >
                          <div
                            className="
                              flex
                              h-14
                              w-14
                              items-center
                              justify-center
                              rounded-2xl
                              border
                              border-accent
                              bg-white
                              text-primary
                            "
                          >
                            {isOffer ? (
                              <FaTag size={24} />
                            ) : (
                              <FaRegNewspaper size={24} />
                            )}
                          </div>
                        </div>
                      )}

                      {/* IMAGE OVERLAY */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-x-0
                          bottom-0
                          h-20
                          bg-gradient-to-t
                          from-black/20
                          to-transparent
                          opacity-0
                          transition-opacity
                          duration-300
                          group-hover:opacity-100
                        "
                      />

                      {/* TYPE BADGE */}

                      <div className="absolute left-3 top-3">
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-accent
                            bg-white
                            px-2.5
                            py-1
                            text-[9px]
                            font-extrabold
                            text-primary
                            shadow-sm
                          "
                        >
                          {isOffer ? (
                            <FaTag size={8} />
                          ) : (
                            <FaRegNewspaper size={8} />
                          )}

                          {isOffer ? "OFFER" : "BLOG"}
                        </span>
                      </div>
                    </div>

                    {/* =================================================
                        CARD CONTENT
                    ================================================== */}

                    <div className="p-4">
                      {/* TITLE */}

                      <h3
                        className="
                          truncate
                          text-[13px]
                          font-extrabold
                          text-primary
                        "
                      >
                        {title || "--"}
                      </h3>

                      {/* DESCRIPTION */}

                      <p
                        className="
                          mt-1.5
                          line-clamp-2
                          min-h-[32px]
                          text-[11px]
                          font-medium
                          leading-[1.55]
                          text-secondary
                        "
                      >
                        {desc || "--"}
                      </p>

                      {/* =================================================
                          OFFER META
                      ================================================== */}

                      {isOffer && (
                        <div className="mt-3 flex min-h-[24px] flex-wrap gap-1.5">
                          {/* COUPON */}

                          {item?.couponCode && (
                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-lg
                                border
                                border-accent
                                bg-background
                                px-2
                                py-1
                                text-[9px]
                                font-bold
                                text-primary
                              "
                            >
                              <FaTicketAlt
                                size={8}
                                className="text-primary"
                              />

                              {item.couponCode}
                            </span>
                          )}

                          {/* PERCENTAGE */}

                          {item?.offerBy?.percentage && (
                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-lg
                                border
                                border-accent
                                bg-background
                                px-2
                                py-1
                                text-[9px]
                                font-bold
                                text-primary
                              "
                            >
                              <FaPercent size={8} />

                              {item.offerBy.percentage}% off
                            </span>
                          )}

                          {/* FLAT PRICE */}

                          {item?.offerBy?.flatPrice && (
                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-lg
                                border
                                border-accent
                                bg-background
                                px-2
                                py-1
                                text-[9px]
                                font-bold
                                text-primary
                              "
                            >
                              Flat{" "}
                              {item.offerBy.flatPrice} off
                            </span>
                          )}

                          {/* SERVICE MODE */}

                          {item?.restrictedServiceMode &&
                            item.restrictedServiceMode !==
                              "none" && (
                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-1
                                  rounded-lg
                                  border
                                  border-accent
                                  bg-white
                                  px-2
                                  py-1
                                  text-[9px]
                                  font-bold
                                  capitalize
                                  text-secondary
                                "
                              >
                                {item.restrictedServiceMode}
                              </span>
                            )}
                        </div>
                      )}

                      {/* =================================================
                          FOOTER
                      ================================================== */}

                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          border-t
                          border-accent
                          pt-3
                        "
                      >
                        {/* DATE */}

                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-1.5
                            text-[9px]
                            font-semibold
                            text-secondary
                          "
                        >
                          <IoCalendarOutline
                            size={12}
                            className="shrink-0"
                          />

                          <span className="truncate">
                            {dateLabel}
                          </span>
                        </div>

                        {/* ACTIONS */}

                        <div className="flex shrink-0 items-center gap-1.5">
                          {/* DELETE */}

                          <AlertDialog
                            onAgree={() =>
                              handleDelete(item?._id)
                            }
                            dialogTitle={`Delete ${
                              isOffer ? "Offer" : "Blog"
                            }?`}
                            dialogDetails={`Are you sure you want to delete this ${
                              isOffer ? "offer" : "blog"
                            }? This cannot be undone.`}
                            AgreeButtonValue="Yes, Delete!"
                            CancelButton="Cancel"
                            triggerButton={(onClick) => (
                              <button
                                type="button"
                                onClick={onClick}
                                className="
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  rounded-lg
                                  border
                                  border-accent
                                  bg-white
                                  text-secondary
                                  transition-all
                                  duration-200
                                  hover:border-secondary
                                  hover:bg-background
                                  hover:text-primary
                                "
                                title="Delete"
                              >
                                <MdOutlineDelete size={15} />
                              </button>
                            )}
                          />

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() => {
                              setEditValue(item);
                              setFilterDragger(true);
                            }}
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-accent
                              bg-white
                              text-secondary
                              transition-all
                              duration-200
                              hover:border-secondary
                              hover:bg-background
                              hover:text-primary
                            "
                            title="Edit"
                          >
                            <FiEdit2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        BOTTOM ACCENT
                    ================================================== */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-5
                        right-5
                        h-[2px]
                        overflow-hidden
                        rounded-full
                        bg-background
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
              })}
            </div>
          )}
        </div>
      </div>
    </AnimatedContent>
  );
};

export default ManagementList;
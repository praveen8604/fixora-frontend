// import AdminServices from "@/services/AdminServices";
// import { DecryptData } from "@/utils/DecryptData";
// import { notifyError, notifySuccess } from "@/utils/toast";
// import moment from "moment";
// import React, { useEffect, useState } from "react";
// import { MdAddchart, MdOutlineDelete } from "react-icons/md";
// import { FaTag, FaRegNewspaper, FaPercent, FaTicketAlt } from "react-icons/fa";
// import { FiEdit2 } from "react-icons/fi";
// import { IoCalendarOutline } from "react-icons/io5";
// import AlertDialog from "@/components/common/AlterDialogBox";
// import AnimatedContent from "@/components/common/AnimatedContent";

// const ManagementList = ({ isDispatch, setFilterDragger, currentLink, setEditValue, filterDragger }) => {
//   const [data, setData] = useState([]);

//   const getManagementList = () => {
//     if (currentLink === "Offers") {
//       AdminServices.getOffers()
//         .then((res) => { const d = DecryptData(res); setData(d?.data?.offers || []); })
//         .catch((err) => { const d = DecryptData(err?.response?.data); notifyError(d?.error?.message); });
//     } else if (currentLink === "Blogs") {
//       AdminServices.getBlogs()
//         .then((res) => { const d = DecryptData(res); setData(d?.data?.blogs || []); })
//         .catch((err) => { const d = DecryptData(err?.response?.data); notifyError(d?.error?.message); });
//     }
//   };

//   const handleDelete = (_id) => {
//     const call = currentLink === "Blogs" ? AdminServices.deleteBlog(_id) : AdminServices.deleteOffer(_id);
//     const label = currentLink === "Blogs" ? "Blog" : "Offer";
//     call
//       .then(() => { notifySuccess(`${label} deleted successfully`); getManagementList(); })
//       .catch((err) => { const d = DecryptData(err?.response?.data); notifyError(d?.error?.message); });
//   };

//   useEffect(() => { getManagementList(); }, [isDispatch, currentLink]);
//   useEffect(() => { if (!filterDragger) setEditValue({}); }, [filterDragger]);

//   const isOffer = currentLink === "Offers";

//   return (
//     <AnimatedContent>
//       <div className="overflow-hidden rounded-[22px] border border-[#E4E8ED] bg-white shadow-[0_3px_12px_rgba(30,40,55,0.035)]">

//         {/* LIST HEADER */}
//         <div className="flex items-center justify-between border-b border-[#F0F2F5] px-6 py-4">
//           <div>
//             <h2 className="text-base font-bold text-[#282D35]">{isOffer ? "Offer" : "Blog"} List</h2>
//             <p className="mt-0.5 text-xs text-[#929AA5]">{data?.length || 0} {isOffer ? "active offers" : "published blogs"}</p>
//           </div>
//           <button onClick={() => setFilterDragger(true)}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#20242B] text-white text-sm font-bold transition hover:opacity-90 active:scale-95">
//             <MdAddchart size={16} />
//             Create {isOffer ? "Offer" : "Blog"}
//           </button>
//         </div>

//         {/* CONTENT */}
//         <div className="p-5">
//           {!data || data.length === 0 ? (
//             <div className="flex min-h-[300px] flex-col items-center justify-center">
//               <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F6F8]">
//                 {isOffer ? <FaTag size={22} className="text-[#A0A7B0]" /> : <FaRegNewspaper size={22} className="text-[#A0A7B0]" />}
//               </div>
//               <p className="mt-4 text-sm font-bold text-[#69727E]">No {isOffer ? "offers" : "blogs"} yet</p>
//               <p className="mt-1 text-xs text-[#9AA2AC]">Click "Create {isOffer ? "Offer" : "Blog"}" to get started</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {data.map((item) => {
//                 const title = isOffer ? item?.offerName : item?.blogTitle;
//                 const desc = isOffer ? item?.offerDescription : item?.blogDescription;
//                 const image = isOffer ? item?.offerImage : item?.blogImage;
//                 const dateLabel = isOffer
//                   ? `${moment(item?.offerStartDate).format("DD MMM")} – ${moment(item?.offerEndDate).format("DD MMM YYYY")}`
//                   : moment(item?.createdAt).format("DD MMM YYYY");

//                 return (
//                   <div key={item._id}
//                     className="group relative overflow-hidden rounded-[18px] border border-[#E4E8ED] bg-white shadow-[0_2px_8px_rgba(30,40,55,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(30,40,55,0.10)]">

//                     {/* Image */}
//                     <div className="relative h-44 w-full overflow-hidden bg-[#F4F6F8]">
//                       {image ? (
//                         <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
//                       ) : (
//                         <div className="flex h-full w-full items-center justify-center">
//                           {isOffer ? <FaTag size={30} className="text-[#D0D5DC]" /> : <FaRegNewspaper size={30} className="text-[#D0D5DC]" />}
//                         </div>
//                       )}
//                       <div className="absolute top-3 left-3">
//                         <span className="inline-flex items-center gap-1.5 rounded-full bg-[#20242B] px-2.5 py-1 text-[10px] font-bold text-white">
//                           {isOffer ? <FaTag size={8} /> : <FaRegNewspaper size={8} />}
//                           {isOffer ? "Offer" : "Blog"}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Content */}
//                     <div className="p-4">
//                       <h3 className="text-[13px] font-extrabold text-[#20242B] truncate">{title || "--"}</h3>
//                       <p className="mt-1 text-[11px] text-[#7C8592] line-clamp-2 leading-relaxed">{desc || "--"}</p>

//                       {isOffer && (
//                         <div className="mt-3 flex flex-wrap gap-1.5">
//                           {item?.couponCode && (
//                             <span className="inline-flex items-center gap-1 rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] px-2 py-1 text-[10px] font-bold text-[#59626E]">
//                               <FaTicketAlt size={8} /> {item.couponCode}
//                             </span>
//                           )}
//                           {item?.offerBy?.percentage && (
//                             <span className="inline-flex items-center gap-1 rounded-lg border border-amber-100 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
//                               <FaPercent size={8} /> {item.offerBy.percentage}% off
//                             </span>
//                           )}
//                           {item?.offerBy?.flatPrice && (
//                             <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
//                               Flat {item.offerBy.flatPrice} off
//                             </span>
//                           )}
//                           {item?.restrictedServiceMode && item.restrictedServiceMode !== "none" && (
//                             <span className="inline-flex items-center gap-1 rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] px-2 py-1 text-[10px] font-bold text-[#59626E] capitalize">
//                               {item.restrictedServiceMode}
//                             </span>
//                           )}
//                         </div>
//                       )}

//                       {/* Date + Actions */}
//                       <div className="mt-3 flex items-center justify-between">
//                         <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#9AA2AC]">
//                           <IoCalendarOutline size={12} />
//                           {dateLabel}
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <AlertDialog
//                             onAgree={() => handleDelete(item?._id)}
//                             dialogTitle={`Delete ${isOffer ? "Offer" : "Blog"}?`}
//                             dialogDetails={`Are you sure you want to delete this ${isOffer ? "offer" : "blog"}? This cannot be undone.`}
//                             AgreeButtonValue="Yes, Delete!"
//                             CancelButton="Cancel"
//                             triggerButton={(onClick) => (
//                               <button onClick={onClick}
//                                 className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] text-[#59626E] transition hover:bg-rose-500 hover:text-white hover:border-rose-500">
//                                 <MdOutlineDelete size={15} />
//                               </button>
//                             )}
//                           />
//                           <button onClick={() => { setEditValue(item); setFilterDragger(true); }}
//                             className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] text-[#59626E] transition hover:bg-[#20242B] hover:text-white hover:border-[#20242B]">
//                             <FiEdit2 size={13} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Bottom accent */}
//                     <div className="absolute bottom-0 left-4 right-4 h-[3px] overflow-hidden rounded-full bg-[#F0F2F5]">
//                       <div className="h-full w-0 bg-[#20242B] rounded-full transition-all duration-500 group-hover:w-full" />
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
          notifyError(d?.error?.message);
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
          notifyError(d?.error?.message);
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
        notifyError(d?.error?.message);
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
      <div className="mb-6 overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-4 border-b border-[#EEF2F7] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            {/* ICON */}

            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#EEF2FF] text-[#4F46E5]">
              {isOffer ? (
                <FaTag size={17} />
              ) : (
                <FaRegNewspaper size={17} />
              )}
            </div>

            {/* TITLE */}

            <div>
              <h2 className="text-[16px] font-extrabold tracking-[-0.01em] text-[#1E293B]">
                {isOffer ? "Offer List" : "Blog List"}
              </h2>

              <p className="mt-0.5 text-[11px] font-medium text-[#64748B]">
                {data?.length || 0}{" "}
                {isOffer ? "active offers" : "published blogs"}
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
            className="group flex h-10 items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[12px] font-extrabold text-white shadow-[0_6px_16px_rgba(79,70,229,0.18)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#4338CA] hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] active:translate-y-0"
          >
            <MdAddchart
              size={16}
              className="transition-transform duration-200 group-hover:scale-110"
            />

            Create {isOffer ? "Offer" : "Blog"}
          </button>
        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="p-5">

          {/* EMPTY STATE */}

          {!data || data.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[#DDE3EC] bg-[#F8FAFC]">

              <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#EEF2FF] text-[#6366F1]">
                {isOffer ? (
                  <FaTag size={25} />
                ) : (
                  <FaRegNewspaper size={25} />
                )}
              </div>

              <p className="mt-4 text-[13px] font-extrabold text-[#334155]">
                No {isOffer ? "offers" : "blogs"} yet
              </p>

              <p className="mt-1 text-[11px] font-medium text-[#94A3B8]">
                Create your first {isOffer ? "offer" : "blog"} to get started
              </p>

              <button
                type="button"
                onClick={() => {
                  setEditValue({});
                  setFilterDragger(true);
                }}
                className="mt-4 flex items-center gap-2 rounded-xl bg-[#EEF2FF] px-4 py-2 text-[11px] font-bold text-[#4F46E5] transition hover:bg-[#E0E7FF]"
              >
                <MdAddchart size={14} />
                Create {isOffer ? "Offer" : "Blog"}
              </button>
            </div>
          ) : (

            /* =================================================
               CARDS
            ================================================= */

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

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
                  ? `${moment(item?.offerStartDate).format(
                      "DD MMM"
                    )} – ${moment(item?.offerEndDate).format(
                      "DD MMM YYYY"
                    )}`
                  : moment(item?.createdAt).format("DD MMM YYYY");

                return (
                  <div
                    key={item?._id}
                    className="group relative overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#C7D2FE] hover:shadow-[0_16px_35px_rgba(15,23,42,0.09)]"
                  >

                    {/* =================================================
                        IMAGE
                    ================================================== */}

                    <div className="relative h-[180px] w-full overflow-hidden bg-[#F8FAFC]">

                      {image ? (
                        <img
                          src={image}
                          alt={title || "Management"}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#F8FAFC]">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#A5B4FC]">
                            {isOffer ? (
                              <FaTag size={24} />
                            ) : (
                              <FaRegNewspaper size={24} />
                            )}
                          </div>
                        </div>
                      )}

                      {/* IMAGE OVERLAY */}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      {/* TYPE BADGE */}

                      <div className="absolute left-3 top-3">

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/95 px-2.5 py-1 text-[9px] font-extrabold text-[#4F46E5] shadow-sm backdrop-blur-sm">
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

                      <h3 className="truncate text-[13px] font-extrabold text-[#1E293B]">
                        {title || "--"}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 min-h-[32px] text-[11px] font-medium leading-[1.55] text-[#64748B]">
                        {desc || "--"}
                      </p>

                      {/* =================================================
                          OFFER META
                      ================================================== */}

                      {isOffer && (
                        <div className="mt-3 flex min-h-[24px] flex-wrap gap-1.5">

                          {item?.couponCode && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1 text-[9px] font-bold text-[#475569]">
                              <FaTicketAlt
                                size={8}
                                className="text-[#6366F1]"
                              />
                              {item.couponCode}
                            </span>
                          )}

                          {item?.offerBy?.percentage && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-[#DDD6FE] bg-[#F5F3FF] px-2 py-1 text-[9px] font-bold text-[#6D28D9]">
                              <FaPercent size={8} />
                              {item.offerBy.percentage}% off
                            </span>
                          )}

                          {item?.offerBy?.flatPrice && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-[#D1FAE5] bg-[#ECFDF5] px-2 py-1 text-[9px] font-bold text-[#047857]">
                              Flat {item.offerBy.flatPrice} off
                            </span>
                          )}

                          {item?.restrictedServiceMode &&
                            item.restrictedServiceMode !== "none" && (
                              <span className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1 text-[9px] font-bold capitalize text-[#475569]">
                                {item.restrictedServiceMode}
                              </span>
                            )}
                        </div>
                      )}

                      {/* =================================================
                          FOOTER
                      ================================================== */}

                      <div className="mt-4 flex items-center justify-between border-t border-[#F1F5F9] pt-3">

                        {/* DATE */}

                        <div className="flex min-w-0 items-center gap-1.5 text-[9px] font-semibold text-[#94A3B8]">

                          <IoCalendarOutline
                            size={12}
                            className="shrink-0 text-[#818CF8]"
                          />

                          <span className="truncate">
                            {dateLabel}
                          </span>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex shrink-0 items-center gap-1.5">

                          {/* DELETE */}

                          <AlertDialog
                            onAgree={() => handleDelete(item?._id)}
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
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition-all duration-200 hover:border-[#FECACA] hover:bg-[#FEF2F2] hover:text-[#EF4444]"
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
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition-all duration-200 hover:border-[#C7D2FE] hover:bg-[#EEF2FF] hover:text-[#4F46E5]"
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

                    <div className="absolute bottom-0 left-5 right-5 h-[2px] overflow-hidden rounded-full bg-[#EEF2FF]">
                      <div className="h-full w-0 rounded-full bg-[#4F46E5] transition-all duration-500 group-hover:w-full" />
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
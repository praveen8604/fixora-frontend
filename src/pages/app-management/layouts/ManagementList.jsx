import AdminServices from "@/services/AdminServices";
import { DecryptData } from "@/utils/DecryptData";
import { notifyError, notifySuccess } from "@/utils/toast";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { MdAddchart, MdOutlineDelete } from "react-icons/md";
import { FaTag, FaRegNewspaper, FaPercent, FaTicketAlt } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";
import AlertDialog from "@/components/common/AlterDialogBox";
import AnimatedContent from "@/components/common/AnimatedContent";

const ManagementList = ({ isDispatch, setFilterDragger, currentLink, setEditValue, filterDragger }) => {
  const [data, setData] = useState([]);

  const getManagementList = () => {
    if (currentLink === "Offers") {
      AdminServices.getOffers()
        .then((res) => { const d = DecryptData(res); setData(d?.data?.offers || []); })
        .catch((err) => { const d = DecryptData(err?.response?.data); notifyError(d?.error?.message); });
    } else if (currentLink === "Blogs") {
      AdminServices.getBlogs()
        .then((res) => { const d = DecryptData(res); setData(d?.data?.blogs || []); })
        .catch((err) => { const d = DecryptData(err?.response?.data); notifyError(d?.error?.message); });
    }
  };

  const handleDelete = (_id) => {
    const call = currentLink === "Blogs" ? AdminServices.deleteBlog(_id) : AdminServices.deleteOffer(_id);
    const label = currentLink === "Blogs" ? "Blog" : "Offer";
    call
      .then(() => { notifySuccess(`${label} deleted successfully`); getManagementList(); })
      .catch((err) => { const d = DecryptData(err?.response?.data); notifyError(d?.error?.message); });
  };

  useEffect(() => { getManagementList(); }, [isDispatch, currentLink]);
  useEffect(() => { if (!filterDragger) setEditValue({}); }, [filterDragger]);

  const isOffer = currentLink === "Offers";

  return (
    <AnimatedContent>
      <div className="overflow-hidden rounded-[22px] border border-[#E4E8ED] bg-white shadow-[0_3px_12px_rgba(30,40,55,0.035)]">

        {/* LIST HEADER */}
        <div className="flex items-center justify-between border-b border-[#F0F2F5] px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-[#282D35]">{isOffer ? "Offer" : "Blog"} List</h2>
            <p className="mt-0.5 text-xs text-[#929AA5]">{data?.length || 0} {isOffer ? "active offers" : "published blogs"}</p>
          </div>
          <button onClick={() => setFilterDragger(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#20242B] text-white text-sm font-bold transition hover:opacity-90 active:scale-95">
            <MdAddchart size={16} />
            Create {isOffer ? "Offer" : "Blog"}
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5">
          {!data || data.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F6F8]">
                {isOffer ? <FaTag size={22} className="text-[#A0A7B0]" /> : <FaRegNewspaper size={22} className="text-[#A0A7B0]" />}
              </div>
              <p className="mt-4 text-sm font-bold text-[#69727E]">No {isOffer ? "offers" : "blogs"} yet</p>
              <p className="mt-1 text-xs text-[#9AA2AC]">Click "Create {isOffer ? "Offer" : "Blog"}" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((item) => {
                const title = isOffer ? item?.offerName : item?.blogTitle;
                const desc = isOffer ? item?.offerDescription : item?.blogDescription;
                const image = isOffer ? item?.offerImage : item?.blogImage;
                const dateLabel = isOffer
                  ? `${moment(item?.offerStartDate).format("DD MMM")} – ${moment(item?.offerEndDate).format("DD MMM YYYY")}`
                  : moment(item?.createdAt).format("DD MMM YYYY");

                return (
                  <div key={item._id}
                    className="group relative overflow-hidden rounded-[18px] border border-[#E4E8ED] bg-white shadow-[0_2px_8px_rgba(30,40,55,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(30,40,55,0.10)]">

                    {/* Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-[#F4F6F8]">
                      {image ? (
                        <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          {isOffer ? <FaTag size={30} className="text-[#D0D5DC]" /> : <FaRegNewspaper size={30} className="text-[#D0D5DC]" />}
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#20242B] px-2.5 py-1 text-[10px] font-bold text-white">
                          {isOffer ? <FaTag size={8} /> : <FaRegNewspaper size={8} />}
                          {isOffer ? "Offer" : "Blog"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-[13px] font-extrabold text-[#20242B] truncate">{title || "--"}</h3>
                      <p className="mt-1 text-[11px] text-[#7C8592] line-clamp-2 leading-relaxed">{desc || "--"}</p>

                      {isOffer && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item?.couponCode && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] px-2 py-1 text-[10px] font-bold text-[#59626E]">
                              <FaTicketAlt size={8} /> {item.couponCode}
                            </span>
                          )}
                          {item?.offerBy?.percentage && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-amber-100 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                              <FaPercent size={8} /> {item.offerBy.percentage}% off
                            </span>
                          )}
                          {item?.offerBy?.flatPrice && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                              Flat {item.offerBy.flatPrice} off
                            </span>
                          )}
                          {item?.restrictedServiceMode && item.restrictedServiceMode !== "none" && (
                            <span className="inline-flex items-center gap-1 rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] px-2 py-1 text-[10px] font-bold text-[#59626E] capitalize">
                              {item.restrictedServiceMode}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Date + Actions */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#9AA2AC]">
                          <IoCalendarOutline size={12} />
                          {dateLabel}
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertDialog
                            onAgree={() => handleDelete(item?._id)}
                            dialogTitle={`Delete ${isOffer ? "Offer" : "Blog"}?`}
                            dialogDetails={`Are you sure you want to delete this ${isOffer ? "offer" : "blog"}? This cannot be undone.`}
                            AgreeButtonValue="Yes, Delete!"
                            CancelButton="Cancel"
                            triggerButton={(onClick) => (
                              <button onClick={onClick}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] text-[#59626E] transition hover:bg-rose-500 hover:text-white hover:border-rose-500">
                                <MdOutlineDelete size={15} />
                              </button>
                            )}
                          />
                          <button onClick={() => { setEditValue(item); setFilterDragger(true); }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E8ED] bg-[#F4F6F8] text-[#59626E] transition hover:bg-[#20242B] hover:text-white hover:border-[#20242B]">
                            <FiEdit2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-4 right-4 h-[3px] overflow-hidden rounded-full bg-[#F0F2F5]">
                      <div className="h-full w-0 bg-[#20242B] rounded-full transition-all duration-500 group-hover:w-full" />
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

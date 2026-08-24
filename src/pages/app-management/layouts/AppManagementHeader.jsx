import React, { useEffect, useState } from "react";
import { MdAddchart, MdAddPhotoAlternate } from "react-icons/md";
import { FaRegNewspaper, FaTag } from "react-icons/fa";
import MuiDrawer from "@/components/drawer/MuiDrawer";
import Dropdown from "@/components/common/DropDown";
import AdminServices from "@/services/AdminServices";
import { DecryptData } from "@/utils/DecryptData";
import { notifyError, notifySuccess } from "@/utils/toast";

export const links = ["Offers", "Blogs"];

const AppManagementHeader = ({ getManagementList, filterDragger, setFilterDragger, setCurrentLink, currentLink, editValue }) => {
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");
  const [restrictedMinimumPrice, setRestrictedMinimumPrice] = useState("");
  const [maxOfferPrice, setMaxOfferPrice] = useState("");
  const [imageValue, setImageValue] = useState({ fileName: "", image: "" });
  const [flatPrice, setFlatPrice] = useState("");
  const [offerPercentage, setOfferPercentage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [restrictedServiceMode, setRestrictedServiceModeSelectedOption] = useState("");
  const [offerBy, setOfferBySelectedOption] = useState("");

  const resetForm = () => {
    setNameValue(""); setDescriptionValue(""); setOfferStartDate(""); setOfferEndDate("");
    setRestrictedMinimumPrice(""); setMaxOfferPrice("");
    setImageValue({ fileName: "", image: "" });
    setFlatPrice(""); setOfferPercentage(""); setCouponCode("");
    setRestrictedServiceModeSelectedOption(""); setOfferBySelectedOption("");
  };

  const handleTabChange = (link) => { resetForm(); setCurrentLink(link); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImageValue({ fileName: `img${Date.now()}`, image: reader.result });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const offerPayload = {
      offerName: nameValue, offerDescription: descriptionValue,
      offerStartDate, offerEndDate,
      restrictedServiceMode: restrictedServiceMode.toLowerCase(),
      restrictedMinimumPrice, maxOfferPrice, couponCode,
      offerBy: {
        ...(offerBy.toLowerCase() === "percentage" ? { percentage: offerPercentage }
          : offerBy.toLowerCase() === "coupon" ? { coupon: offerPercentage }
          : { flatPrice }),
      },
      offerImage: imageValue,
    };
    const blogPayload = { blogTitle: nameValue, blogDescription: descriptionValue, blogImage: imageValue };
    const onSuccess = (msg) => { notifySuccess(msg); getManagementList(); setFilterDragger(false); resetForm(); };
    const onError = (err) => { const d = DecryptData(err?.response?.data); notifyError(d?.error?.message); };

    if (currentLink === "Offers") {
      const call = editValue?._id ? AdminServices.updateOffer({ ...offerPayload, offerId: editValue._id }) : AdminServices.createOffer(offerPayload);
      call.then(() => onSuccess(editValue?._id ? "Offer updated!" : "Offer created!")).catch(onError);
    } else if (currentLink === "Blogs") {
      const call = editValue?._id ? AdminServices.updateBlog({ ...blogPayload, blogId: editValue._id }) : AdminServices.createBlog(blogPayload);
      call.then(() => onSuccess(editValue?._id ? "Blog updated!" : "Blog created!")).catch(onError);
    }
  };

  useEffect(() => {
    if (currentLink === "Blogs" && editValue?._id) {
      setNameValue(editValue?.blogTitle || "");
      setDescriptionValue(editValue?.blogDescription || "");
      setImageValue({ fileName: "", image: editValue?.blogImage || "" });
    }
    if (currentLink === "Offers" && editValue?._id) {
      setNameValue(editValue?.offerName || "");
      setDescriptionValue(editValue?.offerDescription || "");
      setOfferStartDate(editValue?.offerStartDate ? new Date(editValue.offerStartDate).toISOString().split("T")[0] : "");
      setOfferEndDate(editValue?.offerEndDate ? new Date(editValue.offerEndDate).toISOString().split("T")[0] : "");
      setRestrictedMinimumPrice(editValue?.restrictedMinimumPrice || "");
      setMaxOfferPrice(editValue?.maxOfferPrice || "");
      setImageValue({ fileName: "", image: editValue?.offerImage || "" });
      setFlatPrice(editValue?.offerBy?.flatPrice || "");
      setOfferPercentage(editValue?.offerBy?.percentage || editValue?.offerBy?.coupon || "");
      setRestrictedServiceModeSelectedOption(editValue?.restrictedServiceMode || "");
      setOfferBySelectedOption(editValue?.offerBy?.flatPrice ? "Flat Price" : editValue?.offerBy?.coupon ? "Coupon" : "Percentage");
      setCouponCode(editValue?.couponCode || "");
    }
  }, [editValue, currentLink]);

  useEffect(() => { setCurrentLink(links[0]); }, []);

  const isEditing = Boolean(editValue?._id);
  const isBlog = currentLink === "Blogs";

  const inputClass = "h-10 w-full rounded-xl border border-[#E4E8ED] bg-white px-3 text-sm font-semibold text-[#20242B] outline-none focus:border-[#20242B] focus:ring-2 focus:ring-[#20242B]/8 placeholder:text-[#B0B8C2]";
  const labelClass = "text-xs font-bold text-[#59626E] uppercase tracking-wide mb-1";

  return (
    <div className="mb-6">
      {/* PAGE HEADER */}
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#20242B] shadow-[0_0_0_5px_rgba(0,0,0,0.06)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#89919D]">App Management</span>
          </div>
          <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">
            {currentLink === "Offers" ? "Offers" : "Blogs"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#7C8592]">
            {currentLink === "Offers" ? "Create and manage promotional offers" : "Publish and manage blog content"}
          </p>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-1 rounded-xl border border-[#E4E8ED] bg-white p-1 shadow-sm">
          {links.map((link) => {
            const active = link === currentLink;
            return (
              <button key={link} type="button" onClick={() => handleTabChange(link)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  active ? "bg-[#20242B] text-white shadow-sm" : "text-[#59626E] hover:bg-[#F4F6F8] hover:text-[#20242B]"
                }`}>
                {link === "Offers" ? <FaTag size={12} /> : <FaRegNewspaper size={12} />}
                {link}
              </button>
            );
          })}
        </div>
      </div>

      {/* DRAWER */}
      <MuiDrawer open={filterDragger} onClose={() => { setFilterDragger(false); resetForm(); }} drawerWidth="420px">
        <div className="h-full bg-[#F4F6F8] flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E4E8ED] bg-white">
            <div className="w-10 h-10 rounded-xl bg-[#20242B] flex items-center justify-center">
              {isBlog ? <FaRegNewspaper size={15} className="text-white" /> : <MdAddchart size={18} className="text-white" />}
            </div>
            <div>
              <p className="font-bold text-[#20242B]">{isEditing ? `Update ${isBlog ? "Blog" : "Offer"}` : `Create ${isBlog ? "Blog" : "Offer"}`}</p>
              <p className="text-[10px] text-[#929AA5]">{isEditing ? `Edit existing ${isBlog ? "blog" : "offer"}` : `Add a new ${isBlog ? "blog" : "offer"}`}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

              <div className="flex flex-col gap-1">
                <label className={labelClass}>{isBlog ? "Blog Title" : "Offer Name"}</label>
                <input value={nameValue} onChange={(e) => setNameValue(e.target.value)}
                  className={inputClass} placeholder={isBlog ? "Enter blog title" : "Enter offer name"} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>{isBlog ? "Blog Description" : "Offer Description"}</label>
                <textarea value={descriptionValue} onChange={(e) => setDescriptionValue(e.target.value)} rows={4}
                  className="w-full rounded-xl border border-[#E4E8ED] bg-white px-3 py-2.5 text-sm font-semibold text-[#20242B] outline-none focus:border-[#20242B] focus:ring-2 focus:ring-[#20242B]/8 placeholder:text-[#B0B8C2] resize-none"
                  placeholder={isBlog ? "Enter blog description" : "Enter offer description"} />
              </div>

              {!isBlog && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Start Date</label>
                      <input value={offerStartDate} onChange={(e) => setOfferStartDate(e.target.value)}
                        className={inputClass} type="date" min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>End Date</label>
                      <input value={offerEndDate} onChange={(e) => setOfferEndDate(e.target.value)}
                        className={inputClass} type="date" min={new Date().toISOString().split("T")[0]} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Service Mode</label>
                    <Dropdown value={restrictedServiceMode} placeholder="Select service mode"
                      onSelect={setRestrictedServiceModeSelectedOption}
                      options={["pickup", "home", "none"]} disabled={false} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Min Price</label>
                      <input value={restrictedMinimumPrice} onChange={(e) => setRestrictedMinimumPrice(e.target.value)}
                        className={inputClass} placeholder="Min price" type="number" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Max Offer Price</label>
                      <input value={maxOfferPrice} onChange={(e) => setMaxOfferPrice(e.target.value)}
                        className={inputClass} placeholder="Max price" type="number" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Offer By</label>
                      <Dropdown value={offerBy} placeholder="Select type"
                        onSelect={setOfferBySelectedOption}
                        options={["Flat Price", "Percentage", "Coupon"]} disabled={false} />
                    </div>
                    {offerBy && (
                      <div className="flex flex-col gap-1">
                        <label className={labelClass}>{offerBy.toLowerCase() === "flat price" ? "Flat Price" : offerBy.toLowerCase() === "coupon" ? "Discount" : "Percentage"}</label>
                        <input
                          value={offerBy.toLowerCase() === "flat price" ? flatPrice : offerPercentage}
                          onChange={(e) => offerBy.toLowerCase() === "flat price" ? setFlatPrice(e.target.value) : setOfferPercentage(e.target.value)}
                          className={inputClass} placeholder="Enter value" type="number" />
                      </div>
                    )}
                  </div>

                  {offerBy.toLowerCase() === "coupon" && (
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Coupon Code</label>
                      <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className={`${inputClass} uppercase`} placeholder="COUPON CODE" />
                    </div>
                  )}
                </>
              )}

              <div className="flex flex-col gap-1">
                <label className={labelClass}>{isBlog ? "Blog Image" : "Offer Image"}</label>
                <input className="hidden" id="upload-img" type="file" accept="image/*" onChange={handleImageChange} />
                <label htmlFor="upload-img"
                  className="w-full h-36 border-2 border-dashed border-[#E4E8ED] rounded-xl bg-white cursor-pointer flex items-center justify-center overflow-hidden hover:border-[#20242B] transition-colors">
                  {imageValue.image ? (
                    <img src={imageValue.image} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-[#A0A7B0]">
                      <MdAddPhotoAlternate size={30} />
                      <span className="text-xs mt-2 font-semibold">Click to upload image</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 px-5 py-4 bg-white border-t border-[#E4E8ED]">
              <button type="button" onClick={() => { setFilterDragger(false); resetForm(); }}
                className="flex-1 h-11 rounded-xl border-2 border-[#E4E8ED] text-[#59626E] text-sm font-bold transition hover:bg-[#F4F6F8]">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 h-11 rounded-xl bg-[#20242B] text-white text-sm font-bold transition hover:opacity-90">
                {isEditing ? `Update ${isBlog ? "Blog" : "Offer"}` : `Create ${isBlog ? "Blog" : "Offer"}`}
              </button>
            </div>
          </form>
        </div>
      </MuiDrawer>
    </div>
  );
};

export default AppManagementHeader;

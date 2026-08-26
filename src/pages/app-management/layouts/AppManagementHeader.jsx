import React, { useEffect, useState } from "react";
import { MdAddchart, MdAddPhotoAlternate } from "react-icons/md";
import { FaRegNewspaper, FaTag } from "react-icons/fa";
import MuiDrawer from "@/components/drawer/MuiDrawer";
import Dropdown from "@/components/common/DropDown";
import AdminServices from "@/services/AdminServices";
import { DecryptData } from "@/utils/DecryptData";
import { notifyError, notifySuccess } from "@/utils/toast";

export const links = ["Offers", "Blogs"];

const AppManagementHeader = ({
  getManagementList,
  filterDragger,
  setFilterDragger,
  setCurrentLink,
  currentLink,
  editValue,
}) => {
  const [nameValue, setNameValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerEndDate, setOfferEndDate] = useState("");
  const [restrictedMinimumPrice, setRestrictedMinimumPrice] = useState("");
  const [maxOfferPrice, setMaxOfferPrice] = useState("");
  const [imageValue, setImageValue] = useState({
    fileName: "",
    image: "",
  });
  const [flatPrice, setFlatPrice] = useState("");
  const [offerPercentage, setOfferPercentage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [restrictedServiceMode, setRestrictedServiceModeSelectedOption] =
    useState("");
  const [offerBy, setOfferBySelectedOption] = useState("");

  const resetForm = () => {
    setNameValue("");
    setDescriptionValue("");
    setOfferStartDate("");
    setOfferEndDate("");
    setRestrictedMinimumPrice("");
    setMaxOfferPrice("");
    setImageValue({
      fileName: "",
      image: "",
    });
    setFlatPrice("");
    setOfferPercentage("");
    setCouponCode("");
    setRestrictedServiceModeSelectedOption("");
    setOfferBySelectedOption("");
  };

  const handleTabChange = (link) => {
    resetForm();
    setCurrentLink(link);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      setImageValue({
        fileName: `img${Date.now()}`,
        image: reader.result,
      });
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const offerPayload = {
      offerName: nameValue,
      offerDescription: descriptionValue,
      offerStartDate,
      offerEndDate,
      restrictedServiceMode: restrictedServiceMode.toLowerCase(),
      restrictedMinimumPrice,
      maxOfferPrice,
      couponCode,
      offerBy: {
        ...(offerBy.toLowerCase() === "percentage"
          ? {
              percentage: offerPercentage,
            }
          : offerBy.toLowerCase() === "coupon"
            ? {
                coupon: offerPercentage,
              }
            : {
                flatPrice,
              }),
      },
      offerImage: imageValue,
    };

    const blogPayload = {
      blogTitle: nameValue,
      blogDescription: descriptionValue,
      blogImage: imageValue,
    };

    const onSuccess = (msg) => {
      notifySuccess(msg);
      getManagementList();
      setFilterDragger(false);
      resetForm();
    };

    const onError = (err) => {
      const d = DecryptData(err?.response?.data);
      notifyError(d?.error?.message);
    };

    if (currentLink === "Offers") {
      const call = editValue?._id
        ? AdminServices.updateOffer({
            ...offerPayload,
            offerId: editValue._id,
          })
        : AdminServices.createOffer(offerPayload);

      call
        .then(() =>
          onSuccess(editValue?._id ? "Offer updated!" : "Offer created!")
        )
        .catch(onError);
    }

    if (currentLink === "Blogs") {
      const call = editValue?._id
        ? AdminServices.updateBlog({
            ...blogPayload,
            blogId: editValue._id,
          })
        : AdminServices.createBlog(blogPayload);

      call
        .then(() =>
          onSuccess(editValue?._id ? "Blog updated!" : "Blog created!")
        )
        .catch(onError);
    }
  };

  useEffect(() => {
    if (currentLink === "Blogs" && editValue?._id) {
      setNameValue(editValue?.blogTitle || "");
      setDescriptionValue(editValue?.blogDescription || "");

      setImageValue({
        fileName: "",
        image: editValue?.blogImage || "",
      });
    }

    if (currentLink === "Offers" && editValue?._id) {
      setNameValue(editValue?.offerName || "");
      setDescriptionValue(editValue?.offerDescription || "");

      setOfferStartDate(
        editValue?.offerStartDate
          ? new Date(editValue.offerStartDate)
              .toISOString()
              .split("T")[0]
          : ""
      );

      setOfferEndDate(
        editValue?.offerEndDate
          ? new Date(editValue.offerEndDate)
              .toISOString()
              .split("T")[0]
          : ""
      );

      setRestrictedMinimumPrice(
        editValue?.restrictedMinimumPrice || ""
      );

      setMaxOfferPrice(editValue?.maxOfferPrice || "");

      setImageValue({
        fileName: "",
        image: editValue?.offerImage || "",
      });

      setFlatPrice(editValue?.offerBy?.flatPrice || "");

      setOfferPercentage(
        editValue?.offerBy?.percentage ||
          editValue?.offerBy?.coupon ||
          ""
      );

      setRestrictedServiceModeSelectedOption(
        editValue?.restrictedServiceMode || ""
      );

      setOfferBySelectedOption(
        editValue?.offerBy?.flatPrice
          ? "Flat Price"
          : editValue?.offerBy?.coupon
            ? "Coupon"
            : "Percentage"
      );

      setCouponCode(editValue?.couponCode || "");
    }
  }, [editValue, currentLink]);

  useEffect(() => {
    setCurrentLink(links[0]);
  }, [setCurrentLink]);

  const isEditing = Boolean(editValue?._id);
  const isBlog = currentLink === "Blogs";

  const inputClass =
    "h-11 w-full rounded-xl border border-[#E4E8ED] bg-white px-3 text-xs font-semibold text-[#414853] outline-none transition-all placeholder:text-[#9AA2AC] focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]";

  const labelClass =
    "mb-2 block text-[10px] font-extrabold uppercase tracking-wider text-[#7C8592]";

  return (
    <div className="mt-4 mb-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#20242B] shadow-[0_0_0_5px_rgba(0,0,0,0.06)]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#89919D]">
              App Management
            </span>
          </div>

          <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-[#20242B]">
            {isBlog ? "Blogs" : "Offers"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#7C8592]">
            {isBlog
              ? "Publish and manage blog content"
              : "Create and manage promotional offers"}
          </p>
        </div>

        {/* =====================================================
            TABS
        ====================================================== */}

        <div className="flex items-center gap-1 rounded-xl border border-[#E4E8ED] bg-white p-1 shadow-sm">
          {links.map((link) => {
            const active = link === currentLink;

            return (
              <button
                key={link}
                type="button"
                onClick={() => handleTabChange(link)}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold transition-all duration-200 ${
                  active
                    ? "bg-[#20242B] text-white shadow-sm"
                    : "text-[#59626E] hover:bg-[#F4F6F8] hover:text-[#20242B]"
                }`}
              >
                {link === "Offers" ? (
                  <FaTag size={12} />
                ) : (
                  <FaRegNewspaper size={12} />
                )}

                {link}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          DRAWER
      ====================================================== */}

      <MuiDrawer
        open={filterDragger}
        onClose={() => {
          setFilterDragger(false);
          resetForm();
        }}
        drawerWidth="420px"
      >
        <div className="flex h-full flex-col bg-[#F4F6F8]">
          {/* =================================================
              DRAWER HEADER
          ================================================== */}

          <div className="relative flex items-center gap-3 overflow-hidden border-b border-[#DCE2EA] bg-[#20242B] px-5 py-4 text-white">
            <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#2563EB]/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-16 left-[30%] h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />

            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08]">
              {isBlog ? (
                <FaRegNewspaper size={16} className="text-[#93C5FD]" />
              ) : (
                <MdAddchart size={19} className="text-[#93C5FD]" />
              )}
            </div>

            <div className="relative">
              <p className="text-sm font-extrabold">
                {isEditing
                  ? `Update ${isBlog ? "Blog" : "Offer"}`
                  : `Create ${isBlog ? "Blog" : "Offer"}`}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {isEditing
                  ? `Edit existing ${isBlog ? "blog" : "offer"}`
                  : `Add a new ${isBlog ? "blog" : "offer"}`}
              </p>
            </div>
          </div>

          {/* =================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div
              className="flex-1 overflow-y-auto px-5 py-5"
              style={{
                scrollbarWidth: "thin",
              }}
            >
              {/* =================================================
                  BLOG FORM
              ================================================== */}

              {isBlog ? (
                <>
                  {/* Blog Title */}

                  <div className="mb-5">
                    <label className={labelClass}>Blog Title</label>

                    <input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className={inputClass}
                      placeholder="Enter blog title"
                    />
                  </div>

                  {/* Blog Description */}

                  <div className="mb-5">
                    <label className={labelClass}>
                      Blog Description
                    </label>

                    <textarea
                      value={descriptionValue}
                      onChange={(e) =>
                        setDescriptionValue(e.target.value)
                      }
                      className={`${inputClass} h-auto resize-none py-3`}
                      placeholder="Enter blog description"
                      rows={5}
                    />
                  </div>

                  {/* Blog Image */}

                  <div>
                    <label className={labelClass}>Blog Image</label>

                    <input
                      className="hidden"
                      id="blog-img"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    <label
                      htmlFor="blog-img"
                      className="group flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#DCE2EA] bg-white transition-all duration-300 hover:border-[#93C5FD] hover:bg-[#EFF6FF]"
                    >
                      {imageValue.image ? (
                        <img
                          src={imageValue.image}
                          alt={imageValue.fileName || "Blog"}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#DBEAFE]">
                            <MdAddPhotoAlternate size={25} />
                          </div>

                          <span className="mt-2 text-[10px] font-bold text-slate-400">
                            Click to upload image
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </>
              ) : (
                /* =================================================
                    OFFER FORM
                ================================================== */

                <>
                  {/* Offer Name */}

                  <div className="mb-5">
                    <label className={labelClass}>Offer Name</label>

                    <input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className={inputClass}
                      placeholder="Enter offer name"
                    />
                  </div>

                  {/* Offer Description */}

                  <div className="mb-5">
                    <label className={labelClass}>
                      Offer Description
                    </label>

                    <textarea
                      value={descriptionValue}
                      onChange={(e) =>
                        setDescriptionValue(e.target.value)
                      }
                      className={`${inputClass} h-auto resize-none py-3`}
                      placeholder="Enter offer description"
                      rows={4}
                    />
                  </div>

                  {/* Dates */}

                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Start Date</label>

                      <input
                        value={offerStartDate}
                        onChange={(e) =>
                          setOfferStartDate(e.target.value)
                        }
                        className={inputClass}
                        type="date"
                        min={new Date()
                          .toISOString()
                          .split("T")[0]}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>End Date</label>

                      <input
                        value={offerEndDate}
                        onChange={(e) =>
                          setOfferEndDate(e.target.value)
                        }
                        className={inputClass}
                        type="date"
                        min={new Date()
                          .toISOString()
                          .split("T")[0]}
                      />
                    </div>
                  </div>

                  {/* Service Mode */}

                  <div className="mb-5">
                    <label className={labelClass}>
                      Restricted Service Mode
                    </label>

                    <Dropdown
                      value={restrictedServiceMode}
                      placeholder="Select service mode"
                      onSelect={
                        setRestrictedServiceModeSelectedOption
                      }
                      options={["pickup", "home", "none"]}
                      disabled={false}
                    />
                  </div>

                  {/* Prices */}

                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>
                        Minimum Price
                      </label>

                      <input
                        value={restrictedMinimumPrice}
                        onChange={(e) =>
                          setRestrictedMinimumPrice(
                            e.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="Min price"
                        type="number"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Max Offer Price
                      </label>

                      <input
                        value={maxOfferPrice}
                        onChange={(e) =>
                          setMaxOfferPrice(e.target.value)
                        }
                        className={inputClass}
                        placeholder="Max price"
                        type="number"
                      />
                    </div>
                  </div>

                  {/* Offer Type */}

                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>
                        Offer Type
                      </label>

                      <Dropdown
                        value={offerBy}
                        placeholder="Select type"
                        onSelect={setOfferBySelectedOption}
                        options={[
                          "Flat Price",
                          "Percentage",
                          "Coupon",
                        ]}
                        disabled={false}
                      />
                    </div>

                    {offerBy && (
                      <div>
                        <label className={labelClass}>
                          {offerBy.toLowerCase() === "flat price"
                            ? "Flat Price"
                            : offerBy.toLowerCase() === "coupon"
                              ? "Discount"
                              : "Percentage"}
                        </label>

                        <input
                          value={
                            offerBy.toLowerCase() === "flat price"
                              ? flatPrice
                              : offerPercentage
                          }
                          onChange={(e) =>
                            offerBy.toLowerCase() === "flat price"
                              ? setFlatPrice(e.target.value)
                              : setOfferPercentage(
                                  e.target.value
                                )
                          }
                          className={inputClass}
                          placeholder={
                            offerBy.toLowerCase() === "flat price"
                              ? "Enter amount"
                              : "Enter percentage"
                          }
                          type="number"
                        />
                      </div>
                    )}
                  </div>

                  {/* Coupon */}

                  {offerBy.toLowerCase() === "coupon" && (
                    <div className="mb-5">
                      <label className={labelClass}>
                        Coupon Code
                      </label>

                      <input
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(
                            e.target.value.toUpperCase()
                          )
                        }
                        className={`${inputClass} font-bold uppercase tracking-widest`}
                        placeholder="ENTER COUPON CODE"
                        type="text"
                      />
                    </div>
                  )}

                  {/* Offer Image */}

                  <div>
                    <label className={labelClass}>
                      Offer Image
                    </label>

                    <input
                      className="hidden"
                      id="offer-img"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    <label
                      htmlFor="offer-img"
                      className="group flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#DCE2EA] bg-white transition-all duration-300 hover:border-[#93C5FD] hover:bg-[#EFF6FF]"
                    >
                      {imageValue.image ? (
                        <img
                          src={imageValue.image}
                          alt={imageValue.fileName || "Offer"}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#DBEAFE]">
                            <MdAddPhotoAlternate size={25} />
                          </div>

                          <span className="mt-2 text-[10px] font-bold text-slate-400">
                            Click to upload image
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* =================================================
                ACTIONS
            ================================================== */}

            <div className="flex gap-3 border-t border-[#DCE2EA] bg-white px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  setFilterDragger(false);
                  resetForm();
                }}
                className="h-11 w-full rounded-xl border border-[#E4E8ED] bg-white text-xs font-bold text-[#59626E] transition-all duration-300 hover:border-[#BFDBFE] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#20242B] text-xs font-extrabold text-white shadow-[0_8px_20px_rgba(32,36,43,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111827] hover:shadow-[0_12px_25px_rgba(32,36,43,0.24)]"
              >
                {isEditing
                  ? `Update ${isBlog ? "Blog" : "Offer"}`
                  : `Create ${isBlog ? "Blog" : "Offer"}`}
              </button>
            </div>
          </form>
        </div>
      </MuiDrawer>
    </div>
  );
};

export default AppManagementHeader;

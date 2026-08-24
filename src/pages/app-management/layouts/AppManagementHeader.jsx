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

  const handleRestrictedServiceModeSelect = (value) => {
    setRestrictedServiceModeSelectedOption(value);
  };

  const handleOfferBySelect = (value) => {
    setOfferBySelectedOption(value);
  };

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      setImageValue({
        fileName: `offerimg${new Date().getTime()}`,
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
          ? { percentage: offerPercentage }
          : offerBy.toLowerCase() === "coupon"
            ? { coupon: offerPercentage }
            : { flatPrice }),
      },
      offerImage: imageValue,
    };

    const blogPayload = {
      blogTitle: nameValue,
      blogDescription: descriptionValue,
      blogImage: imageValue,
    };

    if (currentLink === "Offers") {
      if (editValue?._id) {
        AdminServices.updateOffer({
          ...offerPayload,
          offerId: editValue._id,
        })
          .then((res) => {
            if (res) {
              notifySuccess("Offer updated successfully!");
              getManagementList();
              setFilterDragger(false);
              resetForm();
            }
          })
          .catch((err) => {
            const decryptedData = DecryptData(err?.response?.data);
            notifyError(decryptedData?.error?.message);
          });
      } else {
        AdminServices.createOffer(offerPayload)
          .then((res) => {
            if (res) {
              notifySuccess("Offer created successfully!");
              getManagementList();
              setFilterDragger(false);
              resetForm();
            }
          })
          .catch((err) => {
            const decryptedData = DecryptData(err?.response?.data);
            notifyError(decryptedData?.error?.message);
          });
      }
    } else if (currentLink === "Blogs") {
      if (editValue?._id) {
        AdminServices.updateBlog({
          ...blogPayload,
          blogId: editValue._id,
        })
          .then((res) => {
            if (res) {
              notifySuccess("Blog updated successfully!");
              getManagementList();
              setFilterDragger(false);
              resetForm();
            }
          })
          .catch((err) => {
            const decryptedData = DecryptData(err?.response?.data);
            notifyError(decryptedData?.error?.message);
          });
      } else {
        AdminServices.createBlog(blogPayload)
          .then((res) => {
            if (res) {
              notifySuccess("Blog created successfully!");
              getManagementList();
              setFilterDragger(false);
              resetForm();
            }
          })
          .catch((err) => {
            const decryptedData = DecryptData(err?.response?.data);
            notifyError(decryptedData?.error?.message);
          });
      }
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
          ? new Date(editValue.offerStartDate).toISOString().split("T")[0]
          : "",
      );

      setOfferEndDate(
        editValue?.offerEndDate
          ? new Date(editValue.offerEndDate).toISOString().split("T")[0]
          : "",
      );

      setRestrictedMinimumPrice(editValue?.restrictedMinimumPrice || "");
      setMaxOfferPrice(editValue?.maxOfferPrice || "");

      setImageValue({
        fileName: "",
        image: editValue?.offerImage || "",
      });

      setFlatPrice(editValue?.offerBy?.flatPrice || "");
      setOfferPercentage(
        editValue?.offerBy?.percentage ||
          editValue?.offerBy?.offerPercentage ||
          editValue?.offerBy?.coupon ||
          "",
      );

      setRestrictedServiceModeSelectedOption(
        editValue?.restrictedServiceMode || "",
      );

      setOfferBySelectedOption(
        editValue?.offerBy?.flatPrice
          ? "Flat Price"
          : editValue?.offerBy?.coupon
            ? "Coupon"
            : "Percentage",
      );

      setCouponCode(editValue?.couponCode || "");
    }
  }, [editValue, currentLink]);

  useEffect(() => {
    setCurrentLink(links[0]);
  }, []);

  const isEditing = Boolean(editValue?._id);
  const isBlog = currentLink === "Blogs";

  return (
  <div className="mt-4 mb-6">

    {/* =====================================================
        APP MANAGEMENT HEADER
    ====================================================== */}

    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-[0_8px_30px_rgba(15,23,42,0.06)]
      "
    >

      {/* Decorative Glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-24
          h-64
          w-64
          rounded-full
          bg-indigo-500/[0.06]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          right-[25%]
          h-48
          w-48
          rounded-full
          bg-cyan-400/[0.05]
          blur-3xl
        "
      />

      <div
        className="
          relative
          flex
          flex-col
          gap-5
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        {/* =================================================
            TITLE
        ================================================== */}

        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-indigo-600
              to-violet-600
              text-white
              shadow-[0_8px_20px_rgba(79,70,229,0.22)]
            "
          >
            {currentLink === "Offers" ? (
              <FaTag size={20} />
            ) : (
              <FaRegNewspaper size={20} />
            )}
          </div>

          <div>

            <div className="flex items-center gap-2">

              <h1
                className="
                  m-0
                  text-xl
                  font-extrabold
                  tracking-[-0.02em]
                  text-slate-800
                "
              >
                App Management
              </h1>

              <span
                className="
                  rounded-full
                  bg-cyan-50
                  px-2.5
                  py-1
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-wider
                  text-cyan-600
                "
              >
                Admin
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-400">
              Manage your offers and blogs from one place
            </p>

          </div>

        </div>

        {/* =================================================
            TABS
        ================================================== */}

        <div
          className="
            flex
            w-full
            items-center
            gap-1.5
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            p-1.5
            md:w-auto
          "
        >

          {links.map((link) => {

            const active = link === currentLink;

            return (
              <button
                key={link}
                type="button"
                onClick={() => handleTabChange(link)}
                className={`
                  group
                  relative
                  flex
                  h-10
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  overflow-hidden
                  rounded-lg
                  px-5
                  text-xs
                  font-bold
                  transition-all
                  duration-300
                  md:flex-none

                  ${
                    active
                      ? `
                        bg-gradient-to-r
                        from-indigo-600
                        to-violet-600
                        text-white
                        shadow-[0_6px_16px_rgba(79,70,229,0.20)]
                      `
                      : `
                        text-slate-500
                        hover:bg-white
                        hover:text-indigo-600
                        hover:shadow-sm
                      `
                  }
                `}
              >

                {/* Hover Shine */}

                {!active && (
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-y-0
                      left-[-100%]
                      w-[50%]
                      rotate-12
                      bg-gradient-to-r
                      from-transparent
                      via-indigo-400/[0.06]
                      to-transparent
                      transition-all
                      duration-700
                      group-hover:left-[130%]
                    "
                  />
                )}

                {link === "Offers" ? (
                  <FaTag
                    size={13}
                    className={`
                      relative
                      z-10
                      transition-transform
                      duration-300
                      group-hover:scale-110

                      ${
                        active
                          ? "text-cyan-200"
                          : "text-slate-400 group-hover:text-indigo-500"
                      }
                    `}
                  />
                ) : (
                  <FaRegNewspaper
                    size={14}
                    className={`
                      relative
                      z-10
                      transition-transform
                      duration-300
                      group-hover:scale-110

                      ${
                        active
                          ? "text-cyan-200"
                          : "text-slate-400 group-hover:text-indigo-500"
                      }
                    `}
                  />
                )}

                <span className="relative z-10">
                  {link}
                </span>

                {/* Active indicator */}

                {active && (
                  <span
                    className="
                      absolute
                      bottom-0
                      left-1/2
                      h-[2px]
                      w-8
                      -translate-x-1/2
                      rounded-full
                      bg-cyan-300
                    "
                  />
                )}

              </button>
            );
          })}

        </div>

      </div>

    </div>


    {/* =====================================================
        DRAWER
    ====================================================== */}

    <MuiDrawer
      open={filterDragger}
      onClose={() => setFilterDragger(false)}
      drawerWidth="420px"
    >

      <div
        className="
          flex
          h-[var(--doc-height)]
          flex-col
          bg-[#f7f9fc]
        "
      >

        {/* =================================================
            DRAWER HEADER
        ================================================== */}

        <div
          className="
            relative
            overflow-hidden
            bg-[#0F172A]
            px-5
            py-5
            text-white
          "
        >

          {/* Glow */}

          <div
            className="
              pointer-events-none
              absolute
              -right-12
              -top-16
              h-44
              w-44
              rounded-full
              bg-indigo-500/20
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-16
              left-[30%]
              h-32
              w-32
              rounded-full
              bg-cyan-400/10
              blur-2xl
            "
          />

          <div className="relative flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.07]
                text-cyan-300
              "
            >
              {isBlog ? (
                <FaRegNewspaper size={19} />
              ) : (
                <MdAddchart size={21} />
              )}
            </div>

            <div>

              <h2 className="text-sm font-extrabold text-white">
                {isEditing
                  ? `Update ${isBlog ? "Blog" : "Offer"}`
                  : `Create ${isBlog ? "Blog" : "Offer"}`}
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                {isEditing
                  ? `Update your ${
                      isBlog ? "blog" : "offer"
                    } details`
                  : `Add a new ${
                      isBlog ? "blog" : "offer"
                    }`}
              </p>

            </div>

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
            className="
              flex-1
              overflow-y-auto
              px-5
              py-5
            "
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

                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Blog Title
                  </label>

                  <input
                    value={nameValue}
                    onChange={(e) =>
                      setNameValue(e.target.value)
                    }
                    className="
                      default-input
                      !h-11
                      !rounded-xl
                      !border-slate-200
                      !bg-white
                      !text-xs
                      !text-slate-700
                      transition-all
                      focus:!border-indigo-400
                      focus:!ring-2
                      focus:!ring-indigo-100
                    "
                    placeholder="Enter blog title"
                  />

                </div>


                {/* Blog Description */}

                <div className="mb-5">

                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Blog Description
                  </label>

                  <textarea
                    value={descriptionValue}
                    onChange={(e) =>
                      setDescriptionValue(
                        e.target.value
                      )
                    }
                    className="
                      default-teaxtarea
                      !rounded-xl
                      !border-slate-200
                      !bg-white
                      !text-xs
                      !text-slate-700
                      py-3
                      transition-all
                      focus:!border-indigo-400
                      focus:!ring-2
                      focus:!ring-indigo-100
                    "
                    placeholder="Enter blog description"
                    rows={5}
                  />

                </div>


                {/* Blog Image */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Blog Image
                  </label>

                  <input
                    className="hidden"
                    id="blog-img"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <label
                    htmlFor="blog-img"
                    className="
                      group
                      flex
                      h-36
                      w-full
                      cursor-pointer
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-2xl
                      border-2
                      border-dashed
                      border-slate-200
                      bg-white
                      transition-all
                      duration-300
                      hover:border-indigo-300
                      hover:bg-indigo-50/[0.35]
                    "
                  >

                    {imageValue.image ? (

                      <img
                        src={imageValue.image}
                        alt={
                          imageValue.fileName ||
                          "Blog"
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-[1.02]
                        "
                      />

                    ) : (

                      <div className="flex flex-col items-center">

                        <div
                          className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-indigo-50
                            text-indigo-500
                            transition-all
                            duration-300
                            group-hover:scale-110
                            group-hover:bg-indigo-100
                          "
                        >
                          <MdAddPhotoAlternate
                            size={25}
                          />
                        </div>

                        <span
                          className="
                            mt-2
                            text-[10px]
                            font-bold
                            text-slate-400
                          "
                        >
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

                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Offer Name
                  </label>

                  <input
                    value={nameValue}
                    onChange={(e) =>
                      setNameValue(e.target.value)
                    }
                    className="
                      default-input
                      !h-11
                      !rounded-xl
                      !border-slate-200
                      !bg-white
                      !text-xs
                      focus:!border-indigo-400
                      focus:!ring-2
                      focus:!ring-indigo-100
                    "
                    placeholder="Enter offer name"
                  />

                </div>


                {/* Offer Description */}

                <div className="mb-5">

                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Offer Description
                  </label>

                  <textarea
                    value={descriptionValue}
                    onChange={(e) =>
                      setDescriptionValue(
                        e.target.value
                      )
                    }
                    className="
                      default-teaxtarea
                      !rounded-xl
                      !border-slate-200
                      !bg-white
                      !text-xs
                      py-3
                      focus:!border-indigo-400
                      focus:!ring-2
                      focus:!ring-indigo-100
                    "
                    placeholder="Enter offer description"
                    rows={4}
                  />

                </div>


                {/* Dates */}

                <div className="mb-5 grid grid-cols-2 gap-3">

                  <div>

                    <label
                      className="
                        mb-2
                        block
                        text-[10px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Start Date
                    </label>

                    <input
                      value={offerStartDate}
                      onChange={(e) =>
                        setOfferStartDate(
                          e.target.value
                        )
                      }
                      className="
                        default-input
                        !h-11
                        !rounded-xl
                        !border-slate-200
                        !bg-white
                        !text-xs
                        focus:!border-indigo-400
                        focus:!ring-2
                        focus:!ring-indigo-100
                      "
                      type="date"
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                    />

                  </div>


                  <div>

                    <label
                      className="
                        mb-2
                        block
                        text-[10px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      End Date
                    </label>

                    <input
                      value={offerEndDate}
                      onChange={(e) =>
                        setOfferEndDate(
                          e.target.value
                        )
                      }
                      className="
                        default-input
                        !h-11
                        !rounded-xl
                        !border-slate-200
                        !bg-white
                        !text-xs
                        focus:!border-indigo-400
                        focus:!ring-2
                        focus:!ring-indigo-100
                      "
                      type="date"
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                    />

                  </div>

                </div>


                {/* Service Mode */}

                <div className="mb-5">

                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Restricted Service Mode
                  </label>

                  <Dropdown
                    value={
                      restrictedServiceMode
                    }
                    placeholder="Select service mode"
                    onSelect={
                      handleRestrictedServiceModeSelect
                    }
                    options={[
                      "pickup",
                      "home",
                      "none",
                    ]}
                    disabled={false}
                  />

                </div>


                {/* Prices */}

                <div className="mb-5 grid grid-cols-2 gap-3">

                  <div>

                    <label
                      className="
                        mb-2
                        block
                        text-[10px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Minimum Price
                    </label>

                    <input
                      value={
                        restrictedMinimumPrice
                      }
                      onChange={(e) =>
                        setRestrictedMinimumPrice(
                          e.target.value
                        )
                      }
                      className="
                        default-input
                        !h-11
                        !rounded-xl
                        !border-slate-200
                        !bg-white
                        !text-xs
                        focus:!border-indigo-400
                      "
                      placeholder="Min price"
                      type="number"
                    />

                  </div>


                  <div>

                    <label
                      className="
                        mb-2
                        block
                        text-[10px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Max Offer Price
                    </label>

                    <input
                      value={maxOfferPrice}
                      onChange={(e) =>
                        setMaxOfferPrice(
                          e.target.value
                        )
                      }
                      className="
                        default-input
                        !h-11
                        !rounded-xl
                        !border-slate-200
                        !bg-white
                        !text-xs
                        focus:!border-indigo-400
                      "
                      placeholder="Max price"
                      type="number"
                    />

                  </div>

                </div>


                {/* Offer By */}

                <div className="mb-5 grid grid-cols-2 gap-3">

                  <div>

                    <label
                      className="
                        mb-2
                        block
                        text-[10px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Offer Type
                    </label>

                    <Dropdown
                      value={offerBy}
                      placeholder="Select type"
                      onSelect={
                        handleOfferBySelect
                      }
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

                      <label
                        className="
                          mb-2
                          block
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-wider
                          text-slate-500
                        "
                      >
                        {offerBy.toLowerCase() ===
                        "flat price"
                          ? "Flat Price"
                          : offerBy.toLowerCase() ===
                              "coupon"
                            ? "Discount"
                            : "Percentage"}
                      </label>

                      <input
                        value={
                          offerBy.toLowerCase() ===
                          "flat price"
                            ? flatPrice
                            : offerPercentage
                        }
                        onChange={(e) =>
                          offerBy.toLowerCase() ===
                          "flat price"
                            ? setFlatPrice(
                                e.target.value
                              )
                            : setOfferPercentage(
                                e.target.value
                              )
                        }
                        className="
                          default-input
                          !h-11
                          !rounded-xl
                          !border-slate-200
                          !bg-white
                          !text-xs
                          focus:!border-indigo-400
                        "
                        placeholder={
                          offerBy.toLowerCase() ===
                          "flat price"
                            ? "Enter amount"
                            : "Enter percentage"
                        }
                        type="number"
                      />

                    </div>
                  )}

                </div>


                {/* Coupon */}

                {offerBy.toLowerCase() ===
                  "coupon" && (

                  <div className="mb-5">

                    <label
                      className="
                        mb-2
                        block
                        text-[10px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Coupon Code
                    </label>

                    <input
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(
                          e.target.value.toUpperCase()
                        )
                      }
                      className="
                        default-input
                        !h-11
                        !rounded-xl
                        !border-slate-200
                        !bg-white
                        !text-xs
                        font-bold
                        uppercase
                        tracking-widest
                        focus:!border-indigo-400
                      "
                      placeholder="ENTER COUPON CODE"
                      type="text"
                    />

                  </div>
                )}


                {/* Offer Image */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
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
                    className="
                      group
                      flex
                      h-36
                      w-full
                      cursor-pointer
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-2xl
                      border-2
                      border-dashed
                      border-slate-200
                      bg-white
                      transition-all
                      duration-300
                      hover:border-indigo-300
                      hover:bg-indigo-50/[0.35]
                    "
                  >

                    {imageValue.image ? (

                      <img
                        src={imageValue.image}
                        alt={
                          imageValue.fileName ||
                          "Offer"
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-[1.02]
                        "
                      />

                    ) : (

                      <div className="flex flex-col items-center">

                        <div
                          className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-indigo-50
                            text-indigo-500
                            transition-all
                            duration-300
                            group-hover:scale-110
                            group-hover:bg-indigo-100
                          "
                        >
                          <MdAddPhotoAlternate
                            size={25}
                          />
                        </div>

                        <span
                          className="
                            mt-2
                            text-[10px]
                            font-bold
                            text-slate-400
                          "
                        >
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

          <div
            className="
              flex
              gap-3
              border-t
              border-slate-200
              bg-white
              px-5
              py-4
            "
          >

            <button
              type="button"
              onClick={() => {
                setFilterDragger(false);
                resetForm();
              }}
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                text-xs
                font-bold
                text-slate-500
                transition-all
                duration-300
                hover:border-indigo-200
                hover:bg-indigo-50
                hover:text-indigo-600
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                h-11
                w-full
                rounded-xl
                bg-gradient-to-r
                from-indigo-600
                to-violet-600
                text-xs
                font-extrabold
                text-white
                shadow-[0_8px_20px_rgba(79,70,229,0.20)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_12px_25px_rgba(79,70,229,0.28)]
              "
            >
              {isEditing
                ? `Update ${
                    isBlog ? "Blog" : "Offer"
                  }`
                : `Create ${
                    isBlog ? "Blog" : "Offer"
                  }`}
            </button>

          </div>

        </form>

      </div>

    </MuiDrawer>

  </div>
);
};

export default AppManagementHeader;

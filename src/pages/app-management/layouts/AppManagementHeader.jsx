



import React, { useEffect, useState } from "react";
import { MdAddchart, MdAddPhotoAlternate } from "react-icons/md";
import {
  FaRegNewspaper,
  FaTag,
  FaCalendarAlt,
  FaPercent,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FiFileText, FiImage, FiTag as FiTagIcon } from "react-icons/fi";

import MuiDrawer from "@/components/drawer/MuiDrawer";
import Dropdown from "@/components/common/DropDown";
import AdminServices from "@/services/AdminServices";
import { DecryptData } from "@/utils/DecryptData";
import { notifyError, notifySuccess } from "@/utils/toast";

/* ============================================================
   LINKS
============================================================ */

export const links = ["Offers", "Blogs"];

/* ============================================================
   THEME
   Sidebar compatible blue theme
============================================================ */

const THEME = {
  navy: "#0f172a",
  text: "#111827",
  textMuted: "#64748b",

  blue: "#2563eb",
  blueDark: "#1d4ed8",
  blueSoft: "#eff6ff",
  blueBorder: "#dbeafe",

  white: "#ffffff",

  border: "#e5e7eb",
  borderSoft: "#eef2f7",

  surface: "#f8fafc",
};

/* ============================================================
   ICON BOX
============================================================ */

const IconBox = ({
  children,
  size = "h-10 w-10",
  radius = "rounded-[12px]",
}) => {
  return (
    <div
      className={`${size} ${radius} flex shrink-0 items-center justify-center`}
      style={{
        color: THEME.blue,
        backgroundColor: THEME.blueSoft,
        border: `1px solid ${THEME.blueBorder}`,
      }}
    >
      {children}
    </div>
  );
};

/* ============================================================
   INPUT WRAPPER
   IMPORTANT:
   No absolute positioning.
   Icon has its own fixed-width area.
============================================================ */

const InputWithIcon = ({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  inputClassName = "",
  ...props
}) => {
  return (
    <div
      className={`flex h-11 w-full items-center overflow-hidden rounded-[12px] bg-white transition-all duration-200 ${className}`}
      style={{
        border: `1px solid ${THEME.border}`,
      }}
    >
      {/* FIXED ICON AREA */}
      <div
        className="flex h-full w-[40px] shrink-0 items-center justify-center"
        style={{
          color: THEME.textMuted,
        }}
      >
        {icon}
      </div>

      {/* INPUT */}
      <input
        {...props}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          h-full
          min-w-0
          flex-1
          bg-transparent
          pr-3
          text-[11px]
          font-semibold
          outline-none
          placeholder:text-slate-400
          ${inputClassName}
        `}
        style={{
          color: THEME.text,
        }}
      />
    </div>
  );
};

/* ============================================================
   TEXTAREA CLASS
============================================================ */

const textareaClass = `
  w-full
  rounded-[12px]
  bg-white
  px-3.5
  py-3
  text-[11px]
  font-semibold
  leading-5
  outline-none
  resize-none
  placeholder:text-slate-400
`;

/* ============================================================
   LABEL
============================================================ */

const labelClass = `
  mb-2
  block
  text-[9px]
  font-extrabold
  uppercase
  tracking-[0.12em]
`;

/* ============================================================
   IMAGE UPLOADER
============================================================ */

const ImageUploader = ({
  id,
  imageValue,
  onChange,
  label,
  alt,
}) => {
  return (
    <div>
      <label
        className={labelClass}
        style={{
          color: THEME.textMuted,
        }}
      >
        {label}
      </label>

      <input
        className="hidden"
        id={id}
        type="file"
        accept="image/*"
        onChange={onChange}
      />

      <label
        htmlFor={id}
        className="
          group
          flex
          h-40
          w-full
          cursor-pointer
          items-center
          justify-center
          overflow-hidden
          rounded-[15px]
          bg-white
          transition-all
          duration-300
        "
        style={{
          border: `1px dashed ${THEME.blueBorder}`,
        }}
      >
        {imageValue.image ? (
          <div className="relative h-full w-full">
            <img
              src={imageValue.image}
              alt={alt}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-[1.02]
              "
            />

            <div
              className="
                absolute
                bottom-2
                left-2
                flex
                items-center
                gap-1.5
                rounded-full
                px-2.5
                py-1.5
                text-[8px]
                font-bold
              "
              style={{
                color: THEME.navy,
                backgroundColor: THEME.white,
                border: `1px solid ${THEME.border}`,
              }}
            >
              <FiImage size={10} />
              Change image
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <IconBox
              size="h-12 w-12"
              radius="rounded-[13px]"
            >
              <MdAddPhotoAlternate size={23} />
            </IconBox>

            <span
              className="mt-2 text-[9px] font-bold"
              style={{
                color: THEME.textMuted,
              }}
            >
              Click to upload image
            </span>

            <span
              className="mt-1 text-[8px]"
              style={{
                color: "#94a3b8",
              }}
            >
              JPG, PNG or WEBP
            </span>
          </div>
        )}
      </label>
    </div>
  );
};

/* ============================================================
   COMPONENT
============================================================ */

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

  const [restrictedMinimumPrice, setRestrictedMinimumPrice] =
    useState("");

  const [maxOfferPrice, setMaxOfferPrice] = useState("");

  const [imageValue, setImageValue] = useState({
    fileName: "",
    image: "",
  });

  const [flatPrice, setFlatPrice] = useState("");
  const [offerPercentage, setOfferPercentage] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const [
    restrictedServiceMode,
    setRestrictedServiceModeSelectedOption,
  ] = useState("");

  const [offerBy, setOfferBySelectedOption] = useState("");

  /* ============================================================
     RESET FORM
  ============================================================ */

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

  /* ============================================================
     TAB CHANGE
  ============================================================ */

  const handleTabChange = (link) => {
    resetForm();

    if (typeof setCurrentLink === "function") {
      setCurrentLink(link);
    }
  };

  /* ============================================================
     IMAGE CHANGE
  ============================================================ */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImageValue({
        fileName: file.name,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  /* ============================================================
     SUBMIT
  ============================================================ */

  const handleSubmit = (e) => {
    e.preventDefault();

    const offerPayload = {
      offerName: nameValue,
      offerDescription: descriptionValue,
      offerStartDate,
      offerEndDate,

      restrictedServiceMode:
        restrictedServiceMode?.toLowerCase() || "",

      restrictedMinimumPrice,
      maxOfferPrice,
      couponCode,

      offerBy: {
        ...(offerBy?.toLowerCase() === "percentage"
          ? {
              percentage: offerPercentage,
            }
          : offerBy?.toLowerCase() === "coupon"
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

    const onSuccess = (message) => {
      notifySuccess(message);

      if (typeof getManagementList === "function") {
        getManagementList();
      }

      setFilterDragger(false);
      resetForm();
    };

    const onError = (err) => {
      const d = DecryptData(err?.response?.data);

      notifyError(
        d?.error?.message || "Something went wrong"
      );
    };

    /* ========================================================
       OFFERS
    ======================================================== */

    if (currentLink === "Offers") {
      const call = editValue?._id
        ? AdminServices.updateOffer({
            ...offerPayload,
            offerId: editValue._id,
          })
        : AdminServices.createOffer(offerPayload);

      call
        .then(() =>
          onSuccess(
            editValue?._id
              ? "Offer updated successfully!"
              : "Offer created successfully!"
          )
        )
        .catch(onError);

      return;
    }

    /* ========================================================
       BLOGS
    ======================================================== */

    if (currentLink === "Blogs") {
      const call = editValue?._id
        ? AdminServices.updateBlog({
            ...blogPayload,
            blogId: editValue._id,
          })
        : AdminServices.createBlog(blogPayload);

      call
        .then(() =>
          onSuccess(
            editValue?._id
              ? "Blog updated successfully!"
              : "Blog created successfully!"
          )
        )
        .catch(onError);
    }
  };

  /* ============================================================
     LOAD EDIT DATA
  ============================================================ */

  useEffect(() => {
    if (!editValue?._id) return;

    if (currentLink === "Blogs") {
      setNameValue(editValue?.blogTitle || "");

      setDescriptionValue(
        editValue?.blogDescription || ""
      );

      setImageValue({
        fileName: "",
        image: editValue?.blogImage || "",
      });

      return;
    }

    if (currentLink === "Offers") {
      setNameValue(editValue?.offerName || "");

      setDescriptionValue(
        editValue?.offerDescription || ""
      );

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

      setMaxOfferPrice(
        editValue?.maxOfferPrice || ""
      );

      setImageValue({
        fileName: "",
        image: editValue?.offerImage || "",
      });

      setFlatPrice(
        editValue?.offerBy?.flatPrice || ""
      );

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

      setCouponCode(
        editValue?.couponCode || ""
      );
    }
  }, [editValue, currentLink]);

  /* ============================================================
     IMPORTANT:
     Do NOT call setCurrentLink inside useEffect.
     Parent should control currentLink.
  ============================================================ */

  const isEditing = Boolean(editValue?._id);
  const isBlog = currentLink === "Blogs";

  const today = new Date()
    .toISOString()
    .split("T")[0];

  /* ============================================================
     RETURN
  ============================================================ */

  return (
    <div className="mb-6 mt-4">

      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <div
        className="
          relative
          mb-6
          overflow-hidden
          rounded-[22px]
          bg-white
          px-5
          py-5
          shadow-[0_8px_30px_rgba(15,23,42,0.05)]
          sm:px-6
        "
        style={{
          border: `1px solid ${THEME.border}`,
        }}
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-20
            h-48
            w-48
            rounded-full
            opacity-[0.045]
          "
          style={{
            backgroundColor: THEME.blue,
          }}
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            -left-16
            h-40
            w-40
            rounded-full
            opacity-[0.035]
          "
          style={{
            backgroundColor: THEME.blue,
          }}
        />

        <div
          className="
            relative
            z-10
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* LEFT */}

          <div className="flex items-center gap-4">
            <IconBox
              size="h-14 w-14"
              radius="rounded-[17px]"
            >
              {isBlog ? (
                <FaRegNewspaper size={22} />
              ) : (
                <MdAddchart size={24} />
              )}
            </IconBox>

            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <h1
                  className="
                    text-[21px]
                    font-extrabold
                    tracking-[-0.02em]
                  "
                  style={{
                    color: THEME.navy,
                  }}
                >
                  {isBlog ? "Blogs" : "Offers"}
                </h1>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    px-2.5
                    py-1
                    text-[8px]
                    font-extrabold
                    uppercase
                    tracking-[0.1em]
                  "
                  style={{
                    color: THEME.navy,
                    backgroundColor: THEME.blueSoft,
                    border: `1px solid ${THEME.blueBorder}`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: THEME.blue,
                    }}
                  />

                  {isBlog ? "Content" : "Promotion"}
                </span>
              </div>

              <p
                className="
                  max-w-[520px]
                  text-[10px]
                  leading-5
                "
                style={{
                  color: THEME.textMuted,
                }}
              >
                {isBlog
                  ? "Publish and manage blog content from one place."
                  : "Create and manage promotional offers and discounts."}
              </p>
            </div>
          </div>

          {/* TABS */}

          <div
            className="
              flex
              items-center
              gap-1
              rounded-[13px]
              bg-white
              p-1
            "
            style={{
              border: `1px solid ${THEME.border}`,
            }}
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
        items-center
        gap-2
        overflow-hidden
        rounded-[10px]
        px-4
        py-2.5
        text-[10px]
        font-extrabold
        transition-all
        duration-300
        ease-out
        ${
          active
            ? "shadow-[0_4px_12px_rgba(37,99,235,0.10)]"
            : "hover:-translate-y-[1px] hover:shadow-[0_5px_14px_rgba(37,99,235,0.10)]"
        }
      `}
      style={{
        color: active ? THEME.blue : THEME.textMuted,

        backgroundColor: active
          ? THEME.blueSoft
          : THEME.white,

        border: active
          ? `1px solid ${THEME.blueBorder}`
          : `1px solid ${THEME.border}`,
      }}
    >
      {/* Hover background */}
      <span
        className={`
          pointer-events-none
          absolute
          inset-0
          rounded-[10px]
          bg-[#eff6ff]
          transition-all
          duration-300
          ${
            active
              ? "opacity-0"
              : "opacity-0 group-hover:opacity-100"
          }
        `}
      />

      {/* Bottom animated line */}
      <span
        className={`
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-[2px]
          -translate-x-1/2
          rounded-full
          bg-[#2563eb]
          transition-all
          duration-300
          ${
            active
              ? "w-5 opacity-100"
              : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
          }
        `}
      />

      {/* Icon */}
      <span
        className="
          relative
          z-10
          flex
          items-center
          justify-center
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:-translate-y-[1px]
        "
      >
        {link === "Offers" ? (
          <FaTag size={11} />
        ) : (
          <FaRegNewspaper size={11} />
        )}
      </span>

      {/* Text */}
      <span
        className="
          relative
          z-10
          transition-all
          duration-300
          group-hover:tracking-[0.02em]
        "
      >
        {link}
      </span>
    </button>
  );
})}
          </div>
        </div>
      </div>

      {/* ========================================================
          DRAWER
      ======================================================== */}

      <MuiDrawer
        open={filterDragger}
        onClose={() => {
          setFilterDragger(false);
          resetForm();
        }}
        drawerWidth="420px"
      >
        <div className="flex h-full flex-col bg-white">

          {/* DRAWER HEADER */}

          <div
            className="
              relative
              overflow-hidden
              border-b
              px-5
              py-4
            "
            style={{
              borderColor: THEME.border,
              backgroundColor: THEME.white,
            }}
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-12
                -top-16
                h-40
                w-40
                rounded-full
                opacity-[0.06]
              "
              style={{
                backgroundColor: THEME.blue,
              }}
            />

            <div className="relative z-10 flex items-center gap-3">
              <IconBox
                size="h-11 w-11"
                radius="rounded-[13px]"
              >
                {isBlog ? (
                  <FaRegNewspaper size={17} />
                ) : (
                  <MdAddchart size={19} />
                )}
              </IconBox>

              <div>
                <p
                  className="text-[13px] font-extrabold"
                  style={{
                    color: THEME.navy,
                  }}
                >
                  {isEditing
                    ? `Update ${isBlog ? "Blog" : "Offer"}`
                    : `Create ${isBlog ? "Blog" : "Offer"}`}
                </p>

                <p
                  className="mt-0.5 text-[9px]"
                  style={{
                    color: THEME.textMuted,
                  }}
                >
                  {isEditing
                    ? `Edit existing ${
                        isBlog ? "blog" : "offer"
                      }`
                    : `Add a new ${
                        isBlog ? "blog" : "offer"
                      }`}
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}

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

              {/* ==================================================
                  BLOG
              ================================================== */}

              {isBlog ? (
                <>
                  {/* BLOG TITLE */}

                  <div className="mb-5">
                    <label
                      className={labelClass}
                      style={{
                        color: THEME.textMuted,
                      }}
                    >
                      Blog Title
                    </label>

                    <InputWithIcon
                      icon={<FiFileText size={13} />}
                      value={nameValue}
                      onChange={(e) =>
                        setNameValue(e.target.value)
                      }
                      placeholder="Enter blog title"
                    />
                  </div>

                  {/* BLOG DESCRIPTION */}

                  <div className="mb-5">
                    <label
                      className={labelClass}
                      style={{
                        color: THEME.textMuted,
                      }}
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
                      className={textareaClass}
                      style={{
                        color: THEME.text,
                        border: `1px solid ${THEME.border}`,
                      }}
                      placeholder="Enter blog description"
                      rows={5}
                    />
                  </div>

                  {/* BLOG IMAGE */}

                  <ImageUploader
                    id="blog-img"
                    label="Blog Image"
                    imageValue={imageValue}
                    onChange={handleImageChange}
                    alt="Blog"
                  />
                </>
              ) : (

                /* ==================================================
                   OFFER
                ================================================== */

                <>
                  {/* OFFER NAME */}

                  <div className="mb-5">
                    <label
                      className={labelClass}
                      style={{
                        color: THEME.textMuted,
                      }}
                    >
                      Offer Name
                    </label>

                    <InputWithIcon
                      icon={<FiTagIcon size={13} />}
                      value={nameValue}
                      onChange={(e) =>
                        setNameValue(e.target.value)
                      }
                      placeholder="Enter offer name"
                    />
                  </div>

                  {/* OFFER DESCRIPTION */}

                  <div className="mb-5">
                    <label
                      className={labelClass}
                      style={{
                        color: THEME.textMuted,
                      }}
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
                      className={textareaClass}
                      style={{
                        color: THEME.text,
                        border: `1px solid ${THEME.border}`,
                      }}
                      placeholder="Enter offer description"
                      rows={4}
                    />
                  </div>

                  {/* DATES */}

                  <div className="mb-5 grid grid-cols-2 gap-3">

                    <div>
                      <label
                        className={labelClass}
                        style={{
                          color: THEME.textMuted,
                        }}
                      >
                        Start Date
                      </label>

                      <InputWithIcon
                        icon={<FaCalendarAlt size={11} />}
                        value={offerStartDate}
                        onChange={(e) =>
                          setOfferStartDate(
                            e.target.value
                          )
                        }
                        type="date"
                        min={today}
                      />
                    </div>

                    <div>
                      <label
                        className={labelClass}
                        style={{
                          color: THEME.textMuted,
                        }}
                      >
                        End Date
                      </label>

                      <InputWithIcon
                        icon={<FaCalendarAlt size={11} />}
                        value={offerEndDate}
                        onChange={(e) =>
                          setOfferEndDate(
                            e.target.value
                          )
                        }
                        type="date"
                        min={today}
                      />
                    </div>

                  </div>

                  {/* SERVICE MODE */}

                  <div className="mb-5">
                    <label
                      className={labelClass}
                      style={{
                        color: THEME.textMuted,
                      }}
                    >
                      Restricted Service Mode
                    </label>

                    <Dropdown
                      value={restrictedServiceMode}
                      placeholder="Select service mode"
                      onSelect={
                        setRestrictedServiceModeSelectedOption
                      }
                      options={[
                        "pickup",
                        "home",
                        "none",
                      ]}
                      disabled={false}
                    />
                  </div>

                  {/* PRICES */}

                  <div className="mb-5 grid grid-cols-2 gap-3">

                    <div>
                      <label
                        className={labelClass}
                        style={{
                          color: THEME.textMuted,
                        }}
                      >
                        Minimum Price
                      </label>

                      <InputWithIcon
                        icon={
                          <FaMoneyBillWave size={11} />
                        }
                        value={restrictedMinimumPrice}
                        onChange={(e) =>
                          setRestrictedMinimumPrice(
                            e.target.value
                          )
                        }
                        placeholder="Min price"
                        type="number"
                      />
                    </div>

                    <div>
                      <label
                        className={labelClass}
                        style={{
                          color: THEME.textMuted,
                        }}
                      >
                        Max Offer Price
                      </label>

                      <InputWithIcon
                        icon={
                          <FaMoneyBillWave size={11} />
                        }
                        value={maxOfferPrice}
                        onChange={(e) =>
                          setMaxOfferPrice(
                            e.target.value
                          )
                        }
                        placeholder="Max price"
                        type="number"
                      />
                    </div>

                  </div>

                  {/* OFFER TYPE */}

                  <div className="mb-5 grid grid-cols-2 gap-3">

                    <div>
                      <label
                        className={labelClass}
                        style={{
                          color: THEME.textMuted,
                        }}
                      >
                        Offer Type
                      </label>

                      <Dropdown
                        value={offerBy}
                        placeholder="Select type"
                        onSelect={
                          setOfferBySelectedOption
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
                          className={labelClass}
                          style={{
                            color: THEME.textMuted,
                          }}
                        >
                          {offerBy.toLowerCase() ===
                          "flat price"
                            ? "Flat Price"
                            : offerBy.toLowerCase() ===
                                "coupon"
                              ? "Discount"
                              : "Percentage"}
                        </label>

                        <InputWithIcon
                          icon={
                            offerBy.toLowerCase() ===
                            "flat price" ? (
                              <FaMoneyBillWave size={11} />
                            ) : (
                              <FaPercent size={10} />
                            )
                          }
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

                  {/* COUPON */}

                  {offerBy.toLowerCase() ===
                    "coupon" && (
                    <div className="mb-5">
                      <label
                        className={labelClass}
                        style={{
                          color: THEME.textMuted,
                        }}
                      >
                        Coupon Code
                      </label>

                      <InputWithIcon
                        icon={<FaTag size={11} />}
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(
                            e.target.value.toUpperCase()
                          )
                        }
                        placeholder="ENTER COUPON CODE"
                        type="text"
                        inputClassName="
                          font-extrabold
                          uppercase
                          tracking-[0.12em]
                        "
                      />
                    </div>
                  )}

                  {/* OFFER IMAGE */}

                  <ImageUploader
                    id="offer-img"
                    label="Offer Image"
                    imageValue={imageValue}
                    onChange={handleImageChange}
                    alt="Offer"
                  />
                </>
              )}
            </div>

            {/* ==================================================
                ACTION BUTTONS
            ================================================== */}

            <div
              className="
                flex
                gap-3
                border-t
                bg-white
                px-5
                py-4
              "
              style={{
                borderColor: THEME.border,
              }}
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
                  rounded-[11px]
                  bg-white
                  text-[10px]
                  font-extrabold
                  transition-all
                  duration-200
                  hover:bg-slate-50
                "
                style={{
                  color: THEME.navy,
                  border: `1px solid ${THEME.border}`,
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  h-11
                  w-full
                  rounded-[11px]
                  text-[10px]
                  font-extrabold
                  text-white
                  shadow-[0_6px_18px_rgba(37,99,235,0.16)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                "
                style={{
                  backgroundColor: THEME.blue,
                }}
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
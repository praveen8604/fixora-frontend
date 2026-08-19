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
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title */}
          <div>
            <h1 className="text-white font-bold text-xl">App Management</h1>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your offers and blogs from here
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1.5 w-fit">
            {links.map((link) => {
              const active = link === currentLink;

              return (
                <button
                  key={link}
                  type="button"
                  onClick={() => handleTabChange(link)}
                  className={`flex items-center justify-center gap-2 min-w-[115px] px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-[var(--primary-color)] text-[var(--secondary-elite-color)] shadow-sm"
                      : "text-[var(--primary-elite-color)] hover:bg-white dark:hover:bg-gray-600"
                  }`}
                >
                  {link === "Offers" ? (
                    <FaTag size={14} />
                  ) : (
                    <FaRegNewspaper size={14} />
                  )}

                  {link}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drawer */}
      <MuiDrawer
        open={filterDragger}
        onClose={() => setFilterDragger(false)}
        drawerWidth="400px"
      >
        <div className="h-[var(--doc-height)] bg-[var(--secondary-light-2-color)] dark:bg-gray-800 flex flex-col">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-color)] flex items-center justify-center">
                {isBlog ? (
                  <FaRegNewspaper
                    size={18}
                    className="text-[var(--primary-elite-color)]"
                  />
                ) : (
                  <MdAddchart
                    size={20}
                    className="text-[var(--primary-elite-color)]"
                  />
                )}
              </div>

              <div>
                <h2 className="font-bold text-base text-[var(--primary-elite-color)]">
                  {isEditing
                    ? `Update ${isBlog ? "Blog" : "Offer"}`
                    : `Create ${isBlog ? "Blog" : "Offer"}`}
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  {isEditing
                    ? `Update your ${isBlog ? "blog" : "offer"} details`
                    : `Add a new ${isBlog ? "blog" : "offer"}`}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 min-h-0"
          >
            <div
              className="flex-1 overflow-y-auto px-5 py-5"
              style={{
                scrollbarWidth: "thin",
              }}
            >
              {/* BLOG FORM */}
              {isBlog ? (
                <>
                  <div className="flex flex-col text-sm mb-4">
                    <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
                      Blog Title
                    </label>

                    <input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className="default-input"
                      placeholder="Enter blog title"
                    />
                  </div>

                  <div className="flex flex-col text-sm mb-4">
                    <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
                      Blog Description
                    </label>

                    <textarea
                      value={descriptionValue}
                      onChange={(e) => setDescriptionValue(e.target.value)}
                      className="default-teaxtarea py-2"
                      placeholder="Enter blog description"
                      rows={5}
                    />
                  </div>

                  {/* Blog Image */}
                  <div className="flex flex-col text-sm">
                    <label className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
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
                      className="w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer flex items-center justify-center overflow-hidden hover:border-[var(--primary-elite-color)] transition-colors"
                    >
                      {imageValue.image ? (
                        <img
                          src={imageValue.image}
                          alt={imageValue.fileName || "Blog"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <MdAddPhotoAlternate size={32} />

                          <span className="text-xs mt-2">
                            Click to upload image
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </>
              ) : (
                <>
                  {/* Offer Name */}
                  <div className="flex flex-col text-sm mb-4">
                    <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
                      Offer Name
                    </label>

                    <input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className="default-input"
                      placeholder="Enter offer name"
                    />
                  </div>

                  {/* Offer Description */}
                  <div className="flex flex-col text-sm mb-4">
                    <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
                      Offer Description
                    </label>

                    <textarea
                      value={descriptionValue}
                      onChange={(e) => setDescriptionValue(e.target.value)}
                      className="default-teaxtarea py-2"
                      placeholder="Enter offer description"
                      rows={4}
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="flex flex-col">
                      <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
                        Start Date
                      </label>

                      <input
                        value={offerStartDate}
                        onChange={(e) => setOfferStartDate(e.target.value)}
                        className="default-input"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
                        End Date
                      </label>

                      <input
                        value={offerEndDate}
                        onChange={(e) => setOfferEndDate(e.target.value)}
                        className="default-input"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  {/* Service Mode */}
                  <div className="flex flex-col text-sm mb-4">
                    <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
                      Restricted Service Mode
                    </label>

                    <Dropdown
                      value={restrictedServiceMode}
                      placeholder="Select service mode"
                      onSelect={handleRestrictedServiceModeSelect}
                      options={["pickup", "home", "none"]}
                      disabled={false}
                    />
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="flex flex-col">
                      <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
                        Min Price
                      </label>

                      <input
                        value={restrictedMinimumPrice}
                        onChange={(e) =>
                          setRestrictedMinimumPrice(e.target.value)
                        }
                        className="default-input"
                        placeholder="Min price"
                        type="number"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
                        Max Offer Price
                      </label>

                      <input
                        value={maxOfferPrice}
                        onChange={(e) => setMaxOfferPrice(e.target.value)}
                        className="default-input"
                        placeholder="Max price"
                        type="number"
                      />
                    </div>
                  </div>

                  {/* Offer By */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="flex flex-col">
                      <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
                        Offer By
                      </label>

                      <Dropdown
                        value={offerBy}
                        placeholder="Select offer type"
                        onSelect={handleOfferBySelect}
                        options={["Flat Price", "Percentage", "Coupon"]}
                        disabled={false}
                      />
                    </div>

                    {offerBy && (
                      <div className="flex flex-col">
                        <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
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
                              : setOfferPercentage(e.target.value)
                          }
                          className="default-input"
                          placeholder={
                            offerBy.toLowerCase() === "flat price"
                              ? "Enter flat price"
                              : "Enter percentage"
                          }
                          type="number"
                        />
                      </div>
                    )}
                  </div>

                  {/* Coupon */}
                  {offerBy.toLowerCase() === "coupon" && (
                    <div className="flex flex-col text-sm mb-4">
                      <label className="font-semibold mb-1.5 text-gray-700 dark:text-gray-200">
                        Coupon Code
                      </label>

                      <input
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        className="default-input uppercase"
                        placeholder="Enter coupon code"
                        type="text"
                      />
                    </div>
                  )}

                  {/* Offer Image */}
                  <div className="flex flex-col text-sm">
                    <label className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
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
                      className="w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer flex items-center justify-center overflow-hidden hover:border-[var(--primary-elite-color)] transition-colors"
                    >
                      {imageValue.image ? (
                        <img
                          src={imageValue.image}
                          alt={imageValue.fileName || "Offer"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <MdAddPhotoAlternate size={32} />

                          <span className="text-xs mt-2">
                            Click to upload image
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setFilterDragger(false);
                  resetForm();
                }}
                className="w-full h-11 rounded-lg border-2 border-[var(--primary-elite-color)] text-[var(--primary-elite-color)] font-semibold text-sm hover:bg-[var(--primary-elite-color)] hover:text-white transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[var(--primary-elite-color)] text-white font-semibold text-sm hover:opacity-90 transition-all"
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

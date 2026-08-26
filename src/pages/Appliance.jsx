// import DashboardServices from "@/services/DashboardServices";
// import { DecryptData, encode } from "@/utils/DecryptData";
// import { useHistory } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { FaBoxOpen } from "react-icons/fa";
// import { FaExternalLinkAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import AnimatedContent from "@/components/common/AnimatedContent";
// import MuiDrawer from "@/components/drawer/MuiDrawer";
// import { LuComputer } from "react-icons/lu";
// import Dropdown from "@/components/common/DropDown";
// import { notifyError } from "@/utils/toast";
// import AdminServices from "@/services/AdminServices";
// import BackdropProgressLoader from "@/components/common/BackdropProgressLoader";
// import { MdAddPhotoAlternate } from "react-icons/md";
// import moment from "moment";
// import { deviceImages } from "@/data/deviceImages";
// import otherdevice from "../assets/img/gadgets/other-gadget.png";
// // import PageTitle from "@/components/Typography/PageTitle";

// export const getDeviceImage = (item) => {
//   return (
//     deviceImages?.find(
//       (e) =>
//         e?.deviceType?.toLowerCase() ===
//           item?.appliance?.applianceName?.toLowerCase() &&
//         (e.brandName[0] !== "other"
//           ? e?.brandName?.includes(item?.brand?.brandName?.toLowerCase())
//           : true)
//     )?.deviceImage || otherdevice
//   );
// };

// const Appliance = () => {
//   const [loadingPercentage, setLoadingPercentage] = useState(0);
//   const [appliance, setAppliance] = useState([]);
//   const [mappedAppliance, setMappedAppliance] = useState([]);
//   const history = useHistory();
//   const [applianceInput, setApplianceInput] = useState(false);
//   const [brandInput, setBrandInput] = useState(false);
//   const [brands, setBrands] = useState([]);
//   const [models, setModels] = useState([]);
//   const [createApplianceModal, setCreateApplianceModal] = useState(false);
//   const [applianceId, setApplianceId] = useState("");
//   const [brandId, setBrandId] = useState("");
//   const [loadingStatus, setLoadingStatus] = useState("");
//   const [applianceSelectedOption, setApplianceSelectedOption] = useState("");
//   const [brandSelectedOption, setBrandSelectedOption] = useState("");
//   const [modelValue, setModelValue] = useState("");
//   const [applianceImage, setApplianceImage] = useState({
//     fileName: "",
//     image: "",
//   });
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);

//       reader.onload = () => {
//         setApplianceImage({
//           fileName: `appliance-${new Date()
//             .toISOString()
//             .replace(/[:.]/g, "-")}`,
//           image: reader.result,
//         });
//       };
//     }
//   };
//   const handleApplianceSelect = (e, _id) => {
//     if (_id === 1) {
//       setApplianceInput(true);
//       setBrandInput(true);
//       setApplianceId("");
//       setBrandId("");
//       return;
//     } else {
//       setApplianceSelectedOption(e);
//       setApplianceInput(false);
//       setBrandInput(false);
//       setApplianceId(_id);
//     }
//     const foundAppliance = mappedAppliance.find(
//       (e) => e?.appliances?._id === _id
//     );
//     setBrands([
//       ...foundAppliance?.appliances?.brands,
//       { _id: 1, brandName: "Other" },
//     ]);
//   };
//   const handleBrandSelect = (e, _id) => {
//     if (_id === 1) {
//       setBrandInput(true);
//       setBrandId("");
//       return;
//     } else {
//       setBrandId(_id);
//       setBrandSelectedOption(e);
//       setBrandInput(false);
//     }
//     const foundBrand = brands.find((e) => e?._id === _id);
//     setModels(foundBrand?.models);
//   };
//   const getMappedAppliance = () => {
//     DashboardServices.getMappedAppliance()
//       .then((res) => {
//         if (res) {
//           const decodedata = DecryptData(res);
//           const formattedApplianceList =
//             decodedata?.data?.mappedAppliances?.flatMap((data) =>
//               data?.appliances?.brands?.flatMap((brandData) =>
//                 brandData?.models?.map((modelData) => ({
//                   appliance: {
//                     applianceName: data?.appliances?.applianceName,
//                     applianceId: data?.appliances?._id,
//                   },
//                   brand: {
//                     brandName: brandData?.brandName,
//                     brandId: brandData?._id,
//                   },
//                   model: {
//                     modelName: modelData?.modelName,
//                     dateOfPurchase: modelData?.dateOfPurchase,
//                     extendUpto: modelData?.extendUpto,
//                     isWarrantyApproved: modelData?.isWarrantyApproved,
//                     warrantyDocuments: modelData?.warrantyDocuments,
//                     modelId: modelData?._id,
//                     attachment: modelData?.attachment,
//                   },
//                   createdBy: modelData?.createdBy,
//                   createdAt: modelData?.createdAt,
//                   updatedBy: modelData?.updatedBy,
//                   updatedAt: modelData?.updatedAt,
//                 }))
//               )
//             );

//           const appliancesList = decodedata?.data?.mappedAppliances.filter(
//             (e) => e?.appliances.createdBy?.role === "admin"
//           );
//           console.log("decodedata.data.appliances: ", appliancesList);
//           setMappedAppliance([
//             ...appliancesList,
//             {
//               appliances: {
//                 _id: 1,
//                 applianceName: "Other",
//               },
//             },
//           ]);
//           setAppliance([...formattedApplianceList]);
//           // DashboardServices.getAdminMappedAppliance()
//           //   .then((res) => {
//           //     if (res) {
//           //       const decodedata = DecryptData(res);
//           //       const formattedApplianceListAdmin =
//           //         decodedata?.data?.appliances?.map((data) => {
//           //           return {
//           //             appliance: {
//           //               applianceName: data?.applianceName,
//           //               applianceId: data?._id,
//           //               deviceDetails: data?.deviceDetails,
//           //             },
//           //             model: {
//           //               attachment: data?.deviceImage,
//           //             },
//           //             createdBy: data?.createdBy,
//           //             createdAt: data?.createdAt,
//           //             updatedBy: data?.updatedBy,
//           //             updatedAt: data?.updatedAt,
//           //           };
//           //         });

//           //       console.log(
//           //         "decodedata.data.appliances-admin: ",
//           //         decodedata?.data,
//           //         formattedApplianceListAdmin
//           //       );
//           //       setAppliance([
//           //         ...formattedApplianceList,
//           //         ...formattedApplianceListAdmin,
//           //       ]);
//           //       // setMappedAppliance([
//           //       //   ...decodedata?.data?.mappedAppliances,
//           //       //   {
//           //       //     appliances: {
//           //       //       _id: 1,
//           //       //       applianceName: "Other",
//           //       //     },
//           //       //   },
//           //       // ]);
//           //     }
//           //   })
//           //   .catch((err) => {
//           //     console.log("err:errerr", err);

//           //     const decryptedData = DecryptData(err?.response?.data);
//           //     notifyError(decryptedData?.error?.message);
//           //   });
//         }
//       })
//       .catch((err) => {
//         const decryptedData = DecryptData(err?.response?.data);
//         notifyError(decryptedData?.error?.message);
//       });
//   };
//   const handleCreateAppliance = () => {
//     setLoadingPercentage(1);
//     AdminServices.createAppliance({
//       applianceName: applianceSelectedOption,
//       applianceId,
//     }).then((applianceRes) => {
//       if (applianceRes) {
//         setLoadingStatus("Appliance created!");
//         setApplianceId("");
//         const applianceDecodedata = DecryptData(applianceRes);
//         setLoadingPercentage(35);
//         AdminServices.createBrand({
//           brandName: brandSelectedOption,
//           applianceId: applianceDecodedata?.data?.commonAppliance?._id,
//           brandId,
//         }).then((brandRes) => {
//           setLoadingPercentage(70);
//           setLoadingStatus("Brand created!");
//           setBrandId("");
//           const brandDecodedata = DecryptData(brandRes);
//           AdminServices.createModel({
//             applianceId: applianceDecodedata?.data?.commonAppliance?._id,
//             brandId: brandDecodedata?.data?.commonBrand?._id,
//             modelName: modelValue,
//             attachmentValue: applianceImage.image,
//             fileName: applianceImage.fileName,
//           }).then((modelRes) => {
//             if (modelRes) {
//               setLoadingStatus("Model created!");
//               setLoadingPercentage(99);
//               setTimeout(() => {
//                 setLoadingPercentage(100);
//                 getMappedAppliance();
//                 setCreateApplianceModal(false);
//                 setTimeout(() => {
//                   setLoadingStatus("");
//                   setLoadingPercentage(0);
//                 }, 1000);
//               }, 1500);
//             }
//           });
//         });
//       }
//     });
//   };
//   useEffect(() => {
//     getMappedAppliance();
//   }, []);
//   return (
//     <>
//       {/* <PageTitle>Appliances</PageTitle> */}
//       <AnimatedContent>
//         <div className="p-4">
//           {/* Header */}
//           <div className="mt-4 font-bold text-md flex items-center justify-between">
//             <div>Appliance Management</div>
//             <button
//               className="px-4 py-3 bg-[var(--primary-elite-color)] text-xs text-white rounded-md"
//               onClick={() => setCreateApplianceModal(true)}
//             >
//               <div className="font-bold text-md flex items-center gap-2">
//                 <LuComputer size={16} /> Create Appliance
//               </div>
//             </button>
//           </div>
//           {/* Product Table */}
//           <div className="overflow-x-auto relative mt-4">
//             <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[65vh] overflow-auto">
//               <table className="w-full text-sm text-left rtl:text-right text-gray-500">
//                 <thead className="text-xs bg-[var(--primary-elite-color)] text-[var(--primary-color)] sticky top-0 z-10">
//                   <tr>
//                     <th scope="col" className="px-16 py-3">
//                       <span className="sr-only">Image</span>
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Created By
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Image
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Appliance Name
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Brand Name
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Model Name
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Date of Purchase
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Expire On
//                     </th>
//                     <th scope="col" className="px-6 py-3">
//                       Created On
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {appliance?.map((appliance, index) => (
//                     <tr
//                       key={appliance._id}
//                       className="bg-white text-xs cursor-pointer border-b bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-gray-50"
//                       onClick={() => {
//                         const encodedAppData = encode(appliance);
//                         history.push(
//                           `/appliance/overview?applianceId=${
//                             appliance?.appliance?.applianceId
//                           }&appData=${encodeURIComponent(encodedAppData)}`
//                         );
//                       }}
//                     >
//                       <td className="p-3">
//                         <FaBoxOpen size={28} />
//                       </td>
//                       <td className="px-6 py-3 font-semibold flex items-center gap-2 text-gray-900 text-[var(--secondary-color)]">
//                         <div>{appliance?.createdBy?.userName}</div>
//                         <div onClick={(e) => e.stopPropagation()}>
//                           <Link
//                             to={`/user?userId=${appliance?.createdBy?._id}`}
//                           >
//                             <FaExternalLinkAlt
//                               className={
//                                 "cursor-pointer hover:text-[var(--primary-elite-color)]"
//                               }
//                             />
//                           </Link>
//                         </div>
//                       </td>
//                       <td className="py-3 font-semibold text-gray-900 text-[var(--secondary-color)]">
//                         <div className="flex items-center justify-center">
//                           <img
//                             src={
//                               appliance?.model?.attachment ||
//                               getDeviceImage(appliance)
//                             }
//                             alt={appliance?._id}
//                             height={50}
//                             // width={50}
//                             className="h-12 object-cover"
//                           />
//                         </div>
//                       </td>
//                       <td className="px-6 py-3 font-semibold text-gray-900 text-[var(--secondary-color)]">
//                         {appliance?.appliance?.applianceName ||
//                           appliance?.appliance?.deviceDetails?.deviceName ||
//                           "--"}
//                       </td>
//                       <td className="px-6 py-3 font-semibold text-gray-900 text-[var(--secondary-color)]">
//                         {appliance?.brand?.brandName || "--"}
//                       </td>
//                       <td className="px-6 py-3 font-semibold text-gray-900 text-[var(--secondary-color)]">
//                         {appliance?.model?.modelName || "--"}
//                       </td>
//                       <td className="px-6 py-3 font-semibold text-gray-900 text-[var(--secondary-color)]">
//                         {appliance?.model?.dateOfPurchase &&
//                         appliance?.model?.isWarrantyApproved === "approved"
//                           ? moment(appliance?.model?.dateOfPurchase).format(
//                               "DD-MMM-YYYY hh:mm A"
//                             )
//                           : "--"}
//                       </td>
//                       <td className="px-6 py-3 font-semibold text-gray-900 text-[var(--secondary-color)]">
//                         {appliance?.model?.extendUpto &&
//                         appliance?.model?.isWarrantyApproved === "approved"
//                           ? moment(appliance?.model?.extendUpto).format(
//                               "DD-MMM-YYYY hh:mm A"
//                             )
//                           : "--"}
//                       </td>
//                       <td className="px-6 py-3 font-semibold text-gray-900 text-[var(--secondary-color)]">
//                         {moment(appliance?.createdAt).format(
//                           "DD-MMM-YYYY hh:mm A"
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         <MuiDrawer
//           open={createApplianceModal}
//           onClose={() => setCreateApplianceModal(false)}
//           drawerWidth="400px"
//         >
//           <div className="p-4 bg-[var(--secondary-light-2-color)] h-[var(--doc-height)]">
//             <div className="font-bold text-md flex items-center gap-2 text-[var(--primary-elite-color)]">
//               <LuComputer size={24} /> Create Appliance
//             </div>
//             {mappedAppliance?.length > 0 && (
//               <div className="flex flex-col text-sm mt-8">
//                 <label className="font-bold">
//                   {applianceInput ? "Enter" : "Select"} Appliance
//                 </label>
//                 {applianceInput ? (
//                   <input
//                     value={applianceSelectedOption}
//                     placeholder="Enter a Appliance Name!"
//                     className="default-input"
//                     onChange={(e) =>
//                       setApplianceSelectedOption(e.target?.value)
//                     }
//                   />
//                 ) : (
//                   <Dropdown
//                     value={applianceSelectedOption}
//                     placeholder="Select a Appliance!"
//                     onSelect={handleApplianceSelect}
//                     options={mappedAppliance?.map(
//                       (e) => e?.appliances?.applianceName
//                     )}
//                     disabled={false}
//                     optionsObject={mappedAppliance?.map((e) => e?.appliances)}
//                   />
//                 )}
//               </div>
//             )}
//             {(brands?.length > 0 || brandInput) && (
//               <div className="flex flex-col text-sm mt-2">
//                 <label className="font-bold">
//                   {brandInput ? "Enter" : "Select"} Brand
//                 </label>
//                 {brandInput ? (
//                   <input
//                     value={brandSelectedOption}
//                     placeholder="Enter a Brand Name!"
//                     className="default-input"
//                     onChange={(e) => setBrandSelectedOption(e.target?.value)}
//                   />
//                 ) : (
//                   <Dropdown
//                     value={brandSelectedOption}
//                     placeholder="Select a Brand!"
//                     onSelect={handleBrandSelect}
//                     options={brands?.map((e) => e?.brandName)}
//                     disabled={false}
//                     optionsObject={brands}
//                   />
//                 )}
//               </div>
//             )}
//             {(models?.length > 0 || brandInput) && (
//               <div className="flex flex-col text-sm mt-2">
//                 <label className="font-bold">Enter Model</label>
//                 <input
//                   value={modelValue}
//                   placeholder="Enter a Model Name!"
//                   className="default-input"
//                   onChange={(e) => {
//                     setModelValue(e.target?.value);
//                   }}
//                 />
//               </div>
//             )}
//             <div className="flex flex-col text-sm mt-2">
//               <label className="font-bold mb-2">Appliance Image</label>
//               <input
//                 className="d-none"
//                 id="appliance-img"
//                 type="file"
//                 onChange={handleImageChange}
//               />
//               <img />
//               <label htmlFor="appliance-img">
//                 <div className="h-28 w-28 border border-[#c0c0c0] border-dashed cursor-pointer text-[#585858] flex items-center justify-center">
//                   {applianceImage.image ? (
//                     <img
//                       src={applianceImage.image}
//                       alt={applianceImage.fileName}
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <MdAddPhotoAlternate size={30} />
//                   )}
//                 </div>
//               </label>
//             </div>
//             <button
//               disabled={
//                 !applianceSelectedOption || !brandSelectedOption || !modelValue
//               }
//               className="mt-4 w-full bg-[#2b318c] h-10 text-[var(--primary-color)] rounded-md text-sm disabled:opacity-45"
//               onClick={() => handleCreateAppliance()}
//             >
//               Create Appliance
//             </button>
//           </div>
//         </MuiDrawer>
//       </AnimatedContent>
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
import {
  LuComputer,
  LuPackageOpen,
  LuSparkles,
  LuLayers,
} from "react-icons/lu";
import { MdAddPhotoAlternate } from "react-icons/md";
import { HiOutlineCube } from "react-icons/hi2";
import { TbBrandProducthunt } from "react-icons/tb";
import AnimatedContent from "@/components/common/AnimatedContent";
import MuiDrawer from "@/components/drawer/MuiDrawer";
import Dropdown from "@/components/common/DropDown";
import { notifyError } from "@/utils/toast";
import AdminServices from "@/services/AdminServices";
import BackdropProgressLoader from "@/components/common/BackdropProgressLoader";
import moment from "moment";
import { deviceImages } from "@/data/deviceImages";
import otherdevice from "../assets/img/gadgets/other-gadget.png";

export const getDeviceImage = (item) => {
  return (
    deviceImages?.find(
      (e) =>
        e?.deviceType?.toLowerCase() ===
          item?.appliance?.applianceName?.toLowerCase() &&
        (e.brandName[0] !== "other"
          ? e?.brandName?.includes(
              item?.brand?.brandName?.toLowerCase()
            )
          : true)
    )?.deviceImage || otherdevice
  );
};

const Appliance = () => {
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [appliance, setAppliance] = useState([]);
  const [mappedAppliance, setMappedAppliance] = useState([]);

  const history = useHistory();

  const [applianceInput, setApplianceInput] = useState(false);
  const [brandInput, setBrandInput] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const [createApplianceModal, setCreateApplianceModal] =
    useState(false);

  const [applianceId, setApplianceId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [loadingStatus, setLoadingStatus] = useState("");

  const [applianceSelectedOption, setApplianceSelectedOption] =
    useState("");

  const [brandSelectedOption, setBrandSelectedOption] =
    useState("");

  const [modelValue, setModelValue] = useState("");

  const [applianceImage, setApplianceImage] = useState({
    fileName: "",
    image: "",
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      setApplianceImage({
        fileName: `appliance-${new Date()
          .toISOString()
          .replace(/[:.]/g, "-")}`,
        image: reader.result,
      });
    };
  };

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
      (e) => e?.appliances?._id === _id
    );

    setBrands([
      ...(foundAppliance?.appliances?.brands || []),
      {
        _id: 1,
        brandName: "Other",
      },
    ]);
  };

  const handleBrandSelect = (e, _id) => {
    if (_id === 1) {
      setBrandInput(true);
      setBrandId("");
      return;
    }

    setBrandId(_id);
    setBrandSelectedOption(e);
    setBrandInput(false);

    const foundBrand = brands.find(
      (e) => e?._id === _id
    );

    setModels(foundBrand?.models || []);
  };

  const getMappedAppliance = () => {
    DashboardServices.getMappedAppliance()
      .then((res) => {
        if (!res) return;

        const decodedata = DecryptData(res);

        const formattedApplianceList =
          decodedata?.data?.mappedAppliances?.flatMap(
            (data) =>
              data?.appliances?.brands?.flatMap(
                (brandData) =>
                  brandData?.models?.map(
                    (modelData) => ({
                      appliance: {
                        applianceName:
                          data?.appliances
                            ?.applianceName,
                        applianceId:
                          data?.appliances?._id,
                      },

                      brand: {
                        brandName:
                          brandData?.brandName,
                        brandId:
                          brandData?._id,
                      },

                      model: {
                        modelName:
                          modelData?.modelName,
                        dateOfPurchase:
                          modelData?.dateOfPurchase,
                        extendUpto:
                          modelData?.extendUpto,
                        isWarrantyApproved:
                          modelData?.isWarrantyApproved,
                        warrantyDocuments:
                          modelData?.warrantyDocuments,
                        modelId:
                          modelData?._id,
                        attachment:
                          modelData?.attachment,
                      },

                      createdBy:
                        modelData?.createdBy,
                      createdAt:
                        modelData?.createdAt,
                      updatedBy:
                        modelData?.updatedBy,
                      updatedAt:
                        modelData?.updatedAt,
                    })
                  )
              )
          );

        const appliancesList =
          decodedata?.data?.mappedAppliances?.filter(
            (e) =>
              e?.appliances?.createdBy?.role ===
              "admin"
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

        setAppliance(
          formattedApplianceList || []
        );
      })
      .catch((err) => {
        const decryptedData = DecryptData(
          err?.response?.data
        );

        notifyError(
          decryptedData?.error?.message
        );
      });
  };

  const handleCreateAppliance = () => {
    setLoadingPercentage(1);

    AdminServices.createAppliance({
      applianceName: applianceSelectedOption,
      applianceId,
    }).then((applianceRes) => {
      if (!applianceRes) return;

      setLoadingStatus("Appliance created!");
      setApplianceId("");

      const applianceDecodedata =
        DecryptData(applianceRes);

      setLoadingPercentage(35);

      AdminServices.createBrand({
        brandName: brandSelectedOption,
        applianceId:
          applianceDecodedata?.data
            ?.commonAppliance?._id,
        brandId,
      }).then((brandRes) => {
        setLoadingPercentage(70);
        setLoadingStatus("Brand created!");
        setBrandId("");

        const brandDecodedata =
          DecryptData(brandRes);

        AdminServices.createModel({
          applianceId:
            applianceDecodedata?.data
              ?.commonAppliance?._id,

          brandId:
            brandDecodedata?.data
              ?.commonBrand?._id,

          modelName: modelValue,

          attachmentValue:
            applianceImage.image,

          fileName:
            applianceImage.fileName,
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

  useEffect(() => {
    getMappedAppliance();
  }, []);

  const totalAppliances = appliance?.length || 0;

  const totalBrands = useMemo(() => {
    return new Set(
      appliance
        ?.map(
          (item) => item?.brand?.brandName
        )
        ?.filter(Boolean)
    ).size;
  }, [appliance]);

  const totalModels = useMemo(() => {
    return new Set(
      appliance
        ?.map(
          (item) => item?.model?.modelName
        )
        ?.filter(Boolean)
    ).size;
  }, [appliance]);

  const approvedWarranty = useMemo(() => {
    return appliance?.filter(
      (item) =>
        item?.model?.isWarrantyApproved ===
        "approved"
    ).length;
  }, [appliance]);

  const openAppliance = (item) => {
    const encodedAppData = encode(item);

    history.push(
      `/appliance/overview?applianceId=${
        item?.appliance?.applianceId
      }&appData=${encodeURIComponent(
        encodedAppData
      )}`
    );
  };

  const getWarrantyStatus = (item) => {
    const status =
      item?.model?.isWarrantyApproved;

    if (status === "approved") {
      return {
        label: "Approved",
        icon: <FaCheckCircle size={9} />,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-600",
      };
    }

    if (status === "pending") {
      return {
        label: "Pending",
        icon: <FaRegClock size={9} />,
        className:
          "border-amber-200 bg-amber-50 text-amber-600",
      };
    }

    return {
      label: "Not Approved",
      icon: <FaShieldAlt size={9} />,
      className:
        "border-slate-200 bg-slate-50 text-slate-500",
    };
  };

  const stats = [
    {
      label: "Total Appliances",
      value: totalAppliances,
      icon: <LuPackageOpen size={19} />,
      number: "text-indigo-600",
      bg: "bg-indigo-50",
    },

    {
      label: "Total Brands",
      value: totalBrands,
      icon: <TbBrandProducthunt size={19} />,
      number: "text-cyan-600",
      bg: "bg-cyan-50",
    },

    {
      label: "Total Models",
      value: totalModels,
      icon: <HiOutlineCube size={19} />,
      number: "text-violet-600",
      bg: "bg-violet-50",
    },

    {
      label: "Warranty Approved",
      value: approvedWarranty,
      icon: <FaShieldAlt size={17} />,
      number: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <>
      <AnimatedContent>
        <div className="min-h-[var(--doc-height)] bg-[#f5f7ff] px-4 py-5 md:px-6 lg:px-8">

          {/* ================= HERO ================= */}

          <section className="relative overflow-hidden rounded-[32px] border border-indigo-100/80 bg-white shadow-[0_15px_50px_rgba(79,70,229,0.07)]">

            {/* Background decoration */}
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 left-[35%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "radial-gradient(#c7d2fe 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />

            <div className="relative z-10 flex flex-col justify-between gap-8 px-6 py-7 md:px-9 md:py-9 lg:flex-row lg:items-center">

              {/* Hero content */}

              <div className="max-w-2xl">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1.5">

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm">
                    <LuSparkles size={10} />
                  </span>

                  <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-indigo-600">
                    Appliance Management
                  </span>

                </div>

                <h1 className="max-w-[650px] text-[30px] font-black leading-[1.08] tracking-[-0.04em] text-slate-900 md:text-[42px]">

                  Everything you need to
                  <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                    manage your appliances.
                  </span>

                </h1>

                <p className="mt-4 max-w-[590px] text-sm leading-6 text-slate-500">
                  Keep appliances, brands, models and warranty
                  information organized in one beautifully designed
                  workspace.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">

                  <button
                    onClick={() =>
                      setCreateApplianceModal(true)
                    }
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-5 py-3 text-xs font-extrabold text-white shadow-[0_10px_25px_rgba(79,70,229,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(79,70,229,0.28)]"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/15">
                      <FaPlus
                        size={9}
                        className="transition-transform duration-300 group-hover:rotate-90"
                      />
                    </span>

                    Create Appliance
                  </button>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                      <FaBoxOpen size={12} />
                    </div>

                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        Collection
                      </p>

                      <p className="text-xs font-black text-slate-700">
                        {totalAppliances} Appliances
                      </p>
                    </div>

                  </div>

                </div>
              </div>

              {/* ================= HERO VISUAL ================= */}

              <div className="relative mx-auto h-52 w-72 shrink-0 lg:mx-0">

                <div className="absolute right-3 top-2 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

                <div className="absolute bottom-0 left-2 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />

                <div className="absolute right-7 top-4 h-40 w-40 rounded-full border border-indigo-100" />

                <div className="absolute right-14 top-11 h-28 w-28 rounded-full border border-cyan-100" />

                {/* Main appliance */}

                <div className="absolute right-10 top-7 flex h-32 w-32 rotate-3 items-center justify-center rounded-[34px] border border-white bg-white/90 shadow-[0_25px_55px_rgba(79,70,229,0.16)] backdrop-blur-xl transition-all duration-500 hover:rotate-0 hover:scale-105">

                  <div className="absolute inset-3 rounded-[27px] bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />

                  <div className="relative flex h-[78px] w-[78px] items-center justify-center rounded-[24px] bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_14px_30px_rgba(79,70,229,0.3)]">
                    <LuComputer
                      size={38}
                      strokeWidth={1.5}
                    />
                  </div>

                </div>

                {/* Active */}

                <div className="absolute right-0 top-2 flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-1.5 shadow-lg">

                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                  <span className="text-[8px] font-black tracking-[0.12em] text-emerald-600">
                    ACTIVE
                  </span>

                </div>

                {/* Bottom card */}

                <div className="absolute bottom-2 left-0 flex items-center gap-2.5 rounded-2xl border border-white bg-white/95 px-3 py-2.5 shadow-[0_14px_35px_rgba(15,23,42,0.1)]">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50 text-indigo-600">
                    <FaBoxOpen size={14} />
                  </div>

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                      Managed Items
                    </p>

                    <p className="text-sm font-black text-slate-800">
                      {totalAppliances}
                    </p>
                  </div>

                </div>

                {/* Floating icon */}

                <div className="absolute bottom-12 right-1 flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-100 bg-white text-cyan-500 shadow-md">
                  <LuLayers size={15} />
                </div>

              </div>
            </div>
          </section>

          {/* ================= STATS ================= */}

          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_7px_25px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-100 hover:shadow-[0_18px_40px_rgba(79,70,229,0.09)]"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                      {stat.label}
                    </p>

                    <p
                      className={`mt-2 text-[30px] font-black tracking-tight ${stat.number}`}
                    >
                      {stat.value}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                      <span className="text-[9px] font-medium text-slate-400">
                        Updated automatically
                      </span>
                    </div>

                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[17px] ${stat.bg} ${stat.number} transition-all duration-300 group-hover:scale-110`}
                  >
                    {stat.icon}
                  </div>

                </div>

                <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className={`h-full w-[68%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 group-hover:w-[90%]`}
                  />

                </div>

              </div>
            ))}
          </section>

          {/* ================= COLLECTION HEADER ================= */}

          <section className="mt-9 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.2)]">
                <LuPackageOpen size={19} />
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-800">
                  Appliance Collection
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Manage and monitor your registered appliances
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3.5 py-2 shadow-sm md:self-auto">

              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500">
                {totalAppliances} Records
              </span>

            </div>

          </section>

          {/* ================= TABLE ================= */}

          <section className="mt-4 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.045)]">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1120px]">

                <thead>
                  <tr className="border-b border-slate-100 bg-[#fafbff]">

                    {[
                      "Appliance",
                      "Created By",
                      "Brand",
                      "Model",
                      "Warranty",
                      "Purchase",
                      "Expiry",
                      "Created",
                    ].map((heading, index) => (
                      <th
                        key={heading}
                        className={`px-5 py-4 text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400 ${
                          index === 7
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {heading}
                      </th>
                    ))}

                  </tr>
                </thead>

                <tbody>

                  {appliance?.map((item, index) => {

                    const warranty =
                      getWarrantyStatus(item);

                    return (
                      <tr
                        key={item?._id || index}
                        onClick={() =>
                          openAppliance(item)
                        }
                        className="group cursor-pointer border-b border-slate-100 last:border-b-0 transition-all duration-200 hover:bg-indigo-50/30"
                      >

                        {/* Appliance */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[17px] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50">

                              <img
                                src={
                                  item?.model
                                    ?.attachment ||
                                  getDeviceImage(item)
                                }
                                alt={
                                  item?.model
                                    ?.modelName ||
                                  "Appliance"
                                }
                                className="h-11 w-11 object-contain transition-transform duration-500 group-hover:scale-110"
                              />

                              <div className="absolute bottom-1 right-1 h-2 w-2 rounded-full border border-white bg-emerald-400" />

                            </div>

                            <div className="min-w-0">

                              <p className="max-w-[180px] truncate text-xs font-extrabold text-slate-800">
                                {item?.appliance
                                  ?.applianceName ||
                                  item?.appliance
                                    ?.deviceDetails
                                    ?.deviceName ||
                                  "--"}
                              </p>

                              <div className="mt-1 flex items-center gap-1.5">

                                <FaBoxOpen
                                  size={8}
                                  className="text-indigo-400"
                                />

                                <span className="text-[9px] text-slate-400">
                                  Appliance
                                </span>

                              </div>

                            </div>

                          </div>

                        </td>

                        {/* Created By */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-black text-white shadow-sm">
                              {item?.createdBy
                                ?.userName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}
                            </div>

                            <div>

                              <div className="flex items-center gap-2">

                                <span className="max-w-[105px] truncate text-xs font-bold text-slate-700">
                                  {item?.createdBy
                                    ?.userName ||
                                    "--"}
                                </span>

                                {item?.createdBy
                                  ?._id && (
                                  <div
                                    onClick={(e) =>
                                      e.stopPropagation()
                                    }
                                  >
                                    <Link
                                      to={`/user?userId=${item?.createdBy?._id}`}
                                      className="text-slate-300 transition hover:text-indigo-600"
                                    >
                                      <FaExternalLinkAlt
                                        size={8}
                                      />
                                    </Link>
                                  </div>
                                )}

                              </div>

                              <span className="text-[9px] text-slate-400">
                                Owner
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* Brand */}

                        <td className="px-5 py-4">

                          <span className="inline-flex items-center rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-extrabold text-indigo-600">
                            {item?.brand
                              ?.brandName || "--"}
                          </span>

                        </td>

                        {/* Model */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                              <HiOutlineCube
                                size={13}
                              />
                            </div>

                            <span className="text-xs font-bold text-slate-700">
                              {item?.model
                                ?.modelName ||
                                "--"}
                            </span>

                          </div>

                        </td>

                        {/* Warranty */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-extrabold ${warranty.className}`}
                          >
                            {warranty.icon}
                            {warranty.label}
                          </span>

                        </td>

                        {/* Purchase */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-300">
                              <FaCalendarAlt
                                size={9}
                              />
                            </div>

                            <span className="text-[10px] font-semibold text-slate-500">
                              {item?.model
                                ?.dateOfPurchase &&
                              item?.model
                                ?.isWarrantyApproved ===
                                "approved"
                                ? moment(
                                    item.model
                                      .dateOfPurchase
                                  ).format(
                                    "DD MMM YYYY"
                                  )
                                : "--"}
                            </span>

                          </div>

                        </td>

                        {/* Expiry */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-300">
                              <FaRegClock
                                size={9}
                              />
                            </div>

                            <span className="text-[10px] font-semibold text-slate-500">
                              {item?.model
                                ?.extendUpto &&
                              item?.model
                                ?.isWarrantyApproved ===
                                "approved"
                                ? moment(
                                    item.model
                                      .extendUpto
                                  ).format(
                                    "DD MMM YYYY"
                                  )
                                : "--"}
                            </span>

                          </div>

                        </td>

                        {/* Created */}

                        <td className="px-5 py-4">

                          <div className="flex items-center justify-end gap-3">

                            <span className="text-[10px] font-semibold text-slate-400">
                              {item?.createdAt
                                ? moment(
                                    item.createdAt
                                  ).format(
                                    "DD MMM YYYY"
                                  )
                                : "--"}
                            </span>

                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                              <FaChevronRight
                                size={9}
                              />
                            </div>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>

            {/* Empty state */}

            {appliance?.length === 0 && (
              <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">

                <div className="relative">

                  <div className="absolute inset-0 rounded-full bg-indigo-300/20 blur-2xl" />

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] border border-indigo-100 bg-gradient-to-br from-indigo-50 to-cyan-50 text-indigo-500">
                    <LuPackageOpen
                      size={40}
                    />
                  </div>

                </div>

                <h3 className="mt-6 text-lg font-black text-slate-800">
                  No appliances yet
                </h3>

                <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">
                  Start building your appliance
                  collection by adding your first
                  appliance.
                </p>

                <button
                  onClick={() =>
                    setCreateApplianceModal(true)
                  }
                  className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <FaPlus size={9} />
                  Add Appliance
                </button>

              </div>
            )}

          </section>
        </div>

        {/* ================= DRAWER ================= */}

        <MuiDrawer
          open={createApplianceModal}
          onClose={() =>
            setCreateApplianceModal(false)
          }
          drawerWidth="420px"
        >

          <div className="flex h-[var(--doc-height)] flex-col bg-[#f7f8fd]">

            {/* Drawer Header */}

            <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#172554] to-[#312e81] px-5 py-6">

              <div className="absolute -right-20 -top-24 h-52 w-52 rounded-full bg-cyan-400/15 blur-3xl" />

              <div className="absolute bottom-[-70px] left-[35%] h-36 w-36 rounded-full bg-violet-500/20 blur-3xl" />

              <div className="relative z-10 flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/10 text-cyan-300 shadow-inner backdrop-blur-md">
                    <LuComputer size={21} />
                  </div>

                  <div>

                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-indigo-200">
                      New Entry
                    </p>

                    <h2 className="mt-1 text-lg font-black text-white">
                      Create Appliance
                    </h2>

                  </div>

                </div>

                <button
                  onClick={() =>
                    setCreateApplianceModal(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-lg text-slate-300 transition hover:bg-white/20 hover:text-white"
                >
                  ×
                </button>

              </div>

              <p className="relative z-10 mt-4 max-w-[300px] text-[10px] leading-5 text-slate-300">
                Add appliance details to keep your
                collection organized.
              </p>

            </div>

            {/* Drawer Body */}

            <div className="flex-1 overflow-y-auto px-5 py-6">

              <div className="space-y-5">

                {/* Appliance */}

                {mappedAppliance?.length > 0 && (
                  <div>

                    <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                      Appliance
                    </label>

                    {applianceInput ? (
                      <input
                        value={
                          applianceSelectedOption
                        }
                        placeholder="Enter appliance name"
                        className="default-input w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        onChange={(e) =>
                          setApplianceSelectedOption(
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <Dropdown
                        value={
                          applianceSelectedOption
                        }
                        placeholder="Select an appliance"
                        onSelect={
                          handleApplianceSelect
                        }
                        options={mappedAppliance.map(
                          (e) =>
                            e?.appliances
                              ?.applianceName
                        )}
                        disabled={false}
                        optionsObject={mappedAppliance.map(
                          (e) => e?.appliances
                        )}
                      />
                    )}

                  </div>
                )}

                {/* Brand */}

                {(brands?.length > 0 ||
                  brandInput) && (
                  <div>

                    <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                      Brand
                    </label>

                    {brandInput ? (
                      <input
                        value={
                          brandSelectedOption
                        }
                        placeholder="Enter brand name"
                        className="default-input w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        onChange={(e) =>
                          setBrandSelectedOption(
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <Dropdown
                        value={
                          brandSelectedOption
                        }
                        placeholder="Select a brand"
                        onSelect={
                          handleBrandSelect
                        }
                        options={brands?.map(
                          (e) => e?.brandName
                        )}
                        disabled={false}
                        optionsObject={brands}
                      />
                    )}

                  </div>
                )}

                {/* Model */}

                {(models?.length > 0 ||
                  brandInput) && (
                  <div>

                    <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                      Model
                    </label>

                    <input
                      value={modelValue}
                      placeholder="Enter model name"
                      className="default-input w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      onChange={(e) =>
                        setModelValue(
                          e.target.value
                        )
                      }
                    />

                  </div>
                )}

                {/* Image */}

                <div>

                  <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
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

                    <div className="relative flex min-h-[190px] items-center justify-center overflow-hidden rounded-[20px] border-2 border-dashed border-slate-200 bg-white transition-all duration-300 group-hover:border-indigo-400 group-hover:bg-indigo-50/20">

                      {applianceImage.image ? (
                        <>
                          <img
                            src={
                              applianceImage.image
                            }
                            alt={
                              applianceImage.fileName
                            }
                            className="max-h-[185px] w-full object-contain p-5"
                          />

                          <div className="absolute bottom-3 rounded-full bg-slate-900/80 px-3 py-1.5 text-[9px] font-bold text-white opacity-0 transition group-hover:opacity-100">
                            Change image
                          </div>
                        </>
                      ) : (
                        <div className="text-center">

                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-indigo-50 to-cyan-50 text-indigo-500 transition-transform duration-300 group-hover:scale-105">
                            <MdAddPhotoAlternate
                              size={31}
                            />
                          </div>

                          <p className="mt-3 text-xs font-extrabold text-slate-600">
                            Upload appliance image
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
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

            <div className="border-t border-slate-200 bg-white px-5 py-4">

              <button
                disabled={
                  !applianceSelectedOption ||
                  !brandSelectedOption ||
                  !modelValue
                }
                onClick={
                  handleCreateAppliance
                }
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-extrabold text-white shadow-[0_10px_25px_rgba(79,70,229,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(79,70,229,0.3)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >

                <FaPlus
                  size={9}
                  className="transition-transform duration-300 group-hover:rotate-90"
                />

                Create Appliance

              </button>

              <p className="mt-2 text-center text-[9px] text-slate-400">
                All appliance information will be added
                to your collection.
              </p>

            </div>
          </div>
        </MuiDrawer>
      </AnimatedContent>

      <BackdropProgressLoader
        value={loadingPercentage}
        status={loadingStatus}
      />
    </>
  );
};

export default Appliance;
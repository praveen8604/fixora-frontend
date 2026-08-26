import ApplianceServices from "@/services/ApplianceServices";
import { getQueryParam } from "@/utils/getQueryParam";
import React, { useEffect, useState } from "react";
import TopLayout from "./layouts/TopLayout";
import { decode, DecryptData } from "@/utils/DecryptData";
import ContentLayout from "./layouts/ContentLayout";

const ApplianceManagement = () => {
  const applianceId = getQueryParam("applianceId");
  const encodedAppData = getQueryParam("appData");
  const appData = decode(encodedAppData);
  console.log("appData: ", encodedAppData, appData);

  const [applianceData, setApplianceData] = useState({});
  useEffect(() => {
    ApplianceServices.getAppliance(applianceId)
      .then((res) => {
        if (res) {
          const decodedData = DecryptData(res);
          setApplianceData(decodedData?.data?.appliance);
        }
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }, [applianceId]);
  return (
    <div className="min-h-screen bg-[#F4F6F8] px-1 py-4 pb-10">
      <TopLayout applianceData={applianceData} appData={appData} />
      <ContentLayout applianceData={applianceData} appData={appData} />
    </div>
  );
};

export default ApplianceManagement;

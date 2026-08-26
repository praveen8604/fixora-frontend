import React from "react";
import LayoutCard from "../../../components/common/LayoutCard";
import { statusTheme } from "@/utils/getStatusTheme";
import moment from "moment";
import { FaDownload } from "react-icons/fa6";

const ContentLayout = ({ applianceData, appData }) => {
  const getExpiryTime = (expiryDateString) => {
    const expiryDate = new Date(expiryDateString);
    const now = new Date();

    if (isNaN(expiryDate.getTime())) {
      return "Invalid date";
    }

    let diffMs = expiryDate - now;

    if (diffMs <= 0) {
      return "Expired";
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    diffMs -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diffMs / (1000 * 60));

    return `${days} days ${hours} hrs ${minutes} mins`;
  };
  console.log("applianceData: ", appData);

  return (
    <div className="mt-4">
      <LayoutCard
        heading={"Device Details"}
        gridColCount={1}
        gridColCountxl={6}
        gridColCountmd={2}
      >
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Name</div>
          <div>{appData?.model?.modelName}</div>
        </div>
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Category</div>
          <div>{appData?.appliance?.applianceName}</div>
        </div>
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Purchase Date</div>
          <div>
            {appData?.model?.dateOfPurchase &&
            appData?.model?.isWarrantyApproved === "approved"
              ? moment(appData?.model?.dateOfPurchase).format("DD-MMM-YYYY")
              : "--"}
          </div>
        </div>
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Manufacturer</div>
          <div>{appData?.brand?.brandName}</div>
        </div>
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Location</div>
          <div>{applianceData?.deviceDetails?.location ?? "--"}</div>
        </div>
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Device Id</div>
          <div>{appData?.model?.modelId}</div>
        </div>
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Condition</div>
          <div
            className="capitalize p-2 py-1 w-fit rounded-full"
            style={
              applianceData?.deviceDetails?.condition &&
              statusTheme(applianceData?.deviceDetails?.condition)
            }
          >
            {applianceData?.deviceDetails?.condition ?? "--"}
          </div>
        </div>
      </LayoutCard>
      <LayoutCard
        heading={"Manufatured Details"}
        gridColCount={1}
        gridColCountxl={6}
        gridColCountmd={2}
      >
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Manufactured Date</div>
          <div>
            {applianceData?.deviceProductionDetails?.manufacturedDate
              ? moment(
                  applianceData?.deviceProductionDetails?.manufacturedDate
                ).format("DD-MMM-YYYY")
              : "--"}
          </div>
        </div>
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Purchased Date</div>
          <div>
            {appData?.model?.dateOfPurchase &&
            appData?.model?.isWarrantyApproved === "approved"
              ? moment(appData?.model?.dateOfPurchase).format("DD-MMM-YYYY")
              : "--"}
          </div>
        </div>
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Expiry Date</div>
          <div>
            {appData?.model?.extendUpto &&
            appData?.model?.isWarrantyApproved === "approved"
              ? moment(appData?.model?.extendUpto).format("DD-MMM-YYYY")
              : "--"}
          </div>
        </div>
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Till Expire</div>
          <div>
            {appData?.model?.extendUpto &&
            appData?.model?.isWarrantyApproved === "approved"
              ? getExpiryTime(appData?.model?.extendUpto)
              : "--"}
          </div>
        </div>
        <div className="text-xs font-bold text-[#20242B]">
          <div className="mb-1 text-[11px] uppercase tracking-[0.14em] text-[#9AA2AC]">Condition</div>
          <div
            className="capitalize p-2 py-1 w-fit rounded-full"
            style={
              applianceData?.deviceProductionDetails?.status &&
              statusTheme(applianceData?.deviceProductionDetails?.status)
            }
          >
            {applianceData?.deviceProductionDetails?.status ?? "--"}
          </div>
        </div>
      </LayoutCard>

      {appData?.model?.warrantyDocuments?.length > 0 && (
        <LayoutCard
          heading={"Device Documents"}
          gridColCount={1}
          gridColCountxl={6}
          gridColCountmd={2}
        >
          {appData?.model?.warrantyDocuments?.map((data) => {
            return (
              <div
                key={data?.file || data?.fileName}
                className="flex items-center gap-3 rounded-2xl border border-[#E4E8ED] bg-[#F8FAFD] px-4 py-3"
              >
                <div className="text-xs font-semibold text-[#20242B]">{data?.fileName}</div>
                <a
                  href={data?.file}
                  download={`${data?.fileName}.pdf`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8E4F5] bg-white text-[#2563EB] transition hover:border-[#2563EB] hover:bg-[#EFF6FF]">
                    <FaDownload size="16" />
                  </div>
                </a>
              </div>
            );
          })}
        </LayoutCard>
      )}
    </div>
  );
};

export default ContentLayout;

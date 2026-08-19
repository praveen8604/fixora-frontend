import React from "react";
import Skeleton from "react-loading-skeleton";

const Chart = ({ children, title, loading, mode }) => {
  return (
    <div className="kpi-shine-card">
      <div className="kpi-shine-inner min-w-0 px-6 py-6 h-full">
        <div className="mb-6">
          {loading ? (
            <Skeleton
              count={1}
              height={20}
              className="bg-gray-200"
              baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
              highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
            />
          ) : (
            <div>
              <p className="text-[13px] text-[#64748B] mb-1">Analytics</p>
              <h3 className="text-[17px] font-semibold tracking-tight text-[#1B2559]">
                {title}
              </h3>
            </div>
          )}
        </div>

        {loading ? (
          <Skeleton
            className=" bg-gray-200"
            baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
            highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
            count={10}
            height={18}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Chart;

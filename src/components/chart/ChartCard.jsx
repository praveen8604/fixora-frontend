import React from "react";
import Skeleton from "react-loading-skeleton";

const Chart = ({ children, title, loading, mode }) => {
  return (
    <div className="kpi-shine-card">
      <div className="kpi-shine-inner min-w-0 p-5 h-full">
        <div className="mb-5">
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
              <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#A3AED0] mb-1">
                Analytics
              </p>
              <h3 className="text-base font-semibold text-[#211e27]">{title}</h3>
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

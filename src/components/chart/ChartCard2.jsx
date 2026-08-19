import React from "react";
import Skeleton from "react-loading-skeleton";
import LineImg from "../../assets/img/icons/line-chart.gif";

const Chart = ({ children, title, loading, mode, data }) => {
  return (
    <div className="kpi-shine-card">
      <div className="kpi-shine-inner min-w-0 p-5 h-full flex flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          {loading ? (
            <Skeleton
              count={1}
              height={20}
              className="bg-gray-200"
              baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
              highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
            />
          ) : (
            <>
              <div>
                <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#A3AED0] mb-1">
                  Activity
                </p>
                <h3 className="text-base font-semibold text-[#211e27]">{title}</h3>
                <p className="mt-1 text-[11px] font-medium tracking-wide uppercase text-[#50589C]">
                  {Number(data || 0).toLocaleString()} total
                </p>
              </div>
              <img
                src={LineImg}
                alt=""
                className="h-8 w-8 object-contain shrink-0"
              />
            </>
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
          <div className="flex-1 min-h-0">{children}</div>
        )}
      </div>
    </div>
  );
};

export default Chart;

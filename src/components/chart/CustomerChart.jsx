import React from "react";

const CustomerChart = ({ legends = [] }) => {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-[#6B7280]">
      {legends.map((legend) => (
        <div
          className="flex items-center gap-2"
          key={legend.title}
        >
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: "#0a2540",
            }}
          />

          <span className="font-medium">
            {legend.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomerChart;

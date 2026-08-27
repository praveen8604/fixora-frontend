import React from "react";

const ChartLegend = ({ legends = [] }) => {
  const themeColors = [
    "#AD8B73",
    "#CEAB93",
    "#E3CAA5",
    "#AD8B73",
  ];

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-[#6F6258]">
      {legends.map((legend, index) => (
        <div
          className="flex items-center gap-2"
          key={legend.title}
        >
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor:
                themeColors[index % themeColors.length],
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

export default ChartLegend;
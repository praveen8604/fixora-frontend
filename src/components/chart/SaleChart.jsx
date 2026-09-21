import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useState } from "react";
import { Line } from "react-chartjs-2";

const SaleChart = ({ salesReport }) => {
  const { getNumberTwo } = useUtilsFunction();

  const [activeButton, setActiveButton] = useState("Sales");

  const handleClick = (title) => {
    setActiveButton(title);
  };

  const isSales = activeButton === "Sales";

  const chartColor = isSales ? "#0a2540" : "#2E8B68";

  const barOptions = {
    data: {
      labels: salesReport?.map((or) => or.date) || [],

      datasets: [
        {
          label: isSales ? "Sales" : "Orders",

          data: isSales
            ? salesReport?.map((or) => getNumberTwo(or.total)) || []
            : salesReport?.map((or) => or.order) || [],

          borderColor: chartColor,
          backgroundColor: chartColor,

          borderWidth: 3,

          tension: 0.35,

          pointRadius: 3,

          pointHoverRadius: 5,

          pointBackgroundColor: "#d1fae5",

          pointBorderColor: chartColor,

          pointBorderWidth: 2,

          fill: false,

          yAxisID: "y",
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          backgroundColor: "#0d3257",

          titleColor: "#d1fae5",

          bodyColor: "#FFFFFF",

          borderColor: "#2E8B68",

          borderWidth: 1,

          padding: 10,

          cornerRadius: 8,

          displayColors: false,
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },

          ticks: {
            color: "#8B7B6D",

            font: {
              size: 10,
              weight: "500",
            },
          },

          border: {
            display: false,
          },
        },

        y: {
          beginAtZero: true,

          grid: {
            color: "#EEE4D7",

            drawTicks: false,
          },

          ticks: {
            color: "#8B7B6D",

            padding: 8,

            font: {
              size: 10,
              weight: "500",
            },

            precision: 0,
          },

          border: {
            display: false,
          },
        },
      },
    },
  };

  return (
    <div className="w-full">
      {/* ================================
          CHART TABS
      ================================= */}

      <div className="mb-5 flex justify-center">
        <div
          className="
            inline-flex
            items-center
            gap-1
            rounded-xl
            border
            border-[#D5E8DD]
            bg-[#F3FAF6]
            p-1
          "
        >
          {/* SALES */}

          <button
            onClick={() => handleClick("Sales")}
            type="button"
            className={`
              rounded-lg
              px-5
              py-2
              text-xs
              font-semibold
              transition-all
              duration-200
              focus:outline-none
              ${
                isSales
                  ? "bg-[#0a2540] text-white shadow-sm"
                  : "text-[#6B7280] hover:bg-[#d1fae5]"
              }
            `}
          >
            Sales
          </button>

          {/* ORDERS */}

          <button
            onClick={() => handleClick("Orders")}
            type="button"
            className={`
              rounded-lg
              px-5
              py-2
              text-xs
              font-semibold
              transition-all
              duration-200
              focus:outline-none
              ${
                !isSales
                  ? "bg-[#2E8B68] text-white shadow-sm"
                  : "text-[#6B7280] hover:bg-[#d1fae5]"
              }
            `}
          >
            Orders
          </button>
        </div>
      </div>

      {/* ================================
          CHART
      ================================= */}

      <div className="h-[280px] w-full">
        <Line {...barOptions} />
      </div>
    </div>
  );
};

export default SaleChart;

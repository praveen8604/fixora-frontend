import { useMemo, useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

const PRIMARY = "#AD8B73";
const SECONDARY = "#CEAB93";
const SOFT = "#E3CAA5";
const CREAM = "#FFFBE9";

const LineChart = ({ salesReport }) => {
  const { t } = useTranslation();

  const [activeButton, setActiveButton] = useState("Orders");

  /* =========================================================
     CLEAN & SORT DATA
  ========================================================= */

  const sortedReport = useMemo(() => {
    if (!Array.isArray(salesReport)) return [];

    const uniqueDates = new Set();

    return salesReport
      .filter((item) => {
        if (!item?.date || uniqueDates.has(item.date)) {
          return false;
        }

        uniqueDates.add(item.date);
        return true;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [salesReport]);

  /* =========================================================
     TAB CONFIG
  ========================================================= */

  const tabs = [
    {
      title: "Orders",
      label: t("Pending"),
      key: "inprogress",
    },
    {
      title: "Sales",
      label: t("Completed"),
      key: "completed",
    },
    {
      title: "Cancelled",
      label: t("Cancelled"),
      key: "cancelled",
    },
  ];

  const activeTab =
    tabs.find((tab) => tab.title === activeButton) || tabs[0];

  /* =========================================================
     CHART DATA
  ========================================================= */

  const chartData = {
    labels: sortedReport.map((item) => item.date),

    datasets: [
      {
        label: activeTab.label,

        data: sortedReport.map(
          (item) => Number(item?.[activeTab.key]) || 0
        ),

        borderColor: PRIMARY,
        backgroundColor: PRIMARY,

        borderWidth: 3,

        tension: 0.42,

        pointRadius: 3,

        pointHoverRadius: 6,

        pointBorderWidth: 2,

        pointBackgroundColor: "#FFFFFF",

        pointBorderColor: PRIMARY,

        fill: false,
      },
    ],
  };

  /* =========================================================
     CHART OPTIONS
  ========================================================= */

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: "index",
    },

    animation: {
      duration: 500,
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#6D5A4D",

        titleColor: "#FFFBE9",

        bodyColor: "#FFFBE9",

        padding: 12,

        cornerRadius: 10,

        displayColors: false,

        titleFont: {
          size: 11,
          weight: "700",
        },

        bodyFont: {
          size: 12,
          weight: "600",
        },

        callbacks: {
          label: (context) => {
            return `${activeTab.label}: ${context.parsed.y}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#9B897B",

          font: {
            size: 10,
            weight: "500",
          },

          maxRotation: 0,

          autoSkip: true,

          maxTicksLimit: 7,
        },

        border: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        grace: "8%",

        grid: {
          color: "#EFE5DB",

          drawTicks: false,
        },

        ticks: {
          color: "#9B897B",

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
  };

  /* =========================================================
     HANDLER
  ========================================================= */

  const handleTabChange = (title) => {
    setActiveButton(title);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full">
      {/* CHART HEADER */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT */}

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B897B]">
            Service Requests
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: PRIMARY,
                boxShadow: `0 0 0 4px ${SOFT}55`,
              }}
            />

            <span className="text-sm font-bold text-[#463B34]">
              {activeTab.label}
            </span>
          </div>
        </div>

        {/* TABS */}

        <div
          className="
            inline-flex
            w-fit
            rounded-xl
            border
            border-[#E8DED3]
            bg-[#FFFBE9]
            p-1
          "
        >
          {tabs.map((tab) => {
            const active = activeButton === tab.title;

            return (
              <button
                key={tab.title}
                type="button"
                onClick={() => handleTabChange(tab.title)}
                className={`
                  relative
                  flex
                  min-w-[88px]
                  items-center
                  justify-center
                  gap-1.5
                  rounded-[9px]
                  px-3
                  py-2
                  text-[10px]
                  font-bold
                  transition-all
                  duration-200
                  focus:outline-none
                  sm:min-w-[96px]
                  ${
                    active
                      ? "bg-white text-[#5F4A3B] shadow-[0_2px_7px_rgba(90,65,45,0.10)]"
                      : "text-[#9B897B] hover:bg-white/80 hover:text-[#6D5544]"
                  }
                `}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: active ? PRIMARY : SOFT,

                    boxShadow: active
                      ? `0 0 0 3px ${SOFT}66`
                      : "none",
                  }}
                />

                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CHART */}

      {sortedReport.length > 0 ? (
        <div className="h-[290px] w-full">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <div
          className="
            flex
            h-[290px]
            w-full
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-[#E3CAA5]
            bg-[#FFFBE9]
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-[#E3CAA5]
              text-[#80634E]
            "
          >
            <span className="text-lg">—</span>
          </div>

          <p className="mt-3 text-xs font-bold text-[#6D5544]">
            No service data
          </p>

          <p className="mt-1 text-[10px] text-[#9B897B]">
            Service activity will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default LineChart;
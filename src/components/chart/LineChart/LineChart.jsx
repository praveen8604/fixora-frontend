import { useMemo, useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

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
      color: "#F59E0B",
      softColor: "#FFF7E6",
      key: "inprogress",
    },
    {
      title: "Sales",
      label: t("Completed"),
      color: "#10B981",
      softColor: "#ECFDF5",
      key: "completed",
    },
    {
      title: "Cancelled",
      label: t("Cancelled"),
      color: "#EF4444",
      softColor: "#FEF2F2",
      key: "cancelled",
    },
  ];

  const activeTab = tabs.find((tab) => tab.title === activeButton) || tabs[0];

  /* =========================================================
     CHART DATA
  ========================================================= */

  const chartData = {
    labels: sortedReport.map((item) => item.date),

    datasets: [
      {
        label: activeTab.label,

        data: sortedReport.map((item) => Number(item?.[activeTab.key]) || 0),

        borderColor: activeTab.color,
        backgroundColor: activeTab.color,

        borderWidth: 3,

        tension: 0.42,

        pointRadius: 3,

        pointHoverRadius: 6,

        pointBorderWidth: 2,

        pointBackgroundColor: "#FFFFFF",

        pointBorderColor: activeTab.color,

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
        backgroundColor: "#20242C",

        titleColor: "#FFFFFF",

        bodyColor: "#E7EAF0",

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
          color: "#929AA7",

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
          color: "#EEF1F5",

          drawTicks: false,
        },

        ticks: {
          color: "#929AA7",

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
      {/* =====================================================
          CHART HEADER
      ====================================================== */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT INFO */}

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A0A7B0]">
            Service Status
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: activeTab.color,
                boxShadow: `0 0 0 4px ${activeTab.color}18`,
              }}
            />

            <span className="text-sm font-bold text-[#282D35]">
              {activeTab.label}
            </span>
          </div>
        </div>

        {/* ===================================================
            SEGMENTED CONTROL
        ==================================================== */}

        <div
          className="
            inline-flex
            w-fit
            rounded-xl
            border
            border-[#E7EAF0]
            bg-[#F7F8FA]
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
                      ? "bg-white text-[#282D35] shadow-[0_2px_7px_rgba(30,40,55,0.08)]"
                      : "text-[#929AA7] hover:bg-white/70 hover:text-[#5F6877]"
                  }
                `}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: active ? tab.color : "#C8CDD5",

                    boxShadow: active ? `0 0 0 3px ${tab.color}18` : "none",
                  }}
                />

                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          CHART
      ====================================================== */}

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
            border-[#E5E8ED]
            bg-[#FAFBFC]
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
              bg-[#F1F3F6]
              text-[#9AA2AC]
            "
          >
            <span className="text-lg">—</span>
          </div>

          <p className="mt-3 text-xs font-bold text-[#6F7783]">
            No service data available
          </p>

          <p className="mt-1 text-[10px] text-[#A0A7B0]">
            Data will appear here when service activity is available
          </p>
        </div>
      )}
    </div>
  );
};

export default LineChart;

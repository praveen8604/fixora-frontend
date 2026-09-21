import { useMemo, useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

const LineChart = ({ salesReport }) => {
  const { t } = useTranslation();

  const [activeRange, setActiveRange] = useState("30");

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

  const filteredReport = useMemo(() => {
    if (activeRange === "all" || sortedReport.length === 0) {
      return sortedReport;
    }

    const days = Number(activeRange);
    const lastDate = new Date(sortedReport[sortedReport.length - 1].date);

    if (Number.isNaN(lastDate.getTime())) {
      return sortedReport;
    }

    const startDate = new Date(lastDate);
    startDate.setDate(startDate.getDate() - days + 1);

    return sortedReport.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= lastDate;
    });
  }, [activeRange, sortedReport]);

  const getValue = (item, keys) => {
    const value = keys.reduce((result, key) => result ?? item?.[key], null);
    return Number(value) || 0;
  };

  /* =========================================================
     CHART DATA
  ========================================================= */

  const chartData = {
    labels: filteredReport.map((item) => item.date),

    datasets: [
      {
        label: "Total Requests",
        data: filteredReport.map((item) =>
          getValue(item, ["total", "totalRequests", "all"]),
        ),
        borderColor: "#0a2540",
        backgroundColor: "rgba(23,107,79,0.10)",
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: "Completed",
        data: filteredReport.map((item) =>
          getValue(item, ["completed", "complete"]),
        ),
        borderColor: "#2E8B68",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: "Pending",
        data: filteredReport.map((item) =>
          getValue(item, ["pending", "received", "inprogress"]),
        ),
        borderColor: "#D39B35",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: "Cancelled",
        data: filteredReport.map((item) =>
          getValue(item, ["cancelled", "canceled"]),
        ),
        borderColor: "#C96262",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };

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
        display: true,
        position: "bottom",
        labels: {
          color: "#6B7280",
          usePointStyle: true,
          boxWidth: 8,
          font: { size: 10, weight: "600" },
        },
      },
      tooltip: {
        backgroundColor: "#0d3257",
        titleColor: "#d1fae5",
        bodyColor: "#FFFFFF",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 11, weight: "700" },
        bodyFont: { size: 12, weight: "600" },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6B7280",
          font: { size: 10, weight: "500" },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7,
        },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grace: "8%",
        grid: { color: "#d1fae5", drawTicks: false },
        ticks: {
          color: "#6B7280",
          padding: 8,
          font: { size: 10, weight: "500" },
          precision: 0,
        },
        border: { display: false },
      },
    },
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
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
            Service Requests
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-sm font-bold text-primary">
              Request activity
            </span>
          </div>
        </div>

        {/* RANGE FILTER */}

        <div
          className="
            inline-flex
            w-fit
            rounded-xl
            border
            border-[#E2E8F0]
            bg-background
            p-1
          "
        >
          {[{ value: "7", label: "Last 7 days" }, { value: "30", label: "Last 30 days" }, { value: "90", label: "Last 3 months" }, { value: "all", label: "All available" }].map((range) => {
            return (
              <button
                key={range.value}
                type="button"
                onClick={() => setActiveRange(range.value)}
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
                    activeRange === range.value
                      ? "bg-white text-primary shadow-[0_2px_8px_rgba(17,24,39,0.08)]"
                      : "text-secondary hover:bg-white hover:text-primary"
                  }
                `}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CHART */}

      {filteredReport.length > 0 ? (
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
            border-accent
            bg-background
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
              bg-accent
              text-primary
            "
          >
            <span className="text-lg">—</span>
          </div>

          <p className="mt-3 text-xs font-bold text-primary">
            No service data
          </p>

          <p className="mt-1 text-[10px] text-secondary">
            Service activity will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default LineChart;

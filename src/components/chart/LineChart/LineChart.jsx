import { useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

const LineChart = ({ salesReport }) => {
  const uniqueDates = new Set();
  const hasData = Boolean(salesReport?.length);

  const updatedSalesReport = hasData
    ? salesReport.filter((item) => {
        const isUnique = !uniqueDates.has(item.date);
        uniqueDates.add(item.date);
        return isUnique;
      })
    : [];

  const [activeButton, setActiveButton] = useState({
    title: "Orders",
    color: "emerald",
  });

  const handleClick = ({ title, color }) => {
    setActiveButton({ title, color });
  };

  const sortedReport = [...updatedSalesReport].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const emptySlots = Array(7).fill(null);
  const labels = hasData ? sortedReport.map((or) => or.date) : emptySlots.map(() => "");
  const values = hasData
    ? sortedReport.map((or) =>
        activeButton.title === "Orders"
          ? or.inprogress
          : activeButton.title === "Sales"
          ? or.completed
          : or.cancelled
      )
    : emptySlots;

  const dataset =
    activeButton.title === "Orders"
      ? {
          label: "Pending",
          borderColor: "#F97316",
          backgroundColor: "rgba(249, 115, 22, 0.12)",
        }
      : activeButton.title === "Sales"
      ? {
          label: "Completed",
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.12)",
        }
      : {
          label: "Cancelled",
          borderColor: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.12)",
        };

  const barOptions = {
    data: {
      labels,
      datasets: [
        {
          ...dataset,
          data: values,
          fill: true,
          borderWidth: 3,
          pointRadius: hasData ? 3 : 0,
          pointHoverRadius: 5,
          pointBackgroundColor: dataset.borderColor,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 1,
          tension: 0.35,
          yAxisID: "y",
          spanGaps: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: hasData },
      },
      scales: {
        x: {
          grid: { color: "#E2E8F0", drawBorder: false },
          ticks: { color: "#A3AED0", font: { size: 11 } },
          border: { color: "#E2E8F0" },
        },
        y: {
          beginAtZero: true,
          suggestedMax: hasData ? undefined : 10,
          grid: { color: "#E2E8F0", drawBorder: false },
          ticks: { color: "#A3AED0", font: { size: 11 }, precision: 0 },
          border: { display: false },
        },
      },
    },
  };

  const { t } = useTranslation();

  const tabs = [
    { title: "Orders", label: t("Pending") },
    { title: "Sales", label: t("Completed") },
    { title: "Cancelled", label: t("Cancelled") },
  ];

  return (
    <>
      <div className="inline-flex p-1 mb-5 rounded-md bg-[#F4F7FE] border border-[#E2E8F0]">
        {tabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => handleClick({ title: tab.title })}
            type="button"
            className={`px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase rounded transition-colors ${
              activeButton.title === tab.title
                ? "bg-[var(--primary-elite-color)] text-[var(--primary-color)]"
                : "text-[#50589C] hover:text-[#211e27]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="h-[260px]">
        <Line {...barOptions} />
      </div>
    </>
  );
};

export default LineChart;

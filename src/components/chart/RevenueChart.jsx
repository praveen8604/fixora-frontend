import { Pie } from "react-chartjs-2";

// internal import
import useAsync from "@/hooks/useAsync";
import OrderServices from "@/services/OrderServices";

const RevenueChart = () => {
  const { data } = useAsync(OrderServices.getBestSellerProductChart);

  const themeColors = [
    "#0a2540",
    "#2E8B68",
    "#8FC8AE",
    "#DDF2E7",
  ];

  const PieOption = {
    data: {
      datasets: [
        {
          data:
            data?.bestSellingProduct?.map(
              (selling) => selling.count
            ) || [],

          backgroundColor: themeColors,

          borderColor: "#FFFFFF",

          borderWidth: 2,

          label: "Revenue",
        },
      ],

      labels:
        data?.bestSellingProduct?.map(
          (selling) => selling._id
        ) || [],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      cutout: "72%",

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
        },
      },
    },
  };

  return (
    <div className="h-[260px] w-full">
      <Pie {...PieOption} className="chart" />
    </div>
  );
};

export default RevenueChart;

import { Pie } from "react-chartjs-2";

// internal import
import useAsync from "@/hooks/useAsync";
import OrderServices from "@/services/OrderServices";

const RevenueChart = () => {
  const { data } = useAsync(OrderServices.getBestSellerProductChart);

  const themeColors = [
    "#AD8B73",
    "#CEAB93",
    "#E3CAA5",
    "#FFFBE9",
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
          backgroundColor: "#6F6258",
          titleColor: "#FFFBE9",
          bodyColor: "#FFFFFF",
          borderColor: "#CEAB93",
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
import React from "react";
import { Card, CardBody } from "@windmill/react-ui";
import Skeleton from "react-loading-skeleton";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const CardItem = ({
  title,
  Icon,
  quantity,
  amount,
  className,
  loading,
  mode,
  pending,
  todayPending,
  olderPending,
}) => {
  const { getNumberTwo } = useUtilsFunction();
  const displayValue =
    quantity === null || quantity === undefined || isNaN(quantity)
      ? "0"
      : Number(quantity).toLocaleString();

  if (loading) {
    return (
      <Skeleton
        count={2}
        height={40}
        className="dark:bg-gray-800 bg-gray-200"
        baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
        highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
      />
    );
  }

  return (
    <div className="kpi-shine-card">
      <Card className="kpi-shine-inner flex h-full bg-white border-0 shadow-none">
        <CardBody className="flex items-center w-full py-4 px-4">
          <div
            className={`flex items-center justify-center rounded-md h-9 w-9 text-sm mr-3 shrink-0 ${className}`}
          >
            <Icon className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h6 className="text-[11px] mb-1.5 font-medium tracking-[0.12em] uppercase text-[#A3AED0]">
              <span>{title}</span>{" "}
              {amount ? (
                <span className="text-red-500 text-sm font-semibold">
                  ({getNumberTwo(amount)})
                </span>
              ) : null}
            </h6>
            {pending && (
              <div className="grid grid-cols-2 gap-4 w-full mb-1 text-sm font-medium text-gray-600">
                <div>
                  <span className="font-semibold">Today</span>{" "}
                  <span className="text-blue-600 text-sm font-semibold">
                    ({getNumberTwo(todayPending)})
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Older</span>{" "}
                  <span className="text-orange-400 text-sm font-semibold">
                    ({getNumberTwo(olderPending)})
                  </span>
                </div>
              </div>
            )}

            <p className="text-[22px] font-semibold leading-none tabular-nums text-[#211e27]">
              {displayValue}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CardItem;

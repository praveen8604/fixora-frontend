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
      <div className="rounded-2xl bg-white p-5">
        <Skeleton
          height={90}
          baseColor={mode === "dark" ? "#1f2937" : "#EEF1F5"}
          highlightColor={mode === "dark" ? "#374151" : "#FFFFFF"}
        />
      </div>
    );
  }

  return (
    <Card
      className="
        group
        relative
        flex
        h-full
        overflow-hidden
        rounded-2xl
        border
        border-[#E7EAF0]
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <CardBody className="flex w-full items-center p-6">
        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#F3F5F8]
            text-[var(--primary-color)]
            transition-all
            duration-300
            group-hover:scale-105
          "
        >
          <Icon className="text-xl" />
        </div>

        <div className="ml-4 min-w-0">
          <h6 className="mb-1 text-sm font-medium text-[#737C8C]">
            {title}

            {amount && (
              <span className="ml-1 text-red-500">
                ({getNumberTwo(amount)})
              </span>
            )}
          </h6>

          {pending && (
            <div className="mb-1 flex gap-4 text-xs font-medium text-[#737C8C]">
              <span>
                Today{" "}
                <span className="text-blue-600">
                  ({getNumberTwo(todayPending)})
                </span>
              </span>

              <span>
                Older{" "}
                <span className="text-orange-500">
                  ({getNumberTwo(olderPending)})
                </span>
              </span>
            </div>
          )}

          <p className="text-2xl font-bold leading-none text-[#252A34]">
            {quantity}
          </p>
        </div>

        <div className="absolute bottom-0 left-6 h-[3px] w-0 rounded-full bg-[var(--primary-color)] transition-all duration-300 group-hover:w-10" />
      </CardBody>
    </Card>
  );
};

export default CardItem;

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
    quantity === null ||
    quantity === undefined ||
    isNaN(quantity)
      ? "0"
      : Number(quantity).toLocaleString();

  if (loading) {
    return (
      <div
        className={`
          rounded-2xl
          border
          border-[#E3CAA5]
          bg-white
          p-5
          ${className || ""}
        `}
      >
        <Skeleton
          height={90}
          baseColor="#FFFBE9"
          highlightColor="#FFFFFF"
        />
      </div>
    );
  }

  return (
    <Card
      className={`
        group
        relative
        flex
        h-full
        overflow-hidden
        rounded-2xl
        border
        border-[#E3CAA5]
        bg-white
        shadow-[0_5px_18px_rgba(92,70,54,0.05)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#CEAB93]
        hover:shadow-[0_14px_30px_rgba(92,70,54,0.12)]
        ${className || ""}
      `}
    >
      <CardBody className="flex w-full items-center p-5">

        {/* ICON */}

        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#FFFBE9]
            text-[#AD8B73]
            ring-1
            ring-[#E3CAA5]
            transition-all
            duration-300
            group-hover:bg-[#AD8B73]
            group-hover:text-white
            group-hover:ring-[#AD8B73]
          "
        >
          {Icon && <Icon className="text-xl" />}
        </div>

        {/* CONTENT */}

        <div className="ml-4 min-w-0 flex-1">

          <div className="flex items-center justify-between gap-2">

            <h6
              className="
                mb-1
                truncate
                text-sm
                font-semibold
                text-[#6B503E]
              "
            >
              {title}

              {amount && (
                <span className="ml-1 font-medium text-[#AD8B73]">
                  ({getNumberTwo(amount)})
                </span>
              )}
            </h6>

          </div>

          {/* PENDING DETAILS */}

          {pending && (
            <div
              className="
                mb-1.5
                flex
                flex-wrap
                gap-x-4
                gap-y-1
                text-[11px]
                font-medium
                text-[#9A806B]
              "
            >
              <span>
                Today{" "}
                <span className="font-semibold text-[#AD8B73]">
                  ({getNumberTwo(todayPending)})
                </span>
              </span>

              <span>
                Older{" "}
                <span className="font-semibold text-[#CEAB93]">
                  ({getNumberTwo(olderPending)})
                </span>
              </span>
            </div>
          )}

          {/* VALUE */}

          <p
            className="
              text-[26px]
              font-extrabold
              leading-none
              tracking-[-0.04em]
              text-[#5C4636]
            "
          >
            {displayValue}
          </p>
        </div>

        {/* SMALL ARROW */}

        <div
          className="
            ml-2
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#FFFBE9]
            text-[#CEAB93]
            opacity-0
            transition-all
            duration-300
            group-hover:opacity-100
          "
        >
          <span className="text-sm">↗</span>
        </div>

        {/* BOTTOM ACCENT */}

        <div
          className="
            absolute
            bottom-0
            left-5
            right-5
            h-[2px]
            overflow-hidden
            rounded-full
            bg-[#FFFBE9]
          "
        >
          <div
            className="
              h-full
              w-0
              rounded-full
              bg-[#AD8B73]
              transition-all
              duration-300
              group-hover:w-full
            "
          />
        </div>

      </CardBody>
    </Card>
  );
};

export default CardItem;
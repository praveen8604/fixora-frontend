import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiActivity } from "react-icons/fi";

const CARD_COLOR = "#6C63FF";

const ChartCard = ({ children, title, loading, mode }) => {
  const skeletonBase = mode === "dark" ? "#1f2937" : "#F2F4F7";
  const skeletonHighlight = mode === "dark" ? "#374151" : "#FFFFFF";

  return (
    <div
      className="
        relative
        isolate
        min-w-0
        w-full
        overflow-hidden
        rounded-[24px]
        border
        border-[#E5E8ED]
        bg-white
        p-5
        shadow-[0_4px_18px_rgba(30,40,55,0.04)]
      "
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          z-0
          h-36
          w-36
          rounded-full
          opacity-[0.06]
        "
        style={{ backgroundColor: CARD_COLOR }}
      />

      {/* Header */}
      <div
        className="
          relative
          z-[20]
          mb-5
          flex
          min-h-[44px]
          w-full
          items-center
          justify-between
          gap-4
        "
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <Skeleton
              width={42}
              height={42}
              borderRadius={14}
              baseColor={skeletonBase}
              highlightColor={skeletonHighlight}
            />

            <div>
              <Skeleton
                width={145}
                height={16}
                baseColor={skeletonBase}
                highlightColor={skeletonHighlight}
              />

              <div className="mt-1">
                <Skeleton
                  width={95}
                  height={10}
                  baseColor={skeletonBase}
                  highlightColor={skeletonHighlight}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* LEFT HEADER */}
            <div className="relative z-[30] flex min-w-0 items-center gap-3">
              {/* ICON */}
              <div
                className="
                  relative
                  z-[40]
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-[14px]
                  text-white
                  shadow-[0_8px_18px_rgba(0,0,0,0.10)]
                "
                style={{
                  backgroundColor: CARD_COLOR,
                  color: "#ffffff",
                }}
              >
                <FiActivity
                  size={20}
                  strokeWidth={2.5}
                  style={{
                    color: "#ffffff",
                    stroke: "#ffffff",
                    display: "block",
                  }}
                />
              </div>

              {/* TITLE */}
              <div className="relative z-[30] min-w-0">
                <h3 className="truncate text-[15px] font-extrabold tracking-[-0.01em] text-[#282D35]">
                  {title}
                </h3>

                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A0A7B0]">
                  Service performance
                </p>
              </div>
            </div>

            {/* VIEW ALL */}
            <div className="relative z-[100] shrink-0">
              <Link
                to="/services/servicerequests"
                onClick={(e) => e.stopPropagation()}
                className="
                  inline-flex
                  min-h-[34px]
                  items-center
                  justify-center
                  gap-1
                  whitespace-nowrap
                  rounded-full
                  border
                  bg-white
                  px-4
                  py-1.5
                  text-[11px]
                  font-bold
                  no-underline
                  shadow-[0_2px_8px_rgba(30,40,55,0.05)]
                  transition-colors
                  duration-200
                  focus:outline-none
                "
                style={{
                  color: CARD_COLOR,
                  borderColor: CARD_COLOR,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F4F2FF";
                  e.currentTarget.style.color = CARD_COLOR;
                  e.currentTarget.style.borderColor = CARD_COLOR;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = CARD_COLOR;
                  e.currentTarget.style.borderColor = CARD_COLOR;
                }}
              >
                <span>View All</span>

                <FiArrowUpRight
                  size={14}
                  strokeWidth={2.5}
                  style={{
                    color: "inherit",
                    stroke: "currentColor",
                  }}
                />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="relative z-[20] mb-4 h-px w-full bg-[#EEF0F3]" />

      {/* Chart */}
      <div className="relative z-[20] min-h-[300px] w-full">
        {loading ? (
          <div className="space-y-4 py-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                height={18}
                borderRadius={8}
                baseColor={skeletonBase}
                highlightColor={skeletonHighlight}
              />
            ))}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard;

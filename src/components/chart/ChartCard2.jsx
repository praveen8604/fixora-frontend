import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiList } from "react-icons/fi";

const CARD_COLOR = "#6C63FF";

const ChartCard2 = ({ children, title, loading, mode, data }) => {
  const skeletonBase = mode === "dark" ? "#1f2937" : "#F2F4F7";
  const skeletonHighlight = mode === "dark" ? "#374151" : "#FFFFFF";

  const totalRequests = Array.isArray(data) ? data.length : 0;

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
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-14
          -top-14
          z-0
          h-32
          w-32
          rounded-full
          opacity-[0.06]
        "
        style={{ backgroundColor: CARD_COLOR }}
      />

      {/* Header */}
      <div
        className="
          relative
          z-[50]
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
                width={150}
                height={16}
                baseColor={skeletonBase}
                highlightColor={skeletonHighlight}
              />

              <div className="mt-1">
                <Skeleton
                  width={100}
                  height={10}
                  baseColor={skeletonBase}
                  highlightColor={skeletonHighlight}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* LEFT */}
            <div className="relative z-[60] flex min-w-0 items-center gap-3">
              {/* SERVICE PERFORMANCE ICON */}
              <div
                className="
                  relative
                  z-[70]
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-[14px]
                  shadow-[0_8px_18px_rgba(0,0,0,0.10)]
                "
                style={{
                  backgroundColor: CARD_COLOR,
                }}
              >
                <FiList
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
              <div className="relative z-[60] min-w-0">
                <h3 className="truncate text-[15px] font-extrabold tracking-[-0.01em] text-[#282D35]">
                  {title}
                </h3>

                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#A0A7B0]">
                  Service Performance
                </p>
              </div>
            </div>

            {/* VIEW ALL */}
            <div className="relative z-[200] shrink-0">
              <Link
                to="/services/servicerequests"
                onClick={(e) => e.stopPropagation()}
                className="
                  inline-flex
                  min-h-[34px]
                  items-center
                  justify-center
                  gap-1.5
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

      {/* Stats */}
      {!loading && (
        <div
          className="
            relative
            z-[20]
            mb-4
            flex
            items-center
            justify-between
            rounded-[14px]
            border
            border-[#EEF0F3]
            bg-[#F8F9FB]
            px-4
            py-3
          "
        >
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9AA2AC]">
              Total Requests
            </p>

            <p className="mt-0.5 text-lg font-extrabold leading-none text-[#282D35]">
              {totalRequests}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: CARD_COLOR }}
            />

            <span className="text-[10px] font-bold text-[#7F8792]">
              Live activity
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="relative z-[20] mb-4 h-px w-full bg-[#EEF0F3]" />

      {/* Content */}
      <div className="relative z-[20] min-h-[300px] w-full overflow-hidden">
        {loading ? (
          <div className="space-y-4 py-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton
                  width={42}
                  height={42}
                  borderRadius={12}
                  baseColor={skeletonBase}
                  highlightColor={skeletonHighlight}
                />

                <div className="flex-1">
                  <Skeleton
                    width="70%"
                    height={14}
                    baseColor={skeletonBase}
                    highlightColor={skeletonHighlight}
                  />

                  <div className="mt-2">
                    <Skeleton
                      width="45%"
                      height={10}
                      baseColor={skeletonBase}
                      highlightColor={skeletonHighlight}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard2;

import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiList,
  FiActivity,
  FiClock,
} from "react-icons/fi";

const PRIMARY = "#AD8B73";
const SECONDARY = "#CEAB93";
const SOFT = "#E3CAA5";
const CREAM = "#FFFBE9";

const ChartCard2 = ({ children, title, loading, mode, data }) => {
  const skeletonBase = mode === "dark" ? "#E3CAA5" : "#F1E7DC";
  const skeletonHighlight = mode === "dark" ? "#FFFBE9" : "#FFFFFF";

  const totalRequests = Array.isArray(data) ? data.length : 0;

  return (
    <div
      className="
        group
        relative
        isolate
        min-w-0
        w-full
        overflow-hidden
        rounded-[24px]
        border
        border-[#E8DED3]
        bg-white
        p-5
        shadow-[0_6px_24px_rgba(90,65,45,0.05)]
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:border-[#CEAB93]
        hover:shadow-[0_18px_40px_rgba(90,65,45,0.10)]
      "
    >
      {/* BACKGROUND DECORATION */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-44
          w-44
          rounded-full
          opacity-30
          transition-transform
          duration-700
          group-hover:scale-125
        "
        style={{
          backgroundColor: CREAM,
        }}
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[-65px]
          left-[30%]
          h-32
          w-32
          rounded-full
          opacity-20
        "
        style={{
          backgroundColor: SOFT,
        }}
      />

      {/* HEADER */}

      <div
        className="
          relative
          z-[50]
          mb-5
          flex
          min-h-[48px]
          w-full
          items-center
          justify-between
          gap-4
        "
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <Skeleton
              width={44}
              height={44}
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
              <div
                className="
                  relative
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[14px]
                  text-white
                  shadow-[0_8px_18px_rgba(173,139,115,0.25)]
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
                style={{
                  backgroundColor: PRIMARY,
                }}
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-3
                    -top-3
                    h-8
                    w-8
                    rounded-full
                    bg-white/15
                  "
                />

                <FiList
                  size={20}
                  strokeWidth={2.3}
                  className="relative z-10"
                />
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-[15px]
                    font-extrabold
                    tracking-[-0.02em]
                    text-[#463B34]
                  "
                >
                  {title}
                </h3>

                <p className="mt-1 text-[10px] font-medium text-[#9B897B]">
                  Latest requests
                </p>
              </div>
            </div>

            {/* VIEW ALL */}

            <div className="relative z-[200] shrink-0">
              <Link
                to="/services/servicerequests"
                onClick={(e) => e.stopPropagation()}
                className="
                  group/button
                  inline-flex
                  min-h-[34px]
                  items-center
                  justify-center
                  gap-1.5
                  whitespace-nowrap
                  rounded-full
                  border
                  border-[#E3CAA5]
                  bg-[#FFFBE9]
                  px-3.5
                  py-1.5
                  text-[10px]
                  font-bold
                  no-underline
                  text-[#8F6D55]
                  transition-all
                  duration-200
                  hover:border-[#CEAB93]
                  hover:bg-[#E3CAA5]
                  hover:text-[#5F4A3B]
                  focus:outline-none
                "
              >
                <span>View All</span>

                <FiArrowUpRight
                  size={13}
                  strokeWidth={2.5}
                  className="
                    transition-transform
                    duration-200
                    group-hover/button:translate-x-0.5
                    group-hover/button:-translate-y-0.5
                  "
                />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* REQUEST SUMMARY */}

      {!loading && (
        <div
          className="
            relative
            z-[30]
            mb-4
            overflow-hidden
            rounded-[16px]
            border
            border-[#EFE5DB]
            bg-[#FFFBE9]
          "
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-[10px]
                  bg-white
                  text-[#AD8B73]
                  shadow-sm
                "
              >
                <FiList size={14} />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#9B897B]">
                  Total Requests
                </p>

                <p className="mt-0.5 text-[19px] font-extrabold leading-none tracking-[-0.03em] text-[#463B34]">
                  {totalRequests}
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                bg-white
                px-2.5
                py-1.5
                shadow-sm
              "
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: PRIMARY,
                }}
              />

              <span className="text-[9px] font-semibold text-[#806F62]">
                Recent
              </span>
            </div>
          </div>

          {/* Accent */}

          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(
                90deg,
                transparent 0%,
                ${SECONDARY} 50%,
                transparent 100%
              )`,
              opacity: 0.7,
            }}
          />
        </div>
      )}

      {/* DIVIDER */}

      <div className="relative z-[20] mb-3 h-px w-full bg-[#EFE9E3]" />

      {/* CONTENT */}

      <div className="relative z-[20] min-h-[300px] w-full overflow-hidden">
        {loading ? (
          <div className="space-y-4 py-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-[14px]
                  px-2
                  py-1
                "
              >
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

                <Skeleton
                  width={45}
                  height={18}
                  borderRadius={20}
                  baseColor={skeletonBase}
                  highlightColor={skeletonHighlight}
                />
              </div>
            ))}
          </div>
        ) : (
          children
        )}
      </div>

      {/* FOOTER */}

      {!loading && (
        <div className="relative z-[20] mt-3 flex items-center gap-2 border-t border-[#F0EAE4] pt-3">
          <FiClock size={11} className="text-[#AD8B73]" />

          <span className="text-[9px] font-medium text-[#9B897B]">
            Recent service requests
          </span>

          <FiActivity
            size={11}
            className="ml-auto"
            style={{
              color: SECONDARY,
            }}
          />
        </div>
      )}

      {/* BOTTOM ACCENT */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-6
          right-6
          h-[3px]
          origin-left
          scale-x-0
          rounded-full
          transition-transform
          duration-500
          group-hover:scale-x-100
        "
        style={{
          background: `linear-gradient(90deg, ${PRIMARY} 0%, ${SECONDARY} 100%)`,
        }}
      />
    </div>
  );
};

export default ChartCard2;
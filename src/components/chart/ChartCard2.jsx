import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiList,
  FiActivity,
  FiClock,
} from "react-icons/fi";

const CARD_COLOR = "#6C63FF";

const ChartCard2 = ({ children, title, loading, mode, data }) => {
  const skeletonBase = mode === "dark" ? "#1f2937" : "#EEF0F5";
  const skeletonHighlight = mode === "dark" ? "#374151" : "#FFFFFF";

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
        rounded-[26px]
        border
        border-[#E7E9EF]
        bg-white
        p-5
        shadow-[0_8px_30px_rgba(30,35,55,0.045)]
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:border-indigo-100
        hover:shadow-[0_20px_45px_rgba(79,70,229,0.09)]
      "
    >
      {/* =====================================================
          DECORATION
      ====================================================== */}

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
          opacity-[0.055]
          transition-transform
          duration-700
          group-hover:scale-125
        "
        style={{
          backgroundColor: CARD_COLOR,
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
          bg-violet-50
          opacity-70
        "
      />

      {/* =====================================================
          HEADER
      ====================================================== */}

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
              {/* ICON */}

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
                  rounded-[15px]
                  text-white
                  shadow-[0_10px_22px_rgba(108,99,255,0.22)]
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
                style={{
                  background:
                    "linear-gradient(135deg, #6C63FF 0%, #7C5CFC 100%)",
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
                    bg-white/[0.15]
                  "
                />

                <FiList
                  size={20}
                  strokeWidth={2.4}
                  className="relative z-10"
                />
              </div>

              {/* TITLE */}

              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-[15px]
                    font-extrabold
                    tracking-[-0.02em]
                    text-[#202437]
                  "
                >
                  {title}
                </h3>

                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: CARD_COLOR }}
                  />

                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#9AA1B0]">
                    Recent activity
                  </p>
                </div>
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
                  border-indigo-100
                  bg-indigo-50/70
                  px-3.5
                  py-1.5
                  text-[10px]
                  font-extrabold
                  tracking-wide
                  no-underline
                  text-indigo-600
                  transition-all
                  duration-200
                  hover:border-indigo-200
                  hover:bg-indigo-100
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

      {/* =====================================================
          REQUEST SUMMARY
      ====================================================== */}

      {!loading && (
        <div
          className="
            relative
            z-[30]
            mb-4
            overflow-hidden
            rounded-[16px]
            border
            border-[#ECEEF3]
            bg-[#F9FAFC]
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
                  text-indigo-500
                  shadow-sm
                "
              >
                <FiList size={14} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9AA1B0]">
                  Total Requests
                </p>

                <p className="mt-0.5 text-[19px] font-extrabold leading-none tracking-[-0.03em] text-[#202437]">
                  {totalRequests}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    opacity-50
                  "
                  style={{
                    backgroundColor: CARD_COLOR,
                  }}
                />

                <span
                  className="relative h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: CARD_COLOR,
                  }}
                />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-wider text-[#7F8792]">
                Live activity
              </span>
            </div>
          </div>

          {/* Accent */}

          <div
            className="h-[2px] w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #6C63FF 50%, transparent 100%)",
              opacity: 0.35,
            }}
          />
        </div>
      )}

      {/* DIVIDER */}

      <div className="relative z-[20] mb-3 h-px w-full bg-[#EEF0F4]" />

      {/* =====================================================
          CONTENT
      ====================================================== */}

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
                  border
                  border-transparent
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

      {/* =====================================================
          FOOTER STATUS
      ====================================================== */}

      {!loading && (
        <div className="relative z-[20] mt-3 flex items-center gap-2 border-t border-[#F0F1F4] pt-3">
          <FiClock size={11} className="text-[#A0A6B2]" />

          <span className="text-[9px] font-medium text-[#9AA1B0]">
            Showing latest service activity
          </span>

          <FiActivity
            size={11}
            className="ml-auto text-indigo-400"
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
          background:
            "linear-gradient(90deg, #6C63FF 0%, #8B5CF6 100%)",
        }}
      />
    </div>
  );
};

export default ChartCard2;
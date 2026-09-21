import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiList,
  FiActivity,
  FiClock,
} from "react-icons/fi";

const ChartCard2 = ({
  children,
  title,
  loading,
  mode,
  data,
}) => {
  const totalRequests = Array.isArray(data) ? data.length : 0;

  const skeletonBase =
    mode === "dark" ? "#DDE9E5" : "#E2E8F0";

  const skeletonHighlight = "#FFFFFF";

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[18px]
        border
        border-[#E2E8F0]
        bg-white
        shadow-[0_4px_18px_rgba(15,23,42,0.04)]
        transition-all
        duration-300
        hover:border-accent
        hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        {loading ? (
          <div className="flex items-center gap-3">
            <Skeleton
              width={44}
              height={44}
              borderRadius={12}
              baseColor={skeletonBase}
              highlightColor={skeletonHighlight}
            />

            <div>
              <Skeleton
                width={150}
                height={13}
                baseColor={skeletonBase}
                highlightColor={skeletonHighlight}
              />

              <div className="mt-1">
                <Skeleton
                  width={95}
                  height={9}
                  baseColor={skeletonBase}
                  highlightColor={skeletonHighlight}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* Icon */}

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-accent
                text-primary
                transition-all
                duration-300
                group-hover:bg-primary
                group-hover:text-white
              "
            >
              <FiList size={18} />
            </div>

            {/* Title */}

            <div>
              <div className="flex items-center gap-2">
                <h3
                  className="
                    text-[15px]
                    font-extrabold
                    tracking-[-0.02em]
                    text-primary
                  "
                >
                  {title}
                </h3>
              </div>

              <p className="mt-1 text-[10px] font-medium text-secondary">
                Latest service requests
              </p>
            </div>
          </div>
        )}

        {/* View All */}

        {!loading && (
          <Link
            to="/services/servicerequests"
            className="
              inline-flex
              w-fit
              items-center
              gap-1.5
              rounded-lg
              border
              border-accent
              bg-background
              px-3
              py-2
              text-[10px]
              font-bold
              text-secondary
              transition-all
              duration-200
              hover:border-secondary
              hover:bg-accent
              hover:text-primary
            "
          >
            View All

            <FiArrowUpRight
              size={13}
              className="
                transition-transform
                duration-200
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
            />
          </Link>
        )}
      </div>

      {/* =====================================================
          REQUEST SUMMARY
      ===================================================== */}

      {!loading && (
        <div
          className="
            mx-5
            mb-4
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-[#E2E8F0]
            bg-background
            px-4
            py-3
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-accent
                text-primary
              "
            >
              <FiActivity size={14} />
            </div>

            <div>
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.1em]
                  text-secondary
                "
              >
                Total Requests
              </p>

              <p
                className="
                  mt-0.5
                  text-lg
                  font-extrabold
                  leading-none
                  text-primary
                "
              >
                {totalRequests}
              </p>
            </div>
          </div>

          <span
            className="
              rounded-full
              border
              border-accent
              bg-accent
              px-2.5
              py-1
              text-[9px]
              font-bold
              text-primary
            "
          >
            Recent
          </span>
        </div>
      )}

      {/* =====================================================
          DIVIDER
      ===================================================== */}

      <div className="mx-5 h-px bg-[#E2E8F0]" />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="min-h-[300px] px-5 py-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <Skeleton
                  width={38}
                  height={38}
                  borderRadius={10}
                  baseColor={skeletonBase}
                  highlightColor={skeletonHighlight}
                />

                <div className="flex-1">
                  <Skeleton
                    width="55%"
                    height={10}
                    baseColor={skeletonBase}
                    highlightColor={skeletonHighlight}
                  />

                  <div className="mt-1.5">
                    <Skeleton
                      width="35%"
                      height={8}
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

      {/* =====================================================
          FOOTER
      ===================================================== */}

      {!loading && (
        <div
          className="
            mx-5
            mb-3
            flex
            items-center
            justify-between
            border-t
            border-[#E2E8F0]
            pt-3
          "
        >
          <div className="flex items-center gap-2">
            <FiClock
              size={13}
              className="text-secondary"
            />

            <span className="text-[9px] font-medium text-secondary">
              Recent service requests
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <FiActivity
              size={12}
              className="text-accent"
            />

            <span className="text-[9px] font-semibold text-secondary">
              Live
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          BOTTOM ACCENT
      ===================================================== */}

      <div className="mx-5 h-[2px] overflow-hidden rounded-full bg-background">
        <div className="h-full w-full rounded-full bg-secondary" />
      </div>

      <div className="h-3" />
    </div>
  );
};

export default ChartCard2;
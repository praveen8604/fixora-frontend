import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiActivity,
  FiBarChart2,
} from "react-icons/fi";

const ChartCard = ({
  children,
  title,
  loading,
  mode,
}) => {
  const skeletonBase =
    mode === "dark" ? "#DDE9E5" : "#E8EEEB";

  const skeletonHighlight = "#FFFFFF";

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[18px]
        border
        border-[#E8EEEB]
        bg-white
        shadow-[0_4px_18px_rgba(10,48,36,0.04)]
        transition-all
        duration-300
        hover:border-accent
        hover:shadow-[0_12px_30px_rgba(10,48,36,0.08)]
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
                width={140}
                height={13}
                baseColor={skeletonBase}
                highlightColor={skeletonHighlight}
              />

              <div className="mt-1">
                <Skeleton
                  width={100}
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
              <FiBarChart2 size={18} />
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
                Service performance overview
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
          INFO BAR
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
            border-[#E8EEEB]
            bg-background
            px-4
            py-3
          "
        >
          <div className="flex items-center gap-2">
            <FiActivity
              size={14}
              className="text-secondary"
            />

            <span className="text-[10px] font-bold text-primary">
              Service requests
            </span>
          </div>

          <span className="text-[9px] font-medium text-secondary">
            Updated
          </span>
        </div>
      )}

      {/* =====================================================
          DIVIDER
      ===================================================== */}

      <div className="mx-5 h-px bg-[#E8EEEB]" />

      {/* =====================================================
          CHART AREA
      ===================================================== */}

      <div className="min-h-[300px] px-5 py-5">
        {loading ? (
          <div className="space-y-4">
            <Skeleton
              height={12}
              width="35%"
              baseColor={skeletonBase}
              highlightColor={skeletonHighlight}
            />

            <Skeleton
              height={250}
              width="100%"
              borderRadius={12}
              baseColor={skeletonBase}
              highlightColor={skeletonHighlight}
            />
          </div>
        ) : (
          children
        )}
      </div>

      {/* =====================================================
          BOTTOM ACCENT
      ===================================================== */}

      <div className="mx-5 h-[2px] overflow-hidden rounded-full bg-background">
        <div className="h-full w-full rounded-full bg-secondary" />
      </div>

      {/* Bottom spacing */}

      <div className="h-3" />
    </div>
  );
};

export default ChartCard;
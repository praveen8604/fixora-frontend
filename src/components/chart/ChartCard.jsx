// import React from "react";
// import Skeleton from "react-loading-skeleton";
// import { Link } from "react-router-dom";
// import {
//   FiArrowUpRight,
//   FiActivity,
//   FiBarChart2,
// } from "react-icons/fi";

// const PRIMARY = "#AD8B73";
// const SECONDARY = "#CEAB93";
// const SOFT = "#E3CAA5";
// const CREAM = "#FFFBE9";

// const ChartCard = ({ children, title, loading, mode }) => {
//   const skeletonBase = mode === "dark" ? "#E3CAA5" : "#F1E7DC";
//   const skeletonHighlight = mode === "dark" ? "#FFFBE9" : "#FFFFFF";

//   return (
//     <div
//       className="
//         group
//         relative
//         isolate
//         min-w-0
//         w-full
//         overflow-hidden
//         rounded-[24px]
//         border
//         border-[#E8DED3]
//         bg-white
//         p-5
//         shadow-[0_6px_24px_rgba(90,65,45,0.05)]
//         transition-all
//         duration-300
//         hover:-translate-y-[2px]
//         hover:border-[#CEAB93]
//         hover:shadow-[0_18px_40px_rgba(90,65,45,0.10)]
//       "
//     >
//       {/* Soft background decoration */}

//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           -right-20
//           -top-20
//           h-44
//           w-44
//           rounded-full
//           opacity-30
//           transition-transform
//           duration-700
//           group-hover:scale-125
//         "
//         style={{
//           backgroundColor: CREAM,
//         }}
//       />

//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute
//           -bottom-16
//           left-[35%]
//           h-32
//           w-32
//           rounded-full
//           opacity-20
//           transition-transform
//           duration-700
//           group-hover:scale-125
//         "
//         style={{
//           backgroundColor: SOFT,
//         }}
//       />

//       {/* HEADER */}

//       <div
//         className="
//           relative
//           z-[20]
//           mb-5
//           flex
//           min-h-[48px]
//           w-full
//           items-center
//           justify-between
//           gap-4
//         "
//       >
//         {loading ? (
//           <div className="flex items-center gap-3">
//             <Skeleton
//               width={44}
//               height={44}
//               borderRadius={14}
//               baseColor={skeletonBase}
//               highlightColor={skeletonHighlight}
//             />

//             <div>
//               <Skeleton
//                 width={150}
//                 height={16}
//                 baseColor={skeletonBase}
//                 highlightColor={skeletonHighlight}
//               />

//               <div className="mt-1">
//                 <Skeleton
//                   width={100}
//                   height={10}
//                   baseColor={skeletonBase}
//                   highlightColor={skeletonHighlight}
//                 />
//               </div>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* LEFT */}

//             <div className="relative z-[30] flex min-w-0 items-center gap-3">
//               <div
//                 className="
//                   relative
//                   flex
//                   h-11
//                   w-11
//                   shrink-0
//                   items-center
//                   justify-center
//                   overflow-hidden
//                   rounded-[14px]
//                   text-white
//                   shadow-[0_8px_18px_rgba(173,139,115,0.25)]
//                   transition-transform
//                   duration-300
//                   group-hover:scale-105
//                 "
//                 style={{
//                   backgroundColor: PRIMARY,
//                 }}
//               >
//                 <div
//                   className="
//                     pointer-events-none
//                     absolute
//                     -right-3
//                     -top-3
//                     h-8
//                     w-8
//                     rounded-full
//                     bg-white/15
//                   "
//                 />

//                 <FiBarChart2
//                   size={20}
//                   strokeWidth={2.3}
//                   className="relative z-10"
//                 />
//               </div>

//               <div className="min-w-0">
//                 <h3
//                   className="
//                     truncate
//                     text-[15px]
//                     font-extrabold
//                     tracking-[-0.02em]
//                     text-[#463B34]
//                   "
//                 >
//                   {title}
//                 </h3>

//                 <p className="mt-1 text-[10px] font-medium text-[#9B897B]">
//                   Service activity
//                 </p>
//               </div>
//             </div>

//             {/* VIEW ALL */}

//             <div className="relative z-[100] shrink-0">
//               <Link
//                 to="/services/servicerequests"
//                 onClick={(e) => e.stopPropagation()}
//                 className="
//                   group/button
//                   inline-flex
//                   min-h-[34px]
//                   items-center
//                   justify-center
//                   gap-1.5
//                   whitespace-nowrap
//                   rounded-full
//                   border
//                   border-[#E3CAA5]
//                   bg-[#FFFBE9]
//                   px-3.5
//                   py-1.5
//                   text-[10px]
//                   font-bold
//                   no-underline
//                   text-[#8F6D55]
//                   transition-all
//                   duration-200
//                   hover:border-[#CEAB93]
//                   hover:bg-[#E3CAA5]
//                   hover:text-[#5F4A3B]
//                   focus:outline-none
//                 "
//               >
//                 <span>View All</span>

//                 <FiArrowUpRight
//                   size={13}
//                   strokeWidth={2.5}
//                   className="
//                     transition-transform
//                     duration-200
//                     group-hover/button:translate-x-0.5
//                     group-hover/button:-translate-y-0.5
//                   "
//                 />
//               </Link>
//             </div>
//           </>
//         )}
//       </div>

//       {/* SMALL INFO BAR */}

//       {!loading && (
//         <div
//           className="
//             relative
//             z-[20]
//             mb-4
//             flex
//             items-center
//             justify-between
//             rounded-[14px]
//             border
//             border-[#EFE5DB]
//             bg-[#FFFBE9]
//             px-3.5
//             py-2.5
//           "
//         >
//           <div className="flex items-center gap-2.5">
//             <div
//               className="
//                 flex
//                 h-7
//                 w-7
//                 items-center
//                 justify-center
//                 rounded-lg
//                 bg-white
//                 text-[#AD8B73]
//                 shadow-sm
//               "
//             >
//               <FiActivity size={13} />
//             </div>

//             <p className="text-[10px] font-medium text-[#79695D]">
//               Service requests
//             </p>
//           </div>

//           <span
//             className="
//               rounded-full
//               px-2.5
//               py-1
//               text-[8px]
//               font-bold
//               uppercase
//               tracking-wider
//             "
//             style={{
//               backgroundColor: "#E3CAA5",
//               color: "#6D5544",
//             }}
//           >
//             Updated
//           </span>
//         </div>
//       )}

//       {/* DIVIDER */}

//       <div className="relative z-[20] mb-3 h-px w-full bg-[#EFE9E3]" />

//       {/* CHART */}

//       <div className="relative z-[20] min-h-[300px] w-full">
//         {loading ? (
//           <div className="space-y-4 py-5">
//             {Array.from({ length: 6 }).map((_, index) => (
//               <Skeleton
//                 key={index}
//                 height={18}
//                 borderRadius={8}
//                 baseColor={skeletonBase}
//                 highlightColor={skeletonHighlight}
//               />
//             ))}
//           </div>
//         ) : (
//           children
//         )}
//       </div>

//       {/* BOTTOM ACCENT */}

//       <div
//         className="
//           pointer-events-none
//           absolute
//           bottom-0
//           left-6
//           right-6
//           h-[3px]
//           origin-left
//           scale-x-0
//           rounded-full
//           transition-transform
//           duration-500
//           group-hover:scale-x-100
//         "
//         style={{
//           background: `linear-gradient(90deg, ${PRIMARY} 0%, ${SECONDARY} 100%)`,
//         }}
//       />
//     </div>
//   );
// };

// export default ChartCard;



















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
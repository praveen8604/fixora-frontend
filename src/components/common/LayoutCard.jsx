import React from "react";

const LayoutCard = ({
  heading,
  gridColCountxl,
  gridColCountmd,
  gridColCount,
  useFlex,
  children,
}) => {
  return (
    <div
      className="
        mt-2
        mb-2
        overflow-hidden
        rounded-[24px]
        border
        border-[#E4E8ED]
        bg-white
        p-6
        shadow-[0_3px_12px_rgba(30,40,55,0.035)]
      "
    >
      <div className="mb-4 text-sm font-extrabold tracking-[-0.02em] text-[#20242B]">
        {heading}
      </div>
      <div
        className={`${
          useFlex
            ? "sm:flex justify-between"
            : `grid grid-cols-${
                gridColCount ? gridColCount : "4"
              } md:grid-cols-${gridColCountmd} xl:grid-cols-${gridColCountxl}`
        } gap-3`}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutCard;

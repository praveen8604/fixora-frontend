import { Card, CardBody } from "@windmill/react-ui";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";

const CardItemTwo = ({
  mode,
  title,
  Icon,
  className = "",
  price = 0,
  cash = 0,
  card = 0,
  credit = 0,
  loading = false,
  title2 = "",
  cardBg = "",
  cardTextColor = "",
}) => {
  const { t } = useTranslation();

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return 0;
    return Math.round(value);
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="h-[108px] w-full overflow-hidden rounded-2xl">
        <Skeleton
          height="100%"
          baseColor={mode === "dark" ? "#1f2937" : "#EEF1F5"}
          highlightColor={mode === "dark" ? "#374151" : "#FFFFFF"}
        />
      </div>
    );
  }

  /* =========================
     ORDER CARD
  ========================= */

  if (title === "Today Order" || title === "Yesterday Order") {
    return (
      <Card
        className={`
          group
          relative
          flex
          h-full
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-[#E7EAF0]
          bg-white
          shadow-[0_4px_15px_rgba(30,40,55,0.04)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_14px_30px_rgba(30,40,55,0.08)]
          ${cardBg}
        `}
      >
        <div
          className="
            pointer-events-none
            absolute
            right-[-30px]
            top-[-30px]
            z-0
            h-28
            w-28
            rounded-full
            bg-[#F4F5FA]
            opacity-0
            transition-all
            duration-500
            group-hover:scale-[1.8]
            group-hover:opacity-100
          "
        />

        <CardBody
          className={`
            relative
            z-10
            flex
            w-full
            items-center
            justify-between
            p-5
            ${className}
          `}
        >
          <div className="min-w-0">
            <p className="mb-2 text-sm font-medium text-[#737C8C]">
              {title2 ? t(title2) : "Order"}
            </p>

            <p className="text-2xl font-bold leading-none text-[#252A34]">
              {formatNumber(price)}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-[#8992A1]">
              <span>Cash: {formatNumber(cash)}</span>

              <span>Card: {formatNumber(card)}</span>

              <span>Credit: {formatNumber(credit)}</span>
            </div>
          </div>

          {/* ICON */}

          <div
            className="
              relative
              z-30
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-[16px]
              border
              border-[#DDE2FF]
              bg-[#F1F3FF]
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:bg-[#5961D8]
            "
          >
            {Icon && (
              <Icon
                style={{
                  color: "#5961D8",
                  width: "22px",
                  height: "22px",
                  display: "block",
                  flexShrink: 0,
                }}
                className="group-hover:!text-white"
              />
            )}
          </div>
        </CardBody>
      </Card>
    );
  }

  /* =========================
     NORMAL CARD
  ========================= */

  return (
    <Card
      className="
        group
        relative
        flex
        h-[108px]
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-[#E7EAF0]
        bg-white
        shadow-[0_4px_15px_rgba(30,40,55,0.04)]
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-[#DDE2EA]
        hover:shadow-[0_14px_30px_rgba(30,40,55,0.08)]
      "
    >
      {/* Decorative background */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-35px]
          top-[-35px]
          z-0
          h-32
          w-32
          rounded-full
          bg-[#F4F5FA]
          opacity-0
          transition-all
          duration-500
          group-hover:scale-[1.8]
          group-hover:opacity-100
        "
      />

      <CardBody className="relative z-10 flex w-full items-center p-5">
        {/* =========================
            ICON
        ========================= */}

        <div
          className="
            relative
            z-30
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-[16px]
            border
            border-[#DDE2FF]
            bg-[#F1F3FF]
            shadow-[0_5px_15px_rgba(89,97,216,0.08)]
            transition-all
            duration-300
            ease-out
            group-hover:scale-110
            group-hover:border-[#5961D8]
            group-hover:bg-[#5961D8]
            group-hover:shadow-[0_8px_20px_rgba(89,97,216,0.22)]
          "
        >
          {Icon && (
            <Icon
              style={{
                color: "#5961D8",
                width: "22px",
                height: "22px",
                display: "block",
                flexShrink: 0,
              }}
              className="
                transition-all
                duration-300
                group-hover:!text-white
              "
            />
          )}
        </div>

        {/* =========================
            CONTENT
        ========================= */}

        <div className="relative z-20 ml-4 min-w-0">
          <h6
            className="
              mb-1
              truncate
              text-sm
              font-medium
              text-[#7A8392]
              transition-colors
              duration-300
              group-hover:text-[#5961D8]
            "
          >
            {title2 ? t(title2) : "Total"}
          </h6>

          <p
            className="
              text-2xl
              font-bold
              leading-none
              text-[#252A34]
            "
          >
            {formatNumber(price)}
          </p>
        </div>

        {/* Bottom accent */}

        <div
          className="
            absolute
            bottom-0
            left-5
            z-20
            h-[3px]
            w-0
            rounded-full
            bg-[#5961D8]
            transition-all
            duration-300
            group-hover:w-10
          "
        />
      </CardBody>
    </Card>
  );
};

export default CardItemTwo;

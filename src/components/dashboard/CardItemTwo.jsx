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
    if (value === null || value === undefined || isNaN(value)) {
      return 0;
    }

    return Math.round(value);
  };

  /* =========================================================
      LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className={`
          h-[108px]
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-[#E3CAA5]
          bg-white
          ${className}
        `}
      >
        <Skeleton
          height="100%"
          baseColor="#FFFBE9"
          highlightColor="#FFFFFF"
        />
      </div>
    );
  }

  /* =========================================================
      TODAY / YESTERDAY ORDER CARD
  ========================================================= */

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
          border-[#E3CAA5]
          bg-white
          shadow-[0_5px_18px_rgba(92,70,54,0.05)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-[#CEAB93]
          hover:shadow-[0_15px_32px_rgba(92,70,54,0.12)]
          ${cardBg}
        `}
      >
        {/* Subtle background detail */}

        <div
          className="
            pointer-events-none
            absolute
            -right-8
            -top-8
            z-0
            h-28
            w-28
            rounded-full
            bg-[#FFFBE9]
            opacity-0
            transition-all
            duration-500
            group-hover:scale-150
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
          {/* CONTENT */}

          <div className="min-w-0">

            <p
              className="
                mb-2
                text-sm
                font-semibold
                text-[#6B503E]
                transition-colors
                duration-300
                group-hover:text-[#AD8B73]
              "
            >
              {title2 ? t(title2) : "Order"}
            </p>

            <p
              className="
                text-2xl
                font-extrabold
                leading-none
                tracking-[-0.03em]
                text-[#5C4636]
              "
            >
              {formatNumber(price)}
            </p>

            <div
              className="
                mt-3
                flex
                flex-wrap
                gap-x-3
                gap-y-1
                text-[11px]
                font-medium
                text-[#9A806B]
              "
            >
              <span>
                Cash:{" "}
                <span className="text-[#AD8B73]">
                  {formatNumber(cash)}
                </span>
              </span>

              <span>
                Card:{" "}
                <span className="text-[#AD8B73]">
                  {formatNumber(card)}
                </span>
              </span>

              <span>
                Credit:{" "}
                <span className="text-[#AD8B73]">
                  {formatNumber(credit)}
                </span>
              </span>
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
              border-[#E3CAA5]
              bg-[#FFFBE9]
              text-[#AD8B73]
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:border-[#AD8B73]
              group-hover:bg-[#AD8B73]
              group-hover:text-white
            "
          >
            {Icon && (
              <Icon
                style={{
                  width: "22px",
                  height: "22px",
                  display: "block",
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        </CardBody>

        {/* Bottom accent */}

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
      </Card>
    );
  }

  /* =========================================================
      NORMAL CARD
  ========================================================= */

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
        border-[#E3CAA5]
        bg-white
        shadow-[0_5px_18px_rgba(92,70,54,0.05)]
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-[#CEAB93]
        hover:shadow-[0_15px_32px_rgba(92,70,54,0.12)]
      "
    >
      {/* Subtle background detail */}

      <div
        className="
          pointer-events-none
          absolute
          -right-8
          -top-8
          z-0
          h-28
          w-28
          rounded-full
          bg-[#FFFBE9]
          opacity-0
          transition-all
          duration-500
          group-hover:scale-150
          group-hover:opacity-100
        "
      />

      <CardBody className="relative z-10 flex w-full items-center p-5">

        {/* =====================================================
            ICON
        ====================================================== */}

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
            border-[#E3CAA5]
            bg-[#FFFBE9]
            text-[#AD8B73]
            transition-all
            duration-300
            ease-out
            group-hover:scale-105
            group-hover:border-[#AD8B73]
            group-hover:bg-[#AD8B73]
            group-hover:text-white
          "
        >
          {Icon && (
            <Icon
              style={{
                width: "22px",
                height: "22px",
                display: "block",
                flexShrink: 0,
              }}
            />
          )}
        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="relative z-20 ml-4 min-w-0">

          <h6
            className="
              mb-1
              truncate
              text-sm
              font-semibold
              text-[#6B503E]
              transition-colors
              duration-300
              group-hover:text-[#AD8B73]
            "
          >
            {title2 ? t(title2) : "Total"}
          </h6>

          <p
            className="
              text-2xl
              font-extrabold
              leading-none
              tracking-[-0.03em]
              text-[#5C4636]
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
            right-5
            z-20
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

export default CardItemTwo;
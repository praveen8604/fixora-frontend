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
  accent = "#50589C",
  accentSoft = "#EEF0FA",
}) => {
  const { t } = useTranslation();

  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0";
    return Math.round(value).toLocaleString();
  };

  if (loading) {
    return (
      <Skeleton
        count={2}
        height={36}
        className="bg-gray-200"
        baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
        highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
      />
    );
  }

  if (title === "Today Order" || title === "Yesterday Order") {
    return (
      <Card className={`flex justify-center h-full`}>
        <CardBody
          className={`border border-gray-200 justify-between dark:border-gray-800 w-full p-6 rounded-lg flex items-center ${className}`}
        >
          <div className="flex flex-col justify-center text-left w-1/2">
            <p className="mb-2 text-base font-medium text-gray-50 dark:text-gray-100">
              {title2 ? t(title2) : <Skeleton count={1} height={20} />}
            </p>
            <p className="text-2xl font-bold leading-none text-gray-50 dark:text-gray-50">
              {formatNumber(price)}
            </p>
            <div className="flex text-xs font-normal text-gray-50 dark:text-gray-100">
              <div className="px-1 mt-3">
                {t("Cash")}: {formatNumber(cash)}
              </div>
              <div className="px-1 mt-3">
                {t("Card")}: {formatNumber(card)}
              </div>
              <div className="px-1 mt-3">
                {t("Credit")}: {formatNumber(credit)}
              </div>
            </div>
          </div>
          <div className="w-1/2 flex justify-center">
            <div className="text-5xl text-gray-500 dark:text-gray-200">
              <Icon />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="kpi-shine-card">
      <Card className="kpi-shine-inner flex w-full bg-white border-0 shadow-none">
        <CardBody className="relative flex flex-col justify-between w-full px-5 py-5">
          <span
            className="absolute left-0 top-0 h-full w-[3px]"
            style={{ background: accent }}
          />
          <div className="flex items-start justify-between gap-3 pl-1">
            <p className="text-[13px] text-[#64748B] leading-snug">
              {title2 ? t(title2) : <Skeleton count={1} height={20} />}
            </p>
            <div
              className="flex items-center justify-center h-8 w-8 rounded-full shrink-0 dash-icon"
              style={{ background: accentSoft, color: accent }}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
          </div>
          <p
            className="mt-8 text-[28px] leading-none font-semibold tracking-tight tabular-nums"
            style={{ color: accent }}
          >
            {formatNumber(price)}
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default CardItemTwo;
